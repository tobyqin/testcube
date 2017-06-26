from django import forms

from .models import ResultAnalysis, Issue, TestResult


class AnalysisForm(forms.Form):
    reason = forms.CharField(label='Reason',
                             widget=forms.Select(choices=ResultAnalysis.REASON_CHOICES))

    issue_id = forms.CharField(label='Issue ID', required=False)

    description = forms.CharField(label='Description',
                                  widget=forms.Textarea, required=True)

    def load(self, result_id):
        result = TestResult.objects.get(id=result_id)
        self.reason = 0
        if result and result.analysis:
            self.reason = result.analysis.reason
            self.description = result.analysis.description
            self.issue_id = result.issue_id()

    def save(self, result_id, username):
        result = TestResult.objects.get(id=result_id)
        if result:
            reason = self.cleaned_data.get('reason')
            description = self.cleaned_data.get('description')
            issue_id = self.cleaned_data.get('issue_id')

            issue = None
            if issue_id:
                issue = Issue.objects.get_or_create(name=issue_id)

            data = {'by': username,
                    'reason': reason,
                    'description': description,
                    'issue': issue}

            if not result.analysis:
                analysis = ResultAnalysis.objects.create(**data)
                analysis.save()
            else:
                result.analysis.objects.update(**data)
                result.analysis.save()



        else:
            self.add_error('reason', 'Bad result id: ' + result_id)
