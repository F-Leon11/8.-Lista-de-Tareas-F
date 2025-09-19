// JavaScript simplificado - sin conexión a backend
// Elementos del DOM
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
        name: email.split("@")[0] || "Usuario",
        email: email,
      })
    );

    loginSuccess.textContent = "¡Inicio de sesión exitoso!";

    // Redirigir a la página de tareas después de 1 segundo
    setTimeout(() => {
      mostrarPaginaTareas();
      loginBtn.textContent = "Iniciar Sesión";
      loginBtn.disabled = false;
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

    registerSuccess.textContent = "¡Cuenta creada exitosamente!";

    // Redirigir a la página de tareas después de 1 segundo
    setTimeout(() => {
      mostrarPaginaTareas();
      registerBtn.textContent = "Crear Cuenta";
      registerBtn.disabled = false;
    }, 1000);
  }, 1000);
});

// Función para mostrar la página de tareas
function mostrarPaginaTareas() {
  document.getElementById("login-page").style.display = "none";
  document.getElementById("tareas-page").style.display = "block";
  cargarInformacionUsuario();
  mostrarTareas();
}

// Función para cargar la información del usuario
function cargarInformacionUsuario() {
  const userData = JSON.parse(localStorage.getItem("user"));
  if (userData) {
    userNameElement.textContent = userData.name || "Usuario";
    userEmailElement.textContent = userData.email || "email@ejemplo.com";
  }
}

// Función para cerrar sesión
function cerrarSesion() {
  localStorage.removeItem("user");
  document.getElementById("tareas-page").style.display = "none";
  document.getElementById("login-page").style.display = "block";
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

// Verificar autenticación al cargar la página
document.addEventListener("DOMContentLoaded", function () {
  const userData = JSON.parse(localStorage.getItem("user"));
  if (userData) {
    mostrarPaginaTareas();
  }
});

// Recuperamos las tareas cuando carga la página
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

// Función para agregar tarea al DOM
function agregarTareaDOM(tareaObj) {
  const li = document.createElement("li");
  li.className = "tarea";
  li.dataset.id = tareaObj.id;

  li.innerHTML = `
                <span class="list-texto-tarea ${
                  tareaObj.completada ? "completada" : ""
                }">${tareaObj.texto}</span>
                <button class="boton-completar">${
                  tareaObj.completada ? "Desmarcar" : "Completar"
                }</button>
                <button class="btn-eliminar">Eliminar</button>
            `;

  // Evento para completar/descompletar tarea
  const botonCompletar = li.querySelector(".boton-completar");
  botonCompletar.addEventListener("click", function () {
    completarTarea(tareaObj.id);
  });

  // Evento para eliminar tarea
  const botonEliminar = li.querySelector(".btn-eliminar");
  botonEliminar.addEventListener("click", function () {
    eliminarTarea(tareaObj.id);
  });

  listatarea.appendChild(li);
}

// Función para completar/descompletar tarea
function completarTarea(id) {
  const tareas = JSON.parse(localStorage.getItem("tareas") || "[]");
  const tareaIndex = tareas.findIndex((tarea) => tarea.id === id);

  if (tareaIndex !== -1) {
    tareas[tareaIndex].completada = !tareas[tareaIndex].completada;
    localStorage.setItem("tareas", JSON.stringify(tareas));
    mostrarTareas();
  }
}

// Función para eliminar tarea
function eliminarTarea(id) {
  let tareas = JSON.parse(localStorage.getItem("tareas") || "[]");
  tareas = tareas.filter((tarea) => tarea.id !== id);
  localStorage.setItem("tareas", JSON.stringify(tareas));
  mostrarTareas();
}
