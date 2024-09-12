// main.js

// Selecting necessary elements from the DOM
var iconCart = document.querySelector('.nav-cart');
var closeCart = document.querySelector('.close');
var body = document.querySelector('body');
var listProductHTML = document.querySelector('.listofcart');

var cart = {};

// Toggle the cart visibility when clicking on the cart icon
iconCart.addEventListener('click', function(event) {
  event.preventDefault();
  body.classList.toggle('ShowCart');
});

// Close the cart when clicking the close button
closeCart.addEventListener('click', function(event) {
  event.preventDefault();
  body.classList.remove('ShowCart');
});

// Event listener to handle clicks on the "Add to Cart" button
document.querySelectorAll('.new-product-cart-btn').forEach(button => {
  button.addEventListener('click', function(event) {
    event.preventDefault();
    var productBox = event.target.closest('.new-product-box');
    var productName = productBox.querySelector('.new-product-title').textContent;
    var productPrice = parseFloat(productBox.querySelector('.new-product-text span').textContent.replace(/[^\d\.]/g, ''));
    var productImageSrc = productBox.querySelector('.new-product-img img').src;

    // Check if the product already exists in the cart
    if (cart[productName]) {
      // If the product exists, increment its quantity
      cart[productName].quantity++;
      cart[productName].totalPrice = (cart[productName].price * cart[productName].quantity).toFixed(2); // Update the product's total price
    } else {
      // If the product doesn't exist, create a new cart item
      cart[productName] = {
        name: productName,
        price: productPrice,
        imageSrc: productImageSrc,
        quantity: 1,
        totalPrice: (productPrice * 1).toFixed(2) // Initialize the total price
      };
    }

    // Update the cart HTML
    updateCartHTML();
  });
});

// Function to update the cart HTML
function updateCartHTML() {
    listProductHTML.innerHTML = '';
    Object.keys(cart).forEach(productName => {
      var product = cart[productName];
      var cartItemHTML = `
        <div class="product-item">
          <div class="product-image">
            <img src="${product.imageSrc}" alt="${product.name}">
          </div>
          <div class="product-name">${product.name}</div>
          <div class="total-price">$${product.totalPrice}</div>
          <div class="quantity">
            <span class="minu" role="button" aria-label="Decrease quantity">-</span>
            <span>${product.quantity}</span>
            <span class="plus" role="button" aria-label="Increase quantity">+</span>
            <i class="fa-solid fa-trash-can delete-product-btn" data-product-name="${productName}"></i>
          </div>
        </div>
      `;
      listProductHTML.innerHTML += cartItemHTML;
    });
  }

// Event listener to handle clicks inside the cart
listProductHTML.addEventListener('click', function(event) {
    var targetElement = event.target;
  
    if (targetElement.classList.contains('plus')) {
      var quantityElement = targetElement.previousElementSibling;
      var productName = targetElement.closest('.product-item').querySelector('.product-name').textContent;
      var product = cart[productName];
      if (product) {
        product.quantity++;
        product.totalPrice = (product.price * product.quantity).toFixed(2); // Update the product's total price
        quantityElement.textContent = product.quantity;
        updateCartItemPrice(productName); // Update the cart item price
        updateSubtotal(); // Update the subtotal value
      }
    } else if (targetElement.classList.contains('minu')) {
      var quantityElement = targetElement.nextElementSibling;
      var productName = targetElement.closest('.product-item').querySelector('.product-name').textContent;
      var product = cart[productName];
      if (product && product.quantity > 1) {
        product.quantity--;
        product.totalPrice = (product.price * product.quantity).toFixed(2); // Update the product's total price
        quantityElement.textContent = product.quantity;
        updateCartItemPrice(productName); // Update the cart item price
        updateSubtotal(); // Update the subtotal value
      } else if (product && product.quantity === 1) {
        // Remove the product from the cart if the quantity is 1
        delete cart[productName];
        updateCartHTML();
        updateSubtotal(); // Update the subtotal value
      }
    }
  });
// Function to update the cart item price
function updateCartItemPrice(productName) {
    var product = cart[productName];
    var productItems = listProductHTML.querySelectorAll('.product-item'); // Get all product item containers
    for (var i = 0; i < productItems.length; i++) {
      var productItem = productItems[i];
      var productNameElement = productItem.querySelector('.product-name'); // Get the product name element
      if (productNameElement && productNameElement.textContent === productName) {
        var totalPriceElement = productItem.querySelector('.total-price'); // Get the total price element
        totalPriceElement.textContent = `$${(product.price * product.quantity).toFixed(2)}`; // Update the total price
        break; // Exit the loop once we've found the correct product item
      }
    }
  }

  // Function to delete a product from the cart
