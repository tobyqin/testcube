"""
Will provide auth to testcube clients, will not expose such API to all users.
"""

import re
import uuid

from django.contrib.auth.models import User
from django.http import JsonResponse, HttpResponseBadRequest, HttpResponse
from django.views.decorators.csrf import csrf_exempt
from ipware.ip import get_ip

from testcube.core.models import TestClient

version = '1.2'


@csrf_exempt
def register(request):
    """To register a new client, must provide a token"""
    if request.method == 'POST':
        data = request.POST
        client_type = data.get('client_type')
        pattern = r'testcube_([\d\w]+)_client'
        match = re.search(pattern, client_type)

        if match:
            client_type = match.group(1)
            client_name = data.get('client_name')
            client_user = data.get('client_user')
            client_ip = get_ip(request)
            username = '_<{}>_'.format(client_name)
            email = '{}@{}.client'.format(client_name, client_type).lower()

            user, created = User.objects.update_or_create(
                username=username,
                defaults={'email': email,
                          'first_name': client_user,
                          'last_name': client_ip})
            if user:
                token = uuid.uuid4()
                user.set_password(token)
                user.save()

                TestClient.objects.update_or_create(
                    name=client_name,
                    defaults={'ip': client_ip,
                              'platform': data.get('platform'),
                              'owner': client_user})

                return JsonResponse(
                    {'client': user.username,
                     'token': token,
                     'first_time_register': created})

    else:
        return HttpResponse(content=version)

    return HttpResponseBadRequest('Failed to register testcube!')
