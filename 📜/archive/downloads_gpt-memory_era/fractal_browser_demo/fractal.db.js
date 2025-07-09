const FRACTAL_DB = {
  "🧬/👼/vault.key": "🔐 SECRET: only visible inside the node",
  "🧬/🌐/hello.txt": "🌍 Hello, fractal world!"
};

async function getFractalFile(path) {
  return FRACTAL_DB[path] || null;
}