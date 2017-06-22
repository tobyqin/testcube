from rest_framework import routers


def api_registration():
    from ...users.api import UserViewSet
    from .views import (ProductViewSet, TeamViewSet, ConfigurationViewSet,
                        TestRunViewSet, TestClientViewSet, TestCaseViewSet,
                        TestResultViewSet, IssueViewSet, ResultAnalysisViewSet,
                        ResultErrorViewSet)

    router = routers.DefaultRouter()
    router.register('teams', TeamViewSet)
    router.register('products', ProductViewSet)
    router.register('runs', TestRunViewSet)
    router.register('cases', TestCaseViewSet)
    router.register('results', TestResultViewSet)
    router.register('clients', TestClientViewSet)
    router.register('issues', IssueViewSet)
    router.register('analysis', ResultAnalysisViewSet)
    router.register('errors', ResultErrorViewSet)
    router.register('users', UserViewSet)
    router.register('configurations', ConfigurationViewSet)

    return router
