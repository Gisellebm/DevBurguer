const menu = document.getElementById('menu');
const cartBtn = document.getElementById('cart-btn');
const cardModal = document.getElementById('card-modal');
const cardItemsContainer = document.getElementById('card-items');
const cardTotal = document.getElementById('card-total');
const checkoutBtn = document.getElementById('checkout-btn');
const closeModalBtn = document.getElementById('close-modal-btn');
const addressInput = document.getElementById('address');
const addressWarn = document.getElementById('address-warn');
const cartCounter = document.getElementById('cart-count');

let cart = [];

// Abrir o modal do carrinho
cartBtn.addEventListener('click', function() {
    updateCartModal();
    cardModal.style.display = 'flex';
});

// Fechar o modal quando clicar fora
cardModal.addEventListener('click', function(e) {
    if (e.target === cardModal) {
        cardModal.style.display = 'none';
    }
})


closeModalBtn.addEventListener('click', function() {
    cardModal.style.display = 'none';
});

menu.addEventListener('click', function(e) {
    //console.log(e.target);
    let parentButton = e.target.closest('.add-to-cart-btn');
    if (parentButton) {
        const name = parentButton.getAttribute('data-name');
        const price = parseFloat(parentButton.getAttribute('data-price'));
        
        // Adicionar ao carrinho
        addToCart(name, price);
    }
})

// Função para adicionar ao carrinho
function addToCart(name, price) {
    const existingItem = cart.find(item => item.name === name);

    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({name, price, quantity: 1});
    }

    updateCartModal();
    
}


// Função para atualizar carrinho
function updateCartModal() {
    // Limpar o conteúdo do carrinho
    cardItemsContainer.innerHTML = '';

    let total = 0;

    cart.forEach(item => {

        const cartItemElement = document.createElement('div');
        cartItemElement.classList.add('flex', 'justify-between', 'mb-4', 'flex-col');

        cartItemElement.innerHTML = `
            <div class="flex items-center justify-between">
                <div>
                    <p class="font-bold">${item.name}</p>
                    <p>Qtd.:  ${item.quantity}</p>            
                    <p class="font-medium mt-2">R$ ${item.price.toFixed(2)}</p>
                </div>
                <button class="remove-from-cart-btn hover:text-red-600 hover:font-bold" data-name="${item.name}">
                    Remover
                </button>
            </div>
        `
        total += item.price * item.quantity;

        cardItemsContainer.appendChild(cartItemElement);
    })

    cardTotal.textContent = total.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'});

    cartCounter.innerHTML = cart.length;
}

// Função para remover item no carrinho
cardItemsContainer.addEventListener('click', function(e) {
    if (e.target.classList.contains('remove-from-cart-btn')) {
        const name = e.target.getAttribute('data-name');

        removeItemcard(name);
    }
})

function removeItemcard(name) {
    const index = cart.findIndex(item => item.name === name);

    if (index !== -1) {
        const item = cart[index];
        
        if (item.quantity > 1) {
            item.quantity--;
            updateCartModal();
            return
        } 

        cart.splice(index, 1);
        updateCartModal();
    }

}
// 
addressInput.addEventListener("input", function(e) {
    let inputValue = e.target.value;

    if (inputValue !== '') {
        addressWarn.classList.add('hidden');
        addressInput.classList.remove('border-red-500');
    }
})

checkoutBtn.addEventListener('click', function() {
    const isOpen = checkRestaurantOpen();
    if (!isOpen) {

        Toastify({
            text: "Ops!! Estamos fechados. Tente mais tarde!",
            duration: 3000,
            close: true,
            gravity: "top", // `top` or `bottom`
            position: "right", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
              background: "#ef4444",
            },
        }).showToast();
        
        return
    }

    if (cart.length === 0) return

    if (addressInput.value === '') {
        addressWarn.classList.remove('hidden');
        addressInput.classList.add('border-red-500');
        return
    }   
    
    //enviar o pedido para Api do whatsapp
    const cartItems = cart.map(item => {
        return (
            `- Qtd.: ${item.quantity} - ${item.name} ---- Total Item: R$ ${(item.quantity * item.price).toFixed(2)}\n`
        )
    }).join('')

    const message = encodeURIComponent(cartItems)
    const phone = "22988346421"
    window.open(`https://wa.me/${phone}?text=${message} Endereço: ${addressInput.value}`, "_blank");
})

// Função para verificar a hora e manipular o card de horário
function checkRestaurantOpen() {
    const data = new Date();
    const hour = data.getHours();
    return hour >= 18 && hour < 22
    // true = restaurante aberto, false = restaurante fechado
}

const spanItem = document.getElementById('date-span'); 
const isOpen = checkRestaurantOpen();

if (isOpen) {
    spanItem.classList.remove('bg-red-500');
    spanItem.classList.add('bg-green-600');
} else {
    spanItem.classList.remove('bg-green-600');
    spanItem.classList.add('bg-red-500');
}