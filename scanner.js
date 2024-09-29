function startQrScanner() {
  Html5Qrcode.getCameras().then(devices => {
      if (devices && devices.length) {
          var cameraId = devices[0].id;
          console.log(cameraId);

          var html5QrCode = new Html5Qrcode("reader");
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

startQrScanner()
/* // Function to stop QR scanner
function stopQrScanner() {
  // Implement logic to stop the scanner, if needed
  // html5QrCode.stop().then(() => { console.log("QR scanner stopped"); });
}
*/

//console.log(`státusz:${html5QrCode.getState()}`)