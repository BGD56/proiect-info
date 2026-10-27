
const tips = [
    "Nu trebuie să faci totul astăzi. Trebuie doar să știi care este următorul pas.",

    "O sarcină clar definită este mai ușor de început decât una vagă.",

    "Lasă puțin spațiu între activități. Pauzele fac și ele parte din plan.",

    "Prioritățile nu sunt lucrurile care fac cel mai mult zgomot, ci cele care contează pentru tine.",

    "Un plan bun nu trebuie să fie perfect. Trebuie să poată fi adaptat."
];

const tipText = document.getElementById("tip-text");
const tipCounter = document.getElementById("tip-counter");

const progressBar = document.getElementById("progress-bar");
const progressValue = document.getElementById("progress-value");
const progressTrack = document.getElementById("progress-track");
const loadingStatus = document.getElementById("loading-status");

let currentTip = 0;
let progress = 0;

const statuses = [
    { limit: 25, text: "Pregătim spațiul tău..." },
    { limit: 55, text: "Organizăm lucrurile..." },
    { limit: 80, text: "Aproape gata..." },
    { limit: 100, text: "Spațiul tău este pregătit." }
];

// Schimbă sfatul la fiecare 5 secunde.
setInterval(() => {
    currentTip = (currentTip + 1) % tips.length;

    tipText.style.opacity = "0";

    setTimeout(() => {
        tipText.textContent = tips[currentTip];
        tipCounter.textContent =
            `SFAT ${String(currentTip + 1).padStart(2, "0")} / ${String(tips.length).padStart(2, "0")}`;

        tipText.style.opacity = "1";
    }, 200);
}, 5000);


const loadingInterval = setInterval(() => {
    if (progress >= 100) {
        clearInterval(loadingInterval);

        loadingStatus.textContent = "Spațiul tău este pregătit.";

        // Așteaptă puțin înainte de a deschide dashboard-ul.
        setTimeout(() => {
            window.location.href = "../index.html";
        }, 500);

        return;
    }

    const remaining = 100 - progress;
    const increment = Math.max(1, Math.ceil(remaining * 0.12));

    progress = Math.min(100, progress + increment);

    progressBar.style.width = `${progress}%`;
    progressValue.textContent = `${progress}%`;

    progressTrack.setAttribute("aria-valuenow", progress);

    const status = statuses.find(item => progress <= item.limit);

    if (status) {
        loadingStatus.textContent = status.text;
    }
}, 350);
