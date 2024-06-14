function boxplot(sel,json,width,height){
  var margin = {top: 40, right: 80, bottom: 140, left: 90};

  width = width - margin.left - margin.right;
  height = height - margin.top - margin.bottom;

  var numberShow = false;

  if(typeof json.data.n == 'number')
    json.data.n = [json.data.n];

  var nBoxes = json.data.n.length;
  if(nBoxes*40 > width)
    width = nBoxes*40;

  var data = [],
      i = 0,
      j = 0;

  var color = d3.scale.category10();
  if(!json.data.color || !Array.isArray(json.data.color))
    json.data.color = json.data.n.map(function(){ return validColor(json.data.color,color); });
  else
    json.data.color = json.data.color.map(function(d){ return validColor(d,color); });

  for(; i < nBoxes; i++){
    var d = {};
    d.name = json.data.names[i];
    d.n = json.data.n[i];
    d.stats = json.data.stats[i];
    d.out = [];
    for(; json.data.group[j] == i; j++)
      d.out.push(json.data.out[j]);
    d.color = json.data.color[i];
    data.push(d);
  }

  var chart = box()
        .height(height)    
        .domain(json.scale);

  sel.selectAll('*').remove();
  var svg = sel.append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)  

  var g = svg.append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
  var x = d3.scale.ordinal()
                .domain(json.data.names)
                .rangeRoundBands([0 , width], 0.7, 0.3);

  var xAxis = d3.svg.axis()
                .scale(x)
                .orient("bottom");

  var y = d3.scale.linear()
                .domain(json.scale)
                .range([height, 0]);

  var yAxis = d3.svg.axis()
                .scale(y)
                .tickFormat(formatter)
                .orient("left");

  g.append("g")
      .attr("class", "y axis")
      .attr("transform", "translate(-20,0)")
      .call(yAxis)
        .append("text")
          .attr("transform", "rotate(-90)")
          .attr("y", 12)
          .attr("x", 0)
          .style("text-anchor", "end")
          .text(json.labels.y);
    
  var gxaxis = g.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + (height + 20) + ")")

  gxaxis.call(xAxis)
        .append("text")
          .attr("x", width)
          .attr("y", -4)
          .style("text-anchor", "end")
          .text(json.labels.x);

  gxaxis.selectAll(".tick text")
      .attr("x", 8)
      .attr("y", 8)
      .attr("transform", "rotate(45)")
      .style("text-anchor", "start")

  var gxaxisRect = gxaxis.node().getBoundingClientRect();
  if(gxaxisRect.height>margin.bottom){
    margin.bottom = gxaxisRect.height + 20;
    svg.attr("height", height + margin.top + margin.bottom);
  }
  if(gxaxisRect.width>width+margin.right){
    margin.right = gxaxisRect.width - width;
    svg.attr("width", width + margin.left + margin.right);
  }

  g.selectAll(".box")
        .data(data)
      .enter().append("g")
        .attr("class", "box")
        .attr("transform", function(d){ return "translate(" +  x(d.name)  + ",0)"; })
      .call(chart.width(x.rangeBand()))
      .on("mouseover", function(){
        if(!numberShow)
      d3.select(this).selectAll("text")
        .transition()
        .duration(500)
        .style("opacity", 0.99)
    })
      .on("mouseout", function(){
        if(!numberShow)
      d3.select(this).selectAll("text")
        .transition()
        .duration(500)
        .style("opacity", 0)
    });

  iconButton(sel,"stats","data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxNCAxNCIgaGVpZ2h0PSIxNCIgd2lkdGg9IjE0IiB2ZXJzaW9uPSIxLjEiPgo8cmVjdCByeD0iMiIgaGVpZ2h0PSIxMyIgd2lkdGg9IjEzIiBzdHJva2U9IiNjMGMwYzAiIHk9Ii41IiB4PSIuNSIgZmlsbD0iI2UwZTBlMCIvPgo8ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSguMjUyNTUpIiBmaWxsPSIjNjA2MDYwIj4KPHJlY3Qgc3R5bGU9ImNvbG9yLXJlbmRlcmluZzphdXRvO2NvbG9yOiMwMDAwMDA7aXNvbGF0aW9uOmF1dG87bWl4LWJsZW5kLW1vZGU6bm9ybWFsO3NoYXBlLXJlbmRlcmluZzphdXRvO3NvbGlkLWNvbG9yOiMwMDAwMDA7aW1hZ2UtcmVuZGVyaW5nOmF1dG8iIGhlaWdodD0iOC44OTgzIiB3aWR0aD0iMS41NDI0IiB5PSIyLjU1MDgiIHg9IjIuNDkxNSIvPgo8cmVjdCBzdHlsZT0iY29sb3ItcmVuZGVyaW5nOmF1dG87Y29sb3I6IzAwMDAwMDtpc29sYXRpb246YXV0bzttaXgtYmxlbmQtbW9kZTpub3JtYWw7c2hhcGUtcmVuZGVyaW5nOmF1dG87c29saWQtY29sb3I6IzAwMDAwMDtpbWFnZS1yZW5kZXJpbmc6YXV0byIgaGVpZ2h0PSIzLjU1OTMiIHdpZHRoPSIxLjU0MjQiIHk9IjcuODg5OCIgeD0iNS45NzYiLz4KPHJlY3Qgc3R5bGU9ImNvbG9yLXJlbmRlcmluZzphdXRvO2NvbG9yOiMwMDAwMDA7aXNvbGF0aW9uOmF1dG87bWl4LWJsZW5kLW1vZGU6bm9ybWFsO3NoYXBlLXJlbmRlcmluZzphdXRvO3NvbGlkLWNvbG9yOiMwMDAwMDA7aW1hZ2UtcmVuZGVyaW5nOmF1dG8iIGhlaWdodD0iNi4yMjg4IiB3aWR0aD0iMS41NDI0IiB5PSI1LjIyMDMiIHg9IjQuMjM0Ii8+CjxyZWN0IHN0eWxlPSJjb2xvci1yZW5kZXJpbmc6YXV0bztjb2xvcjojMDAwMDAwO2lzb2xhdGlvbjphdXRvO21peC1ibGVuZC1tb2RlOm5vcm1hbDtzaGFwZS1yZW5kZXJpbmc6YXV0bztzb2xpZC1jb2xvcjojMDAwMDAwO2ltYWdlLXJlbmRlcmluZzphdXRvIiBoZWlnaHQ9IjcuNDE1MyIgd2lkdGg9IjEuNTQyNCIgeT0iNC4wMzM5IiB4PSI3LjcxOSIvPgo8cmVjdCBzdHlsZT0iY29sb3ItcmVuZGVyaW5nOmF1dG87Y29sb3I6IzAwMDAwMDtpc29sYXRpb246YXV0bzttaXgtYmxlbmQtbW9kZTpub3JtYWw7c2hhcGUtcmVuZGVyaW5nOmF1dG87c29saWQtY29sb3I6IzAwMDAwMDtpbWFnZS1yZW5kZXJpbmc6YXV0byIgaGVpZ2h0PSIyLjE5NDkiIHdpZHRoPSIxLjU0MjQiIHk9IjkuMjU0MiIgeD0iOS40NjEiLz4KPC9nPgo8L3N2Zz4K","show/hide Stats",displayNumbers,{"position":"absolute","top":"30px","left":buttonLeftPos(sel)})

  pngExportButton(sel);

  function displayNumbers(){
    if(!numberShow){
      sel.selectAll("g.box").selectAll("text")
        .transition()
        .duration(500)
        .style("opacity", 0.99)
    }else{
      sel.selectAll("g.box").selectAll("text")
        .transition()
        .duration(500)
        .style("opacity", 0)
    }
    numberShow = !numberShow;
  }

function box(){
  var height = 1,
      width = 1,
      domain = null;

  function box(g){
    var scale = d3.scale.linear()
        .domain(domain())
        .range([height,0]);

    g.append("line")
      .attr("class","center")
      .attr("x1", width/2)
      .attr("x2", width/2)
      .attr("y1", function(d){ return scale(d.stats[4]); })
      .attr("y2", function(d){ return scale(d.stats[0]); });

    g.append("rect")
      .attr("class","box")
      .attr("x", 0)
      .attr("y", function(d){ return scale(d.stats[3]); })
      .attr("width",width)
      .attr("height", function(d){ return scale(d.stats[1])-scale(d.stats[3]); })
      .style("fill", function(d){ return d.color; });

    [["median",2],["whisker",4],["whisker",0]].forEach(function(p){
      g.append("line")
        .attr("class",p[0])
        .attr("x1", 0)
        .attr("x2", width)
        .attr("y1", function(d){ return scale(d.stats[p[1]]); })
        .attr("y2", function(d){ return scale(d.stats[p[1]]); })
    });

    g.selectAll(".outlier")
          .data(function(d){ return d.out; })
        .enter().append("circle")
          .attr("class","outlier")
          .attr("cx",width/2)
          .attr("cy",function(d){ return scale(d); })
          .attr("r",5)

    g.selectAll("text")
          .data(function(d){ return d.stats; })
        .enter().append("text")
          .attr("y",function(d){ return scale(d)+4; })
          .attr("x",function(d,i){ return -6+(width+12)*(i%2); })
          .style("text-anchor",function(d,i){ return i%2==0?"end":"start"; })
          .style("opacity",0)
          .text(function(d){ return formatter(d); });
  }

  box.domain = function(x) {
    if (!arguments.length) return domain;
    domain = x == null ? x : d3.functor(x);
    return box;
  };

  box.height = function(x) {
    if (!arguments.length) return height;
    height = x;
    return box;
  };

  box.width = function(x) {
    if (!arguments.length) return width;
    width = x;
    return box;
  };

  return box;
}
}

