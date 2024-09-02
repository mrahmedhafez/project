import { BrowserRouter as Router, Switch } from 'react-router-dom';
import AppRoute from './AppRoute';
import { Chat, Login, NotFound, Register, Password } from 'views';
import Auth from 'Auth';
import React, { useEffect } from 'react';

function App() {
  useEffect(() => {
    Auth.init();
  }, []);
  return (
    <div id='main-container' className='container-fluid'>
      <Router>
        <Switch>
          <AppRoute path="/" exact component={Chat} can={Auth.auth} redirect='/login' />
          <AppRoute path='/password' component={Password} can={Auth.auth} redirect='/login' />
          <AppRoute path="/register" component={Register} can={Auth.guest} redirect='/' />
          <AppRoute path="/Login" component={Login} can={Auth.guest} redirect='/' />
          <AppRoute path="*" component={NotFound} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;