const JsStore = require("jsstore");

let dbName = "electron_todo_db";

function getDbScheme() {
    let tblTasks = {
        name: "tasks",
        columns: {
            id: { primaryKey: true, autoIncrement: true },
            note: { notNull: true, dataType: "string" },
        }
    }

    let tblTimed = {
      name: "timed",
      columns: {
        id: { primaryKey: true, autoIncrement: true },
        note: { notNull: true, dataType: "string" },
        pick_states: { notNull: true, dataType: "number" },
        pick_time: { notNull: true, dataType: "date_time" },
      },
    };

    let tblImages = {
      name: "imaged",
      columns: {
        id: { primaryKey: true, autoIncrement: true },
        note: { notNull: true, dataType: "string" },
        img_uri: { notNull: true, dataType: "string" },
      },
    };


    let dp = {
      name: dbName,
      tables: [tblTasks, tblTimed, tblImages],
    };

    return dp;
}

let connection = new JsStore.Connection(
  new Worker("node_modules/jsstore/dist/jsstore.worker.js")
);

async function initJsStore() {
    let database = getDbScheme();
    let isDbCreated = await connection.initDb(database);
    if (isDbCreated === true) {
        console.log("db created");
    } else {
        console.log("db opened");
    }
}

initJsStore();

module.exports = connection;