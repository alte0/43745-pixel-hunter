import {addModal} from './module-mangment-dom.js';
import Application from './clases/application.js';

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

export {setEventForBtnBack};