function barplot(sel,json,width,height){
  var margin = {top: 40, right: 80, bottom: 140, left: 90};

  var single = false;

  if(typeof json.cols == 'string')
    single = true;
  else{
    margin.right = 120;
    width = width + 30;
  }

  width = width - margin.left - margin.right;
  height = height - margin.top - margin.bottom;

  var nBars = json.rows.length;
  var rangeBands = "rangeRoundBands";
  if(nBars*40 > width){
    width = nBars*40;
    rangeBands = "rangeBands";
  }

  var color = d3.scale.category10();

  var x = d3.scale.ordinal()
    .domain(json.rows)
    [rangeBands]([0, width], .1);

  var y = d3.scale.linear()
    .range([height, 0]);

  var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

  var yAxis = d3.svg.axis()
    .scale(y)
    .tickFormat(formatter)
    .orient("left")

  // create svg
  sel.selectAll('*').remove();
  var svg = sel.append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)

  var g = svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // axis
  var gxaxis = g.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + (height + 20) + ")")

  gxaxis.call(xAxis)
        .append("text")
          .attr("x", width)
          .attr("y", -4)
          .style("text-anchor", "end")
          .text(json.labels.x);

  gxaxis.selectAll(".tick text")
      .attr("x", 8)
      .attr("y", 8)
      .attr("transform", "rotate(45)")
      .style("text-anchor", "start")

  var gxaxisRect = gxaxis.node().getBoundingClientRect();
  if(gxaxisRect.height>margin.bottom){
    margin.bottom = gxaxisRect.height + 20;
    svg.attr("height", height + margin.top + margin.bottom);
  }
  if(gxaxisRect.width>width+margin.right){
    margin.right = gxaxisRect.width - width;
    svg.attr("width", width + margin.left + margin.right);
  }

  g.append("g")
      .attr("class", "y axis")
      .attr("transform", "translate(-20,0)")
      .call(yAxis)
        .append("text")
          .attr("transform", "rotate(-90)")
          .attr("y", 12)
          .attr("x", 0)
          .style("text-anchor", "end")
          .text(json.labels.y);

  // initialize bars
  var gBar = g.selectAll(".gBar")
      .data(json.data)
    .enter().append("g")
      .attr("class","gBar")

  gBar.each(function(d,i){

    var bar = d3.select(this).selectAll("path")
        .data(single?[d]:d)
      .enter().append("path")
        .style("fill",function(d,j){ return color(json.cols[j]) });

    bar.append("title")
        .text(function(d,j) { return "("+json.rows[i]+", "+(single?"":json.cols[j]+", ")+d+")"; });
  })

  displayBar("stack");

  if(!single){

    // draw legend
    var legend = g.append("g")
        .attr("class","legend")
        .attr("transform", "translate("+width+",100)")
        .selectAll("g")
            .data(json.cols)
          .enter().append("g")
            .attr("transform", function(d,i){ return "translate(0,"+(i*20)+")"; })

    legend.append("rect")
      .attr("x", 6)
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", color);

    legend.append("text")
      .attr("x", 30)
      .attr("y", 14)
      .text(String)

    // layout controls
    var div = sel.append("div")
      .attr("class","controls")

    var options = div.selectAll(".option")
      .data(["stack","dodge","overlap"])
    .enter().append("p")
      .attr("class","option")
      .style("border-color",function(d,i){ return i?null:"#666"; })
      .text(String)
      .on("click",function(d){
        options.style("border-color",null)
        d3.select(this).style("border-color","#666")
        displayBar(d);
      })
  }

  // define layouts
  function displayBar(type){
    var dataExtent = function(ex){
          if(ex[0]>0)
            ex[0] = 0;
          if(ex[1]<0)
            ex[1] = 0;
          y.domain(ex);
        },
        rangeBand = x.rangeBand(),
        getX = function(i){ return x(json.rows[i]); }

    if(type=="stack"){

      dataExtent(single ? d3.extent(json.data) : d3.extent(json.data.map(function(d){ return d3.sum(d); })));

      gBar.each(function(d,i){

        var bar = d3.select(this).selectAll("path")
          .attr("d",function(d){
            var tl, tr, bl, br;
            tl = [getX(i),y(0)];
            tr = [tl[0]+rangeBand,tl[1]];
            bl = [tl[0],tl[1]];
            br = [tr[0],tl[1]];
            return "M"+tl+"L"+tr+"L"+br+"L"+bl+"Z";
          })

        var accum = 0;
        bar.transition().duration(1000)
          .attr("d",function(d){
            var tl, tr, bl, br;
            bl = [getX(i),y(accum)];
            br = [bl[0]+rangeBand,bl[1]];
            accum = accum + d;
            tl = [bl[0],y(accum)];
            tr = [br[0],tl[1]];
            return "M"+tl+"L"+tr+"L"+br+"L"+bl+"Z";
          })
      })
    }

    if(type=="dodge"){

      rangeBand = rangeBand/json.cols.length;
      getX = function(i,j){
        return x(json.rows[i])+(rangeBand*j);
      }

      dataExtent(d3.extent(d3.merge(json.data)));

      gBar.each(function(d,i){

        var bar = d3.select(this).selectAll("path")
          .attr("d",function(d,j){
            var tl, tr, bl, br;
            tl = [getX(i,j),y(0)];
            tr = [tl[0]+rangeBand,tl[1]];
            bl = [tl[0],tl[1]];
            br = [tr[0],tl[1]];
            return "M"+tl+"L"+tr+"L"+br+"L"+bl+"Z";
          })

        bar.transition().duration(1000)
          .attr("d",function(d,j){
            var tl, tr, bl, br;
            tl = [getX(i,j),y(d)];
            tr = [tl[0]+rangeBand,tl[1]];
            bl = [tl[0],y(0)];
            br = [tr[0],bl[1]];
            return "M"+tl+"L"+tr+"L"+br+"L"+bl+"Z";
          })
      })
    }

    if(type=="overlap"){

      dataExtent(d3.extent(d3.merge(json.data)));

      gBar.each(function(d,i){

        var bar = d3.select(this).selectAll("path")
          .attr("d",function(d){
            var tl, tr, bl, br;
            tl = [getX(i),y(0)];
            tr = [tl[0]+rangeBand,tl[1]];
            bl = [tl[0],tl[1]];
            br = [tr[0],tl[1]];
            return "M"+tl+"L"+tr+"L"+br+"L"+bl+"Z";
          })

        var data = [],
            start = d.map(function(){ return 0; });
        for(var j = 0; j < d.length; j++)
          data.push([j,d[j]]);
        data = data.sort(function(a,b){ return Math.abs(a[1])-Math.abs(b[1]); });
        for(var j = 0; j < d.length-1; j++)
          start[data[j+1][0]] = data[j][1];

        bar.transition().duration(1000)
          .attr("d",function(d,j){
            var tl, tr, bl, br;
            bl = [getX(i),y(start[j])];
            br = [bl[0]+rangeBand,bl[1]];
            tl = [bl[0],y(d)];
            tr = [br[0],tl[1]];
            return "M"+tl+"L"+tr+"L"+br+"L"+bl+"Z";
          })
      })
    }

    sel.select(".y.axis").transition().duration(1000).call(yAxis)
  }

  pngExportButton(sel);
}

