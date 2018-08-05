from .views import ProfileViewSet, TaskViewSet, RunVariablesViewSet


def api_registration(router):
    router.register('run_variables', RunVariablesViewSet)
    router.register('profiles', ProfileViewSet)
    router.register('tasks', TaskViewSet)
