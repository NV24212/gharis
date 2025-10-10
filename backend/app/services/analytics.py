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
            "overview": RunReportRequest(
                property=property_id,
                metrics=[
                    Metric(name="activeUsers"),
                    Metric(name="newUsers"),
                    Metric(name="sessions"),
                    Metric(name="bounceRate"),
                    Metric(name="averageSessionDuration"),
                    Metric(name="screenPageViews")
                ],
                date_ranges=date_range,
            ),
            "acquisition": RunReportRequest(
                property=property_id,
                dimensions=[Dimension(name="sessionSourceMedium")],
                metrics=[Metric(name="sessions"), Metric(name="newUsers")],
                date_ranges=date_range,
                limit=10
            ),
            "technology_by_device": RunReportRequest(
                property=property_id,
                dimensions=[Dimension(name="deviceCategory")],
                metrics=[Metric(name="activeUsers")],
                date_ranges=date_range,
            ),
            "content_by_page": RunReportRequest(
                property=property_id,
                dimensions=[Dimension(name="unifiedScreenName")],
                metrics=[Metric(name="screenPageViews",), Metric(name="sessions")],
                date_ranges=date_range,
                limit=10
            ),
        }

        # Define realtime request separately
        realtime_request = RunRealtimeReportRequest(
            property=property_id,
            metrics=[Metric(name="activeUsers")]
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
            "acquisition": {"bySourceMedium": []},
            "technology": {"byDevice": []},
            "content": {"byPage": []},
        }

        # Process Overview from historical data
        overview_res = results.get("overview")
        if overview_res and overview_res.totals:
            for i, header in enumerate(overview_res.metric_headers):
                value = overview_res.totals[0].metric_values[i].value
                # Format duration nicely
                if "Duration" in header.name:
                     value = f"{float(value):.2f}s"
                final_report["overview"][header.name] = value

        # Override activeUsers with real-time data if available
        realtime_res = results.get("realtime")
        if realtime_res and realtime_res.rows:
            # Realtime report returns the value in the first row/metric
            final_report["overview"]["activeUsers"] = realtime_res.rows[0].metric_values[0].value

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
        final_report["acquisition"]["bySourceMedium"] = process_dimensional_report(results.get("acquisition"), "sessionSourceMedium", ["sessions", "newUsers"])
        final_report["technology"]["byDevice"] = process_dimensional_report(results.get("technology_by_device"), "deviceCategory", ["activeUsers"])
        final_report["content"]["byPage"] = process_dimensional_report(results.get("content_by_page"), "unifiedScreenName", ["screenPageViews", "sessions"])

        return final_report

    except Exception as e:
        print(f"Error fetching Google Analytics data: {e}")
        return {"error": str(e)}