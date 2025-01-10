import { store } from '../common'

const sheetStore = store.defineStore('sheetStore', {
    state: (): { count: number } => ({
        count: 1,
    }),
    getters: {
        doubleCount(){
            return this.count * 2;
        }
    },
    actions: {
        setCount(newValue:number) {
            this.count = newValue;
        },
        getCount(){
           return this.count;
        }
    }
});


export default sheetStore;