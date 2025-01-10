function lekerdezes(recieved, mennyiseg){
    let szereplo_termekek_tomb = []
    for (let tabla_sor of document.getElementById("item-tbody").rows){
        szereplo_termekek_tomb.push(tabla_sor.cells[1].textContent)
    }

    let isCodeValid = false

    fetch("termekek.php")
        .then(valasz => valasz.json())
        .then(valasz => {
            const hely = document.getElementById("item-tbody")
            valasz.forEach(termek => {
                if (termek.id === recieved) {
                    isCodeValid = true
                    if (szereplo_termekek_tomb.length > 0) {
                        let found = false;
                        for (let szereplo_termek of szereplo_termekek_tomb){
                            if (szereplo_termek === termek.nev) {
                                document.getElementById(`${termek.nev}_mennyiség`).value++
                                VibrationFeedback(50)
                                found = true;
                                break;
                            }
                        }
                        if (!found) {
                            TermekBeszurasa(termek, mennyiseg);
                        }
                    }
                    else{
                        TermekBeszurasa(termek, mennyiseg)
                    }
                }
            })            
        })
        .finally(() => {
            if (!isCodeValid) {
                alert("Ez a kód nem érvényes!")
            }
        })
}

function TermekBeszurasa(termek, mennyiseg){
    const hely = document.getElementById("item-tbody")
    let sor = document.createElement('tr')
    sor.innerHTML = `
        <td><input type="number" value="${mennyiseg}" min="0" step="1" name="${termek.nev}_mennyiség" id="${termek.nev}_mennyiség" class="quantity-input"></td>
        <td data-value="${termek.id}">${termek.nev}</td>
        <td data-value="${termek.ar}">${termek.ar}</td>
        <td><button class="button item-remove" onclick="removeItem(event.target)" id="${termek.nev}_torles">
            <img src="Anyagok/x-circle.svg" alt="kosár törlése">
            </button>
        </td>
    `;
    hely.appendChild(sor)
    VibrationFeedback(50)
    quantityInputListener()
}

function renderCategories() {
    fetch("kategoriak.php")
        .then(valasz => valasz.json())
        .then(valasz => {
            valasz.forEach(kategoria => {
                const hely = document.getElementById("item-category-search");

                let sor = document.createElement('option');
                sor.value = kategoria.id;
                sor.innerHTML = kategoria.nev;
                hely.appendChild(sor);
            });
        });
}

function cartExport(){
    const adattomb = []
    for (let tabla_sor of document.getElementById("item-tbody").rows){
if(tabla_sor.cells[1].dataset.value !== 0){
        adattomb.push({Darabszam: tabla_sor.cells[0].firstElementChild.value, termekID: tabla_sor.cells[1].dataset.value})
}
    }

    fetch('export.php', {method: "POST", headers: {'Content-Type': 'application/json'}, body: JSON.stringify(adattomb)})
    .then(valasz => {
        if (!valasz.ok) {
            throw new Error('Nincs válasz')
        }
        return valasz.json()
    })
    .then(adat => {
        document.getElementById("export-qrcode").innerHTML = ""
        new QRCode(document.getElementById("export-qrcode"), {
            text: String(adat.uzenet),
            width: 200,
            height: 200,
            correctLevel: QRCode.CorrectLevel.M
        });
    })
    .then(() => {
        VibrationFeedback([30, 1000, 30, 1000, 30])
    })
    .catch(error => {
        alert('Hiba történt: ', error)
    })
}

function cartImport(exportID){
    document.querySelector("#item-tbody").innerHTML = ""
    fetch("import.php")
    .then(valasz => valasz.json())
    .then(adat =>
        adat.forEach(item => {
            if (item.importID == exportID) {
                lekerdezes(item.termekID, item.mennyiseg)
            }
        })
    )
}