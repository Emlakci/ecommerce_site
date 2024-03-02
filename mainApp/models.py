from django.db import models
from django.contrib.auth.models import User


# Create your models here.
class Contact(models.Model):
    name = models.TextField("isim", max_length=50)
    surname = models.TextField("soy isim", max_length=50)
    email = models.EmailField("email", max_length=254)
    phone = models.CharField("telefon numarasi", max_length=50)
    message = models.TextField("mesaj notu")
    time_stamp = models.DateTimeField('yorum kayit tarihi', auto_now_add=True, null=True)

    def __str__(self):
        return self.name