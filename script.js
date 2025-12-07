// Storage Key
const KEY = "miniBudget:v1";

// state
let state = { transactions: [] };

function save() {
  window.localStorage.setItem(KEY, JSON.stringify(state));
}

function load() {
  const raw = window.localStorage.getItem(KEY);
  state = raw ? JSON.parse(raw) : { transactions: [] };
}

function calculeTotals() {
  const revenus = state.transactions
    // @ts-ignore
    .filter((t) => t.type === "revenus")
    // @ts-ignore
    .reduce((acc, value) => acc + value.montant, 0);

  const depences = state.transactions
    // @ts-ignore
    .filter((t) => t.type === "depences")
    // @ts-ignore
    .reduce((acc, value) => acc + value.montant, 0);
  const solde = revenus - depences;
  return { revenus, depences, solde };
}

const btnajouter = document.getElementById("btn-ajouter");
// @ts-ignore
btnajouter?.addEventListener("click", () => {
  const rev = document.getElementById("montant");
  // @ts-ignore
  console.log(rev.value);
});
