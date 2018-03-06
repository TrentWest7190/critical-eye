import React from 'react'
import ReactTable from 'react-table'
import styled from 'styled-components'
import 'react-table/react-table.css'

export default function DisplayTable(props) {
    const columns = [
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
        }
    ]
    return(
        <ReactTable
            columns={columns}
            data={props.data}
        />
    )
}

const FlexBar = styled.div`
    display: flex;
    height: 14px;
    border: 1px solid black;
    width: 160px;
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
                    return (<div key={x} style={{ width: sharp[x] * .4, backgroundColor: x }}></div>)
                })
            }
        </FlexBar>
    )
}