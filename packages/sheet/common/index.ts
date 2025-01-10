import hook from './Hook';
import {Store} from './Store'
import watch from './watch';
import { ref } from './Ref';
import { reactive }from './Reactive';
import computed from './computed';
const store = Store.getInstance();

export { hook, store, reactive, ref, watch, computed};
