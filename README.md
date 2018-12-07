# hc-redux-middleware

To install: `npm install --save @holochain/hc-redux-middleware`

## Usage

First configure the store to use the middleware

```
import { createStore, combineReducers, applyMiddleware } from 'redux'
import { holochainMiddleware } from '@holochain/hc-redux-middleware'

// this url should use the same port set up the holochain container
const url = 'ws:localhost:3000'
const middleware = [holochainMiddleware(url)]

...

let store = createStore(reducer, applyMiddleware(...middleware))
```

Lets look an example action to see how the middleware works

```
{
  type: 'someApp/someZome/someCapability/someFunc',
  payload: { ... }
  meta: { holochainAction: true }
}
```

The first thing to notice is the `meta.holochainAction = True`. This is how the middleware detects which actions it should use to make calls to holochain.

Second is the type. The type is also used to carry the information as to which app, zome, capability and function should be called. It is identical to the string passed to `call` in hc-web-client. This means it can also be used to query the container.

The final part is the payload. This will be passed directly to the call to the holochain function and must have fields that match the holochain function signature.

### Action creators

To abstract away from manually creating these actions this module also provides helpers for doing that. For a particular holochain function call it will create an action creator that you can call later with parameters

```
import { holochainActionCreator } from '@holochain/hc-redux-middleware'

const someFuncActionCreator = holochainActionCreator('someApp', 'someZome', 'someCapability', 'someFunc')

// later on when you want to create dispatch an action to call the function with some params
const action = someFuncActionCreator(params)
dispatch(action)

```

### Response Actions

When a successful call to holochain is completed the middleware will dispatch an action containing the response. These actions have a type that is the same as the call but with `_SUCCESS` or `_FAILURE` appended.

```
{
  type: 'someApp/someZome/someCapability/someFunc_SUCCESS',
  payload: { ... } // this contains the function call result
}

{
  type: 'someApp/someZome/someCapability/someFunc_FAILURE',
  payload: { ... } // this contains details of the error
}
```

These can then be handler by the reducer to update the state