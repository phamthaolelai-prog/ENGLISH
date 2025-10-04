
// SCORING HELPERS
function normalize(s: string): string {
  return (s || '')
    .toLowerCase()
    .replace(/’/g, "'")
    .replace(/[^a-z0-9' ]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function levenshtein(a: string, b: string): number {
  a = normalize(a);
  b = normalize(b);
  const al = a.length, bl = b.length;
  if (al === 0) return bl;
  if (bl === 0) return al;
  const dp = Array.from({ length: al + 1 }, () => Array(bl + 1).fill(0));
  for (let i = 0; i <= al; i++) dp[i][0] = i;
  for (let j = 0; j <= bl; j++) dp[0][j] = j;
  for (let i = 1; i <= al; i++) {
    for (let j = 1; j <= bl; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + cost);
    }
  }
  return dp[al][bl];
}

export function score10(target: string, spoken: string): number {
  const A = normalize(target), B = normalize(spoken);
  if (!B) return 1;
  const dist = levenshtein(A, B);
  const maxLen = Math.max(A.length, B.length) || 1;
  const sim = Math.max(0, 1 - dist / maxLen);
  let s = Math.round(sim * 9) + 1; // 1..10
  s = Math.max(1, Math.min(10, s));
  return s;
}

// GRAMMAR HELPERS
export function conjVerb(base: string, subj: string): string {
  const third = (subj === 'He' || subj === 'She' || subj === 'It');
  if (!third) return base;
  if (base === 'have') return 'has';
  if (base === 'do') return 'does';
  if (base === 'go') return 'goes';
  if (base.endsWith('y') && !/[aeiou]y$/i.test(base)) return base.slice(0, -1) + 'ies';
  if (/(s|x|z|ch|sh)$/.test(base)) return base + 'es';
  return base + 's';
}

export function routineToText(verb: string, subj: string): string {
    const parts = verb.split(' ');
    const base = parts[0];
    const rest = parts.slice(1).join(' ');
    const conjugated = conjVerb(base, subj);
    return conjugated + (rest ? (' ' + rest) : '');
}

export function timeToWords(h: string, m: string, ampm: string): string {
    const hour = parseInt(h, 10);
    const min = parseInt(m, 10);
    const names = ["twelve", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven"];
    const hh = names[hour % 12 === 0 ? 0 : hour % 12];
    let mm = "";
    if (min === 0) mm = "o’clock";
    else if (min === 30) mm = "thirty";
    else if (min === 45) mm = "forty-five";
    else mm = String(min).padStart(2, '0');
    return `${hh} ${mm}${ampm ? (' ' + ampm.toLowerCase()) : ''}`.trim();
}
