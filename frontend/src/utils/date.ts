/**
 * Formata uma data para o padrão brasileiro dd/mm/yyyy.
 * Aceita string ISO (ex: "2026-04-14T00:00:00.000Z") ou objeto Date.
 */
export function formatDateBR(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}

/**
 * Formata data e hora para o padrão brasileiro dd/mm/yyyy HH:mm.
 */
export function formatDateTimeBR(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  return `${day}/${month}/${year} ${hours}:${minutes}`;
}

/**
 * Formata o campo "period" retornado pelo backend para exibição na tabela.
 * - Dia   "2026-04-14"  → "14/04/2026"
 * - Mês   "2026-04"     → "04/2026"
 * - Semana "2026-W15"   → "Sem. 15/2026"
 */
export function formatPeriodBR(period: string): string {
  if (/^\d{4}-\d{2}-\d{2}$/.test(period)) {
    const [year, month, day] = period.split('-');
    return `${day}/${month}/${year}`;
  }
  if (/^\d{4}-\d{2}$/.test(period)) {
    const [year, month] = period.split('-');
    return `${month}/${year}`;
  }
  const weekMatch = period.match(/^(\d{4})-W(\d+)$/);
  if (weekMatch) {
    return `Sem. ${weekMatch[2]}/${weekMatch[1]}`;
  }
  return period;
}

/**
 * Versão curta para labels de eixo X em gráficos.
 * - Dia    "2026-04-14" → "14/04"
 * - Mês    "2026-04"    → "04/26"
 * - Semana "2026-W15"   → "S15"
 */
export function formatPeriodShortBR(period: string): string {
  if (/^\d{4}-\d{2}-\d{2}$/.test(period)) {
    const [, month, day] = period.split('-');
    return `${day}/${month}`;
  }
  if (/^\d{4}-\d{2}$/.test(period)) {
    const [year, month] = period.split('-');
    return `${month}/${year.slice(2)}`;
  }
  const weekMatch = period.match(/^(\d{4})-W(\d+)$/);
  if (weekMatch) {
    return `S${weekMatch[2]}`;
  }
  return period;
}
