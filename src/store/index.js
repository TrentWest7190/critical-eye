import WeaponsStore from "./Weapons"
import SkillsStore from "./Skills"
import UIStore from "./UI"
import CalculatorStore from './Calculator'
import MonsterStore from './Monster'

export class Store {
  constructor() {
    this.weapons = new WeaponsStore(this)
    this.skills = new SkillsStore(this)
    this.UI = new UIStore(this)
    this.calculator = new CalculatorStore(this)
    this.monsters = new MonsterStore(this)
  }
}
