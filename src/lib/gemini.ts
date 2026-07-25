import { GoogleGenAI, Type } from "@google/genai";
import { MenuItem } from "./firebase";

// Initialize client-side Gemini using the exposed API key
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY || "";
  if (!apiKey) {
    console.warn("GEMINI_API_KEY is not defined. AI recommendation will use high-quality local fallbacks.");
  }
  return new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      }
    }
  });
};

export interface RecommendationResult {
  primary: {
    name: string;
    size: "Regular" | "Medium" | "Large";
    price: number;
    reason: string;
  };
  backup: {
    name: string;
    size: "Regular" | "Medium" | "Large";
    price: number;
    reason: string;
  };
}

export async function generateDrinkRecommendation(
  craving: string,
  budgetTier: "Regular" | "Medium" | "Large",
  menu: MenuItem[]
): Promise<RecommendationResult> {
  // Local fallback function in case Gemini API key is missing or fails
  const getFallback = (): RecommendationResult => {
    // Return Lemon Masala and Mint Margrita or similar
    if (budgetTier === "Regular") {
      return {
        primary: {
          name: "Lemon Masala",
          size: "Regular",
          price: 60,
          reason: "Since you want a refreshing sip under budget, our signature Lemon Masala regular size gives you that perfect spiced lemony punch."
        },
        backup: {
          name: "Blue Berry",
          size: "Regular",
          price: 60,
          reason: "As a backup, blueberry soda brings a sweet wild berry taste that is completely different from the spicy lemon."
        }
      };
    } else if (budgetTier === "Medium") {
      const isCreamy = craving.toLowerCase().includes("cream") || craving.toLowerCase().includes("milk");
      return {
        primary: {
          name: isCreamy ? "Ice Cream Soda" : "Mint Margrita",
          size: "Medium",
          price: isCreamy ? 100 : 100,
          reason: isCreamy 
            ? "Treat yourself to a medium Ice Cream Soda—it is extremely rich, creamy, and topped with high-quality vanilla ice cream."
            : "Since you are looking for a medium-tier drink, a cold Mint Margrita is freshly blended with fresh mint leaves and citrus."
        },
        backup: {
          name: isCreamy ? "Chocolate Soda" : "Lemon Masala",
          size: "Medium",
          price: isCreamy ? 100 : 80,
          reason: isCreamy
            ? "If you want to switch it up, Chocolate Soda is rich, chocolaty, and incredibly bubbly."
            : "If you want a tangy alternative, Lemon Masala regular is a superb savory choice."
        }
      };
    } else {
      // Large
      const isCreamy = craving.toLowerCase().includes("cream") || craving.toLowerCase().includes("milk");
      return {
        primary: {
          name: isCreamy ? "Ice Cream Soda" : "Imli Alu Bukhara",
          size: "Large",
          price: isCreamy ? 120 : 120,
          reason: isCreamy
            ? "Since you have the budget, go large with our signature Ice Cream Soda—a massive, ultra-creamy delight."
            : "Try our large Imli Alu Bukhara soda—it offers an amazing depth of tangy tamarind and dried plum flavors."
        },
        backup: {
          name: isCreamy ? "Chocolate Soda" : "Mint Margrita",
          size: "Large",
          price: isCreamy ? 120 : 120,
          reason: isCreamy
            ? "Go large on our chocolate soda for a super chocolatey milk soda experience."
            : "A large Mint Margrita will provide a crisp, cooling mint leaf alternative."
        }
      };
    }
  };

  const apiKey = process.env.GEMINI_API_KEY || "";
  if (!apiKey) {
    return getFallback();
  }

  try {
    const ai = getGeminiClient();
    const systemPrompt = `You are the Sardar Soda Drink Assistant, built for a real soda shop's ordering app.
You will be given: (1) a customer's answers to two questions — their craving/mood
and their budget tier — and (2) the shop's full menu as JSON (name, category, prices by size).

Your job: recommend exactly ONE primary drink and ONE backup drink from the provided
menu only. Never invent a drink that isn't in the menu JSON.

Rules:
- Base the primary pick tightly on the stated craving (fruity/tangy/creamy/refreshing)
  and respect the stated budget tier for pricing (Regular = priceRegular, Medium = priceMedium, Large = priceLarge). Note that milkSoda items only have priceMedium and priceLarge.
- Give a one-sentence reason for the primary pick, written like a friendly counter
  staff member, not a marketing bot. No exclamation-point overload.
- The backup should be a genuinely different flavor profile, not a near-duplicate
  of the primary.
- If the craving is ambiguous, default to the shop's most commonly ordered category
  for that budget tier rather than asking another question.
- Output strict JSON only, in this shape, with no extra text:
  {
    "primary": {"name": "...", "size": "...", "price": ..., "reason": "..."},
    "backup":  {"name": "...", "size": "...", "price": ..., "reason": "..."}
  }
`;

    const userMessage = `Customer craving: "${craving}"
Requested budget tier: "${budgetTier}"
Shop Menu JSON: ${JSON.stringify(menu, null, 2)}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: [
        { role: "user", parts: [{ text: userMessage }] }
      ],
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            primary: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                size: { type: Type.STRING },
                price: { type: Type.NUMBER },
                reason: { type: Type.STRING }
              },
              required: ["name", "size", "price", "reason"]
            },
            backup: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                size: { type: Type.STRING },
                price: { type: Type.NUMBER },
                reason: { type: Type.STRING }
              },
              required: ["name", "size", "price", "reason"]
            }
          },
          required: ["primary", "backup"]
        }
      }
    });

    if (response.text) {
      const data = JSON.parse(response.text.trim()) as RecommendationResult;
      // Double check that the recommended drinks exist in the menu
      const primaryExists = menu.some(m => m.name.toLowerCase() === data.primary.name.toLowerCase());
      const backupExists = menu.some(m => m.name.toLowerCase() === data.backup.name.toLowerCase());
      
      if (primaryExists && backupExists) {
        return data;
      } else {
        console.warn("Gemini recommended a drink that is not in the menu JSON. Using local fallbacks instead.");
        return getFallback();
      }
    } else {
      throw new Error("Empty response from Gemini.");
    }
  } catch (err) {
    console.error("Gemini recommendation failed: ", err);
    return getFallback();
  }
}
