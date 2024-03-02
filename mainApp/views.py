from django.shortcuts import render
from django.contrib.auth.models import AnonymousUser
from django.http import HttpResponseRedirect
from django.urls import reverse
from userApp.models import *
from mainApp.models import *

# Create your views here.

def indexPage(request):
    products = Products.objects.all()
    context={
        'products' : products,
    }

    request.session['visited_home'] = True
    return render(request, 'index.html', context)

def contactPage(request):
    if request.method == 'POST':
        name = request.POST.get('f-name')
        surname = request.POST.get('l-name')
        email = request.POST.get('email')
        phone = request.POST.get('phone')
        message = request.POST.get('message')

        if name and surname and email and phone and message :
            post = Contact(name=name, surname=surname, email=email, phone=phone, message=message)
            post.save()     

    user = request.user
    auth_user = CustomUser.objects.get(pk=user.id)

    context={
        'auth_user' : auth_user,
    }
    return render(request, 'contactPage.html', context)

def productDetailPage(request, productId, userId=None):
    try:
        selected_product = Products.objects.get(id=productId)
        posts = ProductComments.objects.filter(product=productId)
        user = request.user
        if request.method == 'POST':
            text = request.POST.get('comment')
            if text:
                city = request.POST.get('city')
                if not request.user.is_authenticated:
                    user=AnonymousUser()
                comment = ProductComments(product=selected_product, comment=text, city=city, user=request.user if request.user.is_authenticated else None)
                comment.save()

                # Redirect to avoid resubmission of form
                return HttpResponseRedirect(reverse('productDetailPage', args=(productId, userId)))
    except Products.DoesNotExist:
        selected_product = None
        posts = None

    context={
        'selected_product' : selected_product,
        'auth_user' : user,
        'posts' : posts,
    }
    return render(request, 'productDetailPage.html', context)

def error_404(request):
    return render(request, 'error/error404.html' )