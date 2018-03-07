import React from 'react'
import ReactTable from 'react-table'
import styled from 'styled-components'
import 'react-table/react-table.css'
import Chip from 'material-ui/Chip'

export default function DisplayTable(props) {
  const columns = [
    {
      Header: 'Type',
      accessor: 'weapon_type',
      minWidth: 75
    },
    {
      Header: 'Name',
      accessor: 'name',
    },
    {
      Header: 'True Attack',
      accessor: 'true_attack'
    },
    {
      Header: 'Affinity',
      accessor: 'affinity'
    },
    {
      Header: 'Final Attack',
      accessor: 'calculatedAttack'
    },
    {
      Header: 'Sharpness',
      accessor: 'sharpness',
      Cell: props => <SharpnessBar data={props.value}/>,
      width: 100
    },
    {
      Header: 'Skills',
      accessor: 'skills',
      show: false
    }
  ]
  return(
    <ReactTable
      defaultSorted={[
        {
          id: 'calculatedAttack',
          desc: true
        }
      ]}
      className="-striped"
      columns={columns}
      data={props.data}
      SubComponent={row => {
        console.log(row.row.skills)
        return (
          <SkillDisplay data={row.row.skills}></SkillDisplay>
        )
      }}
    />
  )
}

const FlexBar = styled.div`
  display: flex;
  height: 14px;
  border: 1px solid black;
  width: 100px;
  background-color: gray;
`

function SharpnessBar(props) {
  const sharp = {
    red: props.data.red,
    orange: props.data.orange,
    yellow: props.data.yellow,
    green: props.data.green,
    blue: props.data.blue,
    white: props.data.white,
  }
  return (
    <FlexBar>
      {
        Object.keys(sharp).map((x) => {
          return (<div key={x} style={{ width: sharp[x] * .25, backgroundColor: x }}></div>)
        })
      }
    </FlexBar>
  )
}

const LevelDisplay = styled.span`
  margin-right: 5px;
`

function SkillDisplay(props) {
  const skills = Object.keys(props.data).map(x => ({...props.data[x], name: x})).filter(x => x.value)
  console.log(skills)
  return (
    <div style={{margin: 5}}>
      {
        skills.map(x => <Chip key={x.name} backgroundColor="rgba(0,0,0,.9)" labelColor="rgba(255,255,255,.9)">{x.name} : {x.value.level}</Chip>)
      }
    </div>
  )
}