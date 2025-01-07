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

function loginNFC() {
    if ("NDEFReader" in window){
        const nfcReader = new NDEFReader()
        
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
        .then( () => {
            console.log("Nfc szkennelés");
        })
    }
    else{
        alert("Ez a böngésző nem támogatja az NFC belépési módot")
    }
}

function checkAuth() {
    fetch('login.php')
        .then(response => response.json())
        .then(data => {
            if (data.signedIn) {
                document.getElementById("add-manually").innerHTML = ""
                document.getElementById("add-manually").innerHTML = `
                <div class="item-entry">
                <label for="item-name">Termék neve:</label>
                <input type="text" id="item-name" placeholder="Pl.: Alma">
              </div>
              <div class="item-entry">
                <label for="item-price">Egységár (HUF):</label>
                <input type="number" id="item-price" placeholder="Pl.: 150">
              </div>
              `
              document.getElementById("add-manually-footer").innerHTML = ""
              document.getElementById("add-manually-footer").innerHTML = `
              <button onclick="addItem()">Hozzáadás a kosárhoz</button>
              `
            } else {
                console.log('Nincs bejelentkezve', data.message);
            }
        })
        .catch(error => console.error('Error:', error));    
}
