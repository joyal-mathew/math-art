(() => {
    "use strict";

    /** @type {CanvasRenderingContext2D} */
    const image = document.getElementById("image").getContext("2d");

    const redChannel = document.getElementById("r");
    const greenChannel = document.getElementById("g");
    const blueChannel = document.getElementById("b");
    const alphaChannel = document.getElementById("a");

    const defaultPattern = document.getElementById("default");

    const info = document.getElementById("info");
    const close = document.getElementById("close");
    const closeX = document.getElementById("closeX");

    const evalFunc = body => eval(`(x, y, w, h) => {${body}}`); // jshint ignore: line

    setDefaultPattern();
    redraw();
    addEventListener("resize", redraw);

    image.canvas.onclick = redraw;
    defaultPattern.onclick = setDefaultPattern;
    closeX.onclick = () => info.style.display = "none";

    function setDefaultPattern() {
        redChannel.value = "return Math.cos(x & y) << 16;";
        greenChannel.value = "return Math.cos(w - x & h - y) << 16;";
        blueChannel.value = "return Math.tan(x ^ y) << 8;";
        alphaChannel.value = "return 0xFF;";
    }

    function redraw() {
        image.canvas.width = innerWidth;
        image.canvas.height = innerHeight;

        render();
    }

    function render() {
        const imageData = image.createImageData(image.canvas.width, image.canvas.height);

        const r = evalFunc(redChannel.value);
        const g = evalFunc(greenChannel.value);
        const b = evalFunc(blueChannel.value);
        const a = evalFunc(alphaChannel.value);

        for (let y = 0; y < imageData.height; ++y) {
            for (let x = 0; x < imageData.width; ++x) {
                const index = x * 4 + y * imageData.width * 4;

                imageData.data[index + 0] = r(x, y, imageData.width, imageData.height);
                imageData.data[index + 1] = g(x, y, imageData.width, imageData.height);
                imageData.data[index + 2] = b(x, y, imageData.width, imageData.height);
                imageData.data[index + 3] = a(x, y, imageData.width, imageData.height);
            }
        }

        image.putImageData(imageData, 0, 0);
    }
})();
