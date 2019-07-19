from django.urls import path

from dashboard.views import DashboardIndividualView

urlpatterns = [
    path('', DashboardIndividualView.as_view()),
]
