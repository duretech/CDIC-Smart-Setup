
import React, { useState, useEffect } from 'react';
import { Card, Nav, Navbar, } from 'react-bootstrap';
import _ from "lodash";
import { useHistory } from "react-router-dom";
//redux
import { useSelector, useDispatch } from 'react-redux';
import { setLoader } from '../redux/actions/userAction'
import imgurl from '../assets/images/imgUrl';
import API from "../util";

import Sibebar from '../component/Sidebar';
import 'react-dropdown-tree-select/dist/styles.css'

import swal from "sweetalert";
import BootstrapTable, { defaultSorted } from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import cellEditFactory from "react-bootstrap-table2-editor";
import ToolkitProvider, {
  Search,
} from "react-bootstrap-table2-toolkit";

const { SearchBar } = Search;

const LabelTranslation = () => {
  const history = useHistory();
  const storeState = useSelector((state) => state)
  const dispatch = useDispatch();
  const userStoreState = useSelector((state) => state.user)
  const [columns, setcolumns] = useState([]);
  const [tableData, settableData] = useState([]);
  let [filteredtableData, setfilteredtableData] = useState([]);
  const [nonEditableCell, setnonEditableCell] = useState([]);
  const [showSubmitResetBtn, setshowSubmitResetBtn] = useState(false);
  const [selectedlanguage, setSelectedlanguage] = useState(storeState.programDetails.userTemplate.selectedlanguage);
  const [gloablTransObj, setGloablTransObj] = useState({});
  const [transTypeVariable, setTransTypeVariable] = useState('translations');
  // console.log(storeState.programDetails.userTemplate.selectedlanguage)
  var language = {
    en: "English",
    es: 'Spanish',
    my: 'Burmese'
  };
  const logoutClickHandler = () => {
    sessionStorage.clear()
    history.push('/')
  }
  useEffect(() => {
    // getlangCode()
    getTranslation(transTypeVariable);
  }, []);


  const getlangCode = () => {
    API.get("30/locales/db?paging=false")
      .then((res) => {
        console.log("dataStore/locales>>>", res.data);
        res.data.map(localeValue => {
          language[localeValue.locale] = localeValue.name
        })
      })
      .catch((error) => {
        console.log("error>>", error);
      })
  }
  const getTranslation = (type) => {
    dispatch(setLoader(true))
    setcolumns([])
    settableData([])
    setfilteredtableData([])
    API.get("dataStore/translations/" + type)
      .then((res) => {
        // API.get("30/locales/db?paging=false")
        //   .then((response) => {
        //     response.data.map(localeValue => {
        //       if (res.data[localeValue.locale])
        //         language[localeValue.locale] = localeValue.name
        //     })
        //   })
        //   .catch((error) => {
        //     console.log("error>>", error);
        //   })
        let tempLangHolder = {}
        let updateReq = false
        selectedlanguage.map(lang => {
          language[lang.value] = lang.label
          if (!res.data[lang.value]) {
            res.data[lang.value] = res.data.en
            updateReq = true
          }
          tempLangHolder[lang.value] = res.data[lang.value]
        })
        if (updateReq) {
          updateTranslation(res.data, true)
          setGloablTransObj(res.data)
        } else {
          setGloablTransObj(tempLangHolder)
        }
        // console.log("dataStore/translations>>>", tempLangHolder,res.data);
        dispatch(setLoader(false))
        configureTableStructure(tempLangHolder);
        configureTableData(tempLangHolder);
        setshowSubmitResetBtn(false);
        // console.log(res.data)
      })
      .catch((error) => {
        dispatch(setLoader(false))
        console.log("error>>", error);
      });
  };
  const updateTranslation = (params, fromUpdate) => {
    // dispatch(setLoader(true))
    console.log(gloablTransObj, params)
    let GlobalTrans = gloablTransObj
    Object.keys(params).map(lang => {
      if (lang != 'en') {
        Object.keys(params[lang].translation).map(el => {
          if (params[lang].translation[el] == '')
            delete params[lang].translation[el]
        })
      }
      GlobalTrans[lang] = params[lang]
    })
    API.put("dataStore/translations/" + transTypeVariable, GlobalTrans)
      .then((res) => {
        if (!fromUpdate) {
          console.log("updateTranslation>>>11", res);
          swal({
            title: "Success",
            text: "Translation updated successfully",
            icon: "success",
            button: "Close",
          });
          setshowSubmitResetBtn(false);
          dispatch(setLoader(false))
          getTranslation(transTypeVariable);
        }
      })
      .catch((error) => {
        console.log("error>>", error);
      });
  };

  const configureTableStructure = (transobj) => {
    let tableheader = [];
    Object.keys(transobj).map((key) => {
      tableheader.push({
        dataField: key,
        text: language[key],
        sort: true,
      });
    });
    tableheader.push({
      dataField: "action",
      text: "Action",
      sort: true,
    });
    tableheader.unshift({
      dataField: "label",
      text: "Label",
      sort: true,
    });
    tableheader.unshift({
      dataField: "id",
      text: "Id",
      hidden: true,
    });
    setcolumns(tableheader);
    console.log(tableheader)
  };

  const configureTableData = (transobj) => {
    let temparr = [],
      tempobj = {};
    for (const key1 in transobj) {
      if (Object.hasOwnProperty.call(transobj, key1)) {
        const keyobj = transobj[key1].translation;
        for (const label in keyobj) {
          if (Object.hasOwnProperty.call(keyobj, label)) {
            if (tempobj[label]) {
              tempobj[label] = {
                ...tempobj[label],
                [key1]: keyobj[label],
                id: label,
              };
            } else {
              tempobj[label] = {
                label: label,
                [key1]: keyobj[label],
                id: label,
              };
            }
          }
        }
      }
    }

    for (const key in tempobj) {
      if (Object.hasOwnProperty.call(tempobj, key)) {
        for (const key1 in language) {
          if (!tempobj[key][key1])
            tempobj[key][key1] = ''
        }
        // console.log(tempobj[key])
        temparr.push(tempobj[key]);
        setnonEditableCell((nonEditableCell) => [nonEditableCell, key]);
      }
    }
    console.log("temparr>>", tempobj);
    settableData(temparr);
    setfilteredtableData(temparr);
  };

  const resetTableData = () => {
    setfilteredtableData([]);
    setTimeout(() => {
      setfilteredtableData(tableData);
      setshowSubmitResetBtn(false);
    }, 0);
  };

  const saveTableData = () => {
    // console.log('saveTableData>>>', filteredtableData)
    let tempobj = {};

    let index = _.findIndex(filteredtableData, function (o) {
      return o.label == "";
    });
    // console.log('index>>', index)

    if (index >= 0) {
      swal({
        title: "Error",
        text: "Label cannot be blank",
        icon: "error",
        button: "Close",
      });
      return;
    }

    filteredtableData.map((obj) => {
      for (const key in obj) {
        if (Object.hasOwnProperty.call(obj, key)) {
          tempobj[obj.label] = {
            ...tempobj[obj.label],
            [key]: obj[key],
          };
        }
      }
    });

    console.log("tempobj>>", tempobj);

    let transobj = {};
    for (const key in tempobj) {
      if (Object.hasOwnProperty.call(tempobj, key)) {
        let obj = tempobj[key];
        for (const itr in obj) {
          if (Object.hasOwnProperty.call(obj, itr)) {
            if (itr != "label" && itr != "id") {
              if (!transobj.hasOwnProperty(itr)) {
                transobj = {
                  ...transobj,
                  [itr]: { translation: {} },
                };
              }

              transobj[itr].translation = {
                ...transobj[itr].translation,
                [key]: obj[itr],
              };
            }
          }
        }
      }
    }

    console.log("transobj>>", transobj);
    updateTranslation(transobj);
  };

  const updateTableStructure = (action, ...arg) => {
    let temptableData = _.cloneDeep(filteredtableData);
    setfilteredtableData([]);
    let obj = { label: "", id: temptableData.length };
    switch (action) {
      case "add":
        let newKey = Object.keys(language).find(
          (key) => !temptableData.some((row) => key in row)
        );

        if (newKey) {
          obj[newKey] = "";
        }

        temptableData.unshift(obj);
        break;
      case "delete":
        console.log("delete>>>", arg);
        let index = _.findIndex(temptableData, function (o) {
          return o.label == arg[0].row.label;
        });
        temptableData.splice(index, 1);
        break;

      default:
        break;
    }
    console.log("temptableData::>>",temptableData)
    // setTimeout(() => {
    //   setfilteredtableData(temptableData);
    //   setshowSubmitResetBtn(true);
    // }, 0);
  };

  const renderTableColumn = () => {
    /**
     * ADD EDIT BUTTON TO TABLE
     */
    let updatedColumns = [];
    if (columns.length) {
      updatedColumns = columns.map((col, index) => {
        if (col.dataField === "label") {
          return {
            ...col,
            validator: (newValue, row, column) => {
              if (!newValue || newValue == "") {
                return {
                  valid: false,
                  message: "Label cannot be blank",
                };
              }
              return true;
            },
          };
        } else if (col.dataField === "action") {
          return {
            ...col,
            formatter: (cell, row, rowIndex, formatExtraData) => {
              return (
                <button
                  className="btn btn-info btn-sm regformsubmitbtn"
                  onClick={() =>
                    updateTableStructure("delete", {
                      cell,
                      row,
                      rowIndex,
                      formatExtraData,
                    })
                  }
                >
                  <i className="fas fa-trash-alt"></i>
                </button>
              );
            },
          };
        }

        return col;
      });
    }
    return updatedColumns;
  };

  const sizePerPageOptionRenderer = ({ text, page, onSizePerPageChange }) => (
    <li key={text} role="presentation" className="dropdown-item">
      {
        // eslint-disable-next-line
        <a
          href="#"
          tabIndex="-1"
          role="menuitem"
          data-page={page}
          onMouseDown={(e) => {
            e.preventDefault();
            onSizePerPageChange(page);
          }}
        >
          {text}
        </a>
      }
    </li>
  );

  const paginationOption = {
    page: 1, // which page you want to show as default
    sizePerPageList: [
      {
        text: "20",
        value: 20,
      },
      {
        text: "50",
        value: 50,
      },
      {
        text: "100",
        value: 100,
      },
      {
        text: "All",
        value: filteredtableData.length,
      },
    ], // you can change the dropdown list for size per page
    sizePerPage: 10, // which size per page you want to locate as default
    pageStartIndex: 1, // where to start counting the pages
    paginationSize: 3, // the pagination bar size.
    // prePageText: "Prev", // Previous page button text
    // nextPageText: "Next", // Next page button text
    // firstPageText: "First", // First page button text
    // lastPageText: "Last", // Last page button text
    showTotal: true,
    sizePerPageOptionRenderer,
  };

  const cellEdit = cellEditFactory({
    mode: "dbclick",
    blurToSave: true,
    afterSaveCell: (oldValue, newValue, row, column) => {
      // console.log(oldValue, newValue,row, column)
      if (newValue && newValue.match(/<[^>]*>/g) != null) {
        swal({
          title: "Error",
          text: "Invalid Input",
          icon: "error",
          button: "Close",
        });
        row[column.dataField] = oldValue
      }
      setshowSubmitResetBtn(true);
    },
  });


  return (
    <>
      <Sibebar open={true} />
      <div className="contentapp">
        <Navbar expand="lg">
          <button type="button" id="sidebarCollapse" className="btn btn-info hammenu"><i data-v-c3854e32="" className="fas fa-bars"></i></button>
          <Navbar.Brand className="navTitle" href="#home"></Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ml-auto">
              <img className="avatar mr-2" src={imgurl.avatar.default} />
              <div>
                <span className="name">{userStoreState.userDetails.name}</span><br></br>
                <span>{userStoreState.userDetails.email}</span>
              </div>
              <button className="btn btn-sign" onClick={logoutClickHandler}><i className="fas fa-sign-out-alt fa-2x pull-right"></i></button>

            </Nav>

          </Navbar.Collapse>
        </Navbar>
        <div className="smart-setup-wrapper" >
          <div className="row">
            <div className="col-12">
              <div className="form-wizard">
                <Card >
                  <Card.Header className="cardBlueHeader" as="h5">Label Translation </Card.Header>
                  <Card.Body className=""  >
                    <select type='text' onChange={e => {
                      console.log(e.target.value)
                      if (e.target.value != '') {
                        setTransTypeVariable(e.target.value);
                        getTranslation(e.target.value)
                      }
                      // console.log(e.target.value)
                    }} className='form-control w-25 mb-2' >
                      <option value="translations">App Label</option>
                      <option value="dashboardlabel">Dashboard Label</option>
                    </select>
                    {storeState.user.isEdit ? <div className="row">
                      <div className="col-12" >
                        {columns.length > 0 ? (
                          <>
                            <ToolkitProvider
                              keyField="id"
                              data={filteredtableData}
                              columns={columns}
                              search
                            >
                              {(props) => (
                                <div className="div-translation-table ">
                                  <div className='d-flex justify-content-between'>
                                    <div>
                                      <SearchBar
                                        {...props.searchProps}
                                        srText=""
                                        className="form-control search-font float-left input-item-sm"
                                      />
                                    </div>
                                    <div>
                                      <button
                                        className="btn btn-info regformsubmitbtn text-light rounded float-right ml-2 btn-sm"
                                        onClick={() => updateTableStructure("add", null)}
                                      >
                                        Add Row
                                      </button>
                                      {showSubmitResetBtn && (
                                        <button
                                          className="btn btn-info btn-sm regformsubmitbtn rounded float-right ml-2 btn-sm"
                                          onClick={() => saveTableData()}
                                        >
                                          Submit
                                        </button>
                                      )}
                                      {showSubmitResetBtn && (
                                        <button
                                          className="btn bg-danger text-light rounded float-right ml-2 btn-sm"
                                          onClick={() => resetTableData()}
                                        >
                                          Reset
                                        </button>
                                      )}
                                    </div>
                                  </div>

                                  <BootstrapTable
                                    {...props.baseProps}
                                    bootstrap4
                                    columns={renderTableColumn()}
                                    // noDataIndication={noDataText}
                                    pagination={paginationFactory(paginationOption)}
                                    hover
                                    responsive
                                    defaultSorted={defaultSorted}
                                    // filter={ filterFactory() }
                                    exportCSV
                                    classes="translation-table"
                                    cellEdit={cellEdit}
                                  />
                                </div>
                              )}
                            </ToolkitProvider>
                          </>
                        ) : (
                          <p>No data found</p>
                        )}
                      </div>
                    </div> : <p>Program not published</p>}

                  </Card.Body>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="footer">
        <div className="row">
          <div className="col-6">
            <p className="footext">Powered by  <img className="fooimg" src={imgurl.durelogo.default} /></p>  </div>
          <div className="col-6">
            <div className="widthMaxContent ml-auto pt-2">
              <p className="footextcopy">Copyright © 2020. All rights reserved</p></div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LabelTranslation;