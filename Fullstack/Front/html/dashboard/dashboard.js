document.addEventListener("DOMContentLoaded", () => {
    const userName = localStorage.getItem("user") || "Desconhecido";
    const lastAccess = localStorage.getItem("lastAccess") || "Primeiro acesso";

    document.getElementById("userName").textContent = userName;
    document.getElementById("lastAccess").textContent = lastAccess;
});