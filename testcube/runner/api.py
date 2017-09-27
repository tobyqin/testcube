from .views import *


def register_runner_api(router):
    router.register('profile', ProfileViewSet)
    router.register('task', TaskViewSet)

    return router
