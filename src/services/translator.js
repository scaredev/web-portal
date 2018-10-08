import translations from './translations.js';

const ERR = 'Translation Error';

const translator = (text_id, lang) => {

  lang = lang || 'en';
  let result = translations[lang];
  let err;

  if (!text_id) err = `${ERR}: "text" attribute is required.`;
  if (!lang || !result) err = `${ERR}: Language not set.`;

  let txtArr = text_id.split('.');

  if (!err) {
    for (let i=0; i < txtArr.length; i++) {
      let attr = txtArr[i];
      if (result[attr])
        result = result[attr];
      else {
        err = `Translation Error: No such attribute [${attr}] from ${text_id}" for the language ${lang}.`;
        break;
      }
    }
  }

  return err || result;

}

export default translator;
