import { observable, action } from "mobx";

export default class CalculatorStore {
  @observable augments = {
    0: null,
    1: null,
    2: null
  }

  constructor(rootStore) {
    this.rootStore = rootStore
  }

  @action.bound
  updateAugment(i) {
    return (selectedValue) => {
      this.augments[i] = selectedValue && selectedValue.value
    }
  }
}
