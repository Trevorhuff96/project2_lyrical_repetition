function buildMetadata(sample) {
  console.log("buildMetaldata")
 
  d3.json(`/metadata/${sample}`).then((sampleNames) => {
    console.log(sampleNames)
    var data = d3.select("tbody");
 
    data.html("");
    // var results = Object.entries(sampleNames)
    sampleNames.forEach(function(songs) {
      console.log(songs);
      var row = data.append("tr");
      Object.entries(songs).forEach(function([key, value]) {
        console.log(key, value);
        // Append a cell to the row for each value
        // in the tableData report object
        var cell = data.append("td");
        cell.text(value);
      });
    });
  });
  }
  
  function buildWordCloud(sample) {
    console.log("buildArtists")


    d3.json(`/artists/${sample}`).then((sampleArtists) => {
      // console.log(sampleArtists)

      sampArtistList = []
      
      sampleArtists.forEach(d => {
        sampArtistList.push(Object.values(d)[0])
      })


    console.log(sampArtistList);

    // var fill = d3.scale.category20();

    d3.layout.cloud().size([500, 500])
    .words(sampArtistList.map(function(d) {
      return {text: d, size: 25 + Math.random() * 40};
    }))
    .padding(5)
    .rotate(function() { return ~~(Math.random() * 2) * 45; })
    .font("Impact")
    .fontSize(function(d) { return d.size; })
    .on("end", draw)
    .start();

    function draw(words) {

      d3.select("#wordcloud").html("")

      d3.select("#wordcloud").append("svg")
          .attr("width", 500)
          .attr("height", 350)
        .append("g")
          .attr("transform", "translate("+(500 /2)+","+(350 /2)+")")
        .selectAll("text")
          .data(words)
        .enter().append("text")
          .style("font-size", function(d) { return d.size + "px"; })
          .style("font-family", "Impact")
          .attr("text-anchor", "middle")
          .attr("transform", function(d) {
            return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
          })
          .text(function(d) { return d.text; });
    }
  });
}

  function init() {
  console.log("init")
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");
 
  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });
 
    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
   
    buildMetadata(firstSample);
    buildWordCloud(firstSample);
  });
 }
 
 function optionChanged(newSample) {
  console.log("newSample")
  // Fetch new data each time a new sample is selected
  
  buildMetadata(newSample);
  buildWordCloud(newSample);
 }
 init();