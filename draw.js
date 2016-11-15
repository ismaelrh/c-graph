var nodes = null;
var edges = null;
var network = null;

function draw() {
    // create people.
    // value corresponds with the age of the person
    nodes = [{
        id: 1,
        value: 2,
        label: 'Algie'
    }, {
        id: 2,
        value: 31,
        label: 'Alston'
    }, {
        id: 3,
        value: 12,
        label: 'Barney'
    }, {
        id: 4,
        value: 16,
        label: 'Coley'
    }, {
        id: 5,
        value: 17,
        label: 'Grant'
    }, {
        id: 6,
        value: 15,
        label: 'Langdon'
    }, {
        id: 7,
        value: 6,
        label: 'Lee'
    }, {
        id: 8,
        value: 5,
        label: 'Merlin'
    }, {
        id: 9,
        value: 30,
        label: 'Mick'
    }, {
        id: 10,
        value: 18,
        label: 'Tod'
    }, ];

    // create connections between people
    // value corresponds with the amount of contact between two people
    edges = [{
        from: 2,
        to: 8,
        value: 3,
        title: '3 emails per week',
        arrows: 'to'
    }, {
        from: 2,
        to: 9,
        value: 5,
        title: '5 emails per week',
        arrows: 'to'
    }, {
        from: 2,
        to: 10,
        value: 1,
        title: '1 emails per week',
        arrows: 'to'
    }, {
        from: 4,
        to: 6,
        value: 8,
        title: '8 emails per week',
        arrows: 'to'
    }, {
        from: 5,
        to: 7,
        value: 2,
        title: '2 emails per week',
        arrows: 'to'
    }, {
        from: 4,
        to: 5,
        value: 1,
        title: '1 emails per week',
        arrows: 'to'
    }, {
        from: 9,
        to: 10,
        value: 2,
        title: '2 emails per week',
        arrows: 'to'
    }, {
        from: 2,
        to: 3,
        value: 6,
        title: '6 emails per week',
        arrows: 'to'
    }, {
        from: 3,
        to: 9,
        value: 4,
        title: '4 emails per week',
        arrows: 'to'
    }, {
        from: 5,
        to: 3,
        value: 1,
        title: '1 emails per week',
        arrows: 'to'
    }, {
        from: 2,
        to: 7,
        value: 4,
        title: '4 emails per week',
        arrows: 'to'
    }];

    // Instantiate our network object.
    var container = document.getElementById('main_network');
    var data = {
        nodes: nodes,
        edges: edges
    };
    var options = {
        nodes: {
            shape: 'dot',
            font: {
                size: 32,
                color: '#ffffff'
            },
            scaling: {
                label: {
                    min: 8,
                    max: 20
                }
            }
        },
        physics: true,
        configure: function(option, path) {
            if (path.indexOf('smooth') !== -1 || option === 'smooth') {
                return true;
            }
            return false;
        },
        edges: {
            smooth: {
                type: 'continuous'
            }
        }
    };
    network = new vis.Network(container, data, options);
}
