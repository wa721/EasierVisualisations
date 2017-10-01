function UpperFirst(string){return string.charAt(0).toUpperCase() + string.slice(1);};

function numberRange (start, end) {
  return new Array(end - start).fill().map((d, i) => i + start);
}

function MakeTimeSeries(Plot,width,height,data,xlab,ylab,fontSize){
  var tooltip = d3.select("body").append("div")
     .attr("class", "tooltip")
     .style("opacity", 0);

  var timeSeries = d3.select(Plot) // define the new one
                    .append("svg")
                    .attr("width", width)
                    .attr("height", height);

  var scalex = d3.time.scale()
                       .domain([d3.min(data, function(d) {
                         var stringed = d[0].split("-");
                         return new Date(stringed[0], stringed[1] - 1, stringed[2]); }),d3.max(data, function(d) {
                         var stringed = d[0].split("-");
                         return new Date(stringed[0], stringed[1] - 1, stringed[2]); })])
                       .range([0.1*width,width*0.95]);

   var xAxis = d3.svg.axis()
                    .scale(scalex)
                    .tickFormat(d3.time.format("%m-%d"))
                    .orient("bottom");


   var scaley = d3.scale.linear()
                        .domain([0,d3.max(data, function(d) { return d[1]; })*1.2])
                        .range([height*0.9,0.1*height]);

   var yAxis = d3.svg.axis()
                     .scale(scaley)
                     .tickFormat(d3.format("s"))
                     .orient("left");

    timeSeries.append("g")
       .attr("class", "axis") //gains access to the css
       .attr("transform", "translate("+0+"," + 0.9*height + ")") //puts it on the bottom
       .call(xAxis);

   timeSeries.append("g")
     .attr("class", "axis")
     .attr("transform", "translate(" + width*0.1 + ",0)")
     .call(yAxis);


   var line = d3.svg.line()
     // assign the X function to plot our line as we wish
     .x(function(d) {
       var stringed = d[0].split("-");
       var newDate = new Date(stringed[0], stringed[1] - 1, stringed[2]);
       return scalex(newDate); //return the x-value
     })
     .y(function(d) {
       return scaley(d[1]); //return the y-value
     })

   timeSeries.append("svg:path")
     .attr("d", line(data))
     .attr("fill","None")
     .attr("stroke","#000");

     //add the axes titles
   timeSeries.append("text")      // text label for the x axis
       .attr("x", 265/500*width )
       .attr("y", 490/500*width )
       .style("text-anchor", "middle")
       .style("font-size",fontSize)
       .text(xlab);

   timeSeries.append("text")      // text label for the y axis
      .attr("x", -250/500*width )
      .attr("y", 11/500*width )
      .style("text-anchor", "middle")
      .style("font-size",fontSize)
      .attr("transform", "rotate(-90)")
      .text(ylab);
};

