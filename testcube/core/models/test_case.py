from django.db import models

from .product import Product


class TestCase(models.Model):
    PRIORITY_CHOICES = ((0, 'Urgent'), (1, 'High'), (2, 'Medium'), (3, 'Low'))

    name = models.CharField(max_length=200)
    full_name = models.CharField(max_length=400, default='')
    keyword = models.CharField(max_length=100, null=True, blank=True)
    priority = models.IntegerField(default=2, choices=PRIORITY_CHOICES)
    description = models.TextField(blank=True)
    owner = models.CharField(max_length=50, blank=True)
    created_by = models.CharField(max_length=50)
    created_on = models.DateTimeField(auto_now_add=True)
    updated_on = models.DateTimeField(auto_now=True)

    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='cases')

    def product_name(self):
        return self.product.name

    def team_name(self):
        return self.product.team.name

    def execution_info(self):
        return {
            'total': self.results.count(),
            'passed': self.results.filter(outcome=0).count(),
            'failed': self.results.filter(outcome=1).count(),
            'other': self.results.filter(outcome__gt=1).count()
        }

    def tags_list(self):
        return ':'.join([t.name for t in getattr(self, 'tags')])

    def stability(self):
        latest_results = self.results.all()[:10]
        passed = len([s for s in latest_results if s.outcome == 0])

        return "%.f%%" % round(passed / len(latest_results) * 100)

    class Meta:
        ordering = ['-id']

    def __str__(self):
        return self.full_name or self.name
