import React, { Component } from 'react';
import Select from 'react-select'
import VirtualizedSelect from 'react-virtualized-select'
import DisplayTable from './components/DisplayTable'
import './App.css'
import { Card, CardHeader, CardText } from 'material-ui/Card'
import AppBar from 'material-ui/AppBar'
import Checkbox from 'material-ui/Checkbox'
import RaisedButton from 'material-ui/RaisedButton'
import FlatButton from 'material-ui/FlatButton'
import Dialog from 'material-ui/Dialog'
import ActionHelp from 'material-ui/svg-icons/action/help'

import styled, { css } from 'styled-components'
import dbhelper from './helpers/dbhelper'
import buildSkillString from './helpers/buildSkillString'
import calculate from './helpers/calculate'

const DarkenedCardHeader = styled(CardHeader)`
  background-color: rgba(0,0,0, .1);
`

const FlexDiv = styled.div`
  display: flex;
  padding: 5px;
  ${props => props.spaceEvenly && css`
    justify-content: space-evenly;
  `}
  ${props => props.center && css`
    justify-content: center;
  `}
  @media (max-width: 700px) {
    flex-direction: column;
    align-items: flex-start;
    justify-items: center;
  }
`

const CalcButton = styled(RaisedButton)`
  margin: 5px;
  @media(max-width: 700px) {
    width: 100%;
  }
`

const SkillSelectContainer = styled.div`
  width: 30%;
  @media(max-width: 700px) {
    width: 100%;
    margin: 5px;
  }
`

