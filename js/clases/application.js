import {deleteElement, changeScreen} from '../module-mangment-dom.js';

import MainScreenView from '../views/screens/module-main-screen-view.js';
import WelcomeScreenView from '../views/screens/module-welcome-screen-view.js';
import RulesScreenView from '../views/screens/module-rules-screen-view.js';
import ResultScreenView from '../views/screens/module-result-screen-view.js';
import ModalConfirmView from '../views/module-modal-confirm-view.js';

import GameModel from './gameModel.js';
import GameScreen from './gameScreen.js';

export default class Application {

  static showMainScreen() {
    const mainScreen = () => {
      const mainScreenView = new MainScreenView();
      mainScreenView.nextScreen = () => {
        Application.showWelcomeScreen();
      };

      return mainScreenView.element;
    };

    changeScreen(mainScreen());
  }

  static showWelcomeScreen() {
    const welcomeScreen = () => {
      const welcomeScreenView = new WelcomeScreenView();
      welcomeScreenView.nextScreen = () => {
        Application.showRulesScreen();
      };

      return welcomeScreenView.element;
    };

    changeScreen(welcomeScreen());
  }

  static showRulesScreen() {
    const rulesScreen = () => {
      const rulesScreenView = new RulesScreenView();
      rulesScreenView.checkedValue = (evt, elem) => {
        const targetValue = evt.target.value;
        elem.disabled = !targetValue;
      };
      rulesScreenView.nextScreen = () => {
        Application.showGame();
      };

      return rulesScreenView.element;
    };

    changeScreen(rulesScreen());
  }

  static showGame(playerName) {
    const gameScreen = new GameScreen(new GameModel(playerName));
    gameScreen.startGame();
  }

  static showResultScreen(objUserStat, statsAnswersStr) {
    const resultScreen = () => {
      const resultScreenView = new ResultScreenView(objUserStat, statsAnswersStr);
      return resultScreenView.element;
    };

    changeScreen(resultScreen(objUserStat, statsAnswersStr));
  }

  static showModalConfirm() {
    const modalConfirmView = new ModalConfirmView();
    modalConfirmView.nextScreen = () => {
      Application.showWelcomeScreen();
    };
    modalConfirmView.closeModal = (elem) => {
      deleteElement(elem);
    };
    modalConfirmView.closeEscModal = (evt, elem) => {
      if (evt.keyCode === modalConfirmView.ESC_CODE) {
        modalConfirmView.closeModal(elem);
      }
    };

    return modalConfirmView.element;
  }

}
