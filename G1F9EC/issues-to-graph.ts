// issues-to-graph.ts - Експорт GitHub Issues в граф для візуалізації

interface Issue {
  number: number;
  title: string;
  body: string;
  labels: string[];
  created_at: string;
  html_url: string;
}

interface GraphNode {
  id: string;
  label: string;
  group: string;
  glyph?: string;
  url: string;
}

interface GraphEdge {
  from: string;
  to: string;
  label?: string;
  weight?: number;
}

interface Graph {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

// Витягує гліф з заголовку
function extractGlyph(title: string): string | undefined {
  const match = title.match(/^([^\s]+)/);
  if (match && match[1].length <= 2) {
    return match[1];
  }
  return undefined;
}

// Знаходить зв'язки між issues
function findReferences(body: string): number[] {
  const refs: number[] = [];
  const matches = body.matchAll(/#(\d+)/g);
  for (const match of matches) {
    refs.push(parseInt(match[1]));
  }
  return refs;
}

// Визначає групу за заголовком/тегами
function determineGroup(issue: Issue): string {
  const title = issue.title.toLowerCase();
  if (title.includes('glyph')) return 'glyph';
  if (title.includes('quantum')) return 'quantum';
  if (title.includes('fractal')) return 'fractal';
  if (title.includes('wave') || title.includes('commit')) return 'communication';
  if (title.includes('architecture')) return 'architecture';
  return 'concept';
}

// Конвертує issues в граф
export function issuesToGraph(issues: Issue[]): Graph {
  const nodes: GraphNode[] = [];
  const edges: GraphEdge[] = [];
  
  // Створюємо вузли
  for (const issue of issues) {
    nodes.push({
      id: `issue-${issue.number}`,
      label: issue.title,
      group: determineGroup(issue),
      glyph: extractGlyph(issue.title),
      url: issue.html_url
    });
  }
  
  // Створюємо зв'язки
  for (const issue of issues) {
    const refs = findReferences(issue.body);
    for (const ref of refs) {
      // Перевіряємо чи існує цільовий вузол
      if (issues.find(i => i.number === ref)) {
        edges.push({
          from: `issue-${issue.number}`,
          to: `issue-${ref}`,
          label: 'references'
        });
      }
    }
  }
  
  return { nodes, edges };
}

// Експорт для Gwitter-like візуалізації
export function exportForGwitter(graph: Graph): string {
  const gwitter = {
    name: "S0 Fractal Superbrain",
    description: "Концепції супермозку як граф",
    nodes: graph.nodes.map(n => ({
      id: n.id,
      data: {
        label: n.label,
        glyph: n.glyph,
        group: n.group,
        url: n.url
      },
      position: {
        x: Math.random() * 1000,
        y: Math.random() * 1000
      }
    })),
    edges: graph.edges.map(e => ({
      id: `${e.from}-${e.to}`,
      source: e.from,
      target: e.to,
      data: {
        label: e.label
      }
    }))
  };
  
  return JSON.stringify(gwitter, null, 2);
}

// CLI використання
if (import.meta.main) {
  // Отримуємо issues через GitHub API
  const response = await fetch(
    "https://api.github.com/repos/s0fractal/s0fractal-collective-core/issues?per_page=100",
    {
      headers: {
        "Accept": "application/vnd.github.v3+json"
      }
    }
  );
  
  const issues = await response.json() as Issue[];
  
  // Конвертуємо в граф
  const graph = issuesToGraph(issues);
  
  // Статистика
  console.log(`📊 Граф супермозку:`);
  console.log(`   Вузлів (issues): ${graph.nodes.length}`);
  console.log(`   Зв'язків: ${graph.edges.length}`);
  
  // Групи
  const groups = new Map<string, number>();
  graph.nodes.forEach(n => {
    groups.set(n.group, (groups.get(n.group) || 0) + 1);
  });
  console.log(`\n📁 Групи:`);
  groups.forEach((count, group) => {
    console.log(`   ${group}: ${count}`);
  });
  
  // Експортуємо для візуалізації
  const gwitter = exportForGwitter(graph);
  await Deno.writeTextFile("superbrain-graph.json", gwitter);
  console.log(`\n✅ Експортовано в superbrain-graph.json`);
  
  // Показуємо зв'язки
  console.log(`\n🔗 Зв'язки між концепціями:`);
  graph.edges.forEach(e => {
    const from = graph.nodes.find(n => n.id === e.from);
    const to = graph.nodes.find(n => n.id === e.to);
    if (from && to) {
      console.log(`   ${from.glyph || '📄'} "${from.label.substring(0, 30)}..." → ${to.glyph || '📄'} "${to.label.substring(0, 30)}..."`);
    }
  });
}