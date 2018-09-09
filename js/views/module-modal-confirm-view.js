import AbstractView from '../clases/abstract-view.js';

export default class ModalConfirmView extends AbstractView {
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
