import React, { useState ,useEffect } from "react";
import { Card, Button, Form, Tabs, Tab, Accordion } from 'react-bootstrap';
//redux
import { useSelector, useDispatch } from 'react-redux';
import { setActiveTab } from '../../redux/actions/userAction'
import programJson from '../../assets/data/usertemplate.json'


const ServicesStep = () => {
    const dispatch = useDispatch();
    const [stageArray, setStageArray] = useState(programJson.data[0].programtemplate.application[0].programs[0].stages)
    const [stageRenderKey, setStageRenderKey] = useState(0)
    
    const renderStages = () => {
        return (
            <>
                <Accordion defaultActiveKey="0" key={stageRenderKey} >
                    {stageArray.map((stage, index) => {
                        return (
                            <>
                                <Card>
                                    <Card.Header className="formtabletitle">
                                        <Accordion.Toggle className="formtableheader" as={Button} variant="link" eventKey={index.toString()}>
                                            <i className="fas fa-minus mr-2"></i> {stage.name}

                                        </Accordion.Toggle>
                                        <ul className="float-right define-services-tools d-inline m-0 p-0">
                                            <li className="d-inline">
                                                <i title="Edit Form Name" aria-hidden="true" className="fas fa-edit"></i>
                                                <i title="Add Question" aria-hidden="true" className="fa fa-plus mr-3"></i>
                                                <i title="Move Up" onClick={() => moveService(index,index-1)}  className="fas fa-long-arrow-alt-up"></i>
                                                <i title="Move Down" onClick={() => moveService(index,index+1)}  className="fas fa-long-arrow-alt-down"></i>
                                            </li>
                                        </ul>
                                    </Card.Header>
                                    <Accordion.Collapse eventKey={index.toString()}>
                                        <Card.Body className="formstables">
                                            <table className="table">
                                                <thead >
                                                    <tr >
                                                        <th width="30%">Questions</th>
                                                        <th >Type</th>
                                                        <th >Mandatory</th>
                                                        <th >Hide</th>
                                                        <th width="20%">Role</th>
                                                        <th className="text-right">Actions</th>
                                                        <th className="text-right">Sequence</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="formsbody">
                                                    {stage.dataelements.map((element, idx) => {
                                                        return (
                                                            <>
                                                                <tr className="">
                                                                    <td >{element.name}</td>
                                                                    <td className="texttablestyle">{element.attributeRefType}</td>
                                                                    <td className="texttablestyle">{element.mandatory == true ? "Yes" : "No"}</td>
                                                                    <td className="texttablestyle"></td>
                                                                    <td className="p-1"></td>
                                                                    <td className="td-actions text-right">
                                                                        <button type="button" title="Add Question" className="btn btn-info btn_Edit"><i className="fas fa-plus"></i></button>
                                                                        <button type="button" title="Edit Question" className="btn btn-info btn_Edit"><i className="fa fa-pencil-alt"></i></button>
                                                                    </td>
                                                                    <td className="text-right sequence-column">
                                                                        <span title="Move Up">
                                                                            <i onClick={() => moveQuestion(idx,idx-1,stage.dataelements,stage.name)} className="fas fa-long-arrow-alt-up"></i>
                                                                        </span>
                                                                        <span title="Move Down">
                                                                            <i onClick={() => moveQuestion(idx,idx+1,stage.dataelements,stage.name)} className="fas fa-long-arrow-alt-down"></i>
                                                                        </span>
                                                                    </td>
                                                                </tr>    
                                                            </>
                                                        )
                                                    })}
                                                </tbody>
                                            </table>
                                        </Card.Body>
                                    </Accordion.Collapse>
                                </Card>
                            </>
                        )
                    })}
                </Accordion>
            </>
        )
    }
    const move = (array, from, to, on = 1) => {
        return array = array.slice(), array.splice(to, 0, ...array.splice(from, on)), array
    }
    const moveService = (from, to) => {
        if (to != -1 && from < stageArray.length) {
            setStageArray(move(stageArray, from, to))
        }
    }
    const moveQuestion = (from, to, questionArr, stagenameKey) => {
        stageArray.map((el,idx) => {
            if (el.name == stagenameKey) {
                if(to != -1 && from < questionArr.length){
                    el.dataelements = move(questionArr, from, to)
                }
                el.name = ''
                el.name = stagenameKey
                setStageRenderKey(stageRenderKey + 1)
            }
        })
    }
    return (
        <>
            <div className="row pt-1">
                <div className="col-12 bnBtn">
                    <button tabIndex="-1" type="button" className="btn wizard-btnb  ml-3" onClick={() => dispatch(setActiveTab('step2'))}>Back</button>
                    <button tabIndex="-1" type="button" className="btn wizard-btnn  mr-3" onClick={() => dispatch(setActiveTab('step4'))}>Next</button>
                </div>
            </div>
            <div className="row mb-2 ml-2">
                <div className="col-12">
                    <button type="button" data-toggle="tooltip" title="Edit Form Name" className="btn addbtn mt-2"> Add Form </button>

                </div>
            </div>

            <div className="row m-2 formcontent">
                <div className="col-8" key={stageRenderKey}>
                    {renderStages()}
                    <Accordion defaultActiveKey="0" style={{ display: 'none' }}>
                        <Card>
                            <Card.Header className="formtabletitle">
                                <Accordion.Toggle className="formtableheader" as={Button} variant="link" eventKey="0">
                                    <i className="fas fa-minus mr-2"></i> RISK ASSESSMENT AND REFERRAL

                                </Accordion.Toggle>
                                <ul className="float-right define-services-tools d-inline m-0 p-0">

                                    <li className="d-inline"><i title="Edit Form Name" aria-hidden="true" className="fas fa-edit"></i><i title="Add Question" aria-hidden="true" className="fa fa-plus mr-3"></i><i title="Move Up" className="fas fa-long-arrow-alt-up"></i><i title="Move Down" className="fas fa-long-arrow-alt-down"></i></li></ul>
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
                                <ul className="float-right define-services-tools d-inline m-0 p-0">

                                    <li className="d-inline"><i title="Edit Form Name" aria-hidden="true" className="fas fa-edit"></i><i title="Add Question" aria-hidden="true" className="fa fa-plus mr-3"></i><i title="Move Up" className="fas fa-long-arrow-alt-up"></i><i title="Move Down" className="fas fa-long-arrow-alt-down"></i></li></ul>
                            </Card.Header>
                            <Accordion.Collapse eventKey="1">
                                <Card.Body className="formstables">
                                    <table className="table">
                                        <thead ><tr ><th width="30%">Questions</th><th >Type</th><th >Mandatory</th><th >Hide</th><th width="20%">Role</th><th className="text-right">Actions</th><th className="text-right">Sequence</th></tr></thead>

                                        <tbody className="formsbody">
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
                                <ul className="float-right define-services-tools d-inline m-0 p-0">

                                    <li className="d-inline"><i title="Edit Form Name" aria-hidden="true" className="fas fa-edit"></i><i title="Add Question" aria-hidden="true" className="fa fa-plus mr-3"></i><i title="Move Up" className="fas fa-long-arrow-alt-up"></i><i title="Move Down" className="fas fa-long-arrow-alt-down"></i></li></ul>
                            </Card.Header>
                            <Accordion.Collapse eventKey="2">
                                <Card.Body className="formstables">
                                    <table className="table">
                                        <thead ><tr ><th width="30%">Questions</th><th >Type</th><th >Mandatory</th><th >Hide</th><th width="20%">Role</th><th className="text-right">Actions</th><th className="text-right">Sequence</th></tr>
                                        </thead>
                                        <tbody className="formsbody">
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
                                <ul className="float-right define-services-tools d-inline m-0 p-0">

                                    <li className="d-inline"><i title="Edit Form Name" aria-hidden="true" className="fas fa-edit"></i><i title="Add Question" aria-hidden="true" className="fa fa-plus mr-3"></i><i title="Move Up" className="fas fa-long-arrow-alt-up"></i><i title="Move Down" className="fas fa-long-arrow-alt-down"></i></li></ul>
                            </Card.Header>
                            <Accordion.Collapse eventKey="3">
                                <Card.Body className="formstables">
                                    <table className="table">
                                        <thead ><tr ><th width="30%">Questions</th><th >Type</th><th >Mandatory</th><th >Hide</th><th width="20%">Role</th><th className="text-right">Actions</th><th className="text-right">Sequence</th></tr></thead>

                                        <tbody className="formsbody">
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
                                <ul className="float-right define-services-tools d-inline m-0 p-0">

                                    <li className="d-inline"><i title="Edit Form Name" aria-hidden="true" className="fas fa-edit"></i><i title="Add Question" aria-hidden="true" className="fa fa-plus mr-3"></i><i title="Move Up" className="fas fa-long-arrow-alt-up"></i><i title="Move Down" className="fas fa-long-arrow-alt-down"></i></li></ul>
                            </Card.Header>
                            <Accordion.Collapse eventKey="4">
                                <Card.Body className="formstables">
                                    <table className="table">
                                        <thead ><tr ><th width="30%">Questions</th><th >Type</th><th >Mandatory</th><th >Hide</th><th width="20%">Role</th><th className="text-right">Actions</th><th className="text-right">Sequence</th></tr></thead>

                                        <tbody className="formsbody">
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
                                <ul className="float-right define-services-tools d-inline m-0 p-0">

                                    <li className="d-inline"><i title="Edit Form Name" aria-hidden="true" className="fas fa-edit"></i><i title="Add Question" aria-hidden="true" className="fa fa-plus mr-3"></i><i title="Move Up" className="fas fa-long-arrow-alt-up"></i><i title="Move Down" className="fas fa-long-arrow-alt-down"></i></li></ul>
                            </Card.Header>
                            <Accordion.Collapse eventKey="4">
                                <Card.Body className="formstables">
                                    <table className="table">
                                        <thead ><tr ><th width="30%">Questions</th><th >Type</th><th >Mandatory</th><th >Hide</th><th width="20%">Role</th><th className="text-right">Actions</th><th className="text-right">Sequence</th></tr></thead>

                                        <tbody className="formsbody">
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

            <div className="row pt-1 mb-4">
                <div className="col-12 bnBtn">
                    <button tabIndex="-1" type="button" className="btn wizard-btnb  ml-3" onClick={() => dispatch(setActiveTab('step2'))}>Back</button>
                    <button tabIndex="-1" type="button" className="btn wizard-btnn  mr-3" onClick={() => dispatch(setActiveTab('step4'))}>Next
                    </button>
                </div>
            </div>
        </>
    )
}

export default ServicesStep;