const STATE_SYNC_TAG = '@@__REDUX_MP_STATE_SYNC__'

import { createClientChromeBridge, createServerChromeBridge } from './bridges/chrome'

export const bridges = {
  chrome: {
    client: createClientChromeBridge,
    server: createServerChromeBridge
  }
}

export function messagePasserClient ({ send, subscribe }) {
  return createStore => (reducer, initial, enhancer) => {
    const liftedReducer = (state, action) => {
      if (action.type === STATE_SYNC_TAG) {
        return action.newState
      } else {
        return reducer(state, action)
      }
    }
    const store = createStore(liftedReducer, initial, enhancer)
    const storeDotDispatch = store.dispatch

    store.dispatch = (action) => {
      send({reduxActionRequest: action})
    }

    subscribe(msg => {
      if (msg.reduxStateUpdate) {
        storeDotDispatch({
          type: STATE_SYNC_TAG,
          newState: msg.reduxStateUpdate
        })
      }
    })

    return store
  }
}

export function messagePasserServer ({ send, subscribe }) {
  return createStore => (reducer, initial, enhancer) => {
    const store = createStore(reducer, initial, enhancer)

    const receive = msg => {
      if (msg.reduxActionRequest) {
        store.dispatch(msg.reduxActionRequest)
      }
    }

    const notify = callback => callback({reduxStateUpdate: store.getState()})

    subscribe(receive, notify)

    store.subscribe(() => {
      send({reduxStateUpdate: store.getState()})
    })

    return store
  }
}
