import React, { useState, useEffect } from 'react';
import { ListGroup, Form, Button, Container, Alert} from 'react-bootstrap';
import API from '../API.js';
import dayjs from 'dayjs';

const TicketDetail = ({ ticketId, dirty, setDirty}) => {
  const [ticketDetails, setTicketDetails] = useState(null);


    useEffect(() => {
        API.getTicketDetails(ticketId)
          .then(ticket => {
            setTicketDetails(ticket);
            setDirty(false);
          })
          .catch(e => {console.error('Error fetching ticket details', e);
          });
      }, [ticketId, dirty]);

  if (!ticketDetails) return <p> </p>;

  return (
    <div style={{ padding: '20px' }}>
      <ListGroup>
        {ticketDetails.map((detail, index) => (
          <ListGroup.Item key={index} style={{ marginBottom: '15px', padding: '20px', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
          <pre style={{ margin: 0, fontSize: '15px' }}>{detail.content}</pre>
            <div style={{ marginTop: '10px', color: 'grey', fontSize: '13px' }}>
              Write by <b><i>{detail.author}</i></b> on <i>{detail.timestamp}</i>
            </div>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </div>
  );
};

const TicketAnswer = ({ticketId, answerATicket, user, dirty, setDirty}) => {
  const [newAnswer, setNewAnswer] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = () => {
      const answer = { content: newAnswer, ticketId: ticketId};

      if (!newAnswer.trim()) {
        setMessage('Must not be empty');
      }
      else{
        answerATicket(answer);
        setDirty(true);
        setNewAnswer('')
        setMessage('');
      }
  };
  
  return (
    <Container className="p-4 my-4 border rounded shadow-sm" style={{ backgroundColor: '#f9f9f9' }}>
      {message ? <Alert variant='danger' onClose={() => setMessage('')} dismissible>{message}</Alert> : false}
      <h3 className="text-secondary mb-4">Answer the ticket</h3>
      <Form.Control as="textarea" value={newAnswer} onChange={(e) => setNewAnswer(e.target.value)} className="mb-3" style={{ height: '100px'}}/>
      <Button variant="primary" onClick={handleSubmit}>Add Block</Button>
    </Container>
  );
};


export {TicketDetail,TicketAnswer};
