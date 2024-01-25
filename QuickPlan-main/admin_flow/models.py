from django.db import models

# Create your models here.
class Admin(models.Model):
    name = models.CharField(max_length=30)
    profile_pic = models.TextField(blank=True)
    email = models.EmailField()
    password = models.CharField(max_length=100)
    otp = models.CharField(max_length=10, blank=True)
        
    def __str__(self) -> str:
        return self.name
    
class MediaGallary(models.Model):
    name = models.CharField(max_length=100)
    img_url = models.TextField(blank=True)

    def __str__(self) -> str:
        return self.name