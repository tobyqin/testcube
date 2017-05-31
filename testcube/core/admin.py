from django.contrib import admin

from .models import *


@admin.register(Configuration)
class ConfigAdmin(admin.ModelAdmin):
    list_display = ('key', 'value', 'created_on')


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ('name', 'owner', 'created_on')


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'version', 'owner')


@admin.register(TestRun)
class TestRunAdmin(admin.ModelAdmin):
    pass
