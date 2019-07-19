from django.shortcuts import render
from django.http import HttpResponse, JsonResponse, QueryDict
from transaction.models import Transaction
from django.views import View
from django.utils.dateparse import parse_date

# Create your views here.

class TransactionView(View):
    def get(self, request):
        transaction_list = Transaction.objects.order_by('-date').select_related()
        context = {
            'title': 'Transaction List',
            'resource': 'transaction',
            'fields': ['id', 'paypal', 'member', 'amount', 'description', 'date'],
            'list': transaction_list
        }
        return render(request, 'resource_list.html', context)

    def post(self, request):
        data = request.POST
        paypal = data.get('paypal')
        member = data.get('member')
        amount = data.get('amount')
        description = data.get('description')
        date_str = data.get('date')
        transaction = Transaction(
            paypal = paypal,
            member = member,
            amount = amount,
            description = description,
            date = parse_date(date_str)
        )
        transaction.save()
        data = {'success': True, 'id': transaction.id}
        return JsonResponse(data)

    def put(self, request, id):
        transaction = Transaction.objects.get(pk=id)
        
        data = QueryDict(request.body)
        transaction.paypal = data.get('paypal')
        transaction.member = data.get('member')
        transaction.amount = data.get('amount')
        transaction.description = data.get('description')
        transaction.date_str = data.get('date')

        transaction.save()
        data = {'success': True, 'id': transaction.id}
        return JsonResponse(data)

    def delete(self, request, id):
        transaction = Transaction.objects.get(pk=id)
        transaction.delete()
        data = {'success': True}
        return JsonResponse(data)

