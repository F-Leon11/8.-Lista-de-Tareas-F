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

// URL base de tu API - cambia según tu configuración
const API_URL = "http://localhost:3000";

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

// Función para manejar el login
loginBtn.addEventListener("click", async () => {
  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;

  if (!email || !password) {
    loginError.textContent = "Por favor, completa todos los campos";
    return;
  }

  try {
    loginError.textContent = "";
    loginBtn.textContent = "Iniciando sesión...";
    loginBtn.disabled = true;

    // Llamada a tu API de login
    const response = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (response.ok) {
      // Guardar datos de usuario
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("authToken", data.token); // Si usas JWT

      loginSuccess.textContent = "¡Inicio de sesión exitoso! Redirigiendo...";

      // Redirigir a la página principal después de 1 segundo
      setTimeout(() => {
        window.location.href = "index.html";
      }, 1000);
    } else {
      loginError.textContent = data.message || "Credenciales incorrectas";
      loginBtn.textContent = "Iniciar Sesión";
      loginBtn.disabled = false;
    }
  } catch (error) {
    console.error("Error en login:", error);
    loginError.textContent = "Error al conectar con el servidor";
    loginBtn.textContent = "Iniciar Sesión";
    loginBtn.disabled = false;
  }
});

// Función para manejar el registro
registerBtn.addEventListener("click", async () => {
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

  try {
    registerError.textContent = "";
    registerBtn.textContent = "Creando cuenta...";
    registerBtn.disabled = true;

    // Llamada a tu API de registro
    const response = await fetch(`${API_URL}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await response.json();

    if (response.ok) {
      registerSuccess.textContent =
        "¡Cuenta creada exitosamente! Redirigiendo...";

      // Guardar datos de usuario
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("authToken", data.token); // Si usas JWT

      // Redirigir a la página principal después de 1 segundo
      setTimeout(() => {
        window.location.href = "index.html";
      }, 1000);
    } else {
      registerError.textContent = data.message || "Error al crear la cuenta";
      registerBtn.textContent = "Crear Cuenta";
      registerBtn.disabled = false;
    }
  } catch (error) {
    console.error("Error en registro:", error);
    registerError.textContent = "Error al conectar con el servidor";
    registerBtn.textContent = "Crear Cuenta";
    registerBtn.disabled = false;
  }
});

// Verificar si ya hay una sesión activa al cargar la página
document.addEventListener("DOMContentLoaded", () => {
  const userData = JSON.parse(localStorage.getItem("user"));
  if (userData) {
    // Si ya hay una sesión, redirigir directamente a la página de tareas
    window.location.href = "index.html";
    //console.log("usuario en un login pendiente");
  }
});
