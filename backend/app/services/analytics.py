import os
from google.analytics.data_v1beta import BetaAnalyticsDataClient
from google.analytics.data_v1beta.types import RunReportRequest, Dimension, Metric, DateRange, RunRealtimeReportRequest
from app.core.config import settings
from concurrent.futures import ThreadPoolExecutor

def get_analytics_report():
    """
    Authenticates with Google Analytics and fetches a comprehensive set of reports.
    """
    try:
        if not all([settings.GA4_PROJECT_ID, settings.GA4_CLIENT_EMAIL, settings.GA4_PRIVATE_KEY]):
            return {"error": "Google Analytics is not fully configured."}

        creds_json = {
            "type": "service_account",
            "project_id": settings.GA4_PROJECT_ID,
            "private_key": settings.GA4_PRIVATE_KEY.replace('\\n', '\n'),
            "client_email": settings.GA4_CLIENT_EMAIL,
            "token_uri": "https://oauth2.googleapis.com/token",
        }

        client = BetaAnalyticsDataClient.from_service_account_info(creds_json)
        property_id = f"properties/{settings.GA_PROPERTY_ID}"
        date_range = [DateRange(start_date="28daysAgo", end_date="today")]

        # Define all report requests
        requests = {
            "users_per_day": RunReportRequest(
                property=property_id,
                dimensions=[Dimension(name="date")],
                metrics=[Metric(name="activeUsers")],
                date_ranges=date_range,
                order_bys=[{"dimension": {"dimension_name": "date"}, "desc": False}]
            ),
            "users_per_week": RunReportRequest(
                property=property_id,
                dimensions=[Dimension(name="week")],
                metrics=[Metric(name="activeUsers")],
                date_ranges=date_range,
                 order_bys=[{"dimension": {"dimension_name": "week"}, "desc": False}]
            ),
            "content_by_page": RunReportRequest(
                property=property_id,
                dimensions=[Dimension(name="unifiedScreenName")],
                metrics=[Metric(name="screenPageViews"), Metric(name="sessions")],
                date_ranges=date_range,
                limit=50 # Return more pages
            ),
        }

        # Define realtime request separately
        realtime_request = RunRealtimeReportRequest(
            property=property_id,
            metrics=[Metric(name="activeUsers"), Metric(name="screenPageViews")]
        )

        # Run reports in parallel
        with ThreadPoolExecutor() as executor:
            # Historical reports
            future_to_report = {executor.submit(client.run_report, request): name for name, request in requests.items()}
            # Realtime report
            future_to_report[executor.submit(client.run_realtime_report, realtime_request)] = "realtime"

            results = {report_name: future.result() for future, report_name in future_to_report.items()}

        # Process results into a single structured report
        final_report = {
            "overview": {},
            "trends": {"usersPerDay": [], "usersPerWeek": []},
            "content": {"byPage": []},
        }

        # Process Realtime Overview Data
        realtime_res = results.get("realtime")
        if realtime_res and realtime_res.rows:
            for i, header in enumerate(realtime_res.metric_headers):
                metric_name = header.name
                # The realtime API uses 'screenViews', but the historical API (and thus frontend) uses 'screenPageViews'
                if metric_name == "screenViews":
                    metric_name = "screenPageViews"
                value = realtime_res.rows[0].metric_values[i].value
                final_report["overview"][metric_name] = value

        # Helper to process dimensional reports
        def process_dimensional_report(response, key_dim_name, value_metric_names):
            data = []
            if not response or not response.rows:
                return data
            for row in response.rows:
                item = {key_dim_name: row.dimension_values[0].value}
                for i, metric_header in enumerate(response.metric_headers):
                    item[metric_header.name] = row.metric_values[i].value
                data.append(item)
            return data

        # Process dimensional reports
        final_report["content"]["byPage"] = process_dimensional_report(results.get("content_by_page"), "unifiedScreenName", ["screenPageViews", "sessions"])
        final_report["trends"]["usersPerDay"] = process_dimensional_report(results.get("users_per_day"), "date", ["activeUsers"])
        final_report["trends"]["usersPerWeek"] = process_dimensional_report(results.get("users_per_week"), "week", ["activeUsers"])

        return final_report

    except Exception as e:
        print(f"Error fetching Google Analytics data: {e}")
        return {"error": str(e)}