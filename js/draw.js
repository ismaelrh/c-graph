var nodes = [];
var edges = [];
var network = null;

var hash = {};
var data = {};

// Global counters
var idCounter = 1;
var percentColors = [{
    pct: 0.0,
    color: {
        r: 0x00,
        g: 0xff,
        b: 0
    }
}, {
    pct: 0.5,
    color: {
        r: 0xff,
        g: 0xff,
        b: 0
    }
}, {
    pct: 1.0,
    color: {
        r: 0xff,
        g: 0x00,
        b: 0
    }
}];
var clickedNode;

var getColorForPercentage = function(pct) {
    for (var i = 1; i < percentColors.length - 1; i++) {
        if (pct < percentColors[i].pct) {
            break;
        }
    }
    var lower = percentColors[i - 1];
    var upper = percentColors[i];
    var range = upper.pct - lower.pct;
    var rangePct = (pct - lower.pct) / range;
    var pctLower = 1 - rangePct;
    var pctUpper = rangePct;
    var color = {
        r: Math.floor(lower.color.r * pctLower + upper.color.r * pctUpper),
        g: Math.floor(lower.color.g * pctLower + upper.color.g * pctUpper),
        b: Math.floor(lower.color.b * pctLower + upper.color.b * pctUpper)
    };
    var result = 'rgb(' + [color.r, color.g, color.b].join(',') + ')';
    //console.log(result);
    return result;
    // or output as hex if preferred
}

//
function parseData(inputData) {
    // Clear all previous data
    nodes = [];
    edges = [];
    network = null;

    hash = {};
    data = {};

    // First loop: define all nodes
    var min = 999999999;
    var max = -1;

    inputData.forEach(function(entry) {
        // Push current entry into node array
        nodes.push({
            id: idCounter,
            value: entry.weight,
            label: entry.title,
            title: "<b>Name:</b> " +
                entry.title + "</br><b>Weight: </b>" + entry.weight
        });


        // Set hash of current node
        hash[entry.title] = idCounter;
        idCounter++;

        // For each outgoing edge, draw it


        if (entry.outgoing_edges) {
            entry.outgoing_edges.forEach(function(edge) {

                if (edge.weight < min) {
                    min = edge.weight;
                }
                if (edge.weight > max) {
                    max = edge.weight;
                }
            });
        }
    });

    var dif = max - min;
    //console.log("Max is " + max + ", min is " + min + " and difference is " + dif);

    // Second loop: define all edges
    inputData.forEach(function(entry) {




        if (entry.outgoing_edges) {
            entry.outgoing_edges.forEach(function(edge) {

                //console.log("Weight: " + edge.weight + " percentage:" + ((edge.weight - min) / dif));
                edges.push({
                    from: hash[entry.title],
                    to: hash[edge.destination],
                    value: edge.weight * 10,
                    title: edge.weight + ' references',
                    color: getColorForPercentage((edge.weight - min) / dif),
                    arrows: 'to'
                });
            });
        }
    });
}



function draw(inputData) {
    parseData(inputData);

    // Instantiate our network object.
    var container = document.getElementById('main_network');
    data = {
        nodes: nodes,
        edges: new vis.DataSet(edges)
    };
    var options = {
        layout: {
            improvedLayout: false
        },
        nodes: {
            shape: 'dot',
            font: {
                size: 32,
                color: '#ffffff'
            },
            scaling: {
                min: 10,
                max: 90,
                label: {
                    min: 50,
                    max: 50
                }
            }
        },
        physics: {
            barnesHut: {
                centralGravity: 0,
                gravitationalConstant: -50000,
                springConstant: 0.00001,
                springLength: 300
            }
        },
        interaction: {
            tooltipDelay: 100,
            hideEdgesOnDrag: false
        },
        edges: {
            scaling: {
                min: 1,
                max: 30,
                label: {
                    min: 8,
                    max: 20
                }
            },
            smooth: {
                type: 'continuous'
            }
        }
    };
    network = new vis.Network(container, data, options);


    network.on("click", function (params) {

      console.log(edges);

      if(params.nodes[0] && params.nodes[0]!=clickedNode){
        clickedNode = params.nodes[0];
        network.moveNode(clickedNode,0,0);

        var numberNodes = nodes.length;
        var anglesPerNode = 360/(nodes.length-1);
        var positionedNodes = 0;
        var currentAngle = 0;
        for(var i = 0; i < numberNodes ; i ++){
          if(i!=clickedNode){
            var x = 0 + 30*Math.cos(currentAngle);
            var y = 0 + 30*Math.sin(currentAngle);
            currentAngle += anglesPerNode;
            network.moveNode(i,x,y);
          }
        }

        var edges = network.getConnectedEdges(clickedNode);
        var updateArray = [];
        data.edges.forEach(function(edge){
          if(edge.from==clickedNode || edge.to==clickedNode){
            updateArray.push({id:edge.id,hidden:false});

          }
          else {
            updateArray.push({id:edge.id,hidden:true});
          }
        });
          data.edges.update(updateArray);
        }


        //params.nodes[0].x = 0;
        //console.log(nodes);

    });
}

function loadData(property) {


    console.log("Loading property " + property);
    if (!property) {
        property = "Has_country";
    }


    $.getJSON('http://localhost:3031/query?property=' + property, function(data) {
        //data is the JSON string
        draw(data);
        //console.log(data);
    });

}


function changeSelect() {
    var selectBox = document.getElementById("groupSelect");
    var selectedValue = selectBox.options[selectBox.selectedIndex].value;
    loadData(selectedValue);
}

function resetNodes() {
    console.log("Reset nodes");

    var updateArray = [];
    data.edges.forEach(function(edge){
        updateArray.push({id:edge.id,hidden:false});
    });

    data.edges.update(updateArray);
}
