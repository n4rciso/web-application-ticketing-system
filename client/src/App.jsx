import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './App.css';

import dayjs from 'dayjs';

import { React, useState, useEffect } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { BrowserRouter, Routes, Route, Outlet, Link, useParams, Navigate, useNavigate } from 'react-router-dom';
import API from './API.js';
import { GenericLayout, NotFoundLayout, TableLayout, LoginLayout, AddLayout } from './components/Layout';
import { faHouseMedicalCircleExclamation } from '@fortawesome/free-solid-svg-icons';
import { Tiktok } from 'react-bootstrap-icons';


function App() {
  return (
    <BrowserRouter>
      <AppWithRouter />
    </BrowserRouter>
  );
}

function AppWithRouter() {
  const navigate = useNavigate();

  const [message, setMessage] = useState(null);  // This state contains the error message to show in a toast.
  const [ticketList, setTicketList] = useState([]);  // This state contains the list of tickets.
  const [dirty, setDirty] = useState(true);   // This state is used to force a re-render of the ticket list.
  const [loggedIn, setLoggedIn] = useState(false);   // This state keeps track if the user is currently logged-in.
  const [user, setUser] = useState(null);   // This state contains the user's info.
  const [authToken, setAuthToken] = useState(undefined);  // This state contains the user's auth token.
  const [tokenIsExpired, setTokenIsExpired] = useState(false);  


  /*** Error handler ***/

  /**
   * Simplified version of an error handler used to show error messages in a toast.
   */
  const handleErrors = (err) => {
    let msg = '';
    if (err.error)
      msg = err.error;
    else if (err.errors) {
      if (err.errors[0].msg)
        msg = err.errors[0].msg + " : " + err.errors[0].path;
    } else if (Array.isArray(err))
      msg = err[0].msg + " : " + err[0].path;
    else if (typeof err === "string") msg = String(err);
    else msg = "Unknown Error";
    setMessage(msg); // Only the last error is shown
    console.log(err);
    setTimeout(() => setDirty(true), 2000);
  }



  /*** Authentication handler ***/

  /**
   * On component mount, checks if the user is already authenticated:
   *  - if the user is authenticated, it sets the user info and the login state accordingly
   *  - if the user is not authenticated, it does nothing
   */
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await API.getUserInfo(); // if already logged in
        //console.log("DEBUG: user is logged in only now");
        setLoggedIn(true);
        setUser(user);
        setTokenIsExpired(true);
        //console.log("DEBUG: try to trigger the token generation");
      } catch (err) {
        // user is simply not yet authenticated
      }
    };
    checkAuth();
  }, []); // run only once on component mount


  /*** Token handler ***/
  /**
   * In order to manage the token expiration I define a state tokenIsExpired.
   * When the estimation fails due to the token expiration, the involved component
   * set the tokenIsExpired state to true, this triggers the useEffect that fetches a new token.
   * In this way, the token is renewed only at this stage, and the component can
   * only trigger the token renewal changing the tokenIsExpired state.
   */
  useEffect(() => {
    async function updateAuthToken() {
      // Only logged in users with an expired token need a new token
      if (loggedIn && tokenIsExpired) {
        try {
          const response = await API.getAuthToken();
          const newToken = response.token;
          setAuthToken(newToken);
          setTokenIsExpired(false);
          //console.log("Debug: newToken is set ", newToken);
        } catch (err) {
          console.log("Error: renewToken error ", err);
        }
      }
    }  
    updateAuthToken();
  }, [tokenIsExpired]); 


  /**
     * This function handles the login process setting the user info and the login state accordingly.
     * It requires a username and a password inside a "credentials" object
     */
  const handleLogin = async (credentials) => {
    try {
      const user = await API.logIn(credentials);
      //console.log("DEBUG: user is logged using handle");
      const token = await API.getAuthToken();
      setUser(user);
      setAuthToken(token.token);
      //console.log("DEBUG: handeLogin ", token.token,user);
      setLoggedIn(true);
      setTokenIsExpired(false);

    } catch (err) {
      // necessary to throw the error to be handled and visualized by the login form
      throw err;
    }
  };

  /**
   * This function handles the logout process cleaning up everything 
   * and setting the login state to false.
   */
  const handleLogout = async () => {
    await API.logOut();
    setLoggedIn(false);
    setUser(null);
    setAuthToken(undefined);
    setTokenIsExpired(false);
  };


  /*** Functionality handler ***/

  /**
   * I decided to manage in this section only the handlers relating to the main page therefore:
   *   - adding a new ticket
   *   - modification of one of the main characteristics of the tickets (no blocks) that all can see
   */

  /**
   * After successfully adding a ticket, mark the data as dirty and navigate to the homepage
   */
  function addTicket(ticket) {
    API.addTicket(ticket)
      .then(() => {
        setDirty(true); // force a re-render of the ticket list
        navigate('/'); // navigate from /add to the homepage
      })
      .catch(err => handleErrors(err));
  }

  /** 
 * This function is used to update the state of a ticket
 */
  async function updateStateTicket(ticket) {
    try {
      await API.updateStateTicket(ticket);
      setDirty(true); // force a re-render of the ticket list
    } catch (err) {
      handleErrors(err);
    }
  }

  /** 
   * This function is used to update the category of a ticket
   */
  async function updateCategoryTicket(ticket) {
    try {
      await API.updateCategoryTicket(ticket);
      setDirty(true); // force a re-render of the ticket list
    } catch (err) {
      handleErrors(err);
    }
  }



  // QUESTO VUOL DIRE CHE QUANDO RISPONDO A UN TICKET TUTTI VENGONO RICARICATI
  /**
   * After successfully answering a ticket, mark the data as dirty and navigate to the homepage
   */
  function answerATicket(answer) {
    API.answerATicket(answer)
      .then(() => { setDirty(true); navigate('/'); })
      .catch(err => handleErrors(err));
  }


