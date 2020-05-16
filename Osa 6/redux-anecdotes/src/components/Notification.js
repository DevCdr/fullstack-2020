import React from 'react'
import { connect } from 'react-redux'

const Notification = (props) => {
  const style = {
    border: 'solid',
    padding: 10,
    borderWidth: 1,
    marginBottom: 10
  }

  return (
    <div style={props.notification === '' ? { display: 'none'} : style}>
      {props.notification}
    </div>
  )
}

export default connect(state => ({ notification: state.notification }), null)(Notification)