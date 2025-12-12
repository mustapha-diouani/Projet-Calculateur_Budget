// @ts-nocheck
// Storage Key
const KEY = "miniBudget:v1";

// elements
const btnajouter = document.getElementById("btn-ajouter");
const resetBtn = document.getElementById("btn-reinitialiser");
const montant = document.getElementById("montant");
const types = document.getElementById("choix-revenus");
const description = document.getElementById("description");
const revenus = document.getElementById("revenus");
const depences = document.getElementById("depences");
const soldes = document.getElementById("solde");
const transactionsEl = document.getElementById("transaction");
// state
let state = { transactions: [] };

function save() {
  window.localStorage.setItem(KEY, JSON.stringify(state));
}

function load() {
  const raw = window.localStorage.getItem(KEY);
  state = raw ? JSON.parse(raw) : { transactions: [] };
}

/**
 * @param {{ toLocaleString: (arg0: string, arg1: { style: string; currency: string; maximumFractionDigits: number; }) => any; }} n
 */
function formatMoney(n) {
  return n.toLocaleString("fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  });
}

function calculeTotals() {
  const revenu = state.transactions
    .filter((t) => t.type === "revenus")
    .reduce((s, t) => s + t.montants, 0);

  const depence = state.transactions
    .filter((t) => t.type === "depences")
    .reduce((s, t) => s + t.montants, 0);

  const solde = revenu - depence;
  return { revenu, depence, solde };
}

function render() {
  const { revenu, depence, solde } = calculeTotals();

  revenus.textContent = formatMoney(revenu);
  depences.textContent = formatMoney(depence);
  soldes.textContent = formatMoney(solde);

  // Transactions list
  transactionsEl.innerHTML = "";
  state.transactions
    .slice()
    .reverse()
    .forEach((t, idx) => {
      const div = document.createElement("div");
      div.className = "item";

      const left = document.createElement("div");
      left.className = "left";
      const dot = document.createElement("div");
      dot.className = "dot cat-" + (t.category || "House");
      dot.textContent = t.type === "revenus" ? "+" : "-";
      const meta = document.createElement("div");
      meta.className = "meta";
      const title = document.createElement("div");
      title.textContent =
        t.desc || (t.type === "revenus" ? "Revenu" : "Dépense");
      const small = document.createElement("small");
      small.textContent = new Date(t.Date).toLocaleString();
      meta.appendChild(title);
      meta.appendChild(small);
      left.appendChild(dot);
      left.appendChild(meta);

      const right = document.createElement("div");
      right.innerHTML =
        '<div style="text-align:right">' +
        formatMoney(t.montants) +
        "</div>" +
        '<div style="margin-top:6px;display:flex;gap:6px;justify-content:flex-end">' +
        '<button class="btn ghost" onclick="editTx(' +
        idx +
        ')">✎</button>' +
        '<button class="btn ghost" onclick="deleteTx(' +
        idx +
        ')">🗑</button>' +
        "</div>";

      div.appendChild(left);
      div.appendChild(right);
      transactionsEl.appendChild(div);
    });

  save();
}

function guessCategory(desc) {
  if (!desc) return "House";
  const s = desc.toLowerCase();
  if (/uber|taxi|bus|car|essence|transport/.test(s)) return "Transport";
  if (/restau|repas|cafe|restaurant|food|manger|course/.test(s)) return "Food";
  if (/loyer|rent|appart|maison|facture/.test(s)) return "House";
  return "House";
}

// @ts-ignore
btnajouter?.addEventListener("click", () => {
  event?.preventDefault();

  const type = types.value;
  const desc = description.value.trim();
  const montants = Math.abs(parseFloat(montant.value) || 0);
  if (montants <= 0) return alert("Indique un montant supérieur à 0");
  const tab = { type, desc, montants, Date: new Date().toISOString() };

  state.transactions.push(tab);
  console.log(state);
  description.value = "";
  montant.value = "";

  render();
});

window.deleteTx = function (revIndex) {
  const idx = state.transactions.length - 1 - revIndex;
  if (!confirm("Supprimer cette transaction ?")) return;
  state.transactions.splice(idx, 1);
  render();
};

window.editTx = function (revIndex) {
  const idx = state.transactions.length - 1 - revIndex;
  const tx = state.transactions[idx];
  const newDesc = prompt("Modifier la description", tx.desc);
  if (newDesc === null) return; // cancel
  const newAmount = prompt("Modifier le montant", tx.amount);
  if (newAmount === null) return;
  tx.desc = newDesc;
  tx.amount = Math.abs(parseFloat(newAmount) || tx.amount);
  render();
};

resetBtn.addEventListener("click", () => {
  if (!confirm("Réinitialiser toutes les données ?")) return;
  state = { transactions: [] };
  render();
});

load();
render();
