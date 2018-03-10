import React from 'react'
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn
} from 'material-ui/Table'

export default function MonsterTable(props) {
  return (
    <Table>
      <TableHeader adjustForCheckbox={false} displaySelectAll={false}>
        <TableRow>
          <TableHeaderColumn>Part</TableHeaderColumn>
          <TableHeaderColumn>Sever</TableHeaderColumn>
          <TableHeaderColumn>Blunt</TableHeaderColumn>
          <TableHeaderColumn>Shot</TableHeaderColumn>
          <TableHeaderColumn>Fire</TableHeaderColumn>
          <TableHeaderColumn>Water</TableHeaderColumn>
          <TableHeaderColumn>Thunder</TableHeaderColumn>
          <TableHeaderColumn>Ice</TableHeaderColumn>
          <TableHeaderColumn>Dragon</TableHeaderColumn>
          <TableHeaderColumn>Stun</TableHeaderColumn>
        </TableRow>
      </TableHeader>
      <TableBody displayRowCheckbox={false}>
        {props.data &&
          props.data.map(zone => (
            <TableRow key={zone.Part}>
              {Object.keys(zone).map(type => (
                <TableRowColumn
                  key={zone}
                  style={{
                    backgroundColor: `rgba(10,173,0,${zone[type] / 100})`
                  }}
                >
                  {zone[type]}
                </TableRowColumn>
              ))}
            </TableRow>
          ))}
      </TableBody>
    </Table>
  )
}
