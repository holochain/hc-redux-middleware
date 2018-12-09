import test from 'ava'
import sinon from 'sinon'

import { holochainMiddleware } from './middleware'
import { createHolochainAsyncAction } from './actionCreator'

const mockWebClient = Promise.resolve({
  call: (callStr: string) => (params: any) => {
    return Promise.resolve(JSON.stringify('success'))
  },
  close: () => Promise.resolve('closed'),
  ws: null
})

const create = () => {
  const store = {
    getState: sinon.spy(() => ({})),
    dispatch: sinon.spy()
  }
  const next = sinon.spy()
  const invoke = (action: any) => holochainMiddleware(mockWebClient)(store)(next)(action)

  return { store, next, invoke }
}

test('It passes non-holochain actions to the next reducer', async t => {
  let { next, invoke } = create()

  const nonHolochainAction = { type: 'not-holochain-action' }
  await invoke(nonHolochainAction)

  t.true(next.calledWith(nonHolochainAction))
})

test('It passes holochain actions and dispatches new action on success ', async t => {
  let { next, invoke, store } = create()

  const holochainAction = createHolochainAsyncAction('happ', 'zome', 'capability', 'func')
  const result = await invoke(holochainAction.create({}))

  t.true(result === 'success')
  t.true(next.calledWith(holochainAction.create({})))
  t.true(store.dispatch.calledWith(holochainAction.success('success')))

})
