const params = new URLSearchParams(location.search);
const glyph = params.get("glyph");

if (glyph) {
  const response = await fetch(`/glyphs/${glyph}.⟁`);
  const yaml = await response.text();
  const data = YAML.parse(yaml); // використай бібліотеку js-yaml
  renderGlyph(data);
}

function renderGlyph(data) {
  const container = document.getElementById("glyph-container");
  container.innerHTML = `
    <h1>${data.glyph} ${data.title}</h1>
    <p>${data.resonance}</p>
    <ul>
      ${data.actions.map(a => `<li><button onclick="location.href='${a.onClick}'">${a.label}</button></li>`).join("")}
    </ul>
  `;
}
