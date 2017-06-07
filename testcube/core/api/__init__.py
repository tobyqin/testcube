from rest_framework import routers


def api_registration():
    from .restful import ProductViewSet, ProjectViewSet, ConfigurationViewSet, TestRunViewSet
    from ...users.api import UserViewSet

    router = routers.DefaultRouter()
    router.register('projects', ProjectViewSet)
    router.register('products', ProductViewSet)
    router.register('runs', TestRunViewSet)
    router.register('users', UserViewSet)
    router.register('configurations', ConfigurationViewSet)

    return router
