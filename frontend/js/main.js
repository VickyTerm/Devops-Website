function checkBackend() {
  fetch("http://localhost:3000/health")
    .then(res => res.json())
    .then(data => {
      document.getElementById("status").innerText =
        "Backend Status: " + data.status;
    })
    .catch(() => {
      document.getElementById("status").innerText =
        "Backend not reachable";
    });
}
