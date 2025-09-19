import React, { useState, useEffect } from 'react';
import { Mic, MicOff, MapPin, Volume2 } from 'lucide-react';

const VoiceMapsDashboard = () => {
  const [isListening, setIsListening] = useState(false);
  const [voiceCommand, setVoiceCommand] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [aiResponse, setAiResponse] = useState('');
  const [particles, setParticles] = useState<Array<{
    id: number;
    x: number;
    y: number;
    size: number;
    color: string;
  }>>([]);
  const [recognition, setRecognition] = useState<any>(null);

  // Dynamic voice waveform
  const [waveform, setWaveform] = useState([30, 60, 40, 80, 50, 70, 45, 65, 35]);
  
  useEffect(() => {
    if (isListening) {
      const interval = setInterval(() => {
        setWaveform(prev => prev.map(() => Math.random() * 100 + 30));
      }, 120);
      return () => clearInterval(interval);
    }
  }, [isListening]);

  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = 'en-US';
      
      recognitionInstance.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setVoiceCommand(transcript);
        setIsListening(false);
        setIsProcessing(true);
        
        // Simulate AI processing and response
        setTimeout(() => {
          setAiResponse(`I heard: "${transcript}". Searching maps for your request...`);
          setIsProcessing(false);
        }, 2000);
      };
      
      recognitionInstance.onerror = (event: any) => {
        setIsListening(false);
        if (event.error === 'not-allowed') {
          setAiResponse("Please allow microphone access to use voice commands.");
        } else if (event.error === 'no-speech') {
          setAiResponse("No speech detected. Please try speaking again.");
        } else {
          setAiResponse("Voice recognition error. Please try again.");
        }
      };
      
      recognitionInstance.onend = () => {
        setIsListening(false);
      };
      
      setRecognition(recognitionInstance);
    }
  }, []);

  // Floating particles effect
  useEffect(() => {
    if (isProcessing) {
      const newParticles = Array.from({ length: 20 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 4 + 2,
        color: ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57'][Math.floor(Math.random() * 5)]
      }));
      setParticles(newParticles);
    } else {
      setParticles([]);
    }
  }, [isProcessing]);

  const handleVoiceToggle = () => {
    if (!isListening && recognition) {
      setIsListening(true);
      setVoiceCommand('');
      setAiResponse('');
      recognition.start();
    } else if (isListening && recognition) {
      setIsListening(false);
      recognition.stop();
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-20 left-40 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{animationDelay: '4s'}}></div>
      </div>

      {/* Floating Particles */}
      {particles.map(particle => (
        <div
          key={particle.id}
          className="absolute rounded-full animate-ping"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            backgroundColor: particle.color,
            animationDuration: `${Math.random() * 3 + 2}s`
          }}
        />
      ))}

      {/* Header */}
      <div className="relative z-10 bg-black/20 backdrop-blur-lg border-b border-white/10 p-6">
        <div className="flex justify-between items-center max-w-6xl mx-auto">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 flex items-center justify-center shadow-lg shadow-cyan-500/25 relative">
              <MapPin className="w-6 h-6 text-white" />
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                <Mic className="w-2 h-2 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                VoiceMaps AI Agent
              </h1>
              <p className="text-sm text-gray-300">Powered by Multi-Agent MCP</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-green-400 text-sm font-medium">3 Agents Active</span>
          </div>
        </div>
      </div>

      <div className="relative z-10 p-6 max-w-6xl mx-auto">
        {/* Voice Interface - Centered */}
        <div className="flex justify-center items-center mb-6">
          <div className="bg-black/30 backdrop-blur-xl rounded-3xl p-6 border border-white/10 shadow-2xl">
            <div className="text-center">
              {/* Spectacular Voice Waveform */}
              {isListening && (
                <div className="flex justify-center items-end space-x-1 mb-6 h-24 bg-black/20 rounded-2xl p-4">
                  {waveform.map((height, index) => (
                    <div
                      key={index}
                      className="rounded-full transition-all duration-150 shadow-lg"
                      style={{ 
                        height: `${height}px`,
                        width: '6px',
                        background: `linear-gradient(to top, #ff6b6b, #4ecdc4, #45b7d1)`,
                        boxShadow: `0 0 15px rgba(${index % 2 ? '255, 107, 107' : '78, 205, 196'}, 0.6)`
                      }}
                    />
                  ))}
                </div>
              )}

              {/* Epic Voice Button */}
              <div className="relative mb-6">
                <button
                  onClick={handleVoiceToggle}
                  className={`relative w-24 h-24 md:w-32 md:h-32 rounded-full flex items-center justify-center transition-all duration-500 transform ${
                    isListening 
                      ? 'scale-110 rotate-3' 
                      : 'hover:scale-105 hover:rotate-1'
                  }`}
                  style={{ 
                    background: isListening 
                      ? 'linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1, #feca57)' 
                      : 'linear-gradient(45deg, #667eea, #764ba2)',
                    boxShadow: isListening 
                      ? '0 0 60px rgba(255, 107, 107, 0.8), 0 0 100px rgba(78, 205, 196, 0.6)' 
                      : '0 20px 40px rgba(0, 0, 0, 0.3)'
                  }}
                >
                  <div className="w-20 h-20 md:w-28 md:h-28 rounded-full bg-black/20 backdrop-blur-sm flex items-center justify-center">
                    {isListening ? (
                      <MicOff className="w-8 h-8 md:w-10 md:h-10 text-white drop-shadow-lg" />
                    ) : (
                      <Mic className="w-8 h-8 md:w-10 md:h-10 text-white drop-shadow-lg" />
                    )}
                  </div>
                </button>
                
                {/* Multi-colored pulse rings */}
                {isListening && (
                  <>
                    <div className="absolute inset-0 rounded-full animate-ping bg-gradient-to-r from-purple-500 to-pink-500 opacity-30" />
                    <div className="absolute inset-0 rounded-full animate-ping bg-gradient-to-r from-cyan-500 to-blue-500 opacity-20" style={{animationDelay: '0.5s'}} />
                  </>
                )}
              </div>

              <p className="text-base md:text-lg text-gray-300 font-medium">
                {isListening ? (
                  <span className="flex items-center justify-center space-x-2">
                    <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                    <span>Listening...</span>
                  </span>
                ) : (
                  'Tap to speak'
                )}
              </p>

              {/* Voice Command Display */}
              {voiceCommand && (
                <div className="bg-gradient-to-r from-purple-900/50 to-blue-900/50 backdrop-blur-sm rounded-2xl p-4 mt-4 border border-purple-500/30 shadow-lg shadow-purple-500/20">
                  <p className="text-lg font-medium text-white drop-shadow-lg">
                    "{voiceCommand}"
                  </p>
                </div>
              )}

              {/* AI Processing */}
              {isProcessing && (
                <div className="flex flex-col items-center space-y-3 mt-4">
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-1">
                      {[0, 1, 2].map(i => (
                        <div
                          key={i}
                          className="w-3 h-3 rounded-full bg-gradient-to-r from-cyan-400 to-purple-500 animate-bounce"
                          style={{ animationDelay: `${i * 0.2}s` }}
                        />
                      ))}
                    </div>
                    <span className="text-purple-300 font-medium animate-pulse">
                      AI is searching maps...
                    </span>
                  </div>
                </div>
              )}

              {/* AI Response */}
              {aiResponse && (
                <div className="bg-gradient-to-r from-green-900/30 to-blue-900/30 backdrop-blur-sm rounded-2xl p-4 mt-4 border border-green-500/30 shadow-lg shadow-green-500/10">
                  <p className="text-lg text-white leading-relaxed">
                    {aiResponse}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Google Maps Integration Section - Bigger */}
        <div className="bg-black/30 backdrop-blur-xl rounded-2xl p-4 border border-white/10 mb-6 h-[75vh]">
          <div className="flex items-center space-x-3 mb-4">
            <MapPin className="w-5 h-5 text-cyan-400" />
            <h3 className="text-lg font-bold text-white">Live Map Results</h3>
          </div>
          <div className="bg-gray-800 rounded-xl h-full flex items-center justify-center border border-gray-600">
            <div className="text-center">
              <MapPin className="w-12 h-12 text-cyan-400 mx-auto mb-3 animate-bounce" />
              <p className="text-gray-400 font-medium">Google Maps Integration</p>
              <p className="text-sm text-gray-500 mt-1">Powered by Apify</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoiceMapsDashboard;
