from django.contrib.auth import login, authenticate, logout
from django.contrib.auth.forms import AuthenticationForm
from django.shortcuts import render, redirect

from .forms import SignUpForm
from ..utils import get_domain


def to_next_page(request):
    next_page = request.GET.get('next', '/')
    return redirect(next_page)


def signup(request):
    if request.user.is_authenticated():
        return to_next_page(request)

    if request.method == 'POST':
        form = SignUpForm(request.POST)
        if form.is_valid():
            form.save()
            username = form.cleaned_data.get('username')
            raw_password = form.cleaned_data.get('password1')
            user = authenticate(username=username, password=raw_password)
            login(request, user)
            return to_next_page(request)
    else:
        form = SignUpForm()
    return render(request, 'signup.html', {'form': form, 'domain': get_domain()})


def signin(request):
    if request.method == 'POST':
        form = AuthenticationForm(data=request.POST)
        if form.is_valid():
            username = form.cleaned_data.get('username')
            raw_password = form.cleaned_data.get('password')
            user = authenticate(username=username, password=raw_password)
            if user:
                login(request, user)
                return to_next_page(request)
            else:
                form.add_error('username', 'Invalid username or password!')
    else:
        form = AuthenticationForm()
    return render(request, 'signin.html', {'form': form})


def signout(request):
    logout(request)
    return to_next_page(request)


def reset_password(request):
    pass


def user_profile(request, username):
    pass
