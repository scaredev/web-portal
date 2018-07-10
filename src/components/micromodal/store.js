import { Store } from 'svelte/store.js';

const store = new Store({
  show: false,
  component: null,
  data: {}
});

export default store;
