from rest_framework import routers


def api_registration():
    from .views import ProductViewSet, ProjectViewSet, ConfigurationViewSet, TestRunViewSet, TestClientViewSet
    from ...users.api import UserViewSet

    router = routers.DefaultRouter()
    router.register('projects', ProjectViewSet)
    router.register('products', ProductViewSet)
    router.register('runs', TestRunViewSet)
    router.register('users', UserViewSet)
    router.register('configurations', ConfigurationViewSet)
    router.register('clients', TestClientViewSet)

    return router
