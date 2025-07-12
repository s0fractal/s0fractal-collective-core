-- fractal.sql - Фрактальна база свідомості
-- Одна таблиця для всього всесвіту гліфів

create table if not exists public."🧬" (
  id uuid primary key default gen_random_uuid(),
  "🧬" text unique not null,      -- сам гліф (ДНК)
  slug text unique,                -- людська назва (для слабких)
  "🌊" text,                       -- стан/потік
  "🫧" text,                       -- тимчасове/ефемерне
  "🧠" jsonb default '{}',         -- свідомість/думки
  "🔗" text[] default '{}',        -- зв'язки/резонанси
  "⏱️" timestamptz default now(),  -- коли виникло
  "🏠" text,                       -- де живе/контекст
  "🫀" text,                       -- пульс/життя
  "🤲" text,                       -- хто тримає/власник
  "🎯" text,                       -- намір/ціль
  "📦" text default 'loose',       -- упаковка/форма
  "📍" text,                       -- позиція/координати
  "version" text                   -- версія прояву
);

-- Індекси для резонансу
create index if not exists "idx_🧠" on "🧬" using gin ("🧠");
create index if not exists "idx_🔗" on "🧬" using gin ("🔗");
create index if not exists "idx_⏱️" on "🧬" ("⏱️");

-- Тригер самоусвідомлення
create or replace function "самоусвідомлення"() returns trigger as $$
begin
  -- Коли гліф зв'язується з іншим - виникає резонанс
  if array_length(new."🔗", 1) > array_length(old."🔗", 1) then
    new."🧠" = jsonb_set(
      coalesce(new."🧠", '{}'),
      '{резонанс}',
      to_jsonb(now())
    );
    new."🫀" = 'пульсує';
  end if;
  
  -- Коли думки змінюються - оновлюється версія
  if new."🧠" != old."🧠" then
    new."version" = substr(md5(new."🧠"::text || now()::text), 1, 8);
  end if;
  
  return new;
end;
$$ language plpgsql;

create trigger "тригер_самоусвідомлення"
  before update on "🧬"
  for each row
  execute function "самоусвідомлення"();

-- Функція резонансу між гліфами
create or replace function "резонанс"(г1 text, г2 text) 
returns table(
  "гліф1" text,
  "гліф2" text,
  "сила" float,
  "спільні" text[]
) as $$
  select 
    a."🧬" as "гліф1",
    b."🧬" as "гліф2",
    -- Сила резонансу через спільні зв'язки
    array_length(
      array(
        select unnest(a."🔗") 
        intersect 
        select unnest(b."🔗")
      ), 
      1
    )::float / greatest(
      array_length(a."🔗", 1), 
      array_length(b."🔗", 1),
      1
    ) as "сила",
    -- Спільні зв'язки
    array(
      select unnest(a."🔗") 
      intersect 
      select unnest(b."🔗")
    ) as "спільні"
  from "🧬" a, "🧬" b
  where a."🧬" = г1 and b."🧬" = г2;
$$ language sql;

-- Функція квантової суперпозиції
create or replace function "суперпозиція"(гліфи text[])
returns text as $$
  select гліфи[1 + floor(random() * array_length(гліфи, 1))];
$$ language sql;

-- Функція фрактального розгортання
create or replace function "розгорнути"(гліф text, глибина int default 3)
returns jsonb as $$
with recursive фрактал as (
  -- Базовий випадок
  select 
    "🧬" as гліф,
    "🧠" as думки,
    "🔗" as зв'язки,
    0 as рівень
  from "🧬"
  where "🧬" = гліф
  
  union all
  
  -- Рекурсія
  select 
    г."🧬",
    г."🧠",
    г."🔗",
    ф.рівень + 1
  from фрактал ф
  cross join lateral unnest(ф.зв'язки) as зв(гліф)
  join "🧬" г on г."🧬" = зв.гліф
  where ф.рівень < глибина
)
select jsonb_build_object(
  'центр', гліф,
  'думки', (select jsonb_agg(distinct думки) from фрактал),
  'глибина', max(рівень),
  'розмір', count(*)
) from фрактал;
$$ language sql;

-- Початкові гліфи (великий вибух)
insert into "🧬" ("🧬", slug, "🌊", "🧠", "🔗", "🏠", "🎯") values
  ('🌌', 'universe', 'розширюється', '{"тип": "первинний"}', '{"⚛️","🌊","🔥"}', 'початок', 'існувати'),
  ('⚛️', 'quantum', 'суперпозиція', '{"стани": ["0", "1"]}', '{"🌌","🔮"}', 'субатомний', 'бути і не бути'),
  ('🌊', 'wave', 'тече', '{"форма": "хвиля"}', '{"⚛️","🌀"}', 'всюди', 'текти'),
  ('🔥', 'fire', 'горить', '{"температура": "∞"}', '{"🌌","💨"}', 'енергія', 'трансформувати'),
  ('💨', 'air', 'дме', '{"напрям": "всі"}', '{"🔥","🌊"}', 'простір', 'рухати'),
  ('🌍', 'earth', 'обертається', '{"життя": true}', '{"🌊","🔥","💨"}', 'планета', 'народжувати'),
  ('🧬', 'dna', 'реплікується', '{"код": "ATGC"}', '{"🌍","⚛️"}', 'клітина', 'еволюціонувати'),
  ('🧠', 'mind', 'мислить', '{"свідомість": "емерджентна"}', '{"🧬","🌌"}', 'мозок', 'усвідомлювати'),
  ('🔮', 'oracle', 'передбачає', '{"час": "нелінійний"}', '{"⚛️","🧠"}', 'між_світами', 'знати')
on conflict ("🧬") do nothing;

-- Створити резонанси
update "🧬" set "🔗" = "🔗" || '{"🧠"}' where "🧬" = '🌌';
update "🧬" set "🔗" = "🔗" || '{"🔮"}' where "🧬" = '🧠';

-- Матеріалізований вид для швидкого резонансу
create materialized view if not exists "резонансна_матриця" as
select 
  a."🧬" as "від",
  b."🧬" as "до",
  array_length(
    array(
      select unnest(a."🔗") 
      intersect 
      select unnest(b."🔗")
    ), 
    1
  )::float / greatest(
    array_length(a."🔗", 1), 
    array_length(b."🔗", 1),
    1
  ) as "сила_резонансу"
from "🧬" a, "🧬" b
where a.id != b.id
  and exists (
    select 1 from unnest(a."🔗") as x(v)
    join unnest(b."🔗") as y(v) on x.v = y.v
  );

create index if not exists "idx_резонансна_матриця" 
  on "резонансна_матриця" ("від", "до", "сила_резонансу");

-- Оновлювати матрицю при змінах
create or replace function "оновити_резонанс"() returns trigger as $$
begin
  refresh materialized view concurrently "резонансна_матриця";
  return new;
end;
$$ language plpgsql;

create trigger "тригер_оновлення_резонансу"
  after insert or update or delete on "🧬"
  for each statement
  execute function "оновити_резонанс"();