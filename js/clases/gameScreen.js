import Application from './application.js';
import dataGame from '../data-game.js';
import {changeScreen, updateHeader, addModal, deleteElement} from '../module-mangment-dom.js';

import ModalConfirmView from '../views/module-modal-confirm-view.js';
import HeaderView from '../views/module-header-view.js';
import GameOneScreenView from '../views/screens/module-game-1-screen-view.js';
import GameTwoScreenView from '../views/screens/module-game-2-screen-view.js';
import GameThreeScreenView from '../views/screens/module-game-3-screen-view.js';

const INITIAL_GAME = Object.freeze({
  LIVES: 3,
  LEVEL: 0,
  TIME: 30,
  POINTS: 0
});
const MIN_ANSWER = 10;
const TOTAL_TIME = 30;
const FAST_TIME = 10;
const NORMAL_TIME_VALUE_ONE = 10;
const NORMAL_TIME_VALUE_TWO = 20;
const SLOW_TIME = 20;
const WRONG_TEXT = `<li class="stats__result stats__result--wrong"></li>`;
const SLOW_TEXT = `<li class="stats__result stats__result--slow"></li>`;
const FAST_TEXT = `<li class="stats__result stats__result--fast"></li>`;
const CORRECT_TEXT = `<li class="stats__result stats__result--correct"></li>`;
const UNKNOWN_TEXT = `<li class="stats__result stats__result--unknown"></li>`;
const POINT_ADD = 100;
const POINT_BONUS = 50;
const POINT_FINE = 50;
const POINT_BONUS_LIVES = 50;
const TIMER_DELAY = 1000;
let timer;
let timeText;
let UserStat = {
  NAME: ``,
  ANSWERS: []
};

