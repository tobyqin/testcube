from django.contrib.auth import login, authenticate, logout
from django.contrib.auth.forms import AuthenticationForm
from django.shortcuts import render, redirect

from .forms import SignUpForm
from ..utils import get_domain


def signup(request):
    if request.method == 'POST':
        form = SignUpForm(request.POST)
        if form.is_valid():
            form.save()
            username = form.cleaned_data.get('username')
            raw_password = form.cleaned_data.get('password1')
            user = authenticate(username=username, password=raw_password)
            login(request, user)
            return redirect('/')
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
                return redirect('/')
            else:
                form.add_error('username', 'Invalid username or password!')
    else:
        form = AuthenticationForm()
    return render(request, 'signin.html', {'form': form})


def signout(request):
    logout(request)
    return redirect('/')


def reset_password(request):
    pass


def user_profile(request, username):
    pass
