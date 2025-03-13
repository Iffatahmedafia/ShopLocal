from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed
from django.contrib.auth import get_user_model
from django.conf import settings
import jwt

CustomUser = get_user_model()

class CookieJWTAuthentication(BaseAuthentication):
    def authenticate(self, request):
        token = request.COOKIES.get("accessToken")  # Read token from cookies
        if not token:
            return None  # No token, return None

        try:
            payload = jwt.decode(token, "ghfgfgdfd", algorithms=["HS256"])  # Decode token
            user = CustomUser.objects.get(id=payload["user_id"])  # Get user from DB
        except (jwt.ExpiredSignatureError, jwt.DecodeError, User.DoesNotExist):
            raise AuthenticationFailed("Invalid or expired token")

        return (user, None)  # Return authenticated user
