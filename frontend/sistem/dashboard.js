const dashboardData = {
  7: {
    description: "Dados consolidados dos últimos 7 dias",
    metrics: { entries: 342, outputs: 268, balance: 74, lowStock: 14, entriesTrend: 6.8, outputsTrend: -2.1, balanceTrend: 4.7 },
    flow: [
      { label: "Seg", entries: 45, outputs: 38 },
      { label: "Ter", entries: 62, outputs: 41 },
      { label: "Qua", entries: 54, outputs: 52 },
      { label: "Qui", entries: 70, outputs: 46 },
      { label: "Sex", entries: 58, outputs: 55 },
      { label: "Sáb", entries: 53, outputs: 36 }
    ],
    clients: [
      { name: "Mercado Central", value: 74, color: "#eaf3ff", text: "#2878f0" },
      { name: "Rede Bom Preço", value: 61, color: "#fff1e5", text: "#dc762d" },
      { name: "Supermais", value: 49, color: "#e9f8f1", text: "#218960" },
      { name: "Empório Santos", value: 38, color: "#f2edff", text: "#7355bc" },
      { name: "Comercial Lima", value: 28, color: "#ffeded", text: "#cc4d4d" }
    ]
  },
  30: {
    description: "Dados consolidados dos últimos 30 dias",
    metrics: { entries: 1284, outputs: 946, balance: 338, lowStock: 18, entriesTrend: 12.4, outputsTrend: 8.7, balanceTrend: 3.2 },
    flow: [
      { label: "Sem 1", entries: 182, outputs: 138 },
      { label: "Sem 2", entries: 246, outputs: 175 },
      { label: "Sem 3", entries: 195, outputs: 168 },
      { label: "Sem 4", entries: 268, outputs: 187 },
      { label: "Sem 5", entries: 215, outputs: 151 },
      { label: "Atual", entries: 178, outputs: 127 }
    ],
    clients: [
      { name: "Mercado Central", value: 286, color: "#eaf3ff", text: "#2878f0" },
      { name: "Rede Bom Preço", value: 218, color: "#fff1e5", text: "#dc762d" },
      { name: "Supermais", value: 175, color: "#e9f8f1", text: "#218960" },
      { name: "Empório Santos", value: 142, color: "#f2edff", text: "#7355bc" },
      { name: "Comercial Lima", value: 96, color: "#ffeded", text: "#cc4d4d" }
    ]
  },
  90: {
    description: "Dados consolidados dos últimos 90 dias",
    metrics: { entries: 3946, outputs: 3187, balance: 759, lowStock: 21, entriesTrend: 18.2, outputsTrend: 14.5, balanceTrend: 7.9 },
    flow: [
      { label: "Abr", entries: 580, outputs: 471 },
      { label: "Mai", entries: 645, outputs: 498 },
      { label: "Jun", entries: 592, outputs: 536 },
      { label: "Jul", entries: 731, outputs: 558 },
      { label: "Ago", entries: 756, outputs: 621 },
      { label: "Set", entries: 642, outputs: 503 }
    ],
    clients: [
      { name: "Mercado Central", value: 864, color: "#eaf3ff", text: "#2878f0" },
      { name: "Rede Bom Preço", value: 738, color: "#fff1e5", text: "#dc762d" },
      { name: "Supermais", value: 594, color: "#e9f8f1", text: "#218960" },
      { name: "Empório Santos", value: 481, color: "#f2edff", text: "#7355bc" },
      { name: "Comercial Lima", value: 326, color: "#ffeded", text: "#cc4d4d" }
    ]
  }
};

const movements = [
  { product: "Café Especial 500g", code: "CF-1042", type: "output", partner: "Mercado Central", quantity: 48, date: "Hoje, 10:42" },
  { product: "Açúcar Cristal 1kg", code: "AC-2081", type: "entry", partner: "Distribuidora Vale", quantity: 120, date: "Hoje, 09:18" },
  { product: "Leite Integral 1L", code: "LT-3095", type: "output", partner: "Rede Bom Preço", quantity: 72, date: "Ontem, 16:35" },
  { product: "Farinha de Trigo 1kg", code: "FT-4017", type: "entry", partner: "Alimentos Brasil", quantity: 90, date: "Ontem, 14:06" },
  { product: "Óleo de Soja 900ml", code: "OS-5074", type: "output", partner: "Supermais", quantity: 36, date: "Ontem, 11:22" }
];

const numberFormatter = new Intl.NumberFormat("pt-BR");
const periodFilter = document.getElementById("periodFilter");
const flowChart = document.getElementById("flowChart");
const clientsChart = document.getElementById("clientsChart");
const movementsTable = document.getElementById("movementsTable");
const dashboardSearch = document.getElementById("dashboardSearch");

function getInitials(name) {
  return name.split(" ").slice(0, 2).map((word) => word[0]).join("").toUpperCase();
}

function roundedScaleMax(value) {
  const magnitude = 10 ** Math.floor(Math.log10(value));
  return Math.ceil(value / magnitude) * magnitude;
}

