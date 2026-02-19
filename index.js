// 1. Hent DOM-elementer
const form = document.querySelector(".add_task");
const list = document.querySelector(".tasks");
const doneList = document.querySelector(".done_tasks");

// 2. Hent tasks fra localStorage
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

tasks = tasks.map((task) => {
  if (!task.id) {
    return { ...task, id: Date.now() + Math.random() };
  }
  return task;
});

// Gem de opdaterede tasks tilbage i localStorage
localStorage.setItem("tasks", JSON.stringify(tasks));

// 3. Tilføj event listeners
form.addEventListener("submit", handleAddTask);
list.addEventListener("click", toggleDone);
doneList.addEventListener("click", toggleDone);

// 4. Funktioner:

//Den stopper siden fra at reloade, henter teksten fra inputfeltet,
// laver en ny task, gemmer den i localStorage,
// opdaterer listen og tømmer inputfeltet.
function handleAddTask(event) {
  event.preventDefault(); //Får siden til ikke at refreshe.
  const text = form.querySelector("[name=task]").value;

  //Når der bliver tilføjet en task i boksen så bliver den tasks's done sat til false.
  const newTask = {
    id: Date.now(),
    text,
    done: false,
    createdAt: new Date().toLocaleString(), //Tilføjer datoen for oprettelse af task.
  };

  tasks.push(newTask);
  localStorage.setItem("tasks", JSON.stringify(tasks));

  renderAll();
  form.reset();
}

//PopulateList tager en liste af tasks og laver dem om til HTML <li> elementer,
//og sætter dem ind i din <ul> på siden.
function populateList(tasksToShow = [], list) {
  list.innerHTML = tasksToShow
    .map((task) => {
      return ` <li> 
      <div class="task-content"> <input type="checkbox" data-id="${task.id}" 
      id="task${task.id}" ${task.done ? "checked" : ""}/> 
      <label for="task${task.id}">${task.text}</label> 
      </div> 
      <span class="timestamp">${task.createdAt || ""}</span> 
      <button class="delete" data-id="${task.id}">X</button> </li> `;
    })
    .join("");
}

//Done knap og slet knap - den aktion der sker når man klikker på disse knapper.
function toggleDone(e) {
  // Hvis man klikker på checkbox → toggle done
  if (e.target.matches("input")) {
    const id = Number(e.target.dataset.id);
    const task = tasks.find((t) => t.id === id);
    task.done = !task.done;
    localStorage.setItem("tasks", JSON.stringify(tasks));
    renderAll();
    return;
  }

  // Hvis man klikker på delete-knappen → slet task
  if (e.target.matches("button.delete")) {
    const id = Number(e.target.dataset.id);
    tasks = tasks.filter((t) => t.id !== id);
    localStorage.setItem("tasks", JSON.stringify(tasks));
    renderAll();
  }
}

//Denne funktion tilføjer antal af to do og antal af done til henholdsvis hver liste.
function updateCounts() {
  const activeTasks = tasks.filter((task) => !task.done);
  const completedTasks = tasks.filter((task) => task.done);
  document.querySelector(".todo-count").textContent = `${activeTasks.length} task(s)`;
  document.querySelector(".done-count").textContent = `${completedTasks.length} done`;
}

//renderAll opdatere listerne
function renderAll() {
  const activeTasks = tasks.filter((task) => !task.done);
  const completedTasks = tasks.filter((task) => task.done);
  populateList(activeTasks, list);
  populateList(completedTasks, doneList);
  updateCounts(); // opdatere antal af to do antal og done antal
}

renderAll();
