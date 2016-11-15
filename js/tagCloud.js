window.onload = function() {
    try {
        var options = {
          weight: true,
          weightMode: "size",
          weightSize: 1.0,
          weightSizeMax: 50,
          weightSizeMin: 10,
          //dragControl: true,
          zoomMax: 1.0,
          zoomMin: 1.0
         };
        TagCanvas.Start('foo_canvas', '', options);
    } catch (e) {
        console.log("Something went wrong");
    }
};


var tagCloudAuthors = [
    {
        "id": 1,
        "link": "Aleassa,_H.",
        "text": "Aleassa, H.",
        "weight": 1
    },
    {
        "id": 2,
        "link": "Pearson,_J._M.",
        "text": "Pearson, J. M.",
        "weight": 2
    },
    {
        "id": 3,
        "link": "Mcclurg,_S.",
        "text": "Mcclurg, S.",
        "weight": 3
    }
]

var tagCloudTopics = [
    {
        "id": 1,
        "link": "Aleassa,_H.",
        "text": "Orphan works",
        "weight": 3
    },
    {
        "id": 2,
        "link": "Pearson,_J._M.",
        "text": "Social Media",
        "weight": 1
    },
    {
        "id": 3,
        "link": "Mcclurg,_S.",
        "text": "Unlawful behaviour",
        "weight": 1
    },
    {
        "id": 4,
        "link": "Aleassa,_H.",
        "text": "Oligopolies",
        "weight": 1
    },
    {
        "id": 5,
        "link": "attribution",
        "text": "Attribution",
        "weight": 2
    }
]

function fillTagCloud(tags) {
    for (var i = 0; i < tags.length; i++) {
        var tag_text = "<a href=\"http://www.copyrightevidence.org/evidence-wiki/index.php/" + tags[i].link + "\" target=\"_blank\" data-weight=\"" + tags[i].weight + "\" style=\"font-size: " + 6*tags[i].weight + "pt\" >" + tags[i].text + "</a>";
        console.log(tag_text);
        $('#foo_canvas').append(tag_text);
    }
};
