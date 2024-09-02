const { ipcRenderer } = require("electron");
const connection = require("./connection");

let newTimed = document.querySelector(".todo--timed .add-new-task");
newTimed.addEventListener("click", () => {
    ipcRenderer.send("new-timed")
})

ipcRenderer.on("add-timed-note", (e, note, notificationTime) => {
    addTimedTask(note, notificationTime);
});

function addTimedTask(note, notificationTime) {
  connection.insert({
    into: "timed",
    values: [
      {
        note: note,
        pick_states: 0,
        pick_time: notificationTime,
      },
    ],
  }).then(() => showTimed())
}

function deleteTimedTask(taskId) {
    return connection.remove({
        from: "timed",
        where: {
            id: taskId
        }
    }).then(() => showTimed());
}

function updateTimedTask(taskId, taskValue) {
  connection
    .update({
      in: "timed",
      where: {
        id: taskId,
      },
      set: {
        note: taskValue,
      },
    })
    .then(() => showTimed());
}

function showTimed() {
    let clearTimedBTN = document.querySelector(".todo--timed .clear-all")
    let timedList = document.querySelector(".todo--timed__list")
    timedList.innerHTML = ""

    connection.select({
        from: "timed",
    }).then((tasks) => {
        if (tasks.length === 0) {
          timedList.innerHTML = "<li class='empty-list'>لا توجد مهام </li>";
              clearTimedBTN.classList.remove("clear-all--show");
        } else {
              clearTimedBTN.classList.add("clear-all--show");
            clearTimedBTN.addEventListener("click", () => {
                return connection.remove({
                    from: "timed"
                }).then(() => showTimed())
            });
            for (let task of tasks) {   
                let listItem = document.createElement("li"),
                  taskInput = document.createElement("input"),
                  timeHolder = document.createElement("div"),
                  deleteBTN = document.createElement("button"),
                  buttonsHolder = document.createElement("div"),
                  updateBTN = document.createElement("button"),
                  exportBTN = document.createElement("button");
                
                buttonsHolder.classList.add("buttons-holder");

                timeHolder.classList.add("time-holder");

                taskInput.value = task.note;
                
                if (task.pick_states === 1) {
                    let text = document.createTextNode(
                      "جاري التنبيه في الساعه" +
                        task.pick_time.toLocaleTimeString()
                    );
                    timeHolder.appendChild(text);
                } else {
                    let text = document.createTextNode(
                      "يتم التنبيه في الساعه " +
                        task.pick_time.toLocaleTimeString()
                    );
                    timeHolder.appendChild(text);
                }

                deleteBTN.innerHTML = "حذف <i class='fas fa-trash-alt'></i > ";
                deleteBTN.addEventListener("click", () => {
                    deleteTimedTask(task.id);
                })
                updateBTN.innerHTML =
                  "تحديث <i class='fas fa-cloud-upload-alt'></i >";
                updateBTN.addEventListener("click", () => {
                  updateTimedTask(task.id, taskInput.value);
                });
                exportBTN.innerHTML =
                  "تصدير<i class='fas fa-file-export'></i >";
                exportBTN.addEventListener("click", () => {
                  ipcRenderer.send("create-txt", task.note)
                });

                let checkInterval = setInterval(() => {
                    let currentDate = new Date();
                    if (task.pick_time.toString() === currentDate.toString()) {
                        connection.update({
                            in: "timed",
                            where: {
                                id: task.id
                            },
                            set: {
                                pick_states: 1
                            }
                        }).then(() => showTimed())

                      ipcRenderer.send("notify", task.note);
                      clearInterval(checkInterval);
                    }
                }, 1000)

                buttonsHolder.appendChild(deleteBTN);
                buttonsHolder.appendChild(updateBTN);
                buttonsHolder.appendChild(exportBTN);
                listItem.appendChild(taskInput);
                listItem.appendChild(timeHolder);
                listItem.appendChild(buttonsHolder);
                timedList.appendChild(listItem);
            }
        }
    })

}


showTimed();