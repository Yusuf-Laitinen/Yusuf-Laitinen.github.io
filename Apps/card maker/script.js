let saved = window.navigator.standalone

if (saved == true) {
    document.getElementById("ss").style.display="none";
    document.getElementById("app").style.display="block";
}

function refresh() {
    let bg = Math.floor((Math.random() * 4) + 1)
    let sb = Math.floor((Math.random() * 9) + 1)

    let hp = Math.floor((Math.random() * 100) + 1)
    let ap = Math.floor((Math.random() * 100) + 1)

    document.body.style.backgroundImage = "url(static/background/" + bg + ".jpeg)"
    document.body.style.backgroundSize = "cover"
    document.body.style.backgroundAttachment = "fixed"
    document.body.style.backgroundRepeat = "no-repeat"
    document.body.style.backgroundPosition = "center center"

    document.getElementById("sb").src = "static/subject/" + sb + ".png"

    document.getElementById("hp").textContent = "HP: " + hp
    document.getElementById("ap").textContent = "AP: " + ap
}

refresh()