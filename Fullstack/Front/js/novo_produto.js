document.getElementById("product-form").addEventListener("submit", async function (e) {
    e.preventDefault();

    const nome = document.getElementById("nome").value.trim();
    const descricao = document.getElementById("descricao").value.trim();
    const preco = parseFloat(document.getElementById("preco").value);
    const estoque = parseInt(document.getElementById("estoque").value, 10);
    const status = document.getElementById("status").checked;
    const errorMsg = document.getElementById("errorMsg");

    try {
        const res = await fetch("http://localhost:3000/api/produtos", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                nome,
                descricao,
                preco,
                estoque,
                status
            })
        });

        const data = await res.json();

        if (res.ok) {
            alert("Produto cadastrado com sucesso!");
        } else {
            errorMsg.textContent = data.message || "Erro ao cadastrar produto.";
        }
    } catch (error) {
        console.error("Erro no cadastro:", error);
        errorMsg.textContent = "Falha ao conectar com o servidor.";
    }
});