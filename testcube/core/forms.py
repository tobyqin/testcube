from django import forms

from .models import ResultAnalysis, Issue, TestResult


class AnalysisForm(forms.Form):
    reason = forms.IntegerField(label='Reason',
                                widget=forms.Select(choices=ResultAnalysis.REASON_CHOICES))

    issue_id = forms.CharField(label='Issue ID', required=False)

    description = forms.CharField(label='Description',
                                  widget=forms.Textarea, required=True)

    def load(self, result_id):
        result = TestResult.objects.get(id=result_id)
        self.fields['reason'].initial = 0
        if result and result.analysis:
            self.fields['reason'].initial = result.analysis.reason
            self.fields['description'].initial = result.analysis.description
            self.fields['issue_id'].initial = result.issue_id()

    def save(self, result_id, username):
        result = TestResult.objects.get(id=result_id)
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



        else:
            self.add_error('description', 'Bad result id: ' + result_id)
