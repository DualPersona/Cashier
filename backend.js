function lekerdezes(recieved){
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
                                TermekBeszurasa(termek, hely)
                            }
                        }
                    }
                    else{
                        TermekBeszurasa(termek, hely)
                    }
                }
            })            
        })
}

function TermekBeszurasa(termek, hely){
    let sor = document.createElement('tr')
    sor.innerHTML = `
        <td><input type="number" value="1" min="0" step="1" name="${termek.nev}_mennyiség" id="${termek.nev}_mennyiség" class="quantity-input"></td>
        <td>${termek.nev}</td>
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