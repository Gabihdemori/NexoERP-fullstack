document.getElementById("loginForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();
  const errorMsg = document.getElementById("errorMsg");

  // Enviar requisição para a API de login
  fetch("http://localhost:3000/login", {
      method: "POST",
      headers: {
          "Content-Type": "application/json"
      },
      body: JSON.stringify({
          email: username,
          senha: password
      })
  })
  .then(response => response.json())
  .then(data => {
      if (data.success || data.token) {
          // Salvar token no localStorage
          localStorage.setItem("token", data.token);

          alert("Login bem-sucedido!");
          window.location.href = "../dashboard/index.html"; 
      } else {
          errorMsg.textContent = data.message || "Usuário ou senha inválidos.";
      }
  })
  .catch(error => {
      errorMsg.textContent = "Erro ao conectar com o servidor.";
  });
});

document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const accessForm = document.getElementById('accessForm');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const usernameError = document.getElementById('usernameError');
    const passwordError = document.getElementById('passwordError');
    const passwordToggle = document.getElementById('passwordToggle');
    const loginButton = document.getElementById('loginButton');
    const notification = document.getElementById('notification');
    const accessModal = document.getElementById('accessModal');
    const modalClose = document.getElementById('modalClose');
    const requestAccessBtn = document.getElementById('requestAccess');
    const forgotPasswordBtn = document.getElementById('forgotPassword');
    
    // Alternar visibilidade da senha
    passwordToggle.addEventListener('click', function() {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        
        // Alterar ícone
        const icon = this.querySelector('i');
        icon.classList.toggle('fa-eye');
        icon.classList.toggle('fa-eye-slash');
    });
});
