/* ====================== SELECT ELEMENTS ======================== */
const burgerIcon = document.querySelector(".icon");
const submitForm = document.querySelector("form");
const buyNowButtons = document.querySelectorAll(".button");
const buyNowButtons2 = document.querySelectorAll("#home .price button");
const quantityButtons = document.querySelectorAll(".amount button");
const popup = document.querySelector(".popup-container");
const closeIcon = popup.querySelector(".fa-xmark");
const cartIcons = document.querySelectorAll(".fa-bag-shopping");
const slides = Array.from(document.querySelectorAll("#about .persons article"));
const nextBtn = document.querySelector("#about .head .fa-arrow-right");
const prevBtn = document.querySelector("#about .head .fa-arrow-left");
const aboutSection = document.querySelector("#about .persons");
const cartSidebar = document.getElementById("cart-sidebar");
const cartOverlay = document.getElementById("cart-overlay");
const closeBtn = document.getElementById("close-cart");
const navLinks = document.querySelectorAll(
	".navlink-favorite-fruits, .navlink-fruit-shop, .navlink-about"
);
const cartItemsContainer = document.getElementById("cart-items");
const cartTotalElement = document.getElementById("cart-total");
const coyrigthSpan = document.getElementById("copyright-year");
const firstSlide = document.querySelector(
	"#about .persons article:first-child"
);

// Initialize cart
let cart = JSON.parse(localStorage.getItem("cart")) || [];
const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

/* ====================== MOBILE MENU ====================== */
burgerIcon.addEventListener("click", function () {
	const burgerList = burgerIcon.querySelector("ul");
	burgerList.classList.toggle("icon-hidden");
});

/* ====================== EMAIL SUBSCRIPTION ====================== */
if (submitForm) {
	submitForm.addEventListener("submit", function (event) {
		event.preventDefault();

		// Get form data
		const emailInput = submitForm.querySelector("#usermail");
		const submitButton = submitForm.querySelector("button[type='submit']");

		// Disable form during submission
		submitButton.disabled = true;
		submitButton.textContent = "Subscribing...";

		let templateParams = {
			user_email: emailInput.value,
			user_name: "unknown subscriber",
			website_url: window.location.href,
			website_name: location.href.match(/(?<=\/)[\w|\d|-]+/g).slice(-1),
			message: "new subscriber",
			reply_to_us: "ahmedmaheraljwhry057@gmail.com",
		};

		emailjs
			.send("service_unqcncb", "template_c2ic16k", templateParams)
			.then(
				(response) => {
					showSuccessPopup();
					resetForm();
				},
				(error) => {
					showErrorPopup(error);
					resetForm();
				}
			);

		function showSuccessPopup() {
			popup.classList.add("show-popup");

			// Close popup when clicking X
			closeIcon.onclick = function () {
				popup.classList.remove("show-popup");
			};

			// Close popup when clicking outside
			popup.onclick = function (e) {
				if (e.target === popup) {
					popup.classList.remove("show-popup");
				}
			};

			// Auto-close after 5 seconds
			setTimeout(() => {
				popup.classList.remove("show-popup");
			}, 5000);
		}

		function showErrorPopup(error) {
			alert("Subscription failed. Please try again later.");
		}

		function resetForm() {
			// Reset form
			submitForm.reset();

			// Re-enable button
			submitButton.disabled = false;
			submitButton.textContent = "Subscribe";
		}
	});
}

/* ====================== QUANTITY CONTROLS ====================== */
function initializeQuantityControls() {
	quantityButtons.forEach((button) => {
		button.addEventListener("click", function () {
			const isPlus = this.id === "plus";
			const numberSpan = this.parentElement.querySelector("#number");
			let currentValue = parseInt(numberSpan.textContent);

			if (isPlus) {
				currentValue++;
			} else {
				if (currentValue > 1) {
					currentValue--;
				}
			}

			numberSpan.textContent = currentValue;
		});
	});
}

/* ====================== CART FUNCTIONALITY ====================== */
// Add to cart
function addToCart(productName, price, quantity, image) {
	const existingItem = cart.find((item) => item.name === productName);
	if (existingItem) {
		existingItem.quantity += quantity;
	} else {
		cart.push({
			name: productName,
			price: price,
			quantity: quantity,
			image: image,
		});
	}

	localStorage.setItem("cart", JSON.stringify(cart));
	updateCartIcon();
	showAddToCartMessage(productName);
}

// Update cart icon
function updateCartIcon() {
	if (totalItems > 0) {
		cartIcons.forEach((cartIcon) => {
			cartIcon.style.position = "relative";
			cartIcon.innerHTML = `<span style="position: absolute; top: -8px; right: -8px; background: var(--fourthColor); color: var(--mainColor); border-radius: 50%; width: 18px; height: 18px; font-size: 10px; display: flex; align-items: center; justify-content: center;">${totalItems}</span>`;
		});
	}
}

