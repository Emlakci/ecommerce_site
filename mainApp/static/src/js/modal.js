const parentElement = document.getElementById('content');
const update_btns = document.querySelectorAll('label');
const fragment = document.createDocumentFragment();

update_btns.forEach((btns)=>{
    btns.addEventListener('click', async (event)=>{
        const modal = await createModal(event);

        fragment.appendChild(modal)

        parentElement.appendChild(fragment);
    });
});
//~ function that creates modal element
async function createModal(event)
{
    let modal = parentElement.querySelector('#modal');
    let element = event.target;
    console.log(element)
    if (!modal && element.classList.contains('form-icon'))
    {
        const modal_title_name = element.parentElement.getAttribute('data-area-name');
            const changing_inp_value = element.parentElement.textContent;
            const changing_inp_name = element.parentElement.nextElementSibling.getAttribute('name');
            const changing_inp_type = element.parentElement.nextElementSibling.getAttribute('type');
    
            //modal div
            const modal = document.createElement('div');
            modal.className = 'modal';
            modal.id = 'modal';
            // title div
            const modal_title = document.createElement('h3');
            modal_title.className = 'title';
            modal_title.textContent = modal_title_name;
            
            // content div ~ form
            const modal_content = document.createElement('div');
            modal_content.className = 'form-area';
            const update_form = document.createElement('form');
            update_form.id = 'update-form'
            
            // create hidden input area for input names
            const hiddenInp = document.createElement('input');
            hiddenInp.setAttribute('type', 'hidden');
            hiddenInp.setAttribute('name', 'hidden_name');
            hiddenInp.setAttribute('value', `${changing_inp_name}`);
    
            const input = document.createElement('input');
            input.setAttribute('placeHolder', `${changing_inp_value}`);
            input.setAttribute('name', 'changing_value');
            input.setAttribute('type', `${changing_inp_type}`);
            //? if password is updating...
            const input2 = changing_inp_type === 'password' ? createPassInput2(changing_inp_value) : createHiddenInput();            
            //? if password is updating...
            const inputPass = document.createElement('input');
            inputPass.setAttribute('placeHolder', 'Sifre Kontrolu');
            inputPass.setAttribute('name', 'control_pass');
            inputPass.setAttribute('type', 'password');

            [input, input2, inputPass, hiddenInp ].forEach((item)=>{
                update_form.appendChild(item);
            });
            modal_content.appendChild(update_form);
            
            //btn-area div
            const modal_btn_area = document.createElement('div');
            modal_btn_area.className = 'btn-area';
            const btn_close = document.createElement('button');
            btn_close.setAttribute('type', 'reset');
            btn_close.setAttribute('form', update_form.id);
            btn_close.addEventListener('click', ()=> closeModal(modal.id));
            btn_close.textContent = 'KAPAT';
            const btn_submit = document.createElement('button');
            btn_submit.setAttribute('type', 'button');
            btn_submit.addEventListener('click', ()=> submitForm(update_form.id, modal.id, modal_title_name));
            btn_submit.textContent = 'GONDER';
            [btn_close, btn_submit ].forEach((item)=>{
                modal_btn_area.appendChild(item);
            });
            // append everthing inside the modal div
            [modal_title, modal_content, modal_btn_area ].forEach((item)=>{
                    modal.appendChild(item);
                });
    
        return modal;
    };
};
//~ function that controls submit event
async function submitForm (formId, modalId, modalTitleName)
{
    let form = document.getElementById(formId);
    const formData = new FormData(form);
    console.log(csrfToken)
    formData.append('csrfmiddlewaretoken',csrfToken);

    try 
    {
        // send form to backend
        const response = await fetch ('/account', {
            method: 'POST',
            headers: {
                'X-CSRFToken' : csrfToken
            },
            body: formData
        });    
        // close form ~ modal after successful post event.
        if (response.ok && response.status == 200) 
        {        
            closeModal(modalId);
            // reflesh page for user infos
            if (modalTitleName != 'Sifre Guncelleme') // reflesh current page
            {
                location.reload();
            }
            else // redirect login page for the changed password
            {
                const currentURL = window.location.href;
                const newURL = currentURL.replace('/account', '/login');
                location.href = newURL;
            }
        }
        else // passwords didn't matched
        {
            // console.error('hata')
            let responseData = await response.json()

            const errorDiv = document.createElement('h2');
            errorDiv.className = 'errorDiv';
            errorDiv.textContent = responseData.error;

            let modal = document.getElementById(modalId);
            modal.append(errorDiv);
            // close message box
            const removeMessage = setTimeout(()=>{
                errorDiv.remove()
            },5000);
            removeMessage(errorDiv);
        }
    } 
    catch (error)
    {
        console.log(error);    
    };
};

function closeModal(modalId)
{
    let modal = document.getElementById(modalId);
    if (modal) modal.remove();
};

function createPassInput2 (changing_inp_value)
{
    const input2 = document.createElement('input');
    input2.setAttribute('placeHolder', `Tekrar ${changing_inp_value}`);
    input2.setAttribute('name', 'changing_value_2');
    input2.setAttribute('type', 'password');
    
    return input2;
};

function createHiddenInput ()
{
    const input2 = document.createElement('input');
    input2.setAttribute('name', 'hidden');
    input2.setAttribute('type', 'hidden'); 

    return input2
};

