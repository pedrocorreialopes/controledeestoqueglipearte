let produtos = JSON.parse(localStorage.getItem("produtos")) || [];
let editandoIndex = null;

function atualizarLocalStorage() {
  localStorage.setItem("produtos", JSON.stringify(produtos));
}

function atualizarTabela(filtrar = "") {
  const tbody = document.querySelector("#tabela-produtos tbody");
  tbody.innerHTML = "";

  let total = 0;

  produtos.forEach((produto, index) => {
    if (filtrar && !produto.fornecedor.toLowerCase().includes(filtrar.toLowerCase())) return;

    const totalProduto = produto.valor * produto.quantidade;
    total += totalProduto;

    const linha = document.createElement("tr");
    linha.innerHTML = `
      <td>${produto.nome}</td>
      <td>${produto.fornecedor}</td>
      <td>R$ ${produto.valor.toFixed(2)}</td>
      <td>${produto.quantidade}</td>
      <td>R$ ${totalProduto.toFixed(2)}</td>
      <td>
        <button class="acao editar" onclick="editarProduto(${index})">Editar</button>
        <button class="acao" onclick="removerProduto(${index})">Remover</button>
      </td>
    `;
    tbody.appendChild(linha);
  });

  document.getElementById("total").textContent = total.toFixed(2);
}

function removerProduto(index) {
  if (confirm("Deseja remover este produto?")) {
    produtos.splice(index, 1);
    atualizarLocalStorage();
    atualizarTabela(document.getElementById("filtro-fornecedor").value);
  }
}

function editarProduto(index) {
  const p = produtos[index];
  document.getElementById("nome").value = p.nome;
  document.getElementById("fornecedor").value = p.fornecedor;
  document.getElementById("valor").value = p.valor;
  document.getElementById("quantidade").value = p.quantidade;
  editandoIndex = index;
}

function apagarTudo() {
  if (confirm("Tem certeza que deseja apagar todos os dados?")) {
    produtos = [];
    atualizarLocalStorage();
    atualizarTabela();
  }
}

document.getElementById("product-form").addEventListener("submit", function (e) {
  e.preventDefault();

  const nome = document.getElementById("nome").value;
  const fornecedor = document.getElementById("fornecedor").value;
  const valor = parseFloat(document.getElementById("valor").value);
  const quantidade = parseInt(document.getElementById("quantidade").value);

  const novoProduto = { nome, fornecedor, valor, quantidade };

  if (editandoIndex !== null) {
    produtos[editandoIndex] = novoProduto;
    editandoIndex = null;
  } else {
    produtos.push(novoProduto);
  }

  atualizarLocalStorage();
  atualizarTabela(document.getElementById("filtro-fornecedor").value);
  document.getElementById("product-form").reset();
});

document.getElementById("filtro-fornecedor").addEventListener("input", function () {
  atualizarTabela(this.value);
});

function imprimirPDF() {
  window.print();
}

function exportarCSV() {
  if (produtos.length === 0) {
    alert("Nenhum produto cadastrado para exportar.");
    return;
  }

  let csv = "Produto,Fornecedor,Valor Unitário,Quantidade,Total Investido\n";
  let total = 0;

  produtos.forEach(p => {
    const totalProduto = p.valor * p.quantidade;
    total += totalProduto;
    csv += `${p.nome},${p.fornecedor},${p.valor.toFixed(2)},${p.quantidade},${totalProduto.toFixed(2)}\n`;
  });

  csv += `,,,,\n,,,,Total Geral,R$ ${total.toFixed(2)}\n`;

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "estoque_glipearte.csv";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

// Inicializar tabela ao carregar
window.onload = () => atualizarTabela();
