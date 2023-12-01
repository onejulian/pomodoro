window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
});

const timerDisplay = document.getElementById('timer');
const startButton = document.getElementById('start');
const resetButton = document.getElementById('reset');
const stopButton = document.getElementById('stop');

let interval;
let isTimerRunning = false;
let workMinutes = 25;
let breakMinutes = 5;
let seconds = 0;
let isWorkTime = true;

function updateTimerDisplay(minutes, seconds) {
    timerDisplay.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

function toggleStartButton(disabled) {
    startButton.disabled = disabled;
    startButton.classList.toggle('bg-gray-500', disabled);
    startButton.classList.toggle('bg-green-500', !disabled);
    startButton.classList.toggle('hover:bg-gray-700', disabled);
    startButton.classList.toggle('hover:bg-green-700', !disabled);
}

function startTimer() {
    if (isTimerRunning) return;
    isTimerRunning = true;
    toggleStartButton(true);
    interval = setInterval(() => {
        if (seconds === 0) {
            if (isWorkTime && workMinutes === 0) {
                isWorkTime = false;
                workMinutes = 25;
                seconds = 60;
                notifyUser('Tiempo de descanso!');
            } else if (!isWorkTime && breakMinutes === 0) {
                isWorkTime = true;
                breakMinutes = 5;
                seconds = 60;
                notifyUser('Volver al trabajo!');
            }
            seconds = 60;
            isWorkTime ? workMinutes-- : breakMinutes--;
        }
        seconds--;
        updateTimerDisplay(isWorkTime ? workMinutes : breakMinutes, seconds);
    }, 1000);
}

function stopTimer() {
    clearInterval(interval);
    isTimerRunning = false;
    toggleStartButton(false);
}

function resetTimer() {
    stopTimer();
    workMinutes = 25;
    breakMinutes = 5;
    seconds = 0;
    isWorkTime = true;
    updateTimerDisplay(workMinutes, seconds);
    startTimer();
}

function notifyUser(message) {
    if (Notification.permission === 'granted') {
        new Notification(message);
    } else if (Notification.permission !== 'denied') {
        Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
                new Notification(message);
            }
        });
    }
}

startButton.addEventListener('click', startTimer);
resetButton.addEventListener('click', resetTimer);
stopButton.addEventListener('click', stopTimer);

updateTimerDisplay(workMinutes, seconds);
