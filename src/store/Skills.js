import { observable, action, computed } from 'mobx'
import dbhelper from '../helpers/dbhelper'

export default class SkillsStore {
  @observable skillData = dbhelper.allSkills()
  @observable handicraftLevel = 0

  constructor(rootStore) {
    this.rootStore = rootStore
  }

  @computed
  get getSkillData() {
    const skillMap = this.rootStore.UI.skillSelectValues
    return skillMap.entries()
    .reduce((a, [skillName, level]) => {
      a[skillName] = dbhelper.skillForLevel(skillName, level)
      return a
    }, {})
  }

  @action.bound
  selectHandicraftLevel(selectedValue) {
    this.handicraftLevel = selectedValue && selectedValue.value
  }
}
