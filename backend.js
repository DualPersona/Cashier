function beolvasas(decodedText){
    fetch("termekek.php")
        .then(valasz => valasz.json())
        .then(valasz => {
            const hely = document.getElementById("item-list")
            valasz.forEach(termek => {
                if (termek.id === decodedText) {
                    let sor = document.createElement('li');
                    sor.innerHTML = `
                        ${termek.id}/${termek.nev}
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