const { isAIEnabled, callAI } = require('./aiDecisionEngine');

// Hinglish jokes (naughty allowed)
const hinglishJokes = [
  {
    setup: "Ek ladki ne apne boyfriend se pucha:",
    punchline: "'Tumhare paas kya hai?' Boyfriend: 'Mere paas iPhone hai, car hai, ghar hai...' Ladki: 'Toh phir tumhare paas kya nahi hai?' Boyfriend: 'Tumhare jaisi girlfriend nahi hai!' 😂",
    category: "relationship"
  },
  {
    setup: "Teacher: 'Beta, tumhare papa ka naam kya hai?'",
    punchline: "Student: 'Papa ka naam Papa hai!' Teacher: 'Tumhare dada ka naam?' Student: 'Dada ka naam Dada hai!' Teacher: 'Tum pagal ho?' Student: 'Nahi ma'am, meri mummy pagal hai!' 🤣",
    category: "school"
  },
  {
    setup: "Ek aadmi ne apni biwi se pucha:",
    punchline: "'Tum mujhe kyun shaadi kiya?' Biwi: 'Tumhare paas paisa tha!' Aadmi: 'Ab kya?' Biwi: 'Ab tumhare paas paisa nahi hai!' 😅",
    category: "marriage"
  },
  {
    setup: "Doctor: 'Aapko kya problem hai?'",
    punchline: "Patient: 'Mujhe lagta hai main pagal ho gaya hoon!' Doctor: 'Kyun?' Patient: 'Kyunki mujhe lagta hai main pagal ho gaya hoon!' Doctor: 'Haan, aap pagal ho!' 😂",
    category: "doctor"
  },
  {
    setup: "Ek ladke ne apni girlfriend se kaha:",
    punchline: "'Tum bahut khoobsurat ho!' Girlfriend: 'Thank you!' Ladka: 'Par tumhare paas dimag nahi hai!' Girlfriend: 'Tumhare paas bhi toh nahi hai!' 😄",
    category: "relationship"
  },
  {
    setup: "Mummy: 'Beta, padhai karo!'",
    punchline: "Beta: 'Kyun?' Mummy: 'Engineer bano!' Beta: 'Kyun?' Mummy: 'Paisa kamao!' Beta: 'Kyun?' Mummy: 'Shaadi karo!' Beta: 'Kyun?' Mummy: 'Bacche paida karo!' Beta: 'Kyun?' Mummy: 'Pagal ho kya?' Beta: 'Kyun?' 😂",
    category: "family"
  },
  {
    setup: "Ek aadmi ne apne dost se pucha:",
    punchline: "'Tumhare paas kitne paise hain?' Dost: '10 lakh!' Aadmi: 'Arre yaar, main soch raha tha tumhare paas 20 lakh honge!' Dost: 'Haan, 10 lakh mere paas hain aur 10 lakh tumhare paas hain!' 😅",
    category: "money"
  },
  {
    setup: "Wife: 'Tum mujhe kyun nahi samajhte?'",
    punchline: "Husband: 'Kyunki tum khud hi nahi samajhte ki tum kya chahti ho!' Wife: 'Toh tumhe pata hai ki main kya chahti hoon?' Husband: 'Nahi!' Wife: 'Dekha, tum nahi samajhte!' 😂",
    category: "marriage"
  },
  {
    setup: "Ek ladki ne apne boyfriend se kaha:",
    punchline: "'Tum bahut handsome ho!' Boyfriend: 'Thank you!' Ladki: 'Par tumhare paas dimag nahi hai!' Boyfriend: 'Tumhare paas bhi toh nahi hai!' Ladki: 'Main toh pagal hoon, tum kya excuse hai?' 😄",
    category: "relationship"
  },
  {
    setup: "Boss: 'Tum late kyun aaye?'",
    punchline: "Employee: 'Sir, main soch raha tha ki main time par aaoonga!' Boss: 'Toh phir late kyun aaye?' Employee: 'Kyunki main soch raha tha!' 😂",
    category: "office"
  },
  {
    setup: "Ek aadmi ne apne dost se pucha:",
    punchline: "'Tumhare paas kitni girlfriend hain?' Dost: 'Ek bhi nahi!' Aadmi: 'Arre yaar, main soch raha tha tumhare paas 5 hongi!' Dost: 'Haan, ek bhi nahi hai, aur 5 toh bilkul nahi hain!' 😅",
    category: "relationship"
  },
  {
    setup: "Mummy: 'Beta, khaana kha lo!'",
    punchline: "Beta: 'Nahi chahiye!' Mummy: 'Kyun?' Beta: 'Bhook nahi hai!' Mummy: 'Toh phir kya chahiye?' Beta: 'Kuch nahi!' Mummy: 'Pagal ho kya?' Beta: 'Haan, kyunki main khaana nahi kha raha!' 😂",
    category: "family"
  },
  {
    setup: "Ek scientist ne atom se pucha:",
    punchline: "'Tum kyun sach nahi bolte?' Atom: 'Kyunki main sab kuch banata hoon!' Scientist: 'Kya matlab?' Atom: 'Main sab kuch make up karta hoon!' 😂",
    category: "science"
  },
  {
    setup: "Ek scarecrow ne award jeeta:",
    punchline: "Kyunki wo field mein outstanding tha! Field mein khada tha, award mil gaya! 😄",
    category: "general"
  },
  {
    setup: "Ek anda ne joke sunaya:",
    punchline: "Dusre ande ne kaha: 'Yaar, tumhara joke sunke main crack ho gaya!' 😂",
    category: "food"
  },
  {
    setup: "Ek fake noodle ko kya kehte hain?",
    punchline: "Impasta! Kyunki wo fake pasta hai! 😅",
    category: "food"
  },
  {
    setup: "Ek math book bahut sad kyun thi?",
    punchline: "Kyunki usme bahut saare problems the! Problems solve karni thi, isliye sad thi! 😂",
    category: "education"
  },
  {
    setup: "Ek bear ke paas teeth nahi hai, uska naam kya hai?",
    punchline: "Gummy bear! Kyunki wo gummy hai! 😄",
    category: "animals"
  },
  {
    setup: "Programmers nature ko kyun pasand nahi karte?",
    punchline: "Kyunki usme bahut saare bugs hain! Bugs fix karni padti hain! 😂",
    category: "tech"
  },
  {
    setup: "Switzerland ki best baat kya hai?",
    punchline: "Pata nahi, par uska flag ek bada plus hai! Plus sign! 😄",
    category: "general"
  },
  {
    setup: "Coffee ne police complaint kyun ki?",
    punchline: "Kyunki use mugged kiya gaya! Mugged matlab chori, aur coffee mug mein hoti hai! 😂",
    category: "food"
  },
  {
    setup: "Ek sote hue bull ko kya kehte hain?",
    punchline: "Bulldozer! Kyunki wo so raha hai aur doze kar raha hai! 😅",
    category: "animals"
  },
  {
    setup: "Skeletons aapas mein kyun nahi ladte?",
    punchline: "Kyunki unke paas guts nahi hain! Guts matlab himmat, par skeletons ke paas kuch nahi hota! 😂",
    category: "general"
  },
  {
    setup: "Kya orange hai aur parrot ki tarah sound karta hai?",
    punchline: "Carrot! Kyunki carrot orange hai aur parrot ki tarah sound karta hai! 😄",
    category: "food"
  },
  {
    setup: "Tomato kyun red ho gaya?",
    punchline: "Kyunki usne salad dressing dekhi! Dressing dekhke sharmaya aur red ho gaya! 😂",
    category: "food"
  },
  {
    setup: "Ek fish jo bowtie pehenti hai, uska naam kya hai?",
    punchline: "Sofishticated! Kyunki wo sophisticated hai! 😅",
    category: "animals"
  },
  {
    setup: "Oysters charity ko kyun paise nahi dete?",
    punchline: "Kyunki wo shellfish hain! Shellfish matlab selfish! 😂",
    category: "animals"
  },
  {
    setup: "Ek factory jo okay products banati hai, uska naam kya hai?",
    punchline: "Satisfactory! Kyunki wo satisfactory products banati hai! 😄",
    category: "general"
  },
  {
    setup: "Golfer ne do pants kyun liye?",
    punchline: "Kyunki agar usko hole in one mila toh ek pant mein hole ho jayega! 😂",
    category: "sports"
  },
  {
    setup: "Scientists stairs par kyun trust nahi karte?",
    punchline: "Kyunki wo hamesha up to something hain! Up to something matlab kuch karne wale hain! 😄",
    category: "science"
  },
  {
    setup: "Baarish mein bear ko kya kehte hain?",
    punchline: "Drizzly bear! Kyunki wo drizzly weather mein hai! 😂",
    category: "animals"
  }
];