function heatmap(sel,data,width,height){
  var margin = {top: 60, right: 200, bottom: 140, left: 60},
      clusterDeep = 0,
      metadataHeight = 0,
      cellSize = 14;

  if(data.rows && data.cols){
    margin.left = 20;
    margin.top = 20;
    clusterDeep = 90;
  }

  width = width - margin.left - margin.right - clusterDeep;

  var NAcolor = "transparent";

  var colorScales = {
        Reds: ["#fee0d2","#fc9272","#de2d26"],
        Greens: ["#e5f5e0","#a1d99b","#31a354"],
        Blues: ["#deebf7","#9ecae1","#3182bd"],
        RdBkGr: ["#de2d26","#000000","#31a354"],
        RdWhBu: ["#de2d26","#ffffff","#3182bd"]
      };

  var options = data.options?data.options:{};

  if(options.NAcolor)
    NAcolor = options.NAcolor;

  var cex = options.cex?options.cex:1;

  cellSize = cellSize*cex;

  if(data.matrix.dim[1] > width/16)
    width = Math.min(1140 - margin.left - margin.right - clusterDeep, data.matrix.dim[1] * 16);

  if(data.matrix.dim[0] > height/12)
    height = Math.min(1140 - margin.top - margin.bottom - clusterDeep, data.matrix.dim[0] * 12);

  if(data.metadata)
    metadataHeight = data.metadata.dim[0] * cellSize + 4;

  d3.select("body")
    .on("click",function(){ d3.select(".scalePicker").remove(); })
    .append("div")
      .attr("class","tooltip")

  sel.selectAll('*').remove();

  var canvas = sel.append("canvas")
         .style("left", (margin.left + clusterDeep) + "px")
         .style("top", (margin.top + clusterDeep + metadataHeight) + "px")
         .style("position", "absolute")
         .attr("width", width)
         .attr("height", height)

  var svg = sel.append("svg")
         .style("left", "0px")
         .style("top", "0px")
         .style("position", "absolute")
      .attr("width", width + margin.left + margin.right + clusterDeep)
      .attr("height", height + margin.top + margin.bottom + clusterDeep + metadataHeight);

  var defs = svg.append("defs");

  d3.entries(colorScales).forEach(function(d){ addGradient(defs,d.key,d.value); });

  if(data.rows){
    var rowClust = svg.append("g")
      .attr("class","rowClust")
      .attr("clip-path",addMask(defs,"rowClust",height,clusterDeep))
      .attr("transform", "translate("+margin.left+","+(margin.top + clusterDeep + metadataHeight)+")rotate(90)scale(1,-1)");
    dendrogram(rowClust,data.rows,height,clusterDeep - 4);
  }

  if(data.cols || data.metadata){
    var colClust = svg.append("g")
      .attr("class","colClust")
      .attr("clip-path",addMask(defs,"colClust",width,clusterDeep + metadataHeight))
      .attr("transform", "translate("+(margin.left + clusterDeep)+","+margin.top+")");
    dendrogram(colClust,data.cols,width,clusterDeep - 4);
    drawMetadata(colClust,data.metadata);
  }

  var gMatrix = svg.append("g")
      .attr("class","matrix")
      .attr("clip-path",addMask(defs,"matrix",width,height))
      .attr("transform", "translate("+(margin.left + clusterDeep)+","+(margin.top + clusterDeep + metadataHeight)+")");
  drawMatrix(gMatrix,canvas,data.matrix,options.scaleColor);

  var rowNames = svg.append("g")
      .attr("class","rowNames axis")
      .attr("transform", "translate("+(width+ margin.left + clusterDeep + 4)+","+(margin.top + clusterDeep + metadataHeight)+")");
  displayNames(rowNames,data.matrix.rows,[0,height],"right");

  var colNames = svg.append("g")
      .attr("class","colNames axis")
      .attr("transform", "translate("+(margin.left + clusterDeep)+","+(height + margin.top + clusterDeep + metadataHeight + 4)+")");
  displayNames(colNames,data.matrix.cols,[0,width],"bottom");

  var colNamesRect = colNames.node().getBoundingClientRect();
  if(colNamesRect.height>margin.bottom){
    margin.bottom = colNamesRect.height + 20;
    svg.attr("height", height + margin.top + margin.bottom + clusterDeep + metadataHeight);
  }

  sel.style("position", "relative")
      .style("height", (height + margin.top + margin.bottom + clusterDeep + metadataHeight) + "px");

function dendrogram(svg,root,width,height){
  if(root){
  var cluster = d3.layout.cluster()
    .separation(function() { return 1; })
    .size([width, height]);

  var diagonal = (function(d) { return "M"+d.source.x+","+d.source.y+"L"+d.target.x+","+d.source.y+"L"+d.target.x+","+d.target.y; });

  var y = d3.scale.linear()
    .range([0, height])

  var nodes = cluster.nodes(root);
      y.domain(d3.extent(nodes, function(d){ return d.height; }).reverse());
      nodes.forEach(function(d){
    d.y = d.children? y(parseFloat(d.height)) : height;
      });
  var links = cluster.links(nodes);

  svg.append("g")
    .selectAll(".link")
      .data(links)
    .enter().append("path")
      .attr("class", "link")
      .attr("d", diagonal)
  }else
    svg.append("g");
}

function drawMetadata(svg,metadata){
  if(metadata){

    var rows = metadata.dim[0],
      cols = metadata.dim[1],
      x = d3.scale.linear().domain([0, cols]).range([0, width]),
      y = d3.scale.linear().domain([0, rows]).range([clusterDeep, clusterDeep + metadataHeight -4]);

    var cellWidth = x(1)-x(0),
        cellHeight = y(1)-y(0);

    if(rows==1)
      metadata.rows = [metadata.rows]; 

    metadata.data.forEach(function(d,j){
      var color = d3.scale.category10();
      if(typeof d[0] == "string")
        color.domain(d3.set(d).values().sort());
      else
        color = d3.scale.linear().range(["#d62728","#1f77b4"]).domain(d3.extent(d));

      svg.select("g").selectAll("."+metadata.rows[j])
        .data(d)
      .enter().append("rect")
        .attr("class","metacell "+metadata.rows[j])
        .attr("width", cellWidth)
        .attr("height", cellHeight)
        .attr("x", function(d,i){ return x(i); })
        .attr("y", function(d,i){ return y(j); })
        .style("fill", function(d,i) { return color(d); })
        .append("title")
          .text(function(d,i){ return (metadata.rows[j])+"\nsample: "+(metadata.cols[i])+"\nvalue: "+d; });
    });
  }
}

function drawMatrix(gMatrix,canvas,matrix,color){

  var colorDomain = d3.extent(matrix.scaled || matrix.data);
  if(colorDomain[1]>10)
    colorDomain[1] = 10;
  colorDomain = [colorDomain[0],d3.mean(colorDomain),colorDomain[1]];

  displayScale(svg,colorDomain)

  var rows = matrix.dim[0],
      cols = matrix.dim[1],
      x = d3.scale.linear().domain([0, cols]).range([0, width]),
      y = d3.scale.linear().domain([0, rows]).range([0, height]),
      colorScale = d3.scale.linear()
        .range(colorScales[color])
        .domain(colorDomain)
        .clamp(true);

  drawCells(canvas);

  var brush = d3.svg.brush()
        .x(x)
        .y(y)
        .clamp([true, true])
        .on('brush', function() {
          var extent = brush.extent();
          extent[0][0] = Math.round(extent[0][0]);
          extent[0][1] = Math.round(extent[0][1]);
          extent[1][0] = Math.round(extent[1][0]);
          extent[1][1] = Math.round(extent[1][1]);
          d3.select(this).call(brush.extent(extent));
        })
        .on('brushend', function() {
          zoom(brush.extent());
          brush.clear();
          d3.select(this).call(brush);
        });

  var tooltip = d3.select(".tooltip");

  gMatrix.append("g")
      .attr("class", "brush buttons")
      .call(brush)
      .select("rect.background")
        .on("mouseenter",function(){ 
          tooltip.style("display","block");
        })
        .on("mousemove",function(){          
          var col = Math.floor(x.invert(d3.mouse(this)[0]));
          var row = Math.floor(y.invert(d3.mouse(this)[1]));
          var label = formatter(matrix.data[col*rows + row]);
          tooltip.html("row: "+matrix.rows[row]+"<br/>col: "+matrix.cols[col]+"<br/>value: "+label);
          tooltip.style({"left":window.scrollX+d3.event.clientX+10+"px","top":window.scrollY+d3.event.clientY+10+"px"});
        })
        .on("mouseleave",function(){ 
          tooltip.style("display","none");
        })

  iconButton(sel,"colors","images/color.png","Change Color Scale",scalePicker,{"position":"absolute","top":"30px","left":buttonLeftPos(sel)});

  pngExportButton(sel);

  function drawCells(canvas){

    colorScale.range(colorScales[color]);
    d3.select(".scale rect").attr("fill", "url(#"+color+")")

    var ctx = canvas.node().getContext("2d");
    ctx.clearRect(0, 0, canvas.attr('width'), canvas.attr('height'));

    var cellWidth = x(1)-x(0),
        cellHeight = y(1)-y(0);

    matrix.data.forEach(function(d,i){
      var val = (matrix.scaled || matrix.data)[i];
      var dx = x(Math.floor(i/rows));
      var dy = y(i%rows);
      if(Math.ceil(dy)>=0 && Math.floor(dy+cellHeight)<=height){
        ctx.fillStyle = (val == null) ? NAcolor : colorScale(val);
        ctx.beginPath();
        ctx.rect(dx, dy, cellWidth, cellHeight);
        ctx.closePath();
        ctx.fill();
      }
    });
  }
  function displayScale(svg,domain){
    var scaleWidth = 60;

    var x = d3.scale.linear()
      .range([0,scaleWidth/2])
      .domain(domain);

    var axis = d3.svg.axis()
      .scale(x)
      .tickValues(domain)
      .orient("bottom");

    var scale = svg.append("g")
    .attr("class","scale")
        .attr("transform", "translate(20,10)");
      scale.append("rect")
    .attr({x:0, y:0, height:10, width:scaleWidth, rx:2, fill:"black"})
      scale.append("g")
        .attr("class","axis")
        .attr("transform","translate(0,13)")
        .call(axis)
          .select("path.domain").remove()
  }

  function scalePicker(){
    d3.event.stopPropagation();

    var colors = d3.keys(colorScales);

    var picker = svg.append("g")
      .attr("class","scalePicker")
      .attr("transform","translate("+(width + margin.left + clusterDeep + margin.right - 90)+",10)");

    picker.append("rect")
      .attr("x",0)
      .attr("y",0)
      .attr("rx",2)
      .attr("width",60)
      .attr("height", 8 + colors.length*14)
      .style({"fill":"white","stroke":"#ccc"})

    picker.selectAll("rect>rect")
        .data(colors)
      .enter().append("rect")
      .attr("x",10)
      .attr("y",function(d,i){ return 6 + i*14; })
      .attr("rx",2)
      .attr("width",40)
      .attr("height",10)
      .attr("fill",function(d){ return "url(#"+d+")"; })
      .style("cursor","pointer")
      .on("click",function(d){
        color = d;
        drawCells(canvas);
      });
  }

  function zoom(ex){
      var scale = [1,1], translate = [0,0];

      if(ex[0][0]==ex[1][0] || ex[0][1]==ex[1][1]){
        ex = [[0,0],[cols,rows]];
      }else{
        scale = [
          cols / (ex[1][0] - ex[0][0]),
          rows / (ex[1][1] - ex[0][1])
        ];
        translate = [
          ex[0][0] * (width / cols) * scale[0] * -1,
          ex[0][1] * (height / rows) * scale[1] * -1
        ];
      }

      x.range([translate[0], width * scale[0] + translate[0]]);
      y.range([translate[1], height * scale[1] + translate[1]]);
      drawCells(canvas);
      displayNames(svg.select("g.rowNames").transition().duration(500),matrix.rows.slice(ex[0][1],ex[1][1]),[0,height],"right");
      displayNames(svg.select("g.colNames").transition().duration(500).attr("transform","translate("+(margin.left + clusterDeep)+","+(height + margin.top + clusterDeep + metadataHeight + 4)+")"),matrix.cols.slice(ex[0][0],ex[1][0]),[0,width],"bottom");
      svg.select(".rowClust>g").transition().duration(500).attr("transform","translate("+translate[1]+",0)scale("+scale[1]+",1)");
      svg.select(".colClust>g").transition().duration(500).attr("transform","translate("+translate[0]+",0)scale("+scale[0]+",1)");
  }
}

function displayNames(svg,names,range,orient){

  if(names.length>75)
    names = [];

  var x = d3.scale.ordinal()
    .rangeBands(range)
    .domain(names);

  var xAxis = d3.svg.axis()
    .scale(x)
    .orient(orient);

  svg.call(xAxis).select("path.domain").remove();

  if(orient == "bottom")
      svg.selectAll(".tick text")
    .attr("x", 6)
    .attr("y", 6)
    .attr("transform", "rotate(45)")
    .style("text-anchor","start")
}

function addGradient(defs, id, stops){
  var offset = 100/(stops.length-1);
  var gradient = defs.append("linearGradient")
    .attr("id",id)
    .attr("x1","0%")
    .attr("y1","0%")
    .attr("x2","100%")
    .attr("y2","0%");

  stops.forEach(function(d, i){
    gradient
    .append("stop")
    .attr("offset",(offset*i)+"%")
    .style("stop-color",d);
  })
}

function addMask(defs,id,w,h){
    defs.append("clipPath")
    .attr("id", id+"Mask")
    .append("rect")
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", w)
        .attr("height", h);

  return "url(#"+id+"Mask)";
}
}

