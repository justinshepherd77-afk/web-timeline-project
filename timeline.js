(function(){
  fetch(window.DATA_SOURCE).then(r=>r.text()).then(t=>{
    document.getElementById("timeline").innerHTML = '<pre>'+t+'</pre>';
  });
})();