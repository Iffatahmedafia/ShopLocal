from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed
from django.contrib.auth import get_user_model
from django.conf import settings
import jwt

CustomUser = get_user_model()

class CookieJWTAuthentication(BaseAuthentication):
    def authenticate(self, request):
        access_token = request.COOKIES.get("accessToken")
        if not access_token:
            return None  # Let other authentication classes try

        try:
            payload = jwt.decode(access_token, settings.SECRET_KEY, algorithms=["HS256"])
            user = CustomUser.objects.get(id=payload["user_id"])
            return (user, None)
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed("Token has expired")
        except jwt.InvalidTokenError:
            raise AuthenticationFailed("Invalid token")
        except CustomUser.DoesNotExist:
            raise AuthenticationFailed("User not found")
