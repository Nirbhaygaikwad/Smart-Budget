import React from "react";
import ReactDOM from "react-dom/client";
import {Provider} from 'react-redux'
import {QueryClient, QueryClientProvider} from "@tanstack/react-query"
import {ReactQueryDevtools} from "@tanstack/react-query-devtools";
import App from "./App";
import { store } from "./redux/store/store";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import './index.css';

//! instance of react query 
const client = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <QueryClientProvider client={client}>
        <App />
        <ReactQueryDevtools initialIsOpen={false} />
        <ToastContainer position="top-right" autoClose={3000} />
      </QueryClientProvider>
    </Provider>
  </React.StrictMode>
);
