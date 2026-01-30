import { Nav, Navbar } from 'react-bootstrap'

const Header = (props) => {
    return (
        <Navbar expand="lg">
            <button type="button" onClick={() => props.toggleSidebar()} id="sidebarCollapse" className="btn btn-info hammenu">
                <i data-v-c3854e32="" className="fas fa-bars"></i>
            </button>
            <Navbar.Brand className="navTitle" href="#home">Prevent TB</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="ml-auto">
                    <div >
                        <span className="name">Joy Joyce</span><br></br>
                        <span>joyce@mailinator.com</span>
                    </div>
                    <button className="btn btn-sign"><i className="fas fa-sign-out-alt fa-2x pull-right"></i></button>

                </Nav>

            </Navbar.Collapse>
        </Navbar>
    )
}

export default Header