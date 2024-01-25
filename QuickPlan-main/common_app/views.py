from django.shortcuts import render
from django.http import JsonResponse
from .serializers import ActivitySerializer
from rest_framework.generics import GenericAPIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from django.db.models import Q 
from .models import Activity, UserActivity
from .decorators import verify_token
from common_app import modules as module
import datetime
from django.db.models import Sum
import random

def error_404(request, exception):
    return JsonResponse({"message":"route not found"}, status=status.HTTP_404_NOT_FOUND)

class RecommandActivities(GenericAPIView):
    serializer_class = ActivitySerializer

    @verify_token(token_type="user")
    def post(self, request, *args, **kwargs):
        try:
            user = module.User.objects.get(email=request.data["email"])
            current_time = module.get_current_time()
            relationship_status = {"relationship": "R", "single": "S", "parents": "P"}
            mood_status = {"adventurous":"A", "relaxing": "R", "sporty":"S", "family_friendly": "F"}

            # saving user choice preference for the today's plan
            user_today_plan = module.UserChoicePreference.objects.filter(Q(user_id=user.id) & Q(date=current_time.date()))
            if user_today_plan.exists():
                user_today_plan.update(user=user, user_mood=request.data['activity_mood'], user_budget=request.data['activity_budget'], user_time=str(request.data["activity_time"]))
            else:
                user_today_plan = module.UserChoicePreference(user=user, user_mood=request.data['activity_mood'], user_budget=request.data['activity_budget'], user_time=str(request.data["activity_time"]), date=module.get_current_time().date())
                user_today_plan.save()
            
            user_activities = UserActivity.objects.filter(user_id=user.id, date=current_time.date())
            total_spent =  user_activities.aggregate(Sum('activity_amount'))['activity_amount__sum']
            if total_spent and float(request.data['activity_budget']) < total_spent:
                return module.Response({"message": f"Please choose your budget more than {total_spent} AED as your previous activities are worth of {total_spent} AED.", "data": None}, status=module.status.HTTP_400_BAD_REQUEST)
            
            # saving user budget
            user_budget = module.UserBudget.objects.filter(Q(user_id=user.id) & Q(date=current_time.date()))
            if user_budget.exists():
                #adding the budget of the user to the previous one if exists
                user_budget = module.UserBudget.objects.get(Q(user_id=user.id) & Q(date=current_time.date()))
                user_budget.user_budget = float(request.data['activity_budget'])
                user_budget.save()
            else:
                user_budget = module.UserBudget(user=user, user_budget=float(request.data['activity_budget']), date=current_time.date())
                user_budget.save()
            
            user_profile = module.UserProfile.objects.get(user_id=user.id)
            user_relationship_status = relationship_status[user_profile.relationship_status]
            user_mood_status = mood_status[request.data['activity_mood']]
            today_ = current_time.strftime("%A") # to get weekday(ex. Monday)

            today = module.get_current_time().date()
            user_age = today.year - user_profile.dob.year - ((today.month, today.day) < (user_profile.dob.month, user_profile.dob.day))

            condition = (Q(activity_mood__icontains=user_mood_status) | Q(activity_mood="any")) & Q(relationship_status__icontains=user_relationship_status) & Q(active_status=True) & (Q(age_limit__gte=user_age) | Q(age_limit=0))
            activities = Activity.objects.filter(condition)
            paid_activities = activities.filter(~Q(activity_amount=0.0))
            free_activities = activities.filter(Q(activity_amount=0.0))
            asked_activity_count = len(request.data["activity_time"])
            filtered_activities = []
            last_activity_type = None
            user_budget = float(request.data['activity_budget'])
            activity_start_time_list = []
            filtered_activity_id_list = []

            def filter_user_timings(activities, user_time_str):
                filtered_activities = []
                for activity in activities:
                    user_start_time = datetime.datetime.strptime(user_time_str, '%H:%M')
                    user_end_time = user_start_time + datetime.timedelta(hours = 2) # setting timedelta to get end time using start time given by the user
                    if activity.activity_time[today_]:
                        for activity_time_str in activity.activity_time[today_]:
                            activity_start_time = datetime.datetime.strptime(activity_time_str.split("-")[0], '%H:%M')
                            activity_end_time = datetime.datetime.strptime(activity_time_str.split("-")[1], '%H:%M')
                            if user_start_time.time() >= activity_start_time.time() and user_end_time.time() <= activity_end_time.time():
                                filtered_activities.append(activity)
                                break
                return filtered_activities
            
            def get_single_paid_activity(min_paid_activity_budget, ac_budget, ac_type, user_time_str):
                activity_ = None
                price_buffer = 50.0
                while True:
                    if (ac_budget-price_buffer) < min_paid_activity_budget:
                        if ac_type:
                            matched_activities = paid_activities.filter(Q(activity_amount__lte=ac_budget) & Q(activity_type=ac_type) & ~Q(id__in=filtered_activity_id_list))
                        else:
                            matched_activities = paid_activities.filter(Q(activity_amount__lte=ac_budget) & ~Q(id__in=filtered_activity_id_list))
                            
                        matched_activities = filter_user_timings(matched_activities, user_time_str)
                        if matched_activities:
                            activity_ = random.choice(matched_activities)
                            break
                        else:
                            break

                    if ac_type:
                        matched_activities = paid_activities.filter(Q(activity_amount__gte=(ac_budget-price_buffer)) & Q(activity_amount__lte=ac_budget) & Q(activity_type=ac_type) & ~Q(id__in=filtered_activity_id_list))
                    else:
                        matched_activities = paid_activities.filter(Q(activity_amount__gte=(ac_budget-price_buffer)) & Q(activity_amount__lte=ac_budget) & ~Q(id__in=filtered_activity_id_list))
                    matched_activities = filter_user_timings(matched_activities, user_time_str)
                    if matched_activities:
                        activity_ = random.choice(matched_activities)
                        break
                    price_buffer+=50.0
                return activity_
            
            def search_activity(user_time_str, user_budget, last_activity_type):
                activities_ = []
                available_spent_per_activity = user_budget/(asked_activity_count-len(filtered_activities))
                actvity_type_to_be_found = "restaurant" if last_activity_type == "activity" else "activity" if last_activity_type == "restaurant" else None

                if asked_activity_count == 1:
                    free_or_paid = ["paid"] #Remove free activity from the list so we can get free activity at last 
                    random_activity_budget_type = random.choice(free_or_paid)

                    if random_activity_budget_type == "free":
                        filter_condition = ~Q(id__in=filtered_activity_id_list)
                        if actvity_type_to_be_found:
                            filter_condition &= Q(activity_type=actvity_type_to_be_found)

                        activities_ = free_activities.filter(filter_condition)
                        activities_ = filter_user_timings(activities_, user_time_str)
                        if not activities_:
                            activity_ = get_single_paid_activity(1.0, available_spent_per_activity, actvity_type_to_be_found, user_time_str)
                            if activity_:
                                activities_ = [activity_,]
                    else:
                        activity_ = get_single_paid_activity(1.0, available_spent_per_activity, actvity_type_to_be_found, user_time_str)
                        if  activity_:
                            activities_ = [activity_,]
                        else:
                            filter_condition = ~Q(id__in=filtered_activity_id_list)
                            if actvity_type_to_be_found:
                                filter_condition &= Q(activity_type=actvity_type_to_be_found)

                            activities_ = free_activities.filter(filter_condition)
                            activities_ = filter_user_timings(activities_, user_time_str)

                else:
                    if request.data["activity_time"].index(user_time_str) == 0:
                        filter_condition = ~Q(id__in=filtered_activity_id_list)
                        if actvity_type_to_be_found:
                            filter_condition &= Q(activity_type=actvity_type_to_be_found)

                        activities_ = free_activities.filter(filter_condition)
                        activities_ = filter_user_timings(activities_, user_time_str)
                        if not activities_:
                            activity_ = get_single_paid_activity(1.0, available_spent_per_activity, actvity_type_to_be_found, user_time_str)
                            if activity_:
                                activities_ = [activity_,]
                    else:
                        activity_ = get_single_paid_activity(1.0, available_spent_per_activity, actvity_type_to_be_found, user_time_str)
                        if  activity_:
                            activities_ = [activity_,]
                        else:
                            filter_condition = ~Q(id__in=filtered_activity_id_list)
                            if actvity_type_to_be_found:
                                filter_condition &= Q(activity_type=actvity_type_to_be_found)

                            activities_ = free_activities.filter(filter_condition)
                            activities_ = filter_user_timings(activities_, user_time_str)
                          
                if activities_:
                    random_activity_ = random.choice(activities_)
                    filtered_activities.append(random_activity_)
                    last_activity_type  = random_activity_.activity_type
                    user_budget -= random_activity_.activity_amount
                    user_time_str =  "22:00" if user_time_str == "21:59" else user_time_str
                    activity_start_time_list.append(user_time_str)
                    filtered_activity_id_list.append(random_activity_.id)

                return {"user_budget":user_budget, "last_activity_type":last_activity_type}
            
            for user_time_str in request.data["activity_time"]:
                res = search_activity(user_time_str, user_budget, last_activity_type)
                user_budget = res["user_budget"]
                last_activity_type = res["last_activity_type"]

            activities = ActivitySerializer(filtered_activities, many=True)

            # setting the price range and start time of particular activity
            for index, activity in enumerate(activities.data):
                activities.data[index]['activity_start_time'] = activity_start_time_list[index]
                
                #######  for achieve free activity in last ############ 
                if activity["activity_amount"] == 0.0:
                    activities.data[index]['price_range'] ="0-0"
                elif len(activity_start_time_list)==1:  
                    activities.data[index]['price_range']=f"0-{int(activity['activity_amount'])}"
                else:
                    activities.data[index]['price_range']=f"1-{int(activity['activity_amount'])}"

                # activities.data[index]['price_range'] = f"0-0" if activity["activity_amount"] == 0.0 else f"1-{int(activity['activity_amount'])}"

            return Response({"message": "success", "data": activities.data}, status=status.HTTP_200_OK)
        except Exception as e:
            return module.Response({"message": str(e), "data": None}, status=module.status.HTTP_400_BAD_REQUEST)

