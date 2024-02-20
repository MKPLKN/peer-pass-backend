module.exports = class ListenerManager {
  constructor ({ eventService }) {
    this.eventService = eventService
    this.listeners = new Map()
  }

  add (eventKeyPath, listener) {
    const [eventKey, listenerKey] = eventKeyPath.split('.')
    let eventListeners = this.listeners.get(eventKey)

    if (!eventListeners) {
      eventListeners = new Map()
      this.listeners.set(eventKey, eventListeners)
    }

    // Check if the listener is already registered to prevent duplicates.
    if (!eventListeners.has(listenerKey)) {
      eventListeners.set(listenerKey, listener)
      this.eventService.on(eventKey, listener)
    }
  }

  remove (eventKeyPath) {
    const [eventKey, listenerKey] = eventKeyPath.split('.')
    const eventListeners = this.listeners.get(eventKey)

    if (eventListeners && eventListeners.has(listenerKey)) {
      const listener = eventListeners.get(listenerKey)
      this.eventService.off(eventKey, listener)
      eventListeners.delete(listenerKey)

      if (eventListeners.size === 0) {
        this.listeners.delete(eventKey)
      }
    }
  }

  removeAllForEvent (eventKey) {
    const eventListeners = this.listeners.get(eventKey)
    if (eventListeners) {
      for (const listenerKey of eventListeners.keys()) {
        this.remove(`${eventKey}.${listenerKey}`)
      }
    }
  }

  get (eventKeyPath) {
    const [eventKey, listenerKey] = eventKeyPath.split('.')
    const eventListeners = this.listeners.get(eventKey)
    if (!listenerKey) {
      return eventListeners
    } else if (eventListeners) {
      return eventListeners.get(listenerKey)
    }
    return undefined
  }

  getAll () {
    const allListeners = {}
    for (const [eventKey, eventListeners] of this.listeners.entries()) {
      allListeners[eventKey] = Array.from(eventListeners.keys()).reduce((acc, listenerKey) => {
        acc[listenerKey] = true
        return acc
      }, {})
    }
    return allListeners
  }
}
