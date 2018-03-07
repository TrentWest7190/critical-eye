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
  width: 300px;
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
    this.calculateAndReplace = this.calculateAndReplace.bind(this)
    this.calculateAndAdd = this.calculateAndAdd.bind(this)
    this.updateSkill = this.updateSkill.bind(this)
    this.selectWeaponClass = this.selectWeaponClass.bind(this)
    this.selectSharpnessLevel = this.selectSharpnessLevel.bind(this)
    this.selectHandicraftLevel = this.selectHandicraftLevel.bind(this)
    this.handleSingleWeaponToggle = this.handleSingleWeaponToggle.bind(this)
    this.updateAugment = this.updateAugment.bind(this)
    this.state = {
      selectedSharpnessLevel: 5,
      selectedWeaponClass: null,
      handicraftLevel: 0,
      skills: {
      },
      selectedWeapons: [],
      calculatedWeapons: [],
      singleWeapon: false,
      augments: {
        0: null,
        1: null,
        2: null
      }
    }
  }

  updateAugment(index) {
    return (selectedValue) => {
      this.setState((prevState) => {
        return {
          ...prevState,
          augments: {
            ...prevState.augments,
            [index]: selectedValue && selectedValue.value
          }
        }
      })
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
    let selectedWeapons
    if (this.state.singleWeapon) {
      selectedWeapons = dbhelper.filterWeapons({
        field_name: 'wep_id',
        field_value: selectedValue && selectedValue.value
      })
    } else {
      selectedWeapons = dbhelper.filterWeapons({
        field_name: 'wep_type_id',
        field_value: selectedValue && selectedValue.value
      })
    }
    this.setState((prevState, props) => {
      return {
        ...prevState,
        selectedWeaponClass: selectedValue && selectedValue.value,
        selectedWeapons,
        augments: { 0: null, 1: null, 2: null }
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

  calculateAndAdd() {
    const augments = Object.values(this.state.augments).filter(Boolean).reduce((a,v,i) => {
      if (v === 'attack') {
        a['augment'+i] = { value: { attack: 5 } }
      } else if (v === 'affinity') {
        a['augment'+i] = { value: { affinity: 5 } }
      }
      return a
    }, {})
    const skillsAndAugments = {
      ...this.state.skills,
      ...augments
    }
    const results = calculate(skillsAndAugments, this.state.selectedWeapons, this.state.selectedSharpnessLevel, this.state.handicraftLevel)
    this.setState((prevState, props) => {
      return {
        prevState,
        calculatedWeapons: this.state.calculatedWeapons.concat(results)
      }
    })
  }

  calculateAndReplace() {
    const augments = Object.values(this.state.augments).filter(Boolean).reduce((a,v,i) => {
      if (v === 'attack') {
        a['augment'+i] = { value: { attack: 5 } }
      } else if (v === 'affinity') {
        a['augment'+i] = { value: { affinity: 5 } }
      }
      return a
    }, {})
    const skillsAndAugments = {
      ...this.state.skills,
      ...augments
    }
    const results = calculate(skillsAndAugments, this.state.selectedWeapons, this.state.selectedSharpnessLevel, this.state.handicraftLevel)
    this.setState((prevState, props) => {
      return {
        prevState,
        calculatedWeapons: results
      }
    })
  }

  render() {
    let augments
    if (this.state.selectedWeapons[0]) {
      let numAugs
      const rarity = this.state.selectedWeapons[0].rarity
      if (rarity === 8) numAugs = 1
      if (rarity === 7) numAugs = 2
      if (rarity === 6) numAugs = 3

      augments = Array.from({ length: numAugs }, (x, i) => (
        <Select
          className="aug"
          key={i}
          value={this.state.augments[i]}
          placeholder="Augment"
          onChange={this.updateAugment(i)}
          options={[
            { value: "attack", label: "Attack Increase" },
            { value: "affinity", label: "Affinity Increase" }
          ]}
        />
      ))
    }

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
          <div style={{ display: "flex" }}>
            {
              this.state.singleWeapon && this.state.selectedWeapons[0] && this.state.selectedWeapons[0].final_form &&
              augments
            }
          </div>
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
          <div style={{ display: 'flex' }}>
            <CalculateButton onClick={this.calculateAndReplace} disabled={this.state.selectedWeapons.length === 0}>Calculate and replace</CalculateButton>
            <CalculateButton onClick={this.calculateAndAdd} disabled={this.state.selectedWeapons.length === 0}>Calculate and add</CalculateButton>
          </div>
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
