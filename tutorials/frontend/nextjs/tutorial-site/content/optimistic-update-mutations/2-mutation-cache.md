---
title: "Mutation and update cache"
metaTitle: "Apollo client.mutate for GraphQL mutation update | Next.js GraphQL Serverless Tutorial"
metaDescription: "We will use the Apollo useMutation React hook from @apollo/client as an example to modify existing data and update cache locally using readQuery and writeQuery and handle optimisticResponse"
---

import GithubLink from "../../src/GithubLink.js";

Now let's do the integration part. Open `components/Todo/TodoItem.js` and add the following code below the other imports:

```javascript
+ import { gql } from "@apollo/client";
```

Let's define the graphql mutation to update the completed status of the todo

<GithubLink link="https://github.com/hasura/learn-graphql/blob/master/tutorials/frontend/nextjs/app-final/components/Todo/TodoItem.js" text="components/Todo/TodoItem.js" />

```javascript
const TodoItem = ({index, todo}) => {

  const removeTodo = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

+  const TOGGLE_TODO = gql`
+    mutation toggleTodo ($id: Int!, $isCompleted: Boolean!) {
+      update_todos(where: {id: {_eq: $id}}, _set: {is_completed: $isCompleted}) {
+        affected_rows
+      }
+    }
+  `;

  const toggleTodo = () => {};

  return (
    ...
  );
};

export default TodoItem;

```

### Apollo useMutation React hook

We need to use `useMutation` React hook to make the mutation.

```javascript
  import React from 'react';
+ import { useMutation, gql } from "@apollo/client";

  const TodoItem = ({index, todo}) => {
    const removeTodo = (e) => {
      e.preventDefault();
      e.stopPropagation();
    };

    const TOGGLE_TODO = gql`
    mutation toggleTodo($id: Int!, $isCompleted: Boolean!) {
      update_todos(
        where: { id: { _eq: $id } }
        _set: { is_completed: $isCompleted }
      ) {
        affected_rows
      }
    }
  `;

+ const [toggleTodoMutation] = useMutation(TOGGLE_TODO);

  return (
    ...
  );
 };

 export default TodoItem;
```

We already have the onChange handler toggleTodo for the input. Let's update the function to make a use of `toggleTodoMutation` mutate function.

```javascript
  const toggleTodo = () => {
+    toggleTodoMutation({
+      variables: {id: todo.id, isCompleted: !todo.is_completed},
+      optimisticResponse: true,
+    });
  };
```

The above code will just make a mutation, updating the todo's is_completed property in the database.
To update the cache, we will be using the `update` function again to modify the cache. We need to fetch the current list of todos from the cache before modifying it. So let's import the query.

```javascript
+ import {GET_MY_TODOS} from './TodoPrivateList';
```
Now let's add the code for `update` function.

```javascript
  const toggleTodo = () => {
    toggleTodoMutation({
      variables: {id: todo.id, isCompleted: !todo.is_completed},
      optimisticResponse: true,
+      update: (cache) => {
+        const existingTodos = cache.readQuery({ query: GET_MY_TODOS });
+        const newTodos = existingTodos.todos.map(t => {
+          if (t.id === todo.id) {
+            return {...t, is_completed: !t.is_completed};
+          } else {
+            return t;
+          }
+        });
+        cache.writeQuery({
+          query: GET_MY_TODOS,
+          data: {todos: newTodos}
+        });
+      }
    });
  };

```

We are fetching the existing todos from the cache using `cache.readQuery` and updating the is_completed value for the todo that has been updated.

Finally we are writing the updated todo list to the cache using `cache.writeQuery`.
