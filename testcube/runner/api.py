from .views import ProfileViewSet, TaskViewSet


def api_registration(router):
    router.register('profile', ProfileViewSet)
    router.register('task', TaskViewSet)
