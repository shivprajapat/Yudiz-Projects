from common_app import modules as module
from .models import *


class CreateAdminSerializer(module.serializers.ModelSerializer):
    token = module.serializers.SerializerMethodField()
    class Meta:
        model = module.Admin
        fields = ["name", "profile_pic", "email", "password", "token"]

    def get_token(self, obj):
        return module.generate_token({"email": obj.email})

class AdminLoginSerializer(module.serializers.ModelSerializer):
    token = module.serializers.SerializerMethodField()
    class Meta:
        model = module.Admin
        fields = ["name", "email", "password", "token"]

    def get_token(self, obj):
         return module.generate_token({"email": obj.email})

class UpdateAdminPasswordSerializer(module.serializers.ModelSerializer):
	class Meta:
		model = module.Admin
		fields = ["password"]
                
class UpdateUserStatusSerielizer(module.serializers.ModelSerializer):
    class Meta:
        model = module.User
        fields = ["activate_status"]

class AdminSerializer(module.serializers.ModelSerializer):
    token = module.serializers.SerializerMethodField()
    class Meta:
        model = module.Admin
        fields = ["name", "profile_pic", "email", "token"]

    def get_token(self, obj):
        return module.generate_token({"email": obj.email})

class MediaSerializer(module.serializers.ModelSerializer):
    class Meta:
        model = module.MediaGallary
        fields = "__all__"
