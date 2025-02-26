// Script to create color swatches with text labels
if (app.documents.length > 0) {
    var doc = app.activeDocument;
    var swatches = doc.swatches;
    
    // Create a group to hold all swatches and text
    var group = doc.groupItems.add();
    
    // Define swatch layout
    var swatchSize = 30;        // Size of color square
    var xSpacing = 200;         // Horizontal space between swatches
    var ySpacing = 40;          // Vertical space between swatches
    var swatchesPerRow = 3;     // Number of swatches per row
    var startX = 50;            // Starting X position
    var startY = -50;           // Starting Y position (negative because Illustrator's Y grows downward)
    
    // Skip the first 2 swatches ([None] and Registration)
    for (var i = 2; i < swatches.length; i++) {
        var swatch = swatches[i];
        
        // Calculate position
        var row = Math.floor((i-2) / swatchesPerRow);
        var col = (i-2) % swatchesPerRow;
        var xPos = startX + (col * xSpacing);
        var yPos = startY - (row * ySpacing);
        
        // Create color square
        var colorSquare = group.pathItems.rectangle(
            yPos,           // top
            xPos,           // left
            swatchSize,     // width
            swatchSize      // height
        );
        
        // Apply swatch color and stroke
        colorSquare.fillColor = swatch.color;
        colorSquare.stroked = true;
        colorSquare.strokeColor = doc.swatches['[Registration]'].color;
        colorSquare.strokeWidth = 0.5;
        
        // Add swatch name
        var nameText = group.textFrames.add();
        nameText.contents = swatch.name;
        nameText.position = [xPos + swatchSize + 5, yPos - 5];
        
        // Add CMYK values
        var cmykText = group.textFrames.add();
        
        // Handle different color types
        if (swatch.color.typename === "SpotColor") {
            try {
                // Get the tint value of the spot color
                var tint = swatch.color.tint;
                
                // Get the base color values
                var baseColor = swatch.color.spot.color;
                
                // Calculate actual values based on tint
                var cyan = baseColor.cyan * (tint/100);
                var magenta = baseColor.magenta * (tint/100);
                var yellow = baseColor.yellow * (tint/100);
                var black = baseColor.black * (tint/100);
                
                cmykText.contents = "C: " + Math.round(cyan) + "% " +
                                  "M: " + Math.round(magenta) + "% " +
                                  "Y: " + Math.round(yellow) + "% " +
                                  "K: " + Math.round(black) + "% " +
                                  "(Tint: " + Math.round(tint) + "%)";
            } catch(e) {
                cmykText.contents = "Spot Color: " + swatch.name;
            }
        }
        else if (swatch.color.typename === "CMYKColor") {
            var color = swatch.color;
            cmykText.contents = "C: " + Math.round(color.cyan) + "% " +
                              "M: " + Math.round(color.magenta) + "% " +
                              "Y: " + Math.round(color.yellow) + "% " +
                              "K: " + Math.round(color.black) + "%";
        }
        else {
            cmykText.contents = "Color type: " + swatch.color.typename;
        }
        
        cmykText.position = [xPos + swatchSize + 5, yPos - 20];
    }
}
else {
    alert("Please open a document first.");
}