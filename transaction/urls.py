from django.urls import path

from transaction.views import TransactionView

urlpatterns = [
    path('', TransactionView.as_view()),
    path('<int:id>', TransactionView.as_view()),
]
