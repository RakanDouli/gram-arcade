var svgns = "http://www.w3.org/2000/svg",
  rectPerRow = 20,
  size = window.innerWidth / rectPerRow,
  rectPerColumn = 20,
  colorArray = ["#09265c", "#043077", "#0d3986"];
for (var i = 0; i < rectPerRow * rectPerColumn; i++) {
  var x = size * (i % rectPerRow),
    y = Math.floor(i / rectPerRow) * size,
    colorId = Math.floor(Math.random() * 3);

  var rect = document.createElementNS(svgns, "rect");
  rect.setAttributeNS(null, "x", x);
  rect.setAttributeNS(null, "y", y);
  rect.setAttributeNS(null, "height", size);
  rect.setAttributeNS(null, "width", size);
  rect.setAttributeNS(null, "class", colorId ? "not-trival" : "");
  rect.setAttributeNS(null, "fill", colorArray[colorId]);
  rect.setAttributeNS(null, "next-fill", colorArray[colorId]);
  document.getElementById("svgOne").appendChild(rect);
}

window.onload = function () {
  document.body.className = document.body.className.replace("animate", "");
};

Resources;
