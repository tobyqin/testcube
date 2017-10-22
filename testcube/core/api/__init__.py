def api_registration(router):
    from ...users.api import UserViewSet
    from .views import (ProductViewSet, TeamViewSet, ConfigurationViewSet,
                        TestRunViewSet, TestClientViewSet, TestCaseViewSet,
                        TestResultViewSet, IssueViewSet, ResultAnalysisViewSet,
                        ResultErrorViewSet, ObjectSourceViewSet, ResultFileViewSet,
                        ResetResultViewSet)

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
    router.register('object_sources', ObjectSourceViewSet)
    router.register('result_files', ResultFileViewSet)
    router.register('reset_results', ResetResultViewSet)

    return router