function MakeTwoGroupedBar(Plot,width,height,data,xlab,ylab1,ylab2,fontSize,groups,c1,c2){
  var tooltip = d3.select("body").append("div")
     .attr("class", "tooltip")
     .style("opacity", 0);
  //data is barTableData
  //create the extents and link the css element to a variable
  var svg2 = d3.select(Plot)
              .append("svg")
              .attr("width", width*1.1)
              .attr("height", height*1.3);
  // create a scale
  //create a scale for x (i.e. cost)
  var x0 = d3.scale.ordinal().rangeRoundBands([0.07*width, width*0.97], .6);
  var x1 = d3.scale.ordinal();

  var y0 = d3.scale.linear()
                   .range([height*0.95, 0]);
  var y1 = d3.scale.linear()
                   .range([height*0.95, 0]);
  //create some colours
  var color = d3.scale.ordinal().range([c1,c2]);
  //get an x axis
  var xAxisBar = d3.svg.axis()
    .scale(x0).tickValues(groups)
    .orient("bottom");

  //get a left y axis
  var yAxisLeft = d3.svg.axis()
    .scale(y0)
    .orient("left")
    .tickFormat(function(d) { return parseInt(d) });

  var yAxisRight = d3.svg.axis()
    .scale(y1)
    .orient("right")
    .tickFormat(function(d) { return parseInt(d) });

     var dataset = [];

     for(i = 0; i < Object.keys(data).length; i++ ) {
       var region = groups[i];
       dataset[i] = {
         region: region,
         values: [
          {name: ylab1, value: data[i][1]},
          {name: ylab2, value: data[i][3]}
         ]
       };
     }
     //set the domains for the scales. These are after dataset as they are dependent
     x0.domain(dataset.map(function(d) { return d.region; }));
     x1.domain([ylab1,ylab2]).rangeRoundBands([0, x0.rangeBand()]);

     y0.domain([0, d3.max(dataset, function(d) { return d.values[0].value; })]);
     y1.domain([0, d3.max(dataset, function(d) { return d.values[1].value; })]);

     // Ticks on x-axis and y-axis
     svg2.append("g")
         .attr("class", "x axis")
         .attr("transform", "translate(0," + height + ")")
         .call(xAxisBar);

     svg2.append("g")
         .attr("class", "y0 axis")
         .call(yAxisLeft)
         .attr("transform", "translate(" + width*0.07 + ","+0.05*height+")")
       .append("text")
         .attr("transform", "rotate(-90)")
         .attr("y", 6/500*width)
         .attr("dy", ".71em")
         .style("text-anchor", "end")
         .style("fill", c1)
         .text(ylab1);

     svg2.select('.y0.axis')
       .selectAll('.tick')
         .style("fill",c1);

     svg2.append("g")
         .attr("class", "y1 axis")
         .attr("transform", "translate(" + width*0.97 + ","+0.05*height+")")
         .call(yAxisRight)
       .append("text")
         .attr("transform", "rotate(-90)")
         .attr("y", -16/500*width)
         .attr("dy", ".71em")
         .style("text-anchor", "end")
         .style("fill", c2)
         .text(ylab2);

     svg2.select('.y1.axis')
       .selectAll('.tick')
         .style("fill",c2);
     // End ticks

    //graph it
    var graph = svg2.selectAll(".region")
    .data(dataset)
    .enter()
    .append("g")
      .attr("class", "g")
      .attr("transform", function(d) { return "translate(" + x0(d.region) + ",0)"; });

    graph.selectAll("rect")
      .data(function(d) { return d.values; })
      .enter()
      .append("rect")
        .attr("width", x1.rangeBand())
        .attr("x", function(d) { return x1(d.name); })
        .attr("y", function(d) {
          if (d.name == ylab1){
            return y0(d.value) + 0.05*height;
          }else{
            return y1(d.value) + 0.05*height;
          };
        })
        .attr("height", function(d) {
          if (d.name == ylab1){
            return height*0.95 - y0(d.value);
          }else{
            return height*0.95 - y1(d.value);
          };
        })
        .style("fill", function(d) { return color(d.name); })
        .on('mouseover', function(d){
          d3.select(this).style("opacity", 0.5);
          tooltip.transition()
                   .duration(200)
                   .style("opacity", .9);
              tooltip.html(d.name + "<br/> ("+ d.value + ")")
                   .style("left", (d3.event.pageX + 5) + "px")
                   .style("top", (d3.event.pageY - 28) + "px")
                   .style("width", "5vw")
                   .style("border-radius","0.3vw");
        })
        .on('mouseout',function(d){
          d3.select(this).style("opacity", 1);
          tooltip.transition() //turn the tooltip off
                   .duration(500)
                   .style("opacity", 0);
        });

    // Add the Legend
    var legend = svg2.selectAll(".legend")
        .data([ylab1,ylab2].slice())
        .enter()
        .append("g")
          .style("font-size", fontSize)
          .attr("class", "legend")
          .attr("transform", function(d, i) { return "translate(0," + i * 20/500*width + ")"; });
    //add the legend rectangles
    legend.append("rect")
        .attr("x", width - 68/500*width)
        .attr("width", 18/500*width)
        .attr("height", 18/500*width)
        .style("fill", color);
    //add the legend text
    legend.append("text")
        .attr("x", width - 74/500*width)
        .attr("y", 9/500*width)
        .attr("dy", ".35em")
        .style("text-anchor", "end")
        .text(function(d) { return d; });

    // add some axes labels\
    svg2.append("text")      // text label for the x axis
        .attr("x", 265/500*width )
        .attr("y", 540/500*width )
        .style("font-size",fontSize)
        .style("text-anchor", "middle")
        .text("Region");

    // BAR CHART PLOT END //
}

