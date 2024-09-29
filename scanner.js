function startQrScanner() {
  Html5Qrcode.getCameras().then(devices => {
      if (devices && devices.length) {
          var cameraId = devices[0].id;
          console.log(cameraId);

          const html5QrCode = new Html5Qrcode("reader");
          html5QrCode.start(
              { facingMode: "environment" },
              {
                  fps: 10,
                  qrbox: { width: 250, height: 250 }
              },
              (decodedText, decodedResult) => {
                beolvasas(decodedText)
              },
              (errorMessage) => {
                  // Parse error, ignore it.
              }
          )/* .then(() => {
              // Determine if the user is on a desktop
              const isDesktop = /Windows|Macintosh|Linux/.test(navigator.userAgent);

              if (isDesktop) {
                  // Use setInterval to periodically check for the video element
                  const checkVideoElement = setInterval(() => {
                      const videoElement = document.querySelector("#reader video");
                      if (videoElement) {
                          videoElement.style.transform = "scaleX(-1)";
                          clearInterval(checkVideoElement); // Stop checking once the video element is found
                      }
                  }, 100); // Check every 100 milliseconds
              }
          }).catch(err => {
              console.log(`Start failed: ${err}`);
          }); */
      }
  }).catch(err => {
      console.error(`Camera error: ${err}`);
  });
}

// Function to stop QR scanner
function stopQrScanner() {
  // Implement logic to stop the scanner, if needed
  // html5QrCode.stop().then(() => { console.log("QR scanner stopped"); });
}

// Event listeners for modal functionality
document.addEventListener("DOMContentLoaded", function() {
  const modal = document.getElementById("qr-modal");
  const openModalBtn = document.getElementById("modal-scan");
  const closeModalBtn = document.getElementById("close-modal");

  // Open modal and start QR scanner
  openModalBtn.onclick = function() {
      modal.style.display = "flex"; // Use 'flex' to center modal properly
      startQrScanner();
  }

  // Close modal and stop QR scanner
  closeModalBtn.onclick = function() {
      modal.style.display = "none";
      stopQrScanner();
  }

  // Close modal when clicking outside the modal content
  window.onclick = function(event) {
      if (event.target === modal) {
          modal.style.display = "none";
          stopQrScanner();
      }
  }
});