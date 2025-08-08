// src/utils/readingTime.ts

export interface ReadingTimeResult {
  minutes: number;
  words: number;
  text: string;
}

/**
 * コンテンツの読了時間を計算
 * @param content HTMLまたはプレーンテキストのコンテンツ
 * @param options 計算オプション
 * @returns 読了時間の情報
 */
export function calculateReadingTime(
  content: string,
  options: {
    wordsPerMinute?: number; // 日本語: 文字/分, 英語: 単語/分
    includeImages?: boolean; // 画像閲覧時間を含めるか
    imageTime?: number; // 1画像あたりの時間（秒）
  } = {}
): ReadingTimeResult {
  const {
    wordsPerMinute = 400, // 日本語の平均読解速度（文字/分）
    includeImages = true,
    imageTime = 12 // 1画像あたり12秒
  } = options;

  if (!content || content.trim().length === 0) {
    return {
      minutes: 1,
      words: 0,
      text: '1分で読める'
    };
  }

  // HTMLタグを除去
  const cleanText = content.replace(/<[^>]*>/g, '');
  
  // 日本語文字数カウント（ひらがな、カタカナ、漢字、数字、アルファベット）
  const japaneseChars = cleanText.match(/[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF\u3400-\u4DBF]/g);
  const japaneseCharCount = japaneseChars ? japaneseChars.length : 0;
  
  // 英語単語数カウント
  const englishWords = cleanText.match(/\b[A-Za-z]+\b/g);
  const englishWordCount = englishWords ? englishWords.length : 0;
  
  // 数字・記号など
  const otherChars = cleanText.replace(/[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF\u3400-\u4DBF\s]/g, '').replace(/\b[A-Za-z]+\b/g, '');
  const otherCharCount = otherChars.length;

  // 総文字数（日本語文字 + 英語単語×5 + その他文字）
  const totalCharCount = japaneseCharCount + (englishWordCount * 5) + otherCharCount;
  
  // 画像読み取り時間
  let imageMinutes = 0;
  if (includeImages) {
    const images = content.match(/<img[^>]*>/gi);
    const imageCount = images ? images.length : 0;
    imageMinutes = (imageCount * imageTime) / 60; // 分に変換
  }

  // 読了時間計算
  const textMinutes = totalCharCount / wordsPerMinute;
  const totalMinutes = Math.max(1, Math.ceil(textMinutes + imageMinutes));

  return {
    minutes: totalMinutes,
    words: totalCharCount,
    text: formatReadingTime(totalMinutes)
  };
}

/**
 * 読了時間をフォーマット
 */
function formatReadingTime(minutes: number): string {
  if (minutes < 1) {
    return '1分未満で読める';
  } else if (minutes === 1) {
    return '1分で読める';
  } else if (minutes < 60) {
    return `${minutes}分で読める`;
  } else {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    
    if (remainingMinutes === 0) {
      return `${hours}時間で読める`;
    } else {
      return `${hours}時間${remainingMinutes}分で読める`;
    }
  }
}

/**
 * 簡易版読了時間計算（ArticleCard用）
 */
export function calculateReadingTimeSimple(content: string): number {
  const result = calculateReadingTime(content);
  return result.minutes;
}

/**
 * 記事の文字数統計
 */
export function getContentStats(content: string) {
  const cleanText = content.replace(/<[^>]*>/g, '');
  
  const japaneseChars = cleanText.match(/[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF\u3400-\u4DBF]/g);
  const englishWords = cleanText.match(/\b[A-Za-z]+\b/g);
  const images = content.match(/<img[^>]*>/gi);
  const links = content.match(/<a[^>]*>/gi);
  const codeBlocks = content.match(/```[\s\S]*?```/g);
  
  return {
    totalCharacters: cleanText.length,
    japaneseCharacters: japaneseChars ? japaneseChars.length : 0,
    englishWords: englishWords ? englishWords.length : 0,
    images: images ? images.length : 0,
    links: links ? links.length : 0,
    codeBlocks: codeBlocks ? codeBlocks.length : 0,
    readingTime: calculateReadingTime(content)
  };
}