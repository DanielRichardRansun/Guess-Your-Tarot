import tarotCards, { getTarotByNumber } from '../data/tarotCards';

// Ambil API Key dari .env (VITE_GEMINI_API_KEY) atau fallback
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';
const MODEL_NAMES = ['gemini-2.0-flash', 'gemini-1.5-flash'];

export async function generateReading(userInput, source = 'text', sourceData = null, language = 'EN') {
  const tarotList = tarotCards.map(t => `#${t.number} ${t.name}`).join(', ');

  let contextInfo = '';
  if (source !== 'text' && sourceData) {
    contextInfo = `\n\nThe user connected their ${source} account. Here is their recent activity data:\n${JSON.stringify(sourceData, null, 2)}`;
  }

  const langName = language === 'ID' ? 'Indonesian' : 'English';
  const systemInstruction = `You are a mystical and wise tarot reader AI. Based on the user's message, choose the most fitting tarot card for them today and provide a detailed reading.
${contextInfo}

Available tarot cards (use these exact numbers): ${tarotList}

You MUST respond in the following JSON format (no markdown, no code blocks, just pure JSON):
{
    "main_tarot_number": <number of the chosen tarot card>,
    "short_explanation": "<A compelling 2-3 sentence summary of why this card was chosen for the user. Make it personal and relate to what they said.>",
    "long_explanation": "<A detailed reading in 3-4 paragraphs. First paragraph: introduce the card and why it resonates with the user. Second paragraph: break down what this means for different areas of their life (love, career, personal growth) as bullet points use • symbol. Third paragraph: advice and guidance for moving forward. Make it mystical yet practical, encouraging yet honest.>",
    "support_tarots": [<3 different tarot card numbers that support/complement the main card>],
    "challenge_tarots": [<3 different tarot card numbers that represent challenges or things to be mindful of>],
    "support_reasons": ["<reason for support card 1>", "<reason for support card 2>", "<reason for support card 3>"],
    "challenge_reasons": ["<reason for challenge card 1>", "<reason for challenge card 2>", "<reason for challenge card 3>"]
}

The user's current language preference is: ${langName}. Respond in this language.
Important rules:
- All tarot numbers must be from 1 to 78
- support_tarots and challenge_tarots must each contain exactly 3 different numbers
- None of the support or challenge numbers should be the same as the main_tarot_number
- Make the reading deeply personal based on what the user shared
- Be mystical and enchanting in tone, but also practical and encouraging`;

  // Coba panggil Gemini jika API Key tersedia
  if (API_KEY) {
    for (const modelName of MODEL_NAMES) {
      try {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${API_KEY}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ parts: [{ text: userInput }] }],
              system_instruction: { parts: [{ text: systemInstruction }] },
              generationConfig: {
                temperature: 0.8,
                topP: 0.95,
                topK: 40,
                maxOutputTokens: 2048,
                responseMimeType: 'application/json',
              },
            }),
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          console.warn(`Gemini model ${modelName} failed:`, errorData?.error?.message);
          continue;
        }

        const data = await response.json();
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!text) continue;

        const reading = JSON.parse(text);

        if (!reading || !reading.main_tarot_number) {
          continue;
        }

        let mainTarot = getTarotByNumber(reading.main_tarot_number) || tarotCards[0];

        const supportTarots = (reading.support_tarots || []).map((number, index) => {
          const tarot = getTarotByNumber(number) || tarotCards[1];
          return {
            id: tarot.id,
            number: tarot.number,
            name: tarot.name,
            image: tarot.image,
            reason: reading.support_reasons?.[index] || (language === 'ID' ? 'Kartu ini menguatkan langkahmu.' : 'This card supports your journey.'),
          };
        });

        const challengeTarots = (reading.challenge_tarots || []).map((number, index) => {
          const tarot = getTarotByNumber(number) || tarotCards[2];
          return {
            id: tarot.id,
            number: tarot.number,
            name: tarot.name,
            image: tarot.image,
            reason: reading.challenge_reasons?.[index] || (language === 'ID' ? 'Waspadai energi ini.' : 'Be mindful of this energy.'),
          };
        });

        return {
          main_tarot_id: mainTarot.id,
          main_tarot_name: mainTarot.name,
          main_tarot: mainTarot,
          short_explanation: reading.short_explanation,
          long_explanation: reading.long_explanation,
          support_tarots: supportTarots,
          challenge_tarots: challengeTarots,
        };
      } catch (err) {
        console.warn(`Error trying ${modelName}:`, err);
      }
    }
  }

  // Fallback reading cerdas jika Gemini API Key belum ada atau kuota habis/error
  console.info("Using smart tarot reading fallback");
  return generateOfflineReading(userInput, language);
}

