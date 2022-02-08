// import Vue from "vue";
// import App from "./App.vue";
// import router from "./router";
// import AuthPlugin from "./plugins/auth";

// import ApolloClient from "apollo-client";
// import { HttpLink } from "apollo-link-http";
// import { InMemoryCache } from "apollo-cache-inmemory";
// import VueApollo from "vue-apollo";

// Vue.use(AuthPlugin);
// Vue.use(VueApollo);

// Vue.config.productionTip = false;

// const getHeaders = () => {
//   const headers = {};
//   const token = window.localStorage.getItem("apollo-token");
//   if (token) {
//     headers.authorzation = `Bearer ${token}`;
//   }
//   return headers;
// };

// const client = new ApolloClient({
//   link: link,
//   cache: new InMemoryCache({
//     addTypename: true
//   })
// });

// const link = new HttpLink({
//   url: "https://hasura.io/learn/graphql",
//   fetch,
//   headers: getHeaders()
// });

// const apolloProvider = new VueApollo({
//   defaultClient: client
// });

// new Vue({
//   router,
//   apolloProvider,
//   render: h => h(App)
// }).$mount("#app");

import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import AuthPlugin from "./plugins/auth";

import VueApollo from "vue-apollo";

import ApolloClient from "apollo-client";
import { HttpLink } from "apollo-link-http";
import { InMemoryCache } from "apollo-cache-inmemory";
// import { WebSocketLink } from "apollo-link-ws";

Vue.use(AuthPlugin);
Vue.use(VueApollo);

Vue.config.productionTip = false;

const getHeaders = () => {
  const headers = {};
  const token = window.localStorage.getItem("apollo-token");
  if (token) {
    headers.authorization = `Bearer ${token}`;
  }
  return headers;
};

// Create a WebSocket link:
// const link = new WebSocketLink({
//   uri: "wss://hasura.io/learn/graphql",
//   options: {
//     reconnect: true,
//     timeout: 30000,
//     connectionParams: () => {
//       return { headers: getHeaders() };
//     }
//   }
// });

const link = new HttpLink({
  uri: "https://hasura.io/learn/graphql",
  fetch,
  headers: getHeaders()
});

const client = new ApolloClient({
  link: link,
  cache: new InMemoryCache({
    addTypename: true
  })
});

const apolloProvider = new VueApollo({
  defaultClient: client
});

new Vue({
  router,
  apolloProvider,
  render: h => h(App)
}).$mount("#app");
