from django.shortcuts import render, redirect, resolve_url

from .models import TestRun
from ..utils import read_document


def index(request):
    if TestRun.objects.count() > 0:
        return redirect(resolve_url('runs'))
    else:
        return redirect(resolve_url('welcome'))


def welcome(request):
    return render(request, 'welcome.html')


def document(request, name):
    content = read_document(name)
    return render(request, 'document.html', {'content': content, 'name': name})


def runs(request):
    return render(request, 'runs.html')


def cases(request):
    return render(request, 'testcases.html')


def run_detail(request, run_id):
    if request.method == 'GET':
        outcome = request.GET.get('outcome', default='')
        return render(request, 'run_detail.html', {'run_id': run_id,
                                                   'outcome': outcome})


def result_detail(request, result_id):
    if request.method == 'GET':
        return render(request, 'result_detail.html', {'result_id': result_id})
