const { ipcRenderer } = require("electron");

const form = document.querySelector("form");

form.addEventListener("submit", (e) => {
    e.preventDefault();
    let note = document.querySelector(".note").value,
        pickedHours = document.querySelector(".pick-hours").value * 3_600_000,
        pickedMinutes = document.querySelector(".pick-minutes").value * 60_000,
        notificationTime = Date.now();

    notificationTime += pickedHours + pickedMinutes;

    notificationTime = new Date(notificationTime);
    ipcRenderer.send("add-timed-note", note, notificationTime);
});