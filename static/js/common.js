function getCookie(name) {
  let cookie = {};
  document.cookie.split(";").forEach(function (el) {
    let [k, v] = el.split("=");
    cookie[k.trim()] = v;
  });
  return cookie[name];
}

$('textarea').each(function(){
  this.style.height = "auto";
  this.style.height = this.scrollHeight + "px";
})