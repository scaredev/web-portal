
import Minitoast from '../libs/minitoast/js/minitoast.js';
import translator from './translator.js';

let toast = new Minitoast();

const makeToaster = (opts) => {
  const notify = (msg) => {
    let title = typeof msg == 'string' ? opts.title : (msg.title || opts.title);
    let text = typeof msg == 'string' ? msg : (msg.text || '');
    toast.msgs[opts.type.charAt(0)][1] = title;
    toast[opts.type](text)
  }
  return notify;
}

export default {
  info: makeToaster({type: 'info', title: 'Info'}),
  success: makeToaster({type: 'success', title: translator('toast.success.SUCCESS')}),
  warning: makeToaster({type: 'warning', title: translator('WARNING')}),
  error: makeToaster({type: 'error', title: 'Error'})
};
