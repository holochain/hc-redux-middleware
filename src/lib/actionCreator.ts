import { createAsyncAction } from 'typesafe-actions'

/**
 *
 * Function that creates action creators for holochain calls
 * The actions it creates are thunks rather than traditional actions
 * so the redux-thunk middleware must be applied.
 *
 */
export const createHolochainAsyncAction = <ParamType, ReturnType>(
  happ: string,
  zome: string,
  capability: string,
  func: string
) => {

  const callString = `${happ}/${zome}/${capability}/${func}`

  const action = createAsyncAction(
    callString,
    callString + '_SUCCESS',
    callString + '_FAILURE')
  <ParamType, ReturnType, Error>()

  const newAction = action as (typeof action & {
    create: (param: ParamType) => any,
    sig: (param: ParamType) => Promise<{payload: ReturnType}>
  })

  // the action creators that are produced
  newAction.create = (params: ParamType) => {
    return {
      type: callString,
      meta: {
        holochainAction: true,
        callString
      },
      payload: params
    }
  }

  return newAction
}
