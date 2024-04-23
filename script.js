import { gsap } from "gsap";

const screenWidth = window.innerWidth;
const screenHeight = window.innerHeight;

const hexagonWidth = 84;
const hexagonHeight = 100; 
const halfWidth = hexagonWidth / 2;
const quarterHeight = hexagonHeight / 4;

const frameWidth = 88; // Width of a hexagon
const frameHeight = 100; // Height of a hexagon based on staggering
const staggerAdjustment = frameHeight - (3 * quarterHeight + (frameWidth - hexagonHeight));
const rows = Math.ceil((Math.floor(screenHeight / staggerAdjustment)) * 1.2)
const cols = Math.ceil((Math.floor(screenWidth / frameWidth)) * 1.2)

document.addEventListener('DOMContentLoaded', function() {
    const initialSettings = {
        frameWidth: 88,
        frameHeight: 100,
        hexagonWidth: 84,
        hexagonHeight: 100,
        duration: 0.05,
        staggerAmount: 0.5,
        scale: 1.1,
        ease: "power4.out"
    };

    console.log("Initial Settings:", initialSettings);
    addHexagons(initialSettings);
    startAnimation(initialSettings);
    
    const applySettingsButton = document.getElementById('applySettings')
    applySettingsButton.addEventListener('click', updateSettings)
    
})

function addHexagons(settings) {
    const { frameWidth, frameHeight, hexagonWidth, hexagonHeight } = settings;
    const clipPath = document.querySelector("#hexagon-clip");
    const svgNS = "http://www.w3.org/2000/svg";
    clipPath.innerHTML = '';  // Clear existing content
    
    
    const layerBoundaries = initializeLayerBoundaries(rows);
    const xOffset = frameWidth / 2; 
    const yOffset =  frameHeight - (3 * quarterHeight + (frameWidth - hexagonHeight)); // Vertical offset per row

    for (let row = 0; row < rows; row++) {
        let yPosition = row * (frameHeight - (frameHeight - (3 * quarterHeight) - (frameWidth - hexagonWidth))); // Apply vertical staggering
        let isEvenRow = row % 2 === 0;

        for (let col = 0; col < cols; col++) {
            let xPosition = col * frameWidth + (isEvenRow ? xOffset : 0); // Apply horizontal offset to even rows

            // Determine the layer class based on the position
            let layerClass = determineLayerClass(col, row, cols, rows, layerBoundaries);

            // Points for the current hexagon
            let points = generatePointsForHexagon(xPosition, yPosition, hexagonWidth, hexagonHeight);

            // Create polygon and append to clipPath
            let polygon = document.createElementNS(svgNS, "polygon");
            polygon.setAttribute("points", points);
            polygon.classList.add(layerClass); // Add the determined layer class
            clipPath.appendChild(polygon);
        }
    }
    
}

function initializeLayerBoundaries(rows) {
    const numberOfLayers = Math.floor((rows - 1) / 2); // Calculate the number of layers
    const layerBoundaries = [];

    for (let i = 1; i <= numberOfLayers; i++) {
        layerBoundaries.push(i * frameWidth); // Each layer boundary increases by frameWidth
    }

    return layerBoundaries;
}

function determineLayerClass(col, row, cols, rows, layerBoundaries) {
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;

    // Calculate the horizontal and vertical positions of the hexagon grid
    const gridWidth = cols * frameWidth;  // Total width of the grid
    const gridHeight = rows * (frameHeight - quarterHeight); // Total height of the grid, accounting for staggering

    // Find the center positions of the grid on the screen
    const gridCenterX = (screenWidth - gridWidth) / 2 + gridWidth / 2;
    const gridCenterY = (screenHeight - gridHeight) / 2 + gridHeight / 2;

    // Determine the column and row of the center hexagon based on the center of the screen
    const centerCol = Math.round(gridCenterX / frameWidth);
    const centerRow = Math.round(gridCenterY / (frameHeight - quarterHeight));

    // Calculate the horizontal and vertical distances based on hexagon grid geometry
    let xDistance = Math.abs(col - centerCol) * frameWidth;
    let yDistance = Math.abs(row - centerRow) * (frameHeight - quarterHeight); 

    // Calculate the Euclidean distance for a hexagonal grid
    let distance = Math.sqrt(xDistance * xDistance + yDistance * yDistance);

    // Determine layer by comparing distance to boundaries
    for (let i = 0; i < layerBoundaries.length; i++) {
        if (distance <= layerBoundaries[i]) {
            return `layer-${i + 1}`;  // Layer names are "layer-1", "layer-2", etc.
        }
    }

    // If no boundary is met, assign to the outermost layer
    return `layer-${layerBoundaries.length + 1}`;
}

