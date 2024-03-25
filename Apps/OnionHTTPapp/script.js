function hide(element) {
    document.getElementById(element).style.display = "none" 
}

function show(element) {
    document.getElementById(element).style.display = "block"
}

function submit(){
    document.getElementById("app").src = "http://" + document.getElementById("ipAd").value + "/login?redirect=%2Ffiles%2F"
    
    show("app")
    hide("login")
    document.getElementById("app").focus
}