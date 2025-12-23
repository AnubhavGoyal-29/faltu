import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { generateAIContent, parseAIContent } from '../../utils/ai.js';
import { ACTIVITY_DESCRIPTIONS } from '../registry.js';

const DIALOGUES = [
  {
    dialogue: "Kitne aadmi the?",
    options: ["Sholay", "Dilwale", "3 Idiots"],
    answer: 0,
  },
  {
    dialogue: "Mogambo khush hua",
    options: ["Mr. India", "Don", "Agneepath"],
    answer: 0,
  },
  {
    dialogue: "All is well",
    options: ["3 Idiots", "PK", "Zindagi Na Milegi Dobara"],
    answer: 0,
  },
  {
    dialogue: "Bade bade deshon mein aisi chhoti chhoti baatein hoti rehti hain",
    options: ["DDLJ", "Kabhi Khushi Kabhie Gham", "Veer-Zaara"],
    answer: 0,
  },
  {
    dialogue: "Don ko pakadna mushkil hi nahi, namumkin hai",
    options: ["Don", "Baazigar", "Agneepath"],
    answer: 0,
  },
  {
    dialogue: "Mere paas maa hai",
    options: ["Deewar", "Sholay", "Trishul"],
    answer: 0,
  },
  {
    dialogue: "Pushpa, I hate tears",
    options: ["Amar Prem", "Anand", "Aradhana"],
    answer: 0,
  },
  {
    dialogue: "Picture abhi baaki hai mere dost",
    options: ["Om Shanti Om", "Luck By Chance", "Rockstar"],
    answer: 0,
  },
  {
    dialogue: "Tumse na ho payega",
    options: ["Gangs of Wasseypur", "Sacred Games", "Satya"],
    answer: 0,
  },
  {
    dialogue: "Rahul, naam toh suna hoga",
    options: ["DDLJ", "Kuch Kuch Hota Hai", "Kal Ho Naa Ho"],
    answer: 1,
  },
  {
    dialogue: "Ja Simran ja, jee le apni zindagi",
    options: ["Veer-Zaara", "DDLJ", "Mohabbatein"],
    answer: 1,
  },
  {
    dialogue: "Ek ladka aur ek ladki kabhi dost nahi ho sakte",
    options: ["Student of the Year", "Kuch Kuch Hota Hai", "Yeh Jawaani Hai Deewani"],
    answer: 1,
  },
  {
    dialogue: "Aaj mere paas gaadi hai, bangla hai, bank balance hai",
    options: ["Deewar", "Trishul", "Muqaddar Ka Sikandar"],
    answer: 0,
  },
  {
    dialogue: "Kabhi kabhi jeetne ke liye kuch haarna padta hai",
    options: ["Chak De India", "Lagaan", "Dangal"],
    answer: 0,
  },
  {
    dialogue: "How’s the josh?",
    options: ["URI: The Surgical Strike", "Shershaah", "Lakshya"],
    answer: 0,
  },
  {
    dialogue: "Zindagi badi honi chahiye, lambi nahi",
    options: ["Anand", "Kal Ho Naa Ho", "Dear Zindagi"],
    answer: 0,
  },
  {
    dialogue: "Hum jahan khade ho jaate hain, line wahi se shuru hoti hai",
    options: ["Sultan", "Agneepath", "Karan Arjun"],
    answer: 1,
  },
  {
    dialogue: "Babumoshai, zindagi badi honi chahiye",
    options: ["Anand", "Guide", "Abhimaan"],
    answer: 0,
  },
  {
    dialogue: "Rishte mein toh hum tumhare baap lagte hain",
    options: ["Dilwale", "Wanted", "Dabangg"],
    answer: 0,
  },
  {
    dialogue: "Itni shiddat se maine tumhe paane ki koshish ki hai",
    options: ["Om Shanti Om", "Veer-Zaara", "Jab Tak Hai Jaan"],
    answer: 0,
  },
];


function Dialogbaazi({ activity, onComplete }) {
  const [question, setQuestion] = useState(null);
  const [selected, setSelected] = useState(null);
  const [isGenerating, setIsGenerating] = useState(true);

  useEffect(() => {
    const loadQuestion = async () => {
      try {
        // Try to generate AI dialogue
        const aiContent = await generateAIContent('dialogbaazi');
        const parsed = parseAIContent(aiContent);
        
        if (parsed && parsed.dialogue && parsed.options && Array.isArray(parsed.options) && typeof parsed.answer === 'number') {
          setQuestion(parsed);
        } else {
          throw new Error('Invalid format');
        }
      } catch (error) {
        console.error('Error generating dialogue:', error);
        // Fallback to hardcoded dialogues
        const randomQ = DIALOGUES[Math.floor(Math.random() * DIALOGUES.length)];
        setQuestion(randomQ);
      } finally {
        setIsGenerating(false);
      }
    };

    loadQuestion();
  }, []);

  const handleSelect = (index) => {
    if (selected !== null) return;
    setSelected(index);
    
    setTimeout(() => {
      onComplete();
    }, 2000);
  };

  if (!question || isGenerating) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <div className="text-white/50">Generating dialogue...</div>
      </div>
    );
  }

  return (
    <div className="h-full w-full flex flex-col items-center justify-start pt-8 pb-16 px-6 bg-gradient-to-br from-[#0a0a0a] via-[#1a050a] to-[#0a0a0a] overflow-y-auto">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-md w-full"
      >
        <h2 className="text-3xl font-black text-center mb-2">
          <span className="bg-gradient-to-r from-rose-400 via-pink-500 to-red-500 bg-clip-text text-transparent">Dialogbaazi</span> 🎬
        </h2>
        <p className="text-center text-white/40 text-sm mb-6">
          {ACTIVITY_DESCRIPTIONS.dialogbaazi}
        </p>

        <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 mb-6 border border-white/10">
          <p className="text-xl text-white/90 text-center italic">
            "{question.dialogue}"
          </p>
        </div>

        <div className="space-y-4">
          {question.options.map((opt, idx) => (
            <motion.button
              key={idx}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleSelect(idx)}
              disabled={selected !== null}
              className={`w-full py-4 rounded-2xl font-bold text-lg transition-all ${
                selected === idx
                  ? selected === question.answer
                    ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-2xl shadow-green-500/30'
                    : 'bg-gradient-to-r from-red-600 to-pink-600 text-white shadow-2xl shadow-red-500/30'
                  : 'bg-white/10 backdrop-blur-lg hover:bg-white/15 text-white border border-white/10'
              }`}
            >
              {opt}
            </motion.button>
          ))}
        </div>

        {selected !== null && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center mt-6 text-white/90 text-xl font-bold"
          >
            {selected === question.answer ? '🎉 Sahi!' : '❌ Galat!'}
          </motion.p>
        )}
      </motion.div>
    </div>
  );
}

export default Dialogbaazi;

