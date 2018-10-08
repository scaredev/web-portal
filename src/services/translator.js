import translations from './translations.js';

const ERR = 'Translation Error';
let language = 'en'

const translator = (text_id) => {

  let lang = language;
  let result = translations[lang];
  let err;

  if (!text_id) err = `${ERR}: "text" attribute is required.`;
  if (!lang || !result) err = text_id;

  let txtArr = text_id.split('.');

  if (!err) {
    for (let i=0; i < txtArr.length; i++) {
      let attr = txtArr[i];
      if (result[attr])
        result = result[attr];
      else {
        console.log(`Translation Error: No such attribute [${attr}] from ${text_id}" for the language ${lang}.`);
        err = text_id;
        break;
      }
    }
  }

  return err || result;

}

translator.setLanguage = (lang) => {
  language = lang
}

export default translator;
