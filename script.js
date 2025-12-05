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
