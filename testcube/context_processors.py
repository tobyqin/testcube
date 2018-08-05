from testcube.settings import VERSION


def settings_context_processor(request):
    return {
        'version': VERSION
    }
