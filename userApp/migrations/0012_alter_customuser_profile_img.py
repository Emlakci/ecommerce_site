# Generated by Django 4.2.8 on 2024-03-02 21:02

from django.db import migrations, models
import userApp.models


class Migration(migrations.Migration):

    dependencies = [
        ('userApp', '0011_alter_customuser_profile_img'),
    ]

    operations = [
        migrations.AlterField(
            model_name='customuser',
            name='profile_img',
            field=models.ImageField(default='profile_img/default/avatar.png', upload_to=userApp.models.profile_img_directory, verbose_name='profil_resmi'),
        ),
    ]