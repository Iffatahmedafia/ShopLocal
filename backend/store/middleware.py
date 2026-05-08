import logging
import os
import time
import requests


logger = logging.getLogger(__name__)


class InsightOpsMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response
        self.insightops_url = os.getenv("INSIGHTOPS_URL", "").rstrip("/")
        self.api_key = os.getenv("INSIGHTOPS_API_KEY", "")
        self.enabled = os.getenv("INSIGHTOPS_ENABLED", "False") == "True"

    def __call__(self, request):
        start_time = time.time()

        response = self.get_response(request)

        duration_ms = int((time.time() - start_time) * 1000)
        user = getattr(request, "user", None)
        user_id = getattr(user, "id", None) if getattr(user, "is_authenticated", False) else "anonymous"

        log_data = {
            "method": request.method,
            "path": request.path,
            "status_code": response.status_code,
            "duration_ms": duration_ms,
            "user_id": user_id,
        }

        if response.status_code >= 500:
            logger.error("request completed %s", log_data)
        elif response.status_code >= 400:
            logger.warning("request completed %s", log_data)
        else:
            logger.info("request completed %s", log_data)

        if self.enabled and self.insightops_url and self.api_key:
            try:
                requests.post(
                        f"{self.insightops_url}/api/ingest/logs",
                        json={
                            "level": "info" if response.status_code < 400 else "error",
                            "message": f"{request.method} {request.path} returned {response.status_code}",
                            "route": request.path,
                            "method": request.method,
                            "statusCode": response.status_code,
                            "durationMs": duration_ms,
                        },
                        headers={
                            "x-api-key": self.api_key
                        },
                        timeout=2,
                    )

            except Exception as e:
                logger.warning("InsightOps logging failed: %s", e)

        return response
