from django.contrib import admin

from .models import *


@admin.register(Configuration)
class ConfigAdmin(admin.ModelAdmin):
    list_display = ('key', 'value', 'created_on')


@admin.register(Team)
class TeamAdmin(admin.ModelAdmin):
    list_display = ('name', 'owner', 'created_on')


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'version', 'owner', 'created_on')


@admin.register(TestRun)
class TestRunAdmin(admin.ModelAdmin):
    list_display = ('product', 'name', 'start_time', 'state', 'status')


@admin.register(TestCase)
class TestCaseAdmin(admin.ModelAdmin):
    list_display = ('product', 'name', 'priority', 'owner', 'updated_on')
