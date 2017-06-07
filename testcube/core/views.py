from django.shortcuts import render, redirect, resolve_url

from ..utils import read_document


def index(request):
    return redirect(resolve_url('welcome'))


def welcome(request):
    return render(request, 'welcome.html')


def document(request, name):
    content = read_document(name)
    return render(request, 'document.html', {'content': content, 'name': name})
