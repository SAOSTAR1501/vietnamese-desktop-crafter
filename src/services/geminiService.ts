
/**
 * Service for handling Gemini API requests
 */

export const fetchGeminiResponse = async (prompt: string, key: string) => {
  const apiUrl = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent";
  
  const response = await fetch(`${apiUrl}?key=${key}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            {
              text: prompt
            }
          ]
        }
      ],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
      }
    })
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error?.message || 'Unknown error');
  }

  const data = await response.json();
  return data.candidates[0].content.parts[0].text || 'Không có phản hồi từ AI';
};
