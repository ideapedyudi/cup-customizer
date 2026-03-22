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

    // Call the official @openrouter/sdk according to its data type
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

    // Validate response
    if (!response || !response.choices || response.choices.length === 0) {
      throw new Error("OpenRouter returned an empty response or a network error occurred.");
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

    // 2. Standard OpenRouter: array content containing image_url objects
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

    // Safety Fallback if no image and only empty string
    if (!contentString || contentString.trim() === "") {
      console.error("DEBUG OpenRouter Raw Response:", JSON.stringify(response, null, 2));
      throw new Error(`OpenRouter responded with unrecognized format or empty. Check the console log for payload details.`);
    }

    // 3. Raw Base64 detection
    const isRawBase64 = contentString.length > 500 && !contentString.includes(' ');
    if (isRawBase64) {
      if (contentString.startsWith('data:image')) return contentString;
      return `data:image/png;base64,${contentString}`;
    }

    // 4. Detect URL or headered Base64 within Markdown text
    const markdownImgRegex = /!\[.*?\]\((https?:\/\/[^\s)]+)\)/;
    const rawUrlRegex = /(https?:\/\/[^\s)]+)/;
    const base64Regex = /(data:image\/[a-zA-Z]+;base64,[^\s"']+)/;

    const base64Match = contentString.match(base64Regex);
    if (base64Match && base64Match[1]) return base64Match[1];

    const markdownMatch = contentString.match(markdownImgRegex);
    if (markdownMatch && markdownMatch[1]) return markdownMatch[1];

    const rawMatch = contentString.match(rawUrlRegex);
    if (rawMatch && rawMatch[0]) return rawMatch[0];

    // If all detection blocks fail to capture the image/URL/Base64 format
    throw new Error("OpenRouter did not return a pure image. This model might be misconfigured or only return plain text.");

  } catch (error) {
    console.error('Error using @openrouter/sdk:', error);
    throw error;
  }
};
