let qrboxFunction = function(viewfinderWidth, viewfinderHeight) {
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


Html5Qrcode.getCameras()
.then(camera_array => {
    camera_array.forEach(camera => {
        if (camera.label.toLowerCase().includes("windows virtual camera")) {
            console.log(camera.label)
            VirtualCamera()
        }
    });
})
.catch(err => {
    if (err.name === "NotFoundError") {
        //alert("Nincs rendelkezésre álló kamera! Szkennelés funkció nem elérhető!")
        DisableScanner()
    }
    else{
        alert("Hiba lépett fel a kamera betöltése során!")
    }
})

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
            //leállítva
            html5QrCode.start(
                { facingMode: "environment" },
                {
                    fps: 20,
                    qrbox: qrboxFunction
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
    if (html5QrCode.getState() !== 3) {
        html5QrCode.pause()
    }
})

function VirtualCamera() {
    alert("Beolvasáskor a kamera vízszintbe forgatása ajánlott!")
}

function DisableScanner() {
    let button = document.getElementById("modal-scan-button")
    button.disabled = true
}

var importScanner = new Html5Qrcode('import-reader')

document.getElementById('modal-import-basket').addEventListener('shown.bs.modal', function () {
    VibrationFeedback([30, 100, 30, 100, 30])
    importScanner.start({ facingMode: "environment" },
        {
            fps: 20,
            qrbox: qrboxFunction
        },
        (decodedText, decodedResult) => {
            console.log(decodedResult)
            cartImport(decodedText)
            importScanner.stop()
            bootstrap.Modal.getInstance(document.getElementById("modal-import-basket")).hide() //szkenner ablak automatikus elrejtése sikeres beolvasás után
        },
        (errorMessage) => {
        })
})

