// document.addEventListener('DOMContentLoaded', () => {
//     const orderItems = document.getElementById('order-items');
//     const orderTotalDisplay = document.getElementById('order-total');
//     const paymentButton = document.getElementById('payment-button');
//     const paymentOverlay = document.getElementById('payment-overlay');
//     const closeOverlayButton = document.getElementById('close-overlay');
//     const confirmPaymentButton = document.getElementById('confirm-payment');
//     const toggleSummaryButton = document.getElementById('toggle-summary');
//     const summaryItems = document.querySelector('#order-summary ul');
//     const priceMap = {
//         'Coca-Cola': 6.00,
//         'Coca-Cola Zero': 6.00,
//         'Guaraná Antártica': 6.00,
//         'Guaraviton': 3.00,
//         'Água Mineral': 3.00,
//         'Vinagrete': 0,
//         'Batata ao Molho': 0,
//         'Shoyu': 0,
//         'Molho Branco': 0,
//         'Para viagem': 1.00
//     };

//     let deliveryOptionPrice = 0;
//     let utensilSelected = null;

//     // Objeto para armazenar a quantidade e o preço de cada item
//     const quantities = {};

//     // Função para atualizar o carrinho
//     function updateCart(itemName, itemPrice, currentQuantity) {
//         const existingCartItem = [...orderItems.children].find(cartItem =>
//             cartItem.getAttribute('data-name') === itemName
//         );

//         if (existingCartItem) {
//             if (currentQuantity <= 0) {
//                 existingCartItem.remove();
//             } else {
//                 existingCartItem.textContent = `${currentQuantity} x ${itemName} - R$${(itemPrice * currentQuantity).toFixed(2)}`;
//                 existingCartItem.setAttribute('data-quantity', currentQuantity);
//                 existingCartItem.setAttribute('data-price', itemPrice);
//             }
//         } else if (currentQuantity > 0) {
//             const listItem = document.createElement('li');
//             listItem.textContent = `${currentQuantity} x ${itemName} - R$${(itemPrice * currentQuantity).toFixed(2)}`;
//             listItem.setAttribute('data-name', itemName);
//             listItem.setAttribute('data-quantity', currentQuantity);
//             listItem.setAttribute('data-price', itemPrice);
//             orderItems.appendChild(listItem);
//         }
//         updateTotalPrice(); // Atualiza o total sempre que o carrinho é atualizado
//     }

//     // Função para atualizar o total do pedido
//     function updateTotalPrice() {
//         const total = [...orderItems.children].reduce((sum, cartItem) => {
//             const quantity = parseInt(cartItem.getAttribute('data-quantity')) || 0;
//             const itemPrice = parseFloat(cartItem.getAttribute('data-price')) || 0;
//             return sum + (quantity * itemPrice);
//         }, 0);

//         orderTotalDisplay.textContent = `Total: R$${total.toFixed(2)}`;
//     }

//     // Função para restaurar o carrinho do localStorage
//     function restoreCart() {
//         const cartData = JSON.parse(localStorage.getItem('cartData')) || [];
//         cartData.forEach(item => {
//             const itemName = item.name;
//             const itemPrice = item.price;
//             const currentQuantity = item.quantity;
//             quantities[itemName] = { price: itemPrice, quantity: currentQuantity };
//             updateCart(itemName, itemPrice, currentQuantity);
//         });
//     }

//     // Restaura o carrinho ao carregar a página
//     restoreCart();

//     // Adiciona as opções de acompanhamento ao carrinho
//     document.querySelectorAll('.accompaniment-item').forEach(item => {
//         const incrementButton = item.querySelector('.increment');
//         const decrementButton = item.querySelector('.decrement');
//         const quantityDisplay = item.querySelector('.quantity-display');
//         const itemName = item.querySelector('span').textContent;
//         const itemPrice = priceMap[itemName] || 0;

//         incrementButton.addEventListener('click', () => {
//             let currentQuantity = parseInt(quantityDisplay.textContent);
//             currentQuantity += 1;
//             quantityDisplay.textContent = currentQuantity;

//             // Atualiza o carrinho
//             if (!quantities[itemName]) {
//                 quantities[itemName] = { price: itemPrice, quantity: 0 };
//             }
//             quantities[itemName].quantity = currentQuantity;

//             updateCart(itemName, itemPrice, currentQuantity);
//             updateTotalPrice();
//         });

//         decrementButton.addEventListener('click', () => {
//             let currentQuantity = parseInt(quantityDisplay.textContent);
//             if (currentQuantity > 0) {
//                 currentQuantity -= 1;
//                 quantityDisplay.textContent = currentQuantity;

//                 // Atualiza o carrinho
//                 if (!quantities[itemName]) {
//                     quantities[itemName] = { price: itemPrice, quantity: 0 };
//                 }
//                 quantities[itemName].quantity = currentQuantity;

