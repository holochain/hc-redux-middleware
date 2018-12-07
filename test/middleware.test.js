import { Server } from 'mock-socket'
var JsonRPC = require('simple-jsonrpc-js');

import { holochainMiddleware, holochainActionCreator } from '../src'
// following method of https://redux.js.org/recipes/writingtests

const url = 'ws://localhost:3000';
const mockServer = new Server(url);
  
  mockServer.on('connection', ws => {
  	var jrpc = new JsonRPC();
    ws.jrpc = jrpc;

    ws.jrpc.toStream = function(message){
        ws.send(message);
    };

    ws.on('message', function(message) {
        jrpc.messageHandler(message);
    });

    jrpc.on('app/zome/capability/func', ['message'], (message) => {
    	return JSON.stringify(message)
    });
  });

const middleware = holochainMiddleware(url)

const create = () => {
  const store = {
    getState: jest.fn(() => ({})),
    dispatch: jest.fn()
  }
  const next = jest.fn()

  const invoke = action => middleware(store)(next)(action)

  return { store, next, invoke }
}




it('passes through non-holochain action', () => {
  const { next, invoke } = create()
  const action = { type: 'TEST' }
  invoke(action)
  expect(next).toHaveBeenCalledWith(action)
})

it('passes holochain actions, calls the websocket and triggers success message with response', async () => {
  const { store, next, invoke } = create()
  const action = holochainActionCreator('app', 'zome', 'capability', 'func')({message: 'hi'})
  await invoke(action)
  expect(next).toHaveBeenCalledWith(action)
  expect(store.dispatch).toHaveBeenCalledWith({ type: action.type+"_SUCCESS", payload: 'hi'})
})

it('passes holochain actions, calls the websocket and triggers faulire message if not successful', async () => {
  const { store, next, invoke } = create()
  const action = holochainActionCreator('app', 'zome', 'capability', 'missing_func')({})
  await invoke(action)
  expect(next).toHaveBeenCalledWith(action)
  expect(store.dispatch).toHaveBeenCalledWith({ type: action.type+"_FAILURE", payload: {
	  code: -32601,
	  data: "app/zome/capability/missing_func",
	  message: "Method not found. The method does not exist / is not available.",
	}})
})

