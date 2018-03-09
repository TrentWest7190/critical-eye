import { observable, action, computed } from 'mobx'
import dbhelper from '../helpers/dbhelper'

export default class UIStore {
  @observable warningOpen = false
  @observable singleWeaponSelectValue = null
  @observable weaponTypeSelectValue = null
  @observable singleWeapon = false
  @observable sharpnessSelectValue = null
  @observable sharpnessModalOpen = false

  constructor(rootStore) {
    this.rootStore = rootStore
  }

  @computed
  get disableSharpnessDropdown() {
    return [12, 13, 14].includes(
      this.singleWeapon
        ? this.rootStore.weapons.getSelectedWeapons.wep_type_id
        : this.weaponTypeSelectValue
    )
  }

  @computed
  get weaponSelectDropdownValue() {
    if (this.singleWeapon) {
      return this.singleWeaponSelectValue
    } else {
      return this.weaponTypeSelectValue
    }
  }

  @computed
  get weaponSelectPlaceholder() {
    return this.singleWeapon ? 'Weapon' : 'Weapon type'
  }

  @computed
  get showAugmentSelects() {
    return (
      this.singleWeapon &&
      this.rootStore.weapons.getSelectedWeapons.final_form &&
      [6, 7, 8].includes(this.rootStore.weapons.getSelectedWeapons.rarity)
    )
  }

  @action.bound
  toggleWarning() {
    this.warningOpen = !this.warningOpen
  }

  @action.bound
  toggleSingleWeapon() {
    this.singleWeapon = !this.singleWeapon
    this.weaponTypeSelectValue = null
    this.rootStore.weapons.selectedWeapons = []
  }

  @action.bound
  selectWeapon(selectedValue) {
    if (this.singleWeapon) {
      this.singleWeaponSelectValue = selectedValue && selectedValue.value
      this.weaponTypeSelectValue = null
    } else {
      this.weaponTypeSelectValue = selectedValue && selectedValue.value
      this.singleWeaponSelectValue = null
    }
  }

  @action.bound
  selectSharpness(selectedValue) {
    this.sharpnessSelectValue = selectedValue && selectedValue.value
  }
}
