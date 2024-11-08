import React from 'react';
import ReactDOM from 'react-dom/client';
import * as serviceWorker from './serviceWorker'; 
import reportWebVitals from './reportWebVitals';
import App from './App';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
serviceWorker.register(); 

reportWebVitals();
