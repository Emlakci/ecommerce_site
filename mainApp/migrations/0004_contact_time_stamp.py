# Generated by Django 4.2.8 on 2024-02-23 11:06

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('mainApp', '0003_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='contact',
            name='time_stamp',
            field=models.DateTimeField(auto_now_add=True, null=True, verbose_name='yorum kayit tarihi'),
        ),
    ]