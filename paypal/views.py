from django.shortcuts import render
from django.http import HttpResponse, JsonResponse, QueryDict
from paypal.models import Paypal
from django.views import View
from django.core import serializers

# Create your views here.

class PaypalView(View):
    def get(self, request):
        paypal_list = Paypal.objects.order_by('email')
        context = {
            'title': 'Paypal List',
            'resource': 'paypal',
            'fields': ['id','email'],
            'list': paypal_list
        }
        return render(request, 'resource_list.html', context)

    def post(self, request):
        email = request.POST.get('email')
        paypal = Paypal(email= email)
        paypal.save()
        data = {'success': True, 'id': paypal.id}
        return JsonResponse(data)

    def put(self, request, id):
        paypal = Paypal.objects.get(pk=id)
        data = QueryDict(request.body)
        paypal.email = data.get('email')
        paypal.save()
        data = {'success': True, 'id': paypal.id}
        return JsonResponse(data)

    def delete(self, request, id):
        paypal = Paypal.objects.get(pk=id)
        paypal.delete()
        data = {'success': True}
        return JsonResponse(data)

class PaypalAjaxView(View):
    def get(self, request):
        paypal_list = Paypal.objects.order_by('email')
        return JsonResponse(serializers.serialize('json', paypal_list), safe=False)