/**
 * This function is used to handel the estimation of the ticket.
 *  1. Try to get the estimate with the current token
 *  2. If the estimate is received, return it
 *  3. If the estimate is not received, try to renew the token
 *  4. Get the estimate with the new token 
 */
async function handleEstimation(ticket) {
  try {
    //console.log("DEBUG: HandleEstimation with token", authToken, "and ticket");
    const estimation = await API.getEstimation(authToken, ticket);
    //console.log("DEBUG: The estimation ", estimation, "was received");
    return estimation;
  } catch (err) {
    setTokenIsExpired(true);
    console.log("DEBUG: The token",authToken,"is expired", err);
    return null;
  }
}


  return (
    <Container fluid>
      <Routes>
        <Route path="/" element={<GenericLayout loggedIn={loggedIn} user={user} logout={handleLogout}
          message={message} setMessage={setMessage} />} >
          <Route index element={<TableLayout ticketList={ticketList} setTicketList={setTicketList} answerATicket={answerATicket}
            handleErrors={handleErrors} user={user} dirty={dirty} setDirty={setDirty} loggedIn={loggedIn}
            updateStateTicket={updateStateTicket} authToken={authToken} setAuthToken={setAuthToken} updateCategoryTicket={updateCategoryTicket} 
            tokenIsExpired={tokenIsExpired} handleEstimation={handleEstimation} message={message} setMessage={setMessage} 
            />} />
          <Route path="add" element={loggedIn ? <AddLayout addTicket={addTicket} user={user} authToken={authToken}
            setAuthToken={setAuthToken} tokenIsExpired={tokenIsExpired} setTokenIsExpired={setTokenIsExpired}
            handleEstimation={handleEstimation} message={message} setMessage={setMessage}/> : <Navigate replace to='/login' />} />
          <Route path='*' element={<NotFoundLayout />} />
        </Route>
        <Route path="/login" element={!loggedIn ? <LoginLayout login={handleLogin} /> : <Navigate replace to='/' />} />
      </Routes>
    </Container>
  );
}



export default App;
