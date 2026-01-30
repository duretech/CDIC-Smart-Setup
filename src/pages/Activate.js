import React,{useState} from 'react';
import { Button, Form, Nav, Navbar } from 'react-bootstrap';
import { ErrorMessage, Field, Formik, Form as FForm  } from 'formik';
import * as Yup from 'yup';
import {
    Link,
    useHistory
} from "react-router-dom";
import swal from "sweetalert";
import API, { activate } from '../util';
import TextError from '../component/ErrorText';
import imgurl from '../assets/images/imgUrl';

import { useDispatch } from 'react-redux';
import { setLoader } from '../redux/actions/userAction'

const Activate = () => {
    const history = useHistory()
    
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const ActivationSchema = Yup.object().shape({
        email: Yup.string().email('Invalid email').required('Email is required'),
        token: Yup.string().required('Token is required'),
    });

    const onActivationSubmit = values => {
        dispatch(setLoader(true))
        setLoading(true);
        activate("PASTE_YOUR_AUTH_TOKEN_HERE", values)
          .then((res) => {
            if(res.status === 200){
              let elem = document.createElement("div");
              elem.innerHTML = res.data.message;
              swal({
                title: (res.data.status === 'fail' ? "" : "Success"),
                content: elem,
                icon: (res.data.status === 'fail' ? "error" : "success"),
                button: "Close",
              }).then(function() {
                if(res.data.status !== 'fail')
                    history.push('/')
            }); 
            }
            dispatch(setLoader(false))
            setLoading(false)
          })
          .catch((error) => {
            dispatch(setLoader(false))
            setLoading(false)
            swal({
              title: "Error",
              text: "Activation error",
              icon: "error",
              button: "Close",
            });
          });
    }
    return (
        <div>
            <div>
                <Navbar className="navbg" expand="lg">
                    <Navbar.Brand href="#home">
                        {/* <img className="endLogo" alt='logo' src={imgurl.endlogo.default} /> */}
                        <span className="ml-2">Smart-Setup</span>
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="ml-auto pr-4 mr-1">
                            <Nav.Link ><Link className="navLink" to="/">Login</Link></Nav.Link>
                            <Nav.Link ><Link className="navLink" to="/Register">Register</Link></Nav.Link>
                            <Nav.Link ><Link className="navLink" to="/Activate">Activate Account</Link></Nav.Link>
                        </Nav>

                    </Navbar.Collapse>
                </Navbar>
            </div>
            <div className="mainContentLogin pt-5">
                <div className="activatemain">
                    <div className="activatecontent">
                        <Formik
                            initialValues={{
                                email: '',
                                token: '',
                            }}
                            validationSchema={ActivationSchema}
                            onSubmit={values => {
                                //console.log(values)
                                onActivationSubmit(values)
                            }}
                            >
                            {({ errors, touched }) => (
                                <FForm>
                                    <Form.Group controlId="formBasicEmail">
                                        <Field name='email'>
                                            {({ field, meta }) => {
                                                return (
                                                <>
                                                    <Form.Label className="label">Email address</Form.Label>
                                                    <div className="formgroup">
                                                        
                                                        <span className="formInput">
                                                            <input
                                                                placeholder='Enter email'
                                                                type='text'
                                                                className='form-control'
                                                                {...field}
                                                                
                                                            />
                                                        </span>
                                                    </div>
                                                </>
                                                )
                                            }}
                                        </Field>
                                        <ErrorMessage
                                            component={TextError}
                                            name="email"
                                        />
                                    </Form.Group>

                                    <Form.Group controlId="formBasicPassword">
                                        <Field name='token'>
                                            {({ field, meta }) => {
                                                return (
                                                <>
                                                    <Form.Label className="label">Token</Form.Label>
                                                    <div className="formgroup">
                                                        <span className="formInput">
                                                            <input
                                                                placeholder='Enter token'
                                                                type='text'
                                                                className='form-control'
                                                                {...field}
                                                                
                                                            />
                                                        </span>
                                                    </div>
                                                    
                                                </>
                                                )
                                            }}
                                        </Field>
                                        <ErrorMessage
                                            component={TextError}
                                            name="token"
                                        />

                                    </Form.Group>
                                    <div className="activate">
                                        <Button className="activatebtn" diasbled={loading} variant="primary" type="submit">
                                        Activate
                                        </Button>
                                    </div>
                                    
                                </FForm>
                            )}
                        </Formik>
                    </div>

                </div>
            </div>
            <div className="footer">
                <div className="row">
                    <div className="col-6">
                        <p className="footext">Powered by  <img alt='durelogo' className="fooimg" src={imgurl.durelogo.default} /></p>  </div>
                    <div className="col-6">
                        <div className="widthMaxContent ml-auto pt-2">
                            <p className="footextcopy">Copyright © 2020. All rights reserved</p></div>
                    </div>
                </div>
            </div>
        </div>


    );


};

export default Activate;