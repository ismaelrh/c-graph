var nodes = [];
var edges = [];
var network = null;

var hash = {};

// Global counters
var idCounter = 1;

function parseData() {
    // First loop: define all nodes
    input.forEach(function(entry) {
        // Push current entry into node array
        nodes.push({
            id: idCounter,
            value: entry.weight,
            label: entry.title
        });

        // Set hash of current node
        hash[entry.title] = idCounter;
        idCounter++;
    });

    // Second loop: define all edges
    input.forEach(function(entry) {
        // For each outgoing edge, draw it
        if (entry.outgoing_edges) {
            entry.outgoing_edges.forEach(function(edge) {
                edges.push({
                    from: hash[entry.title],
                    to: hash[edge.destination],
                    value: edge.weight,
                    title: edge.weight + ' references',
                    arrows: 'to'
                });
            });
        }
    });
}



function draw() {
    parseData();

    // Instantiate our network object.
    var container = document.getElementById('main_network');
    var data = {
        nodes: nodes,
        edges: edges
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
                max: 35,
                label: {
                    min: 8,
                    max: 20
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
                max: 10,
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
}
