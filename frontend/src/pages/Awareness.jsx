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
          <div className="glass p-8 rounded-2xl border border-dark-border bg-dark-card shadow-lg">
            <h2 className="text-2xl font-bold text-white mb-4">The Recycler's Guide to Waste Categories</h2>
            <p className="text-gray-400 text-sm leading-relaxed mb-8">
              Proper sorting is the core of sustainable waste management. Categorizing waste helps local plants recycle efficiently, reduces the cost of processing, and keeps toxic chemicals out of our soil and water ecosystems. 
              <br/><br/>
              Did you know? Mixing the wrong items (like greasy pizza boxes) into a recycling bin can contaminate the entire batch, causing it to be sent to a landfill. Here is exactly how to categorize your household waste:
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Plastic & Metal */}
              <div className="bg-dark-bg/60 border border-dark-border rounded-xl overflow-hidden flex flex-col group hover:border-neon-blue transition-colors">
                <img src="https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=500&q=80" alt="Plastic and Metal Bins" className="w-full h-48 object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                <div className="p-6 flex-1">
                  <span className="text-neon-blue font-bold text-sm uppercase tracking-wider block mb-3">Plastic & Metal</span>
                  <p className="text-gray-300 text-sm leading-relaxed mb-3">
                    Ensure plastic containers are completely empty of liquids and rinsed. Leave caps on bottles.
                  </p>
                  <ul className="text-gray-400 text-xs list-disc pl-4 space-y-1">
                    <li><strong className="text-gray-300">Acceptable:</strong> Water bottles, milk jugs, aluminum cans, tin cans, clean foil.</li>
                    <li><strong className="text-red-400">Never Include:</strong> Plastic bags, styrofoam, unwashed food containers.</li>
                  </ul>
                </div>
              </div>

              {/* Organic Composting */}
              <div className="bg-dark-bg/60 border border-dark-border rounded-xl overflow-hidden flex flex-col group hover:border-neon-teal transition-colors">
                <img src="https://upload.wikimedia.org/wikipedia/commons/e/e5/Compost_site_germany.JPG" alt="Compost Site" className="w-full h-48 object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                <div className="p-6 flex-1">
                  <span className="text-neon-teal font-bold text-sm uppercase tracking-wider block mb-3">Organic Composting</span>
                  <p className="text-gray-300 text-sm leading-relaxed mb-3">
                    Composting turns organic waste into nutrient-rich topsoil, significantly reducing landfill methane emissions.
                  </p>
                  <ul className="text-gray-400 text-xs list-disc pl-4 space-y-1">
                    <li><strong className="text-gray-300">Acceptable:</strong> Fruit/vegetable peels, coffee grounds, eggshells, garden clippings.</li>
                    <li><strong className="text-red-400">Never Include:</strong> Meat, dairy, bones, pet waste, glossy paper.</li>
                  </ul>
                </div>
              </div>

              {/* Paper & Cardboard */}
              <div className="bg-dark-bg/60 border border-dark-border rounded-xl overflow-hidden flex flex-col group hover:border-yellow-400 transition-colors">
                <img src="https://upload.wikimedia.org/wikipedia/commons/1/16/Paper_recycling_in_Ponte_a_Serraglio.JPG" alt="Paper Recycling" className="w-full h-48 object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                <div className="p-6 flex-1">
                  <span className="text-yellow-400 font-bold text-sm uppercase tracking-wider block mb-3">Paper & Cardboard</span>
                  <p className="text-gray-300 text-sm leading-relaxed mb-3">
                    Paper fibers can be recycled 5-7 times. Keep paper completely dry and break down all cardboard boxes.
                  </p>
                  <ul className="text-gray-400 text-xs list-disc pl-4 space-y-1">
                    <li><strong className="text-gray-300">Acceptable:</strong> Newspapers, magazines, mail, flattened cardboard, cereal boxes.</li>
                    <li><strong className="text-red-400">Never Include:</strong> Greasy pizza boxes, wet paper, paper towels, tissue paper.</li>
                  </ul>
                </div>
              </div>

              {/* Glass Recycling */}
              <div className="bg-dark-bg/60 border border-dark-border rounded-xl overflow-hidden flex flex-col group hover:border-green-400 transition-colors">
                <img src="https://upload.wikimedia.org/wikipedia/commons/f/fe/Glas_aus_Aufbereitungsanlage_bunt_-_glass_cullet_various_%28Alter_Fritz%29.JPG" alt="Crushed Glass Recycling" className="w-full h-48 object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                <div className="p-6 flex-1">
                  <span className="text-green-400 font-bold text-sm uppercase tracking-wider block mb-3">Glass Recycling</span>
                  <p className="text-gray-300 text-sm leading-relaxed mb-3">
                    Glass is 100% infinitely recyclable without any loss in purity. Separate by color if your local facility requires it.
                  </p>
                  <ul className="text-gray-400 text-xs list-disc pl-4 space-y-1">
                    <li><strong className="text-gray-300">Acceptable:</strong> Clear, green, and brown glass bottles and jars (rinsed).</li>
                    <li><strong className="text-red-400">Never Include:</strong> Mirrors, window glass, lightbulbs, Pyrex, ceramics.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="glass p-8 rounded-2xl border border-dark-border bg-dark-card flex flex-col md:flex-row gap-8 items-center shadow-lg">
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-white mb-4">E-Waste & Hazardous Materials</h2>
              <p className="text-gray-400 text-sm leading-relaxed mb-4">
                Discarded screens, mobile phones, batteries, and appliances represent e-waste. They contain dangerous heavy metals like <strong>lead, cadmium, and mercury</strong> which easily leach into groundwater supplies when illegally dumped or placed in standard garbage bins.
              </p>
              <p className="text-gray-400 text-sm leading-relaxed mb-6">
                A single smartphone contains precious metals like gold, silver, and copper, alongside hazardous lithium-ion batteries that can cause devastating landfill fires if crushed.
              </p>
              <div className="bg-neon-pink/10 border border-neon-pink p-4 rounded-xl">
                <p className="text-gray-300 text-sm font-medium">
                  <strong>CRITICAL RULE:</strong> Always take e-waste and batteries to designated <span className="text-neon-pink font-bold">certified drop-off locations</span> rather than curbside bins. Check the "Recycling Hubs" on our map to find a drop-off near you!
                </p>
              </div>
            </div>
            <div className="w-full md:w-5/12 shrink-0">
              <img src="https://upload.wikimedia.org/wikipedia/commons/3/30/Ewaste-pile.jpg" alt="E-waste pile" className="w-full h-64 object-cover rounded-xl border border-dark-border shadow-md hover:scale-105 transition-transform duration-300" />
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