function plot(sel,json,width,height){
  var margin = {top: 40, right: 40, bottom: 80, left: 90};

  width = width - margin.left - margin.right;
  height = height - margin.top - margin.bottom;

  var color = d3.scale.category10();

  var x = d3.scale.linear()
    .range([0, width]);

  var y = d3.scale.linear()
    .range([height, 0]);

  var xAxis = d3.svg.axis()
    .scale(x)
    .tickFormat(formatter)
    .orient("bottom")
    .innerTickSize(-height)
    .outerTickSize(0)
    .tickPadding(10);

  var yAxis = d3.svg.axis()
    .scale(y)
    .tickFormat(formatter)
    .orient("left")
    .innerTickSize(-width)
    .outerTickSize(0)
    .tickPadding(10);

  sel.selectAll('*').remove();
  var svg = sel.append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom);

  svg = svg.append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var nodes = [];
  if(json.colNodes){
    var node,
        len = json.nodes[0].length,
        i = 0;
    for(; i<len; i++){
      node = {};
      json.colNodes.forEach(function(col,j){
        node[col] = json.nodes[j][i];
      });
      nodes.push(node);
    }
  }else
    nodes = json.nodes;

  if (typeof json.scales != 'undefined') {
    if (typeof json.scales.x != 'undefined') {
      x.domain(json.scales.x);
    } else {
      x.domain(d3.extent(nodes, function(d) { return d.x; })).nice();
    }
    if (typeof json.scales.y != 'undefined') {
      y.domain(json.scales.y);
    } else {
      y.domain(d3.extent(nodes, function(d) { return d.y; })).nice();
    }
  } else {
    x.domain(d3.extent(nodes, function(d) { return d.x; })).nice();
    y.domain(d3.extent(nodes, function(d) { return d.y; })).nice();
  }

  svg.append("g")
      .attr("class", "x axis grid")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
      .append("text")
        .attr("x", width/2)
        .attr("y", margin.bottom-10)
        .style("text-anchor", "middle")
        .text(json.labels.x);

  svg.selectAll(".x.axis .tick text")
      .attr("x", 8)
      .attr("y", 8)
      .attr("transform", "rotate(45)")
      .style("text-anchor", "start")

  svg.append("g")
      .attr("class", "y axis grid")
      .call(yAxis)
      .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", -margin.left+30)
        .attr("x", -height/2)
        .style("text-anchor", "middle")
        .text(json.labels.y)

  if (typeof json.axis != 'undefined') {
    if (typeof json.axis.x != 'undefined') {
    json.axis.x.forEach(function(d){
      svg.append("line")
          .attr("x1", x(d))
          .attr("y1", 0)
          .attr("x2", x(d))
          .attr("y2", height)
          .style({"stroke-width": 1, "stroke": "grey"});
    });
    }
    if (typeof json.axis.y != 'undefined') {
    json.axis.y.forEach(function(d){
      svg.append("line")
          .attr("x1", 0)
          .attr("y1", y(d))
          .attr("x2", width)
          .attr("y2", y(d))
          .style({"stroke-width": 1, "stroke": "grey"});
    });
    }
  }

  svg.selectAll(".dot")
      .data(nodes)
    .enter().append("path")
      .attr("class", "dot")
      .attr("transform", function(d) { return "translate("+x(d.x)+","+y(d.y)+")"; })
      .attr("d", d3.svg.symbol().type(function(d){
    if (typeof d.pch != 'undefined') {
      switch(d.pch){
            case 2:
              return "triangle-up";
              break;
            case 3:
              return "cross";
              break;
            case 4:
              return "square";
              break;
            case 5:
              return "diamond";
              break;
            case 6:
              return "triangle-down";
              break;
            default:
              return "circle";
          }
    }
    return "circle";
    }).size(64))
      .style("fill", function(d){ return validColor(d.col,color); })
      .append("title").text(function(d){return ((typeof d.id != 'undefined')?d.id+" ":"")+"("+Number((d.x).toFixed(2))+","+Number((d.y).toFixed(2))+")";})

  pngExportButton(sel);
}

function bubbleplot(sel,data,width,height){
var collisionPadding = 4,
    clipPadding = 4,
    minRadius = 16, // minimum collision radius
    maxRadius = 65; // also determines collision search radius

var force = d3.layout.force()
    .charge(0)
    .size([width, height])
    .on("tick", tick);

var drag = d3.behavior.drag()
      .on("drag", function(d,i) {
          var gLayout = sel.select("svg>g.layout"),
              pos = d3.transform(gLayout.attr("transform"));
              pos.translate[0] += d3.event.dx;
              pos.translate[1] += d3.event.dy;
          gLayout.attr("transform", "translate(" + pos.translate[0] + "," + pos.translate[1] + ")");
    });

var r = d3.scale.sqrt()
    .range([minRadius, maxRadius]);

r.domain(d3.extent(data.nodes, function(d) { return d.size?d.size:d.a+d.b; }))

data.nodes.forEach(function(d) {
    d.r = r(d.size?d.size:d.a+d.b);
    d.cr = Math.max(minRadius, d.r);
    d.k = fraction(d.a, d.b);
    if (isNaN(d.k)) d.k = .5;
    if (isNaN(d.x)) d.x = (1 - d.k) * width + Math.random();
    d.bias = .5 - Math.max(.1, Math.min(.9, d.k));
});

sel.selectAll('*').remove();
var svg = sel.append("svg")
    .attr("width", width)
    .attr("height", height)

    svg.append("rect")
        .style("opacity",0)
        .attr("width",width)
        .attr("height",height)
        .call(drag);

    svg.append("g")
      .attr("class","layout")

force.nodes(data.nodes).start();
updateNodes();
tick({alpha: 0}); // synchronous update

if(data.names)
  displayLegend(data.names);

pngExportButton(sel);

function displayLegend(names){
  var c = ["g-a","g-b"];

  var legend = sel.select("svg").selectAll(".legend")
      .data(names)
    .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function(d, i) { return "translate(0," + (10+i*20) + ")"; });

  // draw legend colored rectangles
  legend.append("rect")
      .attr("x", 10)
      .attr("width", 18)
      .attr("height", 18)
      .attr("class", function(d,i){ return c[i]; });

  // draw legend text
  legend.append("text")
      .attr("x", 32)
      .attr("y", 15)
      .text(String)
}

// Update the displayed nodes.
function updateNodes() {
  var node = sel.select("svg>g.layout").selectAll(".node").data(data.nodes, function(d) { return d.name; });

  node.exit().remove();

  var nodeEnter = node.enter().append("g")
      .attr("class", "node")
      .call(force.drag);

  var aEnter = nodeEnter.append("g")
      .attr("class", "g-a");

  aEnter.append("clipPath")
      .attr("id", function(d,i) { return "g-clip-a-" + i; })
    .append("rect");

  aEnter.append("circle");

  var bEnter = nodeEnter.append("g")
      .attr("class", "g-b");

  bEnter.append("clipPath")
      .attr("id", function(d,i) { return "g-clip-b-" + i; })
    .append("rect");

  bEnter.append("circle");

  nodeEnter.append("line")
      .attr("class", "g-split");

  nodeEnter.append("text")
    .text(function(d){ return d.name; })
    .style("font-size", function(d) { return Math.max(8, d.r / Math.max(2,Math.pow(d.name.length,1/2))) + "px"; })

  nodeEnter.append("text")
    .attr("y", function(d) { return Math.max(6, d.r / 2); })
    .text(function(d){ return formatter(d.a) + " - " + formatter(d.b); })
    .style("font-size", function(d) { return Math.max(4, d.r / 4) + "px"; })

  nodeEnter.selectAll("text").attr("text-anchor", "middle");

  node.selectAll("rect")
      .attr("y", function(d) { return -d.r - clipPadding; })
      .attr("height", function(d) { return 2 * d.r + 2 * clipPadding; });

  node.select(".g-a rect")
      .style("display", function(d) { return d.k > 0 ? null : "none" })
      .attr("x", function(d) { return -d.r - clipPadding; })
      .attr("width", function(d) { return 2 * d.r * d.k + clipPadding; });

  node.select(".g-b rect")
      .style("display", function(d) { return d.k < 1 ? null : "none" })
      .attr("x", function(d) { return -d.r + 2 * d.r * d.k; })
      .attr("width", function(d) { return 2 * d.r; });

  node.select(".g-a circle")
      .attr("clip-path", function(d,i) { return d.k < 1 ? "url(#g-clip-a-" + i + ")" : null; });

  node.select(".g-b circle")
      .attr("clip-path", function(d,i) { return d.k > 0 ? "url(#g-clip-b-" + i + ")" : null; });

  node.select(".g-split")
      .attr("x1", function(d) { return -d.r + 2 * d.r * d.k; })
      .attr("y1", function(d) { return -Math.sqrt(d.r * d.r - Math.pow(-d.r + 2 * d.r * d.k, 2)); })
      .attr("x2", function(d) { return -d.r + 2 * d.r * d.k; })
      .attr("y2", function(d) { return Math.sqrt(d.r * d.r - Math.pow(-d.r + 2 * d.r * d.k, 2)); });

  node.selectAll("circle")
      .attr("r", function(d) { return d.r; });
}

