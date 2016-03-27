import { compose, createStore, applyMiddleware } from 'redux'

import { bridges, messagePasserServer } from '../../src/'

const bridge = bridges.chrome.server('nft_redux_mp')

const initialState = { count: 0 }
const reducer = (state, action) => {
  return {
    ...state,
    count: state.count + 1
  }
}

let store = createStore(
  reducer,
  initialState,
  compose(
    applyMiddleware(),
    messagePasserServer(bridge)
  )
)

store.subscribe(() => {
  console.log('state', store.getState())
})

setInterval(() => {
  store.dispatch({type: 'ACTION'})
}, 1500)
