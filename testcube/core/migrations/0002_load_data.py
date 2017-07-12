from django.contrib.auth.hashers import make_password
from django.db import migrations


def forwards(apps, schema_editor):
    Configuration = apps.get_model('core', 'Configuration')
    db_alias = schema_editor.connection.alias
    Configuration.objects.using(db_alias).bulk_create([
        Configuration(key='domain', value='company.com'),
        Configuration(key='menu_link', value='Link1|http://your-url.com'),
        Configuration(key='menu_link', value='Link2|http://your-url.com'),
        Configuration(key='menu_link', value='Link3|http://your-url.com'),
    ])

    User = apps.get_model('auth', 'User')
    User.objects.using(db_alias).create(username='admin',
                                        email='admin@testcube',
                                        password=make_password('admin'),
                                        is_staff=True,
                                        is_superuser=True)


class Migration(migrations.Migration):
    dependencies = [
        ('core', '0001_initial')
    ]

    operations = [
        migrations.RunPython(forwards),
    ]
