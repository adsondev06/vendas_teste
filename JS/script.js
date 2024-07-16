// document.addEventListener('DOMContentLoaded', () => {
//     const cartItems = document.getElementById('cart-items');
//     const totalPriceDisplay = document.getElementById('total-price');

//     document.querySelectorAll('.select-button').forEach((button, index) => {
//         button.addEventListener('click', () => {
//             const controls = button.nextElementSibling;
//             if (controls.classList.contains('hidden')) {
//                 controls.classList.remove('hidden');
//                 controls.classList.add('visible');
//             } else {
//                 controls.classList.remove('visible');
//                 controls.classList.add('hidden');
//             }
//         });
//     });

//     document.querySelectorAll('.increment').forEach((button, index) => {
//         button.addEventListener('click', () => {
//             const menuItem = button.closest('.menu-item');
//             const itemName = menuItem.getAttribute('data-name');
//             const itemPrice = parseFloat(menuItem.getAttribute('data-price'));
//             const quantityDisplay = menuItem.querySelector('.quantity-display');
//             let currentQuantity = parseInt(quantityDisplay.textContent);
//             currentQuantity += 1;
//             quantityDisplay.textContent = currentQuantity;

//             updateCart(itemName, itemPrice, currentQuantity);
//         });
//     });

//     document.querySelectorAll('.decrement').forEach((button, index) => {
//         button.addEventListener('click', () => {
//             const menuItem = button.closest('.menu-item');
//             const itemName = menuItem.getAttribute('data-name');
//             const itemPrice = parseFloat(menuItem.getAttribute('data-price'));
//             const quantityDisplay = menuItem.querySelector('.quantity-display');
//             let currentQuantity = parseInt(quantityDisplay.textContent);
//             if (currentQuantity > 0) {
//                 currentQuantity -= 1;
//                 quantityDisplay.textContent = currentQuantity;

//                 updateCart(itemName, itemPrice, currentQuantity);
//             }
//         });
//     });

//     document.querySelectorAll('input[name^="preparation"]').forEach((radio) => {
//         radio.addEventListener('change', () => {
//             const menuItem = radio.closest('.menu-item');
//             const itemName = menuItem.getAttribute('data-name');
//             const itemPrice = parseFloat(menuItem.getAttribute('data-price'));
//             const quantityDisplay = menuItem.querySelector('.quantity-display');

//             // Reset the quantity display to 0
//             quantityDisplay.textContent = '0';

//             // Remove the item from the cart
//             updateCart(itemName, itemPrice, 0);
//         });
//     });

//     function updateCart(itemName, itemPrice, quantity) {
//         const menuItem = document.querySelector(`[data-name="${itemName}"]`);
//         const preparationRadios = menuItem.querySelectorAll('input[name^="preparation"]');
//         let selectedPreparation = '';

//         preparationRadios.forEach(radio => {
//             if (radio.checked) {
//                 selectedPreparation = radio.value;
//             }
//         });

//         const existingCartItem = [...cartItems.children].find(cartItem =>
//             cartItem.getAttribute('data-name') === itemName &&
//             cartItem.getAttribute('data-preparation') === selectedPreparation
//         );

//         if (existingCartItem) {
//             if (quantity === 0) {
//                 existingCartItem.remove();
//             } else {
//                 existingCartItem.textContent = `${quantity} x ${itemName} (${selectedPreparation}) - R$${(itemPrice * quantity).toFixed(2)}`;
//                 existingCartItem.setAttribute('data-quantity', quantity);
//             }
//         } else if (quantity > 0 && selectedPreparation !== '') {
//             const listItem = document.createElement('li');
//             listItem.textContent = `${quantity} x ${itemName} (${selectedPreparation}) - R$${(itemPrice * quantity).toFixed(2)}`;
//             listItem.setAttribute('data-name', itemName);
//             listItem.setAttribute('data-preparation', selectedPreparation);
//             listItem.setAttribute('data-quantity', quantity);
//             cartItems.appendChild(listItem);
//         }

//         updateTotalPrice();
//     }

