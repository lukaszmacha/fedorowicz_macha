# Choose base Python image (e.g. 3.11)
FROM python:3.11-slim

# Set working directory in container
WORKDIR /app

# Copy requirements.txt file
COPY requirements.txt ./

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy all local folder contents to /app in container
COPY . .

# Open port (optional; helps understand which port is exposed)
EXPOSE 8000

# Default command (entrypoint) - for running server in dev mode
CMD ["uvicorn", "backend.asgi:application", "--host", "0.0.0.0", "--port", "8000", "--reload"]
