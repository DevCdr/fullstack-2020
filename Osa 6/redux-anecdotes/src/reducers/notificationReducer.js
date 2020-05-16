let timeoutID

const reducer = (state = '', action) => {
  switch (action.type) {
    case 'SET_NOTIFICATION':
      return action.notification
    default:
      return state
  }
}

export const setNotification = (notification, time) => (
  async dispatch => {
    dispatch({
      type: 'SET_NOTIFICATION',
      notification
    })
    clearTimeout(timeoutID)
    timeoutID = setTimeout(() => {
      dispatch({
        type: 'SET_NOTIFICATION',
        notification: ''
      })
    }, time * 1000)
  }
)

export default reducer