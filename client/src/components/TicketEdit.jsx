/**
 * This section is visible only to admins or users who are owners of the ticket
 */


import React, { useState } from 'react';
import { Form, Button, Alert, ButtonGroup, Container} from 'react-bootstrap';

const TicketEdit = (props) => {
    const [state, setState] = useState(props.ticketData.state);
    const [category, setCategory] = useState(props.ticketData.category);
    const [errorMsg, setErrorMsg] = useState(''); // This state is used to display error messages in the form.

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (state !== 'open' && state !== 'closed') {
            setErrorMsg('State must be open or closed');
        }
        else if (category !== 'inquiry' && category !== 'maintenance' && category !== 'new feature'
            && category !== 'administrative' && category !== 'payment') {
            setErrorMsg('Category must be inquiry, maintenance, new feature, administrative or payment');
        }
        else {
            setErrorMsg('');
            try {
                const updatedTicketState = { ...props.ticketData, state: state };
                await props.updateStateTicket(updatedTicketState);

                const updatedTicketCategory = { ...updatedTicketState, category: category };
                await props.updateCategoryTicket(updatedTicketCategory);

            } catch (error) {
                setErrorMsg('Failed to update ticket. Please try again.');
            }
        }
    }

    return (
        
        <Container className="p-4 my-4 border rounded shadow-sm" style={{ backgroundColor: '#f9f9f9' }}>
            <h3 className="text-warning mb-4">Edit the Ticket</h3>
            {errorMsg ? <Alert variant='danger' onClose={() => setErrorMsg('')} dismissible>{errorMsg}</Alert> : false}
            <Form onSubmit={handleSubmit} className="d-flex align-items-center">
                <Form.Group className="me-2 flex-grow-1">
                    <Form.Control as="select" value={category} onChange={(e) => setCategory(e.target.value)} required>
                        <option value="inquiry">Inquiry</option>
                        <option value="maintenance">Maintenance</option>
                        <option value="new feature">New feature</option>
                        <option value="administrative">Administrative</option>
                        <option value="payment">Payment</option>
                    </Form.Control>
                </Form.Group>
                &nbsp;&nbsp;&nbsp;
                <ButtonGroup className="me-2">
                    <Button variant={state === 'open' ? 'success' : 'light'}  onClick={() => setState('open')}><i className="bi bi-unlock-fill"></i>Open</Button>
                    <Button variant={state === 'closed' ? 'danger' : 'light'}  onClick={() => setState('closed')}><i className="bi bi-lock-fill"></i>Closed</Button>
                </ButtonGroup>
                &nbsp;&nbsp;&nbsp;
                <Button type="submit" variant="primary">Submit</Button>
            </Form>
        </Container>
    );
};
export { TicketEdit };

