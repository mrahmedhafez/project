const { ipcRenderer } = require("electron");

const form = document.querySelector("form");

form.addEventListener("submit", (e) => {
    e.preventDefault();
    const input = document.getElementById("task").value;
    console.log(`${input} is sent`);
    ipcRenderer.send("add-normal-task", input);
})