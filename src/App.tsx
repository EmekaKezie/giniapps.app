// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import "./App.css";
import { Provider } from "react-redux";
import { persistor, store } from "./redux/store";
import { PersistGate } from "redux-persist/integration/react";
import AppRouter from "./router/AppRouter";
import { SnackbarProvider } from "notistack";

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <SnackbarProvider>
          <AppRouter />
        </SnackbarProvider>
      </PersistGate>
    </Provider>
  );
}

export default App;
