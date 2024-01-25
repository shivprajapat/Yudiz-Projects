from django.contrib import admin
from .models import *

# Register your models here.
@admin.register(Activity)
class CustomActivity(admin.ModelAdmin):
    list_display = ('id','activity_name','activity_type', 'activity_mood', 'activity_amount', 'relationship_status', 'resident_permit', 'activity_time', 'age_limit', 'address', 'latitude', 'longitude')

@admin.register(UserActivity)
class CustomUserActivity(admin.ModelAdmin):
    list_display = ('id','user','activity','date', 'activity_amount', 'start_time', 'end_time')

@admin.register(FAQ)
class CustomFAQ(admin.ModelAdmin):
    list_display = ('id','question')

@admin.register(CMS)
class CustomCMS(admin.ModelAdmin):
    list_display = ('id','about_us')

@admin.register(Notification)
class CustomNotification(admin.ModelAdmin):
    list_display = ('id','user', 'activity', 'notification_type')