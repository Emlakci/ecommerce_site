# Generated by Django 4.2.8 on 2024-02-23 13:34

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('userApp', '0007_category_specialstatus_products_productcomments'),
    ]

    operations = [
        migrations.AlterField(
            model_name='productcomments',
            name='user',
            field=models.ForeignKey(blank=True, on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
        ),
    ]
