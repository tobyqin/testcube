from .views import ProfileViewSet, TaskViewSet


def api_registration(router):
    router.register('profiles', ProfileViewSet)
    router.register('tasks', TaskViewSet)
