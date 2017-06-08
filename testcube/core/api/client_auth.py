"""
Will provide auth to testcube clients, will not expose such API to all users.
"""

from django.contrib.auth.models import User
from django.http import JsonResponse, HttpResponseBadRequest
from django.views.decorators.csrf import csrf_exempt
from ipware.ip import get_ip


@csrf_exempt
def register(request):
    """To register a new client, must provide a token"""
    if request.method == 'POST':
        data = request.POST
        token = data.get('token')
        assert isinstance(token, str), 'invalid token!'

        if token.startswith('testcube_client'):
            client_name = data.get('client_name')
            client_user = data.get('client_user')
            client_ip = get_ip(request)
            username = '__<{}>__'.format(client_name)
            email = '{}@testcube.client'.format(client_name.lower())

            user, created = User.objects.update_or_create(username=username,
                                                          defaults={'email': email,
                                                                    'first_name': client_user,
                                                                    'last_name': client_ip})
            if user:
                assert isinstance(user, User)
                user.set_password(token)
                user.save()

                return JsonResponse({'client': user.username, 'token': token, 'first_time_register': created})

    return HttpResponseBadRequest('Failed to register testcube!')
