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
      //var hyperLink= row.append("a");
      // hyperLink.attr("href", `javascript:buildSongData(${sample})`);
      // hyperLink.on("click", function() {
      //   console.log("Im cicking on " + songs.sample);
      //   buildSongData(songs.sample);
      // });

      

      Object.entries(songs).forEach(function([key, value]) {
        console.log(key, value);
        // Append a cell to the row for each value
        // in the tableData report object
        
        //var cell = data.append("td");
        var cell = row.append("td");
        // https://stackoverflow.com/questions/16337937/how-to-call-javascript-from-a-href/43936623
        cell.text(value);
        //.on("click", function() {buildSongData(`${sample}`); });
        
        
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
    buildCharts(firstSample);
  });
 }
 
 function optionChanged(newSample) {
  console.log("newSample")
  // Fetch new data each time a new sample is selected
  
  buildMetadata(newSample);
  buildWordCloud(newSample);
  buildCharts(newSample);
 }


 // call this function within the click event listener
 // song_link.on("click", function(){}

//  function buildSongData(song_id){
//    console.log("song_data")
//    console.log(song_id)

//    // navigate to app.route(/<song_id>)
//    d3.json(`/${song_id}`).then((song_data) =>{
//      console.log(song_data);
//    }
//     )
//  }

function buildCharts(sample) {
  d3.json(`/charts/${sample}`).then(function(d){
 // @TODO: Use `d3.json` to fetch the sample data for the plots

  // var sample = d.sample
  var data = [{
    labels: Object.keys(d),
    values: Object.values(d),
    type: 'pie'
  }];
  var layout = { margin: { t: 30, b: 100 } };
  Plotly.newPlot("pie", data, layout);

  // var Genre = d.Genre
  // var Era = d.Era
  // var pData = [{
  //     values: Genre,
  //     labels: Genre,
  //     hovertext:Genre,
  //     hoverinfo: 'hovertext',
  //     type:'pie'
  //   }];

  //   var pLayout = {
  //     margin: {t:0, l:0}};

  //   Plotly.newPlot('pie',pData, pLayout);
  }
  )
}
 init();