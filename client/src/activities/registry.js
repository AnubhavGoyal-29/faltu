// Activity Registry - All 20 activities
import SachYaFaltu from './components/SachYaFaltu.jsx';
import YeYaWo from './components/YeYaWo.jsx';
import GentleRoast from './components/GentleRoast.jsx';
import NaamJodi from './components/NaamJodi.jsx';
import BekaarSalah from './components/BekaarSalah.jsx';
import PerfectTap from './components/PerfectTap.jsx';
import Almost from './components/Almost.jsx';
import KaunsaJhooth from './components/KaunsaJhooth.jsx';
import ButtonPakdo from './components/ButtonPakdo.jsx';
import KuchNahi from './components/KuchNahi.jsx';
import GalatButton from './components/GalatButton.jsx';
import Shabdbaazi from './components/Shabdbaazi.jsx';
import Dialogbaazi from './components/Dialogbaazi.jsx';
import UltaPultaShabd from './components/UltaPultaShabd.jsx';
import KismatFlip from './components/KismatFlip.jsx';
import GalatTohGaya from './components/GalatTohGaya.jsx';
import FaltuJokeDrop from './components/FaltuJokeDrop.jsx';
import NoStressMath from './components/NoStressMath.jsx';
import NumberDhoondo from './components/NumberDhoondo.jsx';
import HaathHaathGame from './components/HaathHaathGame.jsx';

export const ACTIVITY_REGISTRY = [
  { id: 'sach-ya-faltu', type: 'sach_ya_faltu', name: 'Sach Ya Faltu', description: 'Decide if the fact is true (Sach) or false (Faltu)' },
  { id: 'ye-ya-wo', type: 'ye_ya_wo', name: 'Ye Ya Wo', description: 'Choose between two options' },
  { id: 'gentle-roast', type: 'gentle_roast', name: 'Gentle Roast Machine', description: 'Read the gentle roast' },
  { id: 'naam-jodi', type: 'naam_jodi', name: 'Naam Jodi', description: 'Enter two names to check compatibility' },
  { id: 'bekaar-salah', type: 'bekaar_salah', name: 'Bekaar Salah', description: 'Read the useless advice' },
  { id: 'perfect-tap', type: 'perfect_tap', name: 'Perfect Tap', description: 'Tap exactly the target number of times' },
  { id: 'almost', type: 'almost', name: 'Almost!', description: 'Stop the progress bar at exactly the target percentage' },
  { id: 'kaunsa-jhooth', type: 'kaunsa_jhooth', name: 'Kaunsa Jhooth?', description: 'Identify which statement is false' },
  { id: 'button-pakdo', type: 'button_pakdo', name: 'Button Pakdo', description: 'Catch the moving button before time runs out' },
  { id: 'kuch-nahi', type: 'kuch_nahi', name: 'Kuch Nahi', description: 'Do nothing for 10 seconds' },
  { id: 'galat-button', type: 'galat_button', name: 'Galat Button', description: 'Choose any button (all are wrong)' },
  { id: 'shabdbaazi', type: 'shabdbaazi', name: 'Shabdbaazi', description: 'Guess the word from the hint and scrambled letters' },
  { id: 'dialogbaazi', type: 'dialogbaazi', name: 'Dialogbaazi', description: 'Identify which movie the dialogue is from' },
  { id: 'ulta-pulta-shabd', type: 'ulta_pulta_shabd', name: 'Ulta-Pulta Shabd', description: 'Unscramble the word within the time limit' },
  { id: 'kismat-flip', type: 'kismat_flip', name: 'Kismat Flip', description: 'Choose Smart or Dumb, then flip a coin' },
  { id: 'galat-toh-gaya', type: 'galat_toh_gaya', name: 'Galat Toh Gaya', description: 'Tap only the correct circles without making a mistake' },
  { id: 'faltu-joke-drop', type: 'faltu_joke_drop', name: 'Faltu Joke Drop', description: 'Read the joke' },
  { id: 'no-stress-math', type: 'no_stress_math', name: 'No-Stress Math', description: 'Solve the simple addition problem' },
  { id: 'number-dhoondo', type: 'number_dhoondo', name: 'Number Dhoondo', description: 'Guess the number (1-100) based on the hint' },
  { id: 'haath-haath-game', type: 'haath_haath_game', name: 'Stone Paper Scissors', description: 'Best of 3 match against AI' },
];

export const ACTIVITY_DESCRIPTIONS = {
  sach_ya_faltu: 'Decide if the fact is true (Sach) or false (Faltu)',
  ye_ya_wo: 'Choose between two options',
  gentle_roast: 'Read the gentle roast',
  naam_jodi: 'Enter two names to check compatibility',
  bekaar_salah: 'Read the useless advice',
  perfect_tap: 'Tap exactly the target number of times',
  almost: 'Stop the progress bar at exactly the target percentage',
  kaunsa_jhooth: 'Identify which statement is false',
  button_pakdo: 'Catch the moving button before time runs out',
  kuch_nahi: 'Do nothing for 10 seconds',
  galat_button: 'Choose any button (all are wrong)',
  shabdbaazi: 'Guess the word from the hint and scrambled letters',
  dialogbaazi: 'Identify which movie the dialogue is from',
  ulta_pulta_shabd: 'Unscramble the word within the time limit',
  kismat_flip: 'Choose Smart or Dumb, then flip a coin',
  galat_toh_gaya: 'Tap only the correct circles without making a mistake',
  faltu_joke_drop: 'Read the joke',
  no_stress_math: 'Solve the simple addition problem',
  number_dhoondo: 'Guess the number (1-100) based on the hint',
  haath_haath_game: 'Best of 3 match against AI',
};

export const ACTIVITY_COMPONENTS = {
  sach_ya_faltu: SachYaFaltu,
  ye_ya_wo: YeYaWo,
  gentle_roast: GentleRoast,
  naam_jodi: NaamJodi,
  bekaar_salah: BekaarSalah,
  perfect_tap: PerfectTap,
  almost: Almost,
  kaunsa_jhooth: KaunsaJhooth,
  button_pakdo: ButtonPakdo,
  kuch_nahi: KuchNahi,
  galat_button: GalatButton,
  shabdbaazi: Shabdbaazi,
  dialogbaazi: Dialogbaazi,
  ulta_pulta_shabd: UltaPultaShabd,
  kismat_flip: KismatFlip,
  galat_toh_gaya: GalatTohGaya,
  faltu_joke_drop: FaltuJokeDrop,
  no_stress_math: NoStressMath,
  number_dhoondo: NumberDhoondo,
  haath_haath_game: HaathHaathGame,
};

