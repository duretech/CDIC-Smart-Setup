import React from "react";
//redux
import { useSelector,useDispatch } from 'react-redux';
import {setActiveTab} from '../../redux/actions/userAction'

const AlertsStep = ()=>{
    const dispatch = useDispatch();
    return(
        <>
            <div className="row pt-1">
                <div className="col-12 bnBtn">
                    <button tabIndex="-1" type="button" className="btn wizard-btnb  ml-3" onClick={()=>dispatch(setActiveTab('step2'))}>Back</button>
                    <button tabIndex="-1" type="button" className="btn wizard-btnn  mr-3" onClick={()=>dispatch(setActiveTab('step4'))}>Next</button>
                </div>
            </div>
            <div className="row alertscontent m-2">
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
            <div className="row pt-1 mb-4">
                <div className="col-12 bnBtn">
                    <button tabIndex="-1" type="button" className="btn wizard-btnb  ml-3" onClick={()=>dispatch(setActiveTab('step2'))}>Back</button>
                    <button tabIndex="-1" type="button" className="btn wizard-btnn  mr-3" onClick={()=>dispatch(setActiveTab('step4'))}>Next</button>
                </div>
            </div>
        </>
    )
}
export default AlertsStep;