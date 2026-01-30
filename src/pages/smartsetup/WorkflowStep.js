import React from "react";
//redux
import { useSelector,useDispatch } from 'react-redux';
import {setActiveTab} from '../../redux/actions/userAction'
const WorkflowStep = ()=>{
    const dispatch = useDispatch();

    return(
        <>
            <div className="row">
                <div className="col-12 bnBtn">
                    <button tabIndex="-1" type="button" className="btn wizard-btnb  ml-3" onClick={()=>dispatch(setActiveTab('step3'))}>Back</button>
                    <button tabIndex="-1" type="button" className="btn wizard-btnn  mr-4" >Publish</button>
                </div>
            </div>
            
            <div className="row m-2"><div className="mt-2 mb-0 offset-sm-6 col-sm-6 work-flow-top-bar"><button type="button" className="btn btndownload"><a href="https://uatltbi.duredemos.com/Manual/PreventTB_TrainingManual_SmartSetup_V5.docx.pdf" target="_blank"> Download Manual</a></button></div></div>
            <div className="row ml-1"><div className="col-md-12"><div className="form-group  form-inline pull-left mb-0"><div className="fillsearch"><label className="mr-2">Filter:</label><input type="text" placeholder="Search query" autoComplete="off" /></div></div><div className="form-group form-inline pull-right VueTables__limit"></div></div></div>

            <div className="work-flow-table mx-3 mt-0">
                <table className="table">
                    <thead>
                        <tr><th tabIndex="0"  ><span title="" >Stage Name</span><span ></span><div className="resize-handle" ></div></th><th tabIndex="0" ><span title="" >ORW</span><span ></span></th><th tabIndex="0" ><span title="" >FACILITY</span><span ></span></th></tr>
                    </thead>
                    <tbody>
                        <tr className="VueTables__row "><td tabIndex="0" className="workFlowdtdata">Registration</td><td tabIndex="0" className="workFlowdtdata"><div data-v-538e1d14=""><div data-v-538e1d14=""><div className="checkbox"><label ><input type="checkbox" checked="checked" className="big-checkbox" /></label></div></div></div></td><td tabIndex="0" className="workFlowdtdata"><div ><div ><div className="checkbox"><label ><input type="checkbox" checked="checked" className="big-checkbox" /></label></div></div></div></td> </tr>

                        <tr className="VueTables__row "><td tabIndex="0" className="workFlowdtdata">RISK ASSESSMENT AND REFERRAL</td><td tabIndex="0" className="workFlowdtdata"><div ><div ><div className="checkbox"><label ><input type="checkbox" checked="checked" className="big-checkbox" /></label></div></div></div></td><td tabIndex="0" className="workFlowdtdata"><div ><div ><div className="checkbox"><label ><input type="checkbox" checked="checked" className="big-checkbox" /></label></div></div></div></td> </tr>

                        <tr className="VueTables__row "><td tabIndex="0" className="workFlowdtdata">TB TESTING FORM</td><td tabIndex="0" className="workFlowdtdata"><div ><div ><div className="checkbox"><label ><input type="checkbox" className="big-checkbox" /></label></div></div></div></td><td tabIndex="0" className="workFlowdtdata"><div ><div ><div className="checkbox"><label ><input type="checkbox" checked="checked" className="big-checkbox" /></label></div></div></div></td> </tr>

                        <tr className="VueTables__row "><td tabIndex="0" className="workFlowdtdata">TB INFECTION TESTING FORM</td><td tabIndex="0" className="workFlowdtdata"><div ><div ><div className="checkbox"><label ><input type="checkbox" className="big-checkbox" /></label></div></div></div></td><td tabIndex="0" className="workFlowdtdata"><div ><div ><div className="checkbox"><label ><input type="checkbox" checked="checked" className="big-checkbox" /></label></div></div></div></td> </tr>

                        <tr className="VueTables__row "><td tabIndex="0" className="workFlowdtdata">TB TREATMENT INITIATION FORM</td><td tabIndex="0" className="workFlowdtdata"><div ><div ><div className="checkbox"><label ><input type="checkbox" checked="checked" className="big-checkbox" /></label></div></div></div></td><td tabIndex="0" className="workFlowdtdata"><div ><div ><div className="checkbox"><label ><input type="checkbox" checked="checked" className="big-checkbox" /></label></div></div></div></td> </tr>

                        <tr className="VueTables__row "><td tabIndex="0" className="workFlowdtdata">TPT INITIATION FORM</td><td tabIndex="0" className="workFlowdtdata"><div ><div ><div className="checkbox"><label ><input type="checkbox" checked="checked" className="big-checkbox" /></label></div></div></div></td><td tabIndex="0" className="workFlowdtdata"><div ><div ><div className="checkbox"><label ><input type="checkbox" checked="checked" className="big-checkbox" /></label></div></div></div></td> </tr>

                        <tr className="VueTables__row "><td tabIndex="0" className="workFlowdtdata">TPT Outcome</td><td tabIndex="0" className="workFlowdtdata"><div ><div ><div className="checkbox"><label ><input type="checkbox" checked="checked" className="big-checkbox" /></label></div></div></div></td><td tabIndex="0" className="workFlowdtdata"><div ><div ><div className="checkbox"><label ><input type="checkbox" checked="checked" className="big-checkbox" /></label></div></div></div></td> </tr>
                    </tbody>
                </table>

            </div>
            <div>
            <p className=" text-left col-md-12">7 records</p>
            </div>
            <div className=" mt-2 col-sm-12 work-flow-top-bar"> *Note : The workflow section is to assign roles to users, the sequence of the variables can be changed in the Forms section </div>

            <div className="row mb-4">
                <div className="col-12 bnBtn">
                    <button tabIndex="-1" type="button" className="btn wizard-btnb  ml-3" onClick={()=>dispatch(setActiveTab('step3'))}>Back</button>
                    <button tabIndex="-1" type="button" className="btn wizard-btnn  mr-4" >Publish</button>
                </div>
            </div>
        </>
    )
}
export default WorkflowStep;