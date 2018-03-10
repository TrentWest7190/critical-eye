import { observable, computed } from 'mobx'
import dbhelper from '../helpers/dbhelper'

export default class MonsterStore {
  @observable monsterData = dbhelper.allMonsters()

  constructor(rootStore) {
    this.rootStore = rootStore
  }

  @computed
  get selectedMonster() {
    const selectedMonsterID = this.rootStore.UI.monsterSelectValue
    return dbhelper.monster(selectedMonsterID)
  }

  @computed
  get averageValuesForMonster() {
    if (this.selectedMonster) {
      const hitzone_data = this.selectedMonster.hitzone_data
      const totals = hitzone_data.reduce((a,v) => {
        return {
          Fire: a.Fire || 0 + v.Fire,
          Water: a.Water || 0 + v.Water,
          Thunder: a.Thunger || 0 + v.Thunder,
          Ice: a.Ice || 0 + v.Ice,
          Dragon: a.Dragon || 0 + v.Dragon
        }
      }, {})
      console.log(totals)
      return {
        Fire: totals.Fire / hitzone_data.length,
        Water: totals.Water / hitzone_data.length,
        Thunder: totals.Thunder / hitzone_data.length,
        Ice: totals.Ice / hitzone_data.length,
        Dragon: totals.Dragon / hitzone_data.length
      }
    } else {
      return null
    }
  }
}