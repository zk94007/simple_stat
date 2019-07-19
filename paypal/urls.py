from django.urls import path

from paypal.views import PaypalView, PaypalAjaxView

urlpatterns = [
    path('', PaypalView.as_view()),
    path('<int:id>', PaypalView.as_view()),
    path('ajax', PaypalAjaxView.as_view())
]
