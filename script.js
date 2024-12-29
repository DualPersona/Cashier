let totalPrice = 0;

const observer = new MutationObserver((mutationList, observer) => {
    for (const mutation of mutationList) {
        console.log(mutation)
        updateTable()
    }
})
const observerTarget = document.getElementById("item-table")
const observerConfig = {attributes: true, childList: true, subtree: true, characterData: true}
observer.observe(observerTarget, observerConfig)

function quantityInputListener() {
    document.querySelectorAll(".quantity-input").forEach(input => {
        input.addEventListener('change', event => {
            if (event.target.value < 0) {
                event.target.value = 1
                event.target.setAttribute('value', event.target.value)
            }
            else if (event.target.value == 0) {
                removeItem(event.target)
            }
            else{
                event.target.setAttribute('value', event.target.value)
            }
        })
    })
    //le kell újra futtatni minden alkalommal amikor egy termék hozzá van adva a táblához hogy frissítse a queryselectoros nodelistet és hozzácsatolja az eventlistenereket az új mennyiség inputokhoz is :)) úgyhogy szépen meghívjuk ezt a TermekBeszurasa() funkcióban
}

function updateHeader() {
    if (document.getElementById("item-table").rows.length < 1) {
        document.getElementById("thead").style.visibility = "hidden"
    }
    else {
        document.getElementById("thead").style.visibility = "visible"
    }
}

function updatePrices() {
    totalPrice = 0
    observer.disconnect()
    for (let tabla_sor of document.getElementById("item-table").rows){
        tabla_sor.cells[2].textContent = Number(tabla_sor.cells[2].dataset.value) * Number(tabla_sor.cells[0].firstElementChild.value)
        totalPrice = totalPrice + Number(tabla_sor.cells[2].textContent)
    }
    document.getElementById("total-price").textContent = totalPrice
    observer.observe(observerTarget, observerConfig)
}

function updateTable() {
    updateHeader()
    updatePrices()
}

function addItem() {
    const itemName = document.getElementById('item-name').value;
    const itemQuantity = parseInt(document.getElementById('item-quantity').value);
    const itemPrice = parseFloat(document.getElementById('item-price').value);
    const itemCategory = document.getElementById('item-category').value;

    if (itemName && itemQuantity > 0 && !isNaN(itemPrice) && itemPrice > 0) {
        const itemList = document.getElementById('item-table');
        const newItem = document.createElement('tr');
        const itemTotal = itemQuantity * itemPrice;

        newItem.innerHTML = `
        <td>${itemName}</td>
        <td>${itemTotal.toFixed(2)} HUF</td>
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

function removeItem(element) {
    element.closest("tr").remove();
}

function clearCart() {
    const itemList = document.getElementById('item-table');
    itemList.innerHTML = '';

    totalPrice = 0;
    document.getElementById('total-price').textContent = totalPrice.toFixed(2);
}

function filterItems() {
    const filterCategory = document.getElementById('filter-category').value;
    const items = document.getElementById('item-table').getElementsByTagName('li');

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
            resultsList.innerHTML = "";

            if (data.length > 0) {
                data.sort((a, b) => {
                    const aStartsWith = a.nev.toLowerCase().startsWith(searchInput) ? 0 : 1;
                    const bStartsWith = b.nev.toLowerCase().startsWith(searchInput) ? 0 : 1;

                    if (aStartsWith === bStartsWith) {

                        return a.nev.localeCompare(b.nev);
                    }

                    return aStartsWith - bStartsWith;
                });
                data.forEach(product => {
                    if (product.nev.toLowerCase().includes(searchInput.toLowerCase())) {
                        let tr = document.createElement("tr");
                        tr.innerHTML =`
                            <td><input class="form-check-input product-checkbox" type="checkbox" value="${product.id}"></td>
                            <td>${product.nev}</td>
                            <td>${product.ar} Ft</td>
                        `
                        resultsList.appendChild(tr);
                    }
                    else {
                        resultsList.innerHTML = "<tr><td>Nincs találat!</td></tr>";
                    }
                });
            }
        })
};

document.getElementById('modal-item-search').addEventListener('shown.bs.modal', function () {
    searchProduct()
})

function AddToCart() {
    Array.from(document.querySelectorAll(".product-checkbox")).filter(item => item.checked).forEach(item => {lekerdezes(item.value, 1)})
}

function VibrationFeedback() {
    if ("vibrate" in navigator) {
        navigator.vibrate(50);
    }
}

document.getElementById("filter-type-name").addEventListener("change", function() {
    if (this.checked) {
        document.getElementById("filter-type-category").removeAttribute("checked")
    }
})

document.getElementById("filter-type-category").addEventListener("change", function() {
    if (this.checked) {
        document.getElementById("filter-type-name").removeAttribute("checked")
    }
})