# Generated by Django 5.0.6 on 2024-06-25 09:55

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('apimanager', '0015_alter_userdata_dark_theme_alter_userdata_light_theme'),
    ]

    operations = [
        migrations.AddField(
            model_name='blog',
            name='full_with_image',
            field=models.BooleanField(default=True),
        ),
    ]
