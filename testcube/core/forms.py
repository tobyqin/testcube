from django import forms

from .models import ResultAnalysis, Issue, TestResult, TestCase, Product, ResetResult
from ..runner.models import Profile, Task


class AnalysisForm(forms.Form):
    reason = forms.IntegerField(label='Reason',
                                widget=forms.Select(choices=ResultAnalysis.REASON_CHOICES))

    issue_id = forms.CharField(label='Issue ID',
                               required=False,
                               widget=forms.TextInput(
                                   attrs={'placeholder': '(Optional) Example: Issue-12345'}))

    description = forms.CharField(label='Description',
                                  required=True,
                                  widget=forms.Textarea(
                                      attrs={'rows': 4,
                                             'placeholder': 'Why the test failed?'}))

    def load(self, result_id):
        """add initial field value when load the form"""
        result = TestResult.objects.get(id=result_id)
        self.need_analysis = result.outcome != 0
        self.fields['reason'].initial = 0
        if result and result.analysis:
            self.result = result

            self.fields['reason'].initial = result.analysis.reason
            self.fields['description'].initial = result.analysis.description
            self.fields['issue_id'].initial = result.issue_id()

    def save(self, result_id, username):
        """
        to save the analysis form, we will:
        1. create analysis object then link to result id
        2. create issue object if issue id was added
        """
        result = TestResult.objects.get(id=result_id)
        self.need_analysis = result.outcome != 0
        if result:
            reason = self.cleaned_data.get('reason')
            description = self.cleaned_data.get('description')
            issue_id = self.cleaned_data.get('issue_id')

            issue = None
            if issue_id:
                issue = Issue.objects.get_or_create(name=issue_id, summary=description)[0]

            data = {'by': username,
                    'reason': reason,
                    'description': description,
                    'issue': issue}

            if not result.analysis:
                analysis = ResultAnalysis.objects.create(**data)
                analysis.save()
                result.analysis = analysis
                result.save()

            else:
                result.analysis.by = username
                result.analysis.reason = reason
                result.analysis.description = description
                result.analysis.issue = issue
                result.analysis.save()

            self.result = result

        else:
            self.add_error('description', 'Bad result id: ' + result_id)


class ResetForm(forms.Form):
    reason = forms.CharField(label='Reason',
                             required=True,
                             widget=forms.TextInput(
                                 attrs={'placeholder': 'Why do you want to reset this result?'}))

    def save(self, result_id, username):
        """
        main reset logic:
        0. check if reset is in progress, return with error message
        1. get reset profile via result/testcase/product/profile
        2. add a reset task in runner/task
        3. add a reset result in core/reset_result with [in progress] status
        """
        result = TestResult.objects.get(id=result_id)

        if result.is_reset_in_progress():
            self.add_error('reason', 'Reset is in progress, please wait...')
            return

        profile = result.get_reset_profile()

        if not profile:
            self.add_error('reason', 'Please configure reset profile at first.')
            return

        # add reset result object
        reset_result = ResetResult(reset_by=username,
                                   reset_reason=self.reason,
                                   reset_status=1,  # in progress
                                   origin_result=result)

        reset_result.save()

        # add reset task object
        task = Task(object_name='TestResult',
                    object_id=result_id,
                    description='ResetResult',
                    command=profile.command,
                    data='')

        task.save()
