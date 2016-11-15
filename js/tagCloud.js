window.onload = function() {
    try {
        TagCanvas.Start('foo_canvas');
    } catch (e) {
        console.log("Something went wrong");
    }
};