export default class GameScreen {
  constructor(model) {
    this.model = model;
    this._INITIAL_GAME = INITIAL_GAME;
    this._MIN_ANSWER = MIN_ANSWER;
    this._TOTAL_TIME = TOTAL_TIME;
    this._FAST_TIME = FAST_TIME;
    this._NORMAL_TIME_VALUE_ONE = NORMAL_TIME_VALUE_ONE;
    this._NORMAL_TIME_VALUE_TWO = NORMAL_TIME_VALUE_TWO;
    this._SLOW_TIME = SLOW_TIME;
    this._WRONG_TEXT = WRONG_TEXT;
    this._SLOW_TEXT = SLOW_TEXT;
    this._FAST_TEXT = FAST_TEXT;
    this._CORRECT_TEXT = CORRECT_TEXT;
    this._UNKNOWN_TEXT = UNKNOWN_TEXT;
    this._POINT_ADD = POINT_ADD;
    this._POINT_BONUS = POINT_BONUS;
    this._POINT_FINE = POINT_FINE;
    this._POINT_BONUS_LIVES = POINT_BONUS_LIVES;
    this._TIMER_DELAY = TIMER_DELAY;
    this._timer = timer;
    this._timeText = timeText;
    this._UserStat = UserStat;
    this._startTimer();
  }
  modalConfirm() {
    const modalConfirmView = new ModalConfirmView();
    modalConfirmView.nextScreen = () => {
      this.stopTimer();
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
  header(state) {
    const header = new HeaderView(state);
    header.setEventScreen = () => {
      addModal(this.modalConfirm());
    };
    return header.element;
  }
  /** тик времени
  * @param {Object} state
  */
  _tick(state) {
    state.TIME = state.TIME - 1;
    this._timeText = state.TIME;
    updateHeader(this.header(state));
  }
  /** Счетчик времени
  * @param {Object} state
  * @param {Array} questions
  */
  _startTimer(state, questions) {
    this._timer = setTimeout(() => {
      if (state.TIME === 0) {
        const newStateGame = this.recordUserAnswer(false, state);
        this.controlGameScreens(newStateGame, questions);
      } else {
        this._tick(state);
        this._startTimer(state, questions);
      }
    }, this._TIMER_DELAY);
  }
  /**
   * остановка счетчика
  */
  stopTimer() {
    clearTimeout(this._timer);
  }

  _nextScreenForOne(evt, state) {
    const selectUserAnswer = Array.from(evt.currentTarget.elements)
      .map((item) => item.checked && item.value)
      .filter(function (item) {
        return !!item;
      });
    const correctAnswer = Array.from(evt.currentTarget.querySelectorAll(`img`))
      .map((item) => item.getAttribute(`data-type`));

    if (selectUserAnswer.length === correctAnswer.length) {
      const sameArrays = selectUserAnswer.every((item, index) => {
        return item === correctAnswer[index];
      });

      const newState = this.recordUserAnswer(sameArrays, state);
      this.controlGameScreens(newState, dataGame);
    }
  }

  _nextScreenForTwo(evt, state) {
    const targetInput = evt.target;
    const currentTarget = evt.currentTarget;
    const selectUserAnswer = targetInput.value;
    const correctAnswer = currentTarget.querySelector(`img`).getAttribute(`data-type`);

    const newState = this.recordUserAnswer(correctAnswer === selectUserAnswer, state);
    this.controlGameScreens(newState, dataGame);
  }

  _nextScreenForThree(evt, state, correctAnswer) {
    const target = evt.target;
    const selectUserAnswer = target.getAttribute(`data-type`);

    const newState = this.recordUserAnswer(correctAnswer === selectUserAnswer, state);
    this.controlGameScreens(newState, dataGame);
  }

  _returnScreenGame(valueScreen) {
    let typeScreen = ``;
    switch (valueScreen) {
      case `gameOne`:
        typeScreen = (stateGame, arrImages, statsAnswersStr) => {
          const gameOneScreen = new GameOneScreenView(stateGame, arrImages, statsAnswersStr);
          gameOneScreen.nextScreen = (evt, state) => this._nextScreenForOne(evt, state);
          return gameOneScreen.element;
        };
        break;
      case `gameTwo`:
        typeScreen = (stateGame, arrImages, statsAnswersStr) => {
          const gameTwoScreen = new GameTwoScreenView(stateGame, arrImages, statsAnswersStr);
          gameTwoScreen.nextScreen = (evt, state) => this._nextScreenForTwo(evt, state);
          return gameTwoScreen.element;
        };
        break;
      case `gameThree`:
        typeScreen = (stateGame, arrImages, statsAnswersStr) => {
          const gameThreeScreen = new GameThreeScreenView(stateGame, arrImages, statsAnswersStr);
          // gameThreeScreen.nextScreen = (evt, state) => this._nextScreenForThree(evt, state);
          gameThreeScreen.nextScreen = (evt, state) => this._nextScreenForThree(evt, state, gameThreeScreen.CORRECT_ANSWER);
          return gameThreeScreen.element;
        };
        break;
    }
    return typeScreen;
  }

  /**
  * возврашает функцию устанавливаюшую игровой экран или экран результатов
  * @param {Object} state
  * @param {Array} array
  * @param {String} statsAnswersStr
  * @return {Function}
  */
  _setGame(state, array, statsAnswersStr) {
    let index = state.LEVEL;
    const gameScreen = this._returnScreenGame(array[index].type);
    const newState = Object.assign({}, state, {
      LEVEL: state.LEVEL + 1
    });
    const gameStateHeader = Object.assign({}, newState, {
      TIME: this._INITIAL_GAME.TIME
    });
    this._startTimer(gameStateHeader, array);

    return gameScreen(newState, array[index].images, statsAnswersStr);
  }
  /**
  * записываем ответ пользователя
  * @param {Boolean} value
  * @param {Object} state
  * @return {Object}
  */
  recordUserAnswer(value, state) {
    if (value) {
      this._UserStat.ANSWERS.push({answer: true, elapsedTime: this._TOTAL_TIME - this._timeText});
      return state;
    } else {
      this._UserStat.ANSWERS.push({answer: false, elapsedTime: this._TOTAL_TIME - this._timeText});
      return Object.assign({}, state, {
        LIVES: state.LIVES - 1
      });
    }
  }

  /** создание графики ответов
  * @return {String} answersListStr
  */
  _createResponseStatistics() {
    let answersListStr = new Array(10);

    let answersListUser = this._UserStat.ANSWERS.slice();

    for (let i = 0; i < answersListStr.length; i++) {
      if (answersListUser[i] === undefined) {
        answersListStr[i] = UNKNOWN_TEXT;
      }
      if (answersListUser[i]) {
        const elapsedTime = answersListUser[i].elapsedTime;
        if (elapsedTime < this._FAST_TIME) {
          answersListStr[i] = FAST_TEXT;
        }
        if (elapsedTime > this._SLOW_TIME) {
          answersListStr[i] = SLOW_TEXT;
        }
        if (elapsedTime >= this._NORMAL_TIME_VALUE_ONE && elapsedTime <= this._NORMAL_TIME_VALUE_TWO || elapsedTime === undefined) {
          answersListStr[i] = CORRECT_TEXT;
        }
        if (answersListUser[i].answer === false) {
          answersListStr[i] = WRONG_TEXT;
        }
      }
    }

    answersListStr = answersListStr.join(``);
    return answersListStr;
  }

  /**
  * управление игровыми экранами
  * @param {Object} state
  * @param {Array} questions
  */
  controlGameScreens(state = Object.assign({}, this._INITIAL_GAME), questions) {
    if (state.LEVEL === 0) {
      this._UserStat.ANSWERS = [];
    }
    let statsAnswersStr = this._createResponseStatistics();
    if (state.LIVES === -1 || state.LEVEL >= questions.length) {
      this.stopTimer();
      const resulltUserStat = this._calculatePoints(this._UserStat.ANSWERS, state);
      Application.showResultScreen(resulltUserStat, statsAnswersStr);
      return;
    }
    this.stopTimer();
    changeScreen(this.header(state), this._setGame(state, questions, statsAnswersStr));
  }
  /** Подсчет очков при окончании игры
  * @param {Array} arrayUserAnswers
  * @param {Object} dataAnswers
  * @return {Object} newData
  */
  _calculatePoints(arrayUserAnswers, dataAnswers) {
    if (arrayUserAnswers.length < this._MIN_ANSWER) {
      dataAnswers.POINTS = -1;
      return dataAnswers;
    }

    dataAnswers.generalPoints = {
      POINTS: 0
    };
    dataAnswers.fastPoints = {
      POINTS: 0,
      ITEMS: 0
    };
    dataAnswers.slowPoints = {
      POINTS: 0,
      ITEMS: 0
    };
    dataAnswers.normalPoints = {
      POINTS: 0,
      ITEMS: 0
    };
    dataAnswers.livesPoints = {
      POINTS: 0,
      ITEMS: 0
    };

    arrayUserAnswers.forEach((item) => {
      const answer = item.answer;
      const elapsedTime = item.elapsedTime;
      if (answer && elapsedTime < this._FAST_TIME) {
        dataAnswers.fastPoints.POINTS = dataAnswers.fastPoints.POINTS + this._POINT_ADD + this._POINT_BONUS;
        dataAnswers.fastPoints.ITEMS += 1;
      } else if (answer && elapsedTime >= this._NORMAL_TIME_VALUE_ONE && elapsedTime <= this._NORMAL_TIME_VALUE_TWO) {
        dataAnswers.normalPoints.POINTS = dataAnswers.normalPoints.POINTS + this._POINT_ADD;
        dataAnswers.normalPoints.ITEMS += 1;
      } else if (answer && elapsedTime > this._SLOW_TIME) {
        dataAnswers.slowPoints.POINTS = dataAnswers.slowPoints.POINTS + this._POINT_ADD - this._POINT_FINE;
        dataAnswers.slowPoints.ITEMS += 1;
      }
      if (answer) {
        dataAnswers.generalPoints.POINTS = dataAnswers.generalPoints.POINTS + this._POINT_ADD;
      }
    });

    if (dataAnswers.LIVES >= 0) {
      dataAnswers.livesPoints.POINTS = dataAnswers.livesPoints.POINTS + dataAnswers.LIVES * this._POINT_BONUS_LIVES;
      dataAnswers.livesPoints.ITEMS = dataAnswers.LIVES;
    }
    dataAnswers.POINTS = dataAnswers.POINTS + dataAnswers.fastPoints.POINTS + dataAnswers.slowPoints.POINTS + dataAnswers.normalPoints.POINTS + dataAnswers.livesPoints.POINTS;

    return dataAnswers;
  }

  startGame() {
    this.controlGameScreens(undefined, dataGame);
  }

}