// Simulate forces and update node and label positions on tick.
function tick(e) {
  sel.selectAll("svg .node")
      .each(bias(e.alpha * 105))
      .each(collide(.5))
      .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

  sel.selectAll(".g-label")
      .style("left", function(d) { return (d.x - d.dx / 2) + "px"; })
      .style("top", function(d) { return (d.y - d.dy / 2) + "px"; });
}

// A left-right bias causing nodes to orient by side preference.
function bias(alpha) {
  return function(d) {
    d.x += d.bias * alpha;
  };
}

// Resolve collisions between nodes.
function collide(alpha) {
  var q = d3.geom.quadtree(data.nodes);
  return function(d) {
    var r = d.cr + maxRadius + collisionPadding,
        nx1 = d.x - r,
        nx2 = d.x + r,
        ny1 = d.y - r,
        ny2 = d.y + r;
    q.visit(function(quad, x1, y1, x2, y2) {
      if (quad.point && (quad.point !== d) && d.other !== quad.point && d !== quad.point.other) {
        var x = d.x - quad.point.x,
            y = d.y - quad.point.y,
            l = Math.sqrt(x * x + y * y),
            r = d.cr + quad.point.r + collisionPadding;
        if (l < r) {
          l = (l - r) / l * alpha;
          d.x -= x *= l;
          d.y -= y *= l;
          quad.point.x += x;
          quad.point.y += y;
        }
      }
      return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
    });
  };
}

// Given two quantities a and b, returns the fraction to split the circle a + b.
function fraction(a, b) {
  var k = a / (a + b);
  if (k > 0 && k < 1) {
    var t0, t1 = Math.pow(12 * k * Math.PI, 1 / 3);
    for (var i = 0; i < 10; ++i) { // Solve for theta numerically.
      t0 = t1;
      t1 = (Math.sin(t0) - t0 * Math.cos(t0) + 2 * k * Math.PI) / (1 - Math.cos(t0));
    }
    k = (1 - Math.cos(t1 / 2)) / 2;
  }
  return k;
}
}

function network(sel,graph,width,height){

var directional = false;

var nodes = [],
    links = [];

graph.nodes.forEach(function(d){
  var n = copyObject(d),
      fields = d3.keys(n);
  n.attr = {};
  fields.forEach(function(f){
    if(f!="name" && f!="_color" && f!="noShow"){
      n.attr[f] = n[f];
      delete n[f];
    }
  })
  nodes.push(n);
});

graph.links.forEach(function(d){
  var l = copyObject(d),
      fields = d3.keys(l);
  l.attr = {};
  fields.forEach(function(f){
    if(f!="source" && f!="target" && f!="_color"){
      l.attr[f] = l[f];
      delete l[f];
    }
  })
  links.push(l);
});

var attr = graph.attr?graph.attr:{},
    options = graph.options?graph.options:{};

var colorDomain = d3.extent(nodes, function(d) { return d.attr[attr.color]; }),
    sizeDomain = d3.extent(nodes, function(d) { return d.attr[attr.size]; }),
    weightDomain = d3.extent(links, function(d) { return d.attr[attr.weight]; }),
    lcolorDomain = d3.extent(links, function(d) { return d.attr[attr.linkColor]; });

var color = d3.scale.category20();
var lcolor = function(){ return null; }
var areaColor = d3.scale.category10();

var size = d3.scale.linear()
    .range([3,12])
    .domain(sizeDomain);

var weight = d3.scale.linear()
    .range([1,5])
    .domain(weightDomain);

if(typeof colorDomain[0] == 'number'){
var colorRK = d3.scale.linear()
    .domain(colorDomain)
    .range(["#d62728","#000000"]);

var colorRKG = d3.scale.linear()
    .domain([colorDomain[0],colorDomain[0]+(colorDomain[1]-colorDomain[0])/2,colorDomain[1]])
    .range(["#d62728","#000000","#2ca02c"]);
}

if(typeof lcolorDomain[0] == 'string'){
  lcolor = d3.scale.category20();
}
if(typeof lcolorDomain[0] == 'number'){
  lcolor = d3.scale.linear()
    .domain(lcolorDomain)
    .range(["#f0db4e","#1f63b4"]);
}

var force = d3.layout.force()
    .size([width, height])
    .on("tick", tick );

sel.selectAll('*').remove();
var svg = sel.append("svg")
    .attr("width", width)
    .attr("height", height);

var defs = svg.append("defs");

addGradient("gradRB", ["#d62728","#000000"]);
addGradient("gradRBG", ["#d62728","#000000","#2ca02c"]);

  defs.selectAll("marker")
    .data(["end"])
  .enter().append("marker")
    .attr("id", String)
    .attr("viewBox", "0 -5 10 10")
    .attr("markerUnits", "userSpaceOnUse")
    .attr("refX", 0)
    .attr("refY", 0)
    .attr("markerWidth", 8)
    .attr("markerHeight", 8)
    .attr("orient", "auto")
  .append("path")
    .attr("d", "M0,-5L10,0L0,5")
    .style({"fill":"#999"});

var net = svg.append("g").attr("class","net");

var buttons = svg.append("g")
      .attr("class", "buttons")
      .attr("transform", "translate(20,20)")

  addButton(0,"Show/Hide text",null,clickText);
  addButton(15,"Directional",null,clickDirectional);
  addButton(30,"PNG export",null,function(){ getPNG(svg.node()); });

var sliders = buttons.append("g")
      .attr("transform", "translate(150,0)");

if(weightDomain[0]!=weightDomain[1]){
  brushSlider(height-50,weightDomain,"Filter edges by weight",function(x){
    var names = [];
    links.forEach(function(d){
      if(d.attr[attr.weight]<x[0] || d.attr[attr.weight]>x[1])
        d.noShow = true;
      else{
        delete d.noShow;
        if(names.indexOf(d.source.name)==-1)
          names.push(d.source.name)
        if(names.indexOf(d.target.name)==-1)
          names.push(d.target.name)
      }
    });
    nodes.forEach(function(d){
      if(names.indexOf(d.name)==-1)
        d.noShow = true;
      else
        delete d.noShow;
    });
    drawNet();
  });
}

drawNet();

displaySlider(5, [0, -2000], -200, "Node repulsion", "charge");
displaySlider(20, [0, 300], 80, "Edge distance", "linkDistance");

if(typeof colorDomain[0] == 'number'){
    addButton(50,null,"url(#gradRB)",function(){ clickColor(colorRK, "url(#gradRB)"); });
    addButton(65,null,"url(#gradRBG)",function(){ clickColor(colorRKG, "url(#gradRBG)"); });

    var scale = svg.append("g")
    .attr("class","scale")
        .attr("transform", "translate("+(width-320)+",20)")
    .style("opacity","0")
    scale.append("rect")
    .attr("x",0)
    .attr("y",0)
    .attr("height",10)
    .attr("width",300)
    .attr("rx",2);
    scale.append("text")
    .attr("x",0)
    .attr("y",25)
    .text(formatter(colorDomain[0]));
    scale.append("text")
    .attr("x",300)
    .attr("y",25)
    .attr("text-anchor", "end")
    .text(formatter(colorDomain[1]));

    if(options.nodeColorScale && options.nodeColorScale == "RdBkGr")
      clickColor(colorRKG, "url(#gradRBG)");
    else
      clickColor(colorRK, "url(#gradRB)");
}

drawTables();

function tick() {
  if(directional){
    net.selectAll(".link").each(function(d){
            // Total difference in x and y from source to target
            var diffX = d.target.x - d.source.x;
            var diffY = d.target.y - d.source.y;

            // Length of path from center of source node to center of target node
            var pathLength = Math.sqrt((diffX * diffX) + (diffY * diffY));
            var nodeSize = (attr.size?size(d.target.attr[attr.size]):5)+9;

            // x and y distances from center to outside edge of target node
            var offsetX = (diffX * (nodeSize)) / pathLength;
            var offsetY = (diffY * (nodeSize)) / pathLength;

            d3.select(this)
              .attr("x1", function(d) { return d.source.x; })
              .attr("y1", function(d) { return d.source.y; })
              .attr("x2", function(d) { return d.target.x - offsetX; })
              .attr("y2", function(d) { return d.target.y - offsetY; })
        });
  }else{
    net.selectAll(".link")
        .attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; })
  }
    
    net.selectAll(".linkText")
          .attr("x", function(d) { return ((d.target.x)+(d.source.x))/2; })
          .attr("y", function(d) { return ((d.target.y)+(d.source.y))/2; });

    net.selectAll(".node").attr("transform", function(d){  return "translate(" + d.x + "," + d.y + ")"; });

    net.selectAll(".area").each(function(dd){
          var points = nodes.filter(function(d){ return (d.attr[attr.group]==dd.group)&&!d.noShow; });
          dd.xExt = d3.extent(points,function(d){ return d.x;});
          dd.yExt = d3.extent(points,function(d){ return d.y;});
        })
        .attr("x", function(d){ return d.xExt[0]-3 })
        .attr("y", function(d){ return d.yExt[0]-3 })
        .attr("width", function(d){ return d.xExt[1]-d.xExt[0]+6 })
        .attr("height", function(d){ return d.yExt[1]-d.yExt[0]+6 });
}

