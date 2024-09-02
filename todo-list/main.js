const { app, BrowserWindow, Menu, ipcMain , dialog, Notification, Tray} = require("electron");
const path = require("path");
const fs = require("fs");
const appPath = app.getPath("userData");

let mainWindow;
let addWindow;
let addTimedWindow;
let addImagedWindow;
let tray = null

process.env.NODE_ENV ="production"

const mainMenuTemplate = [
  {
    label: "القائمة",
    submenu: [
      {
        label: "أضافة مهمة",
        click() {
          initAddWindow();
        },
      },
      {
        label: "اضافه مهمه مؤقته",
        click() {
          createTimedWindow();
        },
      },
      {
        label: "اضافه مهمه مع صوره",
        click() {
          createImagedWindow();
        }
      },
      {
        label: "خروج",
        click() {
          app.quit();
        },
        accelerator: process.platform == "darwin" ? "Cmd+Q" : "Ctrl+Q",
      },
    ],
  },

];

if (process.platform === "darwin") {
  mainMenuTemplate.unshift({});
}

if (process.env.NODE_ENV !== "production") {
  mainMenuTemplate.push({
    label: "أدوات المطور",
    submenu: [
      {
        label: "فتح و اغلاق ادوات المطور",
        accelerator: process.platform === "darwin" ? "Cmd+D" : "Ctrl+D",
        click() {
          mainWindow.toggleDevTools();
        },
      },
      {
        label: "أعادة تحميل التطبيق",
        role: "reload",
      },
    ],
  });
}

function initAddWindow() {
    if (addWindow) {
       addWindow.focus();
       return;
    }
  addWindow = new BrowserWindow({
    width: 400,
    height: 250,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

    addWindow.loadFile("./views/normalTask.html");
    addWindow.on("closed", () => {
        addWindow = null;
    })

    addWindow.removeMenu();
}

function createTimedWindow() {
  addTimedWindow = new BrowserWindow({
    width: 400,
    height: 400,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  addTimedWindow.loadFile(path.join(__dirname, "./views/timedTask.html"));

  addTimedWindow.on("closed", () => {
    addTimedWindow = null;
  });

  addTimedWindow.removeMenu();
}

function createImagedWindow() {
  addImagedWindow  = new BrowserWindow({
    width: 400,
    height: 420,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  addImagedWindow.loadFile("./views/imagedTask.html");

    addImagedWindow.on("closed", () => {
      addImagedWindow = null;
    });
  
    addImagedWindow.removeMenu();

}

app.on("ready", () => {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 700,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  mainWindow.loadFile("index.html");

  const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
  Menu.setApplicationMenu(mainMenu);

  mainWindow.on("minimize", (event) => {
    event.preventDefault()
    mainWindow.hide();
    tray = createTray();
  })

  mainWindow.on("closed", () => {
    app.quit();
  });

  mainWindow.on("restore", (event) => {
    mainWindow.show();
    tray.destroy()
  });
});

function createTray() {
  let iconPath = path.join(__dirname, "./assets/images/icon.png");
  let appIcon = new Tray(iconPath)

  const contextMenu = Menu.buildFromTemplate(iconMenuTemplate)
  appIcon.on("double-click", (event) => {
    mainWindow.show()
  })

  appIcon.setToolTip("تطبيق اداره المهام")
  appIcon.setContextMenu(contextMenu);
  return appIcon
}

const iconMenuTemplate = [
  {
    label: "فتح",
    click() {
      mainWindow.show();
    },
  },
  {
    label: "اغلاق",
    click() {
      app.quit();
    },
  },
];

ipcMain.on("add-normal-task", (e, task) => {
    mainWindow.webContents.send("add-normal-task", task);
    if (addWindow) {
        addWindow.close();
    }
})

ipcMain.on("create-txt", (e, note) => {
    let dest = Date.now() + "-task.txt";
    dialog.showSaveDialog({
        title: "اختار مكان حفظ الملف",
        defaultPath: path.join(__dirname,  dest),
        buttonLabel: "Save",
        filters: [
            {
                name: "Text Files",
                extensions: ["txt"]
            }
        ]
    }).then(file => {
        if (!file.canceled) {
            fs.writeFile(file.filePath.toString(), note, (err) => {
                if (err) throw err;
            })
        }
    }).catch(err => {
        console.log(err)
    })
})

ipcMain.on("new-normal", () => {
    initAddWindow();
})

ipcMain.on("add-timed-note", (e, note, notificationTime) => {
    mainWindow.webContents.send("add-timed-note", note, notificationTime);

        if (addTimedWindow) {
          addTimedWindow.close();
        }
});

ipcMain.on("notify", (e, taskValue) => {
    const notification = new Notification({
      title: "لديك تنبيه من مهامك",
      body: taskValue,
      icon: path.join(__dirname, "./assets/images/icon.png"),
    });

    notification.show();
});

ipcMain.on("new-timed", () => {
  createTimedWindow()
})

ipcMain.on("upload-image", (event) => {
  dialog.showOpenDialog({
    properties: ["openFile"],
    filters: [
      {name: "Images", extensions: ["jpg", "png", "gif"]}
    ]
  }).then(result => {
      event.sender.send("open-file", result.filePaths, appPath);
  })
})

ipcMain.on("add-imaged-task", (e, note, imgUrl) => {
  mainWindow.webContents.send("add-imaged-task", note, imgUrl)
  addImagedWindow.close();
});

ipcMain.on("new-imaged", () => {
  createImagedWindow();
});