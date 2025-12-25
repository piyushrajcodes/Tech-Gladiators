import React, { useState } from 'react';
import './Chatbot.css';

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [language, setLanguage] = useState('en-US');

  const handleSend = async (text = input) => {
    if (text.trim()) {
      const userMessage = { text: text, sender: 'user' };
      setMessages((prevMessages) => [...prevMessages, userMessage]);
      setInput('');

      try {
        const res = await fetch('http://localhost:5001/api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ message: text }),
        });

        const data = await res.json();
        const botMessage = { text: data.message, sender: 'bot' };
        setMessages((prevMessages) => [...prevMessages, botMessage]);

        // Convert bot's response to speech
        const utterance = new SpeechSynthesisUtterance(data.message);
        utterance.lang = language;
        speechSynthesis.speak(utterance);

      } catch (error) {
        console.error("Error communicating with the backend:", error);
        setMessages((prevMessages) => [...prevMessages, { text: "Error: Could not get a response from the chatbot.", sender: 'bot' }]);
      }
    }
  };

  const handleVoiceInput = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = language;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      handleSend(transcript);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      setIsListening(false);
    };

    recognition.start();
  };

  return (
    <div className="min-h-screen bg-dark-blue-bg p-4">
        <div className="chatbot-container">
            <div className="chatbot-messages">
                {messages.map((msg, index) => (
                <div key={index} className={`message ${msg.sender}`}>
                    {msg.text}
                </div>
                ))}
            </div>
            <div className="chatbot-input">
                <select value={language} onChange={(e) => setLanguage(e.target.value)}>
                <option value="en-US">English</option>
                <option value="hi-IN">Hindi</option>
                <option value="as-IN">Assamese</option>
                <option value="bn-IN">Bengali</option>
                </select>
                <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                />
                <button onClick={() => handleSend()}>Send</button>
                <button onClick={handleVoiceInput} disabled={isListening}>
                {isListening ? 'Listening...' : 'Voice Input'}
                </button>
            </div>
        </div>
    </div>
  );
};

export default Chatbot;
