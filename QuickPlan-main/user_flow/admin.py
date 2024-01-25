from django.contrib import admin
from .models import *

# Register your models here.
@admin.register(User)
class CustomUser(admin.ModelAdmin):
    list_display = ("id","name","email","password","active_status", "login_type", "device_plateform")

@admin.register(UserProfile)
class CustomUserProfile(admin.ModelAdmin):
    list_display = ("user", "id", "dob", "resident_permit", "profile_pic", "relationship_status", "children_info")

@admin.register(UserPriority)
class CustomUserPriority(admin.ModelAdmin):
    list_display = ("user", "id", "activity_priority", "notification_resume_time")

@admin.register(UserChoicePreference)
class CustomUserChoicePreference(admin.ModelAdmin):
    list_display = ("user", "user_mood", "user_budget", "user_time", "date")

@admin.register(UserBudget)
class CustomUserBudget(admin.ModelAdmin):
    list_display = ("user", "user_budget", "date")

@admin.register(UserRecommandation)
class CustomUserRecommandation(admin.ModelAdmin):
    list_display = ("user", "user_previous_recommandation")