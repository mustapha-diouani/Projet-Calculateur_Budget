// @ts-nocheck
// Storage Key
const KEY = "miniBudget:v1";

// elements
const btnajouter = document.getElementById("btn-ajouter");
const montant = document.getElementById("montant");
const types = document.getElementById("choix-revenus");
const description = document.getElementById("description");
const revenus = document.getElementById("revenus");
const depences = document.getElementById("depences");
const soldes = document.getElementById("solde");
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

  save();
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

load();
render();
