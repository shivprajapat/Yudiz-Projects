import jwt

from rest_framework import serializers
from rest_framework import status
from django.core.exceptions import ObjectDoesNotExist, ValidationError
from user_flow.models import User, UserProfile, UserPriority, UserChoicePreference, UserBudget, UserRecommandation
from admin_flow.models import Admin, MediaGallary
from django.core.validators import validate_email
from rest_framework.generics import GenericAPIView
from rest_framework.response import Response
from django.contrib.auth.hashers import make_password, check_password
from rest_framework.authtoken.models import Token
from quick_plan.settings import SECRET_KEY
from django.contrib.auth import password_validation
import os
import random
from .methods import send_otp, generate_token, decode_token, get_random_int
from django.core.mail import send_mail, BadHeaderError
import quick_plan.settings as settings
import ast
from .decorators import verify_token
import datetime
from .methods import get_current_time, upload_to_s3, delete_from_s3
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.utils.html import strip_tags


# serializers
from user_flow.serializers import (
    CreateUserSerializer, UserLoginSerializer, UpdateUserPasswordSerializer, UserSerializer, UserProfileSerializer, UserPrioritySerializer, UserChoicePreferenceSerializer
)

from admin_flow.serializers import (
    CreateAdminSerializer, AdminLoginSerializer, UpdateAdminPasswordSerializer , UpdateUserStatusSerielizer, AdminSerializer, MediaSerializer
)
