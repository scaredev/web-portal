import translations from './translations.js';
import cookie from './cookie.js';

const lang_field = 'ado_lang'
const ERR = 'Translation Error';
let language = cookie.getCookie('ado_lang') || 'en'

const translator = (text_id) => {

  let lang = language || cookie.getCookie(lang_field) || 'en';
  let result = translations[lang];
  let err;

  if (!text_id) err = `${ERR}: "text" attribute is required.`;
  if (!lang || !result) err = text_id;

  if (!err) {
    let txtArr = text_id.split('.');
    for (let i=0; i < txtArr.length; i++) {
      let attr = txtArr[i];
      if (typeof result == 'string')
        break;
      else if (result[attr])
        result = result[attr];
      else {
        console.log(`Translation Error: No such attribute [${attr}] from "${text_id}" for the language ${lang}.`);
        err = text_id;
        break;
      }
    }
  }

  return err || result;

}

translator.setLanguage = (lang) => {
  if (!lang) return;
  language = lang
  cookie.setCookie(lang_field, lang, 365)
}

export default translator;