function drawNet(){

  force
      .nodes(nodes.filter(function(d){ return !d.noShow; }))
      .links(links.filter(function(d){ return !d.noShow; }))
      .start();

  // nodes
  var node = net.selectAll(".node")
      .data(force.nodes(), function(d) { return d.name; });

  node.exit().remove();

  var nodeEnter = node.enter().append("g")
    .attr("class", "node")
    .call(force.drag);

  nodeEnter.append("circle")
      .attr("r", function(d) { return attr.size?size(d.attr[attr.size]):5; })
      .style("fill", function(d) { return d._color?d._color:color(d.attr[attr.color]); })

  nodeEnter.append("text")
      .attr("x", function(d) { return attr.size?(4+size(d.attr[attr.size])):8; })
      .attr("y", 2)
      .style("opacity",0.99)
      .text(function(d) { return attr.label?d.attr[attr.label]:d.name; });

  nodeEnter.append("title")
      .text(function(d) {
        var str = d.name;
        for(i in d.attr)
          str = str+"\n"+i+": "+formatter(d.attr[i]);
        return str; 
      });

  // links
  var link = net.selectAll(".link")
      .data(force.links(), function(d) { return d.source.name+" "+d.target.name; });

  link.exit().remove();

  link.enter().insert("line",".node")
      .attr("class", "link")
      .style("stroke", function(d) { return d._color?d._color:lcolor(d.attr[attr.linkColor]); })
      .style("stroke-width", function(d) { return weight(d.attr[attr.weight]); });

  link.attr("marker-end", directional?"url(#end)":null);

  if(attr.linkLabel){
    var linkText = net.selectAll(".linkText")
          .data(force.links(), function(d) { return d.source.name+" "+d.target.name; });

    linkText.exit().remove();

    linkText.enter().insert("text",".node")
        .attr("class","linkText")
        .style("opacity",0.99)
        .text(function(d) { return formatter(d.attr[attr.linkLabel]); });
  }

  // areas
  var groups = [];
  if(attr.group){
    groups = d3.set(force.nodes().map(function(d){return d.attr[attr.group];})).values();
    groups = groups.map(function(d){
      var dd = {};
      dd.group = d;
      dd.xExt = [0,0];
      dd.yExt = [0,0];
      return dd;
    });
  }

  var area = net.selectAll(".area")
        .data(groups);

  area.exit().remove();

  area.enter().insert("rect",".link")
    .attr("class", "area")
    .attr("rx", 10)
    .style("stroke",function(d) { return areaColor(d.group); })
    .style("fill",function(d) { return d3.rgb(areaColor(d.group)).brighter(0.6); });
}

function clickText() {
  var texts = svg.selectAll(".linkText, .node>text");
    if(texts.style("opacity")!=0){
    texts.transition()
    .duration(500)
    .style("opacity",0);
    }else{
    texts.transition()
    .duration(500)
    .style("opacity",0.99);
    }
}

function clickDirectional(){
  directional = !directional;
  drawNet();
}

function clickColor(newcolor, fill) {
  color = newcolor;
  svg.selectAll(".node circle").transition()
       .duration(500)
       .style("fill", function(d){ return d._color?d._color:color(d.attr[attr.color]); });
  svg.select(".scale rect")
    .style("fill", fill);
  svg.select(".scale").transition()
    .duration(500)
    .style("opacity",(fill!="black")?1:0);
}

function addGradient(id, stops){
  var offset = 100/(stops.length-1);
  var gradient = defs.append("linearGradient")
    .attr("id",id)
    .attr("x1","0%")
    .attr("y1","0%")
    .attr("x2","100%")
    .attr("y2","0%");

  stops.forEach(function(d, i){
    gradient
    .append("stop")
    .attr("offset",(offset*i)+"%")
    .style("stop-color",d);
  })
}

function addButton(y,txt,fill,callback) {
    buttons.append("rect")
    .attr("x",0)
    .attr("y",y)
    .attr("rx",2)
    .attr("ry",2)
    .attr("width",30)
    .attr("height",10)
    .style("fill",fill)
    .on("click", callback);
    if(txt){
    buttons.append("text")
    .attr("x",35)
    .attr("y",y+8)
    .text(txt);
    }
}

function displaySlider(y, domain, start, txt, name){
    var scale = d3.scale.linear()
        .domain(domain)
        .range([0, 200])
        .clamp(true);

    var brush = d3.svg.brush()
        .x(scale)
        .extent([0, 0])
        .on("brush", brushed);

    sliders.append("text")
        .attr("x", 210)
        .attr("y", y+3)
        .text(txt);

    var slider = sliders.append("g")
        .attr("transform", "translate(0,"+ y +")")
        .attr("class", "x axis")
        .call(d3.svg.axis()
          .scale(scale)
          .orient("bottom")
          .tickSize(0)
              .ticks(0))
        .append("g")
          .attr("class", "slider")
          .call(brush);

    var handle = slider.append("circle")
        .attr("class", "handle")
        .attr("r", 6);

    slider
        .call(brush.extent([start, start]))
        .call(brush.event);

    slider.selectAll(".extent, .resize").remove();
        slider.select(".background")
            .style("cursor", "ew-resize")
            .attr("y",-5)
            .attr("width", 200)
            .attr("height", 10);

    function brushed() {
      var value = brush.extent()[0];

      if (d3.event.sourceEvent) {
        value = scale.invert(d3.mouse(this)[0]);
        brush.extent([value, value]);
      }

      handle.attr("cx", scale(value));
      force[name](value).start();
    }
}

function brushSlider(y,domain,txt,callback){

  var x = d3.scale.linear()
      .range([0, 200])
      .domain(domain);

  var brush = d3.svg.brush()
      .x(x)
      .extent(domain)
      .on("brush", brushmove);

  var brushg = buttons.append("g")
      .attr("class", "axis brushSlider")
      .attr("transform", "translate(0," + y + ")")
      .call(d3.svg.axis().scale(x).orient("top").tickValues(domain).tickSize(0).tickPadding(12));

  brushg.selectAll("text")
    .style("text-anchor", "middle");

  brushg.append("text")
    .attr("x", 220)
    .attr("y", 3)
    .text(txt);

  brushg.append("g")
      .attr("class","brush")
      .call(brush);

  brushg.selectAll(".resize>rect").remove();

  brushg.selectAll(".resize").append("circle")
      .attr("class", "handle")
      .attr("r",6)

  brushg.selectAll(".resize").append("path")
      .attr("d","m -12,-22 c -1,0 -2,1 -2,2 l 0,8 c 0,1 1,2 2,2 l 10,0 2,2 2,-2 10,0 c 1,0 2,-1 2,-2 l 0,-8 c 0,-1 -1,-2 -2,-2 l -24,0 z")
      .style({"visibility":null,"fill":"#ddd","stroke":"#aaa"})

  var cloudText = brushg.selectAll(".resize")
      .append("text")
      .attr("x",0)
      .attr("y",-12)
      .style("text-anchor","middle")
      .text(function(d,i){ return d3.round(domain[+!i],1); });

  brushg.select(".extent")
      .attr("y",-3)
      .attr("height", 6)
      .style({"fill-opacity": ".8", "stroke": "none", "fill": "#47c0c0"});

  brushg.select(".background").remove();

  function brushmove() {
    var extent = brush.extent();
    cloudText.text(function(d,i){ return d3.round(extent[+!i],1); })
    callback(extent);
  }
}

function drawTables(){
  var div = sel.append("div")
        .attr("class","tab-wrap"),
      items = div.append("div");

  div = div.append("div").attr("class","tables")
          .style("height","210px")

  drawTable(nodes);
  drawTable(links);

  sel.insert("div",".tab-wrap")
    .attr("class","switch")
    .html('<svg xmlns="http://www.w3.org/2000/svg" height="20" width="29" viewBox="0 0 14 14" version="1.1"><path fill="#ffffff" d="m4.2852 2.3666v4.3255h-2.7983l2.7561 2.8709 2.757 2.871 2.757-2.871 2.756-2.8709h-2.7983v-4.3255h-5.4293z"/></svg>')
    .on("click",function(){
      var buttArrow = d3.select(this).select('svg'),
      funSwitch = function(divH,svgH,brushY,arrowR){
        div.transition().duration(500).style("height",divH+"px")
        svg.transition().duration(500).attr("height",svgH)
        svg.select(".brushSlider").transition().duration(500).attr("transform","translate(0,"+brushY+")")
        buttArrow.transition().duration(500).style("transform","rotate("+arrowR+"deg)")
        force.size([width, svgH]).start();
      }
      if(div.style("height")!="0px"){
        height += 210;
        funSwitch(0,height,height-50,180);
      }else{
        height -= 210;
        funSwitch(210,height,height-50,0);
      }
    })

  function drawTable(data){
    if(!data.length)
      return;
    var tab = div.append("table"),
        thead = tab.append("thead").append("tr"),
        tbody = tab.append("tbody"),
        columns = d3.keys(data[0].attr),
        name = "nodes";

    if(data[0].name){
      thead.append("th").text("name");
    }else{
      name = "links";
      thead.append("th").text("source");
      thead.append("th").text("target");
    }
    tab.attr("class",name+" display")
    columns.forEach(function(d){
      thead.append("th").text(d);
    })

    data.forEach(function(d){
      var tr = tbody.append("tr");
      if(name=="nodes"){
        tr.append("td").text(d.name);
        tr.on("mouseover",function(){
          svg.selectAll("g.node").filter(function(p){ return d.name===p.name; }).select("circle").style({"stroke":"yellow","stroke-width":"3"});
        })
        tr.on("mouseout",function(){
          svg.selectAll("g.node>circle").style({"stroke":null,"stroke-width":null});
        })
      }else{
        tr.append("td").text(d.source.name);
        tr.append("td").text(d.target.name);
        tr.on("mouseover",function(){
          svg.selectAll("line.link").filter(function(p){ return d.source.name===p.source.name && d.target.name===p.target.name; }).style({"stroke":"yellow","stroke-opacity":"1"});
        })
        tr.on("mouseout",function(){
          svg.selectAll("line.link").style({"stroke":null,"stroke-opacity":null});
        })
      }
      columns.forEach(function(col){
        var val = d.attr[col],
            td = tr.append("td");
        if(isNaN(val))
          td.text(val);
        else
          td.attr("class","dt-body-right").text(formatter(val));
      })
    });

    $(tab.node()).DataTable({
      dom: 'fBt',
      "bPaginate": false,
      buttons: ['copy','csv','excel']
    });

    var divtab = d3.select(tab.node().parentNode);

    if(name=="links")
      divtab.style("display","none");

    items.append("div")
      .text(name)
      .style("border-bottom-color",name=="nodes"?"#fff":null)
      .on("click",function(){
        items.selectAll("div").style("border-bottom-color",null)
        d3.select(this).style("border-bottom-color","#fff")
        div.selectAll("div.tables>div").style("display","none")
        divtab.style("display",null)
      })
  }
}
}

