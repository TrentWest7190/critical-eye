import { observable, action, extendObservable } from 'mobx'
import dbhelper from '../helpers/dbhelper'

export default class SkillsStore {
  @observable skillData = dbhelper.allSkills()
  @observable handicraftLevel = 0

  constructor(rootStore) {
    this.rootStore = rootStore
  }

  @action.bound
  selectHandicraftLevel(selectedValue) {
    this.handicraftLevel = selectedValue && selectedValue.value
  }
}
