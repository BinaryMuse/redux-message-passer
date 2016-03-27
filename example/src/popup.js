import { compose, createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'

import { bridges, messagePasserClient } from '../../'

const log = (t) => {
  const el = document.createElement('div')
  el.textContent = t
  document.getElementById('content').appendChild(el)
}

const bridge = bridges.chrome.client('nft_redux_mp')

const store = createStore(
  (state, act) => {
    return { ...state, count: state.count + 1 }
  },
  { count: 0 },
  compose(
    applyMiddleware(thunk),
    messagePasserClient(bridge)
  )
)

store.subscribe(() => {
  log(JSON.stringify(store.getState()))
})
log(JSON.stringify(store.getState()))

const myActionCreator = () => {
  return dispatch => {
    setTimeout(() => {
      dispatch({type: 'OTHER'})
    }, 500)
  }
}

setInterval(() => {
  store.dispatch({type: 'ACTION'})
  store.dispatch(myActionCreator())
}, 2000)
