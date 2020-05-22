let timeoutID

const reducer = (state = { message: null }, action) => {
  switch (action.type) {
  case 'SET_NOTIFICATION':
    return action.notification
  default:
    return state
  }
}

export const setNotification = (message, noticeType, time) => (
  async dispatch => {
    dispatch({
      type: 'SET_NOTIFICATION',
      notification: {
        message,
        noticeType
      }
    })
    clearTimeout(timeoutID)
    timeoutID = setTimeout(() => {
      dispatch({
        type: 'SET_NOTIFICATION',
        notification: {
          message: null,
          noticeType
        }
      })
    }, time * 1000)
  }
)

export default reducer