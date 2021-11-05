import './api.js';
import './util.js';
import './render-photo-miniatures.js';
import './render-full-picture.js';
import '/nouislider/nouislider.js';
import './functions-to-module-form.js';
import './form.js';


// =====================================================================================
const body = document.querySelector('body');
const errr = document.querySelector('#error').content.querySelector('.error__inner');
const success = document.querySelector('#success').content.querySelector('.success__inner');
errr.classList.add('hidden');
success.classList.add('hidden');
body.appendChild(errr);
body.appendChild(success);
// body.classList.add('modal-open');
// =========================================================================================
