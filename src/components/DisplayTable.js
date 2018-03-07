import React from 'react'
import ReactTable from 'react-table'
import styled from 'styled-components'
import 'react-table/react-table.css'

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
            Cell: props => <SharpnessBar data={props.value}/>
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
    const skillNames = Object.keys(props.data)
    return (
        <div>
            {
                skillNames.map(x => <LevelDisplay key={x}>{x} : {props.data[x].value.level}</LevelDisplay>)
            }
        </div>
    )
}