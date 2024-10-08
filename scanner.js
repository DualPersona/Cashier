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
        alert("Nincs rendelkezésre álló kamera! Szkennelés funkció nem elérhető!")
        DisableScanner()
    }
    else{
        alert("Hiba lépett fel a kamera betöltése során!")
    }
})

var html5QrCode = new Html5Qrcode("reader");

document.getElementById('modal-scan').addEventListener('shown.bs.modal', function () {
    html5QrCode.start(
        { facingMode: "environment" },
        {
            fps: 20,
            qrbox: qrboxFunction
        },
        (decodedText, decodedResult) => {
          console.log(decodedText)
          lekerdezes(decodedText)
        },
        (errorMessage) => {
            // Parse error, ignore it.
        }
    )
});

  
  /* // Function to stop QR scanner
  function stopQrScanner() {
    // Implement logic to stop the scanner, if needed
    // html5QrCode.stop().then(() => { console.log("QR scanner stopped"); });
  }
  */
  
  //console.log(státusz:${html5QrCode.getState()})

function VirtualCamera() {
    alert("Beolvasáskor a kamera vízszintbe forgatása ajánlott!")
}

function DisableScanner() {
    let button = document.getElementById("modal-scan-button")
    button.disabled = true
}