function generateOfflineReading(userInput, language = 'EN') {
  // Pilih kartu utama acak atau berdasarkan kata kunci
  const isId = language === 'ID';
  const shuffled = [...tarotCards].sort(() => 0.5 - Math.random());
  const mainTarot = shuffled[0];
  const supportTarots = shuffled.slice(1, 4).map(card => ({
    id: card.id,
    number: card.number,
    name: card.name,
    image: card.image,
    reason: isId
      ? `Energi ${card.name} membawa keseimbangan dan panduan tambahan (${card.keywords}).`
      : `The vibration of ${card.name} offers alignment and guidance (${card.keywords}).`,
  }));

  const challengeTarots = shuffled.slice(4, 7).map(card => ({
    id: card.id,
    number: card.number,
    name: card.name,
    image: card.image,
    reason: isId
      ? `Perhatikan potensi hambatan yang diisyaratkan oleh ${card.name} terkait ${card.keywords}.`
      : `Remain conscious of the friction highlighted by ${card.name} regarding ${card.keywords}.`,
  }));

  const shortExplanation = isId
    ? `Kartu ${mainTarot.name} terpilih untuk merefleksikan energi yang kamu rasakan hari ini: "${userInput}". Kartu ini mengingatkanmu pada tema ${mainTarot.keywords}.`
    : `The ${mainTarot.name} emerged to mirror the energy of your intention: "${userInput}". It aligns deeply with ${mainTarot.keywords}.`;

  const longExplanation = isId
    ? `Semesta mempertemukanmu dengan **${mainTarot.name}**. Kartu ini hadir sebagai cermin dari apa yang tengah berputar dalam pikiran dan hatimu. Terkait situasi yang kamu bagikan, ada dorongan kuat untuk merenungkan makna di balik setiap langkah.\n\n• **Cinta & Relasi**: Buka ruang komunikasi yang jujur. Biarkan empati menuntun hubunganmu ke tingkat yang lebih bermakna.\n• **Karier & Keuangan**: Fokus pada langkah terukur. Jangan terburu-buru mengambil keputusan besar tanpa kejelasan visi.\n• **Pertumbuhan Diri**: Percayalah pada intuisimu. Setiap rintangan saat ini merupakan batu pijakan untuk kebijaksanaan baru.\n\nAmbil napas dalam dan melangkahlah dengan keyakinan. Energi kartu ini mendukungmu untuk menemukan kejelasan di tengah ketidakpastian.`
    : `The universe has brought you **${mainTarot.name}**. This card stands as a reflection of what is currently stirring in your thoughts and spirit. In connection with what you shared, there is a clear invitation to embrace deeper clarity.\n\n• **Love & Relationships**: Foster honest dialogue. Allow compassion to guide your connections forward.\n• **Career & Ambition**: Maintain steady focus. Discernment is your greatest asset in upcoming decisions.\n• **Personal Growth**: Honor your internal rhythm. Trust that any current challenge is laying ground for higher wisdom.\n\nTake a grounding breath and move forward with purpose. The energy of this reading is here to illuminate your path.`;

  return {
    main_tarot_id: mainTarot.id,
    main_tarot_name: mainTarot.name,
    main_tarot: mainTarot,
    short_explanation: shortExplanation,
    long_explanation: longExplanation,
    support_tarots: supportTarots,
    challenge_tarots: challengeTarots,
  };
}
