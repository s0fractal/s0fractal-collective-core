-- add-field.sql - додаємо друге поле

-- Додаємо поле для опису/значення
alter table "🧬" add column if not exists "📝" text;

-- Оновлюємо існуючий запис
update "🧬" set "📝" = 'початок' where "🧬" = '🧬';