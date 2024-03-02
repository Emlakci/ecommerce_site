//! IMPORT FILES !//
import definings from '../setting.json' assert {type: 'json'};
//! IMPORT FILES !//
//# HEADER CONSTANTS #//
// const indicator = document.getElementById('indicator');
const menu_list = document.querySelectorAll('.menu-list .menu-icon');
const active_link = document.querySelector('.active');
const logo_text = document.getElementById('animated-text');
logo_text.textContent = definings.site.name;
const const_multiplier = findConstantMultiplier(logo_text); //@ type : number
const person_menu = document.getElementById('person-menu');
const person_button = document.getElementById('person-button');
const person_img = document.getElementById('person-img');
const hmbrgr_menu = document.getElementById('hamburger-menu');
const carousel_wrapper = document.getElementById('carousel-wrapper');
const contact_form_area = document.getElementById('contact-form-area');
const content_area = document.getElementById('content');
const logReg_wrapper = document.getElementById('wrapper-logRegFrom');
//# HEADER CONSTANTS #//
//! FUNCTIONS !//
// window.onload = function ()
// {
    // NavBar link select starter function //
    linkSelect(menu_list);
    // Logo rounded text animation starter function //
    writeRoundedText(logo_text);
    // Person menu open~close #toggle
    toggleMenus();
    // Move indicator to active link area when page first loaded
    // moveIndicator(active_link);
    // Move indicator to active link area when page resized
    window.addEventListener('resize',()=>{
        moveIndicator(active_link);
    });
// };
//! FUNCTIONS !//

//~ navbar functions scripts start ~//
function linkSelect(navLinksElements) //@ type : array of nav ul-li list
{
    navLinksElements.forEach(item =>{
        item.addEventListener('click', () => {
        //   moveIndicator(item);
          setLinkActive(item);
        });
    });
};

//# function that moves the indicator
// function moveIndicator(element) 
// {
//     const { offsetLeft, offsetWidth } = element;
    
//     indicator.style.left = `${offsetLeft}px`;
//     indicator.style.width = `${offsetWidth}px`;
// };

//# function that adds the active class to selected menu's item
// function setLinkActive(clickedItem)
// {
//     menu_list.forEach(item => item.classList.remove('active'));
//     clickedItem.classList.add('active');
// };
//~ navbar functions scripts end ~//

//~ logo-animation-text functions scripts start ~//

//#  function that write the text one by one inside the spans are around the logo 
function writeRoundedText(appendingElement)
{
    // set span elements around the logo
    const spanElements = seperateText(appendingElement).map(roundTheText); //@ type: array
    // append them into text area element (p or h1 etc...)
    spanElements.forEach((item)=>{
        appendingElement.append(item);
    });
};

//# function that seperate the logo text
function seperateText(textElement) //@ params : element' variable name has an text to be animated
{
    const seperated_text = textElement.textContent.split(''); //@ type : array
    return seperated_text; 
};

//#  function that creates and prints a span element for each character in the 'separated-text' array
function roundTheText(char, index)
{
    logo_text.textContent = ''; // delete the text inside the p element 
    const span = document.createElement('span');
    span.textContent = char;
    span.setAttribute('style', `transform : rotate(${index * const_multiplier}deg);`);
    return span; 
};

//# function that calculates the constant multiplier for equal degrees
function findConstantMultiplier(textElement)
{   
    const seperated_text = seperateText(textElement);
    addSpaceIntoArray(seperated_text);
    return 360 / (seperated_text.length);
};

//# function that adds the space into the array
function addSpaceIntoArray(array)
{
    if(array.length < 36)
    {
        while (array.length < 38)
        {
            array.push(String(''));
        };
    };

    if (array.length > 38)
    {
        while (array.length > 34)
        {
            array.pop();
        };
        for(let i=0; i<=3; i++)
        {
            if(i==3) array.push('')
            else array.push('.');
        };
    };
};
//~ logo-animation-text functions scripts end ~//

//~ Person menu toggle functions scripts start ~//
function toggleMenus()
{
    if(person_button) // person_button is define in html page
    {
        document.addEventListener('click', (event)=>{
            if(event.target === person_button || event.target === person_img)
                person_menu.style.display = person_menu.style.display === 'none' ? 'block' : 'none';
            if((event.target != person_button && event.target != person_img))
                person_menu.style.display = 'none';
        });
    };
    //! Change hmbr div layer's level to be higher than the #content area
    if(hmbrgr_menu) // hmbrgr_menu is define in html page
    {
        document.addEventListener('click', (event)=>{
            
            console.log(event.target.classList.contains('icons'))
            
            if(contact_form_area || carousel_wrapper || logReg_wrapper)
            {
                console.log(event.target.parentElement.classList.contains('arrow'));

                if((event.target === hmbrgr_menu || event.target.classList.contains('icons')) && !event.target.parentElement.classList.contains('arrow'))
                {
                    console.log(event.target);
                    content_area.style.zIndex = -1;
                }
                else
                    console.log(event.target);
                    content_area.style.zIndex = 1;
            }

        });
    };
};
//~ Person menu toggle functions scripts end ~//