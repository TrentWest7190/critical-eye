import React, { Component } from 'react';
import Select from 'react-select'
import VirtualizedSelect from 'react-virtualized-select'
import './App.css'

import styled from 'styled-components'
import dbhelper from './helpers/dbhelper'
import buildSkillString from './helpers/buildSkillString'
import calculate from './helpers/calculate'

const CalculateButton = styled.button`
  width: 100%;
  height: 150px;
`

class App extends Component {
  constructor () {
    super()
    this.weaponTypes = dbhelper.weaponTypeDefs().map(x => ({ value: x.wep_type_id, label: x.name }))
    this.allWeapons = dbhelper.allWeapons().map(x => ({ value: x.wep_id, label: x.name }))
    this.skills = dbhelper.allSkills()
    this.calculate = this.calculate.bind(this)
    this.updateSkill = this.updateSkill.bind(this)
    this.selectWeaponClass = this.selectWeaponClass.bind(this)
    this.state = {
      selectedWeaponClass: null,
      skills: {
      },
      selectedWeapons: []
    }
  }

  selectWeaponClass(selectedValue) {
    this.setState((prevState, props) => {
      return {
        ...prevState,
        selectedWeaponClass: selectedValue.value,
        selectedWeapons: dbhelper.filterWeapons({
          field_name: 'wep_type_id',
          field_value: selectedValue.value
        })
      }
    })
  }

  updateSkill(skillName) {
    return (selectedValue) => {
      console.log(skillName, selectedValue)
      this.setState((prevState, props) => {
        return {
          ...prevState,
          skills: {
            ...prevState.skills,
            [skillName]: selectedValue
          }
        }
      })
    }
  }

  calculate() {
    const skillsArray = Object.values(this.state.skills).filter(Boolean).map(x => x.value)
    const results = calculate(skillsArray, this.state.selectedWeapons, "green", 0)
    console.log(results)
  }

  render() {
    return (
      <div className="App">
        <div>
          <h1>Select Your Weapon Class</h1>
          <VirtualizedSelect
            placeholder="Weapons"
            value={this.state.selectedWeaponClass}
            onChange={this.selectWeaponClass}
            options={this.weaponTypes}
          />
          <h1>Select Your Modifiers</h1>
          {
            this.skills.map((skill) => {
              const options = skill.values.map(x => ({ value: x, label: buildSkillString(x) }))
              return (
                <div key={skill.skill_id}>
                  <span>{skill.name}</span>
                  <Select
                    onChange={this.updateSkill(skill.name)}
                    value={this.state.skills[skill.name]}
                    placeholder={skill.description}
                    options={options}
                  />
                </div>
                
              )
            })
          }
          <CalculateButton onClick={this.calculate} disabled={this.state.selectedWeapons.length === 0}>Calculate!</CalculateButton>
        </div>
      </div>
    )
  }
}

export default App;
