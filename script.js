document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('areciboCanvas');
    const context = canvas.getContext('2d');
    const width = 73;
    const height = 23;
    const scale = 10; // Scale up the size for better visibility
    canvas.width = width * scale;
    canvas.height = height * scale;

    const areciboMessage = `
        00000010101010000000000
00101000001010000000100
10001000100010010110010
10101010101010100100100
00000000000000000000000
00000000000011000000000
00000000001101000000000
00000000001101000000000
00000000010101000000000
00000000011111000000000
00000000000000000000000
11000011100011000011000
10000000000000110010000
11010001100011000011010
11111011111011111011111
00000000000000000000000
00010000000000000000010
00000000000000000000000
00001000000000000000001
11111000000000000011111
00000000000000000000000
11000011000011100011000
10000000100000000010000
11010000110001110011010
11111011111011111011111
00000000000000000000000
00010000001100000000010
00000000001100000000000
00001000001100000000001
11111000001100000011111
00000000001100000000000
00100000000100000000100
00010000001100000001000
00001100001100000010000
00000011000100001100000
00000000001100110000000
00000011000100001100000
00001100001100000010000
00010000001000000001000
00100000001100000000100
01000000001100000000100
01000000000100000001000
00100000001000000010000
00010000000000001100000
00001100000000110000000
00100011101011000000000
00100000001000000000000
00100000111110000000000
00100001011101001011011
00000010011100100111111
10111000011100000110111
00000000010100000111011
00100000010100000111111
00100000010100000110000
00100000110110000000000
00000000000000000000000
00111000001000000000000
00111010100010101010101
00111000000000101010100
00000000000000101000000
00000000111110000000000
00000011111111100000000
00001110000000111000000
00011000000000001100000
00110100000000010110000
01100110000000110011000
01000101000001010001000
01000100100010010001000
00000100010100010000000
00000100001000010000000
00000100000000010000000
00000001001010000000000
01111001111101001111000
    `.replace(/\s+/g, '');

    let zoomLevel = 1;
    let panX = 0;
    let panY = 0;
    let isDragging = false;
    let dragStartX = 0;
    let dragStartY = 0;

    const sections = {
        numbers: [0, 22], // Numbers 1 to 10
        elements: [23, 45], // Atomic numbers of elements
        compounds: [46, 167], // Formulas for chemical compounds of DNA
        dna: [168, 323], // DNA nucleotides and double helix structure
        human: [324, 548], // Human figure, height, and population
        solar_system: [549, 608], // Solar system graphic
        telescope: [609, 1678] // Arecibo telescope graphic
    };

    function drawMessage() {
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.save();
        context.scale(zoomLevel, zoomLevel);
        context.translate(panX, panY);
        context.fillStyle = '#fff';
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const index = y * width + x;
                if (areciboMessage[index] === '1') {
                    context.fillRect(x * scale, y * scale, scale, scale);
                }
            }
        }
        context.restore();
    }

    function animateDrawing() {
        let index = 0;
        context.clearRect(0, 0, canvas.width, canvas.height);
        const interval = setInterval(() => {
            if (index >= areciboMessage.length) {
                clearInterval(interval);
                return;
            }
            const x = (index % width) * scale;
            const y = Math.floor(index / width) * scale;
            if (areciboMessage[index] === '1') {
                context.fillRect(x, y, scale, scale);
            }
            index++;
        }, 10); // Draw each pixel every 10 milliseconds
    }

    function highlightSection(section) {
        const [start, end] = sections[section];
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.save();
        context.scale(zoomLevel, zoomLevel);
        context.translate(panX, panY);
        for (let i = 0; i < areciboMessage.length; i++) {
            const x = (i % width) * scale;
            const y = Math.floor(i / width) * scale;
            if (i >= start && i <= end && areciboMessage[i] === '1') {
                context.fillStyle = 'yellow';
            } else if (areciboMessage[i] === '1') {
                context.fillStyle = '#fff';
            }
            context.fillRect(x, y, scale, scale);
        }
        context.restore();
    }

    canvas.addEventListener('wheel', function(event) {
        if (event.deltaY < 0) {
            zoomLevel *= 1.1;
        } else {
            zoomLevel /= 1.1;
        }
        drawMessage();
    });

    canvas.addEventListener('mousedown', function(event) {
        isDragging = true;
        dragStartX = event.offsetX - panX * zoomLevel;
        dragStartY = event.offsetY - panY * zoomLevel;
        canvas.style.cursor = 'grabbing';
    });

    canvas.addEventListener('mousemove', function(event) {
        if (isDragging) {
            panX = (event.offsetX - dragStartX) / zoomLevel;
            panY = (event.offsetY - dragStartY) / zoomLevel;
            drawMessage();
        }
    });

    canvas.addEventListener('mouseup', function() {
        isDragging = false;
        canvas.style.cursor = 'grab';
    });

    document.querySelectorAll('.highlight').forEach(item => {
        item.addEventListener('mouseover', (event) => {
            highlightSection(event.target.dataset.section);
        });
        item.addEventListener('mouseout', drawMessage);
    });

    drawMessage();
    animateDrawing();
});
