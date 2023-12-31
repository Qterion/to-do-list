import React from "react";
import {Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import {Navbar, Nav,} from "react-bootstrap";
export default function RootLayout(){
    const currentPath = window.location.pathname;
    const location = useLocation();
    const navigate = useNavigate ();
  
  const handleLogout = () => {
    // Remove tokens from localStorage
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('accessToken');
    };
    const shouldRenderNavbar = () => {
    // Function to determine whether to render the Navbar
    return !['/login', '/register'].includes(location.pathname);
    
 
    };
    return(
        <div className="root-layout">
            {shouldRenderNavbar() && (
                <header>
                
                <Navbar bg="dark" variant="dark" expand="lg">
                    <Navbar.Brand href="/">
                        <h1>TO-DO</h1>
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="ml-auto">
                       
                        <Nav.Link as={Link} to="/login" onClick={handleLogout}>
                            Logout
                        </Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Navbar>
                </header>
                )}
                <main>
                    <Outlet/>
                </main>
        </div>
    )
}