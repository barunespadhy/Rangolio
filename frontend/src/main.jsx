import React, { Suspense, lazy } from 'react';
import ReactDOM from 'react-dom/client'
import './index.css'
const ViewComponent = lazy(() => 
  import.meta.env.VITE_APP_VIEW_TYPE === 'editableview' 
    ? import('./AppEditable.jsx')
    : import('./App.jsx')
);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ViewComponent />
  </React.StrictMode>,
)