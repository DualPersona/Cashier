let qrScannerRectangular = function(viewfinderWidth, viewfinderHeight) {
    let minEdgePercentage = 0.7; // 70%
    let minEdgeSize = Math.min(viewfinderWidth, viewfinderHeight);
    let qrboxSize = Math.floor(minEdgeSize * minEdgePercentage);
    if (qrboxSize <= 0) {
        return {
            width: 250,
            height: 125
    }}
    else{
        return {
            width: qrboxSize,
            height: qrboxSize/2
    }}
}

let qrScannerSquare = function(viewfinderWidth, viewfinderHeight) {
    let minEdgePercentage = 0.7;
    let minEdgeSize = Math.min(viewfinderWidth, viewfinderHeight);
    let qrboxSize = Math.floor(minEdgeSize * minEdgePercentage);
    if (qrboxSize <= 0) {
        return {
            width: 150,
            height: 150
    }}
    else{
        return {
            width: qrboxSize,
            height: qrboxSize
    }}
}

function scannerCheckCameras(modalName) {
    Html5Qrcode.getCameras() //STATIKUS METÓDUS, A KÖNYVTÁRÁRA KELL HIVATKOZNI, NEM EGY PÉLDÁNYRA, tehát maradjon így
    .then(() => {
        bootstrap.Modal.getInstance(document.getElementById(modalName)).show()
    })
    .catch(err => {
        if (html5QrCode.getState() !== 1 && html5QrCode.getState() !== 0) {
            html5QrCode.stop()
        }
        if (importScanner.getState() !== 1 && importScanner.getState() !== 0) {
            importScanner.stop()
        }

        if (err.name === "NotFoundError") {
            alert("Nincs rendelkezésre álló kamera! Szkennelés funkció nem elérhető!")
        }
        else if (err.name === "NotAllowedError") {
            alert("A felhasználó letiltotta a kamera használat engedélyét!")
        }
        else{
            alert("Hiba lépett fel a kamera betöltése során!")
            console.log(err.name)
        }
    })
}

var html5QrCode = new Html5Qrcode("reader");

document.getElementById('modal-scan').addEventListener('shown.bs.modal', function () {
    //szkenner lehetséges állapotai: https://scanapp.org/html5-qrcode-docs/docs/apis/enums/Html5QrcodeScannerState
    switch (html5QrCode.getState()) {
        case 0:
            //ismeretlen állapot
            console.log("A szkenner állapota ismeretlen")
            break;
        case 1:
            console.log("case 1 triggered")
            //elindítatlan
            html5QrCode.start(
                { facingMode: "environment" },
                {
                    fps: 20,
                    qrbox: qrScannerRectangular
                },
                (decodedText, decodedResult) => {
                    console.log(decodedResult)
                    lekerdezes(decodedText, 1)
                    html5QrCode.pause()
                    bootstrap.Modal.getInstance(document.getElementById("modal-scan")).hide() //szkenner ablak automatikus elrejtése sikeres beolvasás után
                },
                (errorMessage) => {
                }
            )
            break;
        
        case 3:
            console.log("case 3 triggered")
            //megállítva/paused
            html5QrCode.resume()
            break;

        default:
            console.log("A szkennernek nincs állapota")
            break;
    }
})

document.getElementById("modal-scan").addEventListener("hidden.bs.modal", function () {
    if (html5QrCode.getState() === 2) {
        html5QrCode.pause()
    }
})

function VirtualCamera() {
    alert("Beolvasáskor a kamera vízszintbe forgatása ajánlott!")
}

var importScanner = new Html5Qrcode('import-reader')

document.getElementById('modal-import-basket').addEventListener('shown.bs.modal', function () {
    if (importScanner.getState() === 1) {
        importScanner.start({ facingMode: "environment" },
            {
                fps: 20,
                qrbox : qrScannerSquare
            },
            (decodedText, decodedResult) => {
                console.log(decodedResult)
                cartImport(decodedText)
                importScanner.stop()
                bootstrap.Modal.getInstance(document.getElementById("modal-import-basket")).hide() //szkenner ablak automatikus elrejtése sikeres beolvasás után
            },
            (errorMessage) => {
            }
        )
    }
    else if (importScanner.getState() === 3) {
        importScanner.resume()
    }
})

document.getElementById("modal-import-basket").addEventListener("hidden.bs.modal", function () {
    if (importScanner.getState() === 2) {
        importScanner.pause()
    }
})