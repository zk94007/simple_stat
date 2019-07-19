from django.shortcuts import render
from django.views import View
from member.models import Member
from django.http import JsonResponse, QueryDict

# Create your views here.
class MemberView(View):
    def get(self, request):
        member_list = Member.objects.order_by('name')
        context = {
            'title': 'Member List',
            'resource': 'member',
            'fields': ['id', 'name', 'group'],
            'list': member_list
        }
        return render(request, 'resource_list.html', context)

    def post(self, request):
        name = request.POST.get('name')
        group = request.POST.get('group')
        member = Member(name=name, group=group)
        member.save()
        data = {'success': True, 'id': member.id}
        return JsonResponse(data)

    def put(self, request, id):
        member = Member.objects.get(pk=id)
        data = QueryDict(request.body)
        member.name = data.get('name')
        member.group = data.get('group')
        member.save()
        data = {'success': True, 'id': member.id}
        return JsonResponse(data)

    def delete(self, request, id):
        member = Member.objects.get(pk=id)
        member.delete()
        data = {'success': True}
        return JsonResponse(data)
