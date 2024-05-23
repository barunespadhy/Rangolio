# Generated by Django 5.0.4 on 2024-05-19 08:22

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('apimanager', '0008_alter_userdata_dark_theme_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='blog',
            name='content_body',
            field=models.CharField(default='<p></p>', max_length=100000),
        ),
        migrations.AlterField(
            model_name='blog',
            name='description',
            field=models.CharField(max_length=200),
        ),
        migrations.AlterField(
            model_name='blog',
            name='name',
            field=models.CharField(max_length=200),
        ),
        migrations.AlterField(
            model_name='blog',
            name='tagline',
            field=models.CharField(max_length=200),
        ),
        migrations.AlterField(
            model_name='category',
            name='description',
            field=models.CharField(max_length=200),
        ),
        migrations.AlterField(
            model_name='category',
            name='name',
            field=models.CharField(max_length=200),
        ),
        migrations.AlterField(
            model_name='category',
            name='tagline',
            field=models.CharField(max_length=200),
        ),
    ]