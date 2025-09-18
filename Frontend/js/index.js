const btnsummit = document.getElementById("summit-tarea");
const inputtarea = document.getElementById("input-tarea");
const listatarea = document.getElementById("list-tareas");
const API_URL = "http://localhost:3000";

// Elementos de la barra de usuario
const userNameElement = document.getElementById("user-name");
const userEmailElement = document.getElementById("user-email");
const logoutBtn = document.getElementById("logout-btn");

// Función para cargar la información del usuario
function cargarInformacionUsuario() {
  const userData = JSON.parse(localStorage.getItem("user"));

  if (userData) {
    userNameElement.textContent = userData.name || "Usuario";
    userEmailElement.textContent = userData.email || "";
  }
}

// Función para cerrar sesión
function cerrarSesion() {
  localStorage.removeItem("user");
  localStorage.removeItem("authToken");
  window.location.href = "login.html";
}

// Event listener para el botón de cerrar sesión
if (logoutBtn) {
  logoutBtn.addEventListener("click", cerrarSesion);
}

// Verificar autenticación al cargar la página
document.addEventListener("DOMContentLoaded", function () {
  const userData = JSON.parse(localStorage.getItem("user"));

  if (!userData) {
    window.location.href = "login.html";
    return;
  }

  cargarInformacionUsuario();
  mostrarTareas();
});

// Recuperamos las tareas cuando carga la página
async function mostrarTareas() {
  try {
    const authToken = localStorage.getItem("authToken");

    const response = await fetch(`${API_URL}/tareas`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    if (response.status === 401) {
      cerrarSesion();
      return;
    }

    if (!response.ok) {
      throw new Error("Error al cargar tareas");
    }

    const tareas = await response.json();

    listatarea.innerHTML = "";

    if (tareas.length === 0) {
      listatarea.innerHTML =
        '<div class="no-tareas">No hay tareas. ¡Agrega una nueva!</div>';
      return;
    }

    tareas.forEach((tarea) => {
      const tareaAdaptada = {
        texto: tarea.Titulo,
        completada: tarea.completada,
      };
      agregarTareaDOM(tareaAdaptada, tarea.id_tareas);
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
    Titulo: tarea,
    Descripcion: tarea,
    completada: 0,
  };

  guardarTareaBackend(nuevaTarea);
  inputtarea.value = "";
});

// Función para guardar tarea en el backend
async function guardarTareaBackend(tareaObj) {
  try {
    // Eliminar el mensaje de "No hay tareas" si existe
    const noTareasMsg = listatarea.querySelector(".no-tareas");
    if (noTareasMsg) {
      noTareasMsg.remove();
    }

    const authToken = localStorage.getItem("authToken");

    const response = await fetch(`${API_URL}/tareas`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify(tareaObj),
    });

    if (response.status === 401) {
      cerrarSesion();
      return;
    }

    if (!response.ok) {
      throw new Error("Error al guardar tarea");
    }

    const nuevaTarea = await response.json();
    const tareaAdaptada = {
      texto: nuevaTarea.Titulo,
      completada: nuevaTarea.completada,
    };

    agregarTareaDOM(tareaAdaptada, nuevaTarea.id_tareas);
  } catch (error) {
    alert("Error al guardar tarea");
  }
}

// Función para actualizar el estado de una tarea
async function actualizarTareaBackend(id, completada) {
  try {
    const authToken = localStorage.getItem("authToken");

    await fetch(`${API_URL}/tareas/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({ completada: completada ? 1 : 0 }),
    });
  } catch (error) {
    // Error silencioso para actualización
  }
}

// Función para eliminar una tarea
async function eliminarTareaBackend(id) {
  try {
    const authToken = localStorage.getItem("authToken");

    await fetch(`${API_URL}/tareas/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
  } catch (error) {
    // Error silencioso para eliminación
  }
}

function agregarTareaDOM(tareaObj, id) {
  const li = document.createElement("li");
  li.classList.add("tarea");
  li.dataset.id = id;

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
  btnCompletar.addEventListener("click", async function () {
    li.classList.toggle("completada");
    const nuevaEstado = li.classList.contains("completada");
    await actualizarTareaBackend(id, nuevaEstado);
  });

  // Botón de eliminar
  const boton = document.createElement("button");
  boton.classList.add("btn-eliminar");
  boton.textContent = "🗑️";
  boton.addEventListener("click", async function () {
    await eliminarTareaBackend(id);
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
