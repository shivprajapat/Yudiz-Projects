from django.db import models
from common_app import modules as module
# Create your models here.

class Activity(models.Model):
    activity_name  = models.CharField(max_length=100)
    company_name = models.CharField(max_length=200, blank=True)
    thumbnail_image = models.TextField(blank=True)
    thumbnail_image_2 = models.TextField(blank=True)
    activity_type_choices =  [("restaurant","restaurant"), ("activity","activity")]
    activity_type = models.CharField(max_length=30, choices=activity_type_choices, default="activity")
    mood_choices = [("ASFR", "adventurous, sporty, family-friendly, and relaxing"),
                    ("AS", "adventurous and sporty"), ("AF", "adventurous and family-friendly"),
                    ("AR", "adventurous and relaxing"), ("SF", "sporty and family-friendly"),
                    ("SR", "sporty and relaxing"), ("FR", "family-friendly and relaxing"),
                    ("SFR", "sporty, family-friendly, and relaxing"), 
                    ("AFR", "adventurous, family-friendly, and relaxing"),
                    ("ASR", "adventurous, sporty, and relaxing"), 
                    ("ASF", "adventurous, sporty, and family-friendly"),
                    ("A", "adventurous"), ("S", "sporty"), ("F", "family-friendly"), 
                    ("R", "relaxing")]
    activity_mood = models.CharField(max_length=30, choices=mood_choices, default="ASFR")
    activity_time = models.JSONField(blank=True, null=True)
    activity_amount = models.FloatField()
    address = models.TextField(blank=True)
    latitude = models.DecimalField(max_digits=30, decimal_places=20)
    longitude = models.DecimalField(max_digits=30, decimal_places=20)
    relationship_choice=[("S", "single"), ("R", "relationship"), ("P", "parents"), ("SRP", "single, relationship and parents"), ("RP", "relationship and parents"), ("SP", "single and parents"), ("SR", "single and relationship")]
    relationship_status =models.CharField(max_length=20, choices=relationship_choice, default="SRP")
    favourite = models.ManyToManyField(module.User, blank=True)
    resident_choice=[("resident","resident"),("tourist","tourist"), ("any","any")]
    resident_permit =models.CharField(max_length=10, choices=resident_choice, default="any")
    active_status = models.BooleanField(default=True)
    age_limit = models.IntegerField()
    group_amount = models.IntegerField()
    restaurant_type_choices = ("Walk-in", "Walk-in"), ("Reservation", "Reservation")
    restaurant_type = models.CharField(max_length=20, choices=restaurant_type_choices, blank=True)
    activity_description = models.TextField(blank=True)
    restaurant_menu = models.TextField(blank=True)
    booking_reference = models.TextField(blank=True)
    instagram = models.TextField(blank=True)
    # google_map = models.TextField(blank=True)
    
    def __str__(self) -> str:
        return self.activity_name

class UserActivity(models.Model):
    user = models.ForeignKey(module.User, on_delete=models.CASCADE)
    activity = models.ForeignKey(Activity, on_delete=models.CASCADE)
    date = models.DateField()
    start_time = models.TimeField(null=True)
    end_time = models.TimeField(null=True)
    activity_amount = models.FloatField()
    mood_choices =  [("adventurous","adventurous"), ("sporty","sporty"), ("relaxing","relaxing"), ("family_friendly","family-friendly")]
    activity_mood = models.CharField(max_length=30, choices=mood_choices, default="any")
    
    def __str__(self) -> str:
        return self.user.name

class FAQ(models.Model):
    question = models.CharField(max_length=100, blank=True)
    answer = models.TextField(blank=True)

    def __str__(self) -> str:
        return self.question

class CMS(models.Model):
    about_us = models.TextField(blank=True)
    about_us_img = models.TextField(blank=True)
    term_and_condition = models.TextField(blank=True)
    privacy_policy = models.TextField(blank=True)

class Notification(models.Model):
    user = models.ForeignKey(module.User, on_delete=models.CASCADE)
    activity = models.ForeignKey(Activity, on_delete=models.CASCADE, null=True)
    user_activity = models.ForeignKey(UserActivity, on_delete=models.CASCADE, null=True)
    notification_type_choice=[("activity_alert","activity_alert"),("budget_update","budget_update"), ("recommandation","recommandation")]
    notification_type = models.CharField(max_length=20, choices=notification_type_choice, blank=True)
    date = models.DateField()