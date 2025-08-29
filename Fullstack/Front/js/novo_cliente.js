function parseJwt(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('client-form');

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const token = localStorage.getItem('token');
    const decoded = parseJwt(token);
    const usuarioId = decoded ? decoded.usuarioId || decoded.id || null : null;

    if (!usuarioId) {
      alert('Usuário não autenticado. Faça login novamente.');
      return;
    }

    const cliente = {
      nome: form.nome.value.trim(),
      cpf: form.cpf.value.trim() || null,
      cnpj: form.cnpj.value.trim() || null,
      email: form.email.value.trim(),
      telefone: form.telefone.value.trim(),
      cep: form.cep.value.trim(),
      rua: form.rua.value.trim(),
      numero: form.numero.value.trim(),
      complemento: form.complemento.value.trim() || null,
      bairro: form.bairro.value.trim(),
      cidade: form.cidade.value.trim(),
      estado: form.uf.value,
      observacoes: form.observacoes.value.trim() || null,
      usuarioId: usuarioId,
    };

    console.log('Dados para enviar:', cliente);

    try {
      const response = await fetch('http://localhost:3000/api/clientes', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(cliente),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao salvar cliente');
      }

      alert('Cliente salvo com sucesso!');
      window.location.href = 'clientes.html';
    } catch (error) {
      alert(`Falha ao salvar cliente: ${error.message}`);
    }
  });
});