// Show add to cart message
function showAddToCartMessage(productName) {
	const notification = document.createElement("div");
	notification.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        background: var(--fourthColor);
        color: var(--mainColor);
        padding: 15px 20px;
        border-radius: 5px;
        z-index: 10000;
        font-weight: 500;
        box-shadow: 0 4px 8px rgba(0,0,0,0.3);
    `;
	notification.textContent = `${productName} added to cart!`;

	document.body.appendChild(notification);

	setTimeout(() => {
		notification.remove();
	}, 3000);
}

/* ====================== BUY NOW BUTTONS ====================== */
// Initialize buy now buttons
function initializeBuyNowButtons() {
	buyNowButtons.forEach((button) => {
		button.addEventListener("click", function () {
			const figure = this.closest("figure");
			const productName = figure.querySelector("h3").textContent;
			const priceText = figure.querySelector(".price").textContent;
			const price = parseFloat(priceText.match(/\d+/)[0]);
			const quantity = parseInt(
				figure.querySelector("#number").textContent
			);
			const image = figure.querySelector("img").src;

			addToCart(productName, price, quantity, image);
		});
	});

	buyNowButtons2.forEach((button) => {
		button.addEventListener("click", function () {
			const figure = this.closest("figure");
			const productName = figure.querySelector("h4").textContent;
			const priceText =
				figure.querySelector(".price .number ins").textContent;
			const price = parseFloat(priceText.match(/\d+/)[0]);
			const quantity = 1;
			const image = figure.querySelector("img").src;

			addToCart(productName, price, quantity, image);
		});
	});
}

/* ====================== ABOUT US SLIDER ====================== */
// Initialize about slider
let currentSlide = 0;
let isAnimating = false;

// Show slide
function showSlide(index) {
	if (isAnimating) return;
	isAnimating = true;

	// Hide all slides first
	slides.forEach((slide, i) => {
		slide.classList.remove("active");
	});

	// Show the current slide with smooth transition
	setTimeout(() => {
		slides[index].classList.add("active");

		// Reset animation flag
		setTimeout(() => {
			isAnimating = false;
		}, 500);
	}, 50);

	// Update indicators
	if (window.updateIndicators) {
		window.updateIndicators();
	}
}

// Next slide
function nextSlide() {
	if (isAnimating) return;
	currentSlide = (currentSlide + 1) % slides.length;
	showSlide(currentSlide);
}

// Previous slide
function prevSlide() {
	if (isAnimating) return;
	currentSlide = (currentSlide - 1 + slides.length) % slides.length;
	showSlide(currentSlide);
}

// Initialize about slider
function initializeAboutSlider() {
	setTimeout(() => {
		document.querySelector("#about .fa-arrow-right").click();
	}, 100);

	if (nextBtn && prevBtn && slides.length > 0) {
		nextBtn.addEventListener("click", nextSlide);
		prevBtn.addEventListener("click", prevSlide);

		// Add hover effects to buttons
		nextBtn.addEventListener("mouseenter", function () {
			this.style.transform = "scale(1.1)";
			this.style.transition = "transform 0.2s ease";
		});

		nextBtn.addEventListener("mouseleave", function () {
			this.style.transform = "scale(1)";
		});

		prevBtn.addEventListener("mouseenter", function () {
			this.style.transform = "scale(1.1)";
			this.style.transition = "transform 0.2s ease";
		});

		prevBtn.addEventListener("mouseleave", function () {
			this.style.transform = "scale(1)";
		});

		// Create slide indicators
		createSlideIndicators();

		// Hide all slides first
		slides.forEach((slide, i) => {
			slide.classList.remove("active");
		});

		// Show first slide
		slides[0].classList.add("active");
		currentSlide = 0;

		// Auto-slide every 5 seconds
		setInterval(() => {
			if (!isAnimating) {
				nextSlide();
			}
		}, 5000);
	}
}

// Create slide indicators
function createSlideIndicators() {
	const indicatorsContainer = document.createElement("div");
	indicatorsContainer.style.cssText = `
		display: flex;
		justify-content: center;
		gap: 10px;
		margin-top: 20px;
	`;

	indicatorsContainer.innerHTML = slides
		.map(
			(_, index) => `
		<button class="slide-indicator" data-slide="${index}" style="
			width: 12px;
			height: 12px;
			border-radius: 50%;
			border: 2px solid var(--fourthColor);
			background: transparent;
			cursor: pointer;
			transition: all 0.3s ease;
		"></button>
	`
		)
		.join("");

	aboutSection.appendChild(indicatorsContainer);

	// Add click listeners to indicators
	indicatorsContainer
		.querySelectorAll(".slide-indicator")
		.forEach((indicator, index) => {
			indicator.addEventListener("click", () => {
				if (!isAnimating) {
					currentSlide = index;
					showSlide(currentSlide);
					updateIndicators();
				}
			});
		});

	// Update indicators on slide change
	window.updateIndicators = function () {
		indicatorsContainer
			.querySelectorAll(".slide-indicator")
			.forEach((indicator, index) => {
				if (index === currentSlide) {
					indicator.style.background = "var(--fourthColor)";
					indicator.style.transform = "scale(1.2)";
				} else {
					indicator.style.background = "transparent";
					indicator.style.transform = "scale(1)";
				}
			});
	};

	// Initialize indicators
	window.updateIndicators();
}

/* ====================== CART SIDEBAR ====================== */
// Initialize cart sidebar
function initializeCartSidebar() {
	if (!cartSidebar || !cartOverlay || !closeBtn) {
		return;
	}

	// Event listeners
	closeBtn.addEventListener("click", closeCartSidebar);
	cartOverlay.addEventListener("click", closeCartSidebar);
}

// Show cart sidebar
function showCartSidebar() {
	if (!cartSidebar || !cartOverlay) {
		return;
	}

	cartSidebar.classList.add("show");
	cartOverlay.classList.add("show");
	document.body.style.overflow = "hidden";
	displayCartItems();
}

// Close cart sidebar
function closeCartSidebar() {
	if (!cartSidebar || !cartOverlay) {
		return;
	}

	cartSidebar.classList.remove("show");
	cartOverlay.classList.remove("show");
	document.body.style.overflow = "auto";
}

/* ====================== NAVIGATION LINKS ====================== */
navLinks.forEach((link) => {
	link.addEventListener("click", function () {
		hideCartPage();
	});
});

/* ====================== DISPLAY CART ITEMS ====================== */
function displayCartItems() {
	if (cart.length === 0) {
		cartItemsContainer.innerHTML = `
			<div class="empty-cart">
				<i class="fa-solid fa-shopping-cart"></i>
				<p>Your cart is empty</p>
			</div>
		`;
		cartTotalElement.textContent = "Total: $0";
		return;
	}

	let total = 0;
	cartItemsContainer.innerHTML = cart
		.map((item, index) => {
			const itemTotal = item.price * item.quantity;
			total += itemTotal;

			return `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}">
                <div class="item-info">
                    <h3>${item.name}</h3>
                    <p>$${item.price} each</p>
                </div>
                <div class="quantity-controls">
                    <button onclick="updateCartQuantity(${index}, -1)">-</button>
                    <span>${item.quantity}</span>
                    <button onclick="updateCartQuantity(${index}, 1)">+</button>
                </div>
                <div class="item-actions">
                    <button onclick="removeFromCart(${index})" class="remove-btn">Remove</button>
                </div>
            </div>
        `;
		})
		.join("");

	cartTotalElement.textContent = `Total: $${total.toFixed(2)}`;
}

/* ====================== UPDATE CART QUANTITY ====================== */
function updateCartQuantity(index, change) {
	cart[index].quantity += change;

	if (cart[index].quantity <= 0) {
		cart.splice(index, 1);
	}

	localStorage.setItem("cart", JSON.stringify(cart));
	updateCartIcon();
	displayCartItems();
}

/* ====================== REMOVE FROM CART ====================== */
function removeFromCart(index) {
	cart.splice(index, 1);
	localStorage.setItem("cart", JSON.stringify(cart));
	updateCartIcon();
	displayCartItems();
}

/* ====================== CLEAR CART ====================== */
function clearCart() {
	cart = [];
	localStorage.setItem("cart", JSON.stringify(cart));
	updateCartIcon();
	displayCartItems();
}

/* ====================== CART NAVIGATION ====================== */
function initializeCartNavigation() {
	document.addEventListener("click", function (e) {
		// Cart link clicks
		if (e.target.tagName === "A" && e.target.textContent.includes("Cart")) {
			e.preventDefault();
			showCartSidebar();
			return;
		}

		// Cart icon clicks
		if (e.target.classList.contains("fa-bag-shopping")) {
			e.preventDefault();
			showCartSidebar();
			return;
		}

		// Cart sidebar button clicks
		if (e.target.id === "checkout-btn") {
			alert("Checkout functionality would be implemented here!");
		} else if (e.target.id === "clear-cart-btn") {
			if (confirm("Are you sure you want to clear your cart?")) {
				clearCart();
			}
		}
	});
}

/* ====================== SHOW CART PAGE ====================== */
function showCartPage() {
	showCartSidebar();
}

/* ====================== HIDE CART PAGE ====================== */
function hideCartPage() {
	closeCartSidebar();
}

/* ====================== COPYRIGHT YEAR ====================== */
function copyrightsYear() {
	let dateNow = new Date();
	coyrigthSpan.innerHTML = dateNow.getFullYear();
}

/* ====================== INITIALIZATION ====================== */
document.addEventListener("DOMContentLoaded", () => {
	copyrightsYear();
	initializeQuantityControls();
	initializeBuyNowButtons();
	initializeAboutSlider();
	initializeCartSidebar();
	initializeCartNavigation();
	updateCartIcon();

	// Test cart functionality
	window.testCart = function () {
		showCartSidebar();
	};

	// Ensure first slide is visible after page load
	setTimeout(() => {
		if (firstSlide) {
			firstSlide.classList.add("active");
		}
	}, 2000);
});
