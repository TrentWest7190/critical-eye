export default function buildSkillString(skillObj) {
  let returnString = `Level ${skillObj.level}: `

  return returnString + Object.keys(skillObj)
  .filter(x => x !== 'level')
  .map(x => x + ' +' + skillObj[x])
  .join(', ')
}