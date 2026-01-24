/**
 * カテゴリカラーユーティリティ
 *
 * カテゴリ名に基づいて一貫した色を返す
 * 同じカテゴリ名は常に同じ色になる
 */

// カラーパレット定義（Zenn風のカラフルな色）
const COLOR_PALETTE = [
  {
    name: 'cyan',
    bg: 'from-cyan-500/20 to-cyan-600/20',
    bgHover: 'hover:from-cyan-500/30 hover:to-cyan-600/30',
    text: 'text-cyan-300',
    textHover: 'hover:text-cyan-200',
    border: 'border-cyan-400/40',
    icon: 'text-cyan-400',
  },
  {
    name: 'blue',
    bg: 'from-blue-500/20 to-blue-600/20',
    bgHover: 'hover:from-blue-500/30 hover:to-blue-600/30',
    text: 'text-blue-300',
    textHover: 'hover:text-blue-200',
    border: 'border-blue-400/40',
    icon: 'text-blue-400',
  },
  {
    name: 'purple',
    bg: 'from-purple-500/20 to-purple-600/20',
    bgHover: 'hover:from-purple-500/30 hover:to-purple-600/30',
    text: 'text-purple-300',
    textHover: 'hover:text-purple-200',
    border: 'border-purple-400/40',
    icon: 'text-purple-400',
  },
  {
    name: 'pink',
    bg: 'from-pink-500/20 to-pink-600/20',
    bgHover: 'hover:from-pink-500/30 hover:to-pink-600/30',
    text: 'text-pink-300',
    textHover: 'hover:text-pink-200',
    border: 'border-pink-400/40',
    icon: 'text-pink-400',
  },
  {
    name: 'amber',
    bg: 'from-amber-500/20 to-amber-600/20',
    bgHover: 'hover:from-amber-500/30 hover:to-amber-600/30',
    text: 'text-amber-300',
    textHover: 'hover:text-amber-200',
    border: 'border-amber-400/40',
    icon: 'text-amber-400',
  },
  {
    name: 'emerald',
    bg: 'from-emerald-500/20 to-emerald-600/20',
    bgHover: 'hover:from-emerald-500/30 hover:to-emerald-600/30',
    text: 'text-emerald-300',
    textHover: 'hover:text-emerald-200',
    border: 'border-emerald-400/40',
    icon: 'text-emerald-400',
  },
  {
    name: 'rose',
    bg: 'from-rose-500/20 to-rose-600/20',
    bgHover: 'hover:from-rose-500/30 hover:to-rose-600/30',
    text: 'text-rose-300',
    textHover: 'hover:text-rose-200',
    border: 'border-rose-400/40',
    icon: 'text-rose-400',
  },
  {
    name: 'indigo',
    bg: 'from-indigo-500/20 to-indigo-600/20',
    bgHover: 'hover:from-indigo-500/30 hover:to-indigo-600/30',
    text: 'text-indigo-300',
    textHover: 'hover:text-indigo-200',
    border: 'border-indigo-400/40',
    icon: 'text-indigo-400',
  },
];

// 特定のカテゴリに固定色を割り当て
const FIXED_CATEGORY_COLORS: Record<string, number> = {
  'AI': 0,           // cyan
  'Python': 1,       // blue
  'JavaScript': 3,   // pink
  'TypeScript': 1,   // blue
  'React': 0,        // cyan
  'Next.js': 7,      // indigo
  'Astro': 6,        // rose
  'Firebase': 4,     // amber
  'プログラミング': 2, // purple
  '開発': 5,         // emerald
  'Web開発': 0,      // cyan
};

/**
 * 文字列のハッシュ値を計算
 */
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

/**
 * カテゴリ名から色情報を取得
 */
export function getCategoryColor(category: string) {
  // 固定色が設定されている場合はそれを使用
  if (category in FIXED_CATEGORY_COLORS) {
    return COLOR_PALETTE[FIXED_CATEGORY_COLORS[category]];
  }

  // それ以外はハッシュ値から色を決定
  const index = hashString(category) % COLOR_PALETTE.length;
  return COLOR_PALETTE[index];
}

/**
 * カテゴリバッジのクラス名を生成
 */
export function getCategoryBadgeClasses(category: string): string {
  const color = getCategoryColor(category);
  return [
    'inline-flex items-center gap-1.5',
    'px-3 py-1.5 rounded-full',
    'text-sm font-semibold',
    'bg-gradient-to-r',
    color.bg,
    color.bgHover,
    color.text,
    color.textHover,
    'border',
    color.border,
    'shadow-sm',
    'transition-all duration-200',
    'hover:scale-105 hover:shadow-md',
  ].join(' ');
}

/**
 * カテゴリアイコンのクラス名を取得
 */
export function getCategoryIconClass(category: string): string {
  const color = getCategoryColor(category);
  return color.icon;
}
