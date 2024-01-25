from django.urls import path
from user_flow import views

urlpatterns = [
   # -------------    User Authentication  --------------# 

   path('create-user', views.CreateUser.as_view(), name='create-user'),
   path('validate-user', views.ValidateUser.as_view(), name='validate-user'),
   path('send-verification-otp', views.SendVerificationOTP.as_view(), name='send-verification-otp'),
   path('user-login', views.UserLogin.as_view(), name='user-login'),
   path('user-social-login', views.UserSocialLogin.as_view(), name='user-social-login'),
   path('send-reset-password-otp', views.SendResetPasswordOTP.as_view(), name='send-reset-password-otp'),
   path('reset-password', views.ResetPassword.as_view(), name='reset-user-password'),
   path('update-password', views.UpdatePassword.as_view(), name='update-password'),
   path('delete-user', views.UserDelete.as_view(), name='delete-user'),
   path('logout-user', views.UserLogout.as_view() , name='logout-user'),


   # -------------    User  --------------#
   path('list-users', views.ListUsers.as_view(), name='list-users'),
   path('get-user', views.GetUser.as_view(), name='get-user'),

   # -------------    UserProfile  --------------#
   path('update-user-profile', views.UpdateUserProfile.as_view(), name='update-user-profile'),

   # -------------    UserTodayPlan  --------------#
   path('get-today-plan', views.GetTodayPlan.as_view(), name='get-today-plan'),

   # -------------    Favourite  --------------#
   path('update-favourite', views.UpdateFavourite.as_view(), name='update-favourite'),
   path('get-favourite-list', views.GetFavouriteList.as_view(), name='get-favourite-list'),

   # -------------    UserActivity  --------------#
   path('update-user-activity', views.UpdateUserActivity.as_view(), name='update-user-activity'),

   # ------------ MyActivities ---------------#
   path('my-activities', views.MyActivities.as_view(), name='my-activities'),
   
   # ------------ Spending ---------------#
   path('get-today-spending', views.GetTodaySpending.as_view(), name='get-today-spending'),
   path('last-week-spending', views.LastWeekSpending.as_view(), name='last-week-spending'),

   # ------------ AddActivitySpent ---------------#
   path('add-activity-spent', views.AddActivitySpent.as_view(), name='add-activity-spent'),

   # ------------ Activity Dashboard ---------------#
   path('activity-dashboard', views.ActivityDashboard.as_view(), name='activity-dashboard'),

   # ------------ Todays Activity ---------------#
   path('today-activities', views.TodayActivities.as_view(), name='today-activities'),

   path('upload-image', views.UploadImage.as_view(), name='upload-image'), 

   path('set-dnd', views.SetDND.as_view(), name="set-dnd"),

   path('update-user-device', views.UpdateUserDevice.as_view(), name="update-user-device"),
   
   path('user-notifications', views.GetUserNotifications.as_view(), name="user-notifications"),

   path('user-recommandation', views.GetUserRecommandation.as_view(), name="user-recommandation"),

   path('push-notification', views.PushNotification.as_view(), name="push-notification"),

   path('save-previous-recommandation', views.SavePreviousRecommandation.as_view(), name="save-previous-recommandation"),
   
   path('get-previous-recommandation', views.GetPreviousRecommandation.as_view(), name="get-previous-recommandation")
]