function updateTrend(elementId, value) {
  const element = document.getElementById(elementId);
  const isUp = value >= 0;

  element.textContent = `${isUp ? "+" : ""}${value.toLocaleString("pt-BR", { minimumFractionDigits: 1 })}%`;
  element.classList.toggle("trend--up", isUp);
  element.classList.toggle("trend--down", !isUp);
}

function renderMetrics(metrics) {
  document.getElementById("entriesValue").textContent = numberFormatter.format(metrics.entries);
  document.getElementById("outputsValue").textContent = numberFormatter.format(metrics.outputs);
  document.getElementById("balanceValue").textContent = `${metrics.balance >= 0 ? "+" : ""}${numberFormatter.format(metrics.balance)}`;
  document.getElementById("lowStockValue").textContent = numberFormatter.format(metrics.lowStock);
  updateTrend("entriesTrend", metrics.entriesTrend);
  updateTrend("outputsTrend", metrics.outputsTrend);
  updateTrend("balanceTrend", metrics.balanceTrend);
}

function renderFlowChart(data) {
  const highestValue = Math.max(...data.flatMap((item) => [item.entries, item.outputs]));
  const scaleMax = roundedScaleMax(highestValue);
  const axisValues = Array.from({ length: 5 }, (_, index) => Math.round(scaleMax - (scaleMax / 4) * index));

  flowChart.innerHTML = `
    <div class="chart-axis" aria-hidden="true">
      ${axisValues.map((value) => `<span>${numberFormatter.format(value)}</span>`).join("")}
    </div>
    <div class="chart-plot">
      <div class="chart-grid-lines" aria-hidden="true">${axisValues.map(() => "<i></i>").join("")}</div>
      ${data.map((item) => `
        <div class="bar-group">
          <span class="bar bar--entry" style="height: ${(item.entries / scaleMax) * 100}%" data-tooltip="${numberFormatter.format(item.entries)} entradas" role="img" aria-label="${item.label}: ${numberFormatter.format(item.entries)} entradas"></span>
          <span class="bar bar--output" style="height: ${(item.outputs / scaleMax) * 100}%" data-tooltip="${numberFormatter.format(item.outputs)} saídas" role="img" aria-label="${item.label}: ${numberFormatter.format(item.outputs)} saídas"></span>
        </div>
      `).join("")}
    </div>
    <div class="chart-labels" aria-hidden="true">${data.map((item) => `<span>${item.label}</span>`).join("")}</div>
  `;
}

function renderClientsChart(clients) {
  const largestValue = Math.max(...clients.map((client) => client.value));

  clientsChart.innerHTML = clients.map((client) => `
    <div class="client-row">
      <div class="client-info">
        <span class="client-avatar" style="color: ${client.text}; background: ${client.color}">${getInitials(client.name)}</span>
        <span class="client-name" title="${client.name}">${client.name}</span>
      </div>
      <div class="client-bar-track" role="img" aria-label="${client.name}: ${numberFormatter.format(client.value)} unidades">
        <div class="client-bar-fill" style="width: ${(client.value / largestValue) * 100}%"></div>
      </div>
      <strong class="client-value">${numberFormatter.format(client.value)}</strong>
    </div>
  `).join("");
}

function movementRowTemplate(movement) {
  const isEntry = movement.type === "entry";
  const typeLabel = isEntry ? "Entrada" : "Saída";

  return `
    <tr>
      <td>
        <div class="product-cell">
          <span class="product-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4.5 7.3 12 3l7.5 4.3v9.4L12 21l-7.5-4.3V7.3Z"/><path d="m4.8 7.5 7.2 4.2 7.2-4.2M12 11.7V21"/></svg>
          </span>
          <span>${movement.product}<br><small>${movement.code}</small></span>
        </div>
      </td>
      <td><span class="movement-type movement-type--${movement.type}">${typeLabel}</span></td>
      <td>${movement.partner}</td>
      <td><strong>${isEntry ? "+" : "−"}${numberFormatter.format(movement.quantity)}</strong> un.</td>
      <td>${movement.date}</td>
      <td><span class="status-badge">Concluído</span></td>
    </tr>
  `;
}

function renderMovements(searchTerm = "") {
  const normalizedTerm = searchTerm.trim().toLocaleLowerCase("pt-BR");
  const filteredMovements = movements.filter((movement) =>
    [movement.product, movement.code, movement.partner].some((value) =>
      value.toLocaleLowerCase("pt-BR").includes(normalizedTerm)
    )
  );

  movementsTable.innerHTML = filteredMovements.length
    ? filteredMovements.map(movementRowTemplate).join("")
    : `<tr><td colspan="6" class="empty-state">Nenhuma movimentação encontrada.</td></tr>`;
}

function renderDashboard(period) {
  const data = dashboardData[period];

  document.getElementById("periodDescription").textContent = data.description;
  renderMetrics(data.metrics);
  renderFlowChart(data.flow);
  renderClientsChart(data.clients);
}

periodFilter.addEventListener("change", () => renderDashboard(periodFilter.value));
dashboardSearch.addEventListener("input", () => renderMovements(dashboardSearch.value));

renderDashboard(periodFilter.value);
renderMovements();
