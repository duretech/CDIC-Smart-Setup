import React, { useState, useEffect, useRef } from "react";
//redux
import { useSelector, useDispatch } from 'react-redux';
import { setActiveTab } from '../../redux/actions/userAction'
import programJson from '../../assets/data/usertemplate.json'
import Select from 'react-select';

const AlertsStep = () => {
    const dispatch = useDispatch();
    const storeState = useSelector((state) => state )
    // console.log(storeState)
    const userTemplate = useSelector((state) => state.programDetails.userTemplate)
    const [alerts, setAlerts] = useState(userTemplate.programstages.map(el => {
        if (el.threshold == null) el.threshold = 0
        return el
    }))
    // const trackedentityattributesArray = [
    //     { value: "Due Days", label: "Due Days" },
    //     { value: "Year", label: "Year" },
    //     { value: "Month", label: "Month" },
    //     { value: "County", label: "County" }
    // ]
    // const [alertQuestion, setAlertQuestion] = useState([])
    // const onQuestionSelect = selectedOption => {
    //     console.log(selectedOption)
    //     setAlertQuestion([...selectedOption])
    // }
    useEffect(() => {
        setAlerts(userTemplate.alerts)
    }, [userTemplate.alerts])

    // const frequencyChange = (alertIndex, frequency) => {
    //     let arrayHolder = alerts
    //     arrayHolder[alertIndex].period = frequency
    //     setAlerts([...arrayHolder])
    //     console.log(arrayHolder)
    // }

    const renderAlerts = () => {
        return (
            <>
                {alerts.map((alert, idx) => {
                    return (
                        <div key={idx} className="row">
                            <div className="col-8 mt-4">
                                <input type="text" onChange={(e) => {
                                    let tempArr = alerts
                                    tempArr[idx].name = e.target.value
                                    setAlerts([...tempArr])
                                }} value={alert.name} className="form-control" />
                            </div>
                            <div className="col-3 mt-4">
                                {/* <select
                                    type='text'
                                    className='h-100 form-control form-control-sm'
                                    value={alert.period}
                                    onChange={(e) => frequencyChange(idx, e.target.value)}
                                    disabled={storeState.user.isEdit && alert.id ? true : false}
                                >
                                    {
                                        (userTemplate.frequencyOptions.length > 0)
                                            ? userTemplate.frequencyOptions.map((frequency, idx) => {
                                                return <option value={frequency.label} key={idx}>{frequency.label}</option>
                                            })
                                            : ""
                                    }
                                </select> */}
                               
                                <div className="int-pm">
                                    <button
                                        onClick={(e) => {
                                            let tempArr = alerts
                                            tempArr[idx]['threshold'] = alerts[idx]['threshold'] != 0 ? alerts[idx]['threshold'] - 1 : alerts[idx]['threshold']
                                            setAlerts([...tempArr])
                                        }}
                                        className="int-pm-btn int-pm-decrement" disabled={alerts[idx]['threshold'] == 0 ? true : false}>-</button>
                                    <div role="spinbutton" tabIndex="0" aria-valuenow="0" aria-valuemin="0" className="int-pm-value">{alert['threshold'] ? alert['threshold'] : 0}</div>
                                    <button
                                        onClick={(e) => {
                                            let tempArr = alerts
                                            tempArr[idx]['threshold'] = alerts[idx]['threshold'] + 1
                                            setAlerts([...tempArr])
                                        }}
                                        className="int-pm-btn int-pm-increment">+</button>
                                </div>
                            </div>
                            
                        </div>
                    )
                })}
            </>
        )
    }
    return (
        <>
            <div className="row pt-1">
                <div className="col-12 bnBtn">
                    <button tabIndex="-1" type="button" className="btn wizard-btnb  ml-3" onClick={() => dispatch(setActiveTab('step3'))}>Back</button>
                    <button tabIndex="-1" type="button" className="btn wizard-btnn  mr-3" onClick={() => dispatch(setActiveTab('step5'))}>Next</button>
                </div>
            </div>
            <div className="row alertscontent m-2 ml-8">
                <div className="col-8">
                    <div className="row">
                        <div className="col-8">Alert Name</div>
                        <div className="col-3">Threshold in days</div>
                        {/* <div className="col-3">Period</div> */}
                    </div>
                    {renderAlerts()}
                </div>


                {/* <div id="alertMultiselect" className="col-sm-5 ml-3">
                    <label >Select data variables (to be shown in the Client cards in Alerts Section of the App)</label>
                     <Select
                        className="basic-multi-select multiselect"
                        classNamePrefix="select"
                        isMulti
                        options={trackedentityattributesArray}
                        menuIsOpen={true}
                        // defaultValue={{ label: "English", value: 'en' }}
                        // isClearable={true}
                        //isSearchable={true}
                        onChange={onQuestionSelect}
                    /> 

                </div> */}
            </div>
            <div className="row pt-1 mb-4">
                <div className="col-12 bnBtn">
                    <button tabIndex="-1" type="button" className="btn wizard-btnb  ml-3" onClick={() => dispatch(setActiveTab('step3'))}>Back</button>
                    <button tabIndex="-1" type="button" className="btn wizard-btnn  mr-3" onClick={() => dispatch(setActiveTab('step5'))}>Next</button>
                </div>
            </div>
        </>
    )
}
export default AlertsStep;