/**
 * This component represents the list of tickets.
 *
 * The approach used consists of a list of all tickets called TicketList
 * the elements of this list are represented by TicketItem.
 *
 * Each ticketItem contains the main information of the ticket itself (no blocks)
 * - main information are receipts with props.ticketList:
 * - title, status, date, user who opened the ticket
 * - estimation: ticket estimation (only for admin) via handleEstimation (for each ticket)
 *
 * 
 * Furthermore, thanks to the TicketDetail, TicketEdit components it is possible to:
 * - TicketDetail: 
 *    - view ticket details (such as descriptions and responses, generic blocks)
 *    - reply to a specific ticket
 * - TicketEdit: edit the status and category of the ticket
 *
 */

// Core imports
import React, { useEffect } from 'react';
import { ListGroup, Badge, Button} from 'react-bootstrap';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';

// Local imports
import { TicketDetail, TicketAnswer } from './TicketDetail';
import { TicketEdit } from './TicketEdit';

/** 
 * This function is used to render the list of tickets
 */
function TicketList(props) {
  return (
    <ListGroup>
      {props.ticketList.map((ticket) => <TicketItem ticketData={ticket} key={ticket.id} user={props.user}
        answerATicket={props.answerATicket} loggedIn={props.loggedIn}
        updateStateTicket={props.updateStateTicket} handleErrors={props.handleErrors}
        authToken={props.authToken} tokenIsExpired={props.tokenIsExpired} dirty={props.dirty} handleEstimation={props.handleEstimation}
        updateCategoryTicket={props.updateCategoryTicket} setMessage={props.setMessage} message={props.message}
      />)}
    </ListGroup>
  );
}

const TicketItem = (props) => {
  const [isOpen, setIsOpen] = useState(false); // This state is used to toggle the visibility of the ticket details.
  const [isEdit, setIsEdit] = useState(false);  // This state is used to toggle the visibility of the ticket edit form.
  const [isAnswer, setIsAnswer] = useState(false);  // This state is used to toggle the visibility of the ticket answer form.
  const [dirtyBlock, setDirtyBlock] = useState(false);  // This state is used to force a re-render of the ticket details.
  const [estimation, setEstimation] = useState(null); // This state contains the estimation of the ticket.

  const toggleDetail = () => setIsOpen(!isOpen);
  const toggleEdit = () => setIsEdit(!isEdit);
  const toggleAnswer = () => setIsAnswer(!isAnswer);

  // This function is used to update the state of the ticket. 
  // Only the owner of the ticket can use it.
  const updateStateTicket = () => {
    if (props.ticketData.state === 'open') {
      const updatedTicketState = { ...props.ticketData, state: 'closed' };
      props.updateStateTicket(updatedTicketState);
    }
  }

  /**
   * 
   */
  useEffect(() => {
    const aysincEst = async () => {
      if (props.loggedIn && props.user.role === 'admin' && !props.tokenIsExpired) {
        try {
          const estimateResult = await props.handleEstimation(props.ticketData);
          setEstimation(estimateResult.estimation);
          //console.log("DEBUG: Estimation is", estimateResult);
        } catch (error) {
          //console.log("Error: token",props.authToken,"is expired");
          // We don't set a message to be printed to the user, as authToken is refreshed automaticly
        }
      }
    }
    aysincEst();
  }, [props.dirty, props.tokenIsExpired]);


  // Used to get the badge variant based on the ticket state.

  function getStateBadge(state) {
    let variant;
    switch (state) {
      case 'open':
        variant = 'secondary';
        break;
      case 'closed':
        variant = 'dark';
        break;
      default:
        variant = 'secondary';
    }
    return <Badge className="fs-6" bg={variant}>{state}</Badge>;
  }

  function getCategoryBadge(category) {
    let variant;
    switch (category) {
      case 'inquiry':
        variant = 'primary';
        break;
      case 'maintenance':
        variant = 'warning';
        break;
      case 'new feature':
        variant = 'success';
        break;
      case 'administrative':
        variant = 'info';
        break;
      case 'payment':
        variant = 'danger';
        break;
      default:
        variant = 'secondary';
    }
    return <Badge className="fs-6" bg={variant}>{category}</Badge>;
  }



  return (
    <div style={{ padding: '10px' }}>
      <ListGroup.Item className="d-flex flex-column" style={{ borderRadius: '10px', padding: '20px' }}>
        <div className="d-flex justify-content-between align-items-center">
          {/* This section is for the ticket title, state, category */}
          <div>

            <div style={{ display: 'flex', alignItems: 'center' }}>
              <b><p style={{ margin: 0, fontSize: '17px', marginRight: '10px' }}>{props.ticketData.title}</p></b>
              {getCategoryBadge(props.ticketData.category)}
              &nbsp;&nbsp;
              {getStateBadge(props.ticketData.state)}
            </div>

            <div style={{ marginTop: '5px', color: 'grey', fontSize: '16px' }}>
              Opened by <b><i>{props.ticketData.ownerUsername}</i></b> on <i>{props.ticketData.timestamp}</i>
            </div>

            {props.loggedIn && props.user.role === "admin" && props.authToken && (
              <div style={{ marginTop: '5px', color: 'grey', fontSize: '16px' }}>
                Estimation: <i><b>{estimation}</b> hours</i>
              </div>
            )}

          </div>

          {/* Buttons aligned to the left, adjusting visibility and position dynamically */}
          <div>
            {props.loggedIn && (
              <button onClick={toggleDetail} style={{ background: "none", border: "none", cursor: 'pointer', marginRight: '10px' }}>
                <FontAwesomeIcon icon={isOpen ? faChevronUp : faChevronDown} />
              </button>
            )}
            {props.loggedIn && props.user.role === 'basic' && props.ticketData.state === 'open' && props.user.id === props.ticketData.ownerId && (
              <Button variant="danger" onClick={updateStateTicket} style={{ marginRight: '10px' }}>Close</Button>
            )}
            {props.loggedIn && props.user.role === 'admin' && (
              <Button variant="warning" onClick={toggleEdit}>Edit</Button>
            )}
          </div>

        </div>

        {/* Expandable detail and answer sections */}

        {props.loggedIn && (isOpen) && 
          (props.ticketData.state === 'open' ? 
            ( <>
                <TicketDetail ticketId={props.ticketData.id} dirty={dirtyBlock} setDirty={setDirtyBlock}/>
                <TicketAnswer ticketId={props.ticketData.id} answerATicket={props.answerATicket} user={props.user} dirty={dirtyBlock} setDirty={setDirtyBlock} />
              </>)
            :
            (<TicketDetail ticketId={props.ticketData.id} dirty={dirtyBlock} setDirty={setDirtyBlock}/>)
           )}



        {props.loggedIn && isEdit && <TicketEdit ticketData={props.ticketData} updateStateTicket={props.updateStateTicket} updateCategoryTicket={props.updateCategoryTicket} />}

      </ListGroup.Item>
    </div>
  );
};

export { TicketList };
