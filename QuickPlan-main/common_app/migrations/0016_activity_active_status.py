# Generated by Django 3.2.18 on 2023-03-28 06:42

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('common_app', '0015_auto_20230328_0431'),
    ]

    operations = [
        migrations.AddField(
            model_name='activity',
            name='active_status',
            field=models.BooleanField(default=True),
        ),
    ]
