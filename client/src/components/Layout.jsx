
import { Row, Col, Button, Alert} from 'react-bootstrap';
import { Outlet, Link, useParams, Navigate } from 'react-router-dom';
import { React, useState, useEffect } from 'react';
import { TicketList } from './TicketLibrary';
import { Navigation } from './Navigation';
import { LoginForm } from './Auth';
import { TicketForm } from './TicketAdd.jsx';

import API from '../API.js';


function NotFoundLayout(props) {
  return (
    <>
      <h2>This route is not valid!</h2>
      <Link to="/">
        <Button variant="primary">Go back to the main page!</Button>
      </Link>
    </>
  );
}

function LoginLayout(props) {
  return (
    <Row>
      <Col>
        <LoginForm login={props.login} />
      </Col>
    </Row>
  );
}

function AddLayout(props) {
  return (
    <TicketForm addTicket={props.addTicket} user={props.user} handleEstimation={props.handleEstimation}
                tokenIsExpired={props.tokenIsExpired} setTokenIsExpired={props.setTokenIsExpired} 
                message={props.message} setMessage={props.setMessage}/>
  );
}

// Layout di tutti i ticket
function TableLayout(props) {

  useEffect(() => {
    if (props.dirty) {
      API.getTickets()
        .then(tickets => {
          props.setTicketList(tickets);
          props.setDirty(false);
        })
        .catch(e => { props.handleErrors(e); });
    }
  }, [props.dirty]);


  return (
    <>
      <TicketList ticketList={props.ticketList} user={props.user} answerATicket={props.answerATicket} handleErrors={props.handleErrors}
                  dirty={props.dirty} setDirty={props.setDirty} updateStateTicket={props.updateStateTicket} loggedIn={props.loggedIn}
                  authToken={props.authToken} setAuthToken={props.setAuthToken} updateCategoryTicket={props.updateCategoryTicket}
                  tokenIsExpired={props.tokenIsExpired} handleEstimation={props.handleEstimation} message={props.message} setMessage={props.setMessage} />
    </>
  );
}

function GenericLayout(props) {
  return (
    <>
      <Row>
        <Col>
          <Navigation loggedIn={props.loggedIn} user={props.user} logout={props.logout} />
        </Col>
      </Row>
      <Row className="justify-content-md-center">
        <Col xs ={10} md={10}>
        {props.message ? <Alert className='my-1' onClose={() => props.setMessage('')} variant='danger' dismissible>
          {props.message}</Alert> : null}
        </Col>
      </Row>

      <Row className="justify-content-md-center">
        <Col xs ={10} md={10}>
          <Outlet />
        </Col>
      </Row>
    </>
  );
}

export { GenericLayout, NotFoundLayout, TableLayout, LoginLayout, AddLayout };