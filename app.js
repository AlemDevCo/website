// app.js

function handleFile() {
    const input = document.getElementById('fileInput');
    const file = input.files[0];

    if (file) {
        const reader = new FileReader();

        reader.onload = function (e) {
            const content = e.target.result;

            try {
                const placeStructure = parseRBX(content);

                // Display the entire place structure (replace this with your actual rendering logic)
                console.log("Parsed Place Structure:", placeStructure);
            } catch (error) {
                console.error("Error parsing file:", error);
                alert("Error parsing file. Please check if it's a valid RBXM or RBXL file.");
            }
        };

        reader.readAsText(file);
    } else {
        alert('Please select a file.');
    }
}

function parseRBX(content) {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(content, 'text/xml');
    
    const placeElement = xmlDoc.getElementsByTagName('Roblox')[0] || xmlDoc.getElementsByTagName('Place')[0];

    if (!placeElement) {
        throw new Error('No Roblox or Place element found in the RBXM/RBXL file.');
    }

    return parsePlaceElement(placeElement);
}

function parsePlaceElement(element) {
    const placeStructure = {
        type: element.tagName,
        attributes: {},
        children: [],
    };

    // Extract attributes
    for (let i = 0; i < element.attributes.length; i++) {
        const attribute = element.attributes[i];
        placeStructure.attributes[attribute.name] = attribute.value;
    }

    // Recursively parse children elements
    for (let i = 0; i < element.children.length; i++) {
        const child = element.children[i];
        const childElement = parsePlaceElement(child);
        placeStructure.children.push(childElement);
    }

    return placeStructure;
}
