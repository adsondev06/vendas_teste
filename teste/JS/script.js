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
            
            const preparationRadio = menuItem.querySelector('input[type="radio"]:checked');
            if (!preparationRadio) {
                showPreparationError(menuItem);
                vibrateScreen(); // Chama a função de vibração imediatamente
                return; // Impede o incremento se não houver preparo selecionado
            }
            
            currentQuantity += 1;
            quantityDisplay.textContent = currentQuantity;

            const preparation = preparationRadio.value;
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

                const preparationRadio = menuItem.querySelector('input[type="radio"]:checked');
                const preparation = preparationRadio ? preparationRadio.value : null;

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

            // Reset error state if radio is selected
            if (radio.checked) {
                resetPreparationError(menuItem);
                highlightSelectedPreparation(menuItem, preparation);
                menuItem.classList.add('success'); // Adiciona a classe de sucesso
                setTimeout(() => {
                    menuItem.classList.remove('success'); // Remove a classe de sucesso após 3 segundos
                }, 3000);
            }
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

    function showPreparationError(menuItem) {
        const preparationContainer = menuItem.querySelector('.preparation');
        preparationContainer.classList.add('error');
        setTimeout(() => {
            preparationContainer.classList.remove('error');
        }, 3000); // Remove a classe de erro após 3 segundos
    }

    function resetPreparationError(menuItem) {
        const preparationContainer = menuItem.querySelector('.preparation');
        preparationContainer.classList.remove('error');
    }

    function highlightSelectedPreparation(menuItem, selectedPreparation) {
        const preparationLabels = menuItem.querySelectorAll('.preparation label');
        preparationLabels.forEach(label => {
            if (label.textContent.includes(selectedPreparation)) {
                label.classList.add('selected');
            } else {
                label.classList.remove('selected');
            }
        });
    }

    function vibrateScreen() {
        const menuItemContainers = document.querySelectorAll('.menu-item');
        menuItemContainers.forEach(container => {
            const preparationRadio = container.querySelector('input[type="radio"]:checked');
            if (!preparationRadio) {
                container.classList.add('vibrate');
                setTimeout(() => {
                    container.classList.remove('vibrate');
                }, 500);
            }
        });
    }

    // Call vibrateScreen whenever an increment button is clicked
    document.querySelectorAll('.increment').forEach(button => {
        button.addEventListener('click', () => {
            vibrateScreen(); // Chama a função de vibração sempre que o botão de incremento é clicado
        });
    });
});
