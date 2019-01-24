export class Store {
  constructor(reducers = {}, initialState = {}) {
    this.subscribers = []; // array of functions
    this.reducers = reducers; // { [key: string]: Function };
    this.state = this.reduce(initialState, {}); // { [key: string]: any };
    this.action = {};
  }

  get value() {
    return this.state;
  }

  subscribe(fn) {
    this.subscribers = [...this.subscribers, fn];
    fn(this.value, this.action);
    return () => {
      this.subscribers = this.subscribers.filter(sub => sub !== fn);
    };
  }

  dispatch(action) {
    this.action = action;
    this.state = this.reduce(this.state, this.action);
    this.subscribers.forEach(fn => fn(this.value, this.action));
  }

  reduce(state, action) {
    const newState = {};
    for (const prop in this.reducers) {
      newState[prop] = this.reducers[prop](state[prop], action);
    }
    return newState;
  }
}
