let qrcode = new QRCode(document.getElementById("qrcode"), "https://youtu.be/dQw4w9WgXcQ?si=lSGZe055rRxmkTpt");

function generate() {
    qrcode.clear(); // clear the code.
    qrcode.makeCode(document.getElementById("qrcodeURL").value);
    document.getElementById("qrcodeURL").value = "";
}

function exportDivAsPNG(divId, fileName) {
    var divToExport = document.getElementById(divId);

    // Use html2canvas to capture the content of the div and convert it to a canvas
    html2canvas(divToExport).then(function(canvas) {
        // Create a data URL of the canvas content as a PNG image
        var dataUrl = canvas.toDataURL('image/png');

        // Create a link element to trigger the download
        var link = document.createElement('a');
        link.href = dataUrl;
        link.download = fileName + '.png';

        // Trigger a click event on the link to start the download
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });
}
