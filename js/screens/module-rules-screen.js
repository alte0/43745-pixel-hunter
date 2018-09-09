import {controlGameScreens} from '../game.js';
import dataGame from '../data-game.js';
import RulesScreen from '../views/screens/module-rules-screen-view.js';

export default () => {
  const rulesScreen = new RulesScreen();

  rulesScreen.checkedValue = (evt, elem) => {
    const targetValue = evt.target.value;
    elem.disabled = !targetValue;
  };
  rulesScreen.nextScreen = () => {
    controlGameScreens(undefined, dataGame);
  };

  return rulesScreen.element;
};
