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

    // Redirigir a la página principal después de 1 segundo
    setTimeout(() => {
      window.location.href = "index.html";
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

    // Redirigir a la página principal después de 1 segundo
    setTimeout(() => {
      window.location.href = "index.html";
    }, 1000);
  }, 1000);
});

// Verificar si ya hay una sesión activa al cargar la página
document.addEventListener("DOMContentLoaded", () => {
  const userData = JSON.parse(localStorage.getItem("user"));
  if (userData) {
    // Si ya hay una sesión, redirigir directamente a la página de tareas
    window.location.href = "index.html";
  }
});
