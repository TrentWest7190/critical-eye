import React from 'react'
import ReactTable from 'react-table'
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
            Cell: props => console.log(props)
        }
    ]
    return(
        <ReactTable
            columns={columns}
            data={props.data}
        />
    )
}