function MakeScatter(Plot,width,height,data,xlab,ylab,fontSize,f1,f2){

  //add the tooltip
  var tooltip = d3.select("body").append("div")
     .attr("class", "tooltip")
     .style("opacity", 0);

  svg = d3.select(Plot)
              .append("svg")
              .attr("width", width)
              .attr("height", height);

  //create a scale for x (i.e. cost)
  var scalex = d3.scale.linear()
                       .domain([0,d3.max(data, function(d) { return d[0]; })*1.2])
                       .range([0.1*width,width*0.95]);

  var scaley = d3.scale.linear()
                       .domain([0,d3.max(data, function(d) { return d[1]; })*1.2])
                       .range([height*0.9,0.1*height]);

  // Add the circles
  svg.selectAll("circle")
   .data(data) //for each spendconv data point
    .enter()
    .append("circle")//add a circle
    .attr("cx", function(d) {
        return scalex(d[0]); //scale the xvalue
    })
    .attr("cy", function(d) {
        return scaley(d[1]); //scale the y value
    })
    .attr("r",width*5/500) //add the radius
    .on('mouseover', function(d){
      d3.select(this).style("opacity", 0.5);
      tooltip.transition()
               .duration(200)
               .style("opacity", .9);
          tooltip.html(d[2] + "<br/> (" + d[0]
          + ", " + d[1] + ")") //campaign name (x,y)
               .style("left", (d3.event.pageX + 5) + "px")
               .style("top", (d3.event.pageY - 28) + "px")
               .style("width", d[2].length/2.1 + "vw")
               .style("border-radius",d[2].length/100 + "vw");
    })
    .on('mouseout',function(d){
      d3.select(this).style("opacity", 1);
      tooltip.transition()
               .duration(500)
               .style("opacity", 0);
    });

  svg.selectAll("text")
   .data(data)
   .enter()
   .append("text")
   .text(function(d) {
        return f1 + ":"+ d[2] + ","+ f2 + ":" + d[3];
   })
   .attr("x", function(d) {
      return scalex(d[0]);
    })
    .attr("y", function(d) {
      return scaley(d[1]);
    })
    .attr("font-family", "sans-serif")
    .attr("font-size", "11px")
    .attr("fill", "red")
    .attr("visibility","hidden");

  var padding = 20/500*width;
  //add some text to the scatter plot


  //create some axes for the scatter
  var xAxis = d3.svg.axis()
                    .scale(scalex)
                    .orient("bottom");
  svg.append("g")
     .attr("class", "axis") //gains access to the css
     .attr("transform", "translate("+0+"," + 0.9*height + ")") //puts it on the bottom
     .call(xAxis);

  var yAxis = d3.svg.axis()
                    .scale(scaley)
                    .orient("left");
  svg.append("g")
     .attr("class", "axis")
     .attr("transform", "translate(" + width*0.1 + ",0)")
    .call(yAxis);

    //add the axes titles
  svg.append("text")      // text label for the x axis
      .attr("x", 265/500*width )
      .attr("y", 490/500*width )
      .style("text-anchor", "middle")
      .style("font-size",fontSize)
      .text(xlab);

  svg.append("text")      // text label for the y axis
     .attr("x", -250/500*width )
     .attr("y", 11/500*width )
     .style("text-anchor", "middle")
     .style("font-size",fontSize)
     .attr("transform", "rotate(-90)")
     .text(ylab);
};

