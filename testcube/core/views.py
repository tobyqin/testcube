from django.shortcuts import render, redirect, resolve_url

from testcube.settings import logger
from .forms import AnalysisForm
from .models import TestRun
from ..utils import read_document


def index(request):
    if TestRun.objects.count() > 0:
        return redirect(resolve_url('runs'))
    else:
        return redirect(resolve_url('welcome'))


def welcome(request):
    logger.debug('visit welcome view.')
    return render(request, 'welcome.html')


def document(request, name):
    content = read_document(name)
    return render(request, 'document.html', {'content': content, 'name': name})


def runs(request):
    return render(request, 'runs.html')


def cases(request):
    return render(request, 'testcases.html')


def results(request):
    return render(request, 'results.html')

def run_detail(request, run_id):
    if request.method == 'GET':
        outcome = request.GET.get('outcome', default='')
        return render(request, 'run_detail.html', {'run_id': run_id,
                                                   'outcome': outcome})


def case_detail(request, case_id):
    if request.method == 'GET':
        return render(request, 'testcase_detail.html', {'case_id': case_id})


def result_detail(request, result_id):
    result_id = int(result_id)

    if request.method == 'POST':
        form = AnalysisForm(data=request.POST)
        form.by_post = True

        if form.is_valid():
            if request.user.is_authenticated():
                form.save(result_id, request.user.username)
            else:
                form.add_error('description', 'Login required.')


    else:
        form = AnalysisForm()
        form.load(result_id)

    return render(request, 'result_detail.html', {'result_id': result_id, 'form': form})
