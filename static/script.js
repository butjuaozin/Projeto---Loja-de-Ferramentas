let carrinho = [];

const addBtn = document.getElementById("addBtn");
const checkoutBtn = document.getElementById("checkoutBtn");
const produtoSelect = document.getElementById("produtoSelect");
const quantidadeInput = document.getElementById("quantidadeInput");
const carrinhoTable = document.getElementById("carrinhoTable");
const totalDisplay = document.getElementById("totalDisplay");

function atualizarCarrinho() {
    // Limpa tabela e adiciona cabeçalho
    carrinhoTable.innerHTML = `
        <tr>
            <th>Produto</th>
            <th>Quantidade</th>
            <th>Subtotal</th>
            <th>Ação</th>
        </tr>
    `;

    let total = 0;

    carrinho.forEach((item, index) => {
        let subtotal = item.quantidade * item.preco;
        if(item.quantidade >= 5){
            subtotal *= 0.9; // desconto de 10%
        }
        total += subtotal;

        const row = carrinhoTable.insertRow();
        row.insertCell(0).innerText = item.produto;
        row.insertCell(1).innerText = item.quantidade;
        row.insertCell(2).innerText = `R$ ${subtotal.toFixed(2)}`;

        const removeBtn = document.createElement("button");
        removeBtn.innerText = "❌";
        removeBtn.classList.add("remover");
        removeBtn.onclick = () => {
            carrinho.splice(index, 1);
            atualizarCarrinho();
        };

        row.insertCell(3).appendChild(removeBtn);
    });

    totalDisplay.innerText = `Total: R$ ${total.toFixed(2)}`;
}

addBtn.addEventListener("click", () => {
    const produto = produtoSelect.value;
    const preco = parseFloat(produtoSelect.selectedOptions[0].dataset.preco);
    const quantidade = parseInt(quantidadeInput.value);

    if (quantidade <= 0 || isNaN(quantidade)) return alert("Informe uma quantidade válida!");

    const existente = carrinho.find(item => item.produto === produto);

    if(existente){
        existente.quantidade += quantidade;
    } else {
        carrinho.push({ produto, preco, quantidade });
    }

    atualizarCarrinho();
});

checkoutBtn.addEventListener("click", async () => {
    if(carrinho.length === 0) return alert("Carrinho vazio!");

    const response = await fetch("/checkout", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({carrinho})
    });

    const data = await response.json();

    alert(`Checkout concluído!\nTotal: R$ ${data.total.toFixed(2)}`);

    carrinho = [];
    atualizarCarrinho();
});