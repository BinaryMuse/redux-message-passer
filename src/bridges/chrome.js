export function createClientChromeBridge (channelName) {
  const port = chrome.runtime.connect({name: channelName})

  const send = (msg) => port.postMessage(msg)

  const subscribe = (receive) => {
    port.onMessage.addListener(msg => {
      if (msg.reduxStateUpdate) {
        receive(msg)
      }
    })
  }

  return { send, subscribe }
}

export function createServerChromeBridge (channelName) {
  let subscribers = []

  const sendMsg = (port, msg) => port.postMessage(msg)

  const send = (msg) => {
    subscribers.forEach(port => sendMsg(port, msg))
  }

  const subscribe = (receive, notify) => {
    chrome.runtime.onConnect.addListener(port => {
      if (port.name !== channelName) return
      subscribers.push(port)

      port.onDisconnect.addListener(() => {
        subscribers = subscribers.filter(p => p !== port)
      })

      notify(msg => sendMsg(port, msg))

      port.onMessage.addListener(msg => {
        if (msg.reduxActionRequest) {
          receive(msg)
        }
      })
    })
  }

  return { send, subscribe }
}
