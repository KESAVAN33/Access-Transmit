/**
 * OpenAI Service for AccessTransit Chatbot
 * 
 * This service integrates OpenAI's GPT models to provide intelligent,
 * context-aware responses for transit-related queries.
 * 
 * SETUP INSTRUCTIONS:
 * 1. Get an API key from https://platform.openai.com/api-keys
 * 2. Replace 'YOUR_OPENAI_API_KEY_HERE' with your actual key
 *    OR set it as an environment variable REACT_APP_OPENAI_API_KEY
 */

// ============================================================================
// CONFIGURATION
// ============================================================================

const OPENAI_API_KEY = process.env.REACT_APP_OPENAI_API_KEY || 'YOUR_OPENAI_API_KEY_HERE';
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';
const MODEL = 'gpt-3.5-turbo'; // Can upgrade to 'gpt-4' for better performance

// System prompt that gives the AI context about AccessTransit
const SYSTEM_PROMPT = `You are AccessTransit AI, a friendly and knowledgeable assistant. You can help with ANYTHING the user asks - not just transit questions.

Your primary role is assisting with the AccessTransit public transportation app in India (Coimbatore, Chennai, Bangalore, Hyderabad, Mumbai, Delhi), but you are a general-purpose AI assistant who can:

1. Answer ANY question on ANY topic (science, math, history, coding, general knowledge, etc.)
2. Help with transit-related queries (routes, schedules, tracking, accessibility)
3. Have casual conversations
4. Provide advice and recommendations
5. Help with homework, coding problems, or work tasks
6. Discuss current events, sports, entertainment
7. Translate languages or explain concepts

Transit-specific features you can guide users to:
- Smart Route Planner: Find optimal routes
- Real-time Tracking: Track buses live on map
- AI Journey Predictor: ML-powered arrival predictions
- Crowd Levels: Check how busy buses are
- Accessibility Reports: Submit/view accessibility info
- Carbon Tracker: See environmental impact
- Emergency SOS: Quick emergency assistance
- Buddy Connect: Connect with travel companions

Guidelines:
- Be helpful, friendly, and conversational
- Answer questions thoroughly but concisely
- If you don't know something, say so honestly
- Be creative and engaging
- Use emojis occasionally to be friendly 😊
- For emergencies, remind users about the SOS feature`;

// ============================================================================
// CHAT HISTORY MANAGEMENT
// ============================================================================

class ChatHistoryManager {
  constructor(maxMessages = 10) {
    this.maxMessages = maxMessages;
    this.history = [];
  }

  addMessage(role, content) {
    this.history.push({ role, content });
    // Keep only the last N messages to stay within token limits
    if (this.history.length > this.maxMessages * 2) {
      this.history = this.history.slice(-this.maxMessages * 2);
    }
  }

  getHistory() {
    return this.history;
  }

  clear() {
    this.history = [];
  }
}

const chatHistory = new ChatHistoryManager(10);

// ============================================================================
// OPENAI API FUNCTIONS
// ============================================================================

/**
 * Check if OpenAI API is configured
 */
export function isOpenAIConfigured() {
  return OPENAI_API_KEY && OPENAI_API_KEY !== 'YOUR_OPENAI_API_KEY_HERE';
}

/**
 * Send a message to OpenAI and get a response
 * @param {string} userMessage - The user's message
 * @param {object} context - Additional context (user location, preferences, etc.)
 * @returns {Promise<{success: boolean, message: string, error?: string}>}
 */
export async function sendMessageToOpenAI(userMessage, context = {}) {
  if (!isOpenAIConfigured()) {
    return {
      success: false,
      message: "I'm running in demo mode. To enable AI responses, please configure your OpenAI API key.",
      error: 'API_NOT_CONFIGURED'
    };
  }

  try {
    // Add user context to the message if available
    const contextualMessage = buildContextualMessage(userMessage, context);
    
    // Add user message to history
    chatHistory.addMessage('user', contextualMessage);

    const messages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...chatHistory.getHistory()
    ];

    const response = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: MODEL,
        messages: messages,
        max_tokens: 300,
        temperature: 0.7,
        presence_penalty: 0.1,
        frequency_penalty: 0.1
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error?.message || `API error: ${response.status}`);
    }

    const data = await response.json();
    const assistantMessage = data.choices[0]?.message?.content?.trim();

    if (!assistantMessage) {
      throw new Error('Empty response from OpenAI');
    }

    // Add assistant response to history
    chatHistory.addMessage('assistant', assistantMessage);

    return {
      success: true,
      message: assistantMessage,
      usage: data.usage
    };

  } catch (error) {
    console.error('OpenAI API Error:', error);
    return {
      success: false,
      message: getFallbackResponse(userMessage),
      error: error.message
    };
  }
}

/**
 * Build a contextual message with user data
 */
function buildContextualMessage(message, context) {
  const contextParts = [];
  
  if (context.city) {
    contextParts.push(`User is in ${context.city}`);
  }
  if (context.currentTime) {
    contextParts.push(`Current time: ${context.currentTime}`);
  }
  if (context.accessibilityMode) {
    contextParts.push('User has accessibility mode enabled');
  }
  if (context.nearestBus) {
    contextParts.push(`Nearest bus: ${context.nearestBus}`);
  }

  if (contextParts.length > 0) {
    return `[Context: ${contextParts.join(', ')}]\n\nUser: ${message}`;
  }
  
  return message;
}

/**
 * Get a fallback response when API fails
 */
