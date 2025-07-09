document.getElementById("saveIntent").onclick = async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  chrome.storage.local.set({ focus_url: tab.url });
  document.getElementById("status").innerText = "🔖 Збережено як інтент.";
};
document.getElementById("logPage").onclick = async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  console.log("Logging page:", tab.url);
  document.getElementById("status").innerText = "📜 Залоговано.";
};
document.getElementById("askAgent").onclick = () => {
  document.getElementById("status").innerText = "🧠 (запит до агента буде у майбутньому)";
};
