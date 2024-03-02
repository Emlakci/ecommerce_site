# Generated by Django 4.2.8 on 2024-02-20 22:59

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('userApp', '0006_remove_productcomments_product_and_more'),
    ]

    operations = [
        migrations.CreateModel(
            name='Category',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('category_name', models.CharField(max_length=50, unique=True, verbose_name='kategori adi')),
            ],
        ),
        migrations.CreateModel(
            name='SpecialStatus',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('states', models.CharField(max_length=50, unique=True, verbose_name='Ozel durum')),
            ],
        ),
        migrations.CreateModel(
            name='Products',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('p_name', models.CharField(max_length=50, verbose_name='urun adi')),
                ('p_description', models.TextField(verbose_name='urun aciklamasi')),
                ('p_information', models.TextField(verbose_name='urun bilgileri')),
                ('p_price', models.DecimalField(decimal_places=2, max_digits=10, verbose_name='urun fiyati')),
                ('p_img', models.ImageField(max_length=300, null=True, upload_to='', verbose_name='urun resmi')),
                ('p_category', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='userApp.category')),
                ('p_special_status', models.ManyToManyField(blank=True, to='userApp.specialstatus')),
            ],
        ),
        migrations.CreateModel(
            name='ProductComments',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('comment', models.TextField(verbose_name='kullanici yorumu')),
                ('city', models.CharField(blank=True, max_length=30, null=True, verbose_name='Sehir')),
                ('time_stamp', models.DateTimeField(auto_now_add=True, verbose_name='yorum kayit tarihi')),
                ('product', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='comments', to='userApp.products')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]