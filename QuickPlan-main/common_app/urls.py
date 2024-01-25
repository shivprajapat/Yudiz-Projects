from django.urls import path
from common_app import views

urlpatterns = [
   path('recommand-activities', views.RecommandActivities.as_view(), name='recommand-activities'),
   path('get-mood-list', views.GetMoodList.as_view(), name='get-mood-list'),
   path('get-budget-list', views.GetBudgetList.as_view(), name='get-mood-list'),
   path('get-time-list', views.GetTimeList.as_view(), name='get-mood-list'),
   path('refresh-recommandation', views.RefreshRecommandation.as_view(), name='refresh-recommandation'),
   path('get-more-details/<int:id>', views.GetActivity.as_view(), name='get-activity'),
]