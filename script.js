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
        const appElement = document.createElement("div")
        const appName = document.createElement("p")
        const appIcon = document.createElement("img")

        appName.textContent = app

        appIcon.classList.add("app_icon")
        appElement.classList.add("app_element")
        appName.classList.add("app_text")

        appIcon.onerror = () => {
            appIcon.src = `src/image-placeholder.png`
        }

        appIcon.src = `Apps/${app}/apple-touch-icon.png`


        appElement.onclick = () => {
            window.open(`Apps/${app}/index.html`, "_blank")
        }

        appElement.appendChild(appIcon)
        appElement.appendChild(appName)

        document.body.appendChild(appElement)
    })
}


