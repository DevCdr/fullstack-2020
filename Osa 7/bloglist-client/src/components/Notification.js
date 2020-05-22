import React from 'react'
import { useSelector } from 'react-redux'
import { Alert } from 'react-bootstrap'

const Notification = () => {
  const notification = useSelector(state => state.notification)

  if (notification.message === null) {
    return null
  }

  return (
    <Alert variant={notification.noticeType}>
      {notification.message}
    </Alert>
  )
}

export default Notification