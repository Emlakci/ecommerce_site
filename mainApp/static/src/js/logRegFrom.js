//!import modules !//
import { Validation } from "./validationClass.js";
import { Message } from './messageBox.js';
//!import modules !//
//# define constants #//
const form_login = document.querySelector('.form.enter');
const form_register = document.querySelector('.form.record');
const submitBtn = document.querySelector('.btn');
//# define constants #//

//~initialize vanilla tilt function ~//
VanillaTilt.init(document.querySelectorAll('.form-box'), {
    max: 25,
    speed:100,
    glare: true,
    'max-glare' : .5,
});

//* set validation functions *//
if (form_login)
    new Validation('.enter');
if (form_register)
    new Validation('.record');



