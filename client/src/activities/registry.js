import SachYaFaltu from './components/SachYaFaltu';
import YeYaWo from './components/YeYaWo';
import GentleRoast from './components/GentleRoast';
import BekaarSalah from './components/BekaarSalah';
import NaamJodi from './components/NaamJodi';
import FaltuJokeDrop from './components/FaltuJokeDrop';
import PerfectTap from './components/PerfectTap';
import Almost from './components/Almost';
import KuchNahi from './components/KuchNahi';
import ButtonPakdo from './components/ButtonPakdo';
import GalatButton from './components/GalatButton';
import KismatFlip from './components/KismatFlip';
import NoStressMath from './components/NoStressMath';
import KaunsaJhooth from './components/KaunsaJhooth';
import Shabdbaazi from './components/Shabdbaazi';
import Dialogbaazi from './components/Dialogbaazi';
import UltaPultaShabd from './components/UltaPultaShabd';
import NumberDhoondo from './components/NumberDhoondo';
import GalatTohGaya from './components/GalatTohGaya';
import HaathHaathGame from './components/HaathHaathGame';

// Registry of all 20 MVP activities
export const ACTIVITY_REGISTRY = [
    { id: 'sach-ya-faltu', component: SachYaFaltu, weight: 1 },
    { id: 'ye-ya-wo', component: YeYaWo, weight: 1 },
    { id: 'gentle-roast', component: GentleRoast, weight: 1 },
    { id: 'bekaar-salah', component: BekaarSalah, weight: 1 },
    { id: 'naam-jodi', component: NaamJodi, weight: 1 },
    { id: 'faltu-joke-drop', component: FaltuJokeDrop, weight: 1 },
    { id: 'perfect-tap', component: PerfectTap, weight: 1 },
    { id: 'almost', component: Almost, weight: 1 },
    { id: 'kuch-nahi', component: KuchNahi, weight: 1 },
    { id: 'button-pakdo', component: ButtonPakdo, weight: 1 },
    { id: 'galat-button', component: GalatButton, weight: 1 },
    { id: 'kismat-flip', component: KismatFlip, weight: 1 },
    { id: 'no-stress-math', component: NoStressMath, weight: 1 },
    { id: 'kaunsa-jhooth', component: KaunsaJhooth, weight: 1 },
    { id: 'shabdbaazi', component: Shabdbaazi, weight: 1 },
    { id: 'dialogbaazi', component: Dialogbaazi, weight: 1 },
    { id: 'ulta-pulta-shabd', component: UltaPultaShabd, weight: 1 },
    { id: 'number-dhoondo', component: NumberDhoondo, weight: 1 },
    { id: 'galat-toh-gaya', component: GalatTohGaya, weight: 1 },
    { id: 'haath-haath-game', component: HaathHaathGame, weight: 1 },
];

export const getRandomActivity = (lastActivityId = null) => {
    const available = ACTIVITY_REGISTRY.filter(a => a.id !== lastActivityId || ACTIVITY_REGISTRY.length === 1);
    const randomIndex = Math.floor(Math.random() * available.length);
    return available[randomIndex];
};