function deleteProduct(productName) {
    delete cart[productName];
    updateCartHTML();
    updateCartIconQuantity();
    updateSubtotal();
  }
// Event listener for delete product buttons
listProductHTML.addEventListener('click', function(event) {
    if (event.target.classList.contains('delete-product-btn')) {
      const productName = event.target.dataset.productName;
      deleteProduct(productName);
    }
  });
// Select the cart icon quantity span
var cartIconQuantitySpan = iconCart.querySelector('span');

// Function to update the cart icon quantity
function updateCartIconQuantity() {
  var totalQuantity = 0;
  Object.keys(cart).forEach(productName => {
    totalQuantity += cart[productName].quantity;
  });
  cartIconQuantitySpan.textContent = totalQuantity === 0 ? '0' : totalQuantity;
}

// Call the function whenever a product is added or the quantity is changed
// ...

// In the "Add to Cart" button click event listener
document.querySelectorAll('.new-product-cart-btn').forEach(button => {
  button.addEventListener('click', function(event) {
    // ...
    updateCartHTML();
    updateCartIconQuantity(); // Call the function here
  });
});

// In the cart item quantity update event listener
listProductHTML.addEventListener('click', function(event) {
  // ...
  if (targetElement.classList.contains('plus')) {
    // ...
    updateCartItemPrice(productName);
    updateCartIconQuantity(); // Call the function here
  } else if (targetElement.classList.contains('minu')) {
    // ...
    if (product && product.quantity === 1) {
      delete cart[productName];
      updateCartHTML();
      updateCartIconQuantity(); // Call the function here
    }
  }
});
// Function to calculate the subtotal value of the shopping cart
function calculateSubtotal() {
    var subtotal = 0;
    Object.keys(cart).forEach(productName => {
      subtotal += parseFloat(cart[productName].totalPrice);
    });
    return subtotal.toFixed(2);
  }
  
  // Function to update the subtotal value in the HTML
  function updateSubtotal() {
    var subtotalElement = document.querySelector('.subtotal-value');
    subtotalElement.textContent = `$${calculateSubtotal()}`;
  }
  
  // Call the updateSubtotal function whenever a product is added or the quantity is changed
  document.querySelectorAll('.new-product-cart-btn').forEach(button => {
    button.addEventListener('click', function(event) {
      // ...
      updateCartHTML();
      updateCartIconQuantity();
      updateSubtotal(); // Call the function here
    });
  });
  
  // In the cart item quantity update event listener
  listProductHTML.addEventListener('click', function(event) {
    // ...
    if (targetElement.classList.contains('plus')) {
      // ...
      updateCartItemPrice(productName);
      updateCartIconQuantity();
      updateSubtotal(); // Call the function here
    } else if (targetElement.classList.contains('minu')) {
      // ...
      if (product && product.quantity === 1) {
        delete cart[productName];
        updateCartHTML();
        updateCartIconQuantity();
        updateSubtotal(); // Call the function here
      }
    }
  });

  // Function to delete a product from the cart
function deleteProduct(productName) {
    delete cart[productName];
    updateCartHTML();
    updateCartIconQuantity();
    updateSubtotal();
  }
  
  // Event listener for delete product buttons
  document.querySelectorAll('.delete-product-btn').forEach(button => {
    button.addEventListener('click', function(event) {
      const productName = event.target.dataset.productName;
      deleteProduct(productName);
    });
  });

// Get the checkout button
const checkoutButton = $('.Checkout');

// Add an event listener to the checkout button
checkoutButton.on('click', function(event) {
  // Prevent the default button behavior
  event.preventDefault();

  // Get the cart data
  const cartData = JSON.stringify(cart);

  // Create a new URL for the checkout page with the cart data as a query parameter
  const checkoutUrl = `checkout.html?cart=${cartData}`;

  // Redirect the user to the checkout page with a smooth transition
  $('body').fadeOut(500, function() {
    window.location.href = checkoutUrl;
  });
});


// Get the user icon element
const userIcon = document.querySelector('.nav-user');

// Get the login modal element
const loginModal = document.getElementById('login-modal');

// Get the close button element
const closeButton = document.getElementById('close-login');

// Add event listener to user icon to open login modal
userIcon.addEventListener('click', () => {
  loginModal.style.display = 'block';
});

// Add event listener to close button to close login modal
closeButton.addEventListener('click', () => {
  loginModal.style.display = 'none';
});