function symheatmap(sel,json,width){
  var margin = {tl: width/7, br: width/200},
      triangle = true;

  var height = width/1.4142;

  var size = height - margin.tl - margin.br;

  var attr = json.attr?json.attr:{},
      options = json.options?json.options:{};

  var x = d3.scale.ordinal().rangeBands([0, size]),
      z = d3.scale.linear().range([0.1,1]).domain(d3.extent(json.links, function(d){ return d[attr.weight]; })),
      color = d3.scale.category10();

  sel.selectAll('*').remove();
  displaySelect(sel);

  var svg = sel.append("svg")
      .attr("width", width)
      .attr("height", height);

  svg = svg.append("g")

  var matrix = [],
      nodes = json.nodes,
      n = nodes.length;

  // Compute index per node.
  nodes.forEach(function(node, i) {
    node.index = i;
    node.count = 0;
    matrix[i] = d3.range(n).map(function(j) { return {x: j, y: i, z: 0}; });
  });

  // Convert links to matrix; count character occurrences.
  json.links.forEach(function(link) {
    matrix[link.source][link.target].z = link[attr.weight];
    matrix[link.target][link.source].z = link[attr.weight];
    nodes[link.source].count += link[attr.weight];
    nodes[link.target].count += link[attr.weight];
  });

  // Precompute the orders.
  var orders = {
    count: d3.range(n).sort(function(a, b) { return nodes[b].count - nodes[a].count; }),
    name: d3.range(n).sort(function(a, b) { return d3.ascending(attr.label?nodes[a][attr.label]:nodes[a].name, attr.label?nodes[b][attr.label]:nodes[b].name); })
    //group: d3.range(n).sort(function(a, b) { return nodes[b][attr.group] - nodes[a][attr.group]; })
  };

  // The default sort order.
  x.domain(orders.count);

  svg.append("rect")
      .style("fill","#eee")
      .attr("width", size)
      .attr("height", size);

  var row = svg.selectAll(".row")
      .data(matrix)
    .enter().append("g")
      .attr("class", "row")
      .attr("transform", function(d, i) { return "translate(0," + x(i) + ")"; })
      .each(row);

  row.append("line")
      .attr("x2", size)
    .style("stroke","#fff");

  row.append("text")
      .attr("y", x.rangeBand() / 2)
      .attr("dy", ".32em")
      .text(function(d, i) { return attr.label?nodes[i][attr.label]:nodes[i].name; });

  var column = svg.selectAll(".column")
      .data(matrix)
    .enter().append("g")
      .attr("class", "column")
      .attr("transform", function(d, i) { return "translate(" + x(i) + ")rotate(-90)"; });

  column.append("line")
      .attr("x1", -size)
    .style("stroke","#fff");

  column.append("text")
      .attr("dy", ".32em")
      .text(function(d, i) { return attr.label?nodes[i][attr.label]:nodes[i].name; });

  function row(row) {
    var cell = d3.select(this).selectAll(".cell")
        .data(row.filter(function(d) { return d.z; }))
      .enter().append("rect")
        .attr("class", "cell")
        .attr("x", function(d) { return x(d.x); })
        .attr("width", x.rangeBand())
        .attr("height", x.rangeBand())
        .style("fill-opacity", function(d) { return z(d.z); })
        .style("fill", function(d) { return nodes[d.x][attr.group] == nodes[d.y][attr.group] ? color(nodes[d.x][attr.group]) : null; })
        .on("mouseover", mouseover)
        .on("mouseout", mouseout)
        .append("title")
          .text(function(d) {
            return (attr.label?nodes[d.x][attr.label]:nodes[d.x].name) + " - " + (attr.label?nodes[d.y][attr.label]:nodes[d.y].name) + " \nvalue: " + formatter(d.z);
          })
  }

  function mouseover(p) {
    sel.selectAll(".row text").style("fill", function(d, i) {
      if(i == p.y) return "red"; else return null;
    });
    sel.selectAll(".column text").style("fill", function(d, i) {
      if(i == p.x) return "red"; else return null; 
    });
  }

  function mouseout() {
    sel.selectAll("text").style("fill", null);
  }

  sel.select("select.order").on("change", function() {
    order(this.value);
  });

  sel.select("select.layout").on("change", function() {
    layout(this.value);
  });

  function order(value) {
    x.domain(orders[value]);

    var t = svg.transition().duration(2500);

    t.selectAll(".row")
        .delay(function(d, i) { return x(i) * 4; })
        .attr("transform", function(d, i) { return "translate(0," + x(i) + ")"; })
      .selectAll(".cell")
        .delay(function(d) { return x(d.x) * 4; })
        .attr("x", function(d) { return x(d.x); });

    t.selectAll(".column")
        .delay(function(d, i) { return x(i) * 4; })
        .attr("transform", function(d, i) { return "translate(" + x(i) + ")rotate(-90)"; });
  }

  function layout(value){
    triangle = (value == "triangle");

    sel.select('svg').attr('height',triangle ? size : height);

    svg.attr("transform", triangle? "translate(" + ((width-Math.sqrt(size*size*2))/2) + "," + size + ")rotate(-45)" : "translate(" + ((margin.tl+width-size)/2) + "," + margin.tl + ")")

    row.selectAll("text").attr(triangle?{
      "x": size + 6,
      "text-anchor": "start"
    }:{
      "x": -6,
      "text-anchor": "end"
    })

    column.selectAll("text").attr(triangle?{
      "x": -6,
      "y": - x.rangeBand() / 2,
      "text-anchor": "end",
      "transform": "rotate(180)"
    }:{
      "x": 6,
      "y": x.rangeBand() / 2,
      "text-anchor": "start",
      "transform": null
    })
  }

  layout(triangle?"triangle":"square");

  pngExportButton(sel);

  function displaySelect(sel) {

    var controls = sel.append("div").attr("class","controls");

    controls.append("p").text("Change layout:")

    controls.append("select")
        .attr("class", "layout")
        .selectAll("option")
          .data(["triangle","square"])
        .enter().append("option")
          .property("value",String)
          .text(String)

    controls.append("p").text("Change order:")

    controls.append("select")
        .attr("class", "order")
        .selectAll("option")
          .data([
            ["count","by Frequency"],
            ["name","by name"]
            //["group","by Cluster"]
          ])
        .enter().append("option")
          .property("value",function(d){ return d[0]; })
          .text(function(d){ return d[1]; })
  }
}

function enrichmentData(data,numeric){
      data = data.split("\n");
      data.splice(-1,1);
      var cols = data.shift().split("\t");
      for(var i=0; i<data.length; i++){
        data[i] = data[i].split("\t");
        for(var j=numeric; j<data[i].length; j++){
          data[i][j] = +data[i][j];
        }
      }
      return {data:data, cols:cols};  
}

function enrichmentNetworks(selected){
    if(typeof results == 'undefined' || typeof links == 'undefined')
      return;

    var data = results.data,
        cols = results.cols,
        fnodes = [], flinks = [],
        prepareNode = function(d){
          var node = {name:d[0], size:(1-d[9])};
          for(var i=1; i<cols.length; i++){
            node[cols[i]] = d[i];
          }
          return node;
        },
        prepareLink = function(d){ return {source:d[0], target:d[1], weight:d[2]}; };

    if(typeof selected == 'undefined' || selected.length==0){
      if(data.length>100){
        fnodes = data.slice(0,100).map(prepareNode);
        flinks = links.filter(function(d){ return d[0]<100 && d[1]<100; }).map(prepareLink);
        show_message('Showing only first 100 elements in networks','success');
      }else{
        fnodes = data.map(prepareNode);
        flinks = links.map(prepareLink);
      }
    }else{
      var indices = data.map(function(d,i){ return [i,d[0]]; })
        .filter(function(d){ return selected.indexOf(d[1])!=-1; })
        .map(function(d){ return d[0]; });
      indices.forEach(function(d,i){
        fnodes[i] = prepareNode(data[d]);
      });
      flinks = links.filter(function(d){ return indices.indexOf(d[0])!=-1 && indices.indexOf(d[1])!=-1; }).map(function(d){ return prepareLink([indices.indexOf(d[0]),indices.indexOf(d[1]),d[2]]); });
    }

    var attributes = {label:cols[1],size:'size',weight:'weight'};

    if(cols[5]=="DEPercent")
      attributes.color = cols[5];

    network(d3.select("#network"),{nodes:fnodes, links:flinks, attr:attributes},defaultWidth,700);
    symheatmap(d3.select("#symheatmap"),{nodes:fnodes, links:flinks, attr:{label:cols[1],weight:'weight'}},defaultWidth);
}

