from django.db import models
from django.contrib.auth.models import User
from datetime import datetime
import os

# Create your models here.

#~ Function that create a p_img path for every users
def profile_img_directory(instance,filename):
    extension = filename.split('.')[-1] # get the img extension ~jpg, png etc
    foldername = f'{instance.user.id}'
    filename = f'{instance.user.username}.{extension}'
    return f'profile_img/{foldername}/{filename}'

class CustomUser(models.Model):
    user = models.OneToOneField(User, verbose_name=("User_Table"), on_delete=models.CASCADE)
    #~ extra fields
    birth_date = models.DateField(null=True, blank=True, auto_now=False, auto_now_add=False)
    city = models.CharField('Sehir', null=True, blank=True, max_length=30)
    profile_img = models.ImageField('profil_resmi', upload_to=profile_img_directory, height_field=None, width_field=None, max_length=None, default='profile_img/default/avatar.png')

    def __str__(self):
        return self.user.username
    
    def calculate_age (self):
        if self.birth_date:
            today = datetime.today()
            user_age = today.year - self.birth_date.year - ((today.month, today.day) < (self.birth_date.month, self.birth_date.day))
            return user_age
        else:
            return None

    def save(self):
        if self.pk:
            try:
                old_file = CustomUser.objects.get(pk=self.pk)
                if old_file.profile_img and self.profile_img != old_file.profile_img:
                    # delete old profile img
                    os.remove(old_file.profile_img.path)
            except CustomUser.DoesNotExist:
                pass
        super().save()

#+ Product Category Table
class Category(models.Model):
    category_name = models.CharField('kategori adi', max_length=50, unique=True)

    def __str__(self):
        return self.category_name
    
#+ Product Special States
class SpecialStatus(models.Model):
    states = models.CharField('Ozel durum', max_length=50, unique=True)

    def __str__(self):
        return self.states
    
#+ Product Table Model
class Products(models.Model):
    p_name = models.CharField('urun adi', max_length=50)
    p_description = models.TextField('urun aciklamasi')
    p_information = models.TextField('urun bilgileri')
    p_price = models.DecimalField('urun fiyati', max_digits=10, decimal_places=2)
    p_category = models.ForeignKey(Category, on_delete=models.CASCADE)
    p_special_status = models.ManyToManyField(SpecialStatus, blank=True)
    p_img = models.ImageField('urun resmi', upload_to='', max_length=300, null=True)

    def __str__(self):
        return self.p_name
    
#+ Product Comments Model
class ProductComments(models.Model):
    product = models.ForeignKey(Products, related_name='comments', on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE, blank=True, null=True)
    comment = models.TextField('kullanici yorumu')
    city = models.CharField('Sehir', null=True, blank=True, max_length=30)
    time_stamp = models.DateTimeField('yorum kayit tarihi', auto_now_add=True)

    def __str__(self):
        if self.user:
            return f'Comment by {self.user.username} on {self.product.p_name}/{self.product.id}'
        else:
            return f'Anonymous comment on {self.product.p_name}/{self.product.id}'

    def save(self):
        if not self.city and self.user and self.user.is_authenticated:
            self.city = self.user.customuser.city
            
        super().save()

    # def save(self):
    #     if not self.city and self.user.is_authenticated:
    #         self.city = self.user.city
    #     super().save()
