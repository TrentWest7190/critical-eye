import db from '../db'

export default {
  weapon(wep_id) {
      return db.weapons.find((wep) => wep.wep_id === wep_id)
  },

  weaponIsRanged(wep_id) {
    const rangedWeapons = [ 12, 13, 14 ]
    return rangedWeapons.includes(this.weapon(wep_id).wep_type_id)
  },

  allWeapons() {
    return db.weapons
  },

  filterWeapons(filter) {
    return db.weapons.filter((wep) => wep[filter.field_name] === filter.field_value)
  },

  weaponTypeDefs() {
    return db.weaponTypeDefs
  },

  skill(skill_id) {
    return db.skills.find((skill) => skill.skill_id === skill_id)
  },

  allSkills() {
    return db.skills
  },

  getSharpnessMultiplier(sharpnessName) {
    return db.sharpnessTypeDefs[sharpnessName]
  },

  getSharpnessForHandicraftAndID(wep_id, handicraft_level) {
    const weapon = this.weapon(wep_id)
    return weapon.sharpness_data.find(x => x.handicraft_level === handicraft_level)
  }
}