let totalPrice = 0;

function addItem() {
    const itemName = document.getElementById('item-name').value;
    const itemQuantity = parseInt(document.getElementById('item-quantity').value);
    const itemPrice = parseFloat(document.getElementById('item-price').value);
    const itemCategory = document.getElementById('item-category').value;

    if (itemName && itemQuantity > 0 && !isNaN(itemPrice) && itemPrice > 0) {
        const itemList = document.getElementById('item-list');
        const newItem = document.createElement('li');
        const itemTotal = itemQuantity * itemPrice;

        newItem.setAttribute('data-category', itemCategory); // Kategória hozzáadása attribútumként

        newItem.innerHTML = `${itemName} (${itemQuantity} x ${itemPrice.toFixed(2)} HUF) - ${itemTotal.toFixed(2)} HUF 
        <strong>Kategória:</strong> ${itemCategory} 
        <button class="delete-btn" onclick="removeItem(this, ${itemTotal})">Törlés</button>`;
        itemList.appendChild(newItem);

        totalPrice += itemTotal;
        document.getElementById('total-price').textContent = totalPrice.toFixed(2);

        // Tisztítja a mezőket
        document.getElementById('item-name').value = '';
        document.getElementById('item-quantity').value = 1;
        document.getElementById('item-price').value = '';
    } else {
        alert('Kérlek, add meg a termék nevét, mennyiségét és árát helyesen!');
    }
}
// Kupon Funkció 
function applyCoupon() {
    const coupon = document.getElementById('coupon-code').value.trim();

    if (coupon === "DISCOUNT10") {
        totalPrice *= 0.9; // 10% kedvezmény
        document.getElementById('total-price').textContent = totalPrice.toFixed(2);
        alert('A kuponkód sikeresen beváltva! 10% kedvezményt kaptál.');
    } else {
        alert('Érvénytelen kuponkód!');
    }
}

function removeItem(element, itemTotal) {
    element.parentElement.remove();
    totalPrice -= itemTotal;
    document.getElementById('total-price').textContent = totalPrice.toFixed(2);
}

function removeItem(button, itemTotal) {
    const itemList = document.getElementById('item-list');
    itemList.removeChild(button.parentElement);

    totalPrice -= itemTotal;
    document.getElementById('total-price').textContent = totalPrice.toFixed(2);
}

function clearCart() {
    const itemList = document.getElementById('item-list');
    itemList.innerHTML = '';

    totalPrice = 0;
    document.getElementById('total-price').textContent = totalPrice.toFixed(2);
}

function filterItems() {
    const filterCategory = document.getElementById('filter-category').value;
    const items = document.getElementById('item-list').getElementsByTagName('li');

    for (let i = 0; i < items.length; i++) {
        const itemCategory = items[i].getAttribute('data-category');
        if (filterCategory === 'all' || itemCategory === filterCategory) {
            items[i].style.display = ''; // Megjelenítés
        } else {
            items[i].style.display = 'none'; // Elrejtés
        }
    }
}



// Keresés funkció
function searchProduct() {
    const searchInput = document.getElementById("search-input").value
    fetch("termekek.php")
        .then(response => response.json())
        .then(data => {
            const resultsList = document.getElementById("search-results");
            resultsList.innerHTML = ""; // Kiürítjük a korábbi eredményeket

            if (data.length > 0) {
                data.forEach(product => {
                    if (product.nev === searchInput) {
                        let li = document.createElement("li");
                        li.innerHTML =`<p>${product.nev} - ${product.ar} HUF</p> <input class="form-check-input product-checkbox" type="checkbox" value="${product.id}">`
                        resultsList.appendChild(li);
                    }
                });
            } else {
                resultsList.innerHTML = "<li>Nincs találat!</li>";
            }
        })
};

function AddToCart() {
    Array.from(document.querySelectorAll(".product-checkbox")).filter(item => item.checked).forEach(item => {lekerdezes(item.value)})
}