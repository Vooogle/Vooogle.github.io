document.getElementById('imageUploader').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const image = document.getElementById('uploadedImage');
            image.src = e.target.result;
            image.style.display = 'block';
        };
        reader.readAsDataURL(file);
    }
});

document.getElementById('uploadedImage').addEventListener('click', function(event) {
    const container = document.getElementById('imageContainer');
    const image = event.target;
    const explosion = document.getElementById('explosionGif');

    const containerWidth = container.offsetWidth;
    const containerHeight = container.offsetHeight;
    const imageWidth = image.offsetWidth;
    const imageHeight = image.offsetHeight;

    const randomX = Math.floor(Math.random() * (containerWidth - imageWidth));
    const randomY = Math.floor(Math.random() * (containerHeight - imageHeight));

    // Move the image to a random position
    image.style.left = `${randomX}px`;
    image.style.top = `${randomY}px`;

    // Display the explosion GIF at the image's current position
    explosion.style.left = `${image.style.left}`;
    explosion.style.top = `${image.style.top}`;
    explosion.style.display = 'block';

    // Hide the explosion GIF after a short duration (e.g., 1 second)
    setTimeout(() => {
        explosion.style.display = 'none';
    }, 1000);
});