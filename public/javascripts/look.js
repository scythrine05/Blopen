var look = document.getElementById("look");

function scr() {
  window.scrollBy({ top: 900, behavior: "smooth" });
}

look.addEventListener("click", scr);