const WarningModal = (props) => {
  const actions = [
    <FlatButton
      label="Cancel"
      onClick={props.handleClose}
    />,
    <RaisedButton
      label="Continue"
      primary={true}
      onClick={props.handleContinue}
    />
  ]
  return (
    <Dialog
      title="Warning!"
      actions={actions}
      open={props.open}
    >
      This will delete everything in the table!
    </Dialog>
  )
}

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
      { value: 5, label: 'White / Use Max Sharpness' }
    ].reverse()
    this.skills = dbhelper.allSkills()
    this.calculateAndReplace = this.calculateAndReplace.bind(this)
    this.calculateAndAdd = this.calculateAndAdd.bind(this)
    this.updateSkill = this.updateSkill.bind(this)
    this.selectWeaponClass = this.selectWeaponClass.bind(this)
    this.selectSharpnessLevel = this.selectSharpnessLevel.bind(this)
    this.selectHandicraftLevel = this.selectHandicraftLevel.bind(this)
    this.handleSingleWeaponToggle = this.handleSingleWeaponToggle.bind(this)
    this.updateAugment = this.updateAugment.bind(this)
    this.deleteRow = this.deleteRow.bind(this)
    this.handleContinue = this.handleContinue.bind(this)
    this.handleClose = this.handleClose.bind(this)
    this.state = {
      selectedSharpnessLevel: null,
      selectedWeaponClass: null,
      handicraftLevel: 0,
      skills: localStorage.getItem('savedSkills') ? JSON.parse(localStorage.getItem('savedSkills')) : {},
      selectedWeapons: [],
      calculatedWeapons: localStorage.getItem('savedWeapons') ? JSON.parse(localStorage.getItem('savedWeapons')) : [],
      singleWeapon: false,
      augments: {
        0: null,
        1: null,
        2: null
      },
      warningOpen: false,
      sharpnessModalOpen: false,
      disableSharpnessDropdown: false
    }
  }

  handleClose() {
    this.setState((prevState) => {
      return {
        ...prevState,
        warningOpen: false
      }
    })
  }

  handleContinue() {
    this.setState((prevState) => {
      return {
        ...prevState,
        warningOpen: false
      }
    })
    this.calculateAndReplace()
  }

  deleteRow({index}) {
    this.setState((prevState) => {
      return {
        ...prevState,
        calculatedWeapons: prevState.calculatedWeapons.filter((_,i) => index !== i)
      }
    })
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
        selectedWeapons: [],
        selectedWeaponClass: null,
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
    selectedWeapons = dbhelper.filterWeapons({
      field_name: this.state.singleWeapon ? 'wep_id' : 'wep_type_id',
      field_value: selectedValue && selectedValue.value
    })
    this.setState((prevState, props) => {
      return {
        ...prevState,
        selectedWeaponClass: selectedValue && selectedValue.value,
        selectedWeapons,
        augments: { 0: null, 1: null, 2: null },
        disableSharpnessDropdown: selectedWeapons.some(x => dbhelper.weaponIsRanged(x.wep_id))
      }
    })
  }

  updateSkill(skillName) {
    return (selectedValue) => {
      console.log(skillName, selectedValue)
      this.setState((prevState, props) => {
        const newSkills = {
          ...prevState.skills,
          [skillName]: selectedValue
        }
        localStorage.setItem('savedSkills', JSON.stringify(newSkills))
        return {
          ...prevState,
          skills: newSkills
        }
      })
    }
  }

  calculateAndAdd() {
    const augments = Object.values(this.state.augments).filter(Boolean).reduce((a,v,i) => {
      if (v === 'attack') {
        a['augment'+i] = { value: { attack: 5 } }
      } else if (v === 'affinity') {
        if (Object.keys(a).find(x => a[x].value.affinity)) {
          a['augment'+i] = { value: { affinity: 5 }}
        } else {
          a['augment'+i] = { value: { affinity: 10 } }
        }
      }
      return a
    }, {})
    const skillsAndAugments = {
      ...this.state.skills,
      ...augments
    }
    const results = calculate(skillsAndAugments, this.state.selectedWeapons, this.state.selectedSharpnessLevel, this.state.handicraftLevel)
    this.setState((prevState, props) => {
      const newWeapons = this.state.calculatedWeapons.concat(results)
      localStorage.setItem('savedWeapons', JSON.stringify(newWeapons))
      return {
        prevState,
        calculatedWeapons: newWeapons
      }
    })
  }

  calculateAndReplace() {
    const augments = Object.values(this.state.augments).filter(Boolean).reduce((a,v,i) => {
      if (v === 'attack') {
        a['augment'+i] = { value: { attack: 5 } }
      } else if (v === 'affinity') {
        if (Object.keys(a).find(x => a[x].value.affinity)) {
          a['augment'+i] = { value: { affinity: 5 }}
        } else {
          a['augment'+i] = { value: { affinity: 10 } }
        }
      }
      return a
    }, {})
    const skillsAndAugments = {
      ...this.state.skills,
      ...augments
    }
    const results = calculate(skillsAndAugments, this.state.selectedWeapons, this.state.selectedSharpnessLevel, this.state.handicraftLevel)
    this.setState((prevState, props) => {
      localStorage.setItem('savedWeapons', JSON.stringify(results))
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
          style={{width: 150}}
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
        <AppBar
          showMenuIconButton={false}
          title="Critical Eye"
        />
        <div className="container">
          <Card style={{marginTop: 10, marginBottom: 10}}>
            <DarkenedCardHeader
              title="Select your weapon"
            />
            <div style={{padding: 15}}>
              <Checkbox
                label="Single Weapon"
                checked={this.state.singleWeapon}
                onCheck={this.handleSingleWeaponToggle}
              />
              <FlexDiv spaceEvenly>
                <VirtualizedSelect
                  style={{width: 250}}
                  placeholder={this.state.singleWeapon ? "Weapon" : "Weapon type"}
                  value={this.state.selectedWeaponClass}
                  onChange={this.selectWeaponClass}
                  options={this.state.singleWeapon ? this.allWeapons : this.weaponTypes}
                />
                <div style={{display: 'flex', alignItems: 'center'}}>
                  <Select
                    style={{width: 250}}
                    placeholder="Minimum sharpness"
                    value={this.state.selectedSharpnessLevel}
                    onChange={this.selectSharpnessLevel}
                    options={this.sharpnessLevels}
                    disabled={this.state.disableSharpnessDropdown}
                  />
                  <ActionHelp style={{height: '100%'}} onClick={() => this.setState({sharpnessModalOpen: true})}/>
                  <Dialog
                    open={this.state.sharpnessModalOpen}
                    actions={[
                      <FlatButton
                        label="Okay!"
                        onClick={() => this.setState({sharpnessModalOpen: false})}
                      />
                    ]}
                  >
                    <span>This selection corresponds to the lowest level of sharpness you will allow a weapon to reach before sharpnening.</span>
                    <hr/>
                    <span>For example, if you select Blue, the calculator will calculate the average damage over the course of going through both the White and the Blue sharpness, stopping after that.</span>
                    <hr/>
                    <span>If a sharpness higher than the maximum sharpness for a weapon is selected, the calculator will calculate only for the highest level of sharpness.</span>
                    <hr/>
                    <span>For example, if you select White, but a weapon's sharpness maxes out at Blue, it will only calculate the damage for the Blue section of sharpness.</span>
                  </Dialog>
                </div>
                
              </FlexDiv>
              <FlexDiv center>
                {
                  this.state.singleWeapon && this.state.selectedWeapons[0] && this.state.selectedWeapons[0].final_form &&
                  augments
                }
              </FlexDiv>
            </div>
          </Card>
          <Card expandable={true} expanded={this.state.expanded}>
            <DarkenedCardHeader
              title="Select your modifiers"
              actAsExpander={true}
              showExpandableButton={true}
            />
            <CardText expandable={true} style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around', alignContent: 'space-around'}}>
              {
                this.skills.map((skill) => {
                  const options = skill.values.map(x => ({ value: x, label: buildSkillString(x) }))
                  return (
                    <SkillSelectContainer key={skill.skill_id}>
                      <span>{skill.name}</span>
                      <Select
                        onChange={this.updateSkill(skill.name)}
                        value={this.state.skills[skill.name]}
                        placeholder={skill.description}
                        options={options}
                      />
                    </SkillSelectContainer>
                    
                  )
                })
              }
              <SkillSelectContainer>
                <span>Handicraft</span>
                <Select
                  onChange={this.selectHandicraftLevel}
                  value={this.state.handicraftLevel}
                  placeholder="Extends the weapon sharpness gauge. However, it will not increase the gauge past its maximum."
                  options={[1,2,3,4,5].map(x => ({ value: x, label: x }))}
                />
              </SkillSelectContainer>
            </CardText>
          </Card>
          <Card expandable={true} expanded={this.state.expanded}>
            <DarkenedCardHeader
              title="Select your monster (optional)"
              actAsExpander={true}
              showExpandableButton={true}
            />
            <CardText expandable={true} style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around', alignContent: 'space-around'}}>
              <Select
                
              />
            </CardText>
          </Card>
          <FlexDiv>
            <CalcButton
              label="Calculate and replace"
              primary={true}
              onClick={() => this.setState({ warningOpen: true })}
              disabled={this.state.selectedWeapons.length === 0 || (!this.state.disableSharpnessDropdown && !this.state.selectedSharpnessLevel || this.state.selectedSharpnessLevel < 0)}
            />
            <CalcButton
              label="Calculate and add"
              primary={true}
              onClick={this.calculateAndAdd}
              disabled={this.state.selectedWeapons.length === 0 || (!this.state.disableSharpnessDropdown && !this.state.selectedSharpnessLevel || this.state.selectedSharpnessLevel < 0)}
            />
          </FlexDiv>
          <DisplayTable
            style={{marginBottom: 30}}
            data={this.state.calculatedWeapons}
            deleteRow={this.deleteRow}
          />
        </div>
        <WarningModal
          handleContinue={this.handleContinue}
          handleClose={this.handleClose}
          open={this.state.warningOpen}
        />
        <span style={{position: 'fixed', right: 0, bottom: 0}}>
          Created by Trog. <a href="https://github.com/TrentWest7190/critical-eye">Github</a>
        </span>
      </div>
    )
  }
}

export default App;