//                 updateCart(itemName, itemPrice, currentQuantity);
//                 updateTotalPrice();
//             }
//         });
//     });

//     // Função para alternar a exibição do resumo do pedido
//     toggleSummaryButton.addEventListener('click', () => {
//         const isHidden = summaryItems.classList.toggle('hidden');
//         toggleSummaryButton.textContent = isHidden ? 'Mostrar Detalhes' : 'Ocultar Detalhes';

//         // Exibe o botão de pagamento somente quando o resumo não está oculto
//         paymentButton.classList.toggle('hidden', isHidden);
//     });

//     // Função para mostrar o overlay de pagamento ao clicar no botão
//     paymentButton.addEventListener('click', () => {
//         paymentOverlay.style.display = 'flex'; // Exibe o overlay
//     });

//     // Função para fechar o overlay de pagamento ao clicar no botão de fechar
//     closeOverlayButton.addEventListener('click', () => {
//         paymentOverlay.style.display = 'none'; // Oculta o overlay
//     });

//     // Confirmar pagamento e exibir método selecionado
//     confirmPaymentButton.addEventListener('click', () => {
//         const selectedMethod = document.querySelector('input[name="payment-method"]:checked');
//         if (selectedMethod) {
//             alert(`Método de pagamento selecionado: ${selectedMethod.nextSibling.textContent.trim()}`);
//         } else {
//             alert('Por favor, selecione um método de pagamento.');
//         }
//     });

//     // Atualiza o preço adicional baseado na opção selecionada
//     let previousOption = null;
//     document.querySelectorAll('input[name="delivery-option"]').forEach(option => {
//         option.addEventListener('change', () => {
//             if (previousOption === 'takeaway') {
//                 updateCart('Para viagem', 1.00, 0); // Remove o valor anterior
//             }
//             if (option.value === 'takeaway') {
//                 updateCart('Para viagem', 1.00, 1); // Adiciona o valor correto
//             }
//             previousOption = option.value;
//             updateTotalPrice();
//         });
//     });

//     // Adiciona a opção de talher ao carrinho  
//     document.querySelectorAll('input[name="utensil"]').forEach(option => {
//         option.addEventListener('change', () => {
//             const utensilName = option.value === 'hashi' ? 'Hashi' : 'Garfo e Faca';
//             if (utensilSelected) {
//                 updateCart(utensilSelected, 0, 0);
//             }
//             utensilSelected = utensilName;
//             updateCart(utensilSelected, 0, 1);
//         });
//     });
// });


