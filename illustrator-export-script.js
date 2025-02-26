// Export All Open Illustrator Tabs to PNG
// This script exports all currently open documents in Adobe Illustrator to PNG files
// Each PNG will be sized according to its respective artboard dimensions

// INSTRUCTIONS:
// 1. In Adobe Illustrator, go to File > Scripts > Other Script...
// 2. Navigate to where you saved this script and select it
// 3. Choose an export folder in the dialog that appears

function main() {
    if (app.documents.length === 0) {
        alert("No documents are currently open!");
        return;
    }
    
    // Prompt user to select export folder
    var exportFolder = Folder.selectDialog("Select a folder to export PNGs to:");
    if (!exportFolder) return; // User cancelled the dialog
    
    // Store the currently active document to restore it later
    var originalDoc = app.activeDocument;
    
    // Loop through all open documents
    for (var i = 0; i < app.documents.length; i++) {
        // Set the current document as active
        var currentDoc = app.documents[i];
        app.activeDocument = currentDoc;
        
        // Export each artboard in the current document
        for (var j = 0; j < currentDoc.artboards.length; j++) {
            // Activate the current artboard
            currentDoc.artboards.setActiveArtboardIndex(j);
            
            // Get artboard dimensions
            var activeArtboard = currentDoc.artboards[j];
            var artboardRect = activeArtboard.artboardRect;
            var width = Math.abs(artboardRect[2] - artboardRect[0]);
            var height = Math.abs(artboardRect[3] - artboardRect[1]);
            
            // Create filename based on document name and artboard name
            var docName = currentDoc.name.replace(/\.[^\.]+$/, ''); // Remove file extension
            var artboardName = activeArtboard.name;
            var filename = docName + "_" + artboardName + ".png";
            
            // Make sure the filename is valid
            filename = filename.replace(/[\/\\:*?"<>|]/g, "_");
            
            // Setup export options
            var exportOptions = new ExportOptionsPNG24();
            exportOptions.antiAliasing = true;
            exportOptions.transparency = true;
            exportOptions.verticalScale = 100;
            exportOptions.horizontalScale = 100;
            exportOptions.artBoardClipping = true;
            
            // Create file to export to
            var destFile = new File(exportFolder.fsName + "/" + filename);
            
            // Export current artboard as PNG
            currentDoc.exportFile(destFile, ExportType.PNG24, exportOptions);
        }
    }
    
    // Restore the original active document
    app.activeDocument = originalDoc;
    
    // Show success message
    alert("Export complete!\nExported " + app.documents.length + " documents to: " + exportFolder.fsName);
}

// Run the script
main();
