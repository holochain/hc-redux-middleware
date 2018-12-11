import { Middleware, AnyAction } from 'redux'

type hcWebClientConnect = Promise<{
  call: (callStr: string) => (params: any) => Promise<string>,
  close: () => Promise<any>,
  ws: any
}>

export const holochainMiddleware = (hcWc: hcWebClientConnect): Middleware => store => {
  // stuff here has the same life as the store!
  // this is how we persist a websocket connection

  const connectPromise = hcWc.then(({ call }) => {
    store.dispatch({ type: 'HOLOCHAIN_WEBSOCKET_CONNECTED' })
    return call
  })

  return next => (action: AnyAction) => {
    if (action.meta && action.meta.holochainAction && action.meta.callString) {
      next(action) // resend the original action so the UI can change based on requests

      return connectPromise.then(call => {
        return call(action.meta.callString)(action.payload)
          .then((stringResult: string) => {
            const result = JSON.parse(stringResult)

            if (result.Err !== undefined) { // holochain error
              store.dispatch({
                type: action.type + '_FAILURE',
                payload: Error(result.Err)
              })
              return Error(result.Err)
            } else if (result.Ok !== undefined) { // holochain Ok
              store.dispatch({
                type: action.type + '_SUCCESS',
                payload: result.Ok
              })
              return result.Ok
            } else {                 // unknown. Return raw result as success
              store.dispatch({
                type: action.type + '_SUCCESS',
                payload: result
              })
              return result
            }
          })
          .catch((err: Error) => { // websocket error
            store.dispatch({
              type: action.type + '_FAILURE',
              payload: err.toString()
            })
            return err
          })
      })
    } else {
      return next(action)
    }
  }
}
