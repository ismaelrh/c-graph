window.onload = function() {
    try {
        TagCanvas.Start('foo_canvas');
    } catch (e) {
        console.log("Something went wrong");
    }
};


var tagCloudData = [
    {
        "link": "Aleassa,_H.",
        "text": "Aleassa, H."
    },
    {
        "link": "Pearson,_J._M.",
        "text": "Pearson, J. M."
    },
    {
        "link": "Mcclurg,_S.",
        "text": "Mcclurg, S."
    }
]

function fillTagCloud(tags) {
    for (var i = 0; i < tags.length; i++) {
        var tag_text = "<a href=\"http://www.copyrightevidence.org/evidence-wiki/index.php/" + tags[i].link + "\" target=\"_blank\">" + tags[i].text + "</a>";
        console.log(tag_text);
        $('#foo_canvas').append(tag_text);
    }
};
