import dayjs from 'dayjs';

import { useEffect, useState } from 'react';
import { Form, Button, Card, Row, Col } from 'react-bootstrap';
import { Pencil } from 'react-bootstrap-icons';
import { Link } from 'react-router-dom';

const TicketForm = (props) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('inquiry');
  const [description, setDescription] = useState('');
  const [estimation, setEstimation] = useState();
  const [confirmation, setConfirmation] = useState(false);

  useEffect(() => {
    const aysincEst = async () => {
      if (confirmation && !props.tokenIsExpired) {
        try {
          const newTicket = { title, category, description};
          const estimateResult = await props.handleEstimation(newTicket);
          if (props.user.role === 'admin') {
            setEstimation(`${estimateResult.estimation} hours`);
          } else {
            setEstimation(`${estimateResult.estimation} days`);
          }
        } catch (error) {
          console.log('Error fetching estimation due to token expiration');
          //props.setMessage('Token expire and be refreshed');
        }
      }
    }
    aysincEst();
  }, [confirmation, props.tokenIsExpired]);

  /**
   * Function to handle the form submission.
   * It sends the ticket to the server and then it active the confirmation view.
   */
  const handleSubmit = async (event) => {
    event.preventDefault();

    // A set of checks to verify that the form is correctly filled and not manipulated using the browser inspector.
    if (!title.trim() || !category.trim() || !description.trim()) {
      props.setMessage('Please fill all the fields');
    }
    else if (category !== 'inquiry' && category !== 'maintenance' && category !== 'new feature'
      && category !== 'administrative' && category !== 'payment') {
      props.setMessage('Category must be inquiry, maintenance, new feature, administrative or payment');
    }
    else {
      setConfirmation(true);
    }
  }



  const handleConfirm = async () => {
    const newTicket = { title, category, description, ownerId: props.user.id, state: 'open', timestamp: dayjs() };
    props.addTicket(newTicket);
  };

  const handleEdit = () => { setConfirmation(false); };



  return (
    confirmation ?
      <>
        <h1 className="fs-1 fw-bold mb-3">Confirm Details</h1>
        <Card className="mb-4">
          <Card.Body>
            <Card.Text className="fs-5"><b>Title: </b>{title}</Card.Text>
            <Card.Text className="fs-5"><b>Category: </b>{category}</Card.Text>
            {/* I change Card.Text in div in order to eliminate a warnign due to
            nitifigation of <p> and <pre>, as <pre> is use for display newline*/}
            <div className="fs-5"><b>Description: </b> <br /> <pre>{description}</pre></div>
            <Card.Text className="fs-5"><b>Estimation: </b>{estimation}</Card.Text>
          </Card.Body>
        </Card>
        <Row className="justify-content-end">
          <Col xs="auto">
            <Button variant="success" onClick={handleConfirm}>Confirm</Button>
          </Col>
          <Col xs="auto">
            <Button variant="danger" onClick={handleEdit}>Edit</Button>
          </Col>
        </Row>
      </>

      :

      <>
        <div className="d-flex align-items-center">
          <Pencil size={30} />
          <h1 className="mx-2 fs-1 fw-bold">Create Ticket</h1>
        </div>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label className="fs-5"><b>Title</b></Form.Label>
            <Form.Control type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label className="fs-5"><b>Category</b></Form.Label>
            <Form.Control as="select" value={category} onChange={(e) => setCategory(e.target.value)} required>
              <option value="inquiry">inquiry</option>
              <option value="maintenance">maintenance</option>
              <option value="new feature">new feature</option>
              <option value="administrative">administrative</option>
              <option value="payment">payment</option>
            </Form.Control>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label className="fs-5"><b>Description</b></Form.Label>
            <Form.Control as="textarea" value={description} onChange={(e) => setDescription(e.target.value)} required style={{ height: '120px', overflowY: 'hidden' }} />
          </Form.Group>
          <div className="d-grid gap-2 d-md-flex justify-content-md-end">
            <Button className="action-button" variant="primary" type="submit">Save</Button>
            &nbsp;
            <Link to={"/"} >
              <Button className="action-button" variant="danger">Cancel</Button>
            </Link>
          </div>

        </Form>
      </>
  );

}

export { TicketForm };
