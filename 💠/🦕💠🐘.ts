// deno run --allow-read --allow-env --allow-net init_supabase.ts

import "https://deno.land/std@0.224.0/dotenv/load.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { join } from "https://deno.land/std@0.224.0/path/mod.ts";
import { parse } from "https://deno.land/std@0.224.0/yaml/mod.ts";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
    throw new Error(
        "❌ Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in env",
    );
}

const folder = "./💠/";
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function main() {
    for await (const entry of Deno.readDir(folder)) {
        if (!entry.isFile || !entry.name.endsWith(".yaml")) continue;

        const path = join(folder, entry.name);
        try {
            const text = await Deno.readTextFile(path);
            const glyph = parse(text);

            if (!glyph?.["🧬"]) {
                console.warn(
                    `⚠️  No 🧬 glyph found in ${entry.name}. Skipping.`,
                );
                continue;
            }

            const { error } = await supabase.from("🧬").upsert({
                "🧬": glyph["🧬"],
                "🌊": glyph["🌊"] ?? null,
                "🫧": glyph["🫧"] ?? null,
                "🧠": glyph["🧠"] ?? {},
                "🔗": glyph["🔗"] ?? [],
                "⏱️": glyph["⏱️"] ?? new Date().toISOString(),
                "🏠": glyph["🏠"] ?? null,
                "📦": glyph["📦"] ?? null,
                "🎯": glyph["🎯"] ?? null,
                "📍": glyph["📍"] ?? null,
                "🤲": glyph["🤲"] ?? null,
                "🫀": glyph["🫀"] ?? null,
                "slug": glyph["slug"] ?? null,
                "version": glyph["version"] ?? "0.1.0",
            });

            if (error) {
                console.error(
                    `❌ Failed to insert ${glyph["🧬"]}:`,
                    error.message,
                );
            } else {
                console.log(`✅ Inserted ${glyph["🧬"]} from ${entry.name}`);
            }
        } catch (err) {
            console.error(
                `❌ Error processing ${entry.name}:`,
                err.message || err,
            );
        }
    }
}

main();
