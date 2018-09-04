import {renderTemplate} from './module-mangment-dom.js';
import {setEventForBtnBack} from './module-back-btn.js';
import AbstractView from './clases/abstract-view.js';

class Header extends AbstractView {
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
      <div class="game__timer">NN</div>
      <div class="game__lives">
        ${new Array(3 - this._state.lives).fill(`<img src="img/heart__empty.svg" class="game__heart" alt=" Missed Life" width="31" height="27">`).join(``)}
        ${new Array(this._state.lives).fill(`<img src="img/heart__full.svg" class="game__heart" alt="Life" width="31" height="27">`).join(``)}
      </div>
    </header>
    `;
  }

  // get element() {
  //   if (this._element) {
  //     return this._element;
  //   }
  //   this._element = this.render();
  //   this.bind(this._element);
  //   return this._element;
  // }

  render() {
    return renderTemplate(this.template);
  }

  bind() {
    const element = this.render();

    // const gameTimer = element.querySelector(`.game__timer`);

    setEventForBtnBack(element);
    // managmentGame.startTime(gameTimer);

    return element;
  }
}

export default (state) => {
  return new Header(state).bind();
};
