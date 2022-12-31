import React from 'react'
import logo from '../../assets/basmaty-logo.png'
import { useNavigate } from 'react-router-dom'

function Navbar() {

    const nav = useNavigate()

    const menu = ["Home", "Customers", "Admin", "Services", "Salons", "Branches", "Offers","Notifications","Reservations"]
    //Activate different sections of dashboard and navigate between different pages
    const handleClick = event => {
        let x = document.getElementsByTagName("span")
        for (let i = 1; i < x.length; i++) {
            x[i].removeAttribute("class")
        }
        event.target.setAttribute('class', 'active');
        let z = event.target.attributes.route.value.toLowerCase()
        nav(`/${z}`)
    }

    return (
        <>
            <nav className="navbar fixed-top" style={{ backgroundColor: 'rgb(236, 236, 236)', boxShadow: '1px 1px 1px 1px lightgray' }}>
                <div className="container-fluid d-flex justify-content-between">
                    <div className="d-flex justify-content-start gap-4" style={{ width: '40%' }}>
                        <button className="navbar-toggler" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasDarkNavbar" aria-controls="offcanvasDarkNavbar">
                            <span className="navbar-toggler-icon" />
                        </button>
                        <div className="d-flex justify-content-end">
                            <div className="accordion" id="adminAccordion">
                                <div className="accordion-item me-3">
                                    <button className="navbar-toggler py-2" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne" style={{ backgroundColor: 'rgb(236, 236, 236)' }}>
                                        <i className="bx bx-user fs-4" /><i className="bx bx-chevron-right fs-4" />
                                    </button>
                                </div>
                            </div>
                            <div id="collapseOne" className="accordion-collapse collapse show me-3" aria-labelledby="headingOne" data-bs-parent="#adminAccordion">
                                <div className="accordion-body d-flex gap-4">
                                    <div className="d-flex flex-column text-center">
                                        <small className="fw-bold">Mohamed Khaleel</small>
                                        <small>admin@admin.com</small>
                                    </div>
                                    <button className="btn btn-outline-dark"><i className="bx bx-log-out" /> Log Out</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="text-center align-items-center pb-3" style={{ height: 'fit-content' }}>
                        <div style={{ height: '2rem' }}>
                            <img src={logo} alt="basmaty" style={{ width: '50%' }} />
                        </div>
                    </div>
                    <div className="navbar-brand fw-bold ps-3 text-end" style={{ width: '40%' }}>Hello, Mohamed</div>
                    <div className="offcanvas offcanvas-start " tabIndex={-1} id="offcanvasDarkNavbar" aria-labelledby="offcanvasDarkNavbarLabel" style={{ backgroundColor: 'rgb(236, 236, 236)' }}>
                        <div className="offcanvas-header">
                            <h5 className="offcanvas-title" id="offcanvasDarkNavbarLabel">
                                <div className="text-center fs-2 d-flex justify-content-center align-items-center" style={{ color: '#C13F55', marginTop: '15%', marginBottom: '15%' }}>
                                    <div style={{ height: '4rem' }}>
                                        <img src={logo} alt="basmaty" style={{ width: '75%' }} />
                                    </div>
                                    <div>
                                        <div style={{ lineHeight: '22px' }}>Basmaty</div>
                                        <div style={{ lineHeight: '22px' }}>بـــسمتــي</div>
                                    </div>
                                </div>
                            </h5>
                        </div>
                        <div className="offcanvas-body">
                            <ul className="text-secondary navbar-nav justify-content-end flex-grow-1 ps-3" style={{ listStyle: 'none' }}>
                                {menu.map((item, index) => {
                                    return (
                                        <li key={index}>
                                            <span onClick={handleClick} route={item} data-bs-dismiss="offcanvas" aria-label="Close">{item}</span>
                                        </li>
                                    )
                                })}
                            </ul>
                        </div>
                    </div>
                </div>
            </nav>
        </>
    )
}

export default Navbar