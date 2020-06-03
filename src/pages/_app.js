import ApolloClient from "apollo-boost";
import { ApolloProvider } from "@apollo/react-hooks";
import "../styles/main.scss";

const client = new ApolloClient({
  uri: "http://localhost:3000/graphql",
});

// This default export is required in a new `pages/_app.js` file.
export default function MyApp({ Component, pageProps }) {
  return (
    <ApolloProvider client={client}>
      <Component {...pageProps} />
    </ApolloProvider>
  );
}
