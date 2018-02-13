import re

from django.shortcuts import render, redirect, resolve_url, HttpResponse
from django.utils.http import urlquote

from testcube.settings import logger
from .forms import AnalysisForm, ResetForm
from .models import TestRun, ObjectSource
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
    source = request.GET.get('source', default=None)
    if source:
        source = re.sub('^(http[s]*:\/\/[^\/]+)', '', source)
        found = ObjectSource.objects.filter(link__contains=urlquote(source)).first()

        if found:
            return redirect('/runs/{}'.format(found.testrun.id))

    return render(request, 'runs.html')


def cases(request):
    return render(request, 'testcases.html')


def results(request):
    return render(request, 'results.html')


def run_detail(request, run_id):
    if request.method == 'GET':
        source = ObjectSource.objects.filter(testrun__id=run_id).first()
        return render(request, 'run_detail.html', {'run_id': run_id,
                                                   'source': source})


def case_detail(request, case_id):
    if request.method == 'GET':
        return render(request, 'testcase_detail.html', {'case_id': case_id})


def result_detail(request, result_id):
    result_id = int(result_id)

    analysis_form = AnalysisForm()
    analysis_form.load(result_id)
    reset_form = ResetForm()
    return render(request, 'result_detail.html', {'result_id': result_id,
                                                  'analysis_form': analysis_form,
                                                  'reset_form': reset_form})


def result_analysis(request, result_id):
    """POST view for result analysis"""
    result_id = int(result_id)

    if request.method == 'POST':
        form = AnalysisForm(data=request.POST)

        if form.is_valid():
            if request.user.is_authenticated:
                form.save(result_id, request.user.username)
            else:
                form.add_error('description', 'Login required.')

        if form.errors:
            errors = [m[0] for e, m in form.errors.items()]
            message = ', '.join(errors)
            return HttpResponse(content=message, status=400)
        else:
            return HttpResponse(content='Analyzed just now.')


def result_reset(request, result_id):
    """POST view for result reset"""
    result_id = int(result_id)

    if request.method == 'POST':
        form = ResetForm(data=request.POST)

        if form.is_valid():
            if request.user.is_authenticated:
                form.save(result_id, request.user.username)
            else:
                form.add_error('reason', 'Login required.')

        if form.errors:
            errors = [m[0] for e, m in form.errors.items()]
            message = ', '.join(errors)
            return HttpResponse(content=message, status=400)
        else:
            return HttpResponse(content='Reset task submitted, please wait.')
