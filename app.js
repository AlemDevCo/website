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
                renderScreenGui(screenGui);
            } catch (error) {
                console.error("Error parsing file:", error);
                alert("Error parsing file. Please check if it's a valid RBXM file.");
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

    const screenGuiElement = xmlDoc.getElementsByTagName('ScreenGui')[0];

    if (!screenGuiElement) {
        throw new Error('No ScreenGui element found in the RBXM file.');
    }

    return parseGuiElement(screenGuiElement);
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

function renderScreenGui(screenGui) {
    const screenGuiElement = renderGuiElement(screenGui);
    document.body.appendChild(screenGuiElement);
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
