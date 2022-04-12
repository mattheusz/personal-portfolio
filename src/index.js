"strict mode"
import axios from 'axios';

const hamburgerButton = document.querySelector(".header__hamburger");
const menu = document.querySelector('.menu');
const menuItem = document.querySelectorAll('.menu__item');
const contactName = document.getElementById('name');
const email = document.getElementById('email');
const message = document.getElementById('message');
const contactForm = document.getElementById("contact-form");
const toast = document.getElementById("snackbar");

let isValid = {
    name: false,
    email: false,
    message: false
}

hamburgerButton.addEventListener("click", () => showMenu(menu));
menuItem.forEach(item => {
    item.addEventListener("click", () => showMenu(menu));
})
contactName.addEventListener("focusout", (e) => checkIfNameIsValid(e.target.value));
email.addEventListener("focusout", (e) => checkIfEmailIsValid(e.target.value));
message.addEventListener("focusout", (e) => checkIfMessageIsValid(e.target.value));
contactForm.addEventListener("submit", (e) => submitForm(e, isValid, contactName, email, message, axios, toast));

function showMenu(menu) {
    console.log(menu)
    if (menu.classList.contains("show-menu")) {
        menu.classList.remove("show-menu");
    } else {
        menu.classList.add("show-menu");
    }
}



function checkIfNameIsValid(name) {
    let nameRegex = /^[a-zA-Z]{2,}(?: [a-zA-Z]+){0,9}$/;
    let nameErrorMessage = document.getElementById("name-error-message");
    if (name.length === 0) {
        nameErrorMessage.innerHTML = "Não deixe o campo de nome vazio."
        isValid.name = false;
        return false;
    }
    if (!nameRegex.test(name)) {
        nameErrorMessage.innerHTML = "Nome inválido. Verifique se está tudo certinho."
        isValid.name = false;
        return false;
    }

    isValid.name = true;
    nameErrorMessage.innerHTML = "";
    return true;
}

function checkIfEmailIsValid(email) {
    console.log('email:', email || 'email')
    const regexEmail = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
    let emailErrorMessage = document.getElementById("email-error-message");
    if (email.length === 0) {
        emailErrorMessage.innerHTML = "Não deixe o campo de e-mail vazio."
        isValid.email = false;
        return false;
    }
    if (!/@/.test(email)) {
        emailErrorMessage.innerHTML = "Um e-mail deve ter um @."
        isValid.email = false;
        return false;
    }
    if (!regexEmail.test(email)) {
        emailErrorMessage.innerHTML = "E-mail inválido. Verifique se está tudo certinho."
        isValid.email = false;
        return false
    }
    emailErrorMessage.innerHTML = "";
    isValid.email = true;
    return true;

}

function checkIfMessageIsValid(message) {
    const regexMessage = /\w{3,}/;
    const messageBoxErrorMessage = document.getElementById("message-box-error-message")
    if (!regexMessage.test(message)) {
        messageBoxErrorMessage.innerHTML = "Mensagem curta demais. Fale mais um pouquinho.";
        isValid.message = false;
        return false;
    }

    isValid.message = true;
    messageBoxErrorMessage.innerHTML = "";
    return true;
}

function submitForm(e, isValid, name, email, message, axios, toast) {
    console.log("Podemos submeter?");

    e.preventDefault();
    message.removeEventListener("focusout", (e) => checkIfMessageIsValid(e.target.value));
    message.addEventListener("input", (e) => checkIfMessageIsValid(e.target.value));

    if (checkIfNameIsValid(name.value)) {
        isValid.name = true;
    }
    if (checkIfEmailIsValid(email.value)) {
        isValid.email = true;
    }
    if (checkIfMessageIsValid(message.value)) {
        isValid.message = true;
    }

    if (isValid.name && isValid.email && isValid.message) {
        console.debug("call API");

        axios.post("https://submit-form.com/B2p77Uo0", {
            "Nome": name.value,
            "E-mail": email.value,
            "Mensagem": message.value,
            _email: {
                from: name.value,
                subject: `Matheus, ${name.value} entrou em contato com você pelo seu portfólio.`,
                template: {
                    title: false,
                    footer: false,
                },
            },
        })
            .then(function (response) {
                // manipula o sucesso da requisição
                showToast(toast, "Mensagem enviada com sucesso. Muito obrigado!");
                cleanInputs(name, email, message);
                console.log('sucesso na submissão', response);
            })
            .catch(function (error) {
                // manipula erros da requisição
                showToast(toast, "Problema em conectar ao servidor. Tente novamente.");
                console.error('error', error);
            })

    }
    else {
        checkIfNameIsValid(name.value);
        checkIfEmailIsValid(email.value);
        checkIfMessageIsValid(message.value);
    }

}

function showToast(toast, message) {
    // Add the "show" class to DIV
    toast.className = "show";
    toast.innerHTML = message;

    // After 3 seconds, remove the show class from DIV
    setTimeout(function () { toast.className = toast.className.replace("show", ""); }, 3000);
}

function cleanInputs(name, email, message) {
    name.value = "";
    email.value = "";
    message.value = "";
}