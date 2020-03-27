var look = document.getElementById("look");

function scr() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

look.addEventListener("click", scr);
