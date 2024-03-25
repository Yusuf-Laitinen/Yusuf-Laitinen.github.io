let saved = window.navigator.standalone
saved = true

if (saved == true) {
    document.getElementById("ss").style.display="none";
    document.getElementById("app").style.display="block";
}