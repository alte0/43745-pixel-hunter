/** =========================================
 * импорт модулей
 */
import header from './module-header.js';
import {INITIAL_GAME} from './game.js';
import {changeScreen, renderTemplate, setGame, demoData} from './util.js';
/** =========================================
 * обьявление фукнции
 */
/** =========================================
 * возврашает шаблон с данными
 * @param {Array} arr
 * @return {String}
 */
const template = (arr) => {
  let htmlImages = ``;
  arr.forEach((item, index) => {
    htmlImages += `<div class="game__option">
              <img src="${item.src}" data-type="${item.isTypeImg}" alt="Option ${index}" width="304" height="455">
            </div>`;
  });
  return `
    <section class="game">
      <p class="game__task">Найдите рисунок среди изображений</p>
      <form class="game__content  game__content--triple">
        ${htmlImages}
      </form>
      <ul class="stats">
        <li class="stats__result stats__result--wrong"></li>
        <li class="stats__result stats__result--slow"></li>
        <li class="stats__result stats__result--fast"></li>
        <li class="stats__result stats__result--correct"></li>
        <li class="stats__result stats__result--wrong"></li>
        <li class="stats__result stats__result--unknown"></li>
        <li class="stats__result stats__result--slow"></li>
        <li class="stats__result stats__result--unknown"></li>
        <li class="stats__result stats__result--fast"></li>
        <li class="stats__result stats__result--unknown"></li>
      </ul>
    </section>
  `;
};
/** при выборе ответа в форме, переключение экрана
 *
 */
const clickFormHandler = () => {
  changeScreen(header(INITIAL_GAME), setGame(demoData));
};
/** =========================================
 * экспорт
 * @param {Array} arr
 * @return {HTMLElement} element
 */
export default (arr) => {
  /**
   *  работа с данными
   */
  const element = renderTemplate(template(arr));
  /**
   *  обьявление переменных
   */
  const imgs = element.querySelectorAll(`.game__content img`);
  /** =========================================
   * работа с DOM
   */
  imgs.forEach((item) => {
    item.addEventListener(`click`, clickFormHandler);
  });

  return element;
};
