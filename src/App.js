import React, { Component } from 'react';
import Select from 'react-select'
import VirtualizedSelect from 'react-virtualized-select'
import DisplayTable from './components/DisplayTable'
import './App.css'

import styled from 'styled-components'
import dbhelper from './helpers/dbhelper'
import buildSkillString from './helpers/buildSkillString'
import calculate from './helpers/calculate'

const CalculateButton = styled.button`
  width: 80%;
  height: 100px;
  margin: 0 10%;
`

const Header = styled.h1`
  font-size: 1.5em;
`

class App extends Component {
  constructor () {
    super()
    this.weaponTypes = dbhelper.weaponTypeDefs().map(x => ({ value: x.wep_type_id, label: x.name }))
    this.allWeapons = dbhelper.allWeapons().map(x => ({ value: x.wep_id, label: x.name }))
    this.sharpnessLevels = [
      { value: 0, label: 'Red' },
      { value: 1, label: 'Orange' },
      { value: 2, label: 'Yellow' },
      { value: 3, label: 'Green' },
      { value: 4, label: 'Blue' },
      { value: 5, label: 'White' }
    ]
    this.skills = dbhelper.allSkills()
    this.calculate = this.calculate.bind(this)
    this.updateSkill = this.updateSkill.bind(this)
    this.selectWeaponClass = this.selectWeaponClass.bind(this)
    this.selectSharpnessLevel = this.selectSharpnessLevel.bind(this)
    this.selectHandicraftLevel = this.selectHandicraftLevel.bind(this)
    this.handleSingleWeaponToggle = this.handleSingleWeaponToggle.bind(this)
    this.state = {
      selectedSharpnessLevel: 5,
      selectedWeaponClass: null,
      handicraftLevel: 0,
      skills: {
      },
      selectedWeapons: [],
      calculatedWeapons: [],
      singleWeapon: false
    }
  }

  handleSingleWeaponToggle(event) {
    this.setState((prevState) => {
      return {
        ...prevState,
        singleWeapon: !prevState.singleWeapon
      }
    })
  }

  selectHandicraftLevel(selectedValue) {
    this.setState((prevState, props) => {
      return {
        ...prevState,
        handicraftLevel: selectedValue ? selectedValue.value : 0
      }
    })
  }

  selectSharpnessLevel(selectedValue) {
    this.setState((prevState, props) => {
      return {
        ...prevState,
        selectedSharpnessLevel: selectedValue ? selectedValue.value : 5
      }
    })
  }

  selectWeaponClass(selectedValue) {
    this.setState((prevState, props) => {
      return {
        ...prevState,
        selectedWeaponClass: selectedValue && selectedValue.value,
        selectedWeapons: dbhelper.filterWeapons({
          field_name: 'wep_type_id',
          field_value: selectedValue && selectedValue.value
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
    const results = calculate(this.state.skills, this.state.selectedWeapons, this.state.selectedSharpnessLevel, this.state.handicraftLevel)
    this.setState((prevState, props) => {
      return {
        prevState,
        calculatedWeapons: results
      }
    })
  }

  render() {
    return (
      <div className="App">
        <div>
          <Header>Select Your Weapon Class</Header>
          Single weapon only<input type="checkbox" checked={this.state.singleWeapon} onChange={this.handleSingleWeaponToggle}/>
          <VirtualizedSelect
            placeholder={this.state.singleWeapon ? "Weapon" : "Weapon type"}
            value={this.state.selectedWeaponClass}
            onChange={this.selectWeaponClass}
            options={this.state.singleWeapon ? this.allWeapons : this.weaponTypes}
          />
          <div style={{ marginTop: 10 }}>Minimum sharpness before sharpening</div>
          <Select
            placeholder="Minimum sharpness level"
            value={this.state.selectedSharpnessLevel}
            onChange={this.selectSharpnessLevel}
            options={this.sharpnessLevels}
          />
          <Header>Select Your Modifiers</Header>
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
          <div>
            <span>Handicraft</span>
            <Select
              onChange={this.selectHandicraftLevel}
              value={this.state.handicraftLevel}
              placeholder="Extends the weapon sharpness gauge. However, it will not increase the gauge past its maximum."
              options={[1,2,3,4,5].map(x => ({ value: x, label: x }))}
            />
          </div>
          <CalculateButton onClick={this.calculate} disabled={this.state.selectedWeapons.length === 0}>Calculate!</CalculateButton>
        </div>
        <div style={{ padding: 15 }}>
          <DisplayTable
            data={this.state.calculatedWeapons}
          />
        </div>
      </div>
    )
  }
}

export default App;
