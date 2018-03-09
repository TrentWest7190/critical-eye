import React from 'react'
import FlatButton from 'material-ui/FlatButton'
import Dialog from 'material-ui/Dialog'

export default function SharpnessDialog(props) {
  return (
    <Dialog
      open={props.open}
      actions={[
        <FlatButton
          label="Okay!"
          onClick={props.close}
        />
      ]}
    >
      <span>
        This selection corresponds to the lowest level of sharpness you will
        allow a weapon to reach before sharpnening.
      </span>
      <hr />
      <span>
        For example, if you select Blue, the calculator will calculate the
        average damage over the course of going through both the White and the
        Blue sharpness, stopping after that.
      </span>
      <hr />
      <span>
        If a sharpness higher than the maximum sharpness for a weapon is
        selected, the calculator will calculate only for the highest level of
        sharpness.
      </span>
      <hr />
      <span>
        For example, if you select White, but a weapon's sharpness maxes out at
        Blue, it will only calculate the damage for the Blue section of
        sharpness.
      </span>
    </Dialog>
  )
}
