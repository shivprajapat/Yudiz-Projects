from django.contrib import admin
from .models import *
# Register your models here.
@admin.register(Admin)
class CustomAdmin(admin.ModelAdmin):
    list_display = ("id","name","email","password","otp")

@admin.register(MediaGallary)
class CustomMediaGallary(admin.ModelAdmin):
    list_display = ("id","name","img_url")