function AddLine(Plot,width,height,data,xlab,ylab,fontSize,xkey,ykey,colour){

  var lineChart = d3.select(Plot)

  var scaley = d3.scale.linear()
                       .domain([0,d3.max(data, function(d) { return d[1]; })*1.2])
                       .range([height*0.9,0.1*height]);

  var scalex = d3.scale.linear()
                       .domain([d3.min(data, function(d) { return d[xkey];}),d3.max(data, function(d) { return d[xkey]; })])
                       .range([0.1*width,width*0.95]);

 var line = d3.svg.line()
   // assign the X function to plot our line as we wish
   .x(function(d) {
     var stringed = d[0].split("-");
     var newDate = new Date(stringed[0], stringed[1] - 1, stringed[2]);
     return scalex(newDate); //return the x-value
   })
   .y(function(d) {
     return scaley(1.5*d[1]); //return the y-value
   })

  timeSeries.append("svg:path"+index)
    .attr("d", line(data))
    .attr("fill","None")
    .attr("stroke",colour);
};

function MakeLineChart(Plot,width,height,data,xlab,ylab,fontSize,xkey,ykey,ykey2,colour,colour2){

  var tooltip = d3.select("body").append("div")
     .attr("class", "tooltip")
     .style("opacity", 0);

  var LineChart = d3.select(Plot) // define the new one
                    .append("svg")
                    .attr("width", width)
                    .attr("height", height);

  var scalex = d3.scale.linear()
                       .domain([d3.min(data, function(d) { return d[xkey];}),d3.max(data, function(d) { return d[xkey]; })])
                       .range([0.15*width,width*0.95]);

  var xAxis = d3.svg.axis()
                    .scale(scalex)
                    .orient("bottom");


  var scaley = d3.scale.linear()
                        .domain([0,Math.max(d3.max(data, function(d) { return d[ykey]; }),d3.max(data, function(d) { return d[ykey2]; }))*1.2])
                        .range([height*0.9,0.1*height]);

  var yAxis = d3.svg.axis()
                     .scale(scaley)
                     .ticks(6)
                     .tickFormat(d3.format("s"))
                     .orient("left");

  LineChart.append("g")
       .attr("class", "axis") //gains access to the css
       .attr("transform", "translate("+0+"," + 0.9*height + ")") //puts it on the bottom
       .call(xAxis);

  LineChart.append("g")
     .attr("class", "axis")
     .attr("transform", "translate(" + width*0.15 + ",0)")
     .call(yAxis);

   var line = d3.svg.line()
     // assign the X function to plot our line as we wish
     .x(function(d) {
        return scalex(d[xkey]); //return the x-value
     })
     .y(function(d) {
        return scaley(d[ykey]); //return the y-value
     })

   var line2 = d3.svg.line()
     // assign the X function to plot our line as we wish
     .x(function(d) {
        return scalex(d[xkey]); //return the x-value
     })
     .y(function(d) {
        return scaley(d[ykey2]); //return the y-value
     })

   LineChart.append("svg:path")
     .attr("d", line(data))
     .attr("fill","None")
     .attr("stroke",colour);

   LineChart.append("svg:path")
     .attr("d", line2(data))
     .attr("fill","None")
     .attr("stroke",colour2);

     //add the axes titles
   LineChart.append("text")      // text label for the x axis
       .attr("x", 265/500*width )
       .attr("y", 500/500*height )
       .style("text-anchor", "middle")
       .style("font-size",fontSize)
       .text(xlab);

   LineChart.append("text")      // text label for the y axis
      .attr("x", -250/500*height )
      .attr("y", 15/500*width )
      .style("text-anchor", "middle")
      .style("font-size",fontSize)
      .attr("transform", "rotate(-90)")
      .text(ylab);

   var legend = LineChart.selectAll(".legend")
      .data([ykey,ykey2].slice())
      .enter()
      .append("g")
        .style("font-size", fontSize)
        .attr("class", "legend")
        .attr("transform", function(d, i) { return "translate(0," + i * 20/500*width + ")"; });

  var colours = d3.scale.ordinal().range([colour,colour2]);
  //add the legend rectangles
  legend.append("rect")
      .attr("x", width - 68/500*width)
      .attr("width", 18/500*width)
      .attr("height", 18/500*width)
      .style("fill", colours);
  //add the legend text
  legend.append("text")
      .attr("x", width - 74/500*width)
      .attr("y", 9/500*height)
      .attr("dy", ".35em")
      .style("text-anchor", "end")
      .text(function(d) { return UpperFirst(d); });
};

