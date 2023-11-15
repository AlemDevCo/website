function handleFile() {
    const input = document.getElementById('fileInput');
    const file = input.files[0];

    if (file) {
        const reader = new FileReader();

        reader.onload = function (e) {
            const content = e.target.result;

            try {
                const screenGui = parseRBXMXML(content);

                // Display the entire ScreenGui structure (replace this with your actual rendering logic)
                const screenGuiElement = renderGuiElement(screenGui);
                document.body.appendChild(screenGuiElement);
            } catch (error) {
                console.error("Error parsing file:", error);
                alert(`Error parsing file: ${error.message}`);
            }
        };

        reader.readAsText(file);
    } else {
        alert('Please select a file.');
    }
}

function parseRBXMXML(content) {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(content, 'text/xml');

    // Find the first ScreenGui element
    const screenGuiElement = findScreenGuiElement(xmlDoc);

    // If ScreenGui not found, create a new one
    if (!screenGuiElement) {
        const newScreenGui = xmlDoc.createElement('ScreenGui');
        xmlDoc.documentElement.appendChild(newScreenGui);
        return parseGuiElement(newScreenGui);
    }

    return parseGuiElement(screenGuiElement);
}

function findScreenGuiElement(element) {
    // Check if the current element is a ScreenGui
    if (element.tagName === 'ScreenGui') {
        return element;
    }

    // Recursively search for ScreenGui in children
    for (let i = 0; i < element.children.length; i++) {
        const childScreenGui = findScreenGuiElement(element.children[i]);
        if (childScreenGui) {
            return childScreenGui;
        }
    }

    return null;
}

function parseGuiElement(element) {
    const guiElement = {
        type: element.tagName,
        attributes: {},
        children: [],
    };

    // Extract attributes
    for (let i = 0; i < element.attributes.length; i++) {
        const attribute = element.attributes[i];
        guiElement.attributes[attribute.name] = attribute.value;
    }

    // Recursively parse children elements
    for (let i = 0; i < element.children.length; i++) {
        const child = element.children[i];
        const childElement = parseGuiElement(child);
        guiElement.children.push(childElement);
    }

    return guiElement;
}

function renderGuiElement(guiElement) {
    const element = document.createElement(guiElement.type);

    // Set attributes
    for (const [key, value] of Object.entries(guiElement.attributes)) {
        element.setAttribute(key, value);
    }

    // Recursively render children
    guiElement.children.forEach(child => {
        const childElement = renderGuiElement(child);
        element.appendChild(childElement);
    });

    return element;
}