//     function updateTotalPrice() {
//         const total = [...cartItems.children].reduce((sum, cartItem) => {
//             const quantity = parseInt(cartItem.getAttribute('data-quantity'));
//             const itemPrice = parseFloat(cartItem.textContent.split(' - ')[1].replace('R$', '').replace(',', '.'));
//             return sum + itemPrice;
//         }, 0);
//         totalPriceDisplay.textContent = ` ${total.toFixed(2)}`;
//     }
// });


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
            let currentQuantity = parseInt(quantityDisplay.textContent);
            currentQuantity += 1;
            quantityDisplay.textContent = currentQuantity;

            const preparation = getSelectedPreparation(menuItem);
            if (!quantities[itemName]) {
                quantities[itemName] = {};
            }
            quantities[itemName][preparation] = currentQuantity;

            updateCart(itemName, itemPrice, currentQuantity, preparation);
        });
    });

    document.querySelectorAll('.decrement').forEach((button, index) => {
        button.addEventListener('click', () => {
            const menuItem = button.closest('.menu-item');
            const itemName = menuItem.getAttribute('data-name');
            const itemPrice = parseFloat(menuItem.getAttribute('data-price'));
            const quantityDisplay = menuItem.querySelector('.quantity-display');
            let currentQuantity = parseInt(quantityDisplay.textContent);
            if (currentQuantity > 0) {
                currentQuantity -= 1;
                quantityDisplay.textContent = currentQuantity;

                const preparation = getSelectedPreparation(menuItem);
                if (!quantities[itemName]) {
                    quantities[itemName] = {};
                }
                quantities[itemName][preparation] = currentQuantity;

                updateCart(itemName, itemPrice, currentQuantity, preparation);
            }
        });
    });

    document.querySelectorAll('input[name^="preparation"]').forEach((radio) => {
        radio.addEventListener('change', () => {
            const menuItem = radio.closest('.menu-item');
            const itemName = menuItem.getAttribute('data-name');
            const itemPrice = parseFloat(menuItem.getAttribute('data-price'));
            const quantityDisplay = menuItem.querySelector('.quantity-display');
            
            // Reset the quantity display to the stored value or 0 if not set
            const preparation = getSelectedPreparation(menuItem);
            const previousPreparation = [...radio.closest('.preparation').querySelectorAll('input[name^="preparation"]')]
                .find(input => input.checked && input !== radio);
            const previousPreparationName = previousPreparation ? previousPreparation.value : null;

            if (previousPreparationName) {
                const previousQuantity = quantities[itemName]?.[previousPreparationName] || 0;
                quantityDisplay.textContent = '0';
                updateCart(itemName, itemPrice, 0, previousPreparationName);
            }

            const currentQuantity = quantities[itemName]?.[preparation] || 0;
            quantityDisplay.textContent = currentQuantity;

            updateCart(itemName, itemPrice, currentQuantity, preparation);
        });
    });

    function getSelectedPreparation(menuItem) {
        const preparationRadios = menuItem.querySelectorAll('input[name^="preparation"]');
        let selectedPreparation = '';
        preparationRadios.forEach(radio => {
            if (radio.checked) {
                selectedPreparation = radio.value;
            }
        });
        return selectedPreparation;
    }

    function updateCart(itemName, itemPrice, quantity, preparation) {
        const existingCartItem = [...cartItems.children].find(cartItem =>
            cartItem.getAttribute('data-name') === itemName &&
            cartItem.getAttribute('data-preparation') === preparation
        );

        if (existingCartItem) {
            if (quantity === 0) {
                existingCartItem.remove();
            } else {
                existingCartItem.textContent = `${quantity} x ${itemName} (${preparation}) - R$${(itemPrice * quantity).toFixed(2)}`;
                existingCartItem.setAttribute('data-quantity', quantity);
            }
        } else if (quantity > 0) {
            const listItem = document.createElement('li');
            listItem.textContent = `${quantity} x ${itemName} (${preparation}) - R$${(itemPrice * quantity).toFixed(2)}`;
            listItem.setAttribute('data-name', itemName);
            listItem.setAttribute('data-preparation', preparation);
            listItem.setAttribute('data-quantity', quantity);
            cartItems.appendChild(listItem);
        }

        updateTotalPrice();
    }

    function updateTotalPrice() {
        const total = [...cartItems.children].reduce((sum, cartItem) => {
            const itemPrice = parseFloat(cartItem.textContent.split(' - ')[1].replace('R$', '').replace(',', '.'));
            return sum + itemPrice;
        }, 0);
        totalPriceDisplay.textContent = ` ${total.toFixed(2)}`;
    }
});
