from datetime import datetime, timedelta
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from rest_framework.response import Response
from rest_framework import serializers, status
from accounts.models import Account
from django.contrib.auth import authenticate, get_user_model
from rest_framework_simplejwt.tokens import RefreshToken, TokenError
from django.contrib.auth.models import update_last_login

User = get_user_model()

class TokenObtainPairSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            raise serializers.ValidationError({'email': f'{email} does not exist!!'})
        if user.is_active is False:
            raise serializers.ValidationError({'email':f'{email} is not active, check your email to activate'})

        user = authenticate(email=email, password=password)

        if not user:
            raise serializers.ValidationError({'password': 'Invalid password!!'})

        # Update the last_login field using update_last_login
        update_last_login(None, user)

        try:
            refresh = RefreshToken.for_user(user)
            access = refresh.access_token
        except TokenError:
            raise serializers.ValidationError('Could not generate token')

        data = {
            'refresh': str(refresh),
            'access': str(access),
            'id': str(user.username),
            'customer': str(user.is_customer),
            'merchant': str(user.is_merchant),
            'admin': str(user.is_admin),
        }

        return data
    
class TokenRefreshSerializer(serializers.Serializer):
    refresh = serializers.CharField()

    def validate(self, attrs):
        refresh = attrs.get('refresh')

        try:
            RefreshToken(refresh)
        except TokenError:
            raise serializers.ValidationError('Invalid token')

        return attrs


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = Account
        fields = [ 'email','username','phone_number', 'password']
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        instance = self.Meta.model(**validated_data)
        if password is not None:
            instance.set_password(password)
            instance.save()
        return instance
    
    def validate_password(self, value):
        try:
            validate_password(value)
        except ValidationError as e:
            raise serializers.ValidationError(str(e))
        return value

class ForgotPasswordSerializer(serializers.Serializer):
    email = serializers.EmailField()

class ResetPasswordSerializer(serializers.Serializer):
    password = serializers.CharField()
    token = serializers.CharField()
    uidb64 = serializers.CharField()



class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True)
