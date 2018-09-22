(function () {
  'use strict';

  const mainElement = document.querySelector(`#main`);

  /**
  * рендеринг template
  * @param {String} strHtml
  * @return {HTMLElement} fragment
  */
  const renderTemplate = (strHtml) => {
    const wrapperTemplate = document.createElement(`template`);
    wrapperTemplate.innerHTML = strHtml;
    return wrapperTemplate.content;
  };
  /**
  * вставка данных из template
  * @param {HTMLElement} elements
  */
  const changeScreen = (...elements) => {
    mainElement.innerHTML = ``;
    elements.forEach((element) => {
      mainElement.appendChild(element);
    });
  };
  /**
  * вставка данных из template "модального окна"
  * @param {HTMLElement} element
  */
  const addModal = (element) => {
    mainElement.appendChild(element);
  };
  /**
  * удаление HTMLElement
  * @param {HTMLElement} element
  */
  const deleteElement = (element) => {
    mainElement.removeChild(element);
  };
  /**
  * обновление header
  * @param {HTMLElement} newElem
  */
  const updateHeader = (newElem) => {
    const deleteElem = mainElement.querySelector(`.header`);
    mainElement.replaceChild(newElem, deleteElem);
  };

  class AbstractView {
    constructor() {
      if (new.target === AbstractView) {
        throw new Error(`Can't instantiate AbstractView, only concrete one`);
      }
    }

    get template() {
      throw new Error(`Template is required`);
    }

    get element() {
      if (this._element) {
        return this._element;
      }
      this._element = this.render();
      this.bind(this._element);
      return this._element;
    }

    render() {
      return renderTemplate(this.template);
    }

    bind() {
      // bind handlers if required
    }
  }

  class MainView extends AbstractView {
    get template() {
      return `
    <section class="intro">
      <button class="intro__asterisk asterisk" type="button"><span class="visually-hidden">Продолжить</span>*</button>
      <p class="intro__motto"><sup>*</sup> Это не фото. Это рисунок маслом нидерландского художника-фотореалиста Tjalf Sparnaay.</p>
    </section>
    `;
    }

    nextScreen() {}

    bind() {
      const btnIntroAsterisk = this.element.querySelector(`.intro__asterisk`);

      /**
       * изменение sсreen по клику
       */
      const clickBtnHandler = () => {
        this.nextScreen();
      };

      btnIntroAsterisk.addEventListener(`click`, clickBtnHandler);
    }
  }

  class WelcomeView extends AbstractView {
    get template() {
      return `
      <section class="greeting central--blur">
        <img class="greeting__logo" src="img/logo_ph-big.svg" width="201" height="89" alt="Pixel Hunter">
        <div class="greeting__asterisk asterisk"><span class="visually-hidden">Я просто красивая звёздочка</span>*</div>
        <div class="greeting__challenge">
          <h3 class="greeting__challenge-title">Лучшие художники-фотореалисты бросают тебе вызов!</h3>
          <p class="greeting__challenge-text">Правила игры просты:</p>
          <ul class="greeting__challenge-list">
            <li>Нужно отличить рисунок от фотографии и сделать выбор.</li>
            <li>Задача кажется тривиальной, но не думай, что все так просто.</li>
            <li>Фотореализм обманчив и коварен.</li>
            <li>Помни, главное — смотреть очень внимательно.</li>
          </ul>
        </div>
        <button class="greeting__continue" type="button">
          <span class="visually-hidden">Продолжить</span>
          <svg class="icon" width="64" height="64" viewBox="0 0 64 64" fill="#000000">
            <use xlink:href="img/sprite.svg#arrow-right"></use>
          </svg>
        </button>
      </section>
    `;
    }

    nextScreen() { }

    bind() {
      const btnGreetingContinue = this.element.querySelector(`.greeting__continue`);

      /**
       * изменение sсreen по клику
       */
      const clickBtnHandler = () => {
        this.nextScreen();
      };

      btnGreetingContinue.addEventListener(`click`, clickBtnHandler);
    }
  }

  /**
   * добавляет модальное окно с подтверждением
   */
  const clickHandler = () => {
    addModal(Application.showModalConfirm());
  };
  /** поиск кнопки назад на экране и установка события
   * @param {HTMLElement} searchElementInWrap
   */
  const setEventForBtnBack = (searchElementInWrap) => {
    const btnBack = searchElementInWrap.querySelector(`.back`);
    btnBack.addEventListener(`click`, clickHandler);
  };

  class RulesView extends AbstractView {
    get template() {
      return `
      <header class="header">
        <button class="back">
          <span class="visually-hidden">Вернуться к началу</span>
          <svg class="icon" width="45" height="45" viewBox="0 0 45 45" fill="#000000">
            <use xlink:href="img/sprite.svg#arrow-left"></use>
          </svg>
          <svg class="icon" width="101" height="44" viewBox="0 0 101 44" fill="#000000">
            <use xlink:href="img/sprite.svg#logo-small"></use>
          </svg>
        </button>
      </header>
      <section class="rules">
        <h2 class="rules__title">Правила</h2>
        <ul class="rules__description">
          <li>Угадай 10 раз для каждого изображения фото
            <img class="rules__icon" src="img/icon-photo.png" width="32" height="31" alt="Фото"> или рисунок
            <img class="rules__icon" src="img/icon-paint.png" width="32" height="31" alt="Рисунок"></li>
          <li>Фотографиями или рисунками могут быть оба изображения.</li>
          <li>На каждую попытку отводится 30 секунд.</li>
          <li>Ошибиться можно не более 3 раз.</li>
        </ul>
        <p class="rules__ready">Готовы?</p>
        <form class="rules__form">
          <input class="rules__input" type="text" placeholder="Ваше Имя">
          <button class="rules__button  continue" type="submit" disabled>Go!</button>
        </form>
      </section>
    `;
    }

    recordNamePlay() {}
    nextScreen() {}
    checkedValue() {}

    bind() {
      const fieldName = this.element.querySelector(`.rules__input`);
      const rulesForm = this.element.querySelector(`.rules__form`);
      const btnRulesForm = this.element.querySelector(`.rules__button`);

      /** функция управляет состоянием disabled кнопки формы btnRulesForm в зависимости от значения инпута в форме
      * @param {Event} evt
      * @param {HTMLElement} elem
      */
      const checkedValueHandler = (evt, elem) => {
        this.checkedValue(evt, elem);
      };
      /** изменение sreen при отправке формы
      * @param {Event} evt
      * @param {HTMLElement} elem
      */
      const submitFormHandler = (evt, elem) => {
        evt.preventDefault();

        this.recordNamePlay(elem);
        this.nextScreen();
      };

      fieldName.addEventListener(`input`, (evt) => {
        checkedValueHandler(evt, btnRulesForm);
      });
      rulesForm.addEventListener(`submit`, (evt) => {
        submitFormHandler(evt, fieldName);
      });

      setEventForBtnBack(this.element);
    }
  }

  class ResultView extends AbstractView {
    constructor(objUserStat, statsAnswersStr) {
      super();
      this._objUserStat = objUserStat;
      this._statsAnswersStr = statsAnswersStr;
    }

    createTemplate(obj) {
      let slowPoint;
      if (obj.slowPoints) {
        slowPoint = obj.slowPoints.POINTS === 0 ? 0 : `-` + obj.slowPoints.POINTS;
      } else {
        slowPoint = ``;
      }
      let generalPoints;
      if (obj.generalPoints) {
        generalPoints = obj.generalPoints.POINTS !== undefined ? obj.generalPoints.POINTS : ``;
      } else {
        generalPoints = ``;
      }

      let html = ``;
      const htmlHeader = `<header class="header">
    <button class="back">
      <span class="visually-hidden">Вернуться к началу</span>
      <svg class="icon" width="45" height="45" viewBox="0 0 45 45" fill="#000000">
        <use xlink:href="img/sprite.svg#arrow-left"></use>
      </svg>
      <svg class="icon" width="101" height="44" viewBox="0 0 101 44" fill="#000000">
        <use xlink:href="img/sprite.svg#logo-small"></use>
      </svg>
    </button>
  </header>
  <section class="result">
    <h2 class="result__title">${obj.POINTS > 0 ? `Победа!` : `Проиграл!`}</h2>`;

      const HTML_TABLE_POINTS = `<table class="result__table">
    <tr>
      <td class="result__number">1.</td>
      <td colspan="2">
        <ul class="stats">
          ${this._statsAnswersStr}
        </ul>
      </td>
      <td class="result__points">× 100</td>
      <td class="result__total">${generalPoints}</td>
    </tr>
    <tr>
      <td></td>
      <td class="result__extra">Бонус за скорость:</td>
      <td class="result__extra">${obj.fastPoints ? obj.fastPoints.ITEMS : ``}<span class="stats__result stats__result--fast"></span></td>
      <td class="result__points">× 150</td>
      <td class="result__total">${obj.fastPoints ? obj.fastPoints.POINTS : ``}</td>
    </tr>
    <tr>
      <td></td>
      <td class="result__extra">Бонус за жизни:</td>
      <td class="result__extra">${obj.livesPoints ? obj.livesPoints.ITEMS : ``}<span class="stats__result stats__result--alive"></span></td>
      <td class="result__points">× 50</td>
      <td class="result__total">${obj.livesPoints ? obj.livesPoints.POINTS : ``}</td>
    </tr>
    <tr>
      <td></td>
      <td class="result__extra">Штраф за медлительность:</td>
      <td class="result__extra">${obj.slowPoints ? obj.slowPoints.ITEMS : obj.slowPoints}<span class="stats__result stats__result--slow"></span></td>
      <td class="result__points">× 50</td>
      <td class="result__total">${slowPoint}</td>
    </tr>
    <tr>
      <td colspan="5" class="result__total  result__total--final">${obj.POINTS}</td>
    </tr>
  </table>`;

      const HTML_TABLE_FAIL = `<table class="result__table">
    <tr>
      <td class="result__number">2.</td>
      <td>
        <ul class="stats">
          ${this._statsAnswersStr}
        </ul>
      </td>
      <td class="result__total"></td>
      <td class="result__total  result__total--final">fail</td>
    </tr>
  </table>`;

      if (obj.POINTS === -1) {
        html = htmlHeader + HTML_TABLE_FAIL;
      }
      if (obj.POINTS > 0) {
        html = htmlHeader + HTML_TABLE_POINTS;
      }


      html += `</section>`;
      return html;
    }

    get template() {
      return this.createTemplate(this._objUserStat);
    }

    bind() {
      setEventForBtnBack(this.element);
    }
  }

  class ModalConfirmView extends AbstractView {
    constructor() {
      super();
      this.ESC_CODE = 27;
      this._objectHandler = {};
    }

    get template() {
      return `
      <section class="modal">
        <form class="modal__inner">
          <button class="modal__close" type="button">
            <span class="visually-hidden">Закрыть</span>
          </button>
          <h2 class="modal__title">Подтверждение</h2>
          <p class="modal__text">Вы уверены что хотите начать игру заново?</p>
          <div class="modal__button-wrapper">
            <button class="modal__btn">Ок</button>
            <button class="modal__btn">Отмена</button>
          </div>
        </form>
      </section>
    `;
    }

    nextScreen() {}
    closeModal() {}
    closeEscModal() {}

    bind() {
      const modal = this.element.querySelector(`.modal`);
      const modalBtnClose = this.element.querySelector(`.modal__close`);
      const modalBtnOk = this.element.querySelectorAll(`.modal__btn`)[0];
      const modalBtnCancel = this.element.querySelectorAll(`.modal__btn`)[1];

      /**
      * удаление "модального окна"
      * @param {Event} evt
      * @param {HTMLElement} elem
      */
      const onCloseHandler = (evt, elem) => {
        evt.preventDefault();
        this.closeModal(elem);
        document.removeEventListener(`keydown`, this._objectHandler);
      };
      /**
      * удаление "модального окна" по клавише ESC
      * @param {Event} evt
      * @param {HTMLElement} elem
      */
      const onEscCloseHandler = (evt, elem) => {
        this.closeEscModal(evt, elem);
        document.removeEventListener(`keydown`, this._objectHandler);
      };
      /**
      * смена screen после подтверждения
      * @param {Event} evt
      */
      const confirmHandler = () => {
        this.nextScreen();
      };

      modalBtnClose.addEventListener(`click`, (evt) => {
        onCloseHandler(evt, modal);
      });
      modalBtnOk.addEventListener(`click`, confirmHandler);
      modalBtnCancel.addEventListener(`click`, (evt) => {
        onCloseHandler(evt, modal);
      });

      this._objectHandler = {
        handleEvent(evt) {
          onEscCloseHandler(evt, modal);
        }
      };
      document.addEventListener(`keydown`, this._objectHandler);
    }
  }

  class GameModel {
    constructor(playerName) {
      this.playerName = playerName;
    }

    get state() {
      return Object.freeze(this._state);
    }

  }

  var dataGame = [
    {
      type: `gameOne`,
      images: [
        {src: `https://k42.kn3.net/CF42609C8.jpg`, imageType: `photo`},
        {src: `https://k42.kn3.net/D2F0370D6.jpg`, imageType: `photo`}
      ]
    },
    {
      type: `gameTwo`,
      images: [
        {src: `https://k32.kn3.net/5C7060EC5.jpg`, imageType: `photo`},
      ]
    },
    {
      type: `gameThree`,
      images: [
        {src: `https://k42.kn3.net/CF42609C8.jpg`, imageType: `photo`},
        {src: `https://k42.kn3.net/D2F0370D6.jpg`, imageType: `photo`},
        {src: `https://i.imgur.com/5PlNnsy.jpg`, imageType: `paint`}
      ]
    },
    {
      type: `gameOne`,
      images: [
        {src: `https://k42.kn3.net/CF42609C8.jpg`, imageType: `photo`},
        {src: `https://k42.kn3.net/D2F0370D6.jpg`, imageType: `photo`}
      ]
    },
    {
      type: `gameTwo`,
      images: [
        {src: `https://k32.kn3.net/5C7060EC5.jpg`, imageType: `photo`},
      ]
    },
    {
      type: `gameThree`,
      images: [
        {src: `https://k42.kn3.net/CF42609C8.jpg`, imageType: `photo`},
        {src: `https://k42.kn3.net/D2F0370D6.jpg`, imageType: `photo`},
        {src: `https://i.imgur.com/5PlNnsy.jpg`, imageType: `paint`}
      ]
    },
    {
      type: `gameOne`,
      images: [
        {src: `https://k42.kn3.net/CF42609C8.jpg`, imageType: `photo`},
        {src: `https://k42.kn3.net/D2F0370D6.jpg`, imageType: `photo`}
      ]
    },
    {
      type: `gameTwo`,
      images: [
        {src: `https://k32.kn3.net/5C7060EC5.jpg`, imageType: `photo`},
      ]
    },
    {
      type: `gameThree`,
      images: [
        {src: `https://k42.kn3.net/CF42609C8.jpg`, imageType: `photo`},
        {src: `https://k42.kn3.net/D2F0370D6.jpg`, imageType: `photo`},
        {src: `https://i.imgur.com/5PlNnsy.jpg`, imageType: `paint`}
      ]
    },
    {
      type: `gameThree`,
      images: [
        {src: `https://k42.kn3.net/CF42609C8.jpg`, imageType: `photo`},
        {src: `https://k42.kn3.net/D2F0370D6.jpg`, imageType: `photo`},
        {src: `https://i.imgur.com/5PlNnsy.jpg`, imageType: `paint`}
      ]
    },
  ];

  // import {setEventForBtnBack} from '../module-back-btn.js';

  class HeaderView extends AbstractView {
    constructor(state) {
      super();
      this._state = state;
    }

    get template() {
      return `
    <header class="header">
      <button class="back">
        <span class="visually-hidden">Вернуться к началу</span>
        <svg class="icon" width="45" height="45" viewBox="0 0 45 45" fill="#000000">
          <use xlink:href="img/sprite.svg#arrow-left"></use>
        </svg>
        <svg class="icon" width="101" height="44" viewBox="0 0 101 44" fill="#000000">
          <use xlink:href="img/sprite.svg#logo-small"></use>
        </svg>
      </button>
      <div class="game__timer">${this._state.TIME}</div>
      <div class="game__lives">
        ${new Array(3 - this._state.LIVES).fill(`<img src="img/heart__empty.svg" class="game__heart" alt=" Missed Life" width="31" height="27">`).join(``)}
        ${new Array(this._state.LIVES).fill(`<img src="img/heart__full.svg" class="game__heart" alt="Life" width="31" height="27">`).join(``)}
      </div>
    </header>
    `;
    }

    bind() {
      const btnBack = this.element.querySelector(`.back`);
      /**
       * добавляет модальное окно с подтверждением
       */
      const clickHandler = () => {
        this.setEventScreen();
      };

      btnBack.addEventListener(`click`, clickHandler);

    }
  }

  class GameOneView extends AbstractView {
    constructor(state, arrImages, statsAnswersStr) {
      super();
      this._state = state;
      this._arrImages = arrImages;
      this._statsAnswersStr = statsAnswersStr;
    }

    nextScreen() {}

    /**
     * возврашает шаблон изображений для ответов
     * @param {Array} arrImages
     * @return {String}
     */
    createTemplateImages(arrImages) {
      let html = ``;

      arrImages.forEach((item, index) => {
        html += `<div class="game__option">
                  <img src="${item.src}" data-type="${item.imageType}" alt="Option ${index}" width="468" height="458">
                  <label class="game__answer game__answer--photo">
                    <input class="visually-hidden" name="question${index}" type="radio" value="photo">
                    <span>Фото</span>
                  </label>
                  <label class="game__answer game__answer--paint">
                    <input class="visually-hidden" name="question${index}" type="radio" value="paint">
                    <span>Рисунок</span>
                  </label>
                </div>`;
      });

      return html;
    }

    get template() {
      return `
      <section class="game">
        <p class="game__task">Угадайте для каждого изображения фото или рисунок?</p>
        <form class="game__content">
        ${this.createTemplateImages(this._arrImages)}
        </form>
        <ul class="stats">
          ${this._statsAnswersStr}
        </ul>
      </section>
    `;
    }

    bind() {
      const form = this.element.querySelector(`.game__content`);

      /** при выборе 2 ответов в форме, переключение экрана
       * @param {Event} evt
       * @param {Object} state
       */
      const changeFormHandler = (evt, state) => {
        this.nextScreen(evt, state);
      };

      form.addEventListener(`change`, (evt) => {
        changeFormHandler(evt, this._state);
      });
    }
  }

  class GameTwoView extends AbstractView {
    constructor(state, arrImages, statsAnswersStr) {
      super();
      this._state = state;
      this._arrImages = arrImages;
      this._statsAnswersStr = statsAnswersStr;
    }

    nextScreen() { }

    /**
     * возврашает шаблон изображений для ответов
     * @param {Array} arrImages
     * @return {String}
     */
    createTemplateImages(arrImages) {
      let html = ``;

      arrImages.forEach((item, index) => {
        html += `<div class="game__option">
                  <img src="${item.src}" data-type="${item.imageType}" alt="Option ${index}" width="468" height="458">
                  <label class="game__answer game__answer--photo">
                    <input class="visually-hidden" name="question${index}" type="radio" value="photo">
                    <span>Фото</span>
                  </label>
                  <label class="game__answer game__answer--paint">
                    <input class="visually-hidden" name="question${index}" type="radio" value="paint">
                    <span>Рисунок</span>
                  </label>
                </div>`;
      });

      return html;
    }

    get template() {
      return `
      <section class="game">
        <p class="game__task">Угадай, фото или рисунок?</p>
        <form class="game__content  game__content--wide">
          ${this.createTemplateImages(this._arrImages)}
        </form>
        <ul class="stats">
          ${this._statsAnswersStr}
        </ul>
      </section>
    `;
    }

    bind() {
      const form = this.element.querySelector(`.game__content`);

      /** при выборе ответа в форме, переключение экрана
       * @param {Event} evt
       * @param {Object} state
       */
      const changeFormHandler = (evt, state) => {
        this.nextScreen(evt, state);
      };

      form.addEventListener(`change`, (evt) => {
        changeFormHandler(evt, this._state);
      });
    }
  }

  class GameThreeView extends AbstractView {
    constructor(state, arrImages, statsAnswersStr) {
      super();
      this._state = state;
      this._arrImages = arrImages;
      this._statsAnswersStr = statsAnswersStr;
      this.CORRECT_ANSWER = `paint`;
    }

    nextScreen() { }

    /**
     * возврашает шаблон изображений для ответов
     * @param {Array} arrImages
     * @return {String}
     */
    createTemplateImages(arrImages) {
      let html = ``;

      arrImages.forEach((item, index) => {
        html += `<div class="game__option">
              <img src="${item.src}" data-type="${item.imageType}" alt="Option ${index}" width="304" height="455">
            </div>`;
      });

      return html;
    }

    get template() {
      return `
      <section class="game">
        <p class="game__task">Найдите рисунок среди изображений</p>
        <form class="game__content game__content--triple">
          ${this.createTemplateImages(this._arrImages)}
        </form>
        <ul class="stats">
          ${this._statsAnswersStr}
        </ul>
      </section>
    `;
    }

    bind() {
      const imgs = this.element.querySelectorAll(`.game__content img`);

      /** при выборе ответа в форме, переключение экрана
       * @param {Event} evt
       * @param {Object} stateGane
       */
      const clickFormHandler = (evt, stateGane) => {
        this.nextScreen(evt, stateGane);
      };

      imgs.forEach((item) => {
        item.addEventListener(`click`, (evt) => {
          clickFormHandler(evt, this._state);
        });
      });
    }

  }

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

  class GameScreen {
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
            const gameOneScreen = new GameOneView(stateGame, arrImages, statsAnswersStr);
            gameOneScreen.nextScreen = (evt, state) => this._nextScreenForOne(evt, state);
            return gameOneScreen.element;
          };
          break;
        case `gameTwo`:
          typeScreen = (stateGame, arrImages, statsAnswersStr) => {
            const gameTwoScreen = new GameTwoView(stateGame, arrImages, statsAnswersStr);
            gameTwoScreen.nextScreen = (evt, state) => this._nextScreenForTwo(evt, state);
            return gameTwoScreen.element;
          };
          break;
        case `gameThree`:
          typeScreen = (stateGame, arrImages, statsAnswersStr) => {
            const gameThreeScreen = new GameThreeView(stateGame, arrImages, statsAnswersStr);
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

  class Application {

    static showMainScreen() {
      const mainScreen = () => {
        const mainScreenView = new MainView();
        mainScreenView.nextScreen = () => {
          Application.showWelcomeScreen();
        };

        return mainScreenView.element;
      };

      changeScreen(mainScreen());
    }

    static showWelcomeScreen() {
      const welcomeScreen = () => {
        const welcomeScreenView = new WelcomeView();
        welcomeScreenView.nextScreen = () => {
          Application.showRulesScreen();
        };

        return welcomeScreenView.element;
      };

      changeScreen(welcomeScreen());
    }

    static showRulesScreen() {
      const rulesScreen = () => {
        const rulesScreenView = new RulesView();
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
        const resultScreenView = new ResultView(objUserStat, statsAnswersStr);
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

  Application.showMainScreen();

}());

//# sourceMappingURL=main.js.map
