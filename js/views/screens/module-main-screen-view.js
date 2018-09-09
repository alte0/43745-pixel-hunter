import AbstractView from '../../clases/abstract-view.js';

export default class MainView extends AbstractView {
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
