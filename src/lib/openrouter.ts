import { OpenRouter } from '@openrouter/sdk';

export const generateDesignPrompt = async (userInput: string): Promise<string> => {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new Error('OpenRouter API key is not configured. Please set NEXT_PUBLIC_OPENROUTER_API_KEY in your .env.local file.');
  }

  // Compile a powerful prompt for the image generator ensuring a pristine white background for the multiplier blend
  const finalPrompt = `A single, isolated, highly detailed logo design. high quality. Subject: ${userInput}`;

  try {
    const openRouter = new OpenRouter({ apiKey });

    // Panggil SDK resmi @openrouter/sdk sesuai tipe datanya
    const response = await openRouter.chat.send({
      httpReferer: "http://localhost:3000",
      xTitle: "Cup Customizer",
      chatGenerationParams: {
        model: process.env.OPENROUTER_MODEL || "sourceful/riverflow-v2-pro",
        messages: [
          {
            role: "user",
            content: finalPrompt
          }
        ]
      }
    });

    // Validasi respons
    if (!response || !response.choices || response.choices.length === 0) {
      throw new Error("OpenRouter mengembalikan respons kosong atau terjadi kesalahan jaringan.");
    }

    const message = response.choices[0].message as any;
    if (message.images && Array.isArray(message.images) && message.images.length > 0) {
      const directImageUrl = message.images[0].imageUrl?.url || message.images[0].url;
      if (directImageUrl) {
        console.log("Found direct image in message.images!");
        return directImageUrl;
      }
    }

    const messageContent = message.content;
    let contentString = "";
    let extractedUrl = "";

    // 2. OpenRouter standar: konten array berisi objek image_url
    if (Array.isArray(messageContent)) {
      for (const part of messageContent as any[]) {
        if (part.type === "image_url" && part.image_url?.url) {
          extractedUrl = part.image_url.url;
        } else if (part.type === "text" && part.text) {
          contentString += part.text;
        }
      }
    } else if (typeof messageContent === "string") {
      contentString = messageContent;
    }

    if (extractedUrl) return extractedUrl;

    // Safety Fallback jika tidak ada gambar dan cuman string kosong
    if (!contentString || contentString.trim() === "") {
      console.error("DEBUG OpenRouter Raw Response:", JSON.stringify(response, null, 2));
      throw new Error(`OpenRouter membalas dengan format yang tidak dikenali atau kosong. Periksa log konsol untuk detail payload.`);
    }

    // 3. Deteksi Base64 mentah
    const isRawBase64 = contentString.length > 500 && !contentString.includes(' ');
    if (isRawBase64) {
      if (contentString.startsWith('data:image')) return contentString;
      return `data:image/png;base64,${contentString}`;
    }

    // 4. Deteksi URL atau Base64 ber-header di dalam teks Markdown
    const markdownImgRegex = /!\[.*?\]\((https?:\/\/[^\s)]+)\)/;
    const rawUrlRegex = /(https?:\/\/[^\s)]+)/;
    const base64Regex = /(data:image\/[a-zA-Z]+;base64,[^\s"']+)/;

    const base64Match = contentString.match(base64Regex);
    if (base64Match && base64Match[1]) return base64Match[1];

    const markdownMatch = contentString.match(markdownImgRegex);
    if (markdownMatch && markdownMatch[1]) return markdownMatch[1];

    const rawMatch = contentString.match(rawUrlRegex);
    if (rawMatch && rawMatch[0]) return rawMatch[0];

    // Jika semua blok deteksi gagal menangkap format gambar/URL/Base64
    throw new Error("OpenRouter tidak mengembalikan gambar murni. Model ini mungkin salah di-konfigurasi atau hanya mereturn teks biasa.");

  } catch (error) {
    console.error('Error menggunakan @openrouter/sdk:', error);
    throw error;
  }
};
