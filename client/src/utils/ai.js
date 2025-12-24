// AI content generation utility
const API_BASE = '/api/ai';

export async function generateAIContent(type, context = {}) {
  try {
    console.log("Generating AI content for type:", type);
    const response = await fetch(`${API_BASE}/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ type, context })
    });
    console.log(response);
    if (!response.ok) {
      throw new Error('Failed to generate AI content');
    }

    const data = await response.json();
    return data.content;
  } catch (error) {
    console.error('AI generation error:', error);
    // Return null to trigger fallback in component
    return null;
  }
}

// Helper to parse JSON content if needed
export function parseAIContent(content) {
  if (typeof content === 'string') {
    try {
      return JSON.parse(content);
    } catch (e) {
      return content;
    }
  }
  return content;
}

