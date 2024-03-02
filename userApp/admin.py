from django.contrib import admin
from .models import *

# Register your models here.

admin.site.register(Category)
admin.site.register(SpecialStatus)
admin.site.register(Products)
admin.site.register(ProductComments)
admin.site.register(CustomUser)