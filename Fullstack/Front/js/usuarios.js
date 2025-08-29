async function carregarUsuarios() {
    const res = await fetch("http://localhost:3000/api/usuarios");
    const data = await res.json();
    console.log(data);
    const tbody = document.querySelector("#user-table tbody");

    data.forEach(usuario => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${usuario.nome}</td>
            <td>${usuario.email}</td>
            <td>${usuario.telefone}</td>
            <td>${usuario.perfil}</td>
            <td>${usuario.status}</td>
            <td>
                <a href="editar_usuario.html?id=${usuario.id}" class="btn btn-edit">Editar</a>
                <button class="btn btn-delete" data-id="${usuario.id}">Excluir</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

carregarUsuarios();