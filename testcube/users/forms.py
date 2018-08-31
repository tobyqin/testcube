from django import forms
from django.contrib.admin.models import LogEntry, CHANGE
from django.contrib.admin.options import get_content_type_for_model
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User
from django.db.models import Q

from testcube.utils import get_domain


class SignUpForm(UserCreationForm):
    email = forms.EmailField(max_length=254, required=True)

    class Meta:
        model = User
        fields = ('username', 'email', 'password1', 'password2',)

    def __init__(self, *args, **kwargs):
        super(UserCreationForm, self).__init__(*args, **kwargs)
        self.fields['username'].widget.attrs.update({'autofocus': True})
        self.fields['email'].widget.attrs.update({'data-text': get_domain()})

        for name in ['username', 'password1', 'password2']:
            self.fields[name].help_text = ''


class UserProfileForm(forms.ModelForm):
    class Meta:
        model = User
        fields = ('username', 'first_name', 'last_name')

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['username'].widget.attrs['readonly'] = True

        for name in ['username', ]:
            self.fields[name].help_text = ''


class ResetPasswordForm(forms.ModelForm):
    reset_user = forms.CharField(label='Username or Email', strip=True)
    password1 = forms.CharField(label='New Password', widget=forms.PasswordInput, strip=False)
    password2 = forms.CharField(label='Password Confirm', widget=forms.PasswordInput, strip=False)
    user_instance = None

    class Meta:
        model = User
        fields = ('username',)

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['username'].widget.attrs['readonly'] = True

        for name in ['username', ]:
            self.fields[name].help_text = 'Your user name will be recorded when reset password for others.'
            self.fields[name].label = 'Operator'

    def _post_clean(self):
        super()._post_clean()
        reset_name = self.cleaned_data.get('reset_user')
        self.user_instance = User.objects.filter(Q(username=reset_name) | Q(email=reset_name)).first()

        if not self.user_instance:
            self.add_error('reset_user', 'Cannot find the user in system.')
            return

        password1 = self.cleaned_data.get('password1')
        password2 = self.cleaned_data.get('password2')
        if password1 != password2:
            self.add_error('password2', 'Password does not match!')

    def save(self, commit=True):
        if self.user_instance:
            assert isinstance(self.user_instance, User)
            self.user_instance.set_password(self.cleaned_data["password1"])

            if commit:
                self.user_instance.save()
                LogEntry.objects.log_action(
                    user_id=self.instance.pk,
                    content_type_id=get_content_type_for_model(self.user_instance).pk,
                    object_id=self.user_instance.pk,
                    object_repr='Reset password for {}'.format(self.user_instance.username),
                    action_flag=CHANGE,
                    change_message='Password reset by"{}"'.format(self.instance.username)
                )
            return self.user_instance
