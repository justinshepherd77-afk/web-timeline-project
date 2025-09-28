(function(){
  fetchfetch("./timeline.csv")
  .then(response => response.text())
  .then(data => {
    console.log("CSV loaded:", data.slice(0, 200));
    // existing parsing logic stays the same
  });
  });
})();
