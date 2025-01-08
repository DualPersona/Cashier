//fontos hogy ez a js előrébb legyen felsorolva a többi js fájljainkhoz képest a html bodyban
new bootstrap.Modal(document.getElementById("modal-scan"))
new bootstrap.Modal(document.getElementById("modal-import-basket"))

let totalPrice = 0;

const observer = new MutationObserver((mutationList, observer) => {
    for (const mutation of mutationList) {
        console.log(mutation)
        updateTable()
    }
})
const observerTarget = document.getElementById("item-tbody")
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

function renderTable() {
    if (document.getElementById("item-tbody").rows.length < 1) {
        document.getElementById("item-table").style.visibility = "hidden"

    }
    else {
        document.getElementById("item-table").style.visibility = "visible"
    }
}

function updatePrices() {
    totalPrice = 0
    observer.disconnect()
    for (let tabla_sor of document.getElementById("item-tbody").rows){
        tabla_sor.cells[2].textContent = Number(tabla_sor.cells[2].dataset.value) * Number(tabla_sor.cells[0].firstElementChild.value)
        totalPrice = totalPrice + Number(tabla_sor.cells[2].textContent)
    }
    document.getElementById("total-price").textContent = totalPrice
    observer.observe(observerTarget, observerConfig)
}

function updateTable() {
    renderTable()
    updatePrices()
}

function addCustomProduct() {
    const termek = {
        nev: document.getElementById('item-name').value,
        id: "0",
        ar: document.getElementById('item-price').value
    }

    TermekBeszurasa(termek, 1)
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
    VibrationFeedback(50)
}

function clearCart() {
    const itemList = document.getElementById('item-tbody');
    itemList.innerHTML = '';

    totalPrice = 0;
    document.getElementById('total-price').textContent = totalPrice.toFixed(2);
    VibrationFeedback(750)
}

function filterItems() {
    const filterCategory = document.getElementById('filter-category').value;
    const items = document.getElementById('item-tbody').getElementsByTagName('li');

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
function searchProduct(isSearchMethodName) {
    let hasResults = false

    const place = document.getElementById("search-results")
    place.innerHTML = ""
    fetch("termekek.php")
        .then(response => response.json())
        .then(data => {
            if (data.length > 0) {
                if (isSearchMethodName === true) {
                    const searchInput = document.getElementById("search-input").value
                
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
                            searchProductResultRender(product, place)
                            hasResults = true
                        }
                    });
                }
                else {
                    if (isSearchMethodName === false) {
                        data.forEach(product => {
                            if (product.kategoria_id === document.getElementById("item-category-search").value) {
                                searchProductResultRender(product, place)
                                hasResults = true
                            }
                        });
                    }
                    else {
                        alert("rendszer hiba: A funkció nem kapott érvényes keresési módszer típust!")
                    }
                }
            }
            else {
                place.innerHTML = "<tr><td>Nincs találat!</td></tr>"
            }
        })
        .finally(() => {
            if (hasResults === false) {
                place.innerHTML = "<tr><td>Nincs találat!</td></tr>"
            }
        })
};
    
function searchProductResultRender(product, place) {
        
    let tr = document.createElement("tr");
    tr.innerHTML =`
        <td><input class="form-check-input product-checkbox" type="checkbox" value="${product.id}"></td>
        <td>${product.nev}</td>
        <td>${product.ar} Ft</td>
    `
    place.appendChild(tr);
}

document.getElementById('modal-item-search').addEventListener('show.bs.modal', function () {
    if (document.getElementById("filter-type-name").checked) {
        searchProduct(true)
    }
})

async function AddToCart() {
    const filteredItems = Array.from(document.querySelectorAll(".product-checkbox")).filter(item => item.checked)

    for (const item of filteredItems) {
        await lekerdezes(item.value, 1)
    }
}

function VibrationFeedback(duration) {
    if ("vibrate" in navigator) {
        navigator.vibrate(duration);
    }
}

document.getElementById("filter-type-name").addEventListener("change", function() {
    if (this.checked) {
        VibrationFeedback(100)
        document.getElementById("filter-type-category").removeAttribute("checked")
        document.getElementById("search-results").innerHTML = ""
        document.getElementById("item-entry").innerHTML = ""
        document.getElementById("item-entry").innerHTML = `
        <input type="text" id="search-input" placeholder="Termék neve" oninput="searchProduct(true)"></input>
        `
        searchProduct(true)
    }
})

document.getElementById("filter-type-category").addEventListener("change", function() {
    if (this.checked) {
        VibrationFeedback(100)
        document.getElementById("filter-type-name").removeAttribute("checked")
        document.getElementById("search-results").innerHTML = ""
        document.getElementById("item-entry").innerHTML = ""
        document.getElementById("item-entry").innerHTML = `
        <select id="item-category-search" class="form-select form-select-lg" aria-label="Large select example" onchange="searchProduct(false)">
            <option disabled selected hidden>Kiválasztás</option>
        </select>
        `
        renderCategories()
    }
})