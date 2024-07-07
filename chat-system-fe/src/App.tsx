import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { persistor, store } from './redux/store';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import ProtectedLayout from './layouts/protected';
import Home from './components/Home';
import { RouteConstants } from './utils/constants/routes';

function App() {

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <div className='bg-black text-white w-screen h-screen'>
            <BrowserRouter>
              <Routes>
                <Route path={RouteConstants.LOGIN} element={<Login />} />
                <Route element={<ProtectedLayout />} >
                  <Route path={RouteConstants.HOME} element={<Home />} />
                </Route>
              </Routes>
            </BrowserRouter>
        </div>
      </PersistGate>
    </Provider>
  )
}

export default App
