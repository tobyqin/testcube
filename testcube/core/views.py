from django.shortcuts import render

from ..utils import read_document


def home(request):
    return render(request, 'bootstrap/home.html')


def document(request, name):
    content = read_document(name)
    return render(request, 'bootstrap/document.html', {'content': content, 'name': name})
