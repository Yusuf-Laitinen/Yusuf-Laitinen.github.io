function isMobile() {
    return /Mobi|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

window.onload = async () => {
    let apps
    await fetch("index.json")
        .then(response => response.json())
        .then(data => {
            apps = data
        })

    apps.forEach(app => {
        const appElement = document.createElement("img")
        appElement.classList.add("app_icon")
        appElement.src = `Apps/${app}/apple-touch-icon.png`
        appElement.onclick = () => {
            window.open(`Apps/${app}/index.html`, "_blank")
        }
        document.body.appendChild(appElement)
    })
}


