# Generated by Django 3.2.18 on 2023-03-10 07:24

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('common_app', '0006_auto_20230310_0425'),
    ]

    operations = [
        migrations.AlterField(
            model_name='activity',
            name='resident_permit',
            field=models.CharField(choices=[('resident', 'resident'), ('tourist', 'tourist'), ('any', 'any')], default='any', max_length=10),
        ),
    ]