document.addEventListener('DOMContentLoaded', () => {
    const orderItems = document.getElementById('order-items');
    const orderTotalDisplay = document.getElementById('order-total');
    const paymentButton = document.getElementById('payment-button');
    const paymentOverlay = document.getElementById('payment-overlay');
    const closeOverlayButton = document.getElementById('close-overlay');
    const confirmPaymentButton = document.getElementById('confirm-payment');
    const toggleSummaryButton = document.getElementById('toggle-summary');
    const summaryItems = document.querySelector('#order-summary ul');
    const totalPaymentDisplay = document.getElementById('total-payment');
    const priceMap = {
        'Coca-Cola': 6.00,
        'Coca-Cola Zero': 6.00,
        'Guaraná Antártica': 6.00,
        'Guaraviton': 3.00,
        'Água Mineral': 3.00,
        'Vinagrete': 0,
        'Batata ao Molho': 0,
        'Shoyu': 0,
        'Molho Branco': 0,
        'Para viagem': 1.00
    };

    let deliveryOptionPrice = 0;
    let utensilSelected = null;

    // Objeto para armazenar a quantidade e o preço de cada item
    const quantities = {};

    // Função para atualizar o carrinho
    function updateCart(itemName, itemPrice, currentQuantity) {
        const existingCartItem = [...orderItems.children].find(cartItem =>
            cartItem.getAttribute('data-name') === itemName
        );

        if (existingCartItem) {
            if (currentQuantity <= 0) {
                existingCartItem.remove();
            } else {
                existingCartItem.textContent = `${currentQuantity} x ${itemName} - R$${(itemPrice * currentQuantity).toFixed(2)}`;
                existingCartItem.setAttribute('data-quantity', currentQuantity);
                existingCartItem.setAttribute('data-price', itemPrice);
            }
        } else if (currentQuantity > 0) {
            const listItem = document.createElement('li');
            listItem.textContent = `${currentQuantity} x ${itemName} - R$${(itemPrice * currentQuantity).toFixed(2)}`;
            listItem.setAttribute('data-name', itemName);
            listItem.setAttribute('data-quantity', currentQuantity);
            listItem.setAttribute('data-price', itemPrice);
            orderItems.appendChild(listItem);
        }
        updateTotalPrice(); // Atualiza o total sempre que o carrinho é atualizado
    }

    // Função para atualizar o total do pedido
    function updateTotalPrice() {
        const total = [...orderItems.children].reduce((sum, cartItem) => {
            const quantity = parseInt(cartItem.getAttribute('data-quantity')) || 0;
            const itemPrice = parseFloat(cartItem.getAttribute('data-price')) || 0;
            return sum + (quantity * itemPrice);
        }, 0);

        orderTotalDisplay.textContent = `Total: R$${total.toFixed(2)}`;
        return total;
    }

    // Função para restaurar o carrinho do localStorage
    function restoreCart() {
        const cartData = JSON.parse(localStorage.getItem('cartData')) || [];
        cartData.forEach(item => {
            const itemName = item.name;
            const itemPrice = item.price;
            const currentQuantity = item.quantity;
            quantities[itemName] = { price: itemPrice, quantity: currentQuantity };
            updateCart(itemName, itemPrice, currentQuantity);
        });
    }

    // Restaura o carrinho ao carregar a página
    restoreCart();

    // Adiciona as opções de acompanhamento ao carrinho
    document.querySelectorAll('.accompaniment-item').forEach(item => {
        const incrementButton = item.querySelector('.increment');
        const decrementButton = item.querySelector('.decrement');
        const quantityDisplay = item.querySelector('.quantity-display');
        const itemName = item.querySelector('span').textContent;
        const itemPrice = priceMap[itemName] || 0;

        incrementButton.addEventListener('click', () => {
            let currentQuantity = parseInt(quantityDisplay.textContent);
            currentQuantity += 1;
            quantityDisplay.textContent = currentQuantity;

            // Atualiza o carrinho
            if (!quantities[itemName]) {
                quantities[itemName] = { price: itemPrice, quantity: 0 };
            }
            quantities[itemName].quantity = currentQuantity;

            updateCart(itemName, itemPrice, currentQuantity);
            updateTotalPrice();
        });

        decrementButton.addEventListener('click', () => {
            let currentQuantity = parseInt(quantityDisplay.textContent);
            if (currentQuantity > 0) {
                currentQuantity -= 1;
                quantityDisplay.textContent = currentQuantity;

                // Atualiza o carrinho
                if (!quantities[itemName]) {
                    quantities[itemName] = { price: itemPrice, quantity: 0 };
                }
                quantities[itemName].quantity = currentQuantity;

                updateCart(itemName, itemPrice, currentQuantity);
                updateTotalPrice();
            }
        });
    });

    // Função para alternar a exibição do resumo do pedido
    toggleSummaryButton.addEventListener('click', () => {
        const isHidden = summaryItems.classList.toggle('hidden');
        toggleSummaryButton.textContent = isHidden ? 'Mostrar Detalhes' : 'Ocultar Detalhes';

        // Exibe o botão de pagamento somente quando o resumo não está oculto
        paymentButton.classList.toggle('hidden', isHidden);
    });

    // Função para mostrar o overlay de pagamento ao clicar no botão
    paymentButton.addEventListener('click', () => {
        paymentOverlay.style.display = 'flex'; // Exibe o overlay
        const total = updateTotalPrice(); // Atualiza e obtém o valor total
        totalPaymentDisplay.textContent = `Total a pagar: R$${total.toFixed(2)}`;
    });

    // Função para fechar o overlay de pagamento ao clicar no botão de fechar
    closeOverlayButton.addEventListener('click', () => {
        paymentOverlay.style.display = 'none'; // Oculta o overlay
    });

    // Confirmar pagamento e exibir método selecionado
    confirmPaymentButton.addEventListener('click', () => {
        const selectedMethod = document.querySelector('input[name="payment-method"]:checked');
        if (selectedMethod) {
            alert(`Método de pagamento selecionado: ${selectedMethod.nextSibling.textContent.trim()}`);
        } else {
            alert('Por favor, selecione um método de pagamento.');
        }
    });

    // Atualiza o preço adicional baseado na opção selecionada
    let previousOption = null;
    document.querySelectorAll('input[name="delivery-option"]').forEach(option => {
        option.addEventListener('change', () => {
            if (previousOption === 'takeaway') {
                updateCart('Para viagem', 1.00, 0); // Remove o valor anterior
            }
            if (option.value === 'takeaway') {
                updateCart('Para viagem', 1.00, 1); // Adiciona o valor correto
            }
            previousOption = option.value;
            updateTotalPrice();
        });
    });

    // Adiciona a opção de talher ao carrinho  
    document.querySelectorAll('input[name="utensil"]').forEach(option => {
        option.addEventListener('change', () => {
            const utensilName = option.value === 'hashi' ? 'Hashi' : 'Garfo e Faca';
            if (utensilSelected) {
                updateCart(utensilSelected, 0, 0);
            }
            utensilSelected = utensilName;
            updateCart(utensilSelected, 0, 1);
        });
    });
});

