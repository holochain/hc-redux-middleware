import { createAsyncAction } from 'typesafe-actions'

/**
 *
 * Function that creates action creators for holochain zome function calls
 *
 */
export const createHolochainZomeCallAsyncAction = <ParamType, ReturnType>(
  instanceId: string,
  zome: string,
  func: string
) => {

  const callString = [instanceId, zome, func].join('/')

  const action = createAsyncAction(
    callString,
    callString + '_SUCCESS',
    callString + '_FAILURE')
  <ParamType, ReturnType, Error>()

  const newAction = action as (typeof action & {
    create: (param: ParamType) => any,
    sig: (param: ParamType) => Promise<ReturnType>
  })

  // the action creators that are produced
  newAction.create = (params: ParamType) => {
    return {
      type: callString,
      meta: {
        holochainZomeCallAction: true,
        instanceId,
        zome,
        func
      },
      payload: params
    }
  }

  return newAction
}

/**
 *
 * Function that creates action creators for holochain conductor admin calls
 *
 */
export const createHolochainAdminAsyncAction = <ParamType, ReturnType>(
  ...segments: Array<string>
) => {

  const callString = segments.length === 1 ? segments[0] : segments.join('/')

  const action = createAsyncAction(
    callString,
    callString + '_SUCCESS',
    callString + '_FAILURE')
  <ParamType, ReturnType, Error>()

  const newAction = action as (typeof action & {
    create: (param: ParamType) => any,
    sig: (param: ParamType) => Promise<ReturnType>
  })

  // the action creators that are produced
  newAction.create = (params: ParamType) => {
    return {
      type: callString,
      meta: {
        holochainAdminAction: true,
        callString
      },
      payload: params
    }
  }

  return newAction
}
