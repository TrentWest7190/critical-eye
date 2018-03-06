import db from '../db'

export default {
  weapon(wep_id) {
      return db.weapons.find((wep) => wep.wep_id === wep_id)
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
  }
}