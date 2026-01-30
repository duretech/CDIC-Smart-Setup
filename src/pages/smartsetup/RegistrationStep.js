import React from "react";
import { Card,  Button, Form, Tabs, Tab } from 'react-bootstrap';
//redux
import { useSelector,useDispatch } from 'react-redux';
import {setActiveTab} from '../../redux/actions/userAction'

const RegistrationStep = () =>{
    const dispatch = useDispatch();

    return(
        <>
            <div className="row pt-1">
                <div className="col-12 bnBtn">
                    <button tabIndex="-1" type="button" className="btn wizard-btnb  ml-3" onClick={()=>dispatch(setActiveTab('step1'))} >Back</button>
                    <button tabIndex="-1" type="button" className="btn wizard-btnn  mr-3" onClick={()=>dispatch(setActiveTab('step3'))} >Next
                    </button>
                </div>
            </div>
            <div className="row m-2">
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
            <div className="row pt-1 mb-4">
                <div className="col-12 bnBtn">
                    <button tabIndex="-1" type="button" className="btn wizard-btnb  ml-3" onClick={()=>dispatch(setActiveTab('step1'))}>Back</button>
                    <button tabIndex="-1" type="button" className="btn wizard-btnn  mr-3" onClick={()=>dispatch(setActiveTab('step3'))}>Next</button>
                </div>
            </div>
        </>
    )
}
export default RegistrationStep