document.addEventListener('DOMContentLoaded', () => {
    const cartItems = document.getElementById('cart-items');
    const totalPriceDisplay = document.getElementById('total-price');

    // Object to store the quantity for each preparation type of each menu item
    const quantities = {};

    document.querySelectorAll('.select-button').forEach((button, index) => {
        button.addEventListener('click', () => {
            const controls = button.nextElementSibling;
            if (controls.classList.contains('hidden')) {
                controls.classList.remove('hidden');
                controls.classList.add('visible');
            } else {
                controls.classList.remove('visible');
                controls.classList.add('hidden');
            }
        });
    });

    document.querySelectorAll('.increment').forEach((button, index) => {
        button.addEventListener('click', () => {
            const menuItem = button.closest('.menu-item');
            const itemName = menuItem.getAttribute('data-name');
            const itemPrice = parseFloat(menuItem.getAttribute('data-price'));
            const quantityDisplay = menuItem.querySelector('.quantity-display');
            
            // Check if preparation is selected
            const preparation = getSelectedPreparation(menuItem);
            if (!preparation) {
                showPreparationError(menuItem);
                return; // Stop execution if no preparation is selected
            }

            let currentQuantity = parseInt(quantityDisplay.textContent);
            currentQuantity += 1;
            quantityDisplay.textContent = currentQuantity;

            // Add to cart
            addToCart(itemName, itemPrice, preparation);

            // Update total price
            updateTotalPrice();
        });
    });

    document.querySelectorAll('.decrement').forEach((button, index) => {
        button.addEventListener('click', () => {
            const menuItem = button.closest('.menu-item');
            const itemName = menuItem.getAttribute('data-name');
            const itemPrice = parseFloat(menuItem.getAttribute('data-price'));
            const quantityDisplay = menuItem.querySelector('.quantity-display');
            
            // Check if preparation is selected
            const preparation = getSelectedPreparation(menuItem);
            if (!preparation) {
                showPreparationError(menuItem);
                return; // Stop execution if no preparation is selected
            }

            let currentQuantity = parseInt(quantityDisplay.textContent);
            if (currentQuantity > 0) {
                currentQuantity -= 1;
                quantityDisplay.textContent = currentQuantity;

                // Remove from cart
                removeFromCart(itemName, preparation);

                // Update total price
                updateTotalPrice();
            }
        });
    });

    function getSelectedPreparation(menuItem) {
        const preparationRadios = menuItem.querySelectorAll('.preparation-radio');
        for (let radio of preparationRadios) {
            if (radio.checked) {
                return radio.value;
            }
        }
        return null;
    }

    function showPreparationError(menuItem) {
        const preparationRadios = menuItem.querySelectorAll('.preparation-radio');
        preparationRadios.forEach(radio => {
            const label = radio.closest('label');
            if (!radio.checked) {
                const spanElement = label.nextElementSibling;
                spanElement.classList.add('error'); // Adiciona a classe de erro para mostrar o feedback visual
                setTimeout(() => {
                    spanElement.classList.remove('error'); // Remove a classe de erro após um tempo
                }, 1000); // Tempo em milissegundos
            }
        });
    }

    function addToCart(itemName, itemPrice, preparation) {
        const cartItem = document.createElement('li');
        cartItem.textContent = `${itemName} - ${preparation}`;
        cartItems.appendChild(cartItem);

        // Store quantity for each preparation type
        if (!quantities[itemName]) {
            quantities[itemName] = {};
        }
        if (!quantities[itemName][preparation]) {
            quantities[itemName][preparation] = 0;
        }
        quantities[itemName][preparation] += 1;
    }

    function removeFromCart(itemName, preparation) {
        // Update quantity
        if (quantities[itemName] && quantities[itemName][preparation] > 0) {
            quantities[itemName][preparation] -= 1;
        }

        // Remove from cart display if quantity is zero
        const items = cartItems.querySelectorAll('li');
        items.forEach(item => {
            if (item.textContent.includes(itemName) && item.textContent.includes(preparation)) {
                item.parentNode.removeChild(item);
            }
        });

        // Remove preparation type if quantity is zero
        if (quantities[itemName][preparation] === 0) {
            delete quantities[itemName][preparation];
        }

        // Remove item if no preparation types left
        if (Object.keys(quantities[itemName]).length === 0) {
            delete quantities[itemName];
        }
    }

    function updateTotalPrice() {
        let totalPrice = 0;
        for (let itemName in quantities) {
            for (let preparation in quantities[itemName]) {
                const quantity = quantities[itemName][preparation];
                const itemPrice = parseFloat(document.querySelector(`.menu-item[data-name="${itemName}"]`).getAttribute('data-price'));
                totalPrice += itemPrice * quantity;
            }
        }
        totalPriceDisplay.textContent = totalPrice.toFixed(2);
    }
});