class GetMoodList(APIView):
    def get(self, request):
        mood_list = [{"title": "🗻 Adventurous", "value": "adventurous"}, {"title": "⛹️‍♀️ Sporty", "value": "sporty"},{"title": "👪 Family-Friendly", "value": "family_friendly"}, 
        {"title": "🍿 Relaxing","value": "relaxing"}]
        return Response({"message": "success", "data": mood_list}, status=status.HTTP_200_OK)

class GetBudgetList(APIView):
    def get(self, request):                                                                             #changed vlaue 800+ to 800-1500 as per new requirement
        budget_list = [{"title": "AED 200-400", "value": "400"}, {"title": "AED 500-700", "value": "700"}, {"title": "AED 800-1500","value": "1500"}]
        return Response({"message": "success", "data": budget_list}, status=status.HTTP_200_OK)

class GetTimeList(APIView):
    def get(self, request):
        time_list = [{"title": "06:00", "value": "06:00"}, {"title": "08:00", "value": "08:00"}, {"title": "10:00", "value": "10:00"}, {"title": "12:00", "value": "12:00"}, {"title": "14:00", "value": "14:00"},
        {"title": "16:00", "value": "16:00"}, {"title": "18:00", "value": "18:00"}, {"title": "20:00", "value": "20:00"}, {"title": "22:00", "value": "21:59"}]
        return Response({"message": "success", "data": time_list}, status=status.HTTP_200_OK)

class RefreshRecommandation(GenericAPIView):
    serializer_class = ActivitySerializer
    @module.verify_token(token_type="user")
    def post(self, request, *args, **kwargs):
        try:
            user = module.User.objects.get(email=request.data["email"])
            user_choice_preference = module.UserChoicePreference.objects.get(Q(user=user) & Q(date=module.get_current_time().date()))
            user_profile = module.UserProfile.objects.get(user_id=user.id)
            
            relationship_status = {"relationship": "R", "single": "S", "parents": "P"}
            mood_status = {"adventurous":"A", "relaxing": "R", "sporty":"S", "family_friendly": "F"}
            user_relationship_status = relationship_status[user_profile.relationship_status]
            user_mood_status = mood_status[user_choice_preference.user_mood]

            today = module.get_current_time().date()
            user_age = today.year - user_profile.dob.year - ((today.month, today.day) < (user_profile.dob.month, user_profile.dob.day))

            condition = (Q(activity_mood__icontains=user_mood_status) | Q(activity_mood="any")) & Q(relationship_status__icontains=user_relationship_status) & ~Q(id__in=request.data["previous_suggested"]) & Q(active_status=True) & (Q(age_limit__gte=user_age) | Q(age_limit=0))
            activities = Activity.objects.filter(condition)
            price_range = request.data["price_range"]
            #for retrive all activity like paid and free
            paid_activities=activities
            # paid_activities = activities.filter(~Q(activity_amount=0.0))

            def filter_user_timings(activities, user_time_str):
                today_ = module.get_current_time().strftime("%A") # to get weekday(ex. Monday)
                filtered_activities = []
                for activity in activities:
                    user_start_time = datetime.datetime.strptime(user_time_str, '%H:%M')
                    user_end_time = user_start_time + datetime.timedelta(hours = 2) # setting timedelta to get end time using start time given by the user
                    if activity.activity_time[today_]:
                        for activity_time_str in activity.activity_time[today_]:
                            activity_start_time = datetime.datetime.strptime(activity_time_str.split("-")[0], '%H:%M')
                            activity_end_time = datetime.datetime.strptime(activity_time_str.split("-")[1], '%H:%M')
                            if user_start_time.time() >= activity_start_time.time() and user_end_time.time() <= activity_end_time.time():
                                filtered_activities.append(activity)
                                break
                return filtered_activities
            
            def get_single_paid_activity(min_paid_activity_budget, ac_budget, ac_type, user_time_str):
                activity_ = None
                price_buffer = 50.0
                while True:
                    if (ac_budget-price_buffer) < min_paid_activity_budget:
                        if ac_type:
                            matched_activities = paid_activities.filter(Q(activity_amount__lte=ac_budget) & Q(activity_type=ac_type))
                        else:
                            matched_activities = paid_activities.filter(Q(activity_amount__lte=ac_budget))
                            
                        matched_activities = filter_user_timings(matched_activities, user_time_str)
                        if matched_activities:
                            activity_ = random.choice(matched_activities)
                            break
                        else:
                            break

                    if ac_type:
                        matched_activities = paid_activities.filter(Q(activity_amount__gte=(ac_budget-price_buffer)) & Q(activity_amount__lte=ac_budget) & Q(activity_type=ac_type))
                    else:
                        matched_activities = paid_activities.filter(Q(activity_amount__gte=(ac_budget-price_buffer)) & Q(activity_amount__lte=ac_budget))
                    matched_activities = filter_user_timings(matched_activities, user_time_str)
                    if matched_activities:
                        activity_ = random.choice(matched_activities)
                        break
                    price_buffer+=50.0
                return activity_

            activity_start_time = "21:59" if request.data["activity_start_time"] == "22:00" else request.data["activity_start_time"]
            activity = get_single_paid_activity(1.0, float(price_range.split("-")[1]), request.data["activity_type"], activity_start_time)
            if not activity:
                return Response({"message": "No more activities to refresh", "data": None}, status=status.HTTP_400_BAD_REQUEST)
                        
            activity = ActivitySerializer(activity).data
            activity["price_range"] = price_range
            activity["activity_start_time"] = request.data["activity_start_time"]

            return Response({"message": "success", "data": activity}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"message": f"{e}", "data": None}, status=status.HTTP_400_BAD_REQUEST)

class GetActivity(APIView):
    @module.verify_token(token_type="user")
    def get(self, request, id):
        try:
            activity = Activity.objects.get(id=id)
            activity = ActivitySerializer(activity)
            return  module.Response({"message": "success", "data": activity.data}, status=module.status.HTTP_200_OK)
        except Exception as e:
                return  module.Response({"message": f"{e}", "data": None}, status=module.status.HTTP_400_BAD_REQUEST)
