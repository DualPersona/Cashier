function lekerdezes(recieved, mennyiseg){
    let szereplo_termekek_tomb = []
    for (let tabla_sor of document.getElementById("item-tbody").rows){
        szereplo_termekek_tomb.push(tabla_sor.cells[1].textContent)
    }

    let isCodeValid = false

    fetch("termekek.php")
        .then(valasz => valasz.json())
        .then(valasz => {
            if (valasz.hasOwnProperty("uzenet")) {
                throw new Error(valasz.uzenet)
            } // azokhoz a php fájlokhoz ne használjuk fel újra ezt, amik nem csak a hibaüzenetet tartalmazzák "uzenet" kulcs alatt, hanem a helyes adatokat is
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
                        else{
                            updateTable()
                        }
                    }
                    else{
                        TermekBeszurasa(termek, mennyiseg)
                    }
                }
            })
            if (!isCodeValid) {
                throw new Error("Ez a kód nem érvényes!")
            }            
        })
        .catch(err => {
            alert(`Hiba: ${err.message}`);
        });
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
        if(tabla_sor.cells[1].dataset.value !== "0"){
            adattomb.push({Darabszam: tabla_sor.cells[0].firstElementChild.value, termekID: tabla_sor.cells[1].dataset.value})
        }
    }
    if (adattomb.length > 0) {
        fetch('export.php', {method: "POST", headers: {'Content-Type': 'application/json'}, body: JSON.stringify(adattomb)})
        .then(valasz => {
            if (!valasz.ok) {
                throw new Error('Nincs válasz')
            }
            return valasz.json()
        })
        .then(adat => {
            document.getElementById("export-body").innerHTML = ""
            document.getElementById("export-body").innerHTML = `
            <h6>A kapott kódot kérlek mutasd meg a kasszásnak!</h6>
            <div id="export-qrcode">
            </div>
            <p>Az egyéni (bejelentkezés után hozzáadható) termékek nem kerülnek megosztásra.</p>
            `
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
            alert(`Hiba történt:  ${error}`)
        })
    }
    else {
        document.getElementById("export-body").innerHTML = ""
        document.getElementById("export-body").innerHTML = "<h6>A kosár megosztására nincs lehetőség üres vagy csak egyéni termékekkel teli kosárnál!</h6>"
    }
}

function cartImport(exportID){
    document.querySelector("#item-tbody").innerHTML = ""
    let isCodeValid = false
    fetch("import.php")
    .then(valasz => valasz.json())
    .then(adat => {
        if (adat.hasOwnProperty("uzenet")) {
            throw new Error(adat.uzenet)
        } // azokhoz a php fájlokhoz ne használjuk fel újra ezt, amik nem csak a hibaüzenetet tartalmazzák "uzenet" kulcs alatt, hanem a helyes adatokat is
        adat.forEach(item => {
            if (item.importID == exportID) {
                isCodeValid = true
                lekerdezes(item.termekID, item.mennyiseg)
            }
        })
        if (!isCodeValid) {
            throw new Error("Ez a kód nem érvényes!")   
        }
    })
    .catch(err => {
        alert(`Hiba: ${err.message}`);
    });
}