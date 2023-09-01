from typing import Any
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models


class MyUserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        """
        Creates and saves a User with the given email and password.
        """
        if not email:
            raise ValueError('The Email field must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        """
        Creates and saves a superuser with the given email and password.
        """
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(email, password, **extra_fields)

class Account(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(unique=True)
    username=models.CharField(max_length=32,unique=True)
    phone_number = models.CharField(max_length=20, blank=True)
    is_active = models.BooleanField(default=True) 
    is_staff=models.BooleanField(default=False) 
    is_superuser=models.BooleanField(default=False) 
    date_joined = models.DateTimeField(auto_now_add=True)

    objects = MyUserManager()
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['phone_number','username']

    def __str__(self):
        return f'{self.email} {self.username}'

class Test(models.Model):
    name=models.CharField(max_length=20)

class Profile(models.Model):
    owner=models.ForeignKey(Account,on_delete=models.CASCADE)
    decsription=models.CharField(max_length=32)
    # test=models.ForeignKey(Test,on_delete=models.CASCADE ,default=1)


