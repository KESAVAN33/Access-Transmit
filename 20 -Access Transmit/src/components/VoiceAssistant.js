/**
 * AccessTransit - Voice Navigation Assistant Component
 * 
 * Provides full voice control for the app:
 * - "Find nearest bus"
 * - "When will bus 21 arrive"
 * - "Go to dashboard"
 * - "Show routes in Chennai"
 * - "Track bus 101"
 * - "What's the crowd level"
 * - "Help" - lists available commands
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  routes,
  getBusData,
  getBusById,
  calculateArrivalTime,
  formatArrivalTime,
  getCrowdIndicator,
  speakText,
  triggerHaptic
} from '../data/busData';
import { 
  sendMessageToOpenAI, 
  isOpenAIConfigured, 
  getQuickSuggestions,
  clearChatHistory 
} from '../services/openaiService';

// Voice command patterns and their handlers
const COMMAND_PATTERNS = {
  // Navigation commands
  goHome: /^(go\s+)?(to\s+)?(home|main|start)/i,
  goDashboard: /^(go\s+)?(to\s+)?(dashboard|admin|analytics)/i,
  goProfile: /^(go\s+)?(to\s+)?(profile|my\s*profile|settings)/i,
  
  // Bus finding commands
  findNearest: /^(find|show|get|where|what).*(nearest|closest|nearby)\s*(bus|buses)?/i,
  findBus: /^(find|show|get|where|track)\s*(bus\s*)?(\d+)/i,
  trackBus: /^track\s*(bus\s*)?(\d+)/i,
  
  // Arrival queries
  whenArrive: /^when\s*(will|does|is)?\s*(bus\s*)?(\d+)?\s*(arrive|coming|here)/i,
  busArrival: /^(bus\s*)?(\d+)\s*(arrival|eta|time)/i,
  
  // Route queries
  showRoutes: /^(show|list|find|get)\s*(all\s*)?(routes|lines)/i,
  routesInCity: /^(show|list|find|get)\s*(routes|buses)\s*(in|for|at)\s*(\w+)/i,
  
  // Status queries
  crowdLevel: /^(what|how).*(crowd|crowded|busy|full|packed)/i,
  busStatus: /^(what|how).*(status|condition)/i,
  
  // Accessibility
  accessibleBuses: /^(show|find|get)\s*(accessible|wheelchair|disabled)\s*(bus|buses)?/i,
  toggleAccessibility: /^(turn|toggle|enable|disable)\s*(on|off)?\s*(accessibility|accessible)\s*(mode)?/i,
  
  // Help
  help: /^(help|commands|what\s*can|how\s*to)/i,
  
  // Stop listening
  stop: /^(stop|cancel|nevermind|exit|close)/i
};

function VoiceAssistant({ kyc, onToggleAccessibility }) {
  const navigate = useNavigate();
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [commandHistory, setCommandHistory] = useState([]);
  const [chatMessages, setChatMessages] = useState([]);
  const [textInput, setTextInput] = useState('');
  const [chatMode, setChatMode] = useState('voice'); // 'voice' or 'chat'
  const [aiEnabled, setAiEnabled] = useState(true);
  const recognitionRef = useRef(null);
  const chatEndRef = useRef(null);

  // Scroll to bottom of chat
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages]);

  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event) => {
        const current = event.resultIndex;
        const result = event.results[current];
        const text = result[0].transcript;
        setTranscript(text);

        if (result.isFinal) {
          processCommand(text);
        }
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        if (event.error === 'no-speech') {
          setResponse("I didn't hear anything. Please try again.");
        } else if (event.error === 'not-allowed') {
          setResponse('Microphone access denied. Please enable it in your browser settings.');
        }
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, []);

  // Process voice command - now with AI fallback
  const processCommand = useCallback(async (command, addToChat = false) => {
    setIsProcessing(true);
    const trimmedCommand = command.trim().toLowerCase();
    let responseText = '';
    let action = null;
    let useAI = false;

    // Add to history
    setCommandHistory(prev => [...prev.slice(-4), { command, time: new Date() }]);
    
    // Add to chat if in chat mode
    if (addToChat) {
      setChatMessages(prev => [...prev, { role: 'user', content: command, time: new Date() }]);
    }

    // Match command patterns first (quick local commands)
    if (COMMAND_PATTERNS.help.test(trimmedCommand)) {
      responseText = getHelpText();
    }
    else if (COMMAND_PATTERNS.stop.test(trimmedCommand)) {
      responseText = 'Voice assistant stopped. Tap the microphone to activate again.';
      setIsExpanded(false);
    }
    else if (COMMAND_PATTERNS.goHome.test(trimmedCommand)) {
      responseText = 'Navigating to home screen.';
      action = () => navigate('/');
    }
    else if (COMMAND_PATTERNS.goDashboard.test(trimmedCommand)) {
      responseText = 'Opening the dashboard.';
      action = () => navigate('/dashboard');
    }
    else if (COMMAND_PATTERNS.goProfile.test(trimmedCommand)) {
      responseText = 'Opening your profile.';
      action = () => navigate('/profile');
    }
    else if (COMMAND_PATTERNS.findNearest.test(trimmedCommand)) {
      const result = findNearestBus();
      responseText = result;
    }
    else if (COMMAND_PATTERNS.trackBus.test(trimmedCommand)) {
      const match = trimmedCommand.match(/(\d+)/);
      if (match) {
        const busNum = match[1];
        const result = trackBusByNumber(busNum);
        responseText = result.message;
        if (result.action) action = result.action;
      }
    }
    else if (COMMAND_PATTERNS.findBus.test(trimmedCommand)) {
      const match = trimmedCommand.match(/(\d+)/);
      if (match) {
        const busNum = match[1];
        const result = findBusByNumber(busNum);
        responseText = result;
      }
    }
    else if (COMMAND_PATTERNS.whenArrive.test(trimmedCommand) || COMMAND_PATTERNS.busArrival.test(trimmedCommand)) {
      const match = trimmedCommand.match(/(\d+)/);
      if (match) {
        const busNum = match[1];
        responseText = getBusArrivalInfo(busNum);
      } else {
        responseText = getNextBusArrival();
      }
    }
    else if (COMMAND_PATTERNS.routesInCity.test(trimmedCommand)) {
      const match = trimmedCommand.match(/(?:in|for|at)\s*(\w+)/i);
      if (match) {
        const city = match[1];
        responseText = getRoutesInCity(city);
      }
    }
    else if (COMMAND_PATTERNS.showRoutes.test(trimmedCommand)) {
      responseText = getAllRoutes();
      action = () => navigate('/');
    }
    else if (COMMAND_PATTERNS.crowdLevel.test(trimmedCommand)) {
      responseText = getCrowdStatus();
    }
    else if (COMMAND_PATTERNS.accessibleBuses.test(trimmedCommand)) {
      responseText = getAccessibleBuses();
    }
    else if (COMMAND_PATTERNS.toggleAccessibility.test(trimmedCommand)) {
      if (onToggleAccessibility) {
        onToggleAccessibility();
        responseText = 'Accessibility mode toggled.';
      }
    }
    else {
      // No pattern matched - use AI for intelligent response
      useAI = true;
      if (aiEnabled) {
        try {
          const context = {
            city: kyc?.city || 'Coimbatore',
            currentTime: new Date().toLocaleTimeString(),
            accessibilityMode: kyc?.accessibility || false
          };
          
          const aiResponse = await sendMessageToOpenAI(command, context);
          responseText = aiResponse.message;
          
          // Check if AI suggests navigation
          if (aiResponse.success && responseText.toLowerCase().includes('route planner')) {
            action = () => navigate('/routes');
          } else if (aiResponse.success && responseText.toLowerCase().includes('tracking')) {
            action = () => navigate('/');
          }
        } catch (error) {
          responseText = `I couldn't process that request. Try commands like "find nearest bus" or "help" for options.`;
        }
      } else {
        responseText = `I didn't understand "${command}". Say "help" for available commands.`;
      }
    }

    // Speak and display response
    setResponse(responseText);
    
    // Add to chat messages if in chat mode
    if (addToChat || chatMode === 'chat') {
      setChatMessages(prev => [...prev, { 
        role: 'assistant', 
        content: responseText, 
        time: new Date(),
        isAI: useAI 
      }]);
    }
    
    speakText(responseText);
    triggerHaptic('success');

    // Execute navigation action if any
    if (action) {
      setTimeout(action, 500);
    }

    setIsProcessing(false);
  }, [navigate, onToggleAccessibility, aiEnabled, kyc, chatMode]);
  
  // Handle text input submit
  const handleTextSubmit = (e) => {
    e.preventDefault();
    if (textInput.trim()) {
      processCommand(textInput, true);
      setTextInput('');
    }
  };
  
  // Clear chat history
  const handleClearChat = () => {
    setChatMessages([]);
    clearChatHistory();
    setResponse('');
  };

  // Start listening
  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      setTranscript('');
      setIsListening(true);
      setIsExpanded(true);
      recognitionRef.current.start();
      triggerHaptic('success');
    }
  };

  // Stop listening
  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  // Helper functions for command processing
  const getHelpText = () => {
    return `Available commands: 
      Say "Find nearest bus" to locate nearby buses.
      Say "When will bus 101 arrive" for arrival times.
      Say "Track bus 101" to start tracking.
      Say "Show routes in Chennai" for city routes.
      Say "Go to dashboard" for analytics.
      Say "Show accessible buses" for wheelchair accessible options.
      Say "Stop" to close the assistant.`;
  };

  const findNearestBus = () => {
    const buses = getBusData();
    if (!buses || buses.length === 0) {
      return 'No buses available at the moment.';
    }
    
    // Filter by user's city
    const cityBuses = buses.filter(bus => {
      const route = routes.find(r => r.id === bus.route);
      return route && route.city === kyc?.city;
    });

    if (cityBuses.length === 0) {
      return `No buses found in ${kyc?.city || 'your area'}. Checking all cities.`;
    }

    // Find bus with shortest arrival time
    const withArrival = cityBuses.map(bus => ({
      ...bus,
      arrivalMinutes: calculateArrivalTime(bus.distanceToNextStop, bus.avgSpeed)
    })).filter(b => b.arrivalMinutes !== 'N/A');

    if (withArrival.length === 0) {
      return 'Unable to calculate arrival times for nearby buses.';
    }

    const nearest = withArrival.reduce((min, bus) => 
      bus.arrivalMinutes < min.arrivalMinutes ? bus : min
    );

    return `The nearest bus is ${nearest.busId} on ${nearest.routeName}, arriving at ${nearest.nextStop} in ${formatArrivalTime(nearest.arrivalMinutes)}. It currently has ${nearest.crowdLevel.toLowerCase()} crowd levels.`;
  };

  const findBusByNumber = (busNum) => {
    const buses = getBusData();
    const bus = buses.find(b => b.busId.includes(busNum));
    
    if (!bus) {
      return `Bus ${busNum} not found. Try saying "show routes" to see available buses.`;
    }

    const arrival = calculateArrivalTime(bus.distanceToNextStop, bus.avgSpeed);
    return `Bus ${bus.busId} is on ${bus.routeName}. Currently at ${bus.currentStop}, heading to ${bus.nextStop}. Arrival in ${formatArrivalTime(arrival)}. Crowd level is ${bus.crowdLevel.toLowerCase()}.`;
  };

  const trackBusByNumber = (busNum) => {
    const buses = getBusData();
    const bus = buses.find(b => b.busId.includes(busNum));
    
    if (!bus) {
      return { message: `Bus ${busNum} not found.`, action: null };
    }

    return {
      message: `Starting to track bus ${bus.busId} on ${bus.routeName}.`,
      action: () => navigate(`/track/${bus.busId}`)
    };
  };

  const getBusArrivalInfo = (busNum) => {
    const buses = getBusData();
    const bus = buses.find(b => b.busId.includes(busNum));
    
    if (!bus) {
      return `Bus ${busNum} not found in the system.`;
    }

    const arrival = calculateArrivalTime(bus.distanceToNextStop, bus.avgSpeed);
    return `Bus ${bus.busId} will arrive at ${bus.nextStop} in ${formatArrivalTime(arrival)}.`;
  };

  const getNextBusArrival = () => {
    const buses = getBusData();
    const cityBuses = buses.filter(bus => {
      const route = routes.find(r => r.id === bus.route);
      return route && route.city === kyc?.city;
    });

    if (cityBuses.length === 0) {
      return 'No buses found in your city.';
    }

    const withArrival = cityBuses.map(bus => ({
      ...bus,
      arrivalMinutes: calculateArrivalTime(bus.distanceToNextStop, bus.avgSpeed)
    })).filter(b => b.arrivalMinutes !== 'N/A')
      .sort((a, b) => a.arrivalMinutes - b.arrivalMinutes);

    if (withArrival.length === 0) {
      return 'Unable to get arrival times.';
    }

    const next3 = withArrival.slice(0, 3);
    return `Next arrivals: ${next3.map(b => 
      `${b.busId} in ${formatArrivalTime(b.arrivalMinutes)}`
    ).join(', ')}.`;
  };

  const getRoutesInCity = (cityName) => {
    const cityRoutes = routes.filter(r => 
      r.city.toLowerCase().includes(cityName.toLowerCase())
    );

    if (cityRoutes.length === 0) {
      return `No routes found in ${cityName}. Available cities: Coimbatore, Chennai, Erode, Bangalore, Hyderabad, Mumbai, Delhi.`;
    }

    return `Found ${cityRoutes.length} routes in ${cityRoutes[0].city}: ${cityRoutes.map(r => r.name).join(', ')}.`;
  };

  const getAllRoutes = () => {
    const cityRoutes = routes.filter(r => r.city === kyc?.city);
    if (cityRoutes.length > 0) {
      return `There are ${cityRoutes.length} routes in ${kyc.city}: ${cityRoutes.slice(0, 4).map(r => r.name).join(', ')}${cityRoutes.length > 4 ? ' and more' : ''}.`;
    }
    return `There are ${routes.length} total routes available. Navigate to home to see them all.`;
  };

  const getCrowdStatus = () => {
    const buses = getBusData();
    const cityBuses = buses.filter(bus => {
      const route = routes.find(r => r.id === bus.route);
      return route && route.city === kyc?.city;
    });

    if (cityBuses.length === 0) {
      return 'No buses to report crowd levels for.';
    }

    const lowCrowd = cityBuses.filter(b => b.crowdLevel === 'Low').length;
    const medCrowd = cityBuses.filter(b => b.crowdLevel === 'Medium').length;
    const highCrowd = cityBuses.filter(b => b.crowdLevel === 'High').length;

    return `In ${kyc?.city || 'your area'}: ${lowCrowd} buses have low crowds, ${medCrowd} have medium crowds, and ${highCrowd} are heavily crowded.`;
  };

  const getAccessibleBuses = () => {
    const buses = getBusData();
    const accessibleBuses = buses.filter(bus => {
      const route = routes.find(r => r.id === bus.route);
      return bus.accessible && route && route.city === kyc?.city;
    });

    if (accessibleBuses.length === 0) {
      return `No wheelchair accessible buses currently available in ${kyc?.city || 'your area'}.`;
    }

    const sample = accessibleBuses.slice(0, 3);
    return `${accessibleBuses.length} accessible buses available. Examples: ${sample.map(b => `${b.busId} on ${b.routeName}`).join(', ')}.`;
  };

  // Check if speech recognition is supported
  const speechSupported = ('webkitSpeechRecognition' in window) || ('SpeechRecognition' in window);

  return (
    <div className={`voice-assistant ${isExpanded ? 'expanded' : ''}`}>
      {/* Floating Button */}
      <button
        className={`voice-assistant-btn ${isListening ? 'listening' : ''} ${isProcessing ? 'processing' : ''}`}
        onClick={() => {
          if (isListening) {
            stopListening();
          } else if (chatMode === 'voice' && speechSupported) {
            startListening();
          } else {
            setIsExpanded(true);
          }
        }}
        aria-label={isListening ? 'Stop listening' : 'Open assistant'}
        title="AI Assistant - Tap to open"
      >
        <span className="mic-icon">{chatMode === 'chat' ? '💬' : isListening ? '🎙️' : '🤖'}</span>
        {isListening && <span className="listening-indicator"></span>}
        {isOpenAIConfigured() && <span className="ai-badge">AI</span>}
      </button>

      {/* Expanded Panel */}
      {isExpanded && (
        <div className="voice-panel ai-enhanced">
          <div className="voice-panel-header">
            <div className="header-left">
              <h3>🤖 AI Assistant</h3>
              {isOpenAIConfigured() && (
                <span className="ai-powered-badge">GPT Powered</span>
              )}
            </div>
            <div className="header-actions">
              <button 
                className="clear-chat-btn"
                onClick={handleClearChat}
                title="Clear chat"
              >
                🗑️
              </button>
              <button 
                className="voice-panel-close"
                onClick={() => setIsExpanded(false)}
                aria-label="Close panel"
              >
                ×
              </button>
            </div>
          </div>

          {/* Mode Toggle */}
          <div className="mode-toggle">
            <button 
              className={`mode-btn ${chatMode === 'voice' ? 'active' : ''}`}
              onClick={() => setChatMode('voice')}
              disabled={!speechSupported}
            >
              🎤 Voice
            </button>
            <button 
              className={`mode-btn ${chatMode === 'chat' ? 'active' : ''}`}
              onClick={() => setChatMode('chat')}
            >
              💬 Chat
            </button>
            <div className="ai-toggle">
              <label>
                <input 
                  type="checkbox" 
                  checked={aiEnabled}
                  onChange={(e) => setAiEnabled(e.target.checked)}
                />
                <span>AI Mode</span>
              </label>
            </div>
          </div>

          <div className="voice-panel-content">
            {/* Voice Mode Content */}
            {chatMode === 'voice' && (
              <>
                {/* Status Indicator */}
                <div className={`voice-status ${isListening ? 'active' : ''}`}>
                  {isListening ? (
                    <>
                      <span className="pulse-dot"></span>
                      <span>Listening...</span>
                    </>
                  ) : isProcessing ? (
                    <>
                      <span className="thinking-dot"></span>
                      <span>Thinking...</span>
                    </>
                  ) : (
                    <span>Tap microphone to speak</span>
                  )}
                </div>

                {/* Mic Button */}
                {speechSupported && (
                  <button 
                    className={`big-mic-btn ${isListening ? 'listening' : ''}`}
                    onClick={isListening ? stopListening : startListening}
                  >
                    {isListening ? '🎙️' : '🎤'}
                  </button>
                )}

                {/* Transcript */}
                {transcript && (
                  <div className="voice-transcript">
                    <span className="label">You said:</span>
                    <span className="text">"{transcript}"</span>
                  </div>
                )}

                {/* Response */}
                {response && (
                  <div className="voice-response">
                    <span className="label">Assistant:</span>
                    <span className="text">{response}</span>
                  </div>
                )}
              </>
            )}

            {/* Chat Mode Content */}
            {chatMode === 'chat' && (
              <>
                <div className="chat-messages">
                  {chatMessages.length === 0 && (
                    <div className="chat-welcome">
                      <span className="welcome-icon">👋</span>
                      <p>Hi! I'm your AI transit assistant. Ask me anything about buses, routes, or accessibility!</p>
                      <div className="suggestion-chips">
                        {getQuickSuggestions().map((sugg, idx) => (
                          <button 
                            key={idx}
                            onClick={() => processCommand(sugg.text, true)}
                            className="suggestion-chip"
                          >
                            {sugg.icon} {sugg.text}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  {chatMessages.map((msg, idx) => (
                    <div key={idx} className={`chat-message ${msg.role}`}>
                      <div className="message-avatar">
                        {msg.role === 'user' ? '👤' : '🤖'}
                      </div>
                      <div className="message-content">
                        <p>{msg.content}</p>
                        <span className="message-time">
                          {msg.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          {msg.isAI && <span className="ai-tag">AI</span>}
                        </span>
                      </div>
                    </div>
                  ))}
                  {isProcessing && (
                    <div className="chat-message assistant typing">
                      <div className="message-avatar">🤖</div>
                      <div className="typing-indicator">
                        <span></span><span></span><span></span>
                      </div>
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </div>

                {/* Text Input */}
                <form className="chat-input-form" onSubmit={handleTextSubmit}>
                  <input
                    type="text"
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                    placeholder="Type your question..."
                    disabled={isProcessing}
                  />
                  <button type="submit" disabled={!textInput.trim() || isProcessing}>
                    {isProcessing ? '⏳' : '➤'}
                  </button>
                </form>
              </>
            )}

            {/* Quick Commands - Updated */}
            {chatMode === 'voice' && (
              <div className="quick-commands">
                <span className="quick-label">Try saying:</span>
                <div className="quick-chips">
                  <button onClick={() => processCommand('Find nearest bus')}>
                    🚌 Nearest bus
                  </button>
                  <button onClick={() => processCommand('When will the next bus arrive')}>
                    ⏰ Next arrival
                  </button>
                  <button onClick={() => processCommand('Show accessible buses')}>
                    ♿ Accessible
                  </button>
                  <button onClick={() => processCommand('What is the crowd level')}>
                    👥 Crowd
                  </button>
                </div>
              </div>
            )}

            {/* AI Status */}
            {!isOpenAIConfigured() && (
              <div className="ai-status-notice">
                <span>💡</span>
                <span>AI responses in demo mode. Add OpenAI API key for full experience.</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default VoiceAssistant;
