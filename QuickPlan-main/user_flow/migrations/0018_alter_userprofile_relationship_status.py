# Generated by Django 3.2.18 on 2023-03-06 05:59

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('user_flow', '0017_userpriority'),
    ]

    operations = [
        migrations.AlterField(
            model_name='userprofile',
            name='relationship_status',
            field=models.CharField(choices=[('single', 'single'), ('relationship', 'relationship'), ('parents', 'parents')], default='single', max_length=20),
        ),
    ]
