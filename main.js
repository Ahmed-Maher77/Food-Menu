// Menu:
const burgerIcon = document.querySelector(".icon");
burgerIcon.addEventListener("click", function () {
	const burgerList = burgerIcon.querySelector("ul");
	burgerList.classList.toggle("icon-hidden");
})

// email.js:
const submitForm = document.getElementById('contact-form');
submitForm.addEventListener('submit',  function(event) {
	event.preventDefault()
	let templateParams = {
		user_email: submitForm.querySelector('#usermail').value,
		user_name: "unknown subscriber",
		website_url: window.location.href,
		website_name: (location.href).match(/(?<=\/)[\w|\d|-]+/g).slice(-1),
		message: "new subscriber",
		reply_to_us: 'ahmedmaheraljwhry057@gmail.com'
	};
	
	emailjs.send("service_unqcncb", "template_c2ic16k", templateParams).then(
		(response) => {
			console.log("SUCCESS!", response.status, response.text);
			popupSucess();
		},
		(error) => {
			console.log("FAILED...", error);
			window.alert(error)
		}
	);

	function popupSucess() {
		const popup = document.querySelector('.popup-container'),
			closeIcon = popup.querySelector('.fa-xmark');
		popup.classList.add('show-popup');
		closeIcon.onclick = function() {
			popup.classList.remove('show-popup');
		}
	}
})

// Copyrights Year
function copyrightsYear() {
	const coyrigthSpan = document.getElementById("copyright-year");
	let dateNow = new Date();
	coyrigthSpan.innerHTML = dateNow.getFullYear();
	console.log(dateNow.getFullYear());
}
document.addEventListener("DOMContentLoaded", () => {
	copyrightsYear();
});
