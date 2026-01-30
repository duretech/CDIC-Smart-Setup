import React, { useState, useEffect } from "react";
import moment from "moment";
import { baseUrl } from "../../util/urls";
import {
  Card,
  Nav,
  Navbar,
  Button,
  Form,
  Row,
  Col,
} from "react-bootstrap";
import Select from "react-select";
import { useHistory } from "react-router-dom";
//redux
import { useSelector, useDispatch } from "react-redux";
// import { ErrorMessage, Field, useField, Formik, Form as FForm } from "formik";
import imgurl from "../../assets/images/imgUrl";
import API from "../../util";
// import TextError from "../../component/ErrorText";
import Sibebar from "../../component/Sidebar";
import Swal from "sweetalert2";

import { setLoader } from "../../redux/actions/userAction";

import Tab from "react-bootstrap/Tab";
// import TabContainer from "react-bootstrap/TabContainer";
// import TabContent from "react-bootstrap/TabContent";
// import TabPane from "react-bootstrap/TabPane";

import Table from "../datalog/LogTable";

const nameOfTemplate = {
  weekly: "template_weekly",
  monthly: "template_month",
  yearly: "template_year",
};

const XlUpload = () => {
  const history = useHistory();
  const storeState = useSelector((state) => state);
  const dispatch = useDispatch();
  const userStoreState = useSelector((state) => state.user);
  const logoutClickHandler = () => {
    sessionStorage.clear();
    history.push("/");
  };
  const [fileName, setFileName] = useState("Select File");
  const [selectedFile, setSelectedFile] = useState(null);
  const [dataSetArr, setdataSetArr] = useState([]);
  const [selecteddataset, setselecteddataset] = useState(null);
  const [prevselecteddataset, setprevselecteddataset] = useState(null);
  const [isdownload, setisdownload] = useState(false);
  const [tabActiveKey, settabActiveKey] = useState("first");
  const [templateURL, settemplateURL] = useState(null);
  const [templateName, settemplateName] = useState(null);
  const [email, setemail] = useState(null);
  const [logTableKey, setlogTableKey] = useState(0);
  const [logData, setlogData] = useState([]);
  const [uploadlogshow, setuploadlogshow] = useState(false);
  // const [datasetperiod, setdatasetperiod] = useState(null);
  const [stateValue, setstateValue] = useState("");
  const [districtValue, setdistrictValue] = useState("");
  const [showState, setShowState] = useState(false);
  const [showDistrict, setShowDistrict] = useState(false);
  const [stateUid, setStateUid] = useState("");
  const [districtUid, setDistrictUid] = useState("");


  useEffect(() => {
    return () => {
      //cleanup
    };
  }, []);

  useEffect(() => {
    getDropDown();
  }, []);

  useEffect(() => {
    if (storeState.user.userDetails) {
      getDataSet();
    }
  }, [storeState.user.userDetails]);

  const getDataSet = () => {
    dispatch(setLoader(true));
    if (!storeState.user.userDetails.organisationUnits[0].id) {
      return;
    }
    API.get(
      `/dataset/smartsetup/get/${storeState.user.userDetails.organisationUnits[0].id}`
    ).then((res) => {
      console.log("smartsetup/get>>>", res);
      console.log(storeState.user.userDetails.organisationUnits[0].id);
      dispatch(setLoader(false));
      if (res.data.data) {
        let temparr = [];
        res.data.data.forEach((element) => {
          console.log(res.data.data);
          if (element.isActive) {
            console.log(element);
            temparr.push({
              value: element.id,
              id: element.id,
              label: element.name,
              period: element.period,
              level: element.level,
            });
          }
          // setdataSetArr([
          //   ...dataSetArr,
          //   {
          //     value: element.id,
          //     id: element.id,
          //     label: element.name,
          //     period: element.period
          //   }
          // ])
        });
        setdataSetArr(temparr);
        console.log(temparr);
      }
    });
  };
  const getDropDown = () => {
    API.get(
      `/organisationUnits/${storeState.user.userDetails.organisationUnits[0].id}` +
        `?fields=id,children[id,name]`
    ).then((res) => {
      console.log("dropdown data stage 1", res);
      console.log(res);
      if (res.data.children) {
        let state = [];
        res.data.children.forEach((element) => {
          console.log(element);
          state.push({
            value: element.id,
            id: element.id,
            label: element.name,
          });
        });
        setstateValue(state);
      }
    });
  };

  const onHandleSelect = (event) => {
    // console.log(event.id)
    setStateUid(event.id)
    API.get(
      `/organisationUnits/${event.id}` + `?fields=id,children[id,name]`
    ).then((res) => {
      console.log(res);
      if (res.data.children) {
        let district = [];
        res.data.children.forEach((element) => {
          district.push({
            value: element.id,
            id: element.id,
            label: element.name,
          });
        });
        setdistrictValue(district);
      }
    });
  };
  // getDropDown();

  const getDataLog = () => {
    dispatch(setLoader(true));
    let params = {
      useruid: userStoreState.userDetails.id, //userStoreState.userDetails.id,
      datasetuid: selecteddataset.id, //selectedoption.id,
      orguid: userStoreState.userDetails.organisationUnits[0].id, //userStoreState.userDetails.organisationUnits[0].id
    };
    API.get("/dataset/bulk/data/logs", { params: params }).then((res) => {
      dispatch(setLoader(false));
      console.log("getDataLog>>>", res);
      if (res.data.data && res.data.data.length > 0) {
        let temparr = res.data.data.map((o) => {
          return {
            ...o,
            uploadedOn: moment(o.uploadedOn).format("YYYY-MM-DD hh:mm A"),
          };
        });

        setlogData(temparr.reverse());
        setlogTableKey(Math.random());
      } else {
        setlogData([]);
        setlogTableKey(Math.random());
      }
    });
  };

  const getFileFormatUrl = (selectedoption) => {
    dispatch(setLoader(true));
    // let params = {
    //   useruid: userStoreState.userDetails.id, //userStoreState.userDetails.id,
    //   datasetuid: selectedoption.id, //selectedoption.id,
    //   orguid: userStoreState.userDetails.organisationUnits[0].id, //userStoreState.userDetails.organisationUnits[0].id
    // }
    let params = {
      datasetid: selectedoption.id,
      useruid: userStoreState.userDetails.id,
    };
    console.log("getFileFormatUrl>>", params);

    // API.get('/dataset/bulk/data/logs', {params: params})
    API.post(`/dataset/bulk/template/download`, params).then((res) => {
      dispatch(setLoader(false));

      console.log("bulk/data/logs>>>", res, typeof res.data, res.data);

      // if(res.data.data && res.data.data.length > 0) {
      //   console.log('resjson>>>44', res.data.data[0].fileName)
      settemplateURL(`${baseUrl}uploadedfiles/template/${res.data.filename}`);
      settemplateName(res.data.filename);
      console.log(res);
      // }

      // if(res.data.data && res.data.data.length > 0) {
      //   let temparr = res.data.data.map(o => {
      //     return {
      //       ...o,
      //       uploadedOn: moment(o.uploadedOn).format("YYYY-MM-DD hh:mm A")
      //     }
      //   })

      //   setlogData(temparr.reverse())
      //   setlogTableKey(Math.random())
      // } else {
      //   setlogData([])
      //   setlogTableKey(Math.random())
      // }

      // let resjson = res.data.replaceAll("\"(.+)\"", "$1");
      // let resjson = JSON.parse(res.data);

      // console.log('resjson>>>11', resjson, typeof resjson)

      // let resjson1 = resjson.replaceAll("\"(.+)\"", "$1");
      // console.log('resjson>>>22', resjson1, typeof resjson1)

      // console.log('resjson>>>33', resjson1.data)

      // console.log('resjson>>>44', res.data.data[0].fileName)

      // if(resjson) {
      //   let parseres = JSON.parse(resjson)
      // settemplateURL(baseUrl+res.data.data[0])
      // }
    });
  };

  const changeHandler = (e) => {
    setFileName(e.target.files[0].name);
    var file = e.target.files[0];

    setSelectedFile(file);

    return;

    function updateProgress(evt) {
      if (evt.lengthComputable) {
        var loaded = evt.loaded / evt.total;
        if (loaded < 1) {
        }
      }
    }

    function loaded(evt) {
      // Obtain the read file data
      var fileString = evt.target.result;
      // Handle UTF-16 file dump
      setSelectedFile(fileString);
      // console.log(fileString)
      // $('#output_field').text(fileString);
    }
    var res = readFile(file);

    var reader = new FileReader();

    reader.readAsText(file, "UTF-8");

    reader.onprogress = updateProgress;
    reader.onload = loaded;
    // console.log(readFile(file))
  };
  function readFile(file) {
    var reader = new FileReader(),
      result = "empty";
    reader.onload = function (e) {
      result = e.target.result;
    };

    reader.readAsText(file);
    return result;
  }
  const uploadXML = () => {
    let regex = new RegExp("[a-z0-9]+@[a-z]+.[a-z]{2,3}");

    // let testEmails = [
    //   "notanemail.com",
    //   "workingexample@email.com",
    //   "another_working@somethingelse.org",
    //   "notworking@1.com",
    // ];

    // testEmails.forEach((address) => {
    //   console.log(regex.test(address));
    // });

    if (!selectedFile) {
      return;
    }

    if (email) {
      let tempemail = email.split(",");
      let isemailvalid = true;
      let invalidemailarr = [];
      tempemail.forEach((address) => {
        if (!regex.test(address)) {
          isemailvalid = false;
          invalidemailarr.push(address);
        }
        console.log(address, "->", regex.test(address));
      });

      if (!isemailvalid) {
        let colhtml = "";
        invalidemailarr.map((idx) => {
          colhtml += `<div class="col col-6 text-center">${idx}</div>`;
        });
        console.log("colhtml>>", colhtml);

        Swal.fire({
          title: "Error",
          html: `<div class="container bulk-upload-success-Swal text-center">
              <div class="row">
                <div class="col-12 text-center"><b>Invalid email id</b></div>
                ${colhtml}
              </div>
            </div>`,
          icon: "error",
          button: "Close",
        });
        return;
      }
    }

    dispatch(setLoader(true));

    console.log("uploadXML>>", email, userStoreState.userDetails);
    // let params = {
    //   datasetid: selecteddataset.id,
    //   orgid: userStoreState.userDetails.organisationUnits[0].id,
    //   file: selectedFile,
    //   useruid: userStoreState.userDetails.id,
    //   username: userStoreState.userDetails.userCredentials.username,
    //   email: email
    // }
    // console.log('uploadXML>>>', params)
    var orguid = ''
    if(selecteddataset.level == '1')
      orguid = userStoreState.userDetails.organisationUnits[0].id
    else if(selecteddataset.level == '2')
      orguid =  stateUid
    else if(selecteddataset.level == '3')
      orguid =  districtUid
    var formdata = new FormData();
    formdata.append("datasetid", selecteddataset.id);
    formdata.append(
      "orgid",
      orguid
    );
    formdata.append("useruid", userStoreState.userDetails.id);
    formdata.append(
      "username",
      userStoreState.userDetails.userCredentials.username
    );
    formdata.append("email", email || "");
    formdata.append("file", selectedFile);
    // return;
    API.post("/dataset/bulk/data3/uploadnew", formdata, { multipart: true })
      .then((res) => {
        // API.post('/dataset/bulk/data/upload', formdata).then(res => {
        dispatch(setLoader(false));
        console.log("bulk/data/upload>>", res, JSON.stringify(res.data));

        // var dataStr = "data:text/csv;charset=utf-8," + encodeURIComponent(JSON.stringify(res.data));
        // var dlAnchorElem = document.getElementById('downloadAnchorElem');
        // dlAnchorElem.setAttribute("href",dataStr);
        // dlAnchorElem.setAttribute("download", "scene.json");
        // dlAnchorElem.click();
        // console.log('bulk/data/upload>>111', dataStr)

        // const byteArray = new Uint8Array(res.data);
        if (res.data) {
          //https://uathsrc.imonitorplus.com/uploadedfiles/
          const a = window.document.createElement("a");
          a.href = `${baseUrl}uploadedfiles/${res.data.filename}`;
          a.download = `${res.data.filename}`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
        }

        // Remove anchor from body
        // document.body.removeChild(link)

        if (res.data) {
          // setSelectedFile(null)
          // setFileName('Select File')

          // if(success) {
          Swal.fire({
            title: "Success",
            html: `<div class="container bulk-upload-success-Swal text-center">
              <div class="row"><div class="col text-center"><b>File uploaded successfully</b></div></div>
              <div class="row"></div>
            </div>`,
            icon: "success",
            button: "Close",
          }).then(function () {
            setSelectedFile(null);
            setFileName("Select File");
            dispatch(setLoader(false));
          });
          // } else {
          //   Swal.fire({
          //     title: "Error",
          //     text:
          //     `This file in not uploaded successfully,
          //     the file has ## errors.The details of the errors has been shared via email to the configured addressees.
          //     The error file will also be downloaded for your review and corrections as necessary.`,
          //     icon: "error",
          //     button: "Close",
          //   }).then(function () {
          //     setSelectedFile(null)
          //     setFileName('Select File')
          //     dispatch(setLoader(false))
          //   });
          // }
        }
      })
      .catch((err) => {
        console.log("dataset/bulk/data/upload>>", err);
        dispatch(setLoader(false));
      });

    // let success = false
    // if(success) {
    //   Swal.fire({
    //     title: "Success",
    //     html:
    //     `<div class="container bulk-upload-success-Swal text-center">
    //       <div class="row"><b>File uploaded successfully</b></div>
    //       <div class="row"></div>
    //     </div>`,
    //     icon: "success",
    //     button: "Close",
    //   }).then(function () {
    //     setSelectedFile(null)
    //     setFileName('Select File')
    //     dispatch(setLoader(false))
    //   });
    // } else {
    //   Swal.fire({
    //     title: "Error",
    //     text:
    //     `This file in not uploaded successfully,
    //     the file has ## errors.The details of the errors has been shared via email to the configured addressees.
    //     The error file will also be downloaded for your review and corrections as necessary.`,
    //     icon: "error",
    //     button: "Close",
    //   }).then(function () {
    //     setSelectedFile(null)
    //     setFileName('Select File')
    //     dispatch(setLoader(false))
    //   });
    // }
  };

  const onChange = (selectedOption) => {
    console.log("onChange>>", selectedOption, selectedFile);
    if(selectedOption.level == '1'){
      setShowState(false)
      setShowDistrict(false)
    }else if (selectedOption.level == '2'){
      setShowState(true)
      setShowDistrict(false)
    }else if (selectedOption.level == '3'){
      setShowState(true)
      setShowDistrict(true)
    }
    if (selectedFile) {
      Swal.fire({
        title: "Are you sure?",
        text: "You you want to change the data set, File selected for upload will get discard",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes",
      }).then((result) => {
        if (result.isConfirmed) {
          setSelectedFile(null);
          setFileName("Select File");
          setselecteddataset(selectedOption);
          setprevselecteddataset(selectedOption);
          setisdownload(false);
          getFileFormatUrl(selectedOption);
          settabActiveKey("second");
        } else {
          setselecteddataset(prevselecteddataset);
        }
      });
    } else if (selectedOption) {
      setselecteddataset(selectedOption);
      setprevselecteddataset(selectedOption);
      setisdownload(false);
      getFileFormatUrl(selectedOption);
      settabActiveKey("second");
    }
  };

  const onClickDownload = () => {
    console.log("onClickDownload", templateURL);

    const templateformat =
      nameOfTemplate[selecteddataset.period.toLocaleLowerCase()];
    console.log("templateformat>>", templateformat);

    if (!templateformat) {
      Swal.fire({
        title: "Error",
        text: "Please select the data set again",
        icon: "error",
        showCancelButton: false,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Ok",
      });
      return;
    }

    var element = document.createElement("a");
    element.setAttribute("href", templateURL);

    // element.setAttribute('href', `https://uathsrc.imonitorplus.com/uploadedfiles/${templateformat}.xlsx`);
    console.log("templateURL>>", templateURL);
    // 'http://uathsrc.imonitorplus.com/bulkupload_template.xlsx');
    element.setAttribute("download", templateName); //<- filename
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);

    setisdownload(true);
    settabActiveKey("third");
  };

  // const inputEmail = (e) => {
  //   console.log('inputEmail>>', e.target.value)
  //   setemail(e.target.value)
  // }

  const toggleUploadLog = () => {
    setuploadlogshow(!uploadlogshow);
    if (!uploadlogshow) {
      getDataLog();
    }
  };

  return (
    <>
      <Sibebar open={true} />
      <div className="contentapp">
        <Navbar expand="lg">
          <button
            type="button"
            id="sidebarCollapse"
            className="btn btn-info hammenu"
          >
            <i data-v-c3854e32="" className="fas fa-bars"></i>
          </button>
          <Navbar.Brand className="navTitle" href="#home">
            
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ml-auto">
              <img className="avatar mr-2" src={imgurl.avatar.default} />
              <div>
                <span className="name">{userStoreState.userDetails.name}</span>
                <br></br>
                <span>{userStoreState.userDetails.email}</span>
              </div>
              <button className="btn btn-sign" onClick={logoutClickHandler}>
                <i className="fas fa-sign-out-alt fa-2x pull-right"></i>
              </button>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
        <div
          id="xlupload"
          className="smart-setup-wrapper"
          style={{ height: "calc(100vh - 60px)" }}
        >
          <div className="row">
            <div className="col-12">
              <div className="form-wizard ">
                <Card>
                  <Card.Header className="cardBlueHeader" as="h5">
                    Data Upload
                  </Card.Header>
                  {storeState.user.isEdit ? (
                    <Card.Body className="odkDiv">
                      <Tab.Container
                        activeKey={tabActiveKey}
                        defaultActiveKey={tabActiveKey}
                      >
                        {" "}
                        {/*activeKey={tabActiveKey}*/}
                        <Row>
                          <Col sm={3} md={3} lg={3}>
                            <Nav
                              variant="pills"
                              className="flex-column bulk-upload-tabs"
                            >
                              <Nav.Item>
                                <Nav.Link
                                  className="border-radius-left border-radius-bottom"
                                  eventKey="first"
                                  onClick={() => settabActiveKey("first")}
                                >
                                  <h4>Step 1</h4>
                                  <p>Select Dataset</p>
                                </Nav.Link>
                              </Nav.Item>
                              <Nav.Item>
                                <Nav.Link
                                  className="border-radius-left border-radius-bottom border-radius-top"
                                  disabled={!selecteddataset}
                                  eventKey="second"
                                  onClick={() => settabActiveKey("second")}
                                >
                                  <h4>Step 2</h4>
                                  <p>Download Dataset Template</p>
                                </Nav.Link>
                              </Nav.Item>
                              <Nav.Item>
                                <Nav.Link
                                  className="border-radius-left border-radius-top"
                                  disabled={!(selecteddataset && isdownload)}
                                  eventKey="third"
                                  onClick={() => settabActiveKey("third")}
                                >
                                  <h4>Step 3</h4>
                                  <p>Upload Data</p>
                                </Nav.Link>
                              </Nav.Item>
                            </Nav>
                          </Col>
                          <Col sm={9} md={9} lg={9}>
                            <Tab.Content>
                              <Tab.Pane eventKey="first">
                                <Form.Group
                                  className="dataset-dropdown-group"
                                  controlId="formSelectDataset"
                                >
                                  <Form.Label className="label">
                                    Select Dataset
                                  </Form.Label>
                                  <Select
                                    aria-labelledby="aria-label"
                                    className="basic-multi-select"
                                    classNamePrefix="select"
                                    options={dataSetArr}
                                    isClearable={true}
                                    isSearchable={true}
                                    onChange={onChange}
                                    // menuPortalTarget={document.body}
                                    menuPosition={"fixed"}
                                  />
                                </Form.Group>
                              </Tab.Pane>
                              <Tab.Pane eventKey="second">
                                <Row>
                                  <h3 className="pl-4">
                                    Click download button to download the sample
                                    template
                                  </h3>
                                </Row>
                                <Row>
                                  <Col md={{ span: 5, offset: 3 }}>
                                    <Button
                                      onClick={() => onClickDownload()}
                                      className="btn-lg nextbtn btn-template-download"
                                    >
                                      Download Dataset Template
                                    </Button>
                                  </Col>
                                </Row>
                              </Tab.Pane>
                              <Tab.Pane eventKey="third">
                                <Row>
                                  <Col>
                                    <h4 className="pl-4 mb-2">Upload data</h4>
                                  </Col>
                                </Row>
                                <Row>
                                  <Col>
                                    <Form.Group
                                      controlId="formFileSm"
                                      className="mb-4 text-left"
                                    >
                                      <Form.Label>
                                        Email Address for correspondence
                                      </Form.Label>
                                      <Form.Control
                                        type="email"
                                        placeholder="Enter email"
                                        onChange={(e) =>
                                          setemail(e.target.value)
                                        }
                                      />
                                      <Form.Text className="text-muted mb-3">
                                        NOTE: You can add multiple email address
                                        using , (comma) seperation (e.g:
                                        abc@gmail.com,xyz@yahoo.com)
                                      </Form.Text>
                                    </Form.Group>
                                  </Col>
                                </Row>
                                {/* New Row */}
                                <Row>
                                  {showState ? <Col>
                                  <Form.Group
                                      controlId="formFileSm"
                                      className="mb-4 text-left"
                                    >
                                      <Form.Label>
                                        Select Level 2
                                      </Form.Label>
                                      <Select
                                        className="bd-highlight "
                                        aria-labelledby="aria-label"
                                        classNamePrefix="select"
                                        options={stateValue}
                                        isClearable={true}
                                        isSearchable={true}
                                        onChange={onHandleSelect}
                                        // onChange={onChange}
                                        // menuPortalTarget={document.body}
                                        menuPosition={"fixed"}
                                      ></Select>
                                      </Form.Group>
                                  </Col>
                                   : 
                                   null}
                                  {showDistrict ?  <Col>
                                  <Form.Group
                                      controlId="formFileSm"
                                      className="mb-4 text-left"
                                    >
                                      <Form.Label>
                                        Select Level 3
                                      </Form.Label>
                                      <Select
                                        className="bd-highlight"
                                        aria-labelledby="aria-label"
                                        classNamePrefix="select"
                                        options={districtValue}
                                        isClearable={true}
                                        isSearchable={true}
                                        onChange={(e) => {
                                          setDistrictUid(e.id)
                                        }}
                                        menuPosition={"fixed"}
                                      ></Select>
                                      </Form.Group>
                                  </Col>
                                   : null }
                                  
                                </Row>
                                {/* New row end */}
                                <Row>
                                  <Col>
                                    <Form.Group
                                      controlId="formFileSm"
                                      className="mb-3"
                                    >
                                      <Form.Control
                                        data-title={fileName}
                                        accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                                        onChange={(e) => changeHandler(e)}
                                        type="file"
                                        size="sm"
                                      />
                                      <Button
                                        onClick={() => uploadXML()}
                                        className="nextbtn ml-2"
                                      >
                                        Upload
                                      </Button>
                                    </Form.Group>
                                  </Col>
                                </Row>
                                <Row>
                                  <Col className="text-left">
                                    <p
                                      className="log-link"
                                      onClick={() => toggleUploadLog()}
                                    >
                                      <u>Click here to see data upload log</u>
                                    </p>
                                  </Col>
                                </Row>
                                {uploadlogshow && (
                                  <Row>
                                    <Col>
                                      <Table
                                        key={logTableKey}
                                        logData={logData}
                                      />
                                    </Col>
                                  </Row>
                                )}
                              </Tab.Pane>
                            </Tab.Content>
                          </Col>
                        </Row>
                      </Tab.Container>
                      {/* <Container>
                        <Row>
                          <Col>
                            <Form.Group className="dataset-dropdown-group" controlId="formSelectDataset">
                              <Form.Label className="label">Select Dataset</Form.Label>
                              <Select
                                aria-labelledby="aria-label"
                                className="basic-multi-select"
                                classNamePrefix="select"
                                options={dataSetArr}
                                isClearable={true}
                                isSearchable={true}
                                onChange={onChange}
                                // menuPortalTarget={document.body}
                                menuPosition={'fixed'} 
                              />
                            </Form.Group>
                          </Col>
                          <Col>
                            {selecteddataset && 
                              // <a href="https://www.cmu.edu/blackboard/files/evaluate/tests-example.xls"
                              //   target='_blank'
                              //   onClick={() => onClickDownload()}
                              // >download</a>
                              // <Button type="button" id="btn" value="Download" onClick={() => onClickDownload()} />
                              <>
                                Click download button to download the sample template:
                                <Button onClick={() => onClickDownload()} className="nextbtn ml-2 btn-template-download">Download</Button>
                              </>
                            }
                          </Col>
                        </Row>
                        <Row>
                          <Col>
                            {selecteddataset && isdownload && 
                              <Form.Group controlId="formFileSm" className="mb-3">
                                <Form.Control data-title={fileName} accept="text/xml" onChange={(e) => changeHandler(e)} type="file" size="sm" />
                                <Button onClick={() => uploadXML()} className="nextbtn ml-2">Upload</Button>
                              </Form.Group>
                            }
                          </Col>
                        </Row>
                      </Container> */}
                    </Card.Body>
                  ) : (
                    <p>Program not published</p>
                  )}
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="footer">
        <div className="row">
          <div className="col-6">
            <p className="footext">
              Powered by{" "}
              <img className="fooimg" src={imgurl.durelogo.default} />
            </p>{" "}
          </div>
          <div className="col-6">
            <div className="widthMaxContent ml-auto pt-2">
              <p className="footextcopy">
                Copyright © 2020. All rights reserved
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default XlUpload;
