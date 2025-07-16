import { serve } from "https://deno.land/std/http/server.ts";

serve(async (req) => {
  const url = new URL(req.url);
  if (url.pathname === "/") {
    return new Response(await Deno.readTextFile("./public/index.html"), {
      headers: { "content-type": "text/html" },
    });
  }

  try {
    const filePath = `./public${url.pathname}`;
    const content = await Deno.readTextFile(filePath);
    const contentType = filePath.endsWith(".⟁") ? "text/yaml" : "text/plain";
    return new Response(content, { headers: { "content-type": contentType } });
  } catch {
    return new Response("404 Not Found", { status: 404 });
  }
});
