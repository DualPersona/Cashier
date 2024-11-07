function lekerdezes(recieved){
    fetch("termekek.php")
        .then(valasz => valasz.json())
        .then(valasz => {
            const hely = document.getElementById("item-table")
            valasz.forEach(termek => {
                if (termek.id === recieved) {
                    let sor = document.createElement('tr');
                    sor.innerHTML = `
                        <td>${termek.nev}</td>
                        <td>${termek.ar}</td>
                    `;
                    hely.appendChild(sor);
                }
            })            
        })

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