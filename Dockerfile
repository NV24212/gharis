# Use an official Python runtime as a parent image
FROM python:3.11-slim

# Set the working directory in the container
WORKDIR /app

# Copy the dependencies file from the backend directory into the container
COPY backend/requirements.txt .

# Install any needed dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy all the content inside backend/app directly into the root of /app
COPY backend/app/ .

# Explicitly set the Python path so local imports resolve flawlessly
ENV PYTHONPATH=/app

# Expose the port the app runs on
EXPOSE 8001

# Run Uvicorn pointing directly to main:app in the working directory root
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8001"]
