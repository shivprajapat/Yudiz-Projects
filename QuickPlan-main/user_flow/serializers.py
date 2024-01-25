from common_app import modules as module
from .models import *
from django.conf import settings


class CreateUserSerializer(module.serializers.ModelSerializer):
    token = module.serializers.SerializerMethodField()
    class Meta:
        model = module.User
        fields = ["name", "email", "password", "token", "active_status"]
    def get_token(self, obj):
         return module.generate_token({"email":obj.email, "secret_key":settings.SECRET_KEY})
    
class UserLoginSerializer(module.serializers.ModelSerializer):
    token = module.serializers.SerializerMethodField()
    user_profile = module.serializers.SerializerMethodField()
    class Meta:
        model = module.User
        fields = ["id", "name", "email", "password", "active_status", "token", "user_profile"]

    def get_token(self, obj):
         return module.generate_token({"email":obj.email, "secret_key":settings.SECRET_KEY})

    def get_user_profile(self, obj):
        try:
            user_profile = module.UserProfile.objects.get(user_id=obj.id)
            user_profile = UserProfileSerializer(user_profile)
            return user_profile.data
        except:
            return {}

class UpdateUserPasswordSerializer(module.serializers.ModelSerializer):
	class Meta:
		model = module.User
		fields = ["password"]

class UserPrioritySerializer(module.serializers.ModelSerializer):
     	class Meta:
            model = module.UserPriority
            fields = "__all__"

class UserProfileSerializer(module.serializers.ModelSerializer):
     user_priority = module.serializers.SerializerMethodField()

     class Meta:
          model = module.UserProfile
          fields = "__all__"

     def get_user_priority(self, obj):
        try:
            user_priority = module.UserPriority.objects.get(user_id=obj.user.id)
            user_priority = UserPrioritySerializer(user_priority)
            return user_priority.data
        except:
            return {}
     
class UserSerializer(module.serializers.ModelSerializer):
    user_profile = module.serializers.SerializerMethodField()

    class Meta:
        model = module.User
        fields = ["id", "name", "email", "password", "active_status", "user_profile"]
    
    def get_user_profile(self, obj):
        try:
            user_profile = module.UserProfile.objects.get(user_id=obj.id)
            user_profile = UserProfileSerializer(user_profile)
            return user_profile.data
        except:
            return {}

class UserChoicePreferenceSerializer(module.serializers.ModelSerializer):
    class Meta:
        model = module.UserChoicePreference
        fields = "__all__"