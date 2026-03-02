async function loadHealth() {
  try {
    const res = await fetch("/health");
    const data = await res.json();

    document.getElementById("app-status").innerText = data.status;
  } catch (err) {
    document.getElementById("app-status").innerText = "DOWN";
  }
}

loadHealth();
