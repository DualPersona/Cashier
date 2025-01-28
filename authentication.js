function Authenticate(data){
    fetch('login.php', {
        method: "POST",
        body: data
    })
    .then(response => {
        if (response.ok) {
            console.log("bejelentkezve")
            checkAuth()
        } else {
            return Promise.reject(response)
        }
    })
    .catch(err => {
        if (err.status === 400) {
            alert("Nem lettek megadva bejelentkezési adatok!")
        } else if (err.status === 401) {
            alert("Hibás jelszó!");
        } else if (err.status === 404) {
            alert("Felhasználó nem található!")
        } else {
            alert("Belső hiba történt")
        }
    });
}

function submitForm(event) {
    event.preventDefault()
    const formData = new FormData(document.getElementById("login-form"))
    Authenticate(formData)
}


function nfcScannerInitialize(enableReinitialization) {
    if ("NDEFReader" in window){
        const modalFooter = document.getElementById("add-manually-footer")
        modalFooter.style.display = "flex"
        modalFooter.style.flexDirection = "row-reverse"
        modalFooter.style.justifyContent = "space-between"
        if (!document.querySelector("#add-manually-footer button#nfc-status")) { //azért hogy az újrainicializálás ne generáljon le még egy felesleget
            modalFooter.innerHTML += '<button id="nfc-status">NFC státusz</button>'
        }
        

        let nfcReader = new NDEFReader() //maradjon let hogy lehessen szükség szerint másik példányt hozzárendelni és újrafuttatni a funkciót és a példány metódusait
        
        nfcReader.onreading = function(event) {
            const nfcdata = new TextDecoder('utf-8').decode(event.message.records[0].data)

            const username = nfcdata.split(":")[0]
            const password = nfcdata.split(":")[1]

            const data = new URLSearchParams()
            data.append("username", username)
            data.append("password", password)

            Authenticate(data)
        }

        nfcReader.scan()
        .then(() => {
            document.getElementById("nfc-status").className = "nfc-ok"
        })
        .catch((err) => {
            document.getElementById("nfc-status").className = "nfc-invalid"
            document.getElementById("nfc-status").onclick = () => {
                if (err.name === "NotAllowedError") {
                    alert("Hiba: A felhasználó nem engedélyezte az NFC használatát!")
                    nfcReader = new NDEFReader() //hozzárendelünk egy másik új példányt a változóhoz és felülírjuk az előző referenciáját/hivatkozását
                    if (enableReinitialization) {
                        nfcScannerInitialize(false) //újra futtatjuk a funkciót az új NDEFReader példányunkkal és beadjuk a funkciónak hogy ez nem az első futtatása
                    }
                }
                else if (err.name === "NotSupportedError") {
                    alert("Hiba: A készüléknek nincs érvényes NFC olvasója vagy az NFC olvasónak nem sikerült felvennie a kapcsolatot a kiszolgálóval!")
                }
                else {
                    alert(`Hiba: ${err}`)
                }
            }
        })
    }
}

nfcScannerInitialize(true)

function checkAuth() {
    const modalBody = document.getElementById("add-manually")
    const modalFooter = document.getElementById("add-manually-footer")
    fetch('login.php')
        .then(response => response.json())
        .then(data => {
            if (data.signedIn) {
                modalBody.innerHTML = ""
                modalBody.innerHTML = `
                <div class="item-entry">
                <label for="item-name">Termék neve:</label>
                <input type="text" id="item-name" placeholder="Pl.: Alma">
                </div>
                <div class="item-entry">
                <label for="item-price">Egységár (HUF):</label>
                <input type="number" id="item-price" placeholder="Pl.: 150">
                </div>
              `
              modalFooter.innerHTML = ""
              modalFooter.innerHTML = `
              <button onclick="addCustomProduct()">Hozzáadás</button>
              `
            } else {
                console.log('Nincs bejelentkezve', data.message);
                modalBody.innerHTML = ""
                modalBody.innerHTML = `
                <form id="login-form" onsubmit="submitForm(event)">
                <label for="username">Felhasználónév:</label>
                <input type="text" id="username" name="username" required>
        
                <label for="password">Jelszó:</label>
                <input type="password" id="password" name="password" required>
                </form>
                `
                modalFooter.innerHTML = ""
                modalFooter.innerHTML = `
                <button type="submit" id="login-submit" form="login-form">Belépés</button>
                `
                nfcScannerInitialize(true)
            }
        })
        .catch(error => console.error('Error:', error));    
}
