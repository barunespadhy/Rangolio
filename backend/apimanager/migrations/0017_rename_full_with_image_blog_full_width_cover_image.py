# Generated by Django 5.0.6 on 2024-06-25 10:00

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('apimanager', '0016_blog_full_with_image'),
    ]

    operations = [
        migrations.RenameField(
            model_name='blog',
            old_name='full_with_image',
            new_name='full_width_cover_image',
        ),
    ]
