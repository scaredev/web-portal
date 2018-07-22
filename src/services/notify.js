
import Minitoast from '../libs/minitoast/js/minitoast.js';

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
  success: makeToaster({type: 'success', title: 'Success'}),
  warning: makeToaster({type: 'warning', title: 'Warning'}),
  error: makeToaster({type: 'error', title: 'Error'})
};
