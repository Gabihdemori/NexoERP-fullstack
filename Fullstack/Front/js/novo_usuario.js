document.getElementById("user-form").addEventListener("submit", async function (e) {
    e.preventDefault();

    const nome = document.getElementById("nome").value.trim();
    const email = document.getElementById("email").value.trim();
    const senha = document.getElementById("senha").value.trim();
    const perfil = document.getElementById("perfil").value.trim();
    const errorMsg = document.getElementById("errorMsg");

    try {
        const res = await fetch("http://localhost:3000/api/usuarios", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                    nome,
                    email,
                    senha,
                    perfil
            })
        });

        const data = await res.json();

        if (res.ok) {
            if (data.token) {
                localStorage.setItem("token", data.token);
            }

            alert("Usuário cadastrado com sucesso!");
        } else {
            errorMsg.textContent = data.message || "Erro ao cadastrar usuário.";
        }
    } catch (error) {
        console.error("Erro no cadastro:", error);
        errorMsg.textContent = "Falha ao conectar com o servidor.";
    }
});
