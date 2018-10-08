import notify from './notify.js';
import Sounds from './sounds.js';
import translator from './translator.js';

const catchHttpError = (res) => {
  let err;
  if (res) {
    if (res.data) {
      if (res.data.message)
        err = res.data.message;
    }
  }
  if (err)
    notify.error(err);
  else
    notify.error(translator('toast.error.SOMETHING_WENT_WRONG'));
  try {
    Sounds.notAllowed.play();
  } catch (e) {
    console.log(e);
  }

  return Promise.reject(res);

}

export default catchHttpError