function selectableTable(sel, data, cols, orderIndex, selectAction, addColumnDef){
      var preparedCols = cols.map(function(d,i){ return {title: d, data: i}; });
      preparedCols.unshift({ title: "", data: null, defaultContent: "" });

      var columnDefs = [{
            orderable: false,
            className: 'select-checkbox',
            targets:   0
        }];
      if(typeof addColumnDef != 'undefined'){
        if(Array.isArray(addColumnDef))
          addColumnDef.forEach(function(d){ columnDefs.push(d); });
        else
          columnDefs.push(addColumnDef);
      }
      columnDefs.push({
            render: function (data, type, row) {
              if (type === 'display') {
                return formatter( data );
              }
              return data;
            },
            targets: '_all'
        });

      var table = sel.DataTable({
        data: data,
        columns: preparedCols,
        columnDefs: columnDefs,
        dom: 'Blftp',
        buttons: [
            {
                text: 'Select all',
                action: function () {
                    table.rows( { page: 'current' } ).select();
                }
            },
            {
                text: 'Select none',
                action: function () {
                    table.rows().deselect();
                }
            }
        ],
        order: [[ orderIndex, "asc" ]],
        select: {
          style: 'multi'
        }
      });

      new $.fn.dataTable.Buttons( table, { buttons: ['copy','csv','excel'] } );
 
      table.buttons( 1, null ).container().appendTo( table.table().container() );

      table.on( 'select', function ( e, dt, type ) {
        trSelection(type);
      }).on( 'deselect', function ( e, dt, type ) {
        trSelection(type);
      });

    function trSelection(type,indexes) {
        if ( type === 'row' ) {
          selectAction(table);
        }
    }
}

function clickNumDEInCat(sel){
    sel.on("click", "td:nth-child(5) > a", function(event){
        event.preventDefault();
        event.stopPropagation();
        var id = $(this).parent().siblings('td:nth-child(2)').text();
        d3.text(getURL+file+"_genes.html", "text/plain", function(error, data){
          if (error) throw error;

          display_window(data);
          var win = $('.window>.window-content');
          win.scrollTop( $(document.getElementById(id)).offset().top - win.offset().top );
        });
    });
}

function clickEnrichmentID(sel){
    sel.on("click", "td:nth-child(2) > a", function(event){
      event.stopPropagation();
      var id = $(this).text(),
          href = $(this).attr("href"),
          db = $(this).parent().siblings('td:nth-child(4)').text();
      if(["KEGG","REACTOME","WikiPathways"].indexOf(db)!=-1){
        event.preventDefault();
        d3.text(getURL+file+"_genes.html", "text/plain", function(error, data){
          if (error) throw error;

          var parser = new DOMParser();
          data = parser.parseFromString(data,"text/xml");
          var genes = data.getElementById(id).childNodes[1].textContent.replace(/ /g,'').split(',');

          if(["KEGG","REACTOME"].indexOf(db)!=-1){
            if(db == "KEGG")
              href += "/"+genes.join("/")+"/default%3dpink";
            if(db == "REACTOME")
              href += "&FLAG="+genes.join("&FLAG=");
            window.open(href);
          }
          if(db=="WikiPathways"){
            d3.xml("http://webservice.wikipathways.org/getPathwayAs?fileType=svg&pwId="+id, function(error, data){
              if (error){
                display_window("Some error has ocurred!");
                throw error;
              }

              data = window.atob(data.childNodes[0].textContent);

              var zoom = d3.behavior.zoom()
                .scaleExtent([0.4, 6])
                .on("zoom", zoomed);

              var width = $(window).width()*0.8,
                  height = $(window).height()*0.8;

              display_window(data,width,height);

              var svg = d3.selectAll(".window-content svg");
              svg.attr("width",d3.round(width-86));
              svg.attr("height",d3.round(height-86));

              svg.selectAll("text")
              .filter(function(){ return genes.indexOf(this.textContent)!=-1; })
              .style("fill","#fff")
              .each(function(){
                d3.select(this.parentNode).style("fill","#191970");
              })

              svg.call(zoom);

              function zoomed() {
                svg.select("svg>g").attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
              }
            });
          }
        });
      }
    });
}

function renderNumDEInCat(d,t){
            if(d){
              if(t=="display")
                return "<a href=\"#\">"+d+"</a>";
              else
                return d;
            }else
              return 0;
}

function renderEnrichmentID(d,t,r){
            if(t=="display"){
              if(r[2]=="KEGG")
                return "<a target=\"_blank\" href=\"https://www.kegg.jp/kegg-bin/show_pathway?"+d+"\">"+d+"</a>";
              if(r[2]=="REACTOME")
                return "<a target=\"_blank\" href=\"https://reactome.org/PathwayBrowser/#/"+d+"\">"+d+"</a>";
              if(r[2]=="WikiPathways")
                return "<a target=\"_blank\" href=\"https://www.wikipathways.org/index.php/Pathway:"+d+"\">"+d+"</a>";
              if(["Process","Function","Component"].indexOf(r[2])!=-1)
                return "<a target=\"_blank\" href=\"http://amigo.geneontology.org/amigo/term/"+d+"\">"+d+"</a>";
            }
            return d;
}

function validColor(col,scale) {
    if (!col | col === "" | col === "inherit" | col === "transparent") {
      if(scale)
        return scale("undefined");
      else
        return false;
    }
    
    var image = document.createElement("img");
    image.style.color = "transparent";
    image.style.color = col;
    if(image.style.color !== "transparent"){
      return col;
    }else{
      if(scale)
        return scale(col);
      else
        return false;
    }
}

function formatter(d){
  if(typeof d == 'number'){
    var dabs = Math.abs(d);
    if((dabs>0 && dabs<1e-3) || dabs>1e+5)
      d = d.toExponential(1);
    else
      d = Math.round(d * 1000) / 1000;
  }
  return d;
}

function iconButton(sel,alt,src,title,job,style){
    sel.append("img")
      .attr("class","icon")
      .attr("alt", alt)
      .style("width", "14px")
      .style("height", "14px")
      .attr("src", src)
      .attr("title", title)
      .style("cursor","pointer")
      .style(style)
      .on("click", job);
}

function copyObject(obj){
  var res = {}
  for(i in obj){
    res[i] = obj[i];
  }
  return res;
}

function fileDownload(blob,name){
  if(window.navigator.msSaveBlob){
    window.navigator.msSaveBlob(blob, name);
  }else{
    var reader = new FileReader();
    reader.onload = function (event) {
      var save = document.createElement('a');
      save.href = event.target.result;
      save.target = '_blank';
      save.download = name;
      var clicEvent = new MouseEvent('click', {
        'view': window,
        'bubbles': true,
        'cancelable': true
      });
      save.dispatchEvent(clicEvent);
      (window.URL || window.webkitURL).revokeObjectURL(save.href);
    };
    reader.readAsDataURL(blob);
  }
}

function buttonLeftPos(sel){
  return (parseInt(sel.select("svg").style("width"))-20) + "px";
}

function pngExportButton(sel){
  var svgIcon = "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+CjxzdmcgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGhlaWdodD0iMTQiIHdpZHRoPSIxNCIgdmVyc2lvbj0iMS4xIiB4bWxuczpjYz0iaHR0cDovL2NyZWF0aXZlY29tbW9ucy5vcmcvbnMjIiB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iPgogPGVsbGlwc2Ugcng9IjYuNTI4IiBzdHJva2U9IiNjMGMwYzAiIHJ5PSI2LjUyOCIgY3k9IjciIGN4PSI3IiBzdHJva2Utd2lkdGg9Ii45NDQiIGZpbGw9IiNlMGUwZTAiLz4KIDxwYXRoIGQ9Im00LjI4NTIgMi4zNjY2djQuMzI1NWgtMi43OTgzbDIuNzU2MSAyLjg3MDkgMi43NTcgMi44NzEgMi43NTctMi44NzEgMi43NTYtMi44NzA5aC0yLjc5ODN2LTQuMzI1NWgtNS40MjkzeiIgZmlsbD0iIzYwNjA2MCIvPgo8L3N2Zz4K";
  iconButton(sel,"png",svgIcon,"Export PNG",function(){ getPNG(sel.select("svg").node()); },{"position":"absolute","top":"10px","left":buttonLeftPos(sel)})
}

function getSVGstring(svg){
  var sheets = document.styleSheets;
  var styleStr = '.buttons,.brushSlider,.left-arrow,.right-arrow';
  Array.prototype.forEach.call(sheets, function(sheet){
    try{ // we need a try-catch block for external stylesheets that could be there...
        styleStr += Array.prototype.reduce.call(sheet.cssRules, function(a, b){
          return a + b.cssText;
        }, "");
    }catch(e){
      //console.log(e);
    }
  });
  var style = document.createElementNS('http://www.w3.org/2000/svg', 'style');
  style.innerHTML = styleStr;
  svg.insertBefore(style, svg.firstElementChild);

  var svgString = new XMLSerializer().serializeToString(svg);
  svg.removeChild(style);

  return svgString;
}

function getPNG(svg){

  var canvas = document.createElement("canvas");
  canvas.width = svg.getAttribute("width");
  canvas.height = svg.getAttribute("height");
  var ctx = canvas.getContext("2d");
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  var innerCanvas = svg.parentNode.querySelector("canvas");
  if(innerCanvas){
    var x = parseInt(innerCanvas.style.left),
        y = parseInt(innerCanvas.style.top);
    ctx.drawImage(innerCanvas, x, y);
  }
  var DOMURL = self.URL || self.webkitURL || self;
  var img = new Image();
  var svgString = getSVGstring(svg);
  var svg = new Blob([svgString], {type: "image/svg+xml"});
  var url = DOMURL.createObjectURL(svg);
  img.onload = function() {
    ctx.drawImage(img, 0, 0);
    canvas.toBlob(function(blob){
      fileDownload(blob, 'graph.png');
    })
  };
  img.src = url;
}
