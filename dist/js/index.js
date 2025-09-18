const btnsummit = document.getElementById("summit-tarea");
const inputtarea = document.getElementById("input-tarea");
const listatarea = document.getElementById("list-tareas");

// Elementos de la barra de usuario
const userNameElement = document.getElementById("user-name");
const userEmailElement = document.getElementById("user-email");
const logoutBtn = document.getElementById("logout-btn");

// Obtener la ruta base para GitHub Pages
const basePath = window.location.pathname.includes("/dfg-game/")
  ? "/dfg-game/"
  : "/";

// Función para cargar la información del usuario
function cargarInformacionUsuario() {
  const userData = JSON.parse(localStorage.getItem("user"));

  if (userData) {
    userNameElement.textContent = userData.name || "Usuario";
    userEmailElement.textContent = userData.email || "";
  } else {
    // Si no hay usuario, redirigir al login
    window.location.href = basePath + "login.html";
  }
}

// Función para cerrar sesión
function cerrarSesion() {
  localStorage.removeItem("user");
  localStorage.removeItem("tareas"); // Opcional: limpiar tareas también
  window.location.href = basePath + "login.html";
}

// Event listener para el botón de cerrar sesión
if (logoutBtn) {
  logoutBtn.addEventListener("click", cerrarSesion);
}

// Verificar autenticación al cargar la página
document.addEventListener("DOMContentLoaded", function () {
  cargarInformacionUsuario();
  mostrarTareas();
});

// Recuperamos las tareas cuando carga la página
function mostrarTareas() {
  try {
    const tareas = JSON.parse(localStorage.getItem("tareas") || "[]");

    listatarea.innerHTML = "";

    if (tareas.length === 0) {
      listatarea.innerHTML =
        '<div class="no-tareas">No hay tareas. ¡Agrega una nueva!</div>';
      return;
    }

    tareas.forEach((tarea) => {
      agregarTareaDOM(tarea);
    });
  } catch (error) {
    listatarea.innerHTML =
      '<div class="no-tareas">Error al cargar tareas</div>';
  }
}

btnsummit.addEventListener("click", function () {
  const tarea = inputtarea.value;

  if (tarea === "") {
    return;
  }

  const nuevaTarea = {
    id: Date.now(), // ID único basado en timestamp
    texto: tarea,
    completada: false,
  };

  guardarTareaLocal(nuevaTarea);
  inputtarea.value = "";
});

// También permitir agregar tareas con la tecla Enter
inputtarea.addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    btnsummit.click();
  }
});

// Función para guardar tarea en localStorage
function guardarTareaLocal(tareaObj) {
  try {
    // Eliminar el mensaje de "No hay tareas" si existe
    const noTareasMsg = listatarea.querySelector(".no-tareas");
    if (noTareasMsg) {
      noTareasMsg.remove();
    }

    // Obtener tareas existentes
    const tareas = JSON.parse(localStorage.getItem("tareas") || "[]");

    // Agregar nueva tarea
    tareas.push(tareaObj);

    // Guardar en localStorage
    localStorage.setItem("tareas", JSON.stringify(tareas));

    agregarTareaDOM(tareaObj);
  } catch (error) {
    alert("Error al guardar tarea");
  }
}

// Función para actualizar el estado de una tarea
function actualizarTareaLocal(id, completada) {
  try {
    const tareas = JSON.parse(localStorage.getItem("tareas") || "[]");

    // Encontrar y actualizar la tarea
    const tareaIndex = tareas.findIndex((t) => t.id === id);
    if (tareaIndex !== -1) {
      tareas[tareaIndex].completada = completada;
      localStorage.setItem("tareas", JSON.stringify(tareas));
    }
  } catch (error) {
    console.error("Error al actualizar tarea:", error);
  }
}

// Función para eliminar una tarea
function eliminarTareaLocal(id) {
  try {
    const tareas = JSON.parse(localStorage.getItem("tareas") || "[]");

    // Filtrar la tarea a eliminar
    const nuevasTareas = tareas.filter((t) => t.id !== id);

    // Guardar en localStorage
    localStorage.setItem("tareas", JSON.stringify(nuevasTareas));
  } catch (error) {
    console.error("Error al eliminar tarea:", error);
  }
}

function agregarTareaDOM(tareaObj) {
  const li = document.createElement("li");
  li.classList.add("tarea");
  li.dataset.id = tareaObj.id;

  const textoTarea = document.createElement("span");
  textoTarea.classList.add("list-texto-tarea");
  textoTarea.textContent = tareaObj.texto;
  li.appendChild(textoTarea);

  if (tareaObj.completada) {
    li.classList.add("completada");
  }

  // Botón de completar
  const btnCompletar = document.createElement("button");
  btnCompletar.classList.add("boton-completar");
  btnCompletar.textContent = "✅";
  btnCompletar.addEventListener("click", function () {
    li.classList.toggle("completada");
    const nuevaEstado = li.classList.contains("completada");
    actualizarTareaLocal(tareaObj.id, nuevaEstado);
  });

  // Botón de eliminar
  const boton = document.createElement("button");
  boton.classList.add("btn-eliminar");
  boton.textContent = "🗑️";
  boton.addEventListener("click", function () {
    eliminarTareaLocal(tareaObj.id);
    li.remove();

    // Si no quedan tareas, mostrar el mensaje
    if (listatarea.children.length === 0) {
      listatarea.innerHTML =
        '<div class="no-tareas">No hay tareas. ¡Agrega una nueva!</div>';
    }
  });

  li.appendChild(btnCompletar);
  li.appendChild(boton);
  listatarea.appendChild(li);
}
