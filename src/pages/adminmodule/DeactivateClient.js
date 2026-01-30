
import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Card, Nav, Navbar, Tab, Button, Form, Tooltip, Row, Col } from 'react-bootstrap';
import { useHistory } from "react-router-dom";
//redux
import { useSelector, useDispatch } from 'react-redux';
import Table from '../../component/ClientTable';

import * as Yup from 'yup';
import { ErrorMessage, Field, useField, Formik, Form as FForm } from 'formik';
import TextError from '../../component/ErrorText';
import API from "../../util";
import swal from "sweetalert";

const DeactivateClient = () => {
  const history = useHistory();
  const storeState = useSelector((state) => state)
  const userTemplate = useSelector((state) => state.programDetails.userTemplate)
  const dispatch = useDispatch();
  const userStoreState = useSelector((state) => state.user)

  const [deactivateVariable, setDeactivateVariable] = useState(false)
  const formRef = useRef(null);

  const deactivateSchema = Yup.object().shape({
    uic: Yup.string().required('UIC is required'),
  })


  const [clientData, setClientData] = useState([])
  useEffect(() => {
    getClientList()
  }, []);
  const getClientList = () => {
    API.post('adminmodule/getdeactivatepatientdata', { "puid": userTemplate.programuid }).then(res => {
      setClientData(res.data.Data)
    })
  }
  const activeUser = (userData) => {
    console.log(userData, "userData")
    API.post('adminmodule/actdeactpatientcheck', { "puid": userTemplate.programuid, "instanceuid": userData.instanceuid }).then(res => {
      console.log(res, "actdeactpatientcheck")
      if (res.data.Status == 'Inactive' && userData.ClientType == "Contact") {
        let elem = document.createElement("div");
        elem.innerHTML = "Index is deactivated, Please activate Index first."
        swal({
          title: "Alert",
          content: elem,
          icon: "info",
          button: "Close",
        }).then(function () {
          getClientList()
          setDeactivateVariable(false)
        });
      } else {
        API.post('adminmodule/actdeactpatient', { "puid": userTemplate.programuid, "status": "activate", "instanceuid": userData.instanceuid, "uic": "" }).then(res => {
          console.log(res, "actdeactpatient")
          if (res.status == 200) {
            let elem = document.createElement("div");
            elem.innerHTML = "Client Activated"
            swal({
              title: "Success",
              content: elem,
              icon: "success",
              button: "Close",
            }).then(function () {
              getClientList()
              setDeactivateVariable(false)
            });
          }
        })
      }
    })
  }

  return (
    <>
      <div className="customH tableFixHead">
        <Row noGutters>
          <Col lg={9}>
            <Table
              key={Math.random()}
              activeUser={activeUser}
              clientData={clientData}
            />
          </Col>
          <Col lg={3} className="d-flex flex-column p-1">
            <p className='mb-0'><button onClick={(e) => { setDeactivateVariable(true) }} type="button" title="Deactivate Client" className="btn btn-sm addbtn mt-2 mb-2 float-right"> Deactivate Client </button></p>
            {deactivateVariable ?
              <Formik
                innerRef={formRef}
                validationSchema={deactivateSchema}
                initialValues={{
                  uic: ""
                }}
                onSubmit={values => {
                  console.log(values, "values")
                  API.post('adminmodule/actdeactpatient', { "puid": userTemplate.programuid, "status": "deactivate", "instanceuid": "", "uic": values.uic }).then(res => {
                    console.log(res, "actdeactpatient")
                    if (res.status == 200) {
                      let elem = document.createElement("div");
                      elem.innerHTML = "Client Deactivated"
                      swal({
                        title: "Success",
                        content: elem,
                        icon: "success",
                        button: "Close",
                      }).then(function () {
                        getClientList()
                        setDeactivateVariable(false)
                      });
                    }
                  })
                }}
              >
                {({ errors, touched }) => (
                  <FForm className='deactiveUserForm'>
                    <Card>
                      <Card.Header className="regcardheader"> Deactivate Client
                        <span className="closesign" onClick={(e) => { setDeactivateVariable(false) }}><i aria-hidden="true" className="fa fa-times"></i></span>
                      </Card.Header>
                      <Card.Body className="regtabbody">
                        <Form.Group controlId="formBasicEmail">
                          <Field name='uic'>
                            {({ field, meta }) => {
                              return (
                                <>
                                  <Form.Label className="label">UIC</Form.Label>
                                  <div className="formgroup">

                                    <span className="formInput">
                                      <input
                                        placeholder='Enter UIC'
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
                            name="uic"
                          />
                          <Button className="btn addbtn btn-sm  mt-3" type="submit">
                            Deactivate
                          </Button>
                        </Form.Group>
                      </Card.Body>
                    </Card>
                  </FForm>
                )}
              </Formik>
              :
              null
            }
          </Col>
        </Row>
      </div>
    </>
  );
};

export default DeactivateClient;