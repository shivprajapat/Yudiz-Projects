from django.shortcuts import render
from common_app import modules as module
from user_flow import auth, user_profile
from rest_framework.views import APIView
from common_app.models import Activity, UserActivity, Notification
from django.db.models import Q
from common_app.serializers import ActivitySerializer, UserActivitySerializer, UserBudgetSerializer, UserNotificationSerializer
from django.db.models import Sum, Max
from django.contrib.sites.shortcuts import get_current_site
from django.core.paginator import Paginator
from common_app import cron
from django.db.models import Case, When

# Create your views here.
class ListUsers(APIView):
    serializer_class = module.UserSerializer
    @module.verify_token(token_type="admin")
    def get(self, request):
        try:
            users = module.User.objects.all()
            users = self.serializer_class(users, many=True)

            return  module.Response({"message": "success", "data": users.data}, status=module.status.HTTP_200_OK)
        except Exception as e:
            return  module.Response({"message": f"{e}", "data": None}, status=module.status.HTTP_400_BAD_REQUEST)
        
class GetUser(APIView):
    serializer_class = module.UserSerializer
    @module.verify_token(token_type="user")
    def get(self, request):
        try:
            user = module.User.objects.get(email=request.data["email"])
            user = self.serializer_class(user)
            return  module.Response({"message": "success", "data": user.data}, status=module.status.HTTP_200_OK)
        except Exception as e:
                return  module.Response({"message": f"{e}", "data": None}, status=module.status.HTTP_400_BAD_REQUEST)
     
class SendVerificationOTP(module.GenericAPIView):
    def post(self, request, *args, **kwargs):
        return auth.send_verification_otp(**request.data)

class CreateUser(module.GenericAPIView):
    serializer_class = module.CreateUserSerializer

    def post(self, request, *args, **kwargs):
        request.data["serializer_class"] = self.serializer_class
        return auth.create(**request.data)

class ValidateUser(module.GenericAPIView):
    def post(self, request, *args, **kwargs):
        request.data["serializer_class"] = self.serializer_class
        return auth.validate(**request.data)

class UserLogin(module.GenericAPIView):
    serializer_class = module.UserLoginSerializer

    def post(self, request, *args, **kwargs):
        request.data["serializer_class"] = self.serializer_class
        return auth.login(**request.data)

class SendResetPasswordOTP(module.GenericAPIView):
    def post(self, request, *args, **kwargs):
        return auth.send_reset_password_otp(**request.data)

class ResetPassword(module.GenericAPIView):
    serializer_class = module.UpdateUserPasswordSerializer

    def post(self, request, *args, **kwargs):
        request.data["serializer_class"] = self.serializer_class
        return auth.reset_password(**request.data)
    
class UpdatePassword(module.GenericAPIView):
    serializer_class = module.UpdateUserPasswordSerializer

    @module.verify_token(token_type="user")
    def post(self, request, *args, **kwargs):
        request.data["serializer_class"] = self.serializer_class
        return auth.update_password(**request.data)

class UpdateUserProfile(module.GenericAPIView):
    serializer_class = module.UserProfileSerializer

    @module.verify_token(token_type="user")
    def post(self, request, *args, **kwargs):
        request.data["serializer_class"] = self.serializer_class
        return user_profile.update_user_profile(**request.data)

class GetTodayPlan(APIView):
    serializer_class = module.UserChoicePreferenceSerializer

    @module.verify_token(token_type="user")
    def get(self, request):
        try:
            user = module.User.objects.get(email=request.data["email"])
            payload = {"mood": None, "budget": None, "time": None}
            try:
                user_choice_preference = module.UserChoicePreference.objects.get(Q(user_id = user.id) & Q(date=module.get_current_time().date()))
                payload["mood"] = user_choice_preference.user_mood
                payload["budget"] = user_choice_preference.user_budget
                payload["time"] = user_choice_preference.get_time_array()
            except Exception as e:
                pass
            return  module.Response({"message": "success", "data": payload}, status=module.status.HTTP_200_OK)
        except Exception as e:
            return  module.Response({"message": f"{e}", "data": None}, status=module.status.HTTP_400_BAD_REQUEST)

