import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { FiSend, FiX } from 'react-icons/fi';

const Chatbot = ({ onClose }) => {
  const [messages, setMessages] = useState([
    { text: "Hello! I'm your shopping assistant. How can I help you today?", isBot: true }
  ]);
  const [input, setInput] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { text: input, isBot: false };
    setMessages(prev => [...prev, userMessage]);
    setInput('');

    try {
      const response = await axios.post('/api/chatbot/message', {
        message: input
      });
      
      const botMessage = { 
        text: response.data.response, 
        isBot: true 
      };
      setMessages(prev => [...prev, botMessage]);
      setSuggestions(response.data.suggestions || []);
    } catch (error) {
      const errorMessage = { 
        text: "Sorry, I'm having trouble connecting. Please try again later.", 
        isBot: true 
      };
      setMessages(prev => [...prev, errorMessage]);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setInput(suggestion);
  };

  return (
    <ChatbotContainer>
      <ChatbotHeader>
        <h3>🛍️ Shopping Assistant</h3>
        <CloseButton onClick={onClose}>
          <FiX />
        </CloseButton>
      </ChatbotHeader>

      <MessagesContainer>
        {messages.map((msg, index) => (
          <Message key={index} isBot={msg.isBot}>
            {msg.text}
          </Message>
        ))}
        <div ref={messagesEndRef} />
      </MessagesContainer>

      {suggestions.length > 0 && (
        <Suggestions>
          {suggestions.map((suggestion, index) => (
            <SuggestionButton 
              key={index}
              onClick={() => handleSuggestionClick(suggestion)}
            >
              {suggestion}
            </SuggestionButton>
          ))}
        </Suggestions>
      )}

      <InputContainer>
        <Input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Type your message..."
        />
        <SendButton onClick={handleSend}>
          <FiSend />
        </SendButton>
      </InputContainer>
    </ChatbotContainer>
  );
};

const ChatbotContainer = styled.div`
  position: fixed;
  bottom: 100px;
  right: 30px;
  width: 350px;
  height: 500px;
  background: white;
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  z-index: 1001;
`;

const ChatbotHeader = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 15px;
  border-radius: 15px 15px 0 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: white;
  font-size: 20px;
  cursor: pointer;
  padding: 5px;
`;

const MessagesContainer = styled.div`
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  background: #f8f9fa;
`;

const Message = styled.div`
  max-width: 80%;
  padding: 10px 15px;
  margin-bottom: 10px;
  border-radius: 18px;
  background: ${props => props.isBot ? '#e9ecef' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'};
  color: ${props => props.isBot ? '#333' : 'white'};
  align-self: ${props => props.isBot ? 'flex-start' : 'flex-end'};
  margin-left: ${props => props.isBot ? '0' : 'auto'};
`;

const Suggestions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 10px;
  background: white;
  border-top: 1px solid #eee;
`;

const SuggestionButton = styled.button`
  background: #f0f2f5;
  border: 1px solid #ddd;
  padding: 6px 12px;
  border-radius: 15px;
  font-size: 12px;
  cursor: pointer;
  transition: background 0.3s;

  &:hover {
    background: #e4e6eb;
  }
`;

const InputContainer = styled.div`
  display: flex;
  padding: 15px;
  border-top: 1px solid #eee;
  background: white;
  border-radius: 0 0 15px 15px;
`;

const Input = styled.input`
  flex: 1;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 25px;
  font-size: 14px;
  outline: none;

  &:focus {
    border-color: #667eea;
  }
`;

const SendButton = styled.button`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  width: 45px;
  height: 45px;
  border-radius: 50%;
  margin-left: 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.3s;

  &:hover {
    transform: scale(1.05);
  }
`;

export default Chatbot;
