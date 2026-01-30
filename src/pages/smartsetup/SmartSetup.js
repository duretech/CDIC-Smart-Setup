import react from 'react'
import { Card, Nav, Navbar, Button, Form, Table, Tabs, Tab, Accordion } from 'react-bootstrap';


const SmartSetup = () => {
    return (
        <div className="smart-setup-wrapper">
            <div className="row">
                <div className="col-12">
                    <div className="form-wizard">
                        <Card>
                            <Card.Header className="programHeader" as="h5">SMART SETUP</Card.Header>
                            <Card.Body>


                                <ul className="nav nav-pills mb-3 arrow-steps clearfix" id="pills-tab" role="tablist">
                                    <li className="nav-item step " role="presentation">
                                        <a className="nav-link " id="pills-home-tab" data-bs-toggle="pill" data-bs-target="#pills-home" type="a" role="tab" aria-controls="pills-home" aria-selected="true">Program</a>
                                    </li>
                                    <li className="nav-item step current" role="presentation">
                                        <a className="nav-link active" id="pills-profile-tab" data-bs-toggle="pill" data-bs-target="#pills-profile" type="a" role="tab" aria-controls="pills-profile" aria-selected="false">Registration</a>
                                    </li>
                                    <li className="nav-item step " role="presentation">
                                        <a className="nav-link " id="pills-contact-tab" data-bs-toggle="pill" data-bs-target="#pills-contact" type="a" role="tab" aria-controls="pills-contact" aria-selected="false">Forms</a>
                                    </li>
                                    <li className="nav-item step " role="presentation">
                                        <a className="nav-link  " id="pills-contact-tab" data-bs-toggle="pill" data-bs-target="#pills-contact" type="a" role="tab" aria-controls="pills-contact" aria-selected="false">Alerts</a>
                                    </li>
                                    <li className="nav-item step " role="presentation">
                                        <a className="nav-link " id="pills-contact-tab" data-bs-toggle="pill" data-bs-target="#pills-contact" type="a" role="tab" aria-controls="pills-contact" aria-selected="false">Workflow</a>
                                    </li>
                                </ul>
                                <div className="tab-content" id="pills-tabContent">
                                    <div className="tab-pane fade " id="pills-home" role="tabpanel" aria-labelledby="pills-home-tab">
                                        <div className="textbtns">
                                            <span><Button className="testbtn" >Test TBI Generic</Button></span>
                                            <span><Button className="nextbtn ml-2" >Next</Button></span>
                                        </div>
                                        <div className="programTitle"><h6>Program Details</h6></div>

                                        <Form className="proform">
                                            <div className="row">
                                                <div className="col-6">
                                                    <Form.Group controlId="formBasicEmail">
                                                        <Form.Label>*Program Name</Form.Label>
                                                        <Form.Control type="text" placeholder="Prevent TB" />

                                                    </Form.Group>
                                                </div>
                                                <div className="col-6">
                                                    <Form.Group controlId="formBasicPassword">
                                                        <Form.Label>*App Name</Form.Label>
                                                        <Form.Control type="text" placeholder="Prevent TB" />
                                                    </Form.Group>
                                                </div>
                                                <div className="col-6">
                                                    <Form.Group controlId="formBasicPassword">
                                                        <Form.Label>Program Description</Form.Label>
                                                        <Form.Control as="textarea" rows={4} />
                                                    </Form.Group>
                                                </div>
                                                <div className="col-6">
                                                    <Form.Group controlId="formBasicPassword">
                                                        <Form.Label>Standard Disclaimer, if any</Form.Label>
                                                        <Form.Control as="textarea" rows={4} >By downloading the WHO Global Prevent TB mobile app (the “Application”), you - as user of the Application - agree to accept the terms of use, copyright notice and the disclaimers here below: In any use of this work, there should be no suggestion that WHO endorses any specific organization, products or services. The use of the WHO logo is not permitted. If you adapt the work, then you must license your work under the same or equivalent Creative Commons license. If you create a translation of this work, you should add the following disclaimer along with the suggested citation: “This translation was not created by the World Health Organization (WHO). WHO is not responsible for the content or accuracy of this translation? The original English edition shall be the binding and authentic edition”.Any mediation relating to disputes arising under the license shall be conducted in accordance with the mediation rules of the World Intellectual Property Organization.General disclaimers: The mention of specific companies or of certain manufacturers’ products does not imply that they are endorsed or recommended by the World Health Organization in preference to others of a similar nature that are not mentioned.The World Health Organization does not warrant that the information contained on this Application is complete and correct. The Organization shall not be liable for any damages incurred as a result of use of the data or programs.The generic Prevent TB platform is made available to the countries for training, adapting to country specific needs and testing in the country ecosystem. This instance and environment should not be used for capturing real patient data. For actual implementation and rolling out of this platform beyond testing, we request the countries to contact us for supporting country program specific roll-out.</Form.Control>
                                                    </Form.Group>
                                                </div>
                                                <div className="col-6">
                                                    <Form.Group controlId="formBasicPassword">
                                                        <Form.Label>Select Languages</Form.Label>
                                                        <Form.Control as="select">
                                                            <option>1</option>
                                                            <option>2</option>
                                                            <option>3</option>
                                                            <option>4</option>
                                                            <option>5</option>
                                                        </Form.Control>
                                                    </Form.Group>
                                                </div>
                                                <div className="col-6">
                                                    <Form.Group controlId="formBasicPassword">
                                                        <Form.Label>* Select Country</Form.Label>
                                                        <Form.Control as="select">
                                                            <option>Albanaia</option>
                                                            <option>India</option>
                                                            <option>China</option>
                                                            <option>Japan</option>
                                                            <option>Uk</option>
                                                        </Form.Control>
                                                    </Form.Group>
                                                </div>
                                                <div className="col-6">
                                                    <div className="row">
                                                        <div className="col-4">Select Application Icon</div>
                                                        <div className="col-5">
                                                          
                                                                    <i className="far fa-images"></i>
                                                            <span>Update Icon</span>
                                                        </div>

                                                    </div>

                                                </div>
                                            </div>
                                        </Form>
                                        <div className="textbtns">
                                            <span><Button className="testbtn" >Test TBI Generic</Button></span>
                                            <span><Button className="nextbtn ml-2" >Next</Button></span>
                                        </div>




                                    </div>
                                    <div className="tab-pane fade show active" id="pills-profile" role="tabpanel" aria-labelledby="pills-profile-tab">
                                        <div>
                                            <div className="row pt-1">
                                                <div className="col-12 bnBtn">
                                                    <button tabIndex="-1" type="button" className="btn wizard-btnb  ml-3" >Back</button>
                                                    <button tabIndex="-1" type="button" className="btn wizard-btnn  mr-3">Next
                                                            </button>
                                                </div>
                                            </div>
                                            <div className="row mt-3">
                                                <div className="col-8">
                                                    <Card className="regcard">
                                                        <Card.Header className="regcardheader">Registration
                                                                    <span title="Add Question" className="addsign"><i aria-hidden="true" className="fa fa-plus"></i></span>
                                                        </Card.Header>
                                                        <Card.Body className="regcardbody">

                                                            <div className="table-responsive">
                                                                <table className="table ss table-hover" id="programserviceTBL">
                                                                    <thead >
                                                                        <tr >
                                                                            <th width="30%">Questions</th>
                                                                            <th >Type</th>
                                                                            <th >Mandatory</th>
                                                                            <th >Searchable</th>
                                                                            <th className="text-right">Actions</th>
                                                                            <th className="text-right">Sequence</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        <tr className=""><td >Client Type</td><td className="texttablestyle">OPTIONSET</td><td className="texttablestyle">Yes</td><td className="texttablestyle"><input type="checkbox" className="big-checkbox" /></td><td className="td-actions text-right"><button type="button" title="Edit Question" className="btn btn-info"><i className="fas fa-pencil-alt"></i></button></td><td className="text-right sequence-column"><span title="Move Up"><i className="fas fa-long-arrow-alt-up"></i></span><span title="Move Down"><i className="fas fa-long-arrow-alt-down"></i></span></td></tr>

                                                                        <tr className=""><td >Please specify</td><td className="texttablestyle">CHECKBOX</td><td className="texttablestyle">No</td><td className="texttablestyle"><input type="checkbox" className="big-checkbox" /></td><td className="td-actions text-right"><button type="button" title="Edit Question" className="btn btn-info"><i className="fas fa-pencil-alt"></i></button></td><td className="text-right sequence-column"><span title="Move Up"><i className="fas fa-long-arrow-alt-up"></i></span><span title="Move Down"><i className="fas fa-long-arrow-alt-down"></i></span></td></tr>

                                                                        <tr className=""><td >Given Name</td><td className="texttablestyle">TEXT</td><td className="texttablestyle">Yes</td><td className="texttablestyle"><input type="checkbox" checked="checked" className="big-checkbox" /></td><td className="td-actions text-right"><button type="button" title="Edit Question" className="btn btn-info"><i className="fas fa-pencil-alt"></i></button></td><td className="text-right sequence-column"><span title="Move Up"><i className="fas fa-long-arrow-alt-up"></i></span><span title="Move Down"><i className="fas fa-long-arrow-alt-down"></i></span></td></tr>

                                                                        <tr className=""><td >Family Name</td><td className="texttablestyle">TEXT</td><td className="texttablestyle">Yes</td><td className="texttablestyle"><input type="checkbox" className="big-checkbox" /></td><td className="td-actions text-right"><button type="button" title="Edit Question" className="btn btn-info"><i className="fas fa-pencil-alt"></i></button></td><td className="text-right sequence-column"><span title="Move Up"><i className="fas fa-long-arrow-alt-up"></i></span><span title="Move Down"><i className="fas fa-long-arrow-alt-down"></i></span></td></tr>

                                                                        <tr className=""><td >Date of Birth</td><td className="texttablestyle">DATE</td><td className="texttablestyle">Yes</td><td className="texttablestyle"><input type="checkbox" className="big-checkbox" /></td><td className="td-actions text-right"><button type="button" title="Edit Question" className="btn btn-info"><i className="fas fa-pencil-alt"></i></button></td><td className="text-right sequence-column"><span title="Move Up"><i className="fas fa-long-arrow-alt-up"></i></span><span title="Move Down"><i className="fas fa-long-arrow-alt-down"></i></span></td></tr>

                                                                        <tr className=""><td >Age</td><td className="texttablestyle">NUMBER</td><td className="texttablestyle">Yes</td><td className="texttablestyle"><input type="checkbox" checked="checked" /></td><td className="td-actions text-right"><button type="button" title="Edit Question" className="btn btn-info"><i className="fas fa-pencil-alt"></i></button></td><td className="text-right sequence-column"><span title="Move Up"><i className="fas fa-long-arrow-alt-up"></i></span><span title="Move Down"><i className="fas fa-long-arrow-alt-down"></i></span></td></tr>

                                                                        <tr className="disabled"><td >Gender</td><td className="texttablestyle">OPTIONSET</td><td className="texttablestyle">Yes</td><td className="texttablestyle"><input type="checkbox" checked="checked" /></td><td className="td-actions text-right"><button type="button" title="Edit Question" className="btn btn-info undisabled"><i className="fas fa-pencil-alt"></i></button></td><td className="text-right sequence-column"><span title="Move Up"><i className="fas fa-long-arrow-alt-up"></i></span><span title="Move Down"><i className="fas fa-long-arrow-alt-down"></i></span></td></tr>

                                                                        <tr className=""><td >Number of members in the household</td><td className="texttablestyle">NUMBER</td><td className="texttablestyle">No</td><td className="texttablestyle"><input type="checkbox" /></td><td className="td-actions text-right"><button type="button" title="Edit Question" className="btn btn-info"><i className="fas fa-pencil-alt"></i></button></td><td className="text-right sequence-column"><span title="Move Up"><i className="fas fa-long-arrow-alt-up"></i></span><span title="Move Down"><i className="fas fa-long-arrow-alt-down"></i></span></td></tr>

                                                                        <tr className=""><td >Phone Number (Primary)</td><td className="texttablestyle">NUMBER</td><td className="texttablestyle">Yes</td><td className="texttablestyle"><input type="checkbox" /></td><td className="td-actions text-right"><button type="button" title="Edit Question" className="btn btn-info"><i className="fas fa-pencil-alt"></i></button><button title="Delete Question" type="button" className="btn btn-danger"><i className="far fa-trash-alt"></i></button></td><td className="text-right sequence-column"><span title="Move Up"><i className="fas fa-long-arrow-alt-up"></i></span><span title="Move Down"><i className="fas fa-long-arrow-alt-down"></i></span></td></tr>

                                                                        <tr className=""><td >Phone Number (secondary)</td><td className="texttablestyle">NUMBER</td><td className="texttablestyle">No</td><td className="texttablestyle"><input type="checkbox" /></td><td className="td-actions text-right"><button type="button" title="Edit Question" className="btn btn-info"><i className="fas fa-pencil-alt"></i></button></td><td className="text-right sequence-column"><span title="Move Up"><i className="fas fa-long-arrow-alt-up"></i></span><span title="Move Down"><i className="fas fa-long-arrow-alt-down"></i></span></td></tr>

                                                                        <tr className=""><td >Address</td><td className="texttablestyle">TEXT</td><td className="texttablestyle">Yes</td><td className="texttablestyle"><input type="checkbox" /></td><td className="td-actions text-right"><button type="button" title="Edit Question" className="btn btn-info"><i className="fas fa-pencil-alt"></i></button></td><td className="text-right sequence-column"><span title="Move Up"><i className="fas fa-long-arrow-alt-up"></i></span><span title="Move Down"><i className="fas fa-long-arrow-alt-down"></i></span></td></tr>

                                                                        <tr className=""><td >Are You Currently On TB Treatment?</td><td className="texttablestyle">OPTIONSET</td><td className="texttablestyle">No</td><td className="texttablestyle"><input type="checkbox" /></td><td className="td-actions text-right"><button type="button" title="Edit Question" className="btn btn-info"><i className="fas fa-pencil-alt"></i></button></td><td className="text-right sequence-column"><span title="Move Up"><i className="fas fa-long-arrow-alt-up"></i></span><span title="Move Down"><i className="fas fa-long-arrow-alt-down"></i></span></td></tr>

                                                                        <tr className=""><td >Date of initiation of TB treatment</td><td className="texttablestyle">DATE</td><td className="texttablestyle">Yes</td><td className="texttablestyle"><input type="checkbox" /></td><td className="td-actions text-right"><button type="button" title="Edit Question" className="btn btn-info"><i className="fas fa-pencil-alt"></i></button><button title="Delete Question" type="button" className="btn btn-danger"><i className="far fa-trash-alt"></i></button></td><td className="text-right sequence-column"><span title="Move Up"><i className="fas fa-long-arrow-alt-up"></i></span><span title="Move Down"><i className="fas fa-long-arrow-alt-down"></i></span></td></tr>

                                                                        <tr className=""><td >Site of Disease</td><td className="texttablestyle">CHECKBOX</td><td className="texttablestyle">No</td><td className="texttablestyle"><input type="checkbox" /></td><td className="td-actions text-right"><button type="button" title="Edit Question" className="btn btn-info"><i className="fas fa-pencil-alt"></i></button><button title="Delete Question" type="button" className="btn btn-danger"><i className="far fa-trash-alt"></i></button></td><td className="text-right sequence-column"><span title="Move Up"><i className="fas fa-long-arrow-alt-up"></i></span><span title="Move Down"><i className="fas fa-long-arrow-alt-down"></i></span></td></tr>

                                                                        <tr className=""><td >HIV Status</td><td className="texttablestyle">OPTIONSET</td><td className="texttablestyle">Yes</td><td className="texttablestyle"><input type="checkbox" /></td><td className="td-actions text-right"><button type="button" title="Edit Question" className="btn btn-info"><i className="fas fa-pencil-alt"></i></button></td><td className="text-right sequence-column"><span title="Move Up"><i className="fas fa-long-arrow-alt-up"></i></span><span title="Move Down"><i className="fas fa-long-arrow-alt-down"></i></span></td></tr>

                                                                        <tr className=""><td >Are you on ART?</td><td className="texttablestyle">OPTIONSET</td><td className="texttablestyle">No</td><td className="texttablestyle"><input type="checkbox" /></td><td className="td-actions text-right"><button type="button" title="Edit Question" className="btn btn-info"><i className="fas fa-pencil-alt"></i></button><button title="Delete Question" type="button" className="btn btn-danger"><i className="far fa-trash-alt"></i></button></td><td className="text-right sequence-column"><span title="Move Up"><i className="fas fa-long-arrow-alt-up"></i></span><span title="Move Down"><i className="fas fa-long-arrow-alt-down"></i></span></td></tr>

                                                                        <tr className=""><td >ART registration number</td><td className="texttablestyle">TEXT</td><td className="texttablestyle">Yes</td><td className="texttablestyle"><input type="checkbox" /></td><td className="td-actions text-right"><button type="button" title="Edit Question" className="btn btn-info"><i className="fas fa-pencil-alt"></i></button><button title="Delete Question" type="button" className="btn btn-danger"><i className="far fa-trash-alt"></i></button></td><td className="text-right sequence-column"><span title="Move Up"><i className="fas fa-long-arrow-alt-up"></i></span><span title="Move Down"><i className="fas fa-long-arrow-alt-down"></i></span></td></tr>



                                                                    </tbody>
                                                                </table>


                                                            </div>

                                                        </Card.Body>
                                                    </Card>
                                                    <div className="form-group is-empty" id="eligible"><label className="col-form-label"><span>Eligible for TPT(Age in Years)</span></label><div className="form-inline"><input type="number" className="form-control if w-25" /> -<input type="number" className="form-control if w-25" /></div></div>
                                                </div>
                                                <div className="col-4">
                                                    <Card>
                                                        <Card.Header className="regcardheader">Data Variables
                                                                    <span className="closesign"><i aria-hidden="true" className="fa fa-times"></i></span>
                                                        </Card.Header>
                                                        <Card.Body className="regtabbody">
                                                            <Tabs defaultActiveKey="profile" id="uncontrolled-tab-example">
                                                                <Tab eventKey="home" title="English">
                                                                    <Form className="mt-5">
                                                                        <Form.Group controlId="formBasicEmail">
                                                                            <Form.Label>*Name</Form.Label>
                                                                            <Form.Control type="text" placeholder="" />

                                                                        </Form.Group>

                                                                        <Form.Group controlId="formBasicPassword">
                                                                            <Form.Label>*Type</Form.Label>
                                                                            <Form.Control as="select">
                                                                                <option>Select Type</option>
                                                                                <option>Text</option>
                                                                                <option>Option List</option>
                                                                                <option>Number</option>
                                                                                <option>Date</option>
                                                                                <option>Checkbox Options</option>
                                                                            </Form.Control>
                                                                        </Form.Group>

                                                                    </Form>
                                                                    <Form>

                                                                        {['radio'].map((type) => (
                                                                            <div key={`inline-${type}`} className="mb-3">
                                                                                <Form.Label className="mr-4">*Mandatory</Form.Label>
                                                                                <Form.Check inline label="Yes" name="group1" type={type} id={`inline-${type}-1`} />
                                                                                <Form.Check inline label="No" name="group1" type={type} id={`inline-${type}-2`} />

                                                                            </div>
                                                                        ))}
                                                                    </Form>
                                                                    <Form>
                                                                        <Form.Group controlId="exampleForm.ControlSelect1">
                                                                            <Form.Label>Parent question</Form.Label>
                                                                            <Form.Control as="select">
                                                                                <option>-</option>
                                                                                <option>Client Type </option>
                                                                                <option>Please specify</option>
                                                                                <option>Gender </option>
                                                                                <option>Are You Currently On TB Treatment? </option>
                                                                                <option>Site of Disease </option>
                                                                                <option>HIV Status </option>
                                                                                <option>Are you on ART?  </option>

                                                                            </Form.Control>
                                                                        </Form.Group>
                                                                    </Form>
                                                                    <div>
                                                                        <Button className="addbtn">Add</Button>
                                                                    </div>

                                                                </Tab>
                                                                <Tab eventKey="profile" title="Chinese">
                                                                    <Form className="mt-5">
                                                                        <Form.Group controlId="formBasicEmail">
                                                                            <Form.Label>*Name</Form.Label>
                                                                            <Form.Control type="text" placeholder="" />

                                                                        </Form.Group>



                                                                    </Form>


                                                                    <div>
                                                                        <Button className="addbtn">Add</Button>
                                                                    </div>
                                                                </Tab>
                                                                <Tab eventKey="contact" title="Spanish">
                                                                    <Form className="mt-5">
                                                                        <Form.Group controlId="formBasicEmail">
                                                                            <Form.Label>*Name</Form.Label>
                                                                            <Form.Control type="text" placeholder="" />

                                                                        </Form.Group>



                                                                    </Form>


                                                                    <div>
                                                                        <Button className="addbtn">Add</Button>
                                                                    </div>
                                                                </Tab>
                                                                <Tab eventKey="contact1" title="French">
                                                                    <Form className="mt-5">
                                                                        <Form.Group controlId="formBasicEmail">
                                                                            <Form.Label>*Name</Form.Label>
                                                                            <Form.Control type="text" placeholder="" />

                                                                        </Form.Group>



                                                                    </Form>


                                                                    <div>
                                                                        <Button className="addbtn">Add</Button>
                                                                    </div>
                                                                </Tab>
                                                                <Tab eventKey="contact2" title="Russian">
                                                                    <Form className="mt-5">
                                                                        <Form.Group controlId="formBasicEmail">
                                                                            <Form.Label>*Name</Form.Label>
                                                                            <Form.Control type="text" placeholder="" />

                                                                        </Form.Group>



                                                                    </Form>


                                                                    <div>
                                                                        <Button className="addbtn">Add</Button>
                                                                    </div>
                                                                </Tab>
                                                                <Tab eventKey="contact3" title="Bislama">
                                                                    <Form className="mt-5">
                                                                        <Form.Group controlId="formBasicEmail">
                                                                            <Form.Label>*Name</Form.Label>
                                                                            <Form.Control type="text" placeholder="" />

                                                                        </Form.Group>



                                                                    </Form>


                                                                    <div>
                                                                        <Button className="addbtn">Add</Button>
                                                                    </div>
                                                                </Tab>
                                                            </Tabs>
                                                        </Card.Body>
                                                    </Card>
                                                </div>
                                            </div>
                                            <div className="row pt-1">
                                                <div className="col-12 bnBtn">
                                                    <button tabIndex="-1" type="button" className="btn wizard-btnb  ml-3" >Back</button>
                                                    <button tabIndex="-1" type="button" className="btn wizard-btnn  mr-3">Next
                                                            </button>
                                                </div>
                                            </div>

                                        </div>



                                    </div>
                                    <div className="tab-pane fade " id="pills-contact" role="tabpanel" aria-labelledby="pills-contact-tab">
                                        <div>
                                            <div className="row pt-1">
                                                <div className="col-12 bnBtn">
                                                    <button tabIndex="-1" type="button" className="wizard-btnb  ml-3" >Back</button>
                                                    <button tabIndex="-1" type="button" className="wizard-btnn  mr-3">Next
                                                            </button>
                                                </div>

                                            </div>
                                            <div className="row mb-2">
                                                <div className="col-12">
                                                    <button type="button" data-toggle="tooltip" title="Edit Form Name" className="addbtn mt-2"> Add Form </button>

                                                </div>
                                            </div>

                                            <div className="row mb-2 formcontent">
                                                <div className="col-8">
                                                    <Accordion defaultActiveKey="0">
                                                        <Card>
                                                            <Card.Header className="formtabletitle">
                                                                <Accordion.Toggle className="formtableheader" as={Button} variant="link" eventKey="0">
                                                                    <i className="fas fa-minus mr-2"></i> RISK ASSESSMENT AND REFERRAL

                                                                        </Accordion.Toggle>
                                                                <ul className="float-right define-services-tools d-inline m-0 p-0"><li className="d-inline"><button type="button" data-toggle="tooltip" title="Edit Form Name" className="btn  p-1 pl-2 pr-2"><i className="far fa-pencil-alt"></i></button></li><li className="d-inline"><i title="Add Question" aria-hidden="true" className="fa fa-plus mr-3"></i><i title="Move Up" className="fas fa-long-arrow-alt-up"></i><i title="Move Down" className="fas fa-long-arrow-alt-down"></i></li></ul>
                                                            </Card.Header>
                                                            <Accordion.Collapse eventKey="0">
                                                                <Card.Body className="formstables">
                                                                    <table className="table">
                                                                        <thead ><tr ><th width="30%">Questions</th><th >Type</th><th >Mandatory</th><th >Hide</th><th width="20%">Role</th><th className="text-right">Actions</th><th className="text-right">Sequence</th></tr></thead>

                                                                        <tbody className="formsbody">

                                                                            <tr className=""><td >Symptoms</td><td className="texttablestyle">CHECKBOX</td><td className="texttablestyle">No</td><td className="texttablestyle"></td><td className="p-1"></td><td className="td-actions text-right"><button type="button" title="Add Question" className="btn btn-info btn_Edit"><i className="fas fa-plus"></i></button><button type="button" title="Edit Question" className="btn btn-info btn_Edit"><i className="fa fa-pencil-alt"></i></button></td><td className="text-right sequence-column"><span title="Move Up"><i className="fas fa-long-arrow-alt-up"></i></span><span title="Move Down"><i className="fas fa-long-arrow-alt-down"></i></span></td></tr>

                                                                            <tr className=""><td >please specify</td><td className="texttablestyle">CHECKBOX</td><td className="texttablestyle">No</td><td className="texttablestyle"></td><td className="p-1"></td><td className="td-actions text-right"><button type="button" title="Add Question" className="btn btn-info btn_Edit"><i className="fas fa-plus"></i></button><button type="button" title="Edit Question" className="btn btn-info btn_Edit"><i className="fas fa-pencil-alt"></i></button><button type="button" title="Delete Question" className="btn btn-danger btn_Delete"><i className="far fa-trash-alt"></i></button></td><td className="text-right sequence-column"><span title="Move Up"><i className="fas fa-long-arrow-alt-up"></i></span><span title="Move Down"><i className="fas fa-long-arrow-alt-down"></i></span></td></tr>

                                                                            <tr className=""><td >Is CXR report available</td><td className="texttablestyle">OPTIONSET</td><td className="texttablestyle">No</td><td className="texttablestyle"><input type="checkbox" className="big-checkbox" /></td><td className="p-1"><div tabIndex="-1" className="multiselect roleDropDown"><div className="multiselect__select"></div>
                                                                                <div className="mt-2">


                                                                                    <select name="multirole" id="multirole">
                                                                                        <option value="Select Role">Select Role</option>
                                                                                        <option value="ORW">ORW</option>
                                                                                        <option value="FACILITY TB">FACILITY TB</option>

                                                                                    </select>
                                                                                </div>
                                                                                {/* <div className="multiselect__tags"><div className="multiselect__tags-wrap" ></div>  <div className="multiselect__spinner" ></div> <input name="" type="text" autoComplete="nope" placeholder="Select Role" tabIndex="0" className="multiselect__input" />  <span className="multiselect__placeholder">
                                                
                                                </span></div> <div tabIndex="-1" className="multiselect__content-wrapper" ><ul className="multiselect__content">  <li className="multiselect__element"><span data-select="" data-selected="" data-deselect="" className="multiselect__option multiselect__option--highlight"><span>ORW</span></span> </li><li className="multiselect__element"><span data-select="" data-selected="" data-deselect="" className="multiselect__option"><span>FACILITY TB</span></span> </li> <li ><span className="multiselect__option">No elements found. Consider changing the search query.</span></li> <li ><span className="multiselect__option">List is empty.</span></li> </ul></div> */}

                                                                            </div></td><td className="td-actions text-right"><button type="button" title="Add Question" className="btn btn-info btn_Edit"><i className="fas fa-plus"></i></button><button type="button" title="Edit Question" className="btn btn-info btn_Edit"><i className="fas fa-pencil-alt"></i></button></td><td className="text-right sequence-column"><span title="Move Up"><i className="fas fa-long-arrow-alt-up"></i></span><span title="Move Down"><i className="fas fa-long-arrow-alt-down"></i></span></td></tr>

                                                                            <tr className=""><td >CXR result</td><td className="texttablestyle">OPTIONSET</td><td className="texttablestyle">No</td><td className="texttablestyle"></td><td className="p-1"></td><td className="td-actions text-right"><button type="button" title="Add Question" className="btn btn-info btn_Edit"><i className="fas fa-plus"></i></button><button type="button" title="Edit Question" className="btn btn-info btn_Edit"><i className="fas fa-pencil-alt"></i></button></td><td className="text-right sequence-column"><span title="Move Up"><i className="fas fa-long-arrow-alt-up"></i></span><span title="Move Down"><i className="fas fa-long-arrow-alt-down"></i></span></td></tr>

                                                                            <tr className=""><td >Is mWRD report available</td><td className="texttablestyle">OPTIONSET</td><td className="texttablestyle">No</td><td className="texttablestyle"><input type="checkbox" className="big-checkbox" /></td><td className="p-1"><div tabIndex="-1" className="multiselect roleDropDown"><div className="multiselect__select"></div>
                                                                                <div className="mt-2">


                                                                                    <select name="multirole" id="multirole">
                                                                                        <option value="Select Role">Select Role</option>
                                                                                        <option value="ORW">ORW</option>
                                                                                        <option value="FACILITY TB">FACILITY TB</option>

                                                                                    </select>
                                                                                </div>
                                                                                {/* <div className="multiselect__tags"><div className="multiselect__tags-wrap" ></div>  <div className="multiselect__spinner" ></div> <input name="" type="text" autoComplete="nope" placeholder="Select Role" tabIndex="0" className="multiselect__input" />  <span className="multiselect__placeholder">
                                                Select Role
                                                </span></div> <div tabIndex="-1" className="multiselect__content-wrapper" ><ul className="multiselect__content" >  <li className="multiselect__element"><span data-select="" data-selected="" data-deselect="" className="multiselect__option multiselect__option--highlight"><span>ORW</span></span> </li><li className="multiselect__element"><span data-select="" data-selected="" data-deselect="" className="multiselect__option"><span>FACILITY TB</span></span> </li> <li ><span className="multiselect__option">No elements found. Consider changing the search query.</span></li> <li ><span className="multiselect__option">List is empty.</span></li> </ul></div> */}

                                                                            </div></td><td className="td-actions text-right"><button type="button" title="Add Question" className="btn btn-info btn_Edit"><i className="fas fa-plus"></i></button><button type="button" title="Edit Question" className="btn btn-info btn_Edit"><i className="fas fa-pencil-alt"></i></button></td><td className="text-right sequence-column"><span title="Move Up"><i className="fas fa-long-arrow-alt-up"></i></span><span title="Move Down"><i className="fas fa-long-arrow-alt-down"></i></span></td></tr>

                                                                            <tr className=""><td >mWRD result</td><td className="texttablestyle">OPTIONSET</td><td className="texttablestyle">No</td><td className="texttablestyle"></td><td className="p-1"></td><td className="td-actions text-right"><button type="button" title="Add Question" className="btn btn-info btn_Edit"><i className="fas fa-plus"></i></button><button type="button" title="Edit Question" className="btn btn-info btn_Edit"><i className="fas fa-pencil-alt"></i></button></td><td className="text-right sequence-column"><span title="Move Up"><i className="fas fa-long-arrow-alt-up"></i></span><span title="Move Down"><i className="fas fa-long-arrow-alt-down"></i></span></td></tr>

                                                                            <tr className=""><td >Is CRP report available</td><td className="texttablestyle">OPTIONSET</td><td className="texttablestyle">No</td><td className="texttablestyle"><input type="checkbox" className="big-checkbox" /></td><td className="p-1"><div tabIndex="-1" className="multiselect roleDropDown"><div className="multiselect__select"></div>
                                                                                <div className="mt-2">


                                                                                    <select name="multirole" id="multirole">
                                                                                        <option value="Select Role">Select Role</option>
                                                                                        <option value="ORW">ORW</option>
                                                                                        <option value="FACILITY TB">FACILITY TB</option>

                                                                                    </select>
                                                                                </div>
                                                                                {/* <div className="multiselect__tags"><div className="multiselect__tags-wrap"></div>  <div className="multiselect__spinner" ></div> <input name="" type="text" autoComplete="nope" placeholder="Select Role" tabIndex="0" className="multiselect__input" />  <span className="multiselect__placeholder">
                                                Select Role
                                                </span></div> <div tabIndex="-1" className="multiselect__content-wrapper" ><ul className="multiselect__content" >  <li className="multiselect__element"><span data-select="" data-selected="" data-deselect="" className="multiselect__option multiselect__option--highlight"><span>ORW</span></span> </li><li className="multiselect__element"><span data-select="" data-selected="" data-deselect="" className="multiselect__option"><span>FACILITY TB</span></span> </li> <li ><span className="multiselect__option">No elements found. Consider changing the search query.</span></li> <li ><span className="multiselect__option">List is empty.</span></li> </ul></div> */}

                                                                            </div></td><td className="td-actions text-right"><button type="button" title="Add Question" className="btn btn-info btn_Edit"><i className="fas fa-plus"></i></button><button type="button" title="Edit Question" className="btn btn-info btn_Edit"><i className="fas fa-pencil-alt"></i></button></td><td className="text-right sequence-column"><span title="Move Up"><i className="fas fa-long-arrow-alt-up"></i></span><span title="Move Down"><i className="fas fa-long-arrow-alt-down"></i></span></td></tr>

                                                                            <tr className=""><td >CRP result</td><td className="texttablestyle">OPTIONSET</td><td className="texttablestyle">No</td><td className="texttablestyle"></td><td className="p-1"></td><td className="td-actions text-right"><button type="button" title="Add Question" className="btn btn-info btn_Edit"><i className="fas fa-plus"></i></button><button type="button" title="Edit Question" className="btn btn-info btn_Edit"><i className="fas fa-pencil-alt"></i></button></td><td className="text-right sequence-column"><span title="Move Up"><i className="fas fa-long-arrow-alt-up"></i></span><span title="Move Down"><i className="fas fa-long-arrow-alt-down"></i></span></td></tr>

                                                                            <tr className=""><td >Is testing for TB infection required as per national guidelines?</td><td className="texttablestyle">OPTIONSET</td><td className="texttablestyle">No</td><td className="texttablestyle"></td><td className="p-1"></td><td className="td-actions text-right"><button type="button" title="Add Question" className="btn btn-info btn_Edit"><i className="fas fa-plus"></i></button><button type="button" title="Edit Question" className="btn btn-info btn_Edit"><i className="fas fa-pencil-alt"></i></button></td><td className="text-right sequence-column"><span title="Move Up"><i className="fas fa-long-arrow-alt-up"></i></span><span title="Move Down"><i className="fas fa-long-arrow-alt-down"></i></span></td></tr>

                                                                            <tr className=""><td >Refer to lab for testing</td><td className="texttablestyle">OPTIONSET</td><td className="texttablestyle">Yes</td><td className="texttablestyle"></td><td className="p-1"></td><td className="td-actions text-right"><button type="button" title="Add Question" className="btn btn-info btn_Edit"><i className="fas fa-plus"></i></button><button type="button" title="Edit Question" className="btn btn-info btn_Edit"><i className="fas fa-pencil-alt"></i></button></td><td className="text-right sequence-column"><span title="Move Up"><i className="fas fa-long-arrow-alt-up"></i></span><span title="Move Down"><i className="fas fa-long-arrow-alt-down"></i></span></td></tr>

                                                                            <tr className=""><td >Refer to Facility Center</td><td className="texttablestyle">FACILITY</td><td className="texttablestyle">Yes</td><td className="texttablestyle"></td><td className="p-1"></td><td className="td-actions text-right"><button type="button" title="Edit Question" className="btn btn-info btn_Edit"><i className="fas fa-pencil-alt"></i></button></td><td className="text-right sequence-column"><span title="Move Up"><i className="fas fa-long-arrow-alt-up"></i></span><span title="Move Down"><i className="fas fa-long-arrow-alt-down"></i></span></td></tr>

                                                                            <tr className=""><td >Eligible for TPT</td><td className="texttablestyle">OPTIONSET</td><td className="texttablestyle">No</td><td className="texttablestyle"></td><td className="p-1"></td><td className="td-actions text-right"><button type="button" title="Add Question" className="btn btn-info btn_Edit"><i className="fas fa-plus"></i></button><button type="button" title="Edit Question" className="btn btn-info btn_Edit"><i className="fas fa-pencil-alt"></i></button></td><td className="text-right sequence-column"><span title="Move Up"><i className="fas fa-long-arrow-alt-up"></i></span><span title="Move Down"><i className="fas fa-long-arrow-alt-down"></i></span></td></tr>

                                                                        </tbody>
                                                                    </table>
                                                                </Card.Body>
                                                            </Accordion.Collapse>
                                                        </Card>
                                                        <Card>
                                                            <Card.Header className="formtabletitle">
                                                                <Accordion.Toggle className="formtableheader" as={Button} variant="link" eventKey="1">
                                                                    <i className="fas fa-minus mr-2"></i>TB TESTING FORM
                                                                        </Accordion.Toggle>
                                                                <ul className="float-right define-services-tools d-inline m-0 p-0"><li className="d-inline"><button type="button" data-toggle="tooltip" title="Edit Form Name" className="btn  p-1 pl-2 pr-2"><i className="far fa-pencil-alt"></i></button></li><li className="d-inline"><i title="Add Question" aria-hidden="true" className="fa fa-plus mr-3"></i><i title="Move Up" className="fas fa-long-arrow-alt-up"></i><i title="Move Down" className="fas fa-long-arrow-alt-down"></i></li></ul>
                                                            </Card.Header>
                                                            <Accordion.Collapse eventKey="1">
                                                                <Card.Body className="formstables">
                                                                    <table className="table">
                                                                        <thead ><tr ><th width="30%">Questions</th><th >Type</th><th >Mandatory</th><th >Hide</th><th width="20%">Role</th><th className="text-right">Actions</th><th className="text-right">Sequence</th></tr></thead>

                                                                        <tbody>
                                                                            <tr className=""><td >Date of Testing</td><td className="texttablestyle">DATE</td><td className="texttablestyle">Yes</td><td className="texttablestyle"></td><td className="p-1"></td><td className="td-actions text-right"><button type="button" title="Edit Question" className="btn btn-info btn_Edit"><i className="fas fa-pencil-alt"></i></button><button type="button" title="Delete Question" className="btn btn-danger btn_Delete"><i className="far fa-trash-alt"></i></button></td><td className="text-right sequence-column"><span title="Move Up"><i className="fas fa-long-arrow-alt-up"></i></span><span title="Move Down"><i className="fas fa-long-arrow-alt-down"></i></span></td></tr>

                                                                            <tr className=""><td >Method of Testing</td><td className="texttablestyle">CHECKBOX</td><td className="texttablestyle">Yes</td><td className="texttablestyle"></td><td className="p-1"></td><td className="td-actions text-right"><button type="button" title="Add Question" className="btn btn-info btn_Edit"><i className="fas fa-plus"></i></button><button type="button" title="Edit Question" className="btn btn-info btn_Edit"><i className="fas fa-pencil-alt"></i></button></td><td className="text-right sequence-column"><span title="Move Up"><i className="fas fa-long-arrow-alt-up"></i></span><span title="Move Down"><i className="fas fa-long-arrow-alt-down"></i></span></td></tr>

                                                                            <tr className=""><td >Test Outcome</td><td className="texttablestyle">OPTIONSET</td><td className="texttablestyle">Yes</td><td className="texttablestyle"></td><td className="p-1"></td><td className="td-actions text-right"><button type="button" title="Add Question" className="btn btn-info btn_Edit"><i className="fas fa-plus"></i></button><button type="button" title="Edit Question" className="btn btn-info btn_Edit"><i className="fas fa-pencil-alt"></i></button><button type="button" title="Delete Question" className="btn btn-danger btn_Delete"><i className="far fa-trash-alt"></i></button></td><td className="text-right sequence-column"><span title="Move Up"><i className="fas fa-long-arrow-alt-up"></i></span><span title="Move Down"><i className="fas fa-long-arrow-alt-down"></i></span></td></tr>

                                                                            <tr className=""><td >Type of mWRD</td><td className="texttablestyle">OPTIONSET</td><td className="texttablestyle">No</td><td className="texttablestyle"></td><td className="p-1"></td><td className="td-actions text-right"><button type="button" title="Add Question" className="btn btn-info btn_Edit"><i className="fas fa-plus"></i></button><button type="button" title="Edit Question" className="btn btn-info btn_Edit"><i className="fas fa-pencil-alt"></i></button><button type="button" title="Delete Question" className="btn btn-danger btn_Delete"><i className="far fa-trash-alt"></i></button></td><td className="text-right sequence-column"><span title="Move Up"><i className="fas fa-long-arrow-alt-up"></i></span><span title="Move Down"><i className="fas fa-long-arrow-alt-down"></i></span></td></tr>

                                                                            <tr className=""><td >mWRD Test Outcome</td><td className="texttablestyle">OPTIONSET</td><td className="texttablestyle">Yes</td><td className="texttablestyle"></td><td className="p-1"></td><td className="td-actions text-right"><button type="button" title="Add Question" className="btn btn-info btn_Edit"><i className="fas fa-plus"></i></button><button type="button" title="Edit Question" className="btn btn-info btn_Edit"><i className="fas fa-pencil-alt"></i></button><button type="button" title="Delete Question" className="btn btn-danger btn_Delete"><i className="far fa-trash-alt"></i></button></td><td className="text-right sequence-column"><span title="Move Up"><i className="fas fa-long-arrow-alt-up"></i></span><span title="Move Down"><i className="fas fa-long-arrow-alt-down"></i></span></td></tr>

                                                                            <tr className=""><td >LF-LAM Test Outcome</td><td className="texttablestyle">OPTIONSET</td><td className="texttablestyle">No</td><td className="texttablestyle"></td><td className="p-1"></td><td className="td-actions text-right"><button type="button" title="Add Question" className="btn btn-info btn_Edit"><i className="fas fa-plus"></i></button><button type="button" title="Edit Question" className="btn btn-info btn_Edit"><i className="fas fa-pencil-alt"></i></button><button type="button" title="Delete Question" className="btn btn-danger btn_Delete"><i className="far fa-trash-alt"></i></button></td><td className="text-right sequence-column"><span title="Move Up"><i className="fas fa-long-arrow-alt-up"></i></span><span title="Move Down"><i className="fas fa-long-arrow-alt-down"></i></span></td></tr>

                                                                            <tr className=""><td >Test Result</td><td className="texttablestyle">OPTIONSET</td><td className="texttablestyle">Yes</td><td className="texttablestyle"></td><td className="p-1"></td><td className="td-actions text-right"><button type="button" title="Add Question" className="btn btn-info btn_Edit"><i className="fas fa-plus"></i></button><button type="button" title="Edit Question" className="btn btn-info btn_Edit"><i className="fas fa-pencil-alt"></i></button></td><td className="text-right sequence-column"><span title="Move Up"><i className="fas fa-long-arrow-alt-up"></i></span><span title="Move Down"><i className="fas fa-long-arrow-alt-down"></i></span></td></tr>

                                                                            <tr className=""><td >Eligibility for TB infection testing</td><td className="texttablestyle">OPTIONSET</td><td className="texttablestyle">No</td><td className="texttablestyle"></td><td className="p-1"></td><td className="td-actions text-right"><button type="button" title="Add Question" className="btn btn-info btn_Edit"><i className="fas fa-plus"></i></button><button type="button" title="Edit Question" className="btn btn-info btn_Edit"><i className="fas fa-pencil-alt"></i></button></td><td className="text-right sequence-column"><span title="Move Up"><i className="fas fa-long-arrow-alt-up"></i></span><span title="Move Down"><i className="fas fa-long-arrow-alt-down"></i></span></td></tr>
                                                                        </tbody>
                                                                    </table>
                                                                </Card.Body>
                                                            </Accordion.Collapse>
                                                        </Card>
                                                        <Card>
                                                            <Card.Header className="formtabletitle">
                                                                <Accordion.Toggle className="formtableheader" as={Button} variant="link" eventKey="2">
                                                                    <i className="fas fa-minus mr-2"></i>  TB INFECTION TESTING FORM
                                                                        </Accordion.Toggle>
                                                                <ul className="float-right define-services-tools d-inline m-0 p-0"><li className="d-inline"><button type="button" data-toggle="tooltip" title="Edit Form Name" className="btn  p-1 pl-2 pr-2"><i className="far fa-pencil-alt"></i></button></li><li className="d-inline"><i title="Add Question" aria-hidden="true" className="fa fa-plus mr-3"></i><i title="Move Up" className="fas fa-long-arrow-alt-up"></i><i title="Move Down" className="fas fa-long-arrow-alt-down"></i></li></ul>
                                                            </Card.Header>
                                                            <Accordion.Collapse eventKey="2">
                                                                <Card.Body className="formstables">
                                                                    <table className="table">
                                                                        <thead ><tr ><th width="30%">Questions</th><th >Type</th><th >Mandatory</th><th >Hide</th><th width="20%">Role</th><th className="text-right">Actions</th><th className="text-right">Sequence</th></tr>
                                                                        </thead>
                                                                        <tbody>
                                                                            <tr className=""><td >Is the test done</td><td className="texttablestyle">OPTIONSET</td><td className="texttablestyle">No</td><td className="texttablestyle"></td><td className="p-1"></td><td className="td-actions text-right"><button type="button" title="Add Question" className="btn btn-info btn_Edit"><i className="fas fa-plus"></i></button><button type="button" title="Edit Question" className="btn btn-info btn_Edit"><i className="fas fa-pencil-alt"></i></button><button type="button" title="Delete Question" className="btn btn-danger btn_Delete"><i className="far fa-trash-alt"></i></button></td><td className="text-right sequence-column"><span title="Move Up"><i className="fas fa-long-arrow-alt-up"></i></span><span title="Move Down"><i className="fas fa-long-arrow-alt-down"></i></span></td></tr>

                                                                            <tr className=""><td >Date of Testing</td><td className="texttablestyle">DATE</td><td className="texttablestyle">Yes</td><td className="texttablestyle"></td><td className="p-1"></td><td className="td-actions text-right"><button type="button" title="Edit Question" className="btn btn-info btn_Edit"><i className="fas fa-pencil-alt"></i></button><button type="button" title="Delete Question" className="btn btn-danger btn_Delete"><i className="far fa-trash-alt"></i></button></td><td className="text-right sequence-column"><span title="Move Up"><i className="fas fa-long-arrow-alt-up"></i></span><span title="Move Down"><i className="fas fa-long-arrow-alt-down"></i></span></td></tr>

                                                                            <tr className=""><td >Method of Testing</td><td className="texttablestyle">CHECKBOX</td><td className="texttablestyle">Yes</td><td className="texttablestyle"></td><td className="p-1"></td><td className="td-actions text-right"><button type="button" title="Add Question" className="btn btn-info btn_Edit"><i className="fas fa-plus"></i></button><button type="button" title="Edit Question" className="btn btn-info btn_Edit"><i className="fas fa-pencil-alt"></i></button></td><td className="text-right sequence-column"><span title="Move Up"><i className="fas fa-long-arrow-alt-up"></i></span><span title="Move Down"><i className="fas fa-long-arrow-alt-down"></i></span></td></tr>

                                                                            <tr className=""><td >Test Result</td><td className="texttablestyle">OPTIONSET</td><td className="texttablestyle">Yes</td><td className="texttablestyle"></td><td className="p-1"></td><td className="td-actions text-right"><button type="button" title="Add Question" className="btn btn-info btn_Edit"><i className="fas fa-plus"></i></button><button type="button" title="Edit Question" className="btn btn-info btn_Edit"><i className="fas fa-pencil-alt"></i></button></td><td className="text-right sequence-column"><span title="Move Up"><i className="fas fa-long-arrow-alt-up"></i></span><span title="Move Down"><i className="fas fa-long-arrow-alt-down"></i></span></td></tr>

                                                                            <tr className=""><td >Eligible for TPT</td><td className="texttablestyle">OPTIONSET</td><td className="texttablestyle">Yes</td><td className="texttablestyle"></td><td className="p-1"></td><td className="td-actions text-right"><button type="button" title="Add Question" className="btn btn-info btn_Edit"><i className="fas fa-plus"></i></button><button type="button" title="Edit Question" className="btn btn-info btn_Edit"><i className="fas fa-pencil-alt"></i></button></td><td className="text-right sequence-column"><span title="Move Up"><i className="fas fa-long-arrow-alt-up"></i></span><span title="Move Down"><i className="fas fa-long-arrow-alt-down"></i></span></td></tr>
                                                                        </tbody>
                                                                    </table>
                                                                </Card.Body>
                                                            </Accordion.Collapse>
                                                        </Card>
                                                        <Card>
                                                            <Card.Header className="formtabletitle">
                                                                <Accordion.Toggle className="formtableheader" as={Button} variant="link" eventKey="3">
                                                                    <i className="fas fa-minus mr-2"></i> TB TREATMENT INITIATION FORM
                                                                        </Accordion.Toggle>
                                                                <ul className="float-right define-services-tools d-inline m-0 p-0"><li className="d-inline"><button type="button" data-toggle="tooltip" title="Edit Form Name" className="btn  p-1 pl-2 pr-2"><i className="far fa-pencil-alt"></i></button></li><li className="d-inline"><i title="Add Question" aria-hidden="true" className="fa fa-plus mr-3"></i><i title="Move Up" className="fas fa-long-arrow-alt-up"></i><i title="Move Down" className="fas fa-long-arrow-alt-down"></i></li></ul>
                                                            </Card.Header>
                                                            <Accordion.Collapse eventKey="3">
                                                                <Card.Body className="formstables">
                                                                    <table className="table">
                                                                        <thead ><tr ><th width="30%">Questions</th><th >Type</th><th >Mandatory</th><th >Hide</th><th width="20%">Role</th><th className="text-right">Actions</th><th className="text-right">Sequence</th></tr></thead>

                                                                        <tbody>
                                                                            <tr className=""><td >Treatment Initiated</td><td className="texttablestyle">OPTIONSET</td><td className="texttablestyle">Yes</td><td className="texttablestyle"></td><td className="p-1"></td><td className="td-actions text-right"><button type="button" title="Add Question" className="btn btn-info btn_Edit"><i className="fas fa-plus"></i></button><button type="button" title="Edit Question" className="btn btn-info btn_Edit"><i className="fas fa-pencil-alt"></i></button></td><td className="text-right sequence-column"><span title="Move Up"><i className="fas fa-long-arrow-alt-up"></i></span><span title="Move Down"><i className="fas fa-long-arrow-alt-down"></i></span></td></tr>

                                                                            <tr className=""><td >Program ID</td><td className="texttablestyle">NUMBER</td><td className="texttablestyle">No</td><td className="texttablestyle"></td><td className="p-1"></td><td className="td-actions text-right"><button type="button" title="Edit Question" className="btn btn-info btn_Edit"><i className="fas fa-pencil-alt"></i></button><button type="button" title="Delete Question" className="btn btn-danger btn_Delete"><i className="far fa-trash-alt"></i></button></td><td className="text-right sequence-column"><span title="Move Up"><i className="fas fa-long-arrow-alt-up"></i></span><span title="Move Down"><i className="fas fa-long-arrow-alt-down"></i></span></td></tr>

                                                                            <tr className=""><td >Date of treatment Initiation</td><td className="texttablestyle">DATE</td><td className="texttablestyle">Yes</td><td className="texttablestyle"></td><td className="p-1"></td><td className="td-actions text-right"><button type="button" title="Edit Question" className="btn btn-info btn_Edit"><i className="fas fa-pencil-alt"></i></button></td><td className="text-right sequence-column"><span title="Move Up"><i className="fas fa-long-arrow-alt-up"></i></span><span title="Move Down"><i className="fas fa-long-arrow-alt-down"></i></span></td></tr>
                                                                        </tbody>
                                                                    </table>
                                                                </Card.Body>
                                                            </Accordion.Collapse>
                                                        </Card>
                                                        <Card>
                                                            <Card.Header className="formtabletitle">
                                                                <Accordion.Toggle className="formtableheader" as={Button} variant="link" eventKey="4">
                                                                    <i className="fas fa-minus mr-2"></i>TB INITIATION FORM
                                                                        </Accordion.Toggle>
                                                                <ul className="float-right define-services-tools d-inline m-0 p-0"><li className="d-inline"><button type="button" data-toggle="tooltip" title="Edit Form Name" className="btn  p-1 pl-2 pr-2"><i className="far fa-pencil-alt"></i></button></li><li className="d-inline"><i title="Add Question" aria-hidden="true" className="fa fa-plus mr-3"></i><i title="Move Up" className="fas fa-long-arrow-alt-up"></i><i title="Move Down" className="fas fa-long-arrow-alt-down"></i></li></ul>
                                                            </Card.Header>
                                                            <Accordion.Collapse eventKey="4">
                                                                <Card.Body className="formstables">
                                                                    <table className="table">
                                                                        <thead ><tr ><th width="30%">Questions</th><th >Type</th><th >Mandatory</th><th >Hide</th><th width="20%">Role</th><th className="text-right">Actions</th><th className="text-right">Sequence</th></tr></thead>

                                                                        <tbody>
                                                                            <tr className=""><td >Treatment Initiated</td><td className="texttablestyle">OPTIONSET</td><td className="texttablestyle">Yes</td><td className="texttablestyle"></td><td className="p-1"></td><td className="td-actions text-right"><button type="button" title="Add Question" className="btn btn-info btn_Edit"><i className="fas fa-plus"></i></button><button type="button" title="Edit Question" className="btn btn-info btn_Edit"><i className="fas fa-pencil-alt"></i></button></td><td className="text-right sequence-column"><span title="Move Up"><i className="fas fa-long-arrow-alt-up"></i></span><span title="Move Down"><i className="fas fa-long-arrow-alt-down"></i></span></td></tr>

                                                                            <tr className=""><td >Regimen</td><td className="texttablestyle">OPTIONSET</td><td className="texttablestyle">Yes</td><td className="texttablestyle"></td><td className="p-1"></td><td className="td-actions text-right"><button type="button" title="Add Question" className="btn btn-info btn_Edit"><i className="fas fa-plus"></i></button><button type="button" title="Edit Question" className="btn btn-info btn_Edit"><i className="fas fa-pencil-alt"></i></button><button type="button" title="Delete Question" className="btn btn-danger btn_Delete"><i className="far fa-trash-alt"></i></button></td><td className="text-right sequence-column"><span title="Move Up"><i className="fas fa-long-arrow-alt-up"></i></span><span title="Move Down"><i className="fas fa-long-arrow-alt-down"></i></span></td></tr>

                                                                            <tr className=""><td >Date of treatment Initiation</td><td className="texttablestyle">DATE</td><td className="texttablestyle">Yes</td><td className="texttablestyle"></td><td className="p-1"></td><td className="td-actions text-right"><button type="button" title="Edit Question" className="btn btn-info btn_Edit"><i className="fas fa-pencil-alt"></i></button></td><td className="text-right sequence-column"><span title="Move Up"><i className="fas fa-long-arrow-alt-up"></i></span><span title="Move Down"><i className="fas fa-long-arrow-alt-down"></i></span></td></tr>
                                                                        </tbody>
                                                                    </table>
                                                                </Card.Body>
                                                            </Accordion.Collapse>
                                                        </Card>
                                                        <Card>
                                                            <Card.Header className="formtabletitle">
                                                                <Accordion.Toggle className="formtableheader" as={Button} variant="link" eventKey="4">
                                                                    <i className="fas fa-minus mr-2"></i> TBT Outcome
                                                                        </Accordion.Toggle>
                                                                <ul className="float-right define-services-tools d-inline m-0 p-0"><li className="d-inline"><button type="button" data-toggle="tooltip" title="Edit Form Name" className="btn  p-1 pl-2 pr-2"><i className="far fa-pencil-alt"></i></button></li><li className="d-inline"><i title="Add Question" aria-hidden="true" className="fa fa-plus mr-3"></i><i title="Move Up" className="fas fa-long-arrow-alt-up"></i><i title="Move Down" className="fas fa-long-arrow-alt-down"></i></li></ul>
                                                            </Card.Header>
                                                            <Accordion.Collapse eventKey="4">
                                                                <Card.Body className="formstables">
                                                                    <table className="table">
                                                                        <thead ><tr ><th width="30%">Questions</th><th >Type</th><th >Mandatory</th><th >Hide</th><th width="20%">Role</th><th className="text-right">Actions</th><th className="text-right">Sequence</th></tr></thead>

                                                                        <tbody>
                                                                            <tr className=""><td >Outcome</td><td className="texttablestyle">OPTIONSET</td><td className="texttablestyle">Yes</td><td className="texttablestyle"></td><td className="p-1"></td><td className="td-actions text-right"><button type="button" title="Add Question" className="btn btn-info btn_Edit"><i className="fas fa-plus"></i></button><button type="button" title="Edit Question" className="btn btn-info btn_Edit"><i className="fas fa-pencil-alt"></i></button><button type="button" title="Delete Question" className="btn btn-danger btn_Delete"><i className="far fa-trash-alt"></i></button></td><td className="text-right sequence-column"><span title="Move Up"><i className="fas fa-long-arrow-alt-up"></i></span><span title="Move Down"><i className="fas fa-long-arrow-alt-down"></i></span></td></tr>

                                                                            <tr className=""><td >Reason for TPT interrupted</td><td className="texttablestyle">OPTIONSET</td><td className="texttablestyle">No</td><td className="texttablestyle"></td><td className="p-1"></td><td className="td-actions text-right"><button type="button" title="Add Question" className="btn btn-info btn_Edit"><i className="fas fa-plus"></i></button><button type="button" title="Edit Question" className="btn btn-info btn_Edit"><i className="fas fa-pencil-alt"></i></button><button type="button" title="Delete Question" className="btn btn-danger btn_Delete"><i className="far fa-trash-alt"></i></button></td><td className="text-right sequence-column"><span title="Move Up"><i className="fas fa-long-arrow-alt-up"></i></span><span title="Move Down"><i className="fas fa-long-arrow-alt-down"></i></span></td></tr>

                                                                            <tr className=""><td >Date of TPT completion</td><td className="texttablestyle">DATE</td><td className="texttablestyle">Yes</td><td className="texttablestyle"></td><td className="p-1"></td><td className="td-actions text-right"><button type="button" title="Edit Question" className="btn btn-info btn_Edit"><i className="fas fa-pencil-alt"></i></button><button type="button" title="Delete Question" className="btn btn-danger btn_Delete"><i className="far fa-trash-alt"></i></button></td><td className="text-right sequence-column"><span title="Move Up"><i className="fas fa-long-arrow-alt-up"></i></span><span title="Move Down"><i className="fas fa-long-arrow-alt-down"></i></span></td></tr>

                                                                            <tr className=""><td >Remarks</td><td className="texttablestyle">TEXT</td><td className="texttablestyle">No</td><td className="texttablestyle"></td><td className="p-1"></td><td className="td-actions text-right"><button type="button" title="Edit Question" className="btn btn-info btn_Edit"><i className="fas fa-pencil-alt"></i></button><button type="button" title="Delete Question" className="btn btn-danger btn_Delete"><i className="far fa-trash-alt"></i></button></td><td className="text-right sequence-column"><span title="Move Up"><i className="fas fa-long-arrow-alt-up"></i></span><span title="Move Down"><i className="fas fa-long-arrow-alt-down"></i></span></td></tr>
                                                                        </tbody>
                                                                    </table>
                                                                </Card.Body>
                                                            </Accordion.Collapse>
                                                        </Card>
                                                    </Accordion>
                                                </div>
                                                <div className="col-4">
                                                    <Card>
                                                        <Card.Header className="regcardheader">Data Variables
                                                                    <span className="closesign"><i aria-hidden="true" className="fa fa-times"></i></span>
                                                        </Card.Header>
                                                        <Card.Body className="regtabbody">
                                                            <div className="mb-3"><label className=" col-form-label">*<span >Select Form</span></label><div ><select id="stageNameList" className="form-control"><option value="">Select Type</option><option value="RISK ASSESSMENT AND REFERRAL"> RISK ASSESSMENT AND REFERRAL </option><option value="TB TESTING FORM"> TB TESTING FORM </option><option value="TB INFECTION TESTING FORM"> TB INFECTION TESTING FORM </option><option value="TB TREATMENT INITIATION FORM"> TB TREATMENT INITIATION FORM </option><option value="TPT INITIATION FORM"> TPT INITIATION FORM </option><option value="TPT Outcome"> TPT Outcome </option></select><div className="text-danger"></div></div></div>
                                                            <Tabs defaultActiveKey="profile" id="uncontrolled-tab-example">
                                                                <Tab eventKey="home" title="English">

                                                                    <Form className="mt-5">
                                                                        <Form.Group controlId="formBasicEmail">
                                                                            <Form.Label>*Name</Form.Label>
                                                                            <Form.Control type="text" placeholder="" />

                                                                        </Form.Group>

                                                                        <Form.Group controlId="formBasicPassword">
                                                                            <Form.Label>*Type</Form.Label>
                                                                            <Form.Control as="select">
                                                                                <option>Select Type</option>
                                                                                <option>Text</option>
                                                                                <option>Option List</option>
                                                                                <option>Number</option>
                                                                                <option>Date</option>
                                                                                <option>Checkbox Options</option>
                                                                            </Form.Control>
                                                                        </Form.Group>

                                                                    </Form>
                                                                    <Form>

                                                                        {['radio'].map((type) => (
                                                                            <div key={`inline-${type}`} className="mb-3">
                                                                                <Form.Label className="mr-4">*Mandatory</Form.Label>
                                                                                <Form.Check inline label="Yes" name="group1" type={type} id={`inline-${type}-1`} />
                                                                                <Form.Check inline label="No" name="group1" type={type} id={`inline-${type}-2`} />

                                                                            </div>
                                                                        ))}
                                                                    </Form>
                                                                    <Form>
                                                                        <Form.Group controlId="exampleForm.ControlSelect1">
                                                                            <Form.Label>Parent question</Form.Label>
                                                                            <Form.Control as="select">
                                                                                <option>-</option>
                                                                                <option>Client Type </option>
                                                                                <option>Please specify</option>
                                                                                <option>Gender </option>
                                                                                <option>Are You Currently On TB Treatment? </option>
                                                                                <option>Site of Disease </option>
                                                                                <option>HIV Status </option>
                                                                                <option>Are you on ART?  </option>

                                                                            </Form.Control>
                                                                        </Form.Group>
                                                                    </Form>
                                                                    <div>
                                                                        <Button className="addbtn">Add</Button>
                                                                    </div>

                                                                </Tab>
                                                                <Tab eventKey="profile" title="Chinese">
                                                                    <Form className="mt-5">
                                                                        <Form.Group controlId="formBasicEmail">
                                                                            <Form.Label>*Name</Form.Label>
                                                                            <Form.Control type="text" placeholder="" />

                                                                        </Form.Group>



                                                                    </Form>


                                                                    <div>
                                                                        <Button className="addbtn">Add</Button>
                                                                    </div>
                                                                </Tab>
                                                                <Tab eventKey="contact" title="Spanish">
                                                                    <Form className="mt-5">
                                                                        <Form.Group controlId="formBasicEmail">
                                                                            <Form.Label>*Name</Form.Label>
                                                                            <Form.Control type="text" placeholder="" />

                                                                        </Form.Group>



                                                                    </Form>


                                                                    <div>
                                                                        <Button className="addbtn">Add</Button>
                                                                    </div>
                                                                </Tab>
                                                                <Tab eventKey="contact1" title="French">
                                                                    <Form className="mt-5">
                                                                        <Form.Group controlId="formBasicEmail">
                                                                            <Form.Label>*Name</Form.Label>
                                                                            <Form.Control type="text" placeholder="" />

                                                                        </Form.Group>



                                                                    </Form>


                                                                    <div>
                                                                        <Button className="addbtn">Add</Button>
                                                                    </div>
                                                                </Tab>
                                                                <Tab eventKey="contact2" title="Russian">
                                                                    <Form className="mt-5">
                                                                        <Form.Group controlId="formBasicEmail">
                                                                            <Form.Label>*Name</Form.Label>
                                                                            <Form.Control type="text" placeholder="" />

                                                                        </Form.Group>



                                                                    </Form>


                                                                    <div>
                                                                        <Button className="addbtn">Add</Button>
                                                                    </div>
                                                                </Tab>
                                                                <Tab eventKey="contact3" title="Bislama">
                                                                    <Form className="mt-5">
                                                                        <Form.Group controlId="formBasicEmail">
                                                                            <Form.Label>*Name</Form.Label>
                                                                            <Form.Control type="text" placeholder="" />

                                                                        </Form.Group>



                                                                    </Form>


                                                                    <div>
                                                                        <Button className="addbtn">Add</Button>
                                                                    </div>
                                                                </Tab>
                                                            </Tabs>
                                                        </Card.Body>
                                                    </Card>
                                                </div>

                                            </div>
                                            <div className="row pt-1">
                                                <div className="col-12 bnBtn">
                                                    <button tabIndex="-1" type="button" className="btn wizard-btnb  ml-3" >Back</button>
                                                    <button tabIndex="-1" type="button" className="btn wizard-btnn  mr-3">Next
                                                            </button>
                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                    <div className="tab-pane fade " id="pills-contact" role="tabpanel" aria-labelledby="pills-contact-tab">
                                        <div>
                                            <div className="row pt-1">
                                                <div className="col-12 bnBtn">
                                                    <button tabIndex="-1" type="button" className="btn wizard-btnb  ml-3" >Back</button>
                                                    <button tabIndex="-1" type="button" className="btn wizard-btnn  mr-3">Next
                                                            </button>
                                                </div>
                                            </div>
                                            <div className="row alertscontent">

                                                <div className="col-6">
                                                    <div className="row">
                                                        <div className="col-8">Alert Name</div>
                                                        <div className="col-3">Threshold in days</div>
                                                    </div>
                                                    <div className="row">
                                                        <div className="col-8 mt-4">
                                                            <input type="text" className="form-control" placeholder="TB Infection Testing Referral Alert" />
                                                        </div>
                                                        <div className="col-3 mt-4">
                                                            <div className="int-pm"><button className="int-pm-btn int-pm-decrement disabled">-</button><div role="spinbutton" tabIndex="0" aria-valuenow="0" aria-valuemin="0" className="int-pm-value">0</div><button className="int-pm-btn int-pm-increment">+</button></div>
                                                        </div>
                                                    </div>
                                                    <div className="row">
                                                        <div className="col-8 mt-3">
                                                            <input type="text" className="form-control" placeholder="TB Testing Referral Alert" />
                                                        </div>
                                                        <div className="col-3 mt-3">
                                                            <div className="int-pm"><button className="int-pm-btn int-pm-decrement disabled">-</button><div role="spinbutton" tabIndex="0" aria-valuenow="0" aria-valuemin="0" className="int-pm-value">0</div><button className="int-pm-btn int-pm-increment">+</button></div>
                                                        </div>
                                                    </div>
                                                    <div className="row">
                                                        <div className="col-8 mt-3">
                                                            <input type="text" className="form-control" placeholder="TBI Treatment Referral Alert" />
                                                        </div>
                                                        <div className="col-3 mt-3">
                                                            <div className="int-pm"><button className="int-pm-btn int-pm-decrement disabled">-</button><div role="spinbutton" tabIndex="0" aria-valuenow="0" aria-valuemin="0" className="int-pm-value">0</div><button className="int-pm-btn int-pm-increment">+</button></div>
                                                        </div>
                                                    </div>
                                                    <div className="row">
                                                        <div className="col-8 mt-3">
                                                            <input type="text" className="form-control" placeholder="TB Treatment Referral Alert" />
                                                        </div>
                                                        <div className="col-3 mt-3">
                                                            <div className="int-pm"><button className="int-pm-btn int-pm-decrement disabled">-</button><div role="spinbutton" tabIndex="0" aria-valuenow="0" aria-valuemin="0" className="int-pm-value">0</div><button className="int-pm-btn int-pm-increment">+</button></div>
                                                        </div>
                                                    </div>
                                                    <div className="row">
                                                        <div className="col-8 mt-3">
                                                            <input type="text" className="form-control" placeholder="TBI Re-testing Alert" />
                                                        </div>
                                                        <div className="col-3 mt-3">
                                                            <div className="int-pm"><button className="int-pm-btn int-pm-decrement disabled">-</button><div role="spinbutton" tabIndex="0" aria-valuenow="0" aria-valuemin="0" className="int-pm-value">0</div><button className="int-pm-btn int-pm-increment">+</button></div>
                                                        </div>
                                                    </div>
                                                    <div className="row">
                                                        <div className="col-8 mt-3">
                                                            <input type="text" className="form-control" placeholder="TB Re-testing Alert" />
                                                        </div>
                                                        <div className="col-3 mt-3">
                                                            <div className="int-pm"><button className="int-pm-btn int-pm-decrement disabled">-</button><div role="spinbutton" tabIndex="0" aria-valuenow="0" aria-valuemin="0" className="int-pm-value">0</div><button className="int-pm-btn int-pm-increment">+</button></div>
                                                        </div>
                                                    </div>
                                                </div>


                                                <div id="alertMultiselect" className="col-sm-5 ml-3">
                                                    <label >Select data variables (to be shown in the Client cards in Alerts Section of the App)</label><div tabIndex="-1" className="multiselect"><div className="multiselect__select"></div>  <div className="multiselect__tags"><div className="multiselect__tags-wrap"><span className="multiselect__tag"><span>Name</span> <i aria-hidden="true" tabIndex="1" className="multiselect__tag-icon"></i></span><span className="multiselect__tag"><span>Age in years</span> <i aria-hidden="true" tabIndex="1" className="multiselect__tag-icon"></i></span><span className="multiselect__tag"><span>Gender</span> <i aria-hidden="true" tabIndex="1" className="multiselect__tag-icon"></i></span><span className="multiselect__tag"><span>Phone Number</span> <i aria-hidden="true" tabIndex="1" className="multiselect__tag-icon"></i></span><span className="multiselect__tag"><span>Presently on anti-TB medication?</span> <i aria-hidden="true" tabIndex="1" className="multiselect__tag-icon"></i></span><span className="multiselect__tag"><span>Client Type</span> <i aria-hidden="true" tabIndex="1" className="multiselect__tag-icon"></i></span></div>  <div className="multiselect__spinner" ></div> <input name="" id="custom-multiselect" type="text" autoComplete="nope" placeholder="Pick data variables" tabIndex="0" className="multiselect__input" />  </div> <div tabIndex="-1" className="multiselect__content-wrapper" ><ul className="multiselect__content" >  <li className="multiselect__element"><span data-select="Press enter to select" data-selected="Selected" data-deselect="Press enter to remove" className="multiselect__option multiselect__option--selected"><span>Client Type</span></span> </li><li className="multiselect__element"><span data-select="Press enter to select" data-selected="Selected" data-deselect="Press enter to remove" className="multiselect__option"><span>Please specify</span></span> </li><li className="multiselect__element"><span data-select="Press enter to select" data-selected="Selected" data-deselect="Press enter to remove" className="multiselect__option multiselect__option--highlight"><span>Given Name</span></span> </li><li className="multiselect__element"><span data-select="Press enter to select" data-selected="Selected" data-deselect="Press enter to remove" className="multiselect__option"><span>Family Name</span></span> </li><li className="multiselect__element"><span data-select="Press enter to select" data-selected="Selected" data-deselect="Press enter to remove" className="multiselect__option"><span>Date of Birth</span></span> </li><li className="multiselect__element"><span data-select="Press enter to select" data-selected="Selected" data-deselect="Press enter to remove" className="multiselect__option"><span>Age</span></span> </li><li className="multiselect__element"><span data-select="Press enter to select" data-selected="Selected" data-deselect="Press enter to remove" className="multiselect__option multiselect__option--selected"><span>Gender</span></span> </li><li className="multiselect__element"><span data-select="Press enter to select" data-selected="Selected" data-deselect="Press enter to remove" className="multiselect__option"><span>Number of members in the household</span></span> </li><li className="multiselect__element"><span data-select="Press enter to select" data-selected="Selected" data-deselect="Press enter to remove" className="multiselect__option"><span>Phone Number (Primary)</span></span> </li><li className="multiselect__element"><span data-select="Press enter to select" data-selected="Selected" data-deselect="Press enter to remove" className="multiselect__option"><span>Phone Number (secondary)</span></span> </li><li className="multiselect__element"><span data-select="Press enter to select" data-selected="Selected" data-deselect="Press enter to remove" className="multiselect__option"><span>Address</span></span> </li><li className="multiselect__element"><span data-select="Press enter to select" data-selected="Selected" data-deselect="Press enter to remove" className="multiselect__option"><span>Are You Currently On TB Treatment?</span></span> </li><li className="multiselect__element"><span data-select="Press enter to select" data-selected="Selected" data-deselect="Press enter to remove" className="multiselect__option"><span>Date of initiation of TB treatment</span></span> </li><li className="multiselect__element"><span data-select="Press enter to select" data-selected="Selected" data-deselect="Press enter to remove" className="multiselect__option"><span>Site of Disease</span></span> </li><li className="multiselect__element"><span data-select="Press enter to select" data-selected="Selected" data-deselect="Press enter to remove" className="multiselect__option"><span>HIV Status</span></span> </li><li className="multiselect__element"><span data-select="Press enter to select" data-selected="Selected" data-deselect="Press enter to remove" className="multiselect__option"><span>Are you on ART?</span></span> </li><li className="multiselect__element"><span data-select="Press enter to select" data-selected="Selected" data-deselect="Press enter to remove" className="multiselect__option"><span>ART registration number</span></span> </li><li className="multiselect__element"><span data-select="Press enter to select" data-selected="Selected" data-deselect="Press enter to remove" className="multiselect__option"><span>Associate QR code</span></span> </li> <li ><span className="multiselect__option">No elements found. Consider changing the search query.</span></li> <li ><span className="multiselect__option">List is empty.</span></li> </ul></div></div></div>
                                            </div>
                                            <div className="row pt-1">
                                                <div className="col-12 bnBtn">
                                                    <button tabIndex="-1" type="button" className="btn wizard-btnb  ml-3" >Back</button>
                                                    <button tabIndex="-1" type="button" className="btn wizard-btnn  mr-3">Next
                                                            </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="tab-pane fade " id="pills-contact" role="tabpanel" aria-labelledby="pills-contact-tab">
                                        <div className="row">
                                            <div className="col-12 bnBtn">
                                                <button tabIndex="-1" type="button" className="btn wizard-btnb  ml-3" >Back</button>
                                                <button tabIndex="-1" type="button" className="btn wizard-btnn  mr-4" >Publish</button></div>
                                        </div>
                                        <div className="row"><div className=" mt-2 offset-sm-6 col-sm-6 work-flow-top-bar"><button type="button" className="btndownload"><a href="https://uatltbi.duredemos.com/Manual/PreventTB_TrainingManual_SmartSetup_V5.docx.pdf" target="_blank"> Download Manual</a></button></div></div>
                                        <div className="row"><div className="col-md-12"><div className="form-group  form-inline pull-left "><div className="fillsearch"><label className="mr-2">Filter:</label><input type="text" placeholder="Search query" autoComplete="off" /></div></div><div className="form-group form-inline pull-right VueTables__limit"></div></div></div>

                                        <div className="work-flow-table">
                                            <table className="table">
                                                <thead>
                                                    <tr><th tabIndex="0"  ><span title="" >Stage Name</span><span ></span><div className="resize-handle" ></div></th><th tabIndex="0" ><span title="" >ORW</span><span ></span></th><th tabIndex="0" ><span title="" >FACILITY</span><span ></span></th></tr>
                                                </thead>
                                                <tbody>
                                                    <tr className="VueTables__row "><td tabIndex="0" className="">Registration</td><td tabIndex="0" className=""><div data-v-538e1d14=""><div data-v-538e1d14=""><div className="checkbox"><label ><input type="checkbox" checked="checked" className="big-checkbox" /></label></div></div></div></td><td tabIndex="0" className=""><div ><div ><div className="checkbox"><label ><input type="checkbox" checked="checked" className="big-checkbox" /></label></div></div></div></td> </tr>

                                                    <tr className="VueTables__row "><td tabIndex="0" className="">RISK ASSESSMENT AND REFERRAL</td><td tabIndex="0" className=""><div ><div ><div className="checkbox"><label ><input type="checkbox" checked="checked" className="big-checkbox" /></label></div></div></div></td><td tabIndex="0" className=""><div ><div ><div className="checkbox"><label ><input type="checkbox" checked="checked" className="big-checkbox" /></label></div></div></div></td> </tr>

                                                    <tr className="VueTables__row "><td tabIndex="0" className="">TB TESTING FORM</td><td tabIndex="0" className=""><div ><div ><div className="checkbox"><label ><input type="checkbox" className="big-checkbox" /></label></div></div></div></td><td tabIndex="0" className=""><div ><div ><div className="checkbox"><label ><input type="checkbox" checked="checked" className="big-checkbox" /></label></div></div></div></td> </tr>

                                                    <tr className="VueTables__row "><td tabIndex="0" className="">TB INFECTION TESTING FORM</td><td tabIndex="0" className=""><div ><div ><div className="checkbox"><label ><input type="checkbox" className="big-checkbox" /></label></div></div></div></td><td tabIndex="0" className=""><div ><div ><div className="checkbox"><label ><input type="checkbox" checked="checked" className="big-checkbox" /></label></div></div></div></td> </tr>

                                                    <tr className="VueTables__row "><td tabIndex="0" className="">TB TREATMENT INITIATION FORM</td><td tabIndex="0" className=""><div ><div ><div className="checkbox"><label ><input type="checkbox" checked="checked" className="big-checkbox" /></label></div></div></div></td><td tabIndex="0" className=""><div ><div ><div className="checkbox"><label ><input type="checkbox" checked="checked" className="big-checkbox" /></label></div></div></div></td> </tr>

                                                    <tr className="VueTables__row "><td tabIndex="0" className="">TPT INITIATION FORM</td><td tabIndex="0" className=""><div ><div ><div className="checkbox"><label ><input type="checkbox" checked="checked" className="big-checkbox" /></label></div></div></div></td><td tabIndex="0" className=""><div ><div ><div className="checkbox"><label ><input type="checkbox" checked="checked" className="big-checkbox" /></label></div></div></div></td> </tr>

                                                    <tr className="VueTables__row "><td tabIndex="0" className="">TPT Outcome</td><td tabIndex="0" className=""><div ><div ><div className="checkbox"><label ><input type="checkbox" checked="checked" className="big-checkbox" /></label></div></div></div></td><td tabIndex="0" className=""><div ><div ><div className="checkbox"><label ><input type="checkbox" checked="checked" className="big-checkbox" /></label></div></div></div></td> </tr>
                                                </tbody>
                                            </table>

                                        </div>
                                        <div className=" mt-2 col-sm-12 work-flow-top-bar"> *Note : The workflow section is to assign roles to users, the sequence of the variables can be changed in the Forms section </div>
                                        <div className="row">
                                            <div className="col-12 bnBtn">
                                                <button tabIndex="-1" type="button" className="btn wizard-btnb  ml-3" >Back</button>
                                                <button tabIndex="-1" type="button" className="btn wizard-btnn  mr-4" >Publish</button></div>
                                        </div>


                                    </div>

                                </div>

                            </Card.Body>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SmartSetup;