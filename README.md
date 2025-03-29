# App's Digest (DEPRECATED)

_Simple, atomic state management._

**DEPRECATED**: This is no longer supported, please consider using [Nucleux](https://github.com/martyroque/nucleux) instead

---

## Introduction

App's Digest is a simple, atomic state management library based on the publisher-subscriber pattern and inversion-of-control (IoC) container design principle.

App's Digest allows you to have centralized locations (stores) with units of state (atoms) that your application can subscribe to. Unlike other state management libraries, App's Digest only triggers strictly-needed, isolated updates for computations (e.g. React components) subscribed to atoms.

With App's Digest you can manage your application state outside of any UI framework, making your code decoupled, portable, and testable.

> The library name was inspired by the general-interest subscription-based magazine, Reader's Digest.

## Why App's Digest over other state management libraries?

- Simple and un-opinionated
- Makes hooks the primary means of consuming state
- Less boilerplate and no provider wrapping
- Centralized, atomic and subscription-based state management

## Table of contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [A Quick Example](#a-quick-example)
- [Description](#description)
- [Detailed Usage](#detailed-usage)
- [Dependency](#dependency-injection)
- [Persistency](#persistency)
- [Computed Values](#computed-values)
- [React Native](#react-native)
- [Author](#author)
- [License](#license)

## Prerequisites

- Node >= 14
- React >= 16.9.0 (Optional)

## Installation

```sh
npm install apps-digest
```

## A quick example

```javascript
import React from 'react';
import ReactDOM from 'react-dom';
import { AppsDigestValue, useStore, useValue } from 'apps-digest';

class CounterStore {
  count = new AppsDigestValue(0);

  increment() {
    const currentCount = this.count.value;
    this.count.value = currentCount + 1;
  }
}

const CounterView = () => {
  const counterStore = useStore(CounterStore);
  const count = useValue(counterStore.count);

  return (
    <button onClick={() => counterStore.increment()}>
      Current Count: {count}
    </button>
  );
};

ReactDOM.render(<CounterView />, document.body);
```

## Description

App's Digest leverages on two software architecture patterns:

- IoC Container pattern (a.k.a. DI Container) to manage store instantiation, dependency injection and lifecycle.
- The publisher-subscriber pattern to implement values within the stores that any JavaScript context (including React components) can subscribe and publish to.

![App's Digest Flow](https://emrock-app.s3.us-east-2.amazonaws.com/uploads/apps-digest-flow.png)

### What's a Store?

A store is essentially a bucket of values that other JavaScript objects can subscribe and publish to. The stores live as long as they have at least one reference in the container. Once the last reference of a store is removed, the store is disposed.

## Detailed Usage

Let's take a closer look on how to use the library.

### Create a store

First, let's create our store. A store is a class that implements the following:

- Store value(s) by instantiating `AppsDigestValue` with an initial value (required).
- Value setters that publish (updates) the store values (optional).

Note: It is a good pattern to keep your stores separate from your UI.

```javascript
import { AppsDigestValue } from 'apps-digest';

class CounterStore {
  count = new AppsDigestValue(0);

  increment() {
    const currentCount = this.count.value;
    this.count.value = currentCount + 1;
  }
}

export default CounterStore;
```

### Use the store anywhere

Now that we have our store, we can use it anywhere within a JavaScript application by getting its instance via the container.

```javascript
import { AppsDigestContainer } from 'apps-digest';
import CounterStore from './CounterStore';

// get the container and store instances
const storeContainer = AppsDigestContainer.getInstance();
const counterStore = storeContainer.get(CounterStore);

// subscribe to the value
const subscriberId = counterStore.count.subscribe((count) => {
  console.log(`Current Count: ${count}`);
});

// publish to the value
counterStore.increment();
counterStore.increment();
counterStore.increment();

// unsubscribe from the value
counterStore.count.unsubscribe(subscriberId);

// dispose the store
storeContainer.remove(CounterStore);
```

### Use the store in a React Component

All right, let's use our store in a UI using React (we'll support frameworks in the future).

First we need to get our store instance by using the `useStore`. Then we can use the hook `useValue` to subscribe to the store value and trigger the side effects (render).

By using these hooks, we get automatic value un-subscription and store disposal for free when the component is unmounted.

```javascript
import React from 'react';
import ReactDOM from 'react-dom';
import { useStore, useValue } from 'apps-digest';
import CounterStore from './CounterStore';

const CounterView = () => {
  const counterStore = useStore(CounterStore);
  const count = useValue(counterStore.count);

  return (
    <button onClick={() => counterStore.increment()}>
      Current Count: {count}
    </button>
  );
};

ReactDOM.render(<CounterView />, document.body);
```

### See this live

Please visit our [App's Digest Codesandbox](https://codesandbox.io/s/apps-digest-tutorial-0cwlqq?file=/src/App.js) to see a live example of the React usage.

## Dependency (injection)

It's important for all applications to follow software design principles, specifically separation of concerns and segregation.

With App's Digest, we can have segregated stores that contain a small meaningful portion of the application's state, and then leverage the container to inject stores into main stores.

Let's say we have a store that needs to read the count value from our `CounterStore`. We can easily inject the store like this:

```javascript
import { AppsDigestValue, AppsDigestStore } from 'apps-digest';
import CounterStore from './CounterStore';

class ApplicationStore extends AppsDigestStore {
  counterStore = this.inject(CounterStore);
  isMax = new AppsDigestValue(false);

  constructor() {
    super();

    this.subscribeToStoreValue(this.counterStore.count, (count) => {
      if (!this.isMax.value && count >= 10) {
        this.isMax.value = true;
      }
    });
  }
}

export default ApplicationStore;
```

By extending from `AppsDigestStore`, we get the automatic un-subscription for free when the store is disposed.

## Persistency

In order to persist a store value, we need to specify the persist key we would like to use (has to be unique) in the second argument of `AppsDigestValue`.

Every time the value is published, the value will be persisted. And, the next time the store is instantiated, the value will be rehydrated.

```javascript
// assuming CountValue was persisted as 2, count will be hydrated with 2 instead of 0
count = new AppsDigestValue(0, 'CountValue');

// this will persist the new value
this.count.value = currentCount + 1;
```

### Persistency - Custom Storage

You can configure App's Digest values to use custom storage for persistency. For instance, in React Native, you can use `AsyncStorage`:

```javascript
import AsyncStorage from '@react-native-async-storage/async-storage';

count = new AppsDigestValue(0, 'CountValue', {
  storage: AsyncStorage,
});
```

## Computed Values

Sometimes we have complex stores with several values that we then need to use to derive a value from. App's Digest offers computed values feature, which allows us to consume store values, compute them in a callback and produce a single result. To do so, we need our store to extend from `AppsDigestStore`.

Let's say we have a store that manages the user session, and we have a `isAuth` value to determine if the user is authenticated. Now, let's say our user store depends on the API store, which has a value `isConnected` to allow API requests. Given a requirement that we should only allow requests from authenticated users when the API is connected, we can create a computed property called `shouldMakeRequest`, like so:

### ApiStore

```javascript
import { AppsDigestValue } from 'apps-digest';

class ApiStore {
  isConnected = new AppsDigestValue(false);
}

export default ApiStore;
```

### UserStore

```javascript
import { AppsDigestValue, AppsDigestStore } from 'apps-digest';
import ApiStore from './ApiStore';

class UserStore extends AppsDigestStore {
  apiStore = this.inject(ApiStore);
  isAuth = new AppsDigestValue(false);
  shouldMakeRequest = this.computedValue(
    [this.isAuth, this.apiStore.isConnected],
    (isAuthValue, isConnectedValue) => {
      return isAuthValue && isConnectedValue;
    },
  );
}

export default UserStore;
```

With this, `shouldMakeRequest` will track both `isAuth` and `isConnected` values and produce a single `boolean` value as a result. This computed value can be used as a regular store value anywhere in our app.

```javascript
import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import { useStore, useValue } from 'apps-digest';
import UserStore from './UserStore';

const App = () => {
  const userStore = useStore(UserStore);
  const shouldMakeRequest = useValue(userStore.shouldMakeRequest);

  useEffect(() => {
    if (shouldMakeRequest) {
      // make a fetch request
    }
  }, [shouldMakeRequest]);

  // ...
};

ReactDOM.render(<App />, document.body);
```

## React Native

App's Digest uses `nanoid` for a secure unique string ID generation to create value subscriptions and store identifiers. React Native does not have built-in random generator. The following polyfill works for plain React Native and Expo starting with 39.x.

```javascript
// App.jsx
import 'react-native-get-random-values';
import { View } from 'react-native';
import { useStore, useValue } from 'apps-digest';

import YourStore from './YourStore';

export default function App() {
  const store = useStore(YourStore);
  const value = useValue(store.value);

  return <View>{/* ... */}</View>;
}
```

## Author

- **Marty Roque**
  - GitHub: [@martyroque](https://github.com/martyroque)
  - Twitter: [@lmproque](https://twitter.com/lmproque)

## License

[ISC License](LICENSE)

Copyright © 2023 [Marty Roque](https://github.com/martyroque).
