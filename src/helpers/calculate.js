import { BigNumber } from 'bignumber.js'
import dbhelper from './dbhelper'

export default function calculate(skills, weaponArray, minimumSharpness, handicraftLevel) {
  const sharpnesses = ["red", "orange", "yellow", "green", "blue", "white"]

  const returnWeapons = weaponArray.map(weapon => {
    console.log(skills)
    const isRanged = dbhelper.weaponIsRanged(weapon.wep_id)
    const sharpness_data = isRanged ? {} : dbhelper.getSharpnessForHandicraftAndID(weapon.wep_id, handicraftLevel)
    const maxSharpnessValue = getMaxSharpnessValue(sharpness_data)
    const isElemental = (weapon.status_value && !weapon.needs_awakening) || (weapon.element_value && !weapon.needs_awakening)
    const skillsArray = Object.keys(skills).filter(x => Boolean(skills[x])).filter(x => {
      if (x  === 'Non-elemental Boost') {
        return !isElemental
      }
      return true
    }).map(x => skills[x].value)
    const totalAttackMultiplier = getTotalAttackMultipliers(skillsArray)
    const totalAttackMod = getTotalAttackMod(skillsArray)
    const totalAttack = getTotalAttack(weapon.true_attack, totalAttackMultiplier, totalAttackMod)
    const totalAffinityMod = getTotalAffinityMod(skillsArray)
    const totalAffinity = getTotalAffinity(weapon.affinity, totalAffinityMod)
    const critMulti = skillsArray.find(x => x.critMulti)
    const critBoost = critMulti && totalAffinity > 0 ? critMulti.critMulti : 0.25
    const critMultiplier = getCritMultiplier(critBoost, totalAffinity)
    

    //console.log(totalAttackMultiplier, totalAttackMod, totalAttack, totalAffinity, critBoost, critMultiplier)
    let sharpnessIndex = minimumSharpness
    if (sharpnessIndex >= maxSharpnessValue) sharpnessIndex = maxSharpnessValue - 1
    const sharpnessesToCalculate = isRanged ? ["yellow"] : sharpnesses.slice(sharpnessIndex, maxSharpnessValue)
    let damageCount = 0
    let sharpnessValue = 0
    sharpnessesToCalculate.forEach(sharp => {
      const newSharpness = sharpness_data[sharp]
      sharpnessValue += newSharpness
      //console.log(newSharpness, sharpnessValue)
      const newDamage = Math.round(new BigNumber(totalAttack)
      .times(critMultiplier)
      .times(isRanged ? 1 : dbhelper.getSharpnessMultiplier(sharp))
      .times(isRanged ? 1 : newSharpness).toNumber())

      damageCount += newDamage
      //console.log(newDamage, damageCount)
    })
    return {
      true_attack: weapon.true_attack,
      name: weapon.name,
      affinity: weapon.affinity,
      calculatedAttack: Math.round(new BigNumber(damageCount).div(isRanged ? 1 : sharpnessValue).toNumber()),
      sharpness: sharpness_data,
      weapon_type: weapon.weapon_type,
      skills: skills,
      totalAffinity,
      totalAttack,
      minimumSharpness: sharpnessIndex,
      totalHits: sharpnessValue,
      isRanged
    }
  })

  return returnWeapons
  
}

function getTotalAttack(trueAttack, totalAttackMultiplier, totalAttackMod) {
  return new BigNumber(trueAttack).times(totalAttackMultiplier).plus(totalAttackMod).toNumber()
}

function getTotalAffinity(affinity, totalAffinityMod) {
  const returnVal = affinity + totalAffinityMod
  if (returnVal > 100) return 100
  return returnVal
}

function getTotalAttackMod(skillsArray) {
  return skillsArray.reduce(getTotalModValue('attack'), 0)
}

function getTotalAffinityMod(skillsArray) {
  return skillsArray.reduce(getTotalModValue('affinity'), 0)
}

function getTotalAttackMultipliers(skillsArray) {
  return skillsArray.reduce(getTotalModValueMultiply('attackMulti'), 1)
}

function getCritMultiplier(critBoost, totalAffinity) {
  const critRate = new BigNumber(totalAffinity).div(100)
  return new BigNumber(critBoost).times(critRate).plus(1).toNumber()
}

function getMaxSharpnessValue(sharpness_data) {
  if (sharpness_data.white) return 6
  if (sharpness_data.blue) return 5
  if (sharpness_data.green) return 4
  if (sharpness_data.yellow) return 3
  if (sharpness_data.orange) return 2
  if (sharpness_data.red) return 1
}

const getTotalModValue = (valueName) => (a, v) => {
  if (v[valueName]) return a + v[valueName]
  return a
}

const getTotalModValueMultiply = (valueName) => (a, v) => {
  if (v[valueName]) return new BigNumber(a).times(1 + v[valueName]).toNumber()
  return a
}