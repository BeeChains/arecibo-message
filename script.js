document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('areciboCanvas');
    const context = canvas.getContext('2d');
    const width = 73;
    const height = 23;
    const scale = 10; // Scale up the size for better visibility
    canvas.width = width * scale;
    canvas.height = height * scale;

    const areciboMessage = `
        0000001010...101011111000111000111000111000111000111000111000111000111000111
    `.replace(/\s+/g, '');

    let zoomLevel = 1;
    let panX = 0;
    let panY = 0;
    let isDragging = false;
    let dragStartX = 0;
    let dragStartY = 0;

    const sections = {
        numbers: [0, 20], // Example ranges
        elements: [21, 40],
        dna: [41, 100],
        nucleotides: [101, 200],
        human: [201, 300],
        solar_system: [301, 400],
        telescope: [401, 500]
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
        context.fillStyle = '#fff';
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
