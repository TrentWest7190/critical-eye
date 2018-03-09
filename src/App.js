import React, { Component } from 'react'
import Select from 'react-select'
import VirtualizedSelect from 'react-virtualized-select'
import { observer, inject } from 'mobx-react'
import DisplayTable from './components/DisplayTable'
import SharpnessDialog from './components/SharpnessDialog'
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
  background-color: rgba(0, 0, 0, 0.1);
`

const FlexDiv = styled.div`
  display: flex;
  padding: 5px;
  ${props =>
    props.spaceEvenly &&
    css`
      justify-content: space-evenly;
    `} ${props =>
    props.center &&
    css`
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
  @media (max-width: 700px) {
    width: 100%;
  }
`

const SkillSelectContainer = styled.div`
  width: 30%;
  @media (max-width: 700px) {
    width: 100%;
    margin: 5px;
  }
`

const WarningModal = props => {
  const actions = [
    <FlatButton label="Cancel" onClick={props.handleClose} />,
    <RaisedButton
      label="Continue"
      primary={true}
      onClick={props.handleContinue}
    />
  ]
  return (
    <Dialog title="Warning!" actions={actions} open={props.open}>
      This will delete everything in the table!
    </Dialog>
  )
}

@inject('store')
@observer
class App extends Component {
  constructor() {
    super()
    this.skills = dbhelper.allSkills()
    this.calculateAndReplace = this.calculateAndReplace.bind(this)
    this.calculateAndAdd = this.calculateAndAdd.bind(this)
    this.updateSkill = this.updateSkill.bind(this)
    this.selectHandicraftLevel = this.selectHandicraftLevel.bind(this)
    this.deleteRow = this.deleteRow.bind(this)
    this.state = {
      handicraftLevel: 0,
      skills: localStorage.getItem('savedSkills')
        ? JSON.parse(localStorage.getItem('savedSkills'))
        : {},
      calculatedWeapons: localStorage.getItem('savedWeapons')
        ? JSON.parse(localStorage.getItem('savedWeapons'))
        : [],
    }
  }

  componentWillMount() {
    this.UIStore = this.props.store.UI
    this.WeaponStore = this.props.store.weapons
    this.CalculatorStore = this.props.store.calculator
  }

  deleteRow({ index }) {
    this.setState(prevState => {
      return {
        ...prevState,
        calculatedWeapons: prevState.calculatedWeapons.filter(
          (_, i) => index !== i
        )
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

  updateSkill(skillName) {
    return selectedValue => {
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
    const augments = Object.values(this.state.augments)
      .filter(Boolean)
      .reduce((a, v, i) => {
        if (v === 'attack') {
          a['augment' + i] = { value: { attack: 5 } }
        } else if (v === 'affinity') {
          if (Object.keys(a).find(x => a[x].value.affinity)) {
            a['augment' + i] = { value: { affinity: 5 } }
          } else {
            a['augment' + i] = { value: { affinity: 10 } }
          }
        }
        return a
      }, {})
    const skillsAndAugments = {
      ...this.state.skills,
      ...augments
    }
    const results = calculate(
      skillsAndAugments,
      this.state.selectedWeapons,
      this.state.selectedSharpnessLevel,
      this.state.handicraftLevel
    )
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
    const augments = Object.values(this.state.augments)
      .filter(Boolean)
      .reduce((a, v, i) => {
        if (v === 'attack') {
          a['augment' + i] = { value: { attack: 5 } }
        } else if (v === 'affinity') {
          if (Object.keys(a).find(x => a[x].value.affinity)) {
            a['augment' + i] = { value: { affinity: 5 } }
          } else {
            a['augment' + i] = { value: { affinity: 10 } }
          }
        }
        return a
      }, {})
    const skillsAndAugments = {
      ...this.state.skills,
      ...augments
    }
    const results = calculate(
      skillsAndAugments,
      this.state.selectedWeapons,
      this.state.selectedSharpnessLevel,
      this.state.handicraftLevel
    )
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
    if (this.UIStore.showAugmentSelects) {
      augments = Array.from({ length: this.WeaponStore.getNumberOfAugments }, (x, i) => (
        <Select
          style={{ width: 150 }}
          key={i}
          value={this.CalculatorStore.augments[i]}
          placeholder="Augment"
          onChange={this.CalculatorStore.updateAugment(i)}
          options={[
            { value: 'attack', label: 'Attack Increase' },
            { value: 'affinity', label: 'Affinity Increase' }
          ]}
        />
      ))
    }

    return (
      <div className="App">
        <button onClick={() => this.props.store.changeTestVal(100)}>
          clicky
        </button>
        <AppBar showMenuIconButton={false} title="Critical Eye" />
        <div className="container">
          <Card style={{ marginTop: 10, marginBottom: 10 }}>
            <DarkenedCardHeader title="Select your weapon" />
            <div style={{ padding: 15 }}>
              <Checkbox
                label="Single Weapon"
                checked={this.UIStore.singleWeapon}
                onCheck={this.UIStore.toggleSingleWeapon}
              />
              <FlexDiv spaceEvenly>
                <VirtualizedSelect
                  style={{ width: 250 }}
                  placeholder={this.UIStore.weaponSelectPlaceholder}
                  value={this.UIStore.weaponSelectDropdownValue}
                  onChange={this.UIStore.selectWeapon}
                  options={this.WeaponStore.getWeaponsForWeaponSelect}
                />
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <Select
                    style={{ width: 250 }}
                    placeholder="Minimum sharpness"
                    value={this.UIStore.sharpnessSelectValue}
                    onChange={this.UIStore.selectSharpness}
                    options={this.WeaponStore.getSharpnessLevels}
                    disabled={this.UIStore.disableSharpnessDropdown}
                  />
                  <ActionHelp
                    style={{ height: '100%', cursor: 'pointer' }}
                    onClick={() => (this.UIStore.sharpnessModalOpen = true)}
                  />
                  <SharpnessDialog
                    open={this.UIStore.sharpnessModalOpen}
                    close={() => this.UIStore.sharpnessModalOpen = false}
                  />
                </div>
              </FlexDiv>
              <FlexDiv center>
                {augments}
              </FlexDiv>
            </div>
          </Card>
          <Card expandable={true} expanded={this.state.expanded}>
            <DarkenedCardHeader
              title="Select your modifiers"
              actAsExpander={true}
              showExpandableButton={true}
            />
            <CardText
              expandable={true}
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'space-around',
                alignContent: 'space-around'
              }}
            >
              {this.skills.map(skill => {
                const options = skill.values.map(x => ({
                  value: x,
                  label: buildSkillString(x)
                }))
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
              })}
              <SkillSelectContainer>
                <span>Handicraft</span>
                <Select
                  onChange={this.selectHandicraftLevel}
                  value={this.state.handicraftLevel}
                  placeholder="Extends the weapon sharpness gauge. However, it will not increase the gauge past its maximum."
                  options={[1, 2, 3, 4, 5].map(x => ({ value: x, label: x }))}
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
            <CardText
              expandable={true}
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'space-around',
                alignContent: 'space-around'
              }}
            >
              <Select />
            </CardText>
          </Card>
          <FlexDiv>
            <CalcButton
              label="Calculate"
              primary={true}
              onClick={this.calculateAndAdd}
            />
            <CalcButton
              label="Clear Table"
              primary={true}
              onClick={() => this.UIStore.toggleWarning()}
            />
          </FlexDiv>
          <DisplayTable
            style={{ marginBottom: 30 }}
            data={this.state.calculatedWeapons}
            deleteRow={this.deleteRow}
          />
        </div>
        <WarningModal
          handleContinue={() => {
            this.UIStore.toggleWarning()
            this.calculateAndReplace()
          }}
          handleClose={() => this.UIStore.toggleWarning()}
          open={this.UIStore.warningOpen}
        />
        <span style={{ position: 'fixed', right: 0, bottom: 0 }}>
          Created by Trog.{' '}
          <a href="https://github.com/TrentWest7190/critical-eye">Github</a>
        </span>
      </div>
    )
  }
}

export default App
