document.getElementById('imageUpload').addEventListener('change', function (event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = function (e) {
        document.getElementById('thumbnail').src = e.target.result;
    }
    if (file) {
        reader.readAsDataURL(file);
    }
});

document.getElementById('exportButton').addEventListener('click', function () {
    html2canvas(document.getElementById('preview'), {scale: 1}).then(function (canvas) {
        // Resize the canvas to the desired dimensions
        const resizedCanvas = document.createElement('canvas');
        resizedCanvas.width = 250;
        resizedCanvas.height = 225;
        const ctx = resizedCanvas.getContext('2d');
        ctx.drawImage(canvas, 0, 0, 250, 225);

        // Create a link to download the image
        const link = document.createElement('a');
        link.download = 'preview.png';
        link.href = resizedCanvas.toDataURL();
        link.click();
    });
});
