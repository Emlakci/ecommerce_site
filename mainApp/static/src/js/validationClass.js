//!import modules !//
import { Message } from './messageBox.js';
//!import modules !//
export class Validation
{
    constructor(formClassname, options={
        password1ID: 'password1',
        confirmpassID : 'password2'
    })
    {
        this.form = document.querySelector(formClassname);
        this.form_inputs = this.form.querySelectorAll('input');
        this.methods = ['keyup','change'];
        this.pass1ID = options.password1ID;
        this.pass2ID = options.confirmpassID;

        this.watching = this.watchValidate();
        this.createErrorMessage = this.createMessage;
        this.submit_state = this.addSubmit(this.form.id);
    };

    createMessage(element)
    {
        const parent = element.parentElement;
        const messageText = element.validationMessage;
        
        if(parent.nextElementSibling?.classList.contains('message-box'))
        {
            parent.nextElementSibling.textContent = messageText;
        }
        else
        {
            const messageArea = document.createElement('small');
            messageArea.className = 'message-box';
            messageArea.textContent = messageText;
            parent.insertAdjacentElement('afterend',messageArea);
        };
    };

    isValid(element)
    {
        if(element.getAttribute('type') === 'password')
        {
            if(element.validity.patternMismatch)
                element.setCustomValidity('Şifreniz 8 karakterden az olmamalı ve en az 1 rakam ve büyük harf içermelidir!');
            else
                element.setCustomValidity('');
        };

        if(!element.checkValidity())
        {
            element.classList.add('invalid');
            this.createErrorMessage(element);

            return false;
        }
        else
        {
            if(element.parentElement.nextElementSibling?.classList.contains('message-box'))
            {
                element.parentElement.nextElementSibling.remove();
                element.classList.remove('invalid');
            };

            return true;
        };
    };

    watchValidate()
    {
        this.form_inputs.forEach(input =>{
            this.methods.forEach((method)=>{
                input.addEventListener(method, ()=>{
                    this.isValid(input);
                });
            });
        });
    };

    checkValidation()
    {
        this.form_inputs.forEach(input =>{
            this.isValid(input)
        });
    };

    checkPassword()
    {
        if (this.form.classList.contains('record'))
        {
            const pass1 = document.getElementById(this.pass1ID);
            const pass2 = document.getElementById(this.pass2ID);
    
            if(pass1.value !== pass2.value && pass1.checkValidity() && pass2.checkValidity())
            {
                const messageText = "Şifreniz eşleşmedi! Tekrar deneyin.";
                this.createMessage(pass2.parentElement, messageText);
                pass2.classList.add('invalid');
            }
            else // if passwords matched 
                return true;
        }
        else // there're nothing to control
        {
            console.log('login from...'); 
            return true;
        }
    };

    //~ function that posts requests ~//
    async submitForm (formId)
    {
        let form = document.getElementById(formId);
        const formData = new FormData(form);
        console.log(csrfToken)
        formData.append('csrfmiddlewaretoken',csrfToken);

        try 
        {
            // send form to backend
            const response = await fetch (`/${formId}`, {
                method: 'POST',
                headers: {
                    'X-CSRFToken' : csrfToken
                },
                body: formData
            });    
            // control response
            let responseData = await response.json();
            let msgType = String('');
            console.log(response, response.status, responseData);
            
            // parameter did not matched!
            if (response.status == 401) msgType = 'error';
            // Input areas are null
            else if (response.status == 400) msgType = 'error';
            // authentication is successful
            else if (response.status == 200 || response.status == 202) msgType = 'success';
            // registeration is unsuccessful
            else if (response.status == 203) msgType = 'error';

            // create error message
            const messageBox = new Message(responseData.error, msgType);
            if (msgType === 'success') 
            {
                const currentURL = window.location.href;
                const direction = formId === 'login' ? '/' : '/login';
                const newURL = currentURL.replace(`/${formId}`, direction);
                location.href = newURL;
            } 
        } 
        catch (error)
        {
            console.log(error);    
        };
    };

    addSubmit(formId)
    {
        this.form.addEventListener('submit', async (e)=>{
            e.preventDefault();
            this.checkValidation();
            this.checkPassword('password1', 'password2');
            this.submitForm(formId)
        });
    }
};