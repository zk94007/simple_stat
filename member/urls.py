from django.urls import path

from member.views import MemberView

urlpatterns = [
    path('', MemberView.as_view()),
    path('<int:id>', MemberView.as_view()),
]
