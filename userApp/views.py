from django.shortcuts import render, redirect
from django.http import JsonResponse
from django.contrib.auth import login, logout, authenticate
from django.contrib.auth.models import User
from django.contrib.auth.hashers import check_password
from userApp.models import *
from django.contrib.auth.decorators import login_required
# Create your views here.

#~ Function that check if password typed by user is suitable
def checkPassIsSuitable(password):
    include_number = False
    include_upperChar = False
    for char in password:
        if char.isnumeric(): include_number = True
        if char.isupper(): include_upperChar = True 

    if len(password)>=8 and include_number and include_upperChar :
        return True
    else :
        return False
#~ Function that check if password typed by user is suitable
    
@login_required(login_url='loginPage')
def accountPage(request):
    user = request.user
    context={
        'auth_user': user,
    }    

    if request.user.is_authenticated:
        try:
            custom_user = user.customuser
            user_age = custom_user.calculate_age()
       
            context['auth_user_age'] = user_age
        except :
            pass

    if request.method == 'POST':
        print(request.POST)
        changing_value = request.POST.get('changing_value')
        changing_value_2 = request.POST.get('changing_value_2') if 'changing_value_2' in request.POST else None # for updating password
        changingInpName = request.POST.get('hidden_name')
        password = request.POST.get('control_pass')
        
        # if profile img was posted as value  
        if changingInpName == 'profile_img':
            changing_value = request.FILES['changing_value']
        
        # control  process    
        if changing_value and password:
            # check if user password is matched
            if check_password(password, user.password):
                print('access accepted')
                if changingInpName == 'first_name' or changingInpName == 'last_name' or changingInpName == 'username' or changingInpName == 'email':
                    setattr(user, changingInpName, changing_value)
                    user.save()
                    print(getattr(user, changingInpName))
                    return redirect('accountPage') 

                if changingInpName == 'birth_date' or changingInpName == 'city' or changingInpName == 'profile_img':
                    setattr(user.customuser, changingInpName, changing_value)
                    user.customuser.save()
                    print(getattr(user.customuser, changingInpName))
                    return redirect('accountPage')

                if changingInpName == 'password':
                    if changing_value_2 :
                        # check if passwords typed by the user are equal
                        if changing_value == changing_value_2 :
                            # control password
                            if checkPassIsSuitable(changing_value):
                                user.set_password(changing_value)
                                user.save()
                                print(getattr(user, changingInpName))
                                return redirect('loginPage')
                            else: #pass is not suitable
                                print('process failed', 'Sifre kriterlere uygun degil!')
                                message = {'error':'Sifre en az 8 karakter ve bir rakam bir buyuk harf icermelidir!'}
                                return JsonResponse(message, status=406)
                        else: # given pass didn't matched
                            print('process failed', 'Sifreler eslesmedi!')
                            message = {'error':'Girdiginiz sifreler eslesmedi!'}
                            return JsonResponse(message, status=406)
                    else: # user didn't rewrite the password wanted to update     
                        print('process failed', 'Tekrar sifre alani bos!')
                        message = {'error':'Sifrenizi tekrar girin!'}
                        return JsonResponse(message, status=406)

            else:
                print('access denied', 'Sifre eslesmedi!')
                message = {'error':'Sifre eslesmedi'}
                return JsonResponse(message, status=400)

        else:
            print('null values can not be accepted!')
            message = {'error' : 'Alanlari Bos Birakamazsiniz...'}
            return JsonResponse(message, status=406)

    else :
        return render(request, 'accountPage.html', context)

def loginPage(request):
    context={}

    if request.method == 'POST':
       username = request.POST.get('username')
       password = request.POST.get('password')

       print(username, password)
       
       if username and password:
            user = authenticate(username=username, password=password)
            if user: # authentication successful
                print('authentication proccess is success!')
                message = {'error' : 'Oturumunuz Acildi. Sayfaya Yonlendiriliyorsunuz...'}
                try:
                    # Is there a CustomUser object for the user?
                    custom_user = CustomUser.objects.get(user=user)
                    print("CustomUser objesi bulundu:", custom_user)
                except CustomUser.DoesNotExist: 
                    # If a CustomUser object is not found for the user
                    # join tables User & CustomUser
                    custom_user = CustomUser(user=user)
                    custom_user.save()
                    print("CustomUser objesi bulunamadı")
                   
                # login proccess continue
                login(request,user)
                return JsonResponse(message, status=200)
            
            else: # parameters did not matched
                print('parameter did not matched!')
                message = {'error' : 'Bilgiler Eslesmedi'}
                return JsonResponse(message, status=401)


       else: # Input areas are null
            print('null values can not be accepted!')
            message = {'error' : 'Alanlari Bos Birakamazsiniz...'}
            return JsonResponse(message, status=400)

    return render(request, 'loginPage.html', context)

def registerPage(request):
    context={}

    if request.method=='POST':
        firstname = request.POST.get('firstname')
        lastname = request.POST.get('lastname')
        username = request.POST.get('username')
        email = request.POST.get('email')
        password1 = request.POST.get('password1')
        password2 = request.POST.get('password2')

        if firstname and lastname and username and email and password1:
            if password1 == password2:
                if not User.objects.filter(username=username).exists():
                    if not User.objects.filter(email=email).exists():
                        #PASS CONTROL
                        if checkPassIsSuitable(password1):
                            # suitable
                            print('authentication proccess is success!')
                            message = {'error' : 'Kayit isleminiz basari ile sonuclandi. Giris sayfasina yonlendiriliyorsunuz...'}
                            # save user infos to db
                            newUser = User.objects.create_user(first_name=firstname, last_name=lastname, username=username, email=email, password=password1)
                            newUser.save()
                            return JsonResponse(message, status=202)
                    
                    else : # the entered username is already registered in the database
                        print('passwords did not matched!')
                        message = {'error' : 'Girilen kullanici adi sistemde kayitli...'}
                        return JsonResponse(message, status=203)
                
                else : # the entered username is already registered in the database
                    print('username already exist!')
                    message = {'error' : 'Girilen kullanici adi sistemde kayitli...'}
                    return JsonResponse(message, status=203)
                        
            else: # passwords didn't matched
                print('passwords did not matched!')
                message = {'error' : 'Sifre dogrulanamadi! Kontrol edip tekrar girin...'}
                return JsonResponse(message, status=401)
            
        else: # Input areas are null
            print('null values can not be accepted!')
            message = {'error' : 'Alanlari Bos Birakamazsiniz...'}
            return JsonResponse(message, status=400)

    return render(request, 'registerPage.html', context)

def userPage(request):
    context={}
    return render(request, 'userPage.html', context)

@login_required(login_url='loginPage')
def user_logout(request):
    logout(request)  # Kullanıcıyı oturumdan çıkart
    return redirect('indexPage')
