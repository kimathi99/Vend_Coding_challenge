from django.urls import path

from .views import ChangePasswordView,ObtainTokenPairWithEmailView, RefreshTokenView,LogoutView,RegisterView,ResetPasswordView,ForgotPasswordView



urlpatterns = [
    path('token/', ObtainTokenPairWithEmailView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', RefreshTokenView.as_view(), name='token_refresh'),
    path('account/signup/', RegisterView.as_view(), name='account_signup'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('forgot_password/', ForgotPasswordView.as_view(), name='forgot_password'),
    path('reset_password/', ResetPasswordView.as_view(), name='reset_password'),
    path('change_password/', ChangePasswordView.as_view(),name='change_password'),
 
     
]