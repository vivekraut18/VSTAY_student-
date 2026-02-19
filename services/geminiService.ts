
import { GoogleGenAI, Type } from "@google/genai";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || process.env.API_KEY || '';
const hasValidKey = GEMINI_API_KEY && GEMINI_API_KEY !== 'PLACEHOLDER_API_KEY';

const ai = hasValidKey ? new GoogleGenAI({ apiKey: GEMINI_API_KEY }) : null;

export const getSearchSuggestions = async (query: string): Promise<string[]> => {
  if (!query || query.length < 3 || !ai) return [];

  try {
    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: `Based on the search query "${query}", suggest 5 real-estate related search terms or areas. Return as a clean JSON list of strings.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        }
      }
    });

    const text = response.text;
    return JSON.parse(text || '[]');
  } catch (error) {
    console.error("AI Suggestions error:", error);
    return [];
  }
};

export const getPropertyDescription = async (propertyData: any): Promise<string> => {
  if (!ai) return "AI service not configured.";
  try {
    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: `Write a compelling description for a ${propertyData.bedrooms} BHK ${propertyData.type === 'FLAT' ? 'rented flat' : 'Room / PG'} in ${propertyData.location} with ${propertyData.bathrooms} bathrooms. Highlight the area of ${propertyData.area} sqft. This is for student accommodation.`,
    });
    return response.text || "No description generated.";
  } catch (error) {
    console.error("AI Description error:", error);
    return "Error generating AI description.";
  }
};

export const getNearbyFacilities = async (location: string): Promise<any> => {
  if (!ai) return "Facility information currently unavailable.";
  try {
    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: `List nearby hospitals, schools, and transport hubs in ${location}.`,
      // Removed tools config for simplicity as gemini-1.5-flash might not support it the same way here
    });
    return response.text;
  } catch (error) {
    console.error("AI Facilities error:", error);
    return "Facility information currently unavailable.";
  }
};
