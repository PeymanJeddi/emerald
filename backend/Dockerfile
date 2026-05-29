FROM python:3.12-slim

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    libpq-dev gcc \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

RUN mkdir -p /app/uploads

# Avoid CRLF issues on Windows hosts
RUN printf '%s\n' \
    '#!/bin/sh' \
    'set -e' \
    'echo "Running database migrations..."' \
    'alembic upgrade head' \
    'if [ "$RUN_SEED" = "true" ]; then' \
    '  echo "Running seed data..."' \
    '  python -m app.seed' \
    'fi' \
    'echo "Starting API server..."' \
    'exec uvicorn app.main:app --host 0.0.0.0 --port 8000' \
    > /entrypoint.sh && chmod +x /entrypoint.sh

EXPOSE 8000

ENTRYPOINT ["/entrypoint.sh"]
