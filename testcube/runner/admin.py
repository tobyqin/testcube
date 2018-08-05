from django.contrib import admin

from .models import *


@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = ('product', 'command', 'updated_on')


@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    list_display = ('description', 'object_name', 'object_id', 'status', 'updated_on')
