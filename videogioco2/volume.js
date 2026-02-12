const slider = document.getElementById('volumeSlider');
const display = document.getElementById('volumeValue');


const savedVolume = localStorage.getItem('gameVolume') || 25;
slider.value = savedVolume;
display.innerText = savedVolume;


slider.addEventListener('input', () => {
    const value = slider.value;
    display.innerText = value;
    
    localStorage.setItem('gameVolume', value);
});