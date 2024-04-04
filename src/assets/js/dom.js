const menuBtnOpen = document.querySelector('.menuBtnOpen');
const menuBtnClose = document.querySelector('.menuBtnClose');
const navbar = document.querySelector('.navbar');
const header = document.querySelector('.header');
const header_title = document.querySelector('.header__title');

menuBtnOpen.addEventListener('click', () => {
    header.classList.add('active-header')
    navbar.style.display = 'flex';
    menuBtnClose.style.display = 'block';
    menuBtnOpen.style.display = 'none';
    header_title.style.textAlign = 'center';
});

menuBtnClose.addEventListener('click', () => {
    header.classList.remove('active-header')
    navbar.style.display = 'none';
    menuBtnClose.style.display = 'none';
    menuBtnOpen.style.display = 'block';
    header_title.style.textAlign = 'left';
});