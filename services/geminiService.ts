
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getSearchSuggestions = async (query: string): Promise<string[]> => {
  if (!query || query.length < 3) return [];
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
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
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Write a compelling property description for a ${propertyData.bedrooms} BHK ${propertyData.type === 'RENT' ? 'rental' : 'sale'} property in ${propertyData.location} with ${propertyData.bathrooms} bathrooms. Highlight the area of ${propertyData.area} sqft.`,
    });
    return response.text || "No description generated.";
  } catch (error) {
    return "Error generating AI description.";
  }
};

export const getNearbyFacilities = async (location: string): Promise<any> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `List nearby hospitals, schools, and transport hubs in ${location}.`,
      config: {
        tools: [{ googleMaps: {} }],
      }
    });
    return response.text;
  } catch (error) {
    return "Facility information currently unavailable.";
  }
};
