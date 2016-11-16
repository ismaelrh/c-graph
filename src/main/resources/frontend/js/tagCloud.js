window.onload = function() {
    try {
        var options = {
            textFont: 'Helvetica',
            textColour: "#ffffff",
            weight: true,
            weightMode: "color",
            weightSize: 1.0,
            weightSizeMax: 1,
            weightSizeMin: 0,
            wheelZoom: false,
            dragControl: true,
            /*zoomMax: 1.0,
            zoomMin: 1.0,*/
            weightGradient: {
                0: '#f00',
                0.33: '#ff0',
                0.66: '#0f0',
                1: '#00f'
            },
            initial: [0, 0.1],
            shape: "xring(0)",
            lock: "x"
        };
        TagCanvas.Start('foo_canvas', '', options);
    } catch (e) {
        console.log("Something went wrong");
    }
};


var tagCloudAuthors = [{
    "id": 1,
    "link": "Aleassa,_H.",
    "text": "Aleassa, H.",
    "weight": 1
}, {
    "id": 2,
    "link": "Pearson,_J._M.",
    "text": "Pearson, J. M.",
    "weight": 2
}, {
    "id": 3,
    "link": "Mcclurg,_S.",
    "text": "Mcclurg, S.",
    "weight": 3
}]

var numbers = [{
    "text": "One"
}, {
    "text": "Two"
}, {
    "text": "Three"
}, {
    "text": "Four"
}, {
    "text": "Five"
}]
var tagCloudTopics = [{
    "id": 1,
    "link": "Aleassa,_H.",
    "text": "Orphan works",
    "weight": 0.3
}, {
    "id": 2,
    "link": "Pearson,_J._M.",
    "text": "Social Media",
    "weight": 0.1
}, {
    "id": 3,
    "link": "Mcclurg,_S.",
    "text": "Unlawful behaviour",
    "weight": 0.1
}, {
    "id": 4,
    "link": "Aleassa,_H.",
    "text": "Oligopolies",
    "weight": 0.1
}, {
    "id": 5,
    "link": "attribution",
    "text": "Attribution",
    "weight": 0.2
}, {
    "text": "Topic A",
    "weight": 0.2
}, {
    "text": "Topic B",
    "weight": 0.4
}, {
    "text": "Topic C",
    "weight": 0.2
}, {
    "text": "Topic D",
    "weight": 0.1
}]

function fillTagCloud(tags) {
    for (var i = 0; i < tags.length; i++) {
        /*var tag_text = "<a href=\"http://www.copyrightevidence.org/evidence-wiki/index.php/" + tags[i].link + "\" target=\"_blank\" data-weight=\"" + tags[i].weight + "\" style=\"font-size: " + 6*tags[i].weight + "pt\" >" + tags[i].text + "</a>";*/
        /*var tag_text = "<a href=\"http://www.copyrightevidence.org/evidence-wiki/index.php/" + tags[i].link + "\" target=\"_blank\">" + tags[i].text + "</a>";*/
        var tag_text = "<a href=\"\" style=\"font-size: " + 1.2 * tags[i].weight + "ex\">" + tags[i].text + "</a>";
        console.log(tag_text);
        $('#foo_canvas').append(tag_text);
    }
};