class UpdateFavourite(module.GenericAPIView):
    @module.verify_token(token_type="user")
    def post(self, request, *args, **kwargs):
        try:
            user = module.User.objects.get(email=request.data["email"])
            activity_id = request.data["activity_id"]
            if Activity.objects.filter(id=activity_id).exists():
                activity = Activity.objects.get(id=activity_id)
                if activity.favourite.filter(id=user.id).exists():
                    activity.favourite.remove(user)
                    return  module.Response({"message": "success", "data": None}, status=module.status.HTTP_200_OK)
                else:
                    activity.favourite.add(user)
                    return  module.Response({"message": "success", "data": None}, status=module.status.HTTP_200_OK)
            else:
                return  module.Response({"message": "Invalid acitivity_id", "data": None}, status=module.status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return  module.Response({"message": f"{e}", "data": None}, status=module.status.HTTP_400_BAD_REQUEST)

class UpdateUserActivity(module.GenericAPIView):
    @module.verify_token(token_type="user")
    def post(self, request, *args, **kwargs):
        try:
            user = module.User.objects.get(email=request.data["email"])
            activity_id = request.data["activity_id"]
            activity = Activity.objects.get(id=activity_id)

            #retriving total spent of user 
            user_activities = UserActivity.objects.filter(user_id=user.id, date=module.get_current_time().date())
            total_spent =  user_activities.aggregate(Sum('activity_amount'))['activity_amount__sum']
            if not total_spent:
                total_spent = 0 # assigning 0 if total spents returns None

            user_budget = module.UserBudget.objects.get(user_id=user.id, date=module.get_current_time().date())
            available_bal = user_budget.user_budget - total_spent
            
            start_time = module.datetime.datetime.strptime(request.data["activity_start_time"], "%H:%M")
            end_time = start_time + module.datetime.timedelta(hours=2)
            
            if Activity.objects.filter(id=activity_id).exists():
                already_activity = UserActivity.objects.filter(Q(user_id=user.id) & Q(activity_id = activity.id) & Q(date = module.get_current_time().date()))
                if already_activity.exists():
                    already_activity.delete()
                    return  module.Response({"message": "success", "data": None}, status=module.status.HTTP_200_OK)
                else:
                    already_activity_same_time = UserActivity.objects.filter(Q(user_id=user.id) & Q(date = module.get_current_time().date()) & Q(start_time=start_time))
                    if already_activity_same_time.exists():
                        return  module.Response({"message": "You already have a scheduled activity at this time.", "data": None}, status=module.status.HTTP_400_BAD_REQUEST) 
                    if activity.activity_amount <= available_bal:
                        user_choice = module.UserChoicePreference.objects.get(Q(user_id=user.id) & Q(date=module.get_current_time().date()))
                        user_activity = UserActivity(user=user, activity=activity, date=module.get_current_time().date(), start_time=start_time.time(), end_time=end_time.time(), activity_amount=activity.activity_amount, activity_mood=user_choice.user_mood)
                        user_activity.save()
                        return  module.Response({"message": "success", "data": None}, status=module.status.HTTP_200_OK)
                    return  module.Response({"message": "You don't have enough budget.", "data": None}, status=module.status.HTTP_400_BAD_REQUEST)
            else:
                return  module.Response({"message": "Invalid activity_id", "data": None}, status=module.status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return  module.Response({"message": f"{e}", "data": None}, status=module.status.HTTP_400_BAD_REQUEST)

class MyActivities(module.GenericAPIView):
    @module.verify_token(token_type="user")
    def post(self, request, *args, **kwargs):
        try:
            user = module.User.objects.get(email=request.data["email"])
            if request.data['type'] == 'upcoming':
                user_activities = UserActivity.objects.filter(Q(user_id=user.id) & Q(date=module.get_current_time().date()) & (Q(start_time__gte=module.get_current_time().time()))).order_by('-date','start_time') #fetch data from DB by latest one 
            elif request.data['type'] == 'past':
                today = module.get_current_time()
                past_date = today - module.datetime.timedelta(days = int(request.data['days']))
                user_activities = UserActivity.objects.filter(Q(user_id=user.id) & (Q(date__lt=module.get_current_time().date()) | (Q(date=module.get_current_time().date()) & Q(start_time__lt=module.get_current_time().time()))) & Q(date__gt=past_date)).order_by('-date','-start_time') #fetch data from DB by latest one 
            user_activities = UserActivitySerializer(user_activities, many=True)
            

            #sets activity start time
            for pos, activity in enumerate(user_activities.data):
                format_datetime = module.datetime.datetime.strptime(f'{activity["start_time"]}, {activity["date"]}', '%H:%M:%S, %Y-%m-%d')
                user_activities.data[pos]["activity"]["activity_start_time"] = format_datetime.strftime("%H:%M - %b %d, %Y")

            return  module.Response({"message": "success", "data": user_activities.data}, status=module.status.HTTP_200_OK)
        except Exception as e:
            return  module.Response({"message": f"{e}", "data": None}, status=module.status.HTTP_400_BAD_REQUEST) 

class GetFavouriteList(module.GenericAPIView):
    serializer_class = ActivitySerializer

    @module.verify_token(token_type="user")
    def post(self, request, *args, **kwargs):
        try:
            activity_type = request.data.get('activity_type')
            user = module.User.objects.get(email=request.data["email"])
            activities = Activity.objects.filter(favourite__id=user.id)
            if activity_type:
                activities = activities.filter(activity_type=activity_type)
            activities = self.serializer_class(activities, many=True)
            return  module.Response({"message": "success", "data": activities.data}, status=module.status.HTTP_200_OK)
        except Exception as e:
            return  module.Response({"message": f"{e}", "data": None}, status=module.status.HTTP_400_BAD_REQUEST) 

class GetTodaySpending(module.GenericAPIView):
    @module.verify_token(token_type="user")
    def get(self, request, *args, **kwargs):
        try:
            user = module.User.objects.get(email=request.data["email"])

            if not module.UserBudget.objects.filter(user_id=user.id, date=module.get_current_time().date()).exists():
                return  module.Response({"message": "success", "data": None}, status=module.status.HTTP_200_OK)

            user_budget = module.UserBudget.objects.get(user_id=user.id, date=module.get_current_time().date())
            user_budget = UserBudgetSerializer(user_budget)

            #sets activity start time
            for pos, activity in enumerate(user_budget.data["activities"]):
                format_datetime = module.datetime.datetime.strptime(f'{activity["start_time"]}', '%H:%M:%S')
                user_budget.data["activities"][pos]["activity"]["activity_start_time"] = format_datetime.strftime("%H:%M")

            return  module.Response({"message": "success", "data": user_budget.data}, status=module.status.HTTP_200_OK)
        except Exception as e:
            return  module.Response({"message": f"{e}", "data": None}, status=module.status.HTTP_400_BAD_REQUEST) 

class UserSocialLogin(module.GenericAPIView):
    serializer_class = module.UserLoginSerializer

    def post(self, request, *args, **kwargs):
        request.data["serializer_class"] = self.serializer_class
        return auth.social_login(**request.data)

class AddActivitySpent(module.GenericAPIView):
    @module.verify_token(token_type="user")
    def post(self, request, *args, **kwargs):
        try:
            user = module.User.objects.get(email=request.data["email"])
            user_activity = UserActivity.objects.get(id=request.data["user_activity_id"])

            user_activities = UserActivity.objects.filter(user_id=user.id, date=module.get_current_time().date())
            total_spent =  user_activities.aggregate(Sum('activity_amount'))['activity_amount__sum']
            if not total_spent:
                total_spent = 0 # assigning 0 if total spents returns None
            user_budget = module.UserBudget.objects.get(user_id=user.id, date=module.get_current_time().date())
            available_bal = user_budget.user_budget - total_spent

            requested_amount = float(request.data["activity_amount"])
            if available_bal >= requested_amount:
                user_activity.activity_amount += requested_amount
                user_activity.save()
            else:
                return  module.Response({"message": "You do not have enough budget to add more spent.", "data": None}, status=module.status.HTTP_400_BAD_REQUEST)
            return  module.Response({"message": "success", "data": None}, status=module.status.HTTP_200_OK)
        except Exception as e:
            return  module.Response({"message": f"{e}", "data": None}, status=module.status.HTTP_400_BAD_REQUEST)

class LastWeekSpending(module.GenericAPIView):
    @module.verify_token(token_type="user")
    def get(self, request, *args, **kwargs):
        try:
            user = module.User.objects.get(email=request.data["email"])
            week_start_date = module.get_current_time() - module.datetime.timedelta(days = int(module.get_current_time().strftime("%u"))-1) #remove 1 day as week starts from sunday
            user_spent_dates_list = UserActivity.objects.filter(Q(user_id=user.id) & Q(date__gte=week_start_date.date())).values_list('date', flat=True)

            user_last_week_spent = UserActivity.objects.filter(Q(user_id=user.id) & Q(date__gte=week_start_date.date())).values('date').order_by('date').annotate(total_spent=Sum('activity_amount'))
            user_last_week = list()
            for i in range(7):
                date_ = week_start_date + module.datetime.timedelta(days = i)
                if date_.date() not in list(user_spent_dates_list):
                    user_last_week.append({"date": date_.strftime("%Y-%m-%d"), "total_spent": 0.0})
            for day in user_last_week_spent:
                user_last_week.append({"date": day["date"].strftime("%Y-%m-%d"), "total_spent": day["total_spent"]})

            user_last_week = sorted(user_last_week, key=lambda x: x['date'])  # sort the genrated list (date wise)
            return  module.Response({"message": "success", "data": user_last_week}, status=module.status.HTTP_200_OK)
        except Exception as e:
            return  module.Response({"message": f"{e}", "data": None}, status=module.status.HTTP_400_BAD_REQUEST) 

class ActivityDashboard(module.GenericAPIView):
    @module.verify_token(token_type="user")
    def get(self, request, *args, **kwargs):
        try:
            current_time = module.get_current_time()
            base_url = get_current_site(request)
            user = module.User.objects.get(email=request.data["email"])

            user_activities = UserActivity.objects.filter(Q(user_id=user.id) & Q(date=current_time.date()))

            dashboard=[]
            sporty_activity_count = user_activities.filter(activity_mood="sporty").count()
            adventurous_activity_count = user_activities.filter(activity_mood="adventurous").count()
            relaxing_activity_count = user_activities.filter(activity_mood="relaxing").count()
            family_friendly_activity_count = user_activities.filter(activity_mood="family_friendly").count()

            if sporty_activity_count:
                dashboard.append({"title":"Sports", "total_activities":sporty_activity_count, "completed_activities":user_activities.filter(Q(activity_mood="sporty") & Q(end_time__lt=current_time.time())).count(), "color":"#FFDD72", "icon_url":f"https://{base_url}/media/icons/icon_sporty.png", "value":"sporty"})
            if adventurous_activity_count:
                dashboard.append({"title":"Adventurous", "total_activities":adventurous_activity_count, "completed_activities":user_activities.filter(Q(activity_mood="adventurous") & Q(end_time__lt=current_time.time())).count(),  "color":"#A5F59C", "icon_url":f"https://{base_url}/media/icons/icon_adventurous.png", "value":"adventurous"})
            if relaxing_activity_count:
                dashboard.append({"title":"Relaxing", "total_activities":relaxing_activity_count, "completed_activities":user_activities.filter(Q(activity_mood="relaxing") & Q(end_time__lt=current_time.time())).count(),  "color":"#FBA3FF", "icon_url":f"https://{base_url}/media/icons/icon_relaxing.png", "value":"relaxing"})
            if family_friendly_activity_count:
                dashboard.append({"title":"Family & Friendly", "total_activities":family_friendly_activity_count, "completed_activities":user_activities.filter(Q(activity_mood="family_friendly") & Q(end_time__lt=current_time.time())).count(),  "color":"#FFDD72", "icon_url":f"https://{base_url}/media/icons/icon_family_friendly.png", "value":"family_friendly"})
            
            return  module.Response({"message": "success", "data": dashboard}, status=module.status.HTTP_200_OK)
        except Exception as e:
                return  module.Response({"message": f"{e}", "data": None}, status=module.status.HTTP_400_BAD_REQUEST)

class TodayActivities(module.GenericAPIView):
    @module.verify_token(token_type="user")
    def post(self, request, *args, **kwargs):
        try:
            user = module.User.objects.get(email=request.data["email"])
            user_activities = UserActivity.objects.filter(Q(user_id=user.id) & Q(date=module.get_current_time().date()) & Q(activity_mood=request.data["activity_mood"]))
            user_activities = UserActivitySerializer(user_activities, many=True)

            #sets activity start time
            for pos, activity in enumerate(user_activities.data):
                format_datetime = module.datetime.datetime.strptime(f'{activity["start_time"]}', '%H:%M:%S')
                user_activities.data[pos]["activity"]["activity_start_time"] = format_datetime.strftime("%H:%M")

            return  module.Response({"message": "success", "data": user_activities.data}, status=module.status.HTTP_200_OK)
        except Exception as e:
                return  module.Response({"message": f"{e}", "data": None}, status=module.status.HTTP_400_BAD_REQUEST)

class UploadImage(module.GenericAPIView):
    @module.verify_token(token_type="user")
    def post(self, request, *args, **kwargs):
        try:
            user = module.User.objects.get(email=request.data["email"])
            profile_image = request.FILES["profile_image"]

            #validating image format
            valid_extensions = ["jpg","jpeg","png"]
            if profile_image.name.split(".")[-1].lower() not in valid_extensions:
                return module.Response({"message": "Invalid image.", "data": None}, status=module.status.HTTP_400_BAD_REQUEST)
            
            profile_image_name = profile_image.name.replace(" ","_")
            profile_image_name = f"{user.id}_{profile_image_name}"

            image_uploaded = module.upload_to_s3(name= profile_image_name, image= profile_image)
            if image_uploaded:
                existing_profile = module.UserProfile.objects.filter(user_id=user.id)
                if existing_profile.exists():
                    existing_profile.update(profile_pic=image_uploaded)
                else:
                    new_user_profile = module.UserProfile.objects.create(user=user, profile_pic=image_uploaded)
                    new_user_profile.save()
                return module.Response({"message": "success", "data": None}, status=module.status.HTTP_200_OK)
            return module.Response({"message": "Unable to upload image.", "data": None}, status=module.status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return  module.Response({"message": f"{e}", "data": None}, status=module.status.HTTP_400_BAD_REQUEST)

class SetDND(module.GenericAPIView):
    @module.verify_token(token_type="user")
    def post(self, request, *args, **kwargs):
        try:
            user = module.User.objects.get(email=request.data["email"])
            time_format = request.data["time_format"]
            pause_time = request.data["pause_time"]
            notification_resume_time = module.get_current_time()

            if time_format == "min":
                notification_resume_time = notification_resume_time + module.datetime.timedelta(minutes= int(pause_time))
            if time_format == "hour":
                notification_resume_time = notification_resume_time + module.datetime.timedelta(hours= int(pause_time))
            if time_format == "day":
                notification_resume_time = notification_resume_time + module.datetime.timedelta(days= int(pause_time))
            if time_format == "custom":
                notification_resume_time = module.datetime.datetime.strptime(pause_time, "%Y-%m-%d %H:%M:%S")

            existing_user_priority = module.UserPriority.objects.filter(user_id=user.id)
            if existing_user_priority.exists():
                existing_user_priority.update(notification_resume_time=notification_resume_time)
            else:
                new_user_priority = module.UserPriority.objects.create(user=user, notification_resume_time=notification_resume_time)
                new_user_priority.save()
            return  module.Response({"message": "success", "data": None}, status=module.status.HTTP_200_OK)
        except Exception as e:
            return  module.Response({"message": f"{e}", "data": None}, status=module.status.HTTP_400_BAD_REQUEST)

class UpdateUserDevice(module.GenericAPIView):
    @module.verify_token(token_type="user")
    def post(self, request, *args, **kwargs):
        try:
            device_plateform = request.data["device_plateform"]
            valid_device_plateforms = ["ios", "android"]

            if device_plateform not in valid_device_plateforms:
                return  module.Response({"message": "Invalid device plateform.", "data": None}, status=module.status.HTTP_400_BAD_REQUEST)
            
            user = module.User.objects.get(email=request.data["email"])
            user.device_token = request.data["device_token"]
            user.device_plateform = device_plateform
            user.save()
            return  module.Response({"message": "success", "data": None}, status=module.status.HTTP_200_OK)
        except Exception as e:
            return  module.Response({"message": f"{e}", "data": None}, status=module.status.HTTP_400_BAD_REQUEST)

class GetUserNotifications(module.GenericAPIView):
    @module.verify_token(token_type="user")
    def get(self, request, *args, **kwargs):
        try:
            user = module.User.objects.get(email=request.data["email"])
            page = request.GET['page']
            page_size = request.GET['size']
            
            user_notifications = Notification.objects.filter(Q(user_id=user.id) & Q(date=module.get_current_time().date())).order_by('-id')
            paginator = Paginator(user_notifications, page_size)
            if int(page) > paginator.num_pages or int(page) < 1:
                return  module.Response({"message": "success", "data": []}, status=module.status.HTTP_200_OK)
            user_notifications = paginator.page(page)
            user_notifications = UserNotificationSerializer(user_notifications, many=True)
            return  module.Response({"message": "success", "data": user_notifications.data}, status=module.status.HTTP_200_OK)
        except Exception as e:
            return  module.Response({"message": f"{e}", "data": None}, status=module.status.HTTP_400_BAD_REQUEST)

class GetUserRecommandation(module.GenericAPIView):
    @module.verify_token(token_type="user")
    def get(self, request, *args, **kwargs):
        try:
            current_time = module.get_current_time()
            user = module.User.objects.get(email=request.data["email"])
            relationship_status = {"relationship": "R", "single": "S", "parents": "P"}
            user_profile = module.UserProfile.objects.get(user_id=user.id)
            user_relationship_status = relationship_status[user_profile.relationship_status]
            mood_status = {"adventurous":"A", "relaxing": "R", "sporty":"S", "family_friendly": "F"}

            try:
                user_today_plan = module.UserChoicePreference.objects.get(Q(user_id=user.id) & Q(date=current_time.date()))
            except:
                return  module.Response({"message": "success", "data": []}, status=module.status.HTTP_200_OK)
            user_mood_status = mood_status[user_today_plan.user_mood]

            user_today_activities = UserActivity.objects.filter(user_id=user.id, date=current_time.date())
            user_today_activities_start_time = user_today_activities.values_list('start_time', flat=True).distinct()

            user_activity_prefer_time = user_today_plan.get_time_array()
            if "21:59" in user_activity_prefer_time:
                idx_ = user_activity_prefer_time.index("21:59")
                user_activity_prefer_time[idx_] = "22:00"
            user_activity_prefer_time = [module.datetime.datetime.strptime(i, '%H:%M').time() for i in user_activity_prefer_time]
            
            user_fee_time_slots = [time_ for time_ in user_activity_prefer_time if time_ not in user_today_activities_start_time and time_ >= current_time.time()]

            #retriving total spent & available spent of user 
            user_activities = UserActivity.objects.filter(user_id=user.id, date=module.get_current_time().date())
            total_spent =  user_activities.aggregate(Sum('activity_amount'))['activity_amount__sum']
            if not total_spent:
                total_spent = 0 # assigning 0 if total spents returns None
            user_budget = module.UserBudget.objects.get(user_id=user.id, date=module.get_current_time().date())
            available_spent = user_budget.user_budget - total_spent

            queryset_condition = Q(activity_mood__icontains=user_mood_status) & Q(activity_amount__lte=available_spent) & Q(relationship_status__icontains=user_relationship_status)

            def filter_user_timings(activities, user_available_time):
                filtered_activities = []
                filtered_activities_start_time = []
                today_ = current_time.strftime("%A") # to get weekday(ex. Monday)
                
                for activity in activities:
                    user_start_time = module.datetime.datetime.strptime(str(user_available_time), '%H:%M:%S')
                    user_end_time = user_start_time + module.datetime.timedelta(hours = 2) # setting timedelta to get end time using start time given by the user
                    if activity.activity_time[today_]:
                        for activity_time_str in activity.activity_time[today_]:
                            activity_start_time = module.datetime.datetime.strptime(activity_time_str.split("-")[0], '%H:%M')
                            activity_end_time = module.datetime.datetime.strptime(activity_time_str.split("-")[1], '%H:%M')
                            if user_start_time.time() >= activity_start_time.time() and user_end_time.time() <= activity_end_time.time():
                                filtered_activities.append(activity)
                                filtered_activities_start_time.append(user_start_time)
                                break
                return filtered_activities, filtered_activities_start_time
            
            filtered_activities = Activity.objects.filter(queryset_condition)
            recommandation = []
            recommandation_start_time = []
            for user_time in user_fee_time_slots:
                available_activities = filter_user_timings(filtered_activities, user_time)
                recommandation.extend(available_activities[0])
                recommandation_start_time.extend(available_activities[1])
            recommandation = ActivitySerializer(recommandation, many=True)

            # setting the start time of particular activity
            for index, activity in enumerate(recommandation.data):
                time_str = recommandation_start_time[index].strftime("%H:%M")
                recommandation.data[index]['activity_start_time'] = time_str

            #limiting the results of recommandation
            limit_ = 20
            if len(recommandation.data) > limit_:
                recommandation_data = []
                while True:
                    if limit_ < 1:
                        break
                    random_acitvity = module.random.choice(recommandation.data)
                    if random_acitvity not in recommandation_data:
                        recommandation_data.append(random_acitvity)
                        limit_ -= 1
            else:
                recommandation_data = recommandation.data

            return  module.Response({"message": "success", "data": recommandation_data}, status=module.status.HTTP_200_OK)
        except Exception as e:
            return  module.Response({"message": f"{e}", "data": None}, status=module.status.HTTP_400_BAD_REQUEST)

class PushNotification(module.GenericAPIView): # created for the debugging purpose.
    @module.verify_token(token_type="user")
    def post(self, request, *args, **kwargs):
        try:
            payload = dict()
            user = module.User.objects.get(email=request.data["email"])
            type_ = request.data["type"]
            activity =  Activity.objects.first()
            if type_ == "activity_alert":
                payload = {"title": "D3 Skating", "body": "Your acitivity will start soon", "notification_type": "activity_alert", "user_activity_id": 4, "activity": ActivitySerializer(activity).data}
                notification_pushed = cron.push_firebase_message(payload["title"], payload["body"], user.device_token, payload)
            elif type_ == "budget_update":
                payload = {"title": "D3 Skating", "body": "Update your activity budget", "notification_type": "budget_update", "user_activity_id": 4, "activity": ActivitySerializer(activity).data}
                notification_pushed = cron.push_firebase_message(payload["title"], payload["body"], user.device_token, payload)
            elif type_ == "recommandation":
                payload = {"title": "New Recommandation", "body": "here are some activities for you", "notification_type": "recommandation"}
                notification_pushed = cron.push_firebase_message(payload["title"], payload["body"], user.device_token, payload)
            return  module.Response({"message": "success", "data": payload}, status=module.status.HTTP_200_OK)
        except Exception as e:
            return  module.Response({"message": f"{e}", "data": None}, status=module.status.HTTP_400_BAD_REQUEST)

class SavePreviousRecommandation(module.GenericAPIView):
    @module.verify_token(token_type="user")
    def post(self, request, *args, **kwargs):
        try:
            user = module.User.objects.get(email=request.data["email"])
            previous_recommndation = request.data["previous_recommndation"]
            already_user_previous_recommandation = module.UserRecommandation.objects.filter(user_id=user.id)
            if already_user_previous_recommandation.exists():
                already_user_previous_recommandation.update(user_previous_recommandation=previous_recommndation)
            else:
                user_recommadation = module.UserRecommandation.objects.create(user=user, user_previous_recommandation=previous_recommndation)
                user_recommadation.save()
            return  module.Response({"message": "success", "data": None}, status=module.status.HTTP_200_OK)
        except Exception as e:
            return  module.Response({"message": f"{e}", "data": None}, status=module.status.HTTP_400_BAD_REQUEST)
        
class GetPreviousRecommandation(module.GenericAPIView):
    @module.verify_token(token_type="user")
    def get(self, request, *args, **kwargs):
        try:
            user = module.User.objects.get(email=request.data["email"])
            try:
                previous_recommndation_json = module.UserRecommandation.objects.get(user_id=user.id).user_previous_recommandation
                previous_recommndation_timing = [{"activity_start_time":time} for time in list(previous_recommndation_json.values())]
                previous_recommndation_id = [int(i) for i in list(previous_recommndation_json.keys())]
                recommandation_order = Case(*[When(pk=pk, then=pos) for pos, pk in enumerate(previous_recommndation_id)])
                previous_recommndation = Activity.objects.filter(id__in=previous_recommndation_id).order_by(recommandation_order)
                previous_recommndation = ActivitySerializer(previous_recommndation, many=True).data
                for pos, rec in enumerate(previous_recommndation):
                    previous_recommndation[pos]["price_range"] = "0-0" if rec["activity_amount"] == 0.0 else f"1-{int(rec['activity_amount'])}"
                    rec.update(previous_recommndation_timing[pos])
                    
            except Exception as e:
                print("Exception in the API: GetPreviousRecommandation:", e)
                previous_recommndation = []
            return  module.Response({"message": "success", "data": previous_recommndation}, status=module.status.HTTP_200_OK)
        except Exception as e:
            return  module.Response({"message": f"{e}", "data": None}, status=module.status.HTTP_400_BAD_REQUEST)
        
class UserLogout(module.GenericAPIView):
    @module.verify_token(token_type="user")
    def post(self, request):
        return module.Response({"message":"success","data":"Succefully logout"}, status=module.status.HTTP_200_OK)

class UserDelete(module.GenericAPIView):
    @module.verify_token(token_type="user")
    def post(self, request):
        return module.Response({"message":"success","data":"Succefully account deleted"}, status=module.status.HTTP_200_OK)