import 'bootstrap-icons/font/bootstrap-icons.css';

import { Navbar, Nav, Form, Container} from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import { LoginButton, LogoutButton } from './Auth';

const Navigation = (props) => {

    return (
        <Navbar expand="lg" style={{ background: 'linear-gradient(90deg, rgba(52, 58, 64, 1), rgba(33, 37, 41, 1))' }} variant="dark" className="shadow-sm p-3 mb-3 rounded">
            <Container fluid>
                <Navbar.Brand className="mx-2 fs-3 fw-bold d-flex align-items-center ">
                    <i className="bi bi-chat-dots-fill me-2"></i>Ticketing System
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    {props.user && (
                    <Nav className="me-auto" style={{ marginLeft: '20px', marginTop: '3px'}}>
                            <NavLink to="/add" className="nav-link text-white fs-4">
                                 <i>Open a new ticket</i>
                            </NavLink>
                    </Nav>
                    )}

                    <Nav className="ms-auto d-flex align-items-center">
                        <Navbar.Text className="mx-2 fs-5">
                            {props.user && props.user.username && (
                                <Navbar.Text className="mx-2 fs-6 text-light">
                                    Signed in as: <b>{props.user.username}</b>
                                </Navbar.Text>
                            )}
                        </Navbar.Text>
                        <Form className="mx-2 mt-1">
                            {props.loggedIn ? <LogoutButton logout={props.logout} /> : <LoginButton />}
                        </Form>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export { Navigation };