import os
import json
from google.analytics.data_v1beta import BetaAnalyticsDataClient
from google.analytics.data_v1beta.types import (
    RunReportRequest,
    Dimension,
    Metric,
    DateRange,
)
from app.core.config import settings

def get_analytics_report():
    """
    Authenticates with Google Analytics and fetches a report of key metrics.
    """
    try:
        # Check if all required environment variables are set
        if not all([settings.GA4_PROJECT_ID, settings.GA4_CLIENT_EMAIL, settings.GA4_PRIVATE_KEY]):
            return {"error": "Google Analytics is not fully configured. Please set GA4_PROJECT_ID, GA4_CLIENT_EMAIL, and GA4_PRIVATE_KEY."}

        # Dynamically construct the credentials JSON
        creds_json = {
            "type": "service_account",
            "project_id": settings.GA4_PROJECT_ID,
            "private_key_id": None,  # This is not strictly required by the client library
            "private_key": settings.GA4_PRIVATE_KEY.replace('\\n', '\n'),
            "client_email": settings.GA4_CLIENT_EMAIL,
            "client_id": None,  # This is not strictly required by the client library
            "auth_uri": "https://accounts.google.com/o/oauth2/auth",
            "token_uri": "https://oauth2.googleapis.com/token",
            "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
            "client_x509_cert_url": f"https://www.googleapis.com/robot/v1/metadata/x509/{settings.GA4_CLIENT_EMAIL.replace('@', '%40')}"
        }

        client = BetaAnalyticsDataClient.from_service_account_info(creds_json)
        property_id = settings.GA_PROPERTY_ID

        # Define the request for the report
        request = RunReportRequest(
            property=f"properties/{property_id}",
            dimensions=[
                Dimension(name="country"),
                Dimension(name="unifiedScreenName")
            ],
            metrics=[
                Metric(name="activeUsers"),
                Metric(name="screenPageViews"),
                Metric(name="newUsers")
            ],
            date_ranges=[DateRange(start_date="28daysAgo", end_date="today")],
        )

        # Run the report
        response = client.run_report(request)

        # Process the response into a more friendly format
        report = {
            "totals": {},
            "by_country": [],
            "by_page": [],
        }

        # Extract totals
        if response.metric_headers and response.totals:
            for i, header in enumerate(response.metric_headers):
                report["totals"][header.name] = response.totals[0].metric_values[i].value

        # Extract data from rows
        country_data = {}
        page_data = {}

        for row in response.rows:
            country = row.dimension_values[0].value
            page = row.dimension_values[1].value
            active_users = int(row.metric_values[0].value)
            page_views = int(row.metric_values[1].value)

            # Aggregate by country
            if country not in country_data:
                country_data[country] = {"users": 0, "views": 0}
            country_data[country]["users"] += active_users
            country_data[country]["views"] += page_views

            # Aggregate by page
            if page not in page_data:
                page_data[page] = {"users": 0, "views": 0}
            page_data[page]["users"] += active_users
            page_data[page]["views"] += page_views

        report["by_country"] = [{"country": k, **v} for k, v in country_data.items()]
        report["by_page"] = [{"page": k, **v} for k, v in page_data.items()]

        return report

    except Exception as e:
        print(f"Error fetching Google Analytics data: {e}")
        # In a real app, you'd want more robust error handling/logging
        return {"error": str(e)}