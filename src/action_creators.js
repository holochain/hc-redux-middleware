/**
 *
 * Function that creates an action creator for a given holochain function call
 *
 */
export const holochainActionCreator = (
  happ,
  zome,
  capability,
  func
) => (params) => {
  return {
    type: `${happ}/${zome}/${capability}/${func}`,
    meta: {
      holochainAction: true
    },
    payload: params
  }
}
