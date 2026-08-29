/**
 * Bhashini Multilingual NLP & Entity Matcher
 * Simulates Indian language transliteration (Hindi, Marathi, Bengali, Tamil)
 * and Record of Rights (RoR) attribute normalization
 */

export interface TransliterationResult {
  sourceText: string;
  sourceLanguage: 'Hindi' | 'Marathi' | 'Bengali' | 'Tamil' | 'Gujarati';
  translatedEnglish: string;
  normalizedOwnerName: string;
  extractedKhata: string;
  extractedKhasra: string;
  matchScore: number;
}

export function processBhashiniNLP(text: string): TransliterationResult {
  // Common revenue keywords matching
  const hasKhasra = text.includes('खेसरा') || text.includes('खसरा') || text.includes('गट');
  const hasKhata = text.includes('खाता') || text.includes('उतारा');

  // Realistic mock translation dictionary for demo
  if (text.includes('राजेश वर्मा')) {
    return {
      sourceText: text,
      sourceLanguage: 'Hindi',
      translatedEnglish: "Shri Rajesh Verma, S/o Ramavatar Verma, Khata No. 104, Khasra 412/B, Main Road Ranchi",
      normalizedOwnerName: "Rajesh Verma",
      extractedKhata: "104",
      extractedKhasra: "412/B",
      matchScore: 98.4
    };
  } else if (text.includes('सुनीता शर्मा')) {
    return {
      sourceText: text,
      sourceLanguage: 'Hindi',
      translatedEnglish: "Smt. Sunita Sharma, W/o Late Alok Sharma, Khata 103, Khasra 412/A",
      normalizedOwnerName: "Sunita Sharma",
      extractedKhata: "103",
      extractedKhasra: "412/A",
      matchScore: 97.8
    };
  } else if (text.includes('कुलकर्णी')) {
    return {
      sourceText: text,
      sourceLanguage: 'Marathi',
      translatedEnglish: "Sachin Vinayak Kulkarni, Gut No. 201/A, Kothrud, Pune",
      normalizedOwnerName: "Sachin Vinayak Kulkarni",
      extractedKhata: "302",
      extractedKhasra: "201/A",
      matchScore: 97.6
    };
  }

  return {
    sourceText: text,
    sourceLanguage: 'Hindi',
    translatedEnglish: text,
    normalizedOwnerName: "Verified Landholder",
    extractedKhata: hasKhata ? "101" : "N/A",
    extractedKhasra: hasKhasra ? "401" : "N/A",
    matchScore: 95.0
  };
}

/**
 * Phonetic string similarity (Levenshtein-based similarity)
 */
export function calculateNLPTokenSimilarity(str1: string, str2: string): number {
  const s1 = str1.toLowerCase().trim();
  const s2 = str2.toLowerCase().trim();
  if (s1 === s2) return 100;
  if (!s1.length || !s2.length) return 0;

  // Simple token overlap coefficient
  const tokens1 = new Set(s1.split(/\s+/));
  const tokens2 = new Set(s2.split(/\s+/));
  let intersection = 0;
  tokens1.forEach(t => {
    if (tokens2.has(t)) intersection++;
  });
  const union = new Set([...tokens1, ...tokens2]).size;
  return parseFloat(((intersection / union) * 100).toFixed(1));
}
