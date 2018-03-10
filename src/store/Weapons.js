import { observable, computed } from 'mobx'
import dbhelper from '../helpers/dbhelper'

export default class WeaponsStore {
  @observable selectedWeapons
  @observable weaponData = dbhelper.allWeapons()
  @observable weaponTypes = dbhelper.weaponTypeDefs()

  constructor(rootStore) {
    this.rootStore = rootStore
  }

  @computed
  get getWeaponsForWeaponSelect() {
    if (this.rootStore.UI.singleWeapon) {
      return this.weaponData.map(x => ({ value: x.wep_id, label: x.name }))
    } else {
      return this.weaponTypes.map(x => ({
        value: x.wep_type_id,
        label: x.name
      }))
    }
  }

  @computed
  get getSharpnessLevels() {
    return [
      { value: 0, label: 'Red' },
      { value: 1, label: 'Orange' },
      { value: 2, label: 'Yellow' },
      { value: 3, label: 'Green' },
      { value: 4, label: 'Blue' },
      { value: 5, label: 'White / Use Max Sharpness' }
    ].reverse()
  }

  @computed
  get getSelectedWeapons() {
    const singleWeapon = this.rootStore.UI.singleWeapon

    if (singleWeapon) {
      return dbhelper.weapon(this.rootStore.UI.singleWeaponSelectValue) || {}
    } else {
      return dbhelper.filterWeapons({
        field_name: 'wep_type_id',
        field_value: this.rootStore.UI.weaponTypeSelectValue
      })
    }
  }

  @computed
  get getNumberOfAugments() {
    const rarity = this.getSelectedWeapons.rarity
    if (rarity === 8) return 1
    if (rarity === 7) return 2
    if (rarity === 6) return 3
  }
}
