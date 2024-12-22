function lekerdezes(recieved, mennyiseg){
    let szereplo_termekek_tomb = []
    for (let tabla_sor of document.getElementById("item-table").rows){
        szereplo_termekek_tomb.push(tabla_sor.cells[1].textContent)
    }
    console.log("szereplo_termekek_tomb:")
    console.log(szereplo_termekek_tomb)
    fetch("termekek.php")
        .then(valasz => valasz.json())
        .then(valasz => {
            const hely = document.getElementById("item-table")
            valasz.forEach(termek => {
                if (termek.id === recieved) {
                    if (szereplo_termekek_tomb.length > 0) {
                        for (let szereplo_termek of szereplo_termekek_tomb){
                            if (szereplo_termek === termek.nev) {
                                document.getElementById(`${termek.nev}_mennyiség`).value++
                            }
                            else{
                                TermekBeszurasa(termek, hely, mennyiseg)
                            }
                        }
                    }
                    else{
                        TermekBeszurasa(termek, hely, mennyiseg)
                    }
                }
            })            
        })
}

function TermekBeszurasa(termek, hely, mennyiseg){
    let sor = document.createElement('tr')
    sor.innerHTML = `
        <td><input type="number" value="${mennyiseg}" min="0" step="1" name="${termek.nev}_mennyiség" id="${termek.nev}_mennyiség" class="quantity-input"></td>
        <td data-value="${termek.id}">${termek.nev}</td>
        <td data-value="${termek.ar}">${termek.ar}</td>
        <td><button class="button" onclick="this.closest('tr').remove()" id="${termek.nev}_torles">
            <img src="Anyagok/x.svg" alt="kosár törlése">
            </button>
        <td>
    `;
    hely.appendChild(sor)

    quantityInputListener()
}

window.onload = function() {
    fetch("termekek.php")
        .then(valasz => valasz.json())
        .then(valasz => {
            const kategoriak = new Set();
            valasz.forEach(termek => {
                kategoriak.add(termek.kategoria);
            });

            const hely = document.getElementById("item-category-search");

            kategoriak.forEach(kategoria => {
                let sor = document.createElement('option');
                sor.value = kategoria;
                sor.innerHTML = kategoria;
                hely.appendChild(sor);
            });
        });
}

function cartExport(){
    const adattomb = []
    for (let tabla_sor of document.getElementById("item-table").rows){
        adattomb.push({Darabszam: tabla_sor.cells[0].firstElementChild.value, termekID: tabla_sor.cells[1].dataset.value})
    }

    fetch('export.php', {method: "POST", headers: {'Content-Type': 'application/json'}, body: JSON.stringify(adattomb)})
    .then(valasz => {
        if (!valasz.ok) {
            throw new Error('Nincs válasz')
        }
        return valasz.json()
    })
    .then(adat => {
        new QRCode(document.getElementById("export-qrcode"), String(adat.uzenet));
    })
    .catch(error => {
        alert('Hiba történt: ', error)
    })
}

function cartImport(exportID){
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