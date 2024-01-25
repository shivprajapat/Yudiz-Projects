from common_app.models import UserActivity, Notification, Activity
from common_app.serializers import ActivitySerializer
from common_app import modules as module
from django.db.models import Q 
import requests
import json
from dotenv import load_dotenv
import os

# Loading environment variable
load_dotenv()

current_time = module.get_current_time()
current_time = current_time.replace(second=0, microsecond=0)
server_token = os.getenv('FIREBASE_SERVER_TOKEN')

def save_notification(user, activity, user_activity, notification_type):
    user_notification = Notification(user=user, activity=activity, user_activity=user_activity, notification_type=notification_type, date=current_time.date())
    user_notification.save()

def push_firebase_message(title, body, device_token, payload):
    url = "https://fcm.googleapis.com/fcm/send"
    headers = {'Content-Type': 'application/json', 'Authorization': 'key=' + server_token,}
    body = {'notification': {'title': f'{title}', 'body': f'{body}'},
            'to': device_token,
            'priority': 'high',
            'data': payload, }
    response = requests.post(url, headers = headers, data=json.dumps(body))
    return True if response.status_code == 200 else False

def sync_budget_update_notification():
    buffer_time = current_time - module.datetime.timedelta(hours = 3)
    user_activities = UserActivity.objects.filter(Q(date=current_time.date()) & Q(start_time=buffer_time))
    if not user_activities.exists():
        print(f"{current_time}: No budget update alert at this moment...\n")
    for activity in user_activities:
        if activity.user.device_token:
            if module.UserPriority.objects.filter(user=activity.user).exists():
                user_priority = module.UserPriority.objects.get(user=activity.user)
                # check for user DND is on or not
                if (user_priority.notification_resume_time and user_priority.notification_resume_time.timestamp()<=module.get_current_time().timestamp()) or not user_priority.notification_resume_time:
                    payload = {"title": activity.activity.activity_name, "body": "Update your activity budget", "notification_type": "budget_update", "user_activity_id": activity.id, "activity": ActivitySerializer(activity.activity).data}
                    notification_pushed = push_firebase_message(payload["title"], payload["body"], activity.user.device_token, payload)
                    if notification_pushed:
                        print(current_time,":","pushed budget update notification to the user:", activity.user.id)
                        save_notification(activity.user, activity.activity, activity, "budget_update")
                    else:
                        print(current_time,":","failed to push budget update notification to the user:", activity.user.id)

def sync_activity_alert_notification():
    buffer_time = current_time + module.datetime.timedelta(minutes = 15)
    user_activities = UserActivity.objects.filter(Q(date=current_time.date()) & Q(start_time=buffer_time))
    if not user_activities.exists():
        print(f"{current_time}: No activities alert at this moment...\n")
    for activity in user_activities:
        if activity.user.device_token:
            if module.UserPriority.objects.filter(user=activity.user).exists():
                user_priority = module.UserPriority.objects.get(user=activity.user)
                # check for user DND is on or not
                if (user_priority.notification_resume_time and user_priority.notification_resume_time.timestamp()<=module.get_current_time().timestamp()) or not user_priority.notification_resume_time:
                    payload = {"title": activity.activity.activity_name, "body": "New activity will start soon", "notification_type": "activity_alert", "user_activity_id": activity.id, "activity": ActivitySerializer(activity.activity).data}
                    notification_pushed = push_firebase_message(payload["title"], payload["body"], activity.user.device_token, payload)
                    if notification_pushed:
                        print(current_time,":","pushed activity alert notification to the user:", activity.user.id)
                        save_notification(activity.user, activity.activity, activity, "activity_alert")
                    else:
                        print(current_time,":","failed to push activity alert notification to the user:", activity.user.id)

def sync_recommandation_notification():
    recommandation_time_list = [module.datetime.datetime.strptime("09:00", "%H:%M").time(), module.datetime.datetime.strptime("13:00", "%H:%M").time(), module.datetime.datetime.strptime("17:00", "%H:%M").time()]
    if current_time.time() in recommandation_time_list:
        user_list = list(Activity.objects.all().values_list('favourite', flat=True).distinct())
        try:
            user_list.remove(None)
        except:
            pass
        if not user_list:
            print(f"{current_time}: No activities alert at this moment...\n")

        user_list = module.User.objects.filter(id__in=user_list)
        for user in user_list:
            if user.device_token:
                if module.UserPriority.objects.filter(user=user).exists():
                    user_priority = module.UserPriority.objects.get(user=user)
                    # check for user DND is on or not
                    if (user_priority.notification_resume_time and user_priority.notification_resume_time.timestamp()<=module.get_current_time().timestamp()) or not user_priority.notification_resume_time:
                        payload = {"title": "New Recommendation", "body": "There is a similar activity to what you have liked, would you like to try it?", "notification_type": "recommandation"}
                        notification_pushed = push_firebase_message(payload["title"], payload["body"], user.device_token, payload)
                        if notification_pushed:
                            print(current_time,":","pushed recommandation notification to the user:", user.id)
                            save_notification(user, None, None, "recommandation")
                        else:
                            print(current_time,":","failed to push recommandation notification to the user:", user.id)

def push_notifications():
    try:
        sync_activity_alert_notification()
        sync_budget_update_notification()
        sync_recommandation_notification()
    except Exception as e:
        print(f"{current_time}:{e}")