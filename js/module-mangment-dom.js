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
  const deleteElement = mainElement.querySelector(`.header`);
  mainElement.replaceChild(newElem, deleteElement);
};

export {renderTemplate, changeScreen, addModal, deleteElement, updateHeader};
