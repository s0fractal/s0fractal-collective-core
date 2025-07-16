// md-to-issues-migrator.ts - Мігрує MD файли в GitHub Issues з видаленням оригіналів

import { parse } from "https://deno.land/std@0.208.0/flags/mod.ts";

interface MigrationConfig {
  file: string;
  title: string;
  labels?: string[];
  deleteAfter: boolean;
}

// Витягує заголовок з MD файлу
async function extractTitle(filePath: string): Promise<string> {
  const content = await Deno.readTextFile(filePath);
  const match = content.match(/^#\s+(.+)$/m);
  return match ? match[1] : "Untitled";
}

// Конвертує MD контент для GitHub Issue
function convertMdToIssueBody(content: string, filePath: string): string {
  // Видаляємо перший заголовок (він буде в title)
  const bodyContent = content.replace(/^#\s+.+$/m, '').trim();
  
  // Додаємо метаінформацію
  const footer = `\n\n---\n**Джерело:** \`${filePath}\`\n**Мігровано:** ${new Date().toISOString()}`;
  
  return bodyContent + footer;
}

// Створює issue через GitHub CLI
async function createIssue(title: string, body: string, labels?: string[]): Promise<number> {
  const args = ["gh", "issue", "create", "--title", title, "--body", body];
  
  if (labels && labels.length > 0) {
    args.push("--label", labels.join(","));
  }
  
  const command = new Deno.Command(args[0], {
    args: args.slice(1),
    stdout: "piped",
    stderr: "piped"
  });
  
  const { stdout } = await command.output();
  const output = new TextDecoder().decode(stdout);
  
  // Витягуємо номер issue з URL
  const match = output.match(/\/issues\/(\d+)/);
  return match ? parseInt(match[1]) : 0;
}

// Видаляє файл через git
async function gitRemove(filePath: string, issueNumber: number): Promise<string> {
  // git rm
  await new Deno.Command("git", {
    args: ["rm", filePath]
  }).output();
  
  // git commit з посиланням на issue
  const commitMessage = `🗑️ Remove ${filePath.split('/').pop()} - moved to issue #${issueNumber}

Видалено оригінальний MD файл після перенесення в GitHub Issue.
Issue: https://github.com/s0fractal/s0fractal-collective-core/issues/${issueNumber}`;
  
  const commitCmd = new Deno.Command("git", {
    args: ["commit", "-m", commitMessage],
    stdout: "piped"
  });
  
  const { stdout } = await commitCmd.output();
  const output = new TextDecoder().decode(stdout);
  
  // Витягуємо hash коміту
  const match = output.match(/\[[\w\s]+\s+(\w+)\]/);
  return match ? match[1] : "unknown";
}

// Додає коментар до issue
async function addDeletionComment(issueNumber: number, commitHash: string): Promise<void> {
  const comment = `📍 **Оригінальний файл видалено**

Коміт: \`${commitHash}\`
Причина: Уникнення дублювання - концепція тепер живе тільки в цій issue.`;

  await new Deno.Command("gh", {
    args: ["issue", "comment", issueNumber.toString(), "--body", comment]
  }).output();
}

// Основна функція міграції
async function migrateMdToIssue(config: MigrationConfig): Promise<void> {
  console.log(`\n🔄 Мігрую: ${config.file}`);
  
  try {
    // Читаємо файл
    const content = await Deno.readTextFile(config.file);
    const title = config.title || await extractTitle(config.file);
    const body = convertMdToIssueBody(content, config.file);
    
    // Створюємо issue
    console.log(`📝 Створюю issue: "${title}"`);
    const issueNumber = await createIssue(title, body, config.labels);
    console.log(`✅ Issue створено: #${issueNumber}`);
    
    // Видаляємо файл якщо потрібно
    if (config.deleteAfter && issueNumber > 0) {
      console.log(`🗑️ Видаляю оригінал...`);
      const commitHash = await gitRemove(config.file, issueNumber);
      console.log(`✅ Видалено в коміті: ${commitHash}`);
      
      // Додаємо коментар
      await addDeletionComment(issueNumber, commitHash);
      console.log(`💬 Додано коментар до issue`);
    }
    
  } catch (error) {
    console.error(`❌ Помилка: ${error}`);
  }
}

// Пошук MD файлів для міграції
async function findMdFiles(directory: string): Promise<string[]> {
  const files: string[] = [];
  
  for await (const entry of Deno.readDir(directory)) {
    const path = `${directory}/${entry.name}`;
    
    if (entry.isDirectory && !entry.name.startsWith('.')) {
      files.push(...await findMdFiles(path));
    } else if (entry.isFile && entry.name.endsWith('.md')) {
      files.push(path);
    }
  }
  
  return files;
}

// CLI
if (import.meta.main) {
  const flags = parse(Deno.args, {
    string: ["file", "dir", "title", "labels"],
    boolean: ["delete", "dry-run", "help"],
    default: { delete: false, "dry-run": false }
  });
  
  if (flags.help) {
    console.log(`
Використання:
  deno run --allow-all md-to-issues-migrator.ts [options]

Опції:
  --file <path>     Мігрувати один файл
  --dir <path>      Мігрувати всі MD файли в директорії
  --title <title>   Встановити заголовок (інакше береться з файлу)
  --labels <l1,l2>  Додати теги до issue
  --delete          Видалити оригінал після міграції
  --dry-run         Показати що буде зроблено без виконання
  --help            Показати цю довідку

Приклади:
  # Мігрувати один файл з видаленням
  deno run --allow-all md-to-issues-migrator.ts --file concept.md --delete

  # Мігрувати всю директорію
  deno run --allow-all md-to-issues-migrator.ts --dir ./docs --delete
`);
    Deno.exit(0);
  }
  
  if (flags["dry-run"]) {
    console.log("🔍 DRY RUN MODE - нічого не буде змінено\n");
  }
  
  if (flags.file) {
    // Міграція одного файлу
    await migrateMdToIssue({
      file: flags.file,
      title: flags.title,
      labels: flags.labels?.split(','),
      deleteAfter: flags.delete && !flags["dry-run"]
    });
    
  } else if (flags.dir) {
    // Міграція директорії
    const files = await findMdFiles(flags.dir);
    console.log(`📁 Знайдено ${files.length} MD файлів\n`);
    
    for (const file of files) {
      if (!flags["dry-run"]) {
        await migrateMdToIssue({
          file,
          title: flags.title,
          labels: flags.labels?.split(','),
          deleteAfter: flags.delete
        });
      } else {
        console.log(`Would migrate: ${file}`);
      }
    }
    
  } else {
    console.log("❌ Вкажіть --file або --dir");
    console.log("Використайте --help для довідки");
  }
}