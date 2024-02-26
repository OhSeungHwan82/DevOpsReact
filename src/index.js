import React from 'react';
import { createRoot } from 'react-dom/client';
import {BrowserRouter} from 'react-router-dom';
import App from './App';
import './index.css';
import { Provider } from "react-redux";
import store from "./redux/store";
              
                        
const container = document.getElementById('root');
const root = createRoot(container);

// const urlParams = new URLSearchParams(window.location.search);
// const host = urlParams.get('baseHost');

// if (host && host === "air.incar.co.kr") {
//   localStorage.setItem("url", "https://was-dos.incar.co.kr")//https://10.16.16.160
// }else{
//   localStorage.setItem("url", "https://was-test-dos.incar.co.kr")//https://16.16.16.200:9000
// }

//localStorage.setItem("url", "http://16.16.16.200:9000")
//localStorage.setItem("url", "http://127.0.0.1:8000")
//React.StrictMode 콘솔두번출력
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
