-- 🧬 Основна таблиця для SQLite
create table if not exists "🧬" (
  id text primary key default (lower(hex(randomblob(16)))),
  "🧬" text unique not null,
  slug text unique,
  "🧠" text default '{}', -- JSONB -> TEXT в SQLite
  "🌊" text,
  "📦" text default 'loose',
  "🔗" text default '[]', -- text[] -> TEXT з JSON масивом
  "version" text,
  "⏱️" text default (datetime('now')),
  "📍" text,
  "🫀" text,
  "🤲" text,
  "🏠" text,
  "🎯" text,
  "exec_ts" text
);

-- 🧬_mutations — історія мутацій
create table if not exists "🧬_mutations" (
  id text primary key default (lower(hex(randomblob(16)))),
  "🧬" text not null,
  "source" text,
  "meta" text default '{}',
  "⏱️" text default (datetime('now')),
  "👣" text,
  "🪞" text,
  foreign key ("🧬") references "🧬"("🧬") on delete cascade
);

-- Індекси для швидкості
create index if not exists idx_glyph_name on "🧬"("🧬");
create index if not exists idx_mutations_glyph on "🧬_mutations"("🧬");
create index if not exists idx_mutations_time on "🧬_mutations"("⏱️");