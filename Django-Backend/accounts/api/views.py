
from datetime import datetime, timedelta
from django.utils import timezone
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .serializers import TokenObtainPairSerializer, TokenRefreshSerializer,ForgotPasswordSerializer,ResetPasswordSerializer,UserSerializer
from rest_framework.response import Response
from rest_framework import generics,status
from django.contrib.auth.tokens import default_token_generator
from django.utils.encoding import force_bytes ,force_str
from django.utils.http import urlsafe_base64_encode,urlsafe_base64_decode
from rest_framework.views import APIView
from  accounts.models import Account
from accounts.emails.emails import forgot_password_email,registrationemail,completeprofileemail,passwordresetsucessfulemail
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import update_session_auth_hash
from rest_framework.permissions import IsAuthenticated ,AllowAny
from .serializers import ChangePasswordSerializer
from django.contrib.auth.password_validation import validate_password, password_changed
from django.core.exceptions import ValidationError




class ObtainTokenPairWithEmailView(TokenObtainPairView):
    serializer_class = TokenObtainPairSerializer

 
class RefreshTokenView(TokenRefreshView):
    serializer_class = TokenRefreshSerializer




class RegisterView(generics.CreateAPIView):
    serializer_class = UserSerializer
    authentication_classes = []
    permission_classes = []
    
    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        email=user.email
     
        return Response({'sucess':"Your Account Created succesfully"})
        
        

class LogoutView(APIView):
    def post(self, request):
        response = Response()
        response.delete_cookie('access_token')
        response.data = {
            'message': 'successfully logged out'
        }
        return response




class ForgotPasswordView(generics.CreateAPIView):
    serializer_class =ForgotPasswordSerializer
    authentication_classes = []
    permission_classes = []

    def post(self, request, format=None):
        serializer = ForgotPasswordSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            try:
                user = Account.objects.get(email=email)
            except Account.DoesNotExist:
                return Response({'email': f' {email}  is either invalid or does  not exist.'}, status=status.HTTP_400_BAD_REQUEST)
            token_generator = default_token_generator
            uid = urlsafe_base64_encode(force_bytes(user.pk))
            token = token_generator.make_token(user) 
            reset_url = f'https://localhost/resetPassword/{uid}/{token}/'
            print('SENDING EMAILS ')           
            forgot_password_email([email],reset_url)

            return Response({'email': f'An email password has been sent  to {email}'}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
 



class ResetPasswordView(APIView):
    authentication_classes = [] 
    permission_classes = []  

    def post(self, request, format=None):
        serializer = ResetPasswordSerializer(data=request.data)
        if serializer.is_valid():
            password = serializer.validated_data['password']
            token = serializer.validated_data['token']
            uidb64 = serializer.validated_data['uidb64']
            uid = force_str(urlsafe_base64_decode(uidb64))
            user = Account.objects.get(pk=uid)
            if default_token_generator.check_token(user, token):
                user.set_password(password)
                user.save()
                return Response({'email': 'Password has been reset.'}, status=status.HTTP_200_OK)
            else:
                return Response({'email': 'Invalid token.'}, status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)




class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, format=None):
        serializer = ChangePasswordSerializer(data=request.data)
        
        if serializer.is_valid():
            user = request.user
            old_password = serializer.validated_data['old_password']
            new_password = serializer.validated_data['new_password']
            
            if not user.check_password(old_password):
                return Response({'old_password': 'Invalid old password'}, status=status.HTTP_400_BAD_REQUEST)
            
            try:
                validate_password(new_password, user=user)
            except ValidationError as ve:
                errors = list(ve.messages)
                return Response({'new_password': errors}, status=status.HTTP_400_BAD_REQUEST)

            user.set_password(new_password)
            user.save()
            update_session_auth_hash(request, user)  # Keep the user logged in
            password_changed(user)  # Notify Django that the password has changed
            return Response({'email': 'Password changed successfully'}, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