function generatePointsForHexagon(x, y, hexagonWidth, hexagonHeight) {
    let halfWidth = hexagonWidth / 2;
    let quarterHeight = hexagonHeight / 4;
    // Generate points for hexagon based on x and y positions
    // This assumes all hexagons are uniform and aligned properly in rows
    return `
        ${x},${y} 
        ${x + halfWidth},${y + quarterHeight} 
        ${x + halfWidth},${y + (3 * quarterHeight)} 
        ${x},${y + hexagonHeight} 
        ${x - halfWidth},${y + (3 * quarterHeight)} 
        ${x - halfWidth},${y + quarterHeight}
    `;
}

// const firstLayer = document.querySelector(".first-layer")
// const secondLayer = document.querySelector(".second-layer")
// const thirdLayer = document.querySelector(".third-layer")
// const fourthLayer = document.querySelector(".fourth-layer")
// const fifthLayer = document.querySelector(".fifth-layer")

// function startAnimation() {
//     const tl = gsap.timeline

//     gsap.fromTo('polygon', {
//         scale: 0
//     },
//     {
//         scale: 1,
//         duration: 0.05,
//         ease: "power4.out",
//         transformOrigin: "center center",
//         stagger: {
//             each: 0.01,
//             from: 'center',
//         }
//     })
// }

function startAnimation(settings) {
    console.log("Starting animation with settings:", settings);
    const { duration, staggerAmount, ease, scale } = settings;

    const numberOfLayers = initializeLayerBoundaries(rows).length;  // Get the number of layers from your boundaries initialization
    const layers = Array.from({ length: numberOfLayers }, (_, i) => `layer-${i + 1}`);
    const timeline = gsap.timeline({ 
        defaults: { 
            duration: duration, 
            ease: ease,
        },
        // onComplete: scaleUpAllPolygons,
    });
    // const totalDuration = 0.2;

    gsap.set('polygon', {
        scale: 0,
    })

    layers.forEach((layer, index) => {
        const elements = document.querySelectorAll(`#hexagon-clip polygon.${layer}`);
        const staggerDuration = staggerAmount / elements.length; // Duration per element

        timeline.fromTo(elements, {scale: 0}, {
            scale: scale,
            stagger: {
                amount: staggerAmount - staggerDuration, // Total stagger amount for the entire layer
                from: "random"
            },
            transformOrigin: "center center",
            ease: ease,
            onComplete: () => console.log(`${layer} animation completed`)
        }, index * staggerAmount); // Offset each layer's start by the total duration of the previous layer
    });
}

// function scaleUpAllPolygons() {
//     // Select all polygons and animate scaling to 1.1
//     gsap.to('polygon', {
//         scale: 1.1,
//         duration: 0.2,  // Adjust duration as needed
//         ease: "power4.out",
//         transformOrigin: "center center"
//     });
// }

function updateSettings() {
    const frameWidth = parseFloat(document.getElementById('frameWidth').value);
    const frameHeight = parseFloat(document.getElementById('frameHeight').value);
    const hexagonWidth = parseFloat(document.getElementById('hexagonWidth').value);
    const hexagonHeight = parseFloat(document.getElementById('hexagonHeight').value);
    const duration = parseFloat(document.getElementById('duration').value);
    const staggerAmount = parseFloat(document.getElementById('staggerAmount').value);
    const scale = parseFloat(document.getElementById('scale').value);
    const ease = document.getElementById('ease').value;

    // Assuming you have global variables or a way to update these in your actual function:
    const newSettings = {
        frameWidth,
        frameHeight,
        hexagonWidth,
        hexagonHeight,
        duration,
        staggerAmount,
        scale,
        ease
    };

    console.log("Updating settings:", newSettings);

    // Clear existing hexagons
    document.querySelector('#hexagon-clip').innerHTML = '';

    // Recreate hexagons and reinitialize animation with new settings
    addHexagons(newSettings);  // Make sure this function uses settings from `window.myAnimationSettings`
    startAnimation(newSettings); // Make sure this function also uses settings from `window.myAnimationSettings`
}