document.addEventListener('DOMContentLoaded', () => {
    const cartItems = document.getElementById('cart-items');
    const totalPriceDisplay = document.getElementById('total-price');
    const cartModal = document.getElementById('cart');
    const continueButton = document.getElementById('continue-button');
    const cartToggle = document.getElementById('cart-toggle');
    const cartCounter = document.getElementById('cart-counter'); // Elemento onde será exibido o contador

    // Object to store the quantity for each preparation type of each menu item
    const quantities = {};

    // Event listener for each menu item to toggle its expansion
    document.querySelectorAll('.menu-item').forEach(menuItem => {
        menuItem.addEventListener('click', () => {
            menuItem.classList.toggle('expanded');

            // Collapse other expanded items
            document.querySelectorAll('.menu-item').forEach(item => {
                if (item !== menuItem) {
                    item.classList.remove('expanded');
                }
            });
        });
    });

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

            updateCart(itemName, itemPrice, currentQuantity, preparation); // Atualiza com a quantidade correta
            highlightSelectedPreparation(menuItem, preparation); // Chama a função de destaque sem temporizador

            updateCartCounter(); // Atualiza o contador após alterar o carrinho
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

                updateCart(itemName, itemPrice, currentQuantity, preparation); // Atualiza com a quantidade correta
                highlightSelectedPreparation(menuItem, preparation); // Chama a função de destaque sem temporizador

                updateCartCounter(); // Atualiza o contador após alterar o carrinho

                // Limpa o carrinho se não houver itens
                if (cartItems.children.length === 0) {
                    clearCart();
                }
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
            }

            updateCartCounter(); // Atualiza o contador após alterar o carrinho
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

    function updateCart(itemName, itemPrice, currentQuantity, preparation) {
        const existingCartItem = [...cartItems.children].find(cartItem =>
            cartItem.getAttribute('data-name') === itemName &&
            cartItem.getAttribute('data-preparation') === preparation
        );

        if (existingCartItem) {
            if (currentQuantity <= 0) {
                existingCartItem.remove();
                // Limpa o carrinho se não houver itens
                if (cartItems.children.length === 0) {
                    clearCart();
                }
            } else {
                existingCartItem.textContent = `${currentQuantity} x ${itemName} (${preparation}) - R$${itemPrice.toFixed(2)}`;
                existingCartItem.setAttribute('data-quantity', currentQuantity);
            }
        } else if (currentQuantity > 0) {
            const listItem = document.createElement('li');
            listItem.textContent = `${currentQuantity} x ${itemName} (${preparation}) - R$${itemPrice.toFixed(2)}`;
            listItem.setAttribute('data-name', itemName);
            listItem.setAttribute('data-preparation', preparation);
            listItem.setAttribute('data-quantity', currentQuantity);
            cartItems.appendChild(listItem);
        }

        updateTotalPrice();
    }

    function updateTotalPrice() {
        const total = [...cartItems.children].reduce((sum, cartItem) => {
            const quantity = parseInt(cartItem.getAttribute('data-quantity')) || 0;
            const itemPrice = parseFloat(cartItem.textContent.split(' - ')[1].replace('R$', '').replace(',', '.'));
            return sum + (quantity * itemPrice);
        }, 0);
        totalPriceDisplay.textContent = ` R$${total.toFixed(2)}`;
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
                label.classList.add('selected', 'success'); // Adiciona a classe de sucesso permanentemente
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

    function clearCart() {
        while (cartItems.firstChild) {
            cartItems.removeChild(cartItems.firstChild);
        }
        updateTotalPrice();
        updateCartCounter();
    }

    // Mostra ou esconde o modal do carrinho ao clicar no botão de toggle
    cartToggle.addEventListener('click', () => {
        cartModal.classList.toggle('open');
        if (cartModal.classList.contains('open')) {
            cartToggle.textContent = 'Fechar 🛒';
        } else {
            cartToggle.textContent = '🛒';
        }
    });

    // Função para fechar o carrinho suavemente ao rolar a página
    function closeCartOnScroll() {
        if (cartModal.classList.contains('open')) {
            cartModal.classList.remove('open');
            cartToggle.textContent = '🛒';
        }
    }

    // Event listener para fechar o carrinho suavemente ao rolar a página
    window.addEventListener('scroll', closeCartOnScroll);

    // Função para atualizar o contador do carrinho
    function updateCartCounter() {
        let count = 0;
        [...cartItems.children].forEach(cartItem => {
            count += parseInt(cartItem.getAttribute('data-quantity')) || 0;
        });
        cartCounter.textContent = count;
    }

    // Call vibrateScreen whenever an increment button is clicked
    document.querySelectorAll('.increment').forEach(button => {
        button.addEventListener('click', () => {
            vibrateScreen(); // Chama a função de vibração sempre que o botão de incremento é clicado
        });
    });
});
