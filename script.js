const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const animationSection = document.getElementById("scrollAnimation");

// IMPORTANT:
// Change this to the total number of frames you have.
const frameCount = 100;

const images = [];
let currentFrame = 0;


// ========================================
// FRAME PATH
// ========================================

function getFramePath(index) {

    // Your files are frame_001.jpg
    // frame_002.jpg
    // frame_003.jpg

    const frameNumber = String(index + 1).padStart(3, "0");

    return `frames/frame_${frameNumber}.jpg`;
}


// ========================================
// LOAD FRAMES
// ========================================

for (let i = 0; i < frameCount; i++) {

    const img = new Image();

    img.src = getFramePath(i);

    img.onload = () => {

        console.log("Loaded:", img.src);

        // Show first frame
        if (i === 0) {
            resizeCanvas();
            drawFrame(0);
        }
    };

    img.onerror = () => {
        console.error("Could not load:", img.src);
    };

    images.push(img);
}


// ========================================
// CANVAS SIZE
// ========================================

function resizeCanvas() {

    const dpr = window.devicePixelRatio || 1;

    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;

    canvas.style.width = window.innerWidth + "px";
    canvas.style.height = window.innerHeight + "px";

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    drawFrame(currentFrame);
}


// ========================================
// DRAW FRAME
// ========================================

function drawFrame(index) {

    const img = images[index];

    if (!img || !img.complete || img.naturalWidth === 0) {
        return;
    }

    const width = window.innerWidth;
    const height = window.innerHeight;

    ctx.clearRect(0, 0, width, height);

    const imageRatio =
        img.naturalWidth / img.naturalHeight;

    const screenRatio =
        width / height;

    let drawWidth;
    let drawHeight;

    if (imageRatio > screenRatio) {

        drawHeight = height;
        drawWidth = height * imageRatio;

    } else {

        drawWidth = width;
        drawHeight = width / imageRatio;
    }

    const x =
        (width - drawWidth) / 2;

    const y =
        (height - drawHeight) / 2;

    ctx.drawImage(
        img,
        x,
        y,
        drawWidth,
        drawHeight
    );
}


// ========================================
// SCROLL → FRAME
// ========================================

function updateAnimation() {

    const rect =
        animationSection.getBoundingClientRect();

    const scrollDistance =
        animationSection.offsetHeight -
        window.innerHeight;

    let progress =
        -rect.top / scrollDistance;

    // Keep progress between 0 and 1
    progress = Math.max(
        0,
        Math.min(1, progress)
    );

    const frameIndex =
        Math.floor(
            progress * (frameCount - 1)
        );

    if (frameIndex !== currentFrame) {

        currentFrame = frameIndex;

        requestAnimationFrame(() => {
            drawFrame(currentFrame);
        });
    }
}


// ========================================
// EVENTS
// ========================================

window.addEventListener(
    "scroll",
    updateAnimation,
    { passive: true }
);

window.addEventListener(
    "resize",
    resizeCanvas
);


// ========================================
// START
// ========================================

resizeCanvas();
updateAnimation();