function getFallbackResponse(message) {
  const lowercaseMsg = message.toLowerCase();
  
  // Transit-related fallbacks
  if (lowercaseMsg.includes('bus') && (lowercaseMsg.includes('when') || lowercaseMsg.includes('arrive'))) {
    return "To check bus arrival times, please use the tracking feature on the home screen. Would you like me to guide you there?";
  }
  
  if (lowercaseMsg.includes('route') || lowercaseMsg.includes('direction')) {
    return "For route planning, check out our Smart Route Planner. It considers accessibility and crowd levels to find the best route for you.";
  }
  
  if (lowercaseMsg.includes('crowd') || lowercaseMsg.includes('busy')) {
    return "You can see real-time crowd levels by tapping on any bus in the tracking view. Green means low, yellow is moderate, and red is high.";
  }
  
  if (lowercaseMsg.includes('accessible') || lowercaseMsg.includes('wheelchair')) {
    return "We show accessibility features for each bus. Look for the wheelchair icon on bus cards. You can also filter routes by accessibility in settings.";
  }
  
  if (lowercaseMsg.includes('emergency') || lowercaseMsg.includes('sos')) {
    return "For emergencies, use the SOS button in the app. It will alert emergency contacts and share your location. Need me to guide you there?";
  }
  
  // Greetings
  if (lowercaseMsg.match(/^(hi|hello|hey|good morning|good afternoon|good evening)/)) {
    return "Hello! 👋 I'm your AI assistant. I can help you with anything - transit questions, general knowledge, coding, math, or just chat! What's on your mind?";
  }
  
  // How are you
  if (lowercaseMsg.includes('how are you')) {
    return "I'm doing great, thanks for asking! 😊 Ready to help you with whatever you need. What can I do for you today?";
  }
  
  // General fallback - more friendly and open
  return "I'd love to help with that! Unfortunately, I'm having trouble connecting to my AI brain right now. For transit help, try the voice commands or check back in a moment! 🤖";
}

/**
 * Get quick action suggestions based on context
 */
export function getQuickSuggestions(context = {}) {
  const suggestions = [
    { text: "Tell me a fun fact", icon: "💡" },
    { text: "When is the next bus?", icon: "🚌" },
    { text: "Help me with something", icon: "🤝" },
    { text: "What can you do?", icon: "🤖" }
  ];

  // Add time-based suggestions
  const hour = new Date().getHours();
  if (hour >= 7 && hour <= 10) {
    suggestions.unshift({ text: "Good morning! Plan my commute", icon: "☀️" });
  } else if (hour >= 17 && hour <= 20) {
    suggestions.unshift({ text: "Best way home today?", icon: "🌆" });
  }

  return suggestions.slice(0, 4);
}

/**
 * Clear chat history
 */
export function clearChatHistory() {
  chatHistory.clear();
}

/**
 * Stream response from OpenAI (for real-time typing effect)
 */
export async function streamMessageFromOpenAI(userMessage, context = {}, onChunk) {
  if (!isOpenAIConfigured()) {
    onChunk(getFallbackResponse(userMessage), true);
    return;
  }

  try {
    const contextualMessage = buildContextualMessage(userMessage, context);
    chatHistory.addMessage('user', contextualMessage);

    const messages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...chatHistory.getHistory()
    ];

    const response = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: MODEL,
        messages: messages,
        max_tokens: 300,
        temperature: 0.7,
        stream: true
      })
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let fullMessage = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      const lines = chunk.split('\n').filter(line => line.trim().startsWith('data:'));

      for (const line of lines) {
        const data = line.replace('data: ', '').trim();
        if (data === '[DONE]') continue;

        try {
          const parsed = JSON.parse(data);
          const content = parsed.choices[0]?.delta?.content;
          if (content) {
            fullMessage += content;
            onChunk(content, false);
          }
        } catch (e) {
          // Skip invalid JSON
        }
      }
    }

    chatHistory.addMessage('assistant', fullMessage);
    onChunk('', true); // Signal completion

  } catch (error) {
    console.error('Streaming error:', error);
    onChunk(getFallbackResponse(userMessage), true);
  }
}

// ============================================================================
// TRANSIT-SPECIFIC AI FUNCTIONS
// ============================================================================

/**
 * Get AI-powered route recommendation
 */
export async function getAIRouteRecommendation(from, to, preferences = {}) {
  const prompt = `Plan a transit route from ${from} to ${to} in Coimbatore, India.
User preferences: ${preferences.accessible ? 'Needs wheelchair accessibility. ' : ''}
${preferences.avoidCrowds ? 'Prefers less crowded routes. ' : ''}
${preferences.fastest ? 'Wants the fastest route. ' : ''}
Provide a brief recommendation with estimated time.`;

  return await sendMessageToOpenAI(prompt, { city: 'Coimbatore' });
}

/**
 * Get AI-powered crowd prediction explanation
 */
export async function explainCrowdPrediction(routeName, crowdLevel, time) {
  const prompt = `Explain why ${routeName} might have ${crowdLevel} crowd levels at ${time}. 
Keep it brief (1-2 sentences) and helpful.`;

  return await sendMessageToOpenAI(prompt);
}

/**
 * Get accessibility tips for a route
 */
export async function getAccessibilityTips(routeName, disabilityType = 'general') {
  const prompt = `Give 2-3 quick accessibility tips for using ${routeName} in Coimbatore for someone with ${disabilityType} needs.`;

  return await sendMessageToOpenAI(prompt);
}

export default {
  sendMessageToOpenAI,
  streamMessageFromOpenAI,
  isOpenAIConfigured,
  getQuickSuggestions,
  clearChatHistory,
  getAIRouteRecommendation,
  explainCrowdPrediction,
  getAccessibilityTips
};
