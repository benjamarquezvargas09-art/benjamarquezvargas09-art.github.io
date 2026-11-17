// Se ejecuta antes de pintar: marca que hay JavaScript y decide si se ve la intro
// (una vez por sesión y nunca con movimiento reducido). Archivo externo para
// poder usar una Content-Security-Policy estricta (sin scripts en línea).
(function () {
  var d = document.documentElement;
  d.classList.add("js");
  try {
    var reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || sessionStorage.getItem("bm-intro")) d.classList.add("intro-seen");
    else sessionStorage.setItem("bm-intro", "1");
  } catch (e) {
    d.classList.add("intro-seen");
  }
})();