function MakeSingleLineChart(Plot,width,height,data,xlab,ylab,fontSize,xkey,ykey,colour){
  var tooltip = d3.select("body").append("div")
     .attr("class", "tooltip")
     .style("opacity", 0);

  var LineChart = d3.select(Plot) // define the new one
                    .append("svg")
                    .attr("width", width)
                    .attr("height", height);

  var scalex = d3.scale.linear()
                       .domain([d3.min(data, function(d) { return d[xkey];}),d3.max(data, function(d) { return d[xkey]; })])
                       .range([0.15*width,width*0.95]);

  var xAxis = d3.svg.axis()
                    .scale(scalex)
                    .orient("bottom");


  var scaley = d3.scale.linear()
                        .domain([0,d3.max(data, function(d) { return d[ykey]; })*1.2])
                        .range([height*0.9,0.1*height]);

  var yAxis = d3.svg.axis()
                     .scale(scaley)
                     .ticks(6)
                     .tickFormat(d3.format("s"))
                     .orient("left");

  LineChart.append("g")
       .attr("class", "axis") //gains access to the css
       .attr("transform", "translate("+0+"," + 0.9*height + ")") //puts it on the bottom
       .call(xAxis);

  LineChart.append("g")
     .attr("class", "axis")
     .attr("transform", "translate(" + width*0.15 + ",0)")
     .call(yAxis);

   var line = d3.svg.line()
     // assign the X function to plot our line as we wish
     .x(function(d) {
        return scalex(d[xkey]); //return the x-value
     })
     .y(function(d) {
        return scaley(d[ykey]); //return the y-value
     })

   LineChart.append("svg:path")
     .attr("d", line(data))
     .attr("fill","None")
     .attr("stroke",colour);

     //add the axes titles
   LineChart.append("text")      // text label for the x axis
       .attr("x", 265/500*width )
       .attr("y", 500/500*height )
       .style("text-anchor", "middle")
       .style("font-size",fontSize)
       .text(xlab);

   LineChart.append("text")      // text label for the y axis
      .attr("x", -250/500*height )
      .attr("y", 15/500*width )
      .style("text-anchor", "middle")
      .style("font-size",fontSize)
      .attr("transform", "rotate(-90)")
      .text(ylab);

   var legend = LineChart.selectAll(".legend")
      .data([ykey].slice())
      .enter()
      .append("g")
        .style("font-size", fontSize)
        .attr("class", "legend")
        .attr("transform", function(d, i) { return "translate(0," + i * 20/500*width + ")"; });

  var colours = d3.scale.ordinal().range([colour]);
  //add the legend rectangles
  legend.append("rect")
      .attr("x", width - 68/500*width)
      .attr("width", 18/500*width)
      .attr("height", 18/500*width)
      .style("fill", colours);
  //add the legend text
  legend.append("text")
      .attr("x", width - 74/500*width)
      .attr("y", 9/500*height)
      .attr("dy", ".35em")
      .style("text-anchor", "end")
      .text(function(d) { return UpperFirst(d); });
};
