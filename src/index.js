"strict mode"
const hamburgerButton = document.querySelector(".header__hamburger");
const menu = document.querySelector('.menu');
console.log(menu);
hamburgerButton.addEventListener("click", () => showMenu(menu));
function showMenu(menu) {
    console.log(menu)
    if (menu.classList.contains("show-menu")) {
        menu.classList.remove("show-menu");
    } else {
        menu.classList.add("show-menu");
    }
}