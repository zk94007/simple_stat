from django.shortcuts import render
from django.views import View
from transaction.models import Transaction
from paypal.models import Paypal
from django.db.models import Sum
from datetime import datetime, timedelta

# Create your views here.
class DashboardIndividualView(View):
    def get(self, request):
        rtype = request.GET.get('rtype');
        start = request.GET.get('start');
        end = request.GET.get('end');
        paypal = request.GET.get('paypal');

        result = [];
        now = datetime.today()

        if (not rtype):
            rtype = 'individual'
        if (not end):
            end = now.strftime('%Y-%m-%d')
        if (not start):
            start = (now - timedelta(days=30)).strftime('%Y-%m-%d')
        if (not paypal):
            paypal = -1
        else:
            paypal = int(paypal)
        
        if (rtype == 'individual'):
            result = Transaction.objects.values('member__name').annotate(total_price=Sum('amount')).filter(date__range=[start, end]).order_by('-total_price')
        if (rtype == 'group'):
            result = Transaction.objects.values('member__group').annotate(total_price=Sum('amount')).filter(date__range=[start, end]).order_by('-total_price')
        if (rtype == 'paypal'):
            result = Transaction.objects.order_by('-date').filter(date__range=[start,end])
            if (paypal != -1):
                result = result.filter(paypal=paypal)
        
        paypal_list = Paypal.objects.all()
        context = {
            'list': result,
            'rtype': rtype,
            'start': start,
            'end': end,
            'paypal': paypal,
            'paypal_list': paypal_list
        }
        return render(request, 'dashboard.html', context)
