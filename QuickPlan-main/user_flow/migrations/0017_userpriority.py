# Generated by Django 4.1.7 on 2023-03-03 06:58

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('user_flow', '0016_alter_userprofile_profile_pic'),
    ]

    operations = [
        migrations.CreateModel(
            name='UserPriority',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('activity_priority', models.CharField(choices=[('everyday', 'everyday'), ('weekends', 'weekends')], default='everyday', max_length=10)),
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='UserPriority', to='user_flow.user')),
            ],
        ),
    ]