// Get random joke
const getRandomJoke = async (user = null) => {
  // Try AI first if enabled
  if (isAIEnabled() && user) {
    try {
      console.log(`🤖 [JOKES] AI se joke generate kar rahe hain...`);
      const aiResponse = await callAI({
        user,
        reason: 'joke',
        appState: { action: 'get_joke' }
      });

      if (aiResponse && aiResponse.joke) {
        console.log(`🤖 [JOKES] ✅ AI joke mil gaya!`);
        return {
          setup: aiResponse.setup || '',
          punchline: aiResponse.joke || aiResponse.punchline || aiResponse.content,
          category: aiResponse.category || 'random',
          source: 'ai'
        };
      }
    } catch (error) {
      console.error(`🤖 [JOKES] ❌ AI error:`, error.message);
    }
  }

  // Fallback to random Hinglish joke
  console.log(`🤖 [JOKES] ⚠️ AI nahi mila - random Hinglish joke use kar rahe hain`);
  const randomJoke = hinglishJokes[Math.floor(Math.random() * hinglishJokes.length)];
  return {
    ...randomJoke,
    source: 'database'
  };
};

// Get joke by category
const getJokeByCategory = async (category, user = null) => {
  const categoryJokes = hinglishJokes.filter(j => j.category === category);
  
  if (categoryJokes.length > 0) {
    const randomJoke = categoryJokes[Math.floor(Math.random() * categoryJokes.length)];
    return {
      ...randomJoke,
      source: 'database'
    };
  }

  // Fallback to random
  return await getRandomJoke(user);
};

module.exports = {
  getRandomJoke,
  getJokeByCategory,
  hinglishJokes
};
