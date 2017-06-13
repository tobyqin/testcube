from django.shortcuts import render, redirect, resolve_url

from .models import TestRun
from ..utils import read_document


def index(request):
    if TestRun.objects.count() > 0:
        return runs(request)
    else:
        return redirect(resolve_url('welcome'))


def welcome(request):
    return render(request, 'welcome.html')


def document(request, name):
    content = read_document(name)
    return render(request, 'document.html', {'content': content, 'name': name})


def runs(request):
    return render(request, 'runs.html')
