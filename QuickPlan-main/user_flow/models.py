from django.db import models
from common_app import modules as module
# Create your models here.

# User Model
class User(models.Model):
    name = models.CharField(max_length=30, blank=True)
    email = models.EmailField()
    password = models.CharField(max_length=100, blank=True)
    active_status = models.BooleanField(default=True)
    login_choice = [("manual","manual"),("google","google"),("facebook","facebook"),("apple","apple")]
    login_type = models.CharField(max_length=20, choices=login_choice, default="manual")
    social_token = models.TextField(blank=True)
    device_token = models.TextField(blank=True)
    plateform_choices = [("ios","ios"),("android","android")]
    device_plateform = models.CharField(max_length=20, choices=plateform_choices, blank=True)

    def __str__(self) -> str:
        return self.name
    
class UserProfile(models.Model):
    user = models.OneToOneField(User, related_name = "User", on_delete=models.CASCADE)
    dob = models.DateField(null=True)
    resident_choice=[("resident","resident"),
                ("tourist","tourist")]
    resident_permit =models.CharField(max_length=10, choices=resident_choice, default="resident")
    profile_pic = models.TextField(blank=True)
    relationship_choice=[("single","single"),
                ("relationship","relationship"),
                ("parents","parents")]
    relationship_status =models.CharField(max_length=20, choices=relationship_choice, default="single")
    children_info = models.CharField(max_length=75, default="[]")
        
    def __str__(self) -> str:
        return self.user.name

    def get_children_info_array(self) -> list:
        return module.ast.literal_eval(self.children_info)

class UserPriority(models.Model):
    user = models.OneToOneField(User, related_name = "UserPriority", on_delete=models.CASCADE)
    activity_priority_choice = [("everyday","everyday"),("weekends","weekends")]
    activity_priority = models.CharField(max_length=10, choices=activity_priority_choice, default="everyday")
    notification_resume_time = models.DateTimeField(null=True)

class UserChoicePreference(models.Model):
    user = models.ForeignKey(User, related_name = "UserPreferedChoice", on_delete=models.CASCADE)
    user_mood = models.CharField(max_length=30)
    user_budget = models.CharField(max_length=200)
    user_time = models.CharField(max_length=200)
    date = models.DateField()

    def __str__(self) -> str:
        return self.user.name
    
    def get_time_array(self) -> list:
        return module.ast.literal_eval(self.user_time)

class UserBudget(models.Model):
    user = models.ForeignKey(User, related_name = "UserBudget", on_delete=models.CASCADE)
    user_budget = models.FloatField()
    date = models.DateField()

    def __str__(self) -> str:
        return self.user.name

class UserRecommandation(models.Model):
    user = models.OneToOneField(User, related_name="UserRecommandation", on_delete=models.CASCADE)
    user_previous_recommandation = models.JSONField()

    def __str__(self) -> str:
        return self.user.name