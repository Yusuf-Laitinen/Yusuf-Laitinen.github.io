function isMobile() {
    return /Mobi|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

window.onload = () => {
    let iframe = document.createElement("iframe")

    if (isMobile()) {
        iframe.src = "landing/mobile/mobile.html"
    } else {
        iframe.src = "landing/desktop/desktop.html"
    }

    document.body.appendChild(iframe)
}


