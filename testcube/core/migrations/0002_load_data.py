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


class Migration(migrations.Migration):
    dependencies = [
        ('core', '0001_initial')
    ]

    operations = [
        migrations.RunPython(forwards),
    ]
