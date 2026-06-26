import React, { useState } from 'react';
import { Award, BookOpen, Check, HelpCircle, RefreshCw } from 'lucide-react';

const Awareness = () => {
  const [activeTab, setActiveTab] = useState('education');

  // Quiz State
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);

  const quizQuestions = [
    {
      q: "Which type of plastic is generally considered the easiest to recycle?",
      options: ["PET (Type 1)", "PVC (Type 3)", "PS (Type 6)", "LDPE (Type 4)"],
      answer: "PET (Type 1)",
      explanation: "PET (Polyethylene Terephthalate) is highly recyclable and commonly processed back into bottles and fibers."
    },
    {
      q: "Roughly how long does a standard plastic water bottle take to decompose in a landfill?",
      options: ["50 years", "100 years", "450 years", "Never"],
      answer: "450 years",
      explanation: "Most plastics don't biodegrade; instead, they break down into microplastics over hundreds of years (approx 450)."
    },
    {
      q: "What is composting?",
      options: [
        "Incinerating dry leaves",
        "Natural recycling of organic matter into fertilizer",
        "Burying electronic items",
        "Filtering river wastewater"
      ],
      answer: "Natural recycling of organic matter into fertilizer",
      explanation: "Composting is the biological decomposition of organic waste like food scraps into nutrient-rich soil helper."
    }
  ];

  const handleAnswerClick = (option) => {
    setSelectedAnswer(option);
  };

  const handleNext = () => {
    if (selectedAnswer === quizQuestions[currentQuestion].answer) {
      setScore(score + 1);
    }

    if (currentQuestion + 1 < quizQuestions.length) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
    } else {
      setShowResult(true);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-6">
      <div className="flex justify-center border-b border-dark-border mb-8">
        <button 
          onClick={() => setActiveTab('education')}
          className={`px-6 py-3 text-sm font-semibold flex items-center gap-1.5 border-b-2 cursor-pointer transition-colors ${
            activeTab === 'education' ? 'border-neon-blue text-neon-blue' : 'border-transparent text-gray-400 hover:text-white'
          }`}
        >
          <BookOpen className="h-4 w-4" /> Learning Hub
        </button>
        <button 
          onClick={() => setActiveTab('quiz')}
          className={`px-6 py-3 text-sm font-semibold flex items-center gap-1.5 border-b-2 cursor-pointer transition-colors ${
            activeTab === 'quiz' ? 'border-neon-blue text-neon-blue' : 'border-transparent text-gray-400 hover:text-white'
          }`}
        >
          <HelpCircle className="h-4 w-4" /> Eco Quiz
        </button>
      </div>

      {activeTab === 'education' ? (
        <div className="space-y-8">
          <div className="glass p-8 rounded-2xl border border-dark-border bg-dark-card">
            <h2 className="text-xl font-bold text-white mb-4">The Recyclers Guide to Waste Categories</h2>
            <p className="text-gray-400 text-xs leading-relaxed mb-6">
              Proper sorting is the core of sustainable waste management. Categorizing waste helps local plants recycle efficiently and keeps toxic chemicals out of the ecosystem.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-dark-bg/60 border border-dark-border rounded-xl overflow-hidden flex flex-col">
                <img src="https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=500&q=80" alt="Plastic Bottles" className="w-full h-32 object-cover opacity-80" />
                <div className="p-5 flex-1">
                  <span className="text-neon-blue font-bold text-xs uppercase tracking-wider block mb-2">Plastic & Metal</span>
                  <p className="text-gray-400 text-xs leading-relaxed">Ensure plastic containers are completely empty of liquids. Metal cans like aluminum can be recycled repeatedly without degradation.</p>
                </div>
              </div>
              <div className="bg-dark-bg/60 border border-dark-border rounded-xl overflow-hidden flex flex-col">
                <img src="https://images.unsplash.com/photo-1592424001925-50e50058e573?w=500&q=80" alt="Compost" className="w-full h-32 object-cover opacity-80" />
                <div className="p-5 flex-1">
                  <span className="text-neon-teal font-bold text-xs uppercase tracking-wider block mb-2">Organic Composting</span>
                  <p className="text-gray-400 text-xs leading-relaxed">Collect food peels, coffee grounds, and garden clippings. Composting helps build nutrient-rich topsoils rather than filling up landfills.</p>
                </div>
              </div>
              <div className="bg-dark-bg/60 border border-dark-border rounded-xl overflow-hidden flex flex-col">
                <img src="https://images.unsplash.com/photo-1605600659873-d808a1d14b12?w=500&q=80" alt="Paper Waste" className="w-full h-32 object-cover opacity-80" />
                <div className="p-5 flex-1">
                  <span className="text-yellow-400 font-bold text-xs uppercase tracking-wider block mb-2">Paper & Cardboard</span>
                  <p className="text-gray-400 text-xs leading-relaxed">Keep paper dry and free of grease (like pizza boxes). Flatten all cardboard boxes to save space in bins and transport trucks.</p>
                </div>
              </div>
              <div className="bg-dark-bg/60 border border-dark-border rounded-xl overflow-hidden flex flex-col">
                <img src="https://images.unsplash.com/photo-1550989460-0adf9ea622e2?w=500&q=80" alt="Glass Bottles" className="w-full h-32 object-cover opacity-80" />
                <div className="p-5 flex-1">
                  <span className="text-green-400 font-bold text-xs uppercase tracking-wider block mb-2">Glass Recycling</span>
                  <p className="text-gray-400 text-xs leading-relaxed">Glass is 100% recyclable and never loses quality. Separate by color if required. Do not include mirrors or lightbulbs.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="glass p-8 rounded-2xl border border-dark-border bg-dark-card flex flex-col md:flex-row gap-6 items-center">
            <div className="flex-1">
              <h2 className="text-xl font-bold text-white mb-4">E-Waste Warnings</h2>
              <p className="text-gray-400 text-xs leading-relaxed mb-4">
                Discarded screens, mobile phones, batteries, and appliances represent e-waste. They contain dangerous heavy metals (lead, cadmium, mercury) which easily leach into water supplies when discarded in standard garbage bins.
              </p>
              <p className="text-gray-400 text-xs leading-relaxed">
                Always take e-waste to designated <span className="text-neon-pink font-bold">certified drop-off locations</span> rather than putting them in curbside bins.
              </p>
            </div>
            <div className="w-full md:w-1/3">
              <img src="https://images.unsplash.com/photo-1550005973-587f7a77e23c?w=500&q=80" alt="E-waste pile" className="w-full h-auto rounded-xl border border-dark-border" />
            </div>
          </div>
        </div>
      ) : (
        <div className="glass p-8 rounded-2xl border border-dark-border bg-dark-card max-w-xl mx-auto">
          {!showResult ? (
            <div>
              <div className="flex justify-between items-center mb-6">
                <span className="text-[10px] font-bold text-gray-500 uppercase">Question {currentQuestion + 1} of {quizQuestions.length}</span>
                <span className="text-[10px] font-bold text-neon-blue bg-neon-blue/10 px-2 py-0.5 rounded border border-neon-blue/20">Current Score: {score}</span>
              </div>

              <h3 className="text-lg font-bold text-white mb-6 leading-snug">
                {quizQuestions[currentQuestion].q}
              </h3>

              <div className="space-y-3">
                {quizQuestions[currentQuestion].options.map((option, idx) => (
                  <button 
                    key={idx}
                    onClick={() => handleAnswerClick(option)}
                    className={`w-full text-left p-4 rounded-xl text-xs transition-all border cursor-pointer ${
                      selectedAnswer === option 
                        ? 'bg-neon-blue/15 border-neon-blue text-white font-bold' 
                        : 'bg-dark-bg hover:bg-white/5 border-dark-border text-gray-300'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>

              <button 
                onClick={handleNext}
                disabled={selectedAnswer === null}
                className="w-full bg-gradient-to-r from-neon-blue to-neon-teal text-dark-bg font-bold py-3 rounded-xl mt-8 cursor-pointer disabled:opacity-40 disabled:pointer-events-none transition-colors text-xs"
              >
                {currentQuestion + 1 === quizQuestions.length ? 'Finish Quiz' : 'Next Question'}
              </button>
            </div>
          ) : (
            <div className="text-center py-6">
              <Award className="h-16 w-16 text-yellow-400 mx-auto mb-4 animate-bounce" />
              <h3 className="text-xl font-bold text-white mb-2">Quiz Complete!</h3>
              <p className="text-gray-400 text-xs mb-6">You scored {score} out of {quizQuestions.length} correct answers.</p>

              <div className="space-y-4 text-left border-t border-dark-border/60 pt-6">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Quick Explanations</h4>
                {quizQuestions.map((q, idx) => (
                  <div key={idx} className="p-3 bg-dark-bg/60 border border-dark-border rounded-xl text-xs">
                    <p className="text-white font-bold mb-1">{q.q}</p>
                    <p className="text-neon-teal flex items-center gap-1 font-semibold text-[11px] mb-1">
                      <Check className="h-3.5 w-3.5" /> {q.answer}
                    </p>
                    <p className="text-gray-400 text-[10px] leading-relaxed">{q.explanation}</p>
                  </div>
                ))}
              </div>

              <button 
                onClick={resetQuiz}
                className="mt-8 flex items-center justify-center gap-1.5 border border-dark-border text-xs px-6 py-2.5 rounded-xl mx-auto text-gray-400 hover:text-white transition-colors cursor-pointer"
              >
                <RefreshCw className="h-4 w-4" /> Reset Quiz
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Awareness;
