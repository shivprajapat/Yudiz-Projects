from .models import Activity, UserActivity, Notification
from rest_framework import serializers
import datetime
from django.db.models import Q 
from .methods import get_current_time
from common_app import modules as module
from django.db.models import Sum

class ActivitySerializer(serializers.ModelSerializer):
    activity_users = serializers.SerializerMethodField()
    class Meta:
        model = Activity
        fields = "__all__"

    def to_representation(self, data):
        relationship_status_ = {"S":"single", "R": "relationship", "P": "parents", "SRP": "single, relationship and parents", "RP": "relationship and parents", "SP": "single and parents", "SR": "single and relationship"}
        activity_mood_status = {'ASFR': 'adventurous, sporty, family-friendly, and relaxing', 'AS': 'adventurous and sporty', 'AF': 'adventurous and family-friendly', 'AR': 'adventurous and relaxing', 'SF': 'sporty and family-friendly',
                                'SR': 'sporty and relaxing', 'FR': 'family-friendly and relaxing', 'SFR': 'sporty, family-friendly, and relaxing', 'AFR': 'adventurous, family-friendly, and relaxing', 'ASR': 'adventurous, sporty, and relaxing',
                                'ASF': 'adventurous, sporty, and family-friendly', 'A': 'adventurous', 'S': 'sporty', 'F': 'family-friendly', 'R': 'relaxing'}
        relation_ship_flag = data.relationship_status
        activity_mood_flag = data.activity_mood
        activity_time = data.activity_time
        data = super(ActivitySerializer, self).to_representation(data)
        data['activity_time'] = activity_time[module.get_current_time().strftime("%A")]
        data['relationship_status'] = relationship_status_[relation_ship_flag]
        data["activity_mood"] = activity_mood_status[activity_mood_flag]
        return data
    
    def get_activity_users(self, obj):
        user_activity = UserActivity.objects.filter(Q(activity_id=obj.id) & Q(date=get_current_time().date()))
        user_activity = [activity.user.id for activity in user_activity]
        return user_activity

class UserActivitySerializer(serializers.ModelSerializer):
    user_activity_id = serializers.IntegerField(source='id')
    activity = ActivitySerializer()
    class Meta:
        model = UserActivity
        fields = ["user_activity_id", "date", "activity", "start_time"]

class UserBudgetSerializer(module.serializers.ModelSerializer):
    activities = module.serializers.SerializerMethodField()
    total_spent = module.serializers.SerializerMethodField()
    
    class Meta:
        model = module.UserBudget
        fields = ["user_budget", "activities", "total_spent"]
    
    def get_activities(self, obj):
        user_activities = UserActivity.objects.filter(user_id=obj.user.id, date=module.get_current_time().date())
        # acitivity_id_list = [activity.activity.id for activity in user_activities]
        # activities = Activity.objects.filter(id__in=acitivity_id_list)
        return UserActivitySerializer(user_activities, many=True).data
    
    def get_total_spent(self, obj):
        user_activities = UserActivity.objects.filter(user_id=obj.user.id, date=module.get_current_time().date())
        total_spent = user_activities.aggregate(Sum('activity_amount'))['activity_amount__sum']
        return total_spent if total_spent else 0

class UserNotificationSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()
    title = serializers.SerializerMethodField()
    body = serializers.SerializerMethodField()
    user_activity_id = serializers.SerializerMethodField()
    activity = ActivitySerializer()

    class Meta:
        model = Notification
        fields = ["image", "title", "body", "notification_type", "user_activity_id", "activity"]
    
    def get_image(self, obj):    
        if obj.notification_type == "recommandation":
            return None
        else:
            return obj.activity.thumbnail_image
        
    def get_title(self, obj):
        if obj.notification_type == "recommandation":
            return "New recommandation"
        else:
            return obj.activity.activity_name
    
    def get_body(self, obj):
        if obj.notification_type == "activity_alert":
            return "New activity will start soon"
        elif obj.notification_type == "budget_update":
            return "Update your activity budget"
        elif obj.notification_type == "recommandation":
            return "here are some activities for you"
        
    def get_user_activity_id(self, obj):
        if obj.notification_type == "recommandation":
            return None
        else:
            return obj.user_activity.id