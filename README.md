Redux Message Passer
====================

Redux Message Passer is an experimental (and naïve) store enhancer for [Redux][redux] to facilitate keeping multiple stores in sync with one "master" store via message passing.

[redux]:http://redux.js.org/

Use
---

* **`messagePasserServer(serverSpec)`**

 Creates a store enhancer for a "server" store, which maintains state, applies actions via a reducer, and sends state updates to client stores via message passing.

 `serverSpec` - TBD

* **`messagePasserClient(clientSpec)`**

 Creates a store enhancer for a "client" store which does not dispatch actions, but instead sends them to a server store for centralized application.

 `clientSpec` - TBD

Example
-------

Imagine you have a Chrome extension with a background script and two content scripts. Data can only be shared between the scripts via message passing. You want the background script to be long-lived and control the redux state, and you want the content scripts to have access to a redux store *as if* it were local, but actually send all dispatches to the background script for processing.

`background.js`:

```javascript
const serverStore = createStore(
  reducer,
  initialState,
  messagePasserServer()
)
```

`client1.js` (and other content scripts):

```javascript
const clientStore = createStore(
  reducer,
  initialState,
  messagePasserClient()
)
```

Now, whenever a `clientStore` dispatches an action, that action will be packaged up and sent to the background script's `serverStore`. The background script will apply the update, and then send a message to all subscribed client scripts, asking them to update their store's current states.

The server store can additionally dispatch actions just like normal; the resulting state changes from those actions will also be distributed to the client stores.

Note that your stores can use other middleware and store enhancers via `compose` provided by Redux:

```javascript
import thunk from "redux-thunk"

const store = createStore(
  reducer,
  initialState,
  compose(
    applyMiddleware(thunk),
    messagePasserClient()
  )
)
```

Make sure you use `applyMiddleware` first so that the middleware functions you include generate serializable actions that Redux Message Passer can send to the server store.
