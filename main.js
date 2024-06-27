const burgerIcon = document.querySelector('.icon');
burgerIcon.addEventListener('click', function() {
    const burgerList = burgerIcon.querySelector('ul');
    burgerList.classList.toggle('icon-hidden')
})















// Copyrights Year
function copyrightsYear() {
    const coyrigthSpan = document.getElementById('copyright-year');
    let dateNow = new Date();
    coyrigthSpan.innerHTML = dateNow.getFullYear();
    console.log(dateNow.getFullYear())
}
document.addEventListener('DOMContentLoaded', () => {
    copyrightsYear();
});