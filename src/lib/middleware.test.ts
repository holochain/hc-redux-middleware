import test from 'ava'
import sinon from 'sinon'

import { holochainMiddleware } from './middleware'
import { createHolochainAsyncAction } from './actionCreator'

const mockWebClient = (callResponse: any) => Promise.resolve({
  call: (callStr: string) => (params: any) => {
    return Promise.resolve(callResponse)
  },
  close: () => Promise.resolve('closed'),
  ws: null
})

const create = (callResponse: any) => {
  const store = {
    getState: sinon.spy(() => ({})),
    dispatch: sinon.spy()
  }
  const next = sinon.spy()
  const invoke = (action: any) => holochainMiddleware(mockWebClient(callResponse))(store)(next)(action)

  return { store, next, invoke }
}

test('It passes non-holochain actions to the next reducer', async t => {
  let { next, invoke } = create('')

  const nonHolochainAction = { type: 'not-holochain-action' }
  await invoke(nonHolochainAction)

  t.true(next.calledWith(nonHolochainAction))
})

test('It passes holochain actions and dispatches new action on success. Ok is unwrapped ', async t => {
  let { next, invoke, store } = create(JSON.stringify({ Ok: 'success' }))

  const holochainAction = createHolochainAsyncAction('happ', 'zome', 'capability', 'func')
  const result = await invoke(holochainAction.create({}))

  t.deepEqual(result, 'success')
  t.true(next.calledWith(holochainAction.create({})))
  t.true(store.dispatch.calledWith(holochainAction.success('success')))
})

test('It passes holochain actions and dispatches new error action on holochain error. Err is unwrapped ', async t => {
  let { next, invoke, store } = create(JSON.stringify({ Err: 'fail' }))

  const holochainAction = createHolochainAsyncAction('happ', 'zome', 'capability', 'func')

  try {
    await invoke(holochainAction.create({}))
  } catch (result) {
    t.deepEqual(result, Error('fail'))
    t.true(next.calledWith(holochainAction.create({})))
    t.deepEqual(store.dispatch.lastCall.args[0], holochainAction.failure(Error('fail')))
  }
})

test('It passes holochain actions and dispatches new action on success. Raw return is passed directly ', async t => {
  let { next, invoke, store } = create(JSON.stringify({ someField: 'success' }))

  const holochainAction = createHolochainAsyncAction('happ', 'zome', 'capability', 'func')
  const result = await invoke(holochainAction.create({}))

  t.deepEqual(result, { someField: 'success' })
  t.true(next.calledWith(holochainAction.create({})))
  t.true(store.dispatch.calledWith(holochainAction.success({ someField: 'success' })))
})

test('can accept container admin style responses which return unstringified json objects', async t => {
  let { next, invoke, store } = create({ someField: 'success' })

  const holochainAction = createHolochainAsyncAction('admin', 'dna', 'list')
  const result = await invoke(holochainAction.create({}))

  t.deepEqual(result, { someField: 'success' })
  t.true(next.calledWith(holochainAction.create({})))
  t.true(store.dispatch.calledWith(holochainAction.success({ someField: 'success' })))
})

test('can accept container admin style responses which return unstringified json arrays', async t => {
  let { next, invoke, store } = create(['item1', 'item2'])

  const holochainAction = createHolochainAsyncAction('admin', 'dna', 'list')
  const result = await invoke(holochainAction.create({}))

  t.deepEqual(result, ['item1', 'item2'])
  t.true(next.calledWith(holochainAction.create({})))
  t.true(store.dispatch.calledWith(holochainAction.success(['item1', 'item2'])))
})

test('can accept container admin style responses which return plain strings which cannot be parsed to JSON', async t => {
  let { next, invoke, store } = create('test string')

  const holochainAction = createHolochainAsyncAction('admin', 'instance', 'list')
  const result = await invoke(holochainAction.create({}))

  t.deepEqual(result, 'test string')
  t.true(next.calledWith(holochainAction.create({})))
  t.true(store.dispatch.calledWith(holochainAction.success('test string')))
})
