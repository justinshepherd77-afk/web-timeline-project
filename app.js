const slider=document.getElementById('weightedSlider');const yearTicker=document.getElementById('yearTicker');const eraLabel=document.getElementById('eraLabel');
function posToYear(pos){if(pos<250){return Math.round(-3000+(pos/250)*(1000-(-3000)));}else{return Math.round(1000+((pos-250)/750)*(2025-1000));}}
function snapToFive(y){return Math.round(y/5)*5;}
function eraForYear(y){if(y<500)return"Classical";if(y<1500)return"Medieval";if(y<1800)return"Renaissance";if(y<1945)return"Industrial";return"Modern";}
function updateTicker(y){yearTicker.textContent=y>=0?y:y+' BCE';eraLabel.textContent=eraForYear(y);}
function onSlider(){let y=snapToFive(posToYear(parseInt(slider.value)));updateTicker(y);}slider.addEventListener('input',onSlider);onSlider();
