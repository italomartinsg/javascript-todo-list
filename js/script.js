const form = document.querySelector("form");
const input = document.querySelector(".texto");
const ulTask = document.querySelector(".task-list");

//modelo de objetos para teste
// {id: 1, texto: 'JS',concluida: false}

const taskList = [
  { id: 1, texto: "JavaScript", concluida: false },
  { id: 2, texto: "HTML", concluida: false },
  { id: 3, texto: "CSS", concluida: false },
];
function gerarId(taskList) {
  const maiorID = taskList.reduce((acumulador, atual) => {
    if (atual.id > acumulador) {
      acumulador = atual.id;
    }
    return acumulador;
  }, 0);

  return maiorID + 1;
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const inputValue = input.value.trim();

  if (inputValue) {
    const task = {
      id: gerarId(taskList),
      texto: inputValue,
      concluida: false,
    };

    taskList.push(task);
    renderizarTarefas(taskList);
    console.log(taskList);
  } else {
    console.log("texto inválido, entrando no return");
    return;
  }
});

function renderizarTarefas(taskList) {
  ulTask.textContent = "";
  taskList.forEach((task) => {
    const newLi = document.createElement("li");
    newLi.textContent = task.texto;
    ulTask.appendChild(newLi);
  });
}

renderizarTarefas(taskList);
