import React from 'react'
import ReactTable from 'react-table'
import styled from 'styled-components'
import 'react-table/react-table.css'
import Chip from 'material-ui/Chip'
import ActionDeleteForever from 'material-ui/svg-icons/action/delete-forever'
import * as icons from '../icons'

export default function DisplayTable(props) {
  const columns = [
    {
      Header: 'Type',
      accessor: 'weapon_type',
      maxWidth: 45,
      Cell: p => (
        <img
          alt={[p.value]}
          src={icons[p.value.replace(/ /g, '').replace('&', 'And')]}
          style={{ width: 30, height: 30 }}
        />
      )
    },
    {
      Header: 'Name',
      accessor: 'name',
      style: {
        textAlign: 'left'
      }
    },
    {
      Header: 'Final Attack',
      accessor: 'calculatedAttack',
      maxWidth: 100
    },
    {
      Header: 'True Attack',
      accessor: 'true_attack',
      maxWidth: 100
    },
    {
      Header: 'Total Attack',
      accessor: 'totalAttack',
      maxWidth: 120
    },
    {
      Header: 'Base Affinity',
      accessor: 'affinity',
      maxWidth: 100
    },
    {
      Header: 'Total Affinity',
      accessor: 'totalAffinity',
      maxWidth: 120
    },
    {
      Header: 'Sharpness',
      accessor: 'sharpness',
      Cell: props => {
        if (props.row.isRanged) {
          return <span>N/A</span>
        }
        return <SharpnessBar data={props.value} />
      },
      width: 110,
      sortable: false
    },
    {
      Header: 'Hits Before Sharpen',
      accessor: 'totalHits',
      Cell: props => {
        if (props.row.isRanged) {
          return <span>N/A</span>
        }
        return <span>{props.value}</span>
      }
    },
    {
      Header: 'Min Sharpness',
      accessor: 'minimumSharpness',
      show: false
    },
    {
      Header: 'Skills',
      accessor: 'skills',
      show: false
    },
    {
      Header: 'Is Ranged',
      accessor: 'isRanged',
      show: false
    },
    {
      Header: '',
      Cell: p => (
        <ActionDeleteForever
          color="red"
          style={{ cursor: 'pointer' }}
          onClick={() => props.deleteRow(p.index)}
        />
      ),
      width: 35
    }
  ]
  return (
    <ReactTable
      defaultSorted={[
        {
          id: 'calculatedAttack',
          desc: true
        }
      ]}
      getTdProps={() => ({
        style: {
          textAlign: 'center'
        }
      })}
      className="-striped"
      columns={columns}
      data={props.data}
      defaultPageSize={10}
      style={{ marginBottom: 30 }}
      SubComponent={row => {
        console.log(row.row.skills)
        return (
          <div>
            <SkillDisplay
              data={row.row.skills}
              minSharpness={row.row.minimumSharpness}
            />
          </div>
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
    white: props.data.white
  }
  return (
    <FlexBar>
      {Object.keys(sharp).map(x => {
        return (
          <div key={x} style={{ width: sharp[x] * 0.25, backgroundColor: x }} />
        )
      })}
    </FlexBar>
  )
}

function SkillDisplay(props) {
  const skills = Object.keys(props.data)
    .map(x => ({ ...props.data[x], name: x }))
    .concat([
      {
        name: 'Minimum Sharpness',
        level: ['Red', 'Orange', 'Yellow', 'Green', 'Blue', 'White'][
          props.minSharpness
        ]
      }
    ])
  return (
    <div style={{ margin: 5, display: 'flex' }}>
      {skills.map(x => (
        <Chip
          key={x.name}
          backgroundColor="rgba(0,0,0,.9)"
          labelColor="rgba(255,255,255,.9)"
          style={{ marginRight: 3 }}
        >
          {x.name} :{' '}
          {x.name.includes('augment')
            ? x.attack ? 'Attack' : 'Affinity'
            : x.level}
        </Chip>
      ))}
    </div>
  )
}
