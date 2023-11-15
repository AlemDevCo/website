function uploadFile() {
    var fileInput = document.getElementById('fileInput');
    var guiContainer = document.getElementById('guiContainer');

    var file = fileInput.files[0];

    if (file) {
        var reader = new FileReader();

        reader.onload = function(e) {
            var content = e.target.result;
            var byteArray = new Uint8Array(content);

            // Display the byte values in the #guiContainer
            guiContainer.textContent = Array.from(byteArray).join(', ');
        };

        reader.readAsArrayBuffer(file);
    } else {
        alert('Please select a file.');
    }
}

function parseContent(content) {
    // Implement RBXM parsing logic using DOMParser
    // For simplicity, let's assume RBXM file is XML-like
    var parser = new DOMParser();
    var xmlDoc = parser.parseFromString(content, 'text/xml');

    // Extract relevant data from the parsed XML
    // For example, assuming the top-level element is ScreenGui
    var screenGuiData = parseScreenGui(xmlDoc);

    return screenGuiData;
}

function parseScreenGui(xmlDoc) {
    // Extract ScreenGui data
    // For simplicity, let's assume ScreenGui has child elements like Frame, TextLabel, etc.
    var screenGuiData = {
        type: 'ScreenGui',
        children: []
    };

    var elements = xmlDoc.getElementsByTagName('ScreenGui')[0].children;

    for (var i = 0; i < elements.length; i++) {
        var elementType = elements[i].tagName;
        var elementData = {
            type: elementType,
            // Extract other relevant data based on your file structure
        };

        screenGuiData.children.push(elementData);
    }

    return screenGuiData;
}

function renderGUI(data, container) {
    // Implement dynamic rendering logic based on the parsed data
    container.innerHTML = ''; // Clear previous content

    var guiElement = document.createElement(data.type);

    for (var i = 0; i < data.children.length; i++) {
        var childData = data.children[i];
        var childElement = document.createElement(childData.type);
        // Set attributes and styles based on childData

        guiElement.appendChild(childElement);
    }

    container.appendChild(guiElement);
}
