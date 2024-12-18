document.addEventListener("DOMContentLoaded", () => {
  const addToCartButtons = document.querySelectorAll(".add-to-cart");
  const cartItemsContainer = document.getElementById("cart-items");
  const cartQuantityDisplay = document.querySelector("#cart h3");
  const emptyCartMessage = document.querySelector(".empty-cart");
  const totalAmountDisplay = document.getElementById("total-amount");
  const cartTotalSection = document.querySelector(".cart-total");
  const orderSection = document.getElementById("order");

  //ORDER CONFIRMATION
  const overlay = document.getElementById("overlay");
  const popup = document.getElementById("order-confirmation");
  const closePopupButton = document.getElementById("closePopup");
  const confirmedItems = document.getElementById("confirmed-orders");




  let cart = []; // Array to store cart items

  // Function to update the cart display
  function updateCartDisplay() {
    cartItemsContainer.innerHTML = "";

    // Update cart UI
    cart.forEach((item, index) => {
      const cartItem = document.createElement("div");
      cartItem.classList.add("cart-item");
      const itemPriceandQuantity = item.quantity * item.price;

      cartItem.innerHTML = `
        <div class="cart-item-content">
          <div class="cart-item-header">
            <p class="cart-item-name">${item.name}</p>
            <button class="remove-button" data-index="${index}">
              <img src="./assets/images/icon-remove-item.svg" alt="Remove Item">
            </button>
          </div>
          <p class="cart-item-details">
            <span class="item-quantity">${item.quantity}x</span> &nbsp; 
            <span class="item-price">@ $${item.price.toFixed(2)}</span> &nbsp;  
            <span class="item-total">$${itemPriceandQuantity.toFixed(2)}</span>
          </p>
        </div>
        <div class="cart-item-divider"></div>
      `;
      cartItemsContainer.appendChild(cartItem);
    });

    const removeButtons = document.querySelectorAll(".remove-button");
    removeButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const itemIndex = parseInt(button.dataset.index, 10);
        removeItemFromCart(itemIndex);
      });
    });

    const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    cartQuantityDisplay.innerHTML = `Your Cart (${totalQuantity})`;
    totalAmountDisplay.textContent = `$${totalAmount.toFixed(2)}`;
    emptyCartMessage.style.display = totalQuantity === 0 ? "flex" : "none";
    cartTotalSection.style.display = totalQuantity === 0 ? "none" : "flex";
    orderSection.style.display = totalQuantity === 0 ? "none" : "flex";
  }

  function removeItemFromCart(index) {
    const removedItem = cart[index]; // Get the item being removed
    cart.splice(index, 1); // Remove the item from the cart

    const gridButtons = document.querySelectorAll(".add-to-cart");
    gridButtons.forEach((button) => {
      if (button.dataset.itemName === removedItem.name) {
        const parentItem = button.closest(".item");
        parentItem.classList.remove("selected");
        button.innerHTML = `
            <img src="./assets/images/icon-add-to-cart.svg"><span>Add to Cart</span>
        `;
      }
    });
    updateCartDisplay(); // Refresh the cart
  }

  // Function to handle adding/updating an item in the cart
  function addItemToCart(itemName, itemPrice, count, itemImage) {
    const existingItem = cart.find((item) => item.name === itemName);

    if (existingItem) {
      existingItem.quantity = count; // Update quantity if already in cart
    } else {
      cart.push({ name: itemName, price: itemPrice, quantity: count, image: itemImage });
    }

    updateCartDisplay();
  }

  // Attach event listeners to all "Add to Cart" buttons
  addToCartButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const isAddToCart = button.querySelector("span").innerText === "Add to Cart";

      if (isAddToCart) {
        // Change to counter
        const parentItem = button.closest(".item");
        parentItem.classList.add("selected");
        //button.classList.add("selected");
        button.innerHTML = `
          <div class="btn">
            <button class="decrement-btn">
              <img src="./assets/images/icon-decrement-quantity.svg" class="decrement-img">
            </button>
          </div>  
          <span class="count">1</span>
          <div class="btn">
            <button class="increment-btn">
              <img src="./assets/images/icon-increment-quantity.svg" class="increment-img">
            </button>
          </div>
        `;

        const itemName = button.dataset.itemName;
        const itemPrice = parseFloat(button.dataset.itemPrice);
        const itemImage = button.dataset.itemImage;

        let count = 1;
        addItemToCart(itemName, itemPrice, count, itemImage); // Add to cart initially with count = 1

        const decrementBtn = button.querySelector(".decrement-btn");
        const incrementBtn = button.querySelector(".increment-btn");
        const countDisplay = button.querySelector(".count");

        // Decrement Button Logic
        decrementBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          if (count > 1) {
            count--;
            countDisplay.innerText = count;
            addItemToCart(itemName, itemPrice, count, itemImage); // Update cart quantity
          } else {
            parentItem.classList.remove("selected");
            // button.classList.remove("selected");
            button.innerHTML = `
              <img src="./assets/images/icon-add-to-cart.svg"><span>Add to Cart</span>
            `;
            cart = cart.filter((item) => item.name !== itemName); // Remove item from cart
            updateCartDisplay();
          }
        });

        // Increment Button Logic
        incrementBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          count++;
          countDisplay.innerText = count;
          addItemToCart(itemName, itemPrice, count, itemImage); // Update cart quantity
        });
      }
    });
  });

  // Function to show the popup and overlay
  function showPopup() {
    overlay.style.display = "block";
    popup.style.display = "block";

    let orderTotal = 0;
    confirmedItems.innerHTML = "";

    cart.forEach((item, index) => {
      
      const itemPriceandQuantity = item.quantity * item.price;
      orderTotal += itemPriceandQuantity;

      const orderItem = document.createElement("div");
      orderItem.classList.add("order-item");

      orderItem.innerHTML = `
        <div class="order-item-row">
            <img src="${item.image}" alt="${item.name}" class="order-item-image">
            <div class="order-item-details">
                <div class="item-info">
                    <p class="item-name">${item.name}</p>
                    <p class="item-total">$${itemPriceandQuantity.toFixed(2)}</p>
                </div>
                <div class="item-pricing">
                    <p class="item-quantity">${item.quantity}x &nbsp; <span class="item-atprice"> @$${item.price.toFixed(2)}</span></p>
                </div>
            </div>
            
        </div>
        <div class="order-item-divider"></div>
      `;
      confirmedItems.appendChild(orderItem);
      
      document.body.classList.add('no-scroll');
    });

    const orderTotalElement = document.createElement("div");
    orderTotalElement.classList.add("order-total");
    orderTotalElement.innerHTML = `
      <p>Order Total</p> <h3>$${orderTotal.toFixed(2)}</h3>
    `;
    confirmedItems.appendChild(orderTotalElement);

    
  }

  // Function to hide the popup and overlay
  function closePopup() {
    overlay.style.display = "none";
    popup.style.display = "none";
    cart = [];

    const gridButtons = document.querySelectorAll(".add-to-cart");
    gridButtons.forEach((button) => {
      const parentItem = button.closest(".item");
      parentItem.classList.remove("selected");

      button.innerHTML = `
            <img src="./assets/images/icon-add-to-cart.svg"><span>Add to Cart</span>
        `;
    }
    );
    document.body.classList.remove('no-scroll');
    updateCartDisplay();
  }

  // Example: Trigger the popup on some event (like order confirmation)
  document.getElementById("confirm-order").addEventListener("click", showPopup);

  // Close the popup when the close button is clicked
  closePopupButton.addEventListener("click", closePopup);

  // Optional: Close popup and overlay if user clicks outside the popup
  overlay.addEventListener("click", closePopup);

  // Initial cart display
  updateCartDisplay();
});
