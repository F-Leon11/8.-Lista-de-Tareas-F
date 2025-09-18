// Elementos del DOM
const loginPage = document.getElementById("login-page");
const tareasPage = document.getElementById("tareas-page");
const loginContainer = document.getElementById("login-container");
const registerContainer = document.getElementById("register-container");
const loginBtn = document.getElementById("login-btn");
const registerBtn = document.getElementById("register-btn");
const switchToRegister = document.getElementById("switch-to-register");
const switchToLogin = document.getElementById("switch-to-login");
const loginError = document.getElementById("login-error");
const registerError = document.getElementById("register-error");
const loginSuccess = document.getElementById("login-success");
const registerSuccess = document.getElementById("register-success");

const btnsummit = document.getElementById("summit-tarea");
const inputtarea = document.getElementById("input-tarea");
const listatarea = document.getElementById("list-tareas");
const userNameElement = document.getElementById("user-name");
const userEmailElement = document.getElementById("user-email");
const logoutBtn = document.getElementById("logout-btn");

// Cambiar entre formularios de login y registro
switchToRegister.addEventListener("click", () => {
  loginContainer.classList.add("hidden");
  registerContainer.classList.remove("hidden");
  clearMessages();
});

switchToLogin.addEventListener("click", () => {
  registerContainer.classList.add("hidden");
  loginContainer.classList.remove("hidden");
  clearMessages();
});

// Función para limpiar mensajes
function clearMessages() {
  loginError.textContent = "";
  loginSuccess.textContent = "";
  registerError.textContent = "";
  registerSuccess.textContent = "";
}

// Función para manejar el login (simulado)
loginBtn.addEventListener("click", () => {
  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;

  if (!email || !password) {
    loginError.textContent = "Por favor, completa todos los campos";
    return;
  }

  loginError.textContent = "";
  loginBtn.textContent = "Iniciando sesión...";
  loginBtn.disabled = true;

  // Simular proceso de login
  setTimeout(() => {
    // Guardar datos de usuario simulados
    localStorage.setItem(
      "user",
      JSON.stringify({
        name: "Usuario",
        email: email,
      })
    );

    loginSuccess.textContent = "¡Inicio de sesión exitoso! Redirigiendo...";

    // Redirigir a la página de tareas después de 1 segundo
    setTimeout(() => {
      mostrarPaginaTareas();
    }, 1000);
  }, 1000);
});

// Función para manejar el registro (simulado)
registerBtn.addEventListener("click", () => {
  const name = document.getElementById("register-name").value;
  const email = document.getElementById("register-email").value;
  const password = document.getElementById("register-password").value;

  if (!name || !email || !password) {
    registerError.textContent = "Por favor, completa todos los campos";
    return;
  }

  if (password.length < 6) {
    registerError.textContent =
      "La contraseña debe tener al menos 6 caracteres";
    return;
  }

  registerError.textContent = "";
  registerBtn.textContent = "Creando cuenta...";
  registerBtn.disabled = true;

  // Simular proceso de registro
  setTimeout(() => {
    // Guardar datos de usuario simulados
    localStorage.setItem(
      "user",
      JSON.stringify({
        name: name,
        email: email,
      })
    );

    registerSuccess.textContent =
      "¡Cuenta creada exitosamente! Redirigiendo...";

    // Redirigir a la página de tareas después de 1 segundo
    setTimeout(() => {
      mostrarPaginaTareas();
    }, 1000);
  }, 1000);
});

// Función para mostrar la página de tareas
function mostrarPaginaTareas() {
  loginPage.style.display = "none";
  tareasPage.style.display = "block";
  cargarInformacionUsuario();
  mostrarTareas();
}

// Función para cargar la información del usuario
function cargarInformacionUsuario() {
  const userData = JSON.parse(
    localStorage.getItem("user") ||
      '{"name":"Usuario", "email":"email@ejemplo.com"}'
  );
  userNameElement.textContent = userData.name;
  userEmailElement.textContent = userData.email;
}

// Función para cerrar sesión
function cerrarSesion() {
  localStorage.removeItem("user");
  localStorage.removeItem("tareas");
  tareasPage.style.display = "none";
  loginPage.style.display = "block";
  // Resetear formularios
  document.getElementById("login-email").value = "";
  document.getElementById("login-password").value = "";
  document.getElementById("register-name").value = "";
  document.getElementById("register-email").value = "";
  document.getElementById("register-password").value = "";
  clearMessages();
}

// Event listener para el botón de cerrar sesión
if (logoutBtn) {
  logoutBtn.addEventListener("click", cerrarSesion);
}

// Cargar información del usuario y tareas al iniciar
document.addEventListener("DOMContentLoaded", function () {
  const userData = JSON.parse(localStorage.getItem("user"));
  if (userData) {
    mostrarPaginaTareas();
  }
});

// Recuperar tareas del localStorage
function mostrarTareas() {
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
}

// Event listener para agregar tareas
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
}

// Función para actualizar el estado de una tarea
function actualizarTareaLocal(id, completada) {
  const tareas = JSON.parse(localStorage.getItem("tareas") || "[]");

  // Encontrar y actualizar la tarea
  const tareaIndex = tareas.findIndex((t) => t.id === id);
  if (tareaIndex !== -1) {
    tareas[tareaIndex].completada = completada;
    localStorage.setItem("tareas", JSON.stringify(tareas));
  }
}

// Función para eliminar una tarea
function eliminarTareaLocal(id) {
  const tareas = JSON.parse(localStorage.getItem("tareas") || "[]");

  // Filtrar la tarea a eliminar
  const nuevasTareas = tareas.filter((t) => t.id !== id);

  // Guardar en localStorage
  localStorage.setItem("tareas", JSON.stringify(nuevasTareas));
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
