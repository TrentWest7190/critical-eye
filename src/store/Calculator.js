import { observable, computed, action } from 'mobx'
import calculate from '../helpers/calculate'

const savedWeapons = localStorage.getItem('savedWeapons')

export default class CalculatorStore {
  @observable
  augments = {
    0: null,
    1: null,
    2: null
  }
  @observable results = savedWeapons ? JSON.parse(savedWeapons) : []

  constructor(rootStore) {
    this.rootStore = rootStore
  }

  @computed
  get augmentsAsSkillData() {
    return Object.values(this.augments)
      .filter(Boolean)
      .reduce((a, v, i) => {
        if (v === 'attack') {
          a['augment' + i] = { attack: 5 }
        } else if (v === 'affinity') {
          if (Object.keys(a).find(x => a[x].value.affinity)) {
            a['augment' + i] = { affinity: 5 }
          } else {
            a['augment' + i] = { affinity: 10 }
          }
        }
        return a
      }, {})
  }

  @action.bound
  updateAugment(i) {
    return selectedValue => {
      this.augments[i] = selectedValue && selectedValue.value
    }
  }

  @action.bound
  calculate() {
    const skillsAndAugments = {
      ...this.rootStore.skills.getSkillData,
      ...this.augmentsAsSkillData
    }
    const selectedWeapons = this.rootStore.UI.singleWeapon
      ? [this.rootStore.weapons.getSelectedWeapons]
      : this.rootStore.weapons.getSelectedWeapons
    const sharpnessSelectValue = this.rootStore.UI.sharpnessSelectValue
    const handicraftLevel = this.rootStore.skills.handicraftLevel
    const results = calculate(
      skillsAndAugments,
      selectedWeapons,
      sharpnessSelectValue,
      handicraftLevel
    )

    this.results = this.results.concat(results)
    localStorage.setItem('savedWeapons', JSON.stringify(this.results))
  }
}
