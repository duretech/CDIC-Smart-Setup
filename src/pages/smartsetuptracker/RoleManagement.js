import React, { useState, useEffect, useRef } from 'react';
import { useHistory } from "react-router-dom";
import { Card, Button, Form, Tabs, Nav, Tab, Navbar, Accordion, Row, Col, Dropdown, InputGroup, FormControl, Modal, Container, OverlayTrigger, Tooltip } from 'react-bootstrap';
import BootstrapTable from "react-bootstrap-table-next";
import Sibebar from '../../component/Sidebar';
import imgurl from '../../assets/images/imgUrl';
import Select from 'react-select';
import { useSelector, useDispatch } from 'react-redux';
import { setActiveTab, setLoader, setEditFlag, setUserTemplate, setUser, setInProgressPublish } from '../../redux/actions/userAction'
import API from "../../util";
import swal from "sweetalert";
import Swal from "sweetalert2";
import _ from "underscore";
import toast, { Toaster } from 'react-hot-toast';
import { baseUrl, baseName, adminModuleName } from "../../util/urls";

const RoleManagement = () => {
  const history = useHistory();
  const userTemplate = useSelector((state) => state.programDetails.userTemplate);
  const [roles, setRoles] = useState([]);
  const [userAccess, setUserAccess] = useState({});
  const [stageAccess, setStageAccess] = useState({});
  const [addNewModal, setAddNewModal] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [newRole, setNewRole] = useState("");
  const [tableDataState, setTableDataState] = useState([]);
  const [selectedAccess, setSelectedAccess] = useState([
    "F_PROGRAM_INDICATOR_PUBLIC_ADD",
    "F_DATAELEMENTGROUP_PUBLIC_ADD",
    "F_PROGRAM_PUBLIC_ADD",
    "F_VALIDATIONRULE_PUBLIC_ADD",
    "F_MAP_PUBLIC_ADD",
    "F_ATTRIBUTE_PUBLIC_ADD",
    "F_INDICATORGROUPSET_PUBLIC_ADD",
    "F_ORGANISATIONUNIT_ADD",
    "F_CATEGORY_OPTION_GROUP_PUBLIC_ADD",
    "F_PREDICTORGROUP_ADD",
    "F_LEGEND_SET_PUBLIC_ADD",
    "F_CONSTANT_ADD",
    "F_DATAVALUE_ADD",
    "F_INDICATORTYPE_ADD",
    "F_INDICATOR_PUBLIC_ADD",
    "F_INDICATORGROUP_PUBLIC_ADD",
    "F_RELATIONSHIPTYPE_PUBLIC_ADD",
    "F_PREDICTOR_ADD",
    "F_EVENTCHART_PUBLIC_ADD",
    "F_PUSH_ANALYSIS_ADD",
    "F_USERGROUP_PUBLIC_ADD",
    "F_TRACKED_ENTITY_ATTRIBUTE_PUBLIC_ADD",
    "F_USER_ADD",
    "F_TRACKED_ENTITY_ADD",
    "F_ANALYTICSTABLEHOOK_ADD",
    "F_VALIDATIONRULEGROUP_PUBLIC_ADD",
    "F_CATEGORY_OPTION_PUBLIC_ADD",
    "F_ORGUNITGROUP_PUBLIC_ADD",
    "F_DOCUMENT_PUBLIC_ADD",
    "F_VISUALIZATION_PUBLIC_ADD",
    "F_OPTIONSET_PUBLIC_ADD",
    "F_REPORT_PUBLIC_ADD",
    "F_EXTERNAL_MAP_LAYER_PUBLIC_ADD",
    "F_DATAELEMENT_PUBLIC_ADD",
    "F_AGGREGATE_DATA_EXCHANGE_PUBLIC_ADD",
    "F_EVENT_HOOK_PUBLIC_ADD",
    "F_PROGRAM_RULE_ADD",
    "F_USERROLE_PUBLIC_ADD",
    "F_ORGUNITGROUPSET_PUBLIC_ADD",
    "F_DATASET_PUBLIC_ADD",
    "F_PROGRAMSTAGE_ADD",
    "F_DASHBOARD_PUBLIC_ADD",
    "F_CATEGORY_PUBLIC_ADD",
    "F_SECTION_ADD",
    "F_ROUTE_PUBLIC_ADD",
    "F_SQLVIEW_PUBLIC_ADD",
    "F_CATEGORY_COMBO_PUBLIC_ADD",
    "F_MINMAX_DATAELEMENT_ADD",
    "F_EVENTREPORT_PUBLIC_ADD",
    "F_OPTIONGROUPSET_PUBLIC_ADD",
    "F_OPTIONGROUP_PUBLIC_ADD",
    "F_PROGRAM_INDICATOR_GROUP_PUBLIC_ADD",
    "F_CATEGORY_OPTION_GROUP_SET_PUBLIC_ADD",
    "F_DATAELEMENTGROUPSET_PUBLIC_ADD",
    "M_dhis-web-tracker-capture",
    "M_dhis-web-app-management",
    "M_dhis-web-cache-cleaner",
    "M_Bulk_Load",
    "M_dhis-web-capture",
    "M_dhis-web-dashboard",
    "M_dhis-web-data-administration",
    "M_dhis-web-approval",
    "M_dhis-web-aggregate-data-entry",
    "M_dhis-web-dataentry",
    "M_dhis-web-data-quality",
    "M_dhis-web-data-visualizer",
    "M_dhis-web-datastore",
    "M_dhis-web-event-reports",
    "M_dhis-web-event-visualizer",
    "M_dhis-web-import-export",
    "M_dhis-web-interpretation",
    "M_dhis-web-maintenance",
    "M_dhis-web-maps",
    "M_dhis-web-menu-management",
    "M_dhis-web-messaging",
    "M_dhis-web-reports",
    "M_dhis-web-sms-configuration",
    "M_dhis-web-scheduler",
    "M_dhis-web-settings",
    "M_dhis-web-translations",
    "M_dhis-web-usage-analytics",
    "M_dhis-web-user",
    "M_androidsettingsapp",
    "F_TRACKED_ENTITY_INSTANCE_SEARCH_IN_ALL_ORGUNITS",
    "F_IGNORE_TRACKER_REQUIRED_VALUE_VALIDATION",
    "F_ENROLLMENT_CASCADE_DELETE",
    "F_VIEW_EVENT_ANALYTICS",
    "F_PROGRAM_RULE_MANAGEMENT",
    "F_TEI_CASCADE_DELETE",
    "F_PROGRAM_DASHBOARD_CONFIG_ADMIN",
    "F_TRACKER_IMPORTER_EXPERIMENTAL",
    "F_TRACKED_ENTITY_MERGE",
    "F_TRACKED_ENTITY_UPDATE",
    "F_UNCOMPLETE_EVENT",
    "F_EXPORT_DATA",
    "F_EXPORT_EVENTS",
    "F_METADATA_EXPORT",
    "F_IMPORT_DATA",
    "F_IMPORT_EVENTS",
    "F_METADATA_IMPORT",
    "F_METADATA_MANAGE",
    "F_SKIP_DATA_IMPORT_AUDIT",
    "F_SCHEDULING_ADMIN",
    "F_ACCEPT_DATA_LOWER_LEVELS",
    "F_ORG_UNIT_PROFILE_ADD",
    "F_USER_GROUPS_READ_ONLY_ADD_MEMBERS",
    "F_DATA_APPROVAL_LEVEL",
    "F_DATA_APPROVAL_WORKFLOW",
    "F_LOCALE_ADD",
    "F_EVENT_VISUALIZATION_PUBLIC_ADD",
    "F_USERGROUP_MANAGING_RELATIONSHIPS_ADD",
    "F_USER_ADD_WITHIN_MANAGED_GROUP",
    "ALL",
    "F_APPROVE_DATA",
    "F_APPROVE_DATA_LOWER_LEVELS",
    "F_SYSTEM_SETTING",
    "F_USER_DELETE_WITHIN_MANAGED_GROUP",
    "F_EDIT_EXPIRED",
    "F_EVENT_VISUALIZATION_EXTERNAL",
    "F_IMPERSONATE_USER",
    "F_GENERATE_MIN_MAX_VALUES",
    "F_INSERT_CUSTOM_JS_CSS",
    "F_OAUTH2_CLIENT_MANAGE",
    "F_ORGANISATION_UNIT_MERGE",
    "F_ORGANISATIONUNIT_MOVE",
    "F_PERFORM_ANALYTICS_EXPLAIN",
    "F_PERFORM_MAINTENANCE",
    "F_REPLICATE_USER",
    "F_PREDICTOR_RUN",
    "F_RUN_VALIDATION",
    "F_SEND_EMAIL",
    "F_MOBILE_SENDSMS",
    "F_ORGANISATION_UNIT_SPLIT",
    "F_ORGANISATIONUNITLEVEL_UPDATE",
    "F_USERGROUP_MANAGING_RELATIONSHIPS_VIEW",
    "F_VIEW_SERVER_INFO",
    "F_VIEW_UNAPPROVED_DATA",
    "F_USER_VIEW"
  ]);
  const [accessDropdownOpen, setAccessDropdownOpen] = useState(false);
  const userStoreState = useSelector((state) => state.user)
  const dispatch = useDispatch();
  const userDetails = useSelector((state) => state.user.userDetails)
  const storeState = useSelector((state) => state)
  const [userArray, setUserArray] = useState([])
  const [userGroups, setUserGroups] = useState([])
  const [userRoles, setUserRoles] = useState([])
  const registryUrl = baseUrl && baseName ? baseUrl + baseName : "https://example.com/registry";
  const adminModuleUrl = baseUrl && adminModuleName ? baseUrl + adminModuleName : "https://example.com/admin"; // Replace with your actual link

  // Menu management states
  const [internalActiveTab, setInternalActiveTab] = useState('menus');
  const [menuRoles, setMenuRoles] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [menuAccess, setMenuAccess] = useState({});
  const [menuTableData, setMenuTableData] = useState([]);
  const [addNewClientMenuName, setAddNewClientMenuName] = useState('Add New Patient'); // Adjust this name as needed
  const [tableKey, setTableKey] = useState(0);

  // Validation and loading states
  const [roleNameError, setRoleNameError] = useState("");
  const [isAddingRole, setIsAddingRole] = useState(false);

  // Ref to track initialization and keep latest template
  const menuDataInitialized = useRef(false);
  const stageDataInitialized = useRef(false);
  const userTemplateRef = useRef(userTemplate);

  const logoutClickHandler = () => {
    sessionStorage.clear()
    history.push('/')
  }

  function handleOpen() {
    window.open(registryUrl, '_blank');
  }
  function handleAdminModuleOpen() {
    window.open(adminModuleUrl, '_blank');
  }
  const handleBackNavigation = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setInternalActiveTab('menus');
    dispatch(setActiveTab('step3'));
  };

  // Add this useEffect to automatically disable stages when Add New Client is unchecked
  useEffect(() => {
    roles.forEach(roleObject => {
      const roleName = roleObject.displayName;
      const isAddNewClientEnabled = menuAccess[addNewClientMenuName]?.[roleName];

      if (!isAddNewClientEnabled) {
        // Disable all stages for this role
        setUserAccess(prev => {
          const updated = { ...prev };
          if (!updated[roleName]) updated[roleName] = {};
          userTemplate?.programstages?.forEach(stage => {
            updated[roleName][stage.keyname] = false;
          });
          return updated;
        });

        setStageAccess(prev => {
          const updated = { ...prev };
          userTemplate?.programstages?.forEach(stage => {
            if (!updated[stage.keyname]) updated[stage.keyname] = {};
            updated[stage.keyname][roleName] = false;
          });
          return updated;
        });
      }
    });
  }, [menuAccess[addNewClientMenuName]]);

  // useEffect(() => {


  //   const buildMenuTableDataFromRoleBasedArray = (roleBasedArray, masterMenuList) => {
  //     const roleBasedData = roleBasedArray[0];
  //     const menuNamesSet = new Set(masterMenuList.map(item => item.name));
  //     const menuTableData = [];

  //     menuNamesSet.forEach(menuName => {
  //       let sortOrderValue;
  //       for (const roleName in roleBasedData) {
  //         const roleMenuItems = roleBasedData[roleName];
  //         if (Array.isArray(roleMenuItems)) {
  //           const found = roleMenuItems.find(item => item.name === menuName);
  //           if (found && typeof found.sortOrder === 'number') {
  //             sortOrderValue = found.sortOrder;
  //             break;
  //           }
  //         }
  //       }
  //       menuTableData.push({
  //         menuItem: menuName,
  //         sortOrder: sortOrderValue !== undefined ? sortOrderValue : '',
  //       });
  //     });

  //     return menuTableData;
  //   };

  //   const newMenuTableData = buildMenuTableDataFromRoleBasedArray(
  //     userTemplate.roleBasedArray,
  //     userTemplate.menuList
  //   );

  //   setMenuTableData(newMenuTableData);
  // }, [userTemplate, setMenuTableData]);


  useEffect(() => {
    if (!userTemplate || !userTemplate.roleBasedArray || userTemplate.roleBasedArray.length === 0 || !userTemplate.menuList) {
      setMenuTableData([]); // Clear if no data
      return;
    }
    userTemplateRef.current = userTemplate;
  }, [userTemplate]);

  const accessOptions = userTemplate && userTemplate.menuList
    ? userTemplate.menuList.map(menuItem => ({
      label: menuItem.name,
      value: menuItem.name,
      icon: menuItem.icon || 'faFile'
    }))
    : [];

  const toggleAccessSelection = (access) => {
    setSelectedAccess((prev) =>
      prev.includes(access)
        ? prev.filter((item) => item !== access)
        : [...prev, access]
    );
  };

  const handleClose = () => {
    dispatch(setLoader(true))
    let url = 'me?fields=:all,organisationUnits[id,name,displayName],userGroups[id],userCredentials[:all,!user,userRoles[id,name]],attributeValues[value,attribute[id,name]]'
    API.get(url).then(res => {
      dispatch(setLoader(false))
      dispatch(setUser(res.data))
      API.get('tracker/smartsetup/get/' + res.data.organisationUnits[0].id).then(res => {
        dispatch(setEditFlag(true))
        getProgramTemplate(res.data)
      })
    })
    setShowModal(false)
  }

  useEffect(() => {
    getUserGroups();
    getUserRoles();
    menuDataInitialized.current = false;
    stageDataInitialized.current = false;
  }, []);

  // =====================================================
  // FIXED: Initialize Program Stages with proper userGroupAccesses mapping
  // =====================================================
  useEffect(() => {
    try {
      if (userTemplate && userTemplate.programstages &&
        userGroups && userGroups.length > 0 && userRoles && userRoles.length > 0 && !stageDataInitialized.current) {

        console.log("🔧 Initializing Program Stages with userGroupAccesses...");
        console.log("📋 UserTemplate programstages:", userTemplate.programstages);

        // Create lookup maps for efficient matching
        const userGroupMap = new Map();
        userGroups.forEach(group => {
          userGroupMap.set(group.id, group);
          userGroupMap.set(group.displayName, group);
          userGroupMap.set(group.name, group);
        });

        const rolesToDisplay = [];
        userRoles.forEach(role => {
          const matchingGroup = userGroupMap.get(role.displayName) || userGroupMap.get(role.name);
          if (matchingGroup) {
            rolesToDisplay.push({
              id: matchingGroup.id,
              displayName: role.displayName,
              name: role.name,
              userGroupId: matchingGroup.id,
              userRoleId: role.id,
              type: 'userRole'
            });
          }
        });

        setRoles(rolesToDisplay);

        const initialUserAccess = {};
        const initialStageAccess = {};
        const initialTableData = [];

        userTemplate.programstages.forEach(stage => {
          const stageKey = stage.keyname;
          initialStageAccess[stageKey] = {};
          let row = { stage: stageKey };

          console.log(`\n🔍 Processing stage: ${stageKey}`);
          console.log(`   userGroupAccesses:`, stage.userGroupAccesses);

          rolesToDisplay.forEach(roleObject => {
            const roleName = roleObject.displayName;

            if (!initialUserAccess[roleName]) {
              initialUserAccess[roleName] = {};
            }

            // CRITICAL FIX: Properly check if role has access to this stage
            let isRoleAssigned = false;

            // Check in userGroupAccesses array
            if (stage.userGroupAccesses && Array.isArray(stage.userGroupAccesses) && stage.userGroupAccesses.length > 0) {
              isRoleAssigned = stage.userGroupAccesses.some(access => {
                // Match by userGroupUid, id, or displayName
                const matchesByUid = access.userGroupUid === roleObject.userGroupId || access.userGroupUid === roleObject.id;
                const matchesById = access.id === roleObject.userGroupId || access.id === roleObject.id;
                const matchesByName = access.displayName === roleName;

                const matches = matchesByUid || matchesById || matchesByName;

                if (matches) {
                  console.log(`✅ Found access for ${roleName} in stage ${stageKey}:`, access);
                }

                return matches;
              });
            }

            // For new programs (not edit mode), select all by default
            // if (!storeState.user.isEdit) {
            //   isRoleAssigned = true;
            // }

            console.log(`   ${roleName}: ${isRoleAssigned ? '✓ CHECKED' : '✗ UNCHECKED'}`);

            initialUserAccess[roleName][stageKey] = isRoleAssigned;
            initialStageAccess[stageKey][roleName] = isRoleAssigned;
            row[roleName] = isRoleAssigned;
          });

          initialTableData.push(row);
        });


        console.log("\n📊 Final initialUserAccess:", initialUserAccess);
        console.log("📊 Final initialStageAccess:", initialStageAccess);
        console.log("📊 Final tableDataState:", initialTableData);

        setUserAccess(initialUserAccess);
        setStageAccess(initialStageAccess);
        setTableDataState(initialTableData);
        stageDataInitialized.current = true;
      }
    } catch (error) {
      console.error("❌ Error in Program Stages useEffect:", error);
    }
  }, [userTemplate, userGroups, userRoles, storeState.user.isEdit]);

  // =====================================================
  // Initialize Menu Items properly from roleBasedArray
  // =====================================================
  useEffect(() => {
    if (userTemplate && userGroups.length > 0 && userRoles.length > 0 && !menuDataInitialized.current) {
      if (userTemplate.menuList && userTemplate.roleBasedArray &&
        userTemplate.roleBasedArray.length > 0) {

        console.log("🔧 Initializing Menu Items with roleBasedArray...");

        const roleBasedData = userTemplate.roleBasedArray[0];
        const tempMenuList = userTemplate.menuList;

        /* Adding sortorder from rolebased to mastermenulist*/
        // flatten all menus from all roles and get unique list and set sortorder
        let flattenedMenu = Object.values(roleBasedData).flat();
        const uniqueMenus = {};

        flattenedMenu.forEach((item, index) => {
          const currentOrder = item.sortOrder ?? -1;
          if (
            !uniqueMenus[item.name] ||
            currentOrder > (uniqueMenus[item.name].sortOrder ?? -1)
          ) {
            uniqueMenus[item.name] = { ...item, sortOrder: currentOrder };
          }
        });

        // Step 1: Flatten roleBasedData and keep highest sortOrder per name
        const roleMenus = {};
        Object.values(roleBasedData).flat().forEach((item, index) => {
          const order = item.sortOrder ?? -1;
          if (!roleMenus[item.name] || order > (roleMenus[item.name].sortOrder ?? -1)) {
            roleMenus[item.name] = { ...item, sortOrder: order };
          }
        });

        // Step 2: Build masterMenuList in same sequence as tempMenuList
        const masterMenuList = tempMenuList.map((menu, index) => {
          const roleItem = roleMenus[menu.name];
          let sortOrder = roleItem?.sortOrder != -1 ? roleItem?.sortOrder : index + 1; // proper fallback

          if (menu.name === "Home") sortOrder = 1;
          if (menu.name === "Logout") sortOrder = 999;

          return { ...menu, sortOrder };
        });

        console.log("📋 roleBasedArray[0]:", roleBasedData);
        console.log("📋 menuList:", masterMenuList);

        const userGroupMap = new Map();
        userGroups.forEach(group => {
          userGroupMap.set(group.displayName, group);
          userGroupMap.set(group.name, group);
          userGroupMap.set(group.id, group);
        });

        const menuRolesToDisplay = [];
        userRoles.forEach(role => {
          const matchingGroup = userGroupMap.get(role.displayName) ||
            userGroupMap.get(role.name) ||
            userGroupMap.get(role.id);
          if (matchingGroup) {
            menuRolesToDisplay.push({
              id: matchingGroup.id,
              displayName: role.displayName,
              name: role.name,
              userGroupId: matchingGroup.id,
              userRoleId: role.id,
              type: 'userRole'
            });
          }
        });

        setMenuRoles(menuRolesToDisplay);
        setMenuItems(masterMenuList);

        const initialMenuAccess = {};
        const initialMenuTableData = [];

        masterMenuList.forEach(menuItem => {
          const menuKey = menuItem.name;
          initialMenuAccess[menuKey] = {};
          let row = { menuItem: menuKey, sortOrder: menuItem.sortOrder };

          menuRolesToDisplay.forEach(roleObject => {
            const roleName = roleObject.displayName;

            // Properly read from roleBasedData
            const roleMenuData = roleBasedData[roleName] || [];

            console.log(`Checking role: ${roleName}, menuItem: ${menuKey}`);
            console.log(`  Role menu data:`, roleMenuData);

            // Find if this menu item exists for this role
            const existingMenuItem = roleMenuData.find(item => item.name === menuKey);

            // Check showMenu property
            let isMenuEnabled = false;
            if (existingMenuItem) {
              isMenuEnabled = existingMenuItem.showMenu === true;
              console.log(`  ✅ Found menu item "${menuKey}" for role "${roleName}": showMenu = ${existingMenuItem.showMenu}`);
            } else {
              console.log(`  ❌ Menu item "${menuKey}" NOT found for role "${roleName}"`);
            }

            // For new programs (not edit mode), enable all by default
            // if (!storeState.user.isEdit) {
            //   isMenuEnabled = true;
            // }

            initialMenuAccess[menuKey][roleName] = isMenuEnabled;
            row[roleName] = isMenuEnabled;
          });

          initialMenuTableData.push(row);
        });

        console.log("📊 Final menuAccess:", initialMenuAccess);
        console.log("📊 Final menuTableData:", initialMenuTableData);

        setMenuAccess(initialMenuAccess);
        setMenuTableData(initialMenuTableData);
        menuDataInitialized.current = true;
      }
    }
  }, [userGroups, userRoles, storeState.user.isEdit, userTemplate]);
  // Filter function to exclude patient roles
  const filterNonPatientRoles = (rolesList) => {
    return rolesList.filter(role => {
      const roleName = typeof role === 'object' ? role.displayName : role;
      return !roleName.trim().toLowerCase().includes('patient');
    });
  };

  // Select All / Deselect All for Program Stages per role
  const handleStageSelectAll = (roleName) => {
    console.log("menuAccess ",menuAccess,roleName,addNewClientMenuName)
    const isAddNewClientEnabled = menuAccess[addNewClientMenuName]?.[roleName];

    if (!isAddNewClientEnabled) {
      Swal.fire({
        title: "Access Restricted",
        text: `"Add New Patient" must be enabled for ${roleName} before selecting program stages.`,
        icon: "warning"
      });
      return;
    }
    const allStagesSelected = userTemplate.programstages.every(stage =>
      userAccess[roleName] && userAccess[roleName][stage.keyname]
    );

    const newValue = !allStagesSelected;

    setUserAccess(prevUserAccess => {
      const updatedUserAccess = { ...prevUserAccess };
      if (!updatedUserAccess[roleName]) {
        updatedUserAccess[roleName] = {};
      }
      userTemplate.programstages.forEach(stage => {
        updatedUserAccess[roleName][stage.keyname] = newValue;
      });
      return updatedUserAccess;
    });

    setStageAccess(prevStageAccess => {
      const updatedStageAccess = { ...prevStageAccess };
      userTemplate.programstages.forEach(stage => {
        if (!updatedStageAccess[stage.keyname]) {
          updatedStageAccess[stage.keyname] = {};
        }
        updatedStageAccess[stage.keyname][roleName] = newValue;
      });
      return updatedStageAccess;
    });

    setTableDataState(prevTableDataState => {
      return prevTableDataState.map(row => ({
        ...row,
        [roleName]: newValue
      }));
    });

    const roleObject = roles.find(r =>
      (typeof r === 'object' ? r.displayName : r) === roleName
    );

    const updatedUserTemplate = JSON.parse(JSON.stringify(userTemplate));

    if (updatedUserTemplate && updatedUserTemplate.programstages) {
      updatedUserTemplate.programstages.forEach((stage, stageIndex) => {
        if (!updatedUserTemplate.programstages[stageIndex].userGroupAccesses) {
          updatedUserTemplate.programstages[stageIndex].userGroupAccesses = [];
        }

        const userAccessesArray = updatedUserTemplate.programstages[stageIndex].userGroupAccesses;
        const userGroupIdToHandle = roleObject?.userGroupId || roleObject?.id;

        // Remove existing access for this role
        updatedUserTemplate.programstages[stageIndex].userGroupAccesses =
          userAccessesArray.filter(access => access.userGroupUid !== userGroupIdToHandle && access.id !== userGroupIdToHandle);

        // Add access if newValue is true
        if (newValue) {
          const userAccessObject = {
            id: userGroupIdToHandle,
            access: "rw------",
            userGroupUid: userGroupIdToHandle,
            displayName: roleName
          };
          updatedUserTemplate.programstages[stageIndex].userGroupAccesses.push(userAccessObject);
        }
      });

      console.log("🔄 Updating userTemplate after Select/Deselect All");
      dispatch(setUserTemplate(updatedUserTemplate));
    }
  };

  // Select All / Deselect All for Menu Items per role
  const handleMenuSelectAll = (roleName) => {
    const allMenusSelected = menuItems.every(menuItem =>
      (menuItem.name === "Home" || menuItem.name === "Logout")
        ? true  // Always count as selected for Home and Logout
        : (menuAccess[menuItem.name] && menuAccess[menuItem.name][roleName])
    );

    // Toggle newValue but keep Home/Logout always true
    const newValue = !allMenusSelected;

    setMenuAccess(prevMenuAccess => {
      const updatedMenuAccess = { ...prevMenuAccess };
      menuItems.forEach(menuItem => {
        if (!updatedMenuAccess[menuItem.name]) {
          updatedMenuAccess[menuItem.name] = {};
        }
        if (menuItem.name === "Home" || menuItem.name === "Logout") {
          updatedMenuAccess[menuItem.name][roleName] = true;  // Always true
        } else {
          updatedMenuAccess[menuItem.name][roleName] = newValue;
        }
      });
      return updatedMenuAccess;
    });

    setMenuTableData(prevMenuTableData => {
      return prevMenuTableData.map(row => ({
        ...row,
        [roleName]: (row.menuItem === "Home" || row.menuItem === "Logout")
          ? true  // Always true for Home and Logout rows
          : newValue
      }));
    });

    const currentUserTemplate = userTemplateRef.current;
    const updatedUserTemplate = JSON.parse(JSON.stringify(currentUserTemplate));

    if (updatedUserTemplate && updatedUserTemplate.roleBasedArray && updatedUserTemplate.roleBasedArray.length > 0) {
      const roleBasedData = updatedUserTemplate.roleBasedArray[0];

      if (!roleBasedData[roleName]) {
        roleBasedData[roleName] = [];
      }

      menuItems.forEach(menuItem => {
        const existingIndex = roleBasedData[roleName].findIndex(item => item.name === menuItem.name);
        if (existingIndex !== -1) {
          roleBasedData[roleName][existingIndex].showMenu =
            (menuItem.name === "Home" || menuItem.name === "Logout")
              ? true
              : newValue;
        } else {
          const masterMenuItem = updatedUserTemplate.menuList.find(item => item.name === menuItem.name);
          if (masterMenuItem) {
            roleBasedData[roleName].push({
              ...masterMenuItem,
              showMenu: (menuItem.name === "Home" || menuItem.name === "Logout")
                ? true
                : newValue
            });
          }
        }
      });

      dispatch(setUserTemplate(updatedUserTemplate));
    }
  };


  const validateRoleForm = () => {
    let isValid = true;

    if (!newRole.trim()) {
      setRoleNameError("Role name is required");
      isValid = false;
    } else if (newRole.trim().length < 2) {
      setRoleNameError("Role name must be at least 2 characters");
      isValid = false;
    } else if (newRole.trim().toLowerCase().includes('patient')) {
      setRoleNameError("Role name cannot contain 'patient'");
      isValid = false;
    } else if (roles.some(role => role.displayName.toLowerCase() === newRole.trim().toLowerCase())) {
      setRoleNameError("Role name already exists");
      isValid = false;
    } else {
      setRoleNameError("");
    }

    return isValid;
  };

  const handleAddRole = async () => {
    if (!validateRoleForm()) {
      return;
    }

    if (isAddingRole) {
      return;
    }

    try {
      setIsAddingRole(true);
      dispatch(setLoader(true));

      const userGroupPayload = {
        name: newRole.trim(),
        displayName: newRole.trim(),
        description: `User group for ${newRole.trim()} role`
      };
      const userGroupResponse = await API.post('userGroups', userGroupPayload);
      const userGroupId = userGroupResponse.data.response.uid;

      const userRolePayload = {
        name: newRole.trim(),
        displayName: newRole.trim(),
        description: `User role for ${newRole.trim()}`,
        authorities: selectedAccess.length > 0 ? selectedAccess : ['ALL']
      };

      const userRoleResponse = await API.post('userRoles', userRolePayload);
      const userRoleId = userRoleResponse.data.response.uid;

      const updatedUserTemplate = JSON.parse(JSON.stringify(userTemplate));
      if (updatedUserTemplate && updatedUserTemplate.roleBasedArray && updatedUserTemplate.roleBasedArray.length > 0) {
        const roleBasedData = updatedUserTemplate.roleBasedArray[0];
        roleBasedData[newRole.trim()] = [];

        // Only add menu items explicitly selected in the Add Role modal
        const menuItemsToAdd = userTemplate.menuList.filter(item => selectedAccess.includes(item.name));


        menuItemsToAdd.forEach(menuItem => {
          roleBasedData[newRole.trim()].push({
            ...menuItem,
            showMenu: true
          });
        });

        dispatch(setUserTemplate(updatedUserTemplate));
      }

      const newRoleObject = {
        id: userRoleId,
        displayName: newRole.trim(),
        name: newRole.trim(),
        userGroupId: userGroupId,
        userRoleId: userRoleId,
        type: 'userRole'
      };

      setRoles(prevRoles => [...prevRoles, newRoleObject]);

      setUserAccess(prevUserAccess => {
        const updatedUserAccess = { ...prevUserAccess };
        if (userTemplate && userTemplate.programstages) {
          userTemplate.programstages.forEach(stage => {
            if (!updatedUserAccess[newRole]) {
              updatedUserAccess[newRole] = {};
            }
            updatedUserAccess[newRole][stage.keyname] = false; // Don't auto-select for new roles
          });
        }
        return updatedUserAccess;
      });

      setStageAccess(prevStageAccess => {
        const updatedStageAccess = { ...prevStageAccess };
        if (userTemplate && userTemplate.programstages) {
          userTemplate.programstages.forEach(stage => {
            updatedStageAccess[stage.keyname] = {
              ...updatedStageAccess[stage.keyname],
              [newRole]: false // Don't auto-select for new roles
            };
          });
        }
        return updatedStageAccess;
      });

      setTableDataState(prevTableData => {
        return prevTableData.map(row => ({ ...row, [newRole]: false })); // Don't auto-select for new roles
      });

      if (menuDataInitialized.current && menuItems.length > 0) {
        setMenuAccess(prevMenuAccess => {
          const updatedMenuAccess = { ...prevMenuAccess };
          menuItems.forEach(menuItem => {
            if (!updatedMenuAccess[menuItem.name]) {
              updatedMenuAccess[menuItem.name] = {};
            }
            updatedMenuAccess[menuItem.name][newRole] = false; // Start unchecked
          });
          return updatedMenuAccess;
        });

        setMenuTableData(prevMenuTableData => {
          return prevMenuTableData.map(row => ({ ...row, [newRole]: false })); // Start unchecked
        });

        setMenuRoles(prevMenuRoles => [...prevMenuRoles, newRoleObject]);
      }

      setUserGroups(prevGroups => [...prevGroups, {
        id: userGroupId,
        name: newRole.trim(),
        displayName: newRole.trim()
      }]);

      setUserRoles(prevRoles => [...prevRoles, {
        id: userRoleId,
        name: newRole.trim(),
        displayName: newRole.trim()
      }]);

      const selectedMenuCount = selectedAccess.length;
      const menuMessage = selectedMenuCount > 0
        ? ` with ${selectedMenuCount} menu item${selectedMenuCount > 1 ? 's' : ''} pre-selected`
        : '';

      toast.success(`Successfully created role "${newRole.trim()}" and user group in DHIS2${menuMessage}`);

      setNewRole("");
      // setSelectedAccess([]);
      setRoleNameError("");
      setAddNewModal(false);

    } catch (error) {
      console.error("Error creating role:", error);
      toast.error(`Failed to create role: ${error.response?.data?.message || error.message}`);
    } finally {
      dispatch(setLoader(false));
      setIsAddingRole(false);
    }
  };


  const handleCheckboxChange = (stageKey, role) => {
    // CRITICAL: Check if "Add New Client" is enabled for this role FIRST
    const isAddNewClientEnabled = menuAccess[addNewClientMenuName]?.[role];

    if (!isAddNewClientEnabled) {
      // Show warning and prevent stage selection
      Swal.fire({
        title: "Access Restricted",
        text: `"Add New Patient" menu item must be enabled for ${role} before selecting program stages.`,
        icon: "warning",
        confirmButtonText: "OK"
      });
      return; // BLOCK stage selection
    }

    // Original logic continues only if Add New Client is enabled
    const roleObject = roles.find(r =>
      (typeof r === 'object' ? r.displayName : r) === role
    );

    const currentUserTemplate = userTemplateRef.current;
    const updatedUserTemplate = JSON.parse(JSON.stringify(currentUserTemplate));

    if (updatedUserTemplate && updatedUserTemplate.programstages) {
      const stageIndex = updatedUserTemplate.programstages.findIndex(
        stage => stage.keyname === stageKey
      );

      if (stageIndex !== -1) {
        if (!updatedUserTemplate.programstages[stageIndex].userGroupAccesses) {
          updatedUserTemplate.programstages[stageIndex].userGroupAccesses = [];
        }

        const userAccessesArray = updatedUserTemplate.programstages[stageIndex].userGroupAccesses;
        const userGroupIdToHandle = roleObject?.userGroupId || roleObject?.id;

        const existingIndex = userAccessesArray.findIndex(
          access => access.userGroupUid === userGroupIdToHandle || access.id === userGroupIdToHandle
        );

        const currentValue = existingIndex !== -1;
        const newValue = !currentValue;

        console.log(`🔧 ${newValue ? 'Adding' : 'Removing'} access for ${role} in stage ${stageKey}`);

        if (newValue) {
          if (existingIndex === -1) {
            const userAccessObject = {
              id: userGroupIdToHandle,
              access: "rw------",
              userGroupUid: userGroupIdToHandle,
              displayName: role
            };
            updatedUserTemplate.programstages[stageIndex].userGroupAccesses.push(userAccessObject);
          }
        } else {
          const beforeLength = userAccessesArray.length;
          updatedUserTemplate.programstages[stageIndex].userGroupAccesses =
            userAccessesArray.filter(access =>
              access.userGroupUid !== userGroupIdToHandle && access.id !== userGroupIdToHandle
            );
        }

        dispatch(setUserTemplate(updatedUserTemplate));

        // Update local state
        setUserAccess(prevUserAccess => {
          const updatedUserAccess = JSON.parse(JSON.stringify(prevUserAccess));
          if (!updatedUserAccess[role]) {
            updatedUserAccess[role] = {};
          }
          updatedUserAccess[role][stageKey] = newValue;
          return updatedUserAccess;
        });

        setStageAccess(prevStageAccess => {
          const updatedStageAccess = JSON.parse(JSON.stringify(prevStageAccess));
          if (!updatedStageAccess[stageKey]) {
            updatedStageAccess[stageKey] = {};
          }
          updatedStageAccess[stageKey][role] = newValue;
          return updatedStageAccess;
        });

        setTableDataState(prevTableDataState => {
          return prevTableDataState.map(row => {
            if (row.stage === stageKey) {
              return { ...row, [role]: newValue };
            }
            return row;
          });
        });
      }
    }
  };


  const truncateRoleName = (roleName, maxLength = 15) => {
    if (roleName.length <= maxLength) {
      return roleName;
    }

    const truncated = roleName.substring(0, maxLength) + '...';
    return (
      <OverlayTrigger
        placement="top"
        overlay={<Tooltip id={`tooltip-${roleName}`}>{roleName}</Tooltip>}
      >
        <span style={{ cursor: 'help' }}>{truncated}</span>
      </OverlayTrigger>
    );
  };

  const columns = [
    {
      dataField: "stage",
      text: "Program Stage",
      headerStyle: {
        fontWeight: "bold",
        minWidth: '200px',
        textAlign: 'center',
        verticalAlign: 'middle'
      },
      style: { textAlign: 'center', verticalAlign: 'middle', padding: '10px' }
    },
    ...filterNonPatientRoles(roles).map(role => {
      const roleName = typeof role === 'object' ? role.displayName : role;

      const allStagesSelected = userTemplate?.programstages?.every(stage =>
        userAccess[roleName] && userAccess[roleName][stage.keyname]
      ) || false;

      return {
        dataField: roleName,
        text: (
          <div style={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            padding: '8px 4px'
          }}>
            <div style={{
              marginBottom: '8px',
              wordWrap: 'break-word',
              textAlign: 'center',
              width: '100%'
            }}>
              {truncateRoleName(roleName)}
            </div>
            <Button
              size="sm"
              variant={allStagesSelected ? "danger" : "success"}
              onClick={() => handleStageSelectAll(roleName)}
              style={{
                fontSize: '10px',
                padding: '4px 8px',
                whiteSpace: 'nowrap',
                minWidth: '80px'
              }}
            >
              {allStagesSelected ? "Deselect All" : "Select All"}
            </Button>
          </div>
        ),
        formatter: (cell, row) => {
          // ✅ DYNAMIC CHECK - Runs every time a cell renders
          const isAddNewClientEnabled = menuAccess['Add New Patient']?.[roleName] === true;

          return (
            <div style={{
              textAlign: 'center',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100%',
              padding: '10px'
            }}>
              <input
                type="checkbox"
                checked={row[roleName] || false}
                disabled={!isAddNewClientEnabled}
                onChange={isAddNewClientEnabled ? () => handleCheckboxChange(row.stage, roleName) : undefined}
                style={{
                  transform: 'scale(1.2)',
                  opacity: isAddNewClientEnabled ? 1 : 0.5,
                  cursor: isAddNewClientEnabled ? 'pointer' : 'not-allowed'
                }}
                title={!isAddNewClientEnabled
                  ? `"Add New Patient" must be enabled for ${roleName} in Menu Management`
                  : `Toggle ${row.stage} access for ${roleName}`
                }
              />
            </div>
          );
        },
        headerStyle: {
          minWidth: '140px',
          maxWidth: '200px',
          textAlign: 'center',
          verticalAlign: 'middle',
          padding: '8px'
        },
        style: {
          textAlign: 'center',
          verticalAlign: 'middle',
          padding: '10px',
          backgroundColor: menuAccess['Add New Patient']?.[roleName] === true ? 'transparent' : '#f8f9fa',
          opacity: menuAccess['Add New Patient']?.[roleName] === true ? 1 : 0.8
        }
      };
    })
  ];



  const handleMenuCheckboxChange = (menuKey, role) => {
    const currentUserTemplate = userTemplateRef.current;
    const updatedUserTemplate = JSON.parse(JSON.stringify(currentUserTemplate));

    if (updatedUserTemplate && updatedUserTemplate.roleBasedArray && updatedUserTemplate.roleBasedArray.length > 0) {
      const roleBasedData = updatedUserTemplate.roleBasedArray[0];

      if (!roleBasedData[role]) {
        roleBasedData[role] = [];
      }

      const roleMenuItems = roleBasedData[role];
      const menuItemIndex = roleMenuItems.findIndex(item => item.name === menuKey);

      if (menuItemIndex !== -1) {
        const newValue = !roleMenuItems[menuItemIndex].showMenu;
        roleMenuItems[menuItemIndex].showMenu = newValue;
      } else {
        const masterMenuItem = updatedUserTemplate.menuList.find(item => item.name === menuKey);
        if (masterMenuItem) {
          roleMenuItems.push({
            ...masterMenuItem,
            showMenu: true
          });
        }
      }

      dispatch(setUserTemplate(updatedUserTemplate));

      setMenuAccess(prevMenuAccess => {
        const updatedMenuAccess = JSON.parse(JSON.stringify(prevMenuAccess));
        const currentValue = prevMenuAccess[menuKey][role];
        updatedMenuAccess[menuKey][role] = !currentValue;
        return updatedMenuAccess;
      });

      setMenuTableData(prevMenuTableData => {
        return prevMenuTableData.map(row => {
          if (row.menuItem === menuKey) {
            const currentValue = row[role];
            return { ...row, [role]: !currentValue };
          }
          return row;
        });
      });

      // ✅ ADD THESE LINES AT THE END:
      if (menuKey === 'Add New Client') {
        console.log(`🚀 "Add New Client" toggled for ${role} - forcing Program Stages refresh`);
        setTableKey(prev => prev + 1);
      }
    }
  };


  const menuColumns = [
    {
      dataField: "menuItem",
      text: "Menu Item",
      headerStyle: {
        fontWeight: "bold",
        minWidth: '200px',
        textAlign: 'center',
        verticalAlign: 'middle'
      },
      style: { textAlign: 'center', verticalAlign: 'middle', padding: '10px' }
    },
    {
      dataField: 'sortOrder',
      text: 'Sort Order',
      headerStyle: {
        fontWeight: "bold",
        minWidth: '200px',
        textAlign: 'center',
        verticalAlign: 'middle'
      },
      style: { textAlign: 'center', verticalAlign: 'middle', padding: '10px' },
      formatter: (cell, row, rowIndex) => (
        console.log("Rendering sortOrder for row:", row, "at index:", rowIndex),
        <input
          type="number"
          defaultValue={row.menuItem == "Home" ? 1 : row.menuItem == "Logout" ? 999 : parseInt(row.sortOrder) ?? ''}
          disabled={row.menuItem == "Home" || row.menuItem == "Logout" ? true : false}
          onInput={e => {
            // Prevent typing more than 3 digits
            if (e.target.value.length > 3) {
              e.target.value = e.target.value.slice(0, 3);
            }

          }}
          onBlur={e => {
            let newVal = e.target.value.replace(/[^0-9]/g, '').slice(0, 3);

            // if (newVal === '') {
            //   // Allow empty value
            //   setMenuTableData(prevData => {
            //     const newData = [...prevData];
            //     newData[rowIndex] = { ...newData[rowIndex], sortOrder: '' };
            //     return newData;
            //   });
            //   return;
            // }
            let showAlert = false;
            let alertMessage = '';
            console.log("newVal ", newVal)
            // Auto-correct the value
            if (newVal === '') {
              newVal = '2';
              e.target.value = newVal;
              showAlert = true;
              alertMessage = 'Sort order cannot be empty. Value has been set to 2.';
            } else if (parseInt(newVal) < 2) {
              newVal = '2';
              e.target.value = newVal;
              showAlert = true;
              alertMessage = 'Sort order must be at least 2. Value has been set to 2.';
            } else if (parseInt(newVal) > 998) {
              newVal = '998';
              e.target.value = newVal;
              showAlert = true;
              alertMessage = 'Sort order must not exceed 998. Value has been set to 998.';
            }

            if (showAlert) {
              Swal.fire({
                title: "Value Adjusted",
                text: alertMessage,
                icon: "info",
                confirmButtonText: "OK"
              });
            }

            // Update if valid
            setMenuTableData(prevData => {
              const newData = [...prevData];
              newData[rowIndex] = { ...newData[rowIndex], sortOrder: newVal };
              return newData;
            });
          }}
          style={{ width: '60px', textAlign: 'center' }}
          min={2}
          max={998}
        />

      )

    },

    ...filterNonPatientRoles(menuRoles).map(role => {
      const roleName = typeof role === 'object' ? role.displayName : role;

      const allMenusSelected = menuItems?.every(menuItem =>
        menuAccess[menuItem.name] && menuAccess[menuItem.name][roleName]
      ) || false;

      return {
        dataField: roleName,
        text: (
          <div style={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            padding: '8px 4px'
          }}>
            <div style={{
              marginBottom: '8px',
              wordWrap: 'break-word',
              textAlign: 'center',
              width: '100%'
            }}>
              {truncateRoleName(roleName)}
            </div>
            <Button
              size="sm"
              variant={allMenusSelected ? "danger" : "success"}
              onClick={() => handleMenuSelectAll(roleName)}
              style={{
                fontSize: '10px',
                padding: '4px 8px',
                whiteSpace: 'nowrap',
                minWidth: '80px'
              }}
            >
              {allMenusSelected ? "Deselect All" : "Select All"}
            </Button>
          </div>
        ),
        formatter: (cell, row) => (
          <div style={{
            textAlign: 'center',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
            padding: '10px'
          }}>
            <input
              type="checkbox"
              checked={
                row.menuItem === "Home" || row.menuItem === "Logout"
                  ? true
                  : row[roleName] || false
              }
              disabled={row.menuItem === "Home" || row.menuItem === "Logout"}
              onChange={() => handleMenuCheckboxChange(row.menuItem, roleName)}
              style={{ transform: "scale(1.2)" }}
            />

          </div>
        ),
        headerStyle: {
          minWidth: '140px',
          maxWidth: '200px',
          textAlign: 'center',
          verticalAlign: 'middle',
          padding: '8px'
        },
        style: {
          textAlign: 'center',
          verticalAlign: 'middle',
          padding: '10px'
        }
      };
    })
  ];

  const getUserGroups = () => {
    API.get(`userGroups`).then((res) => {
      if (res?.data?.userGroups) {
        setUserGroups(res.data.userGroups);
      }
    }).catch(error => {
      console.error("Error fetching user groups:", error);
    });
  }

  const getUserRoles = () => {
    API.get(`userRoles?fields=id,displayName,name&paging=false`).then((res) => {
      if (res?.data?.userRoles) {
        setUserRoles(res.data.userRoles);
      }
    }).catch(error => {
      console.error("Error fetching user roles:", error);
    });
  }

const refreshDataAfterUpdate = async (orguid) => {
  try {
    console.log("Starting data refresh after update...");

    // Reset initialization flags
    menuDataInitialized.current = false;
    stageDataInitialized.current = false;

    dispatch(setLoader(true));

    // Fetch fresh data from server
    const orgId = storeState.user.userDetails.organisationUnits[0].id;
    const res = await API.get(`tracker/smartsetup/get/${orguid ? orguid : orgId}`);

    // Get program template
    const freshProgramTemplate = await API.get(`dataStore/template/programtemplate`);

    if (freshProgramTemplate.status === 200) {
      const freshTemplate = { ...freshProgramTemplate.data };

      // Map the fresh data
      freshTemplate.programstages = res.data.data.programstages;
      freshTemplate.trackedentityattributes = res.data.data.trackedentityattributes;
      freshTemplate.userAccesses = res.data.data.userGroupAccesses;
      freshTemplate.organisationUnits = res.data.data.organisationUnits;

      // Include all programdetails fields
      if (res.data.programdetails.roleBasedArray) {
        freshTemplate.roleBasedArray = res.data.programdetails.roleBasedArray;
      }
      if (res.data.programdetails.showInQrCard) {
        freshTemplate.showInQrCard = res.data.programdetails.showInQrCard;
      }
      freshTemplate.appname = res.data.programdetails.appname;
      freshTemplate.countries = res.data.programdetails.countries;
      freshTemplate.description = res.data.programdetails.description;
      freshTemplate.disclaimer = res.data.programdetails.disclaimer;
      freshTemplate.logo = res.data.programdetails.logo;
      freshTemplate.name = res.data.programdetails.name;
      freshTemplate.programuid = res.data.programdetails.programuid;
      freshTemplate.selectedlanguage = res.data.programdetails.selectedlanguage;
      freshTemplate.users = res.data.programdetails.users;
      freshTemplate.deletedObjects = res.data.programdetails.deletedObjects || {
        deletedAttribute: [],
        deletedDataElement: []
      };
      freshTemplate.programSections = res.data.data.programSections;

      // ✅ FIX 1: Process TRACKED ENTITY ATTRIBUTES for attributes tab
      let tempTrackHolder = [];
      if (res.data.data.trackedentityattributes) {
        for (const element of res.data.data.trackedentityattributes) {
          if (element.type == "boolean") {
            let found = false;
            if (res.data.data.programSections) {
              for (const section of res.data.data.programSections) {
                if (section.name.includes(element.name)) {
                  element.attributeRefType = "checkbox";
                  element.type = "checkbox";
                  element.checkboxoption = _.map(
                    section.trackedEntityAttributes,
                    function (elemgrp) {
                      return elemgrp.name;
                    }
                  );

                  let checkboxvalues = [];
                  section.trackedEntityAttributes.forEach((el) => {
                    res.data.data.trackedentityattributes.forEach((ell) => {
                      if (ell.trackedEntityAttributeId == el.id) {
                        // Mark as checkbox option
                        checkboxvalues.push({ ...ell, isCheckboxOption: true });
                      }
                    });
                  });

                  element.options = checkboxvalues;
                  tempTrackHolder.push(element);
                  found = true;
                  break;
                }
              }
            }
            if (!found) {
              tempTrackHolder.push(element);
            }
          } else {
            tempTrackHolder.push(element);
          }
        }
      }
      freshTemplate.trackedentityattributes = tempTrackHolder;

      // ✅ FIX 2: Process PROGRAM STAGES - Use async/await with Promise.all
      if (freshTemplate.programstages && Array.isArray(freshTemplate.programstages)) {
        const checkboxPromises = [];

        freshTemplate.programstages.forEach((stage) => {
          if (stage.dataelements && Array.isArray(stage.dataelements)) {
            stage.dataelements.forEach((element) => {
              if (element.type == "boolean") {
                const promise = API.get(
                  "dataElementGroups?filter=identifiable:token:" +
                    element.dhisname +
                    "&paging=false&fields=id,name,dataElements[id,displayName~rename(code),formName~rename(name)]"
                ).then((groupRes) => {
                  if (groupRes.data.dataElementGroups.length > 0) {
                    let currentGroup = _.findWhere(groupRes.data.dataElementGroups, { name: element.dhisname });

                    if (currentGroup) {
                      // Convert to checkbox parent
                      element.attributeRefType = "checkbox";
                      element.type = "checkbox";
                      element.groupid = currentGroup.id;
                      element.checkboxoption = _.map(
                        currentGroup.dataElements,
                        function (elemgrp) {
                          return elemgrp.name;
                        }
                      );

                      let checkboxvalues = [];

                      // ✅ Mark all checkbox option dataElements as hidden
                      currentGroup.dataElements.forEach((el) => {
                        stage.dataelements.forEach((ell) => {
                          if (ell.dataElementId == el.id) {
                            // Mark this as a checkbox option (not a standalone question)
                            // ell.isCheckboxOption = true;
                            // ell.parentCheckboxId = element.dataElementId;
                            // checkboxvalues.push(ell);
                            checkboxvalues.push({
                                ...ell,
                                isCheckboxOption: true,
                                parentCheckboxId: element.dataElementId,
                            });
                          }
                        });
                      });

                      console.log("Processed checkbox in refresh:", element.dhisname, "with", checkboxvalues.length, "options");
                      element.options = checkboxvalues;
                    }
                  }
                }).catch(err => {
                  console.error("Error fetching checkbox for " + element.dhisname, err);
                });

                checkboxPromises.push(promise);
              }
            });
          }
        });

        // ✅ CRITICAL: Wait for ALL checkbox API calls to complete
        console.log("Waiting for " + checkboxPromises.length + " checkbox groups to load...");
        await Promise.all(checkboxPromises);
        console.log("All checkboxes processed in refresh");
      }

      // ✅ FIX 3: Call getDependency to process stageDependentArray and attributedependentquestions
      console.log("Calling getDependency to process parent questions...");
      await getDependency(res.data, freshTemplate);
      
      console.log("✅ Data refresh completed - getDependency finished");
      
      // ✅ FIX 4: Close the loader (getDependency doesn't close it in this flow)
      dispatch(setLoader(false));
      
    } else {
      console.error("Failed to fetch program template");
      dispatch(setLoader(false));
    }
  } catch (error) {
    console.error("Error refreshing data:", error);
    dispatch(setLoader(false));
    // Still redirect on error
    dispatch(setActiveTab("step1"));
  }
};

  // =====================================================
  // NEW: Validation function to check at least one stage per role
  // =====================================================
  const validateStageAccessBeforePublish = () => {
    console.log("🔍 Validating stage access before publish...");

    const currentUserTemplate = userTemplateRef.current;

    if (!currentUserTemplate || !currentUserTemplate.programstages || currentUserTemplate.programstages.length === 0) {
      console.log("⚠️ No program stages found");
      return { isValid: true, message: "" };
    }

    // Get all unique roles from all stages
    const allRoles = new Set();
    currentUserTemplate.programstages.forEach(stage => {
      if (stage.userGroupAccesses && Array.isArray(stage.userGroupAccesses)) {
        stage.userGroupAccesses.forEach(access => {
          if (access.displayName) {
            allRoles.add(access.displayName);
          }
        });
      }
    });

    console.log("👥 Roles found in stages:", Array.from(allRoles));

    // Check each role has at least one stage
    const rolesWithoutStages = [];

    roles.forEach(roleObject => {
      const roleName = roleObject.displayName;

      // Check if this role has access to at least one stage
      const hasAccessToAnyStage = currentUserTemplate.programstages.some(stage => {
        if (!stage.userGroupAccesses || !Array.isArray(stage.userGroupAccesses)) {
          return false;
        }

        return stage.userGroupAccesses.some(access => {
          const matchesByUid = access.userGroupUid === roleObject.userGroupId || access.userGroupUid === roleObject.id;
          const matchesById = access.id === roleObject.userGroupId || access.id === roleObject.id;
          const matchesByName = access.displayName === roleName;

          return matchesByUid || matchesById || matchesByName;
        });
      });

      if (!hasAccessToAnyStage) {
        rolesWithoutStages.push(roleName);
      }
    });

    if (rolesWithoutStages.length > 0) {
      const rolesList = rolesWithoutStages.join(", ");
      const message = `The following role${rolesWithoutStages.length > 1 ? 's' : ''} must have at least one program stage selected: ${rolesList}`;
      console.log("❌ Validation failed:", message);
      return { isValid: false, message };
    }

    console.log("✅ Validation passed - all roles have at least one stage");
    return { isValid: true, message: "" };
  };


  // =====================================================
  // NEW: Validation function to check at least one menu item per role
  // =====================================================
  const validateMenuAccessBeforePublish = () => {
    console.log("🔍 Validating menu access before publish...");

    const currentUserTemplate = userTemplateRef.current;

    if (!currentUserTemplate || !currentUserTemplate.roleBasedArray ||
      currentUserTemplate.roleBasedArray.length === 0) {
      console.log("⚠️ No roleBasedArray found");
      return { isValid: true, message: "" };
    }

    const roleBasedData = currentUserTemplate.roleBasedArray[0];

    if (!roleBasedData || Object.keys(roleBasedData).length === 0) {
      console.log("⚠️ No roles found in roleBasedArray");
      return { isValid: true, message: "" };
    }

    console.log("👥 Roles in roleBasedArray:", Object.keys(roleBasedData));

    const rolesWithoutMenus = [];

    // Check each role in menuRoles
    menuRoles.forEach(roleObject => {
      const roleName = roleObject.displayName;

      // Get menu items for this role
      const roleMenuItems = roleBasedData[roleName] || [];

      console.log(`Checking role: ${roleName}, menu items:`, roleMenuItems);

      // Check if at least one menu item has showMenu = true
      const hasAccessToAnyMenu = roleMenuItems.some(menuItem => menuItem.showMenu === true);

      if (!hasAccessToAnyMenu) {
        rolesWithoutMenus.push(roleName);
        console.log(`❌ Role "${roleName}" has no menu items enabled`);
      } else {
        console.log(`✅ Role "${roleName}" has at least one menu enabled`);
      }
    });

    if (rolesWithoutMenus.length > 0) {
      const rolesList = rolesWithoutMenus.join(", ");
      const message = `The following role${rolesWithoutMenus.length > 1 ? 's' : ''} must have at least one menu item selected: ${rolesList}`;
      console.log("❌ Menu validation failed:", message);
      return { isValid: false, message };
    }

    console.log("✅ Menu validation passed - all roles have at least one menu item");
    return { isValid: true, message: "" };
  };


  const publishCall = () => {
    //Checking Menu sort order
    const { duplicates, duplicateIndices, invalidEntries } = validateSortOrders();

    // Check for invalid entries first
    if (invalidEntries.length > 0) {
      let message = '<div style="text-align: left;"><strong>Invalid sort orders found:</strong><br><br>';
      invalidEntries.forEach(entry => {
        message += `• <strong>${entry.menuItem}</strong>: ${entry.issue}`;
        if (entry.currentValue !== 'empty') {
          message += ` (Current value: ${entry.currentValue})`;
        }
        message += '<br>';
      });
      message += '</div>';

      Swal.fire({
        title: "Invalid Sort Orders",
        html: message,
        icon: "error",
        confirmButtonText: "OK",
        width: '600px'
      });

      return false;
    }

    if (duplicates.length > 0) {
      let message = "Duplicate sort orders found:\n\n";
      duplicates.forEach(dup => {
        message += `Sort Order ${dup.sortOrder}: ${dup.items.join(' and ')}\n`;
      });
      message += "\nPlease assign unique sort orders before submitting.";

      Swal.fire({
        title: "Duplicate Sort Orders",
        html: message.replace(/\n/g, '<br>'),
        icon: "error",
        confirmButtonText: "OK"
      });

      console.log("Duplicate rows at indices:", duplicateIndices);
      return false;
    }

    // Validate program stages
    // const stageValidation = validateStageAccessBeforePublish();

    // if (!stageValidation.isValid) {
    //   Swal.fire({
    //     title: "Validation Error",
    //     text: stageValidation.message,
    //     icon: "error",
    //     confirmButtonText: "OK"
    //   });
    //   return;
    // }

    // Validate menu items
    // const menuValidation = validateMenuAccessBeforePublish();

    // if (!menuValidation.isValid) {
    //   Swal.fire({
    //     title: "Validation Error",
    //     text: menuValidation.message,
    //     icon: "error",
    //     confirmButtonText: "OK"
    //   });
    //   return;
    // }

    // Both validations passed, proceed with publish
    proceedWithPublish();
  };


  const proceedWithPublish = () => {
    // Helper function to update sortOrder in roleBasedArray (user-defined for ALL menus including Home/Logout)
    const updateSortOrderInRoleBasedArray = (userTemplate, menuTableData) => {
      if (!userTemplate.roleBasedArray || userTemplate.roleBasedArray.length === 0) {
        return [];
      }
      const allRoleNames = menuRoles.map(item => item.displayName);

      // Start with a copy of existing data
      const roleBasedData = { ...userTemplate.roleBasedArray[0] };

      // Add new roles only if they don't exist
      allRoleNames.forEach(roleName => {
        if (!roleBasedData.hasOwnProperty(roleName)) {
          roleBasedData[roleName] = {};
        }
        // If key exists, keep existing value (don't overwrite)
      });
      //const roleBasedData = userTemplate.roleBasedArray[0];

      Object.keys(roleBasedData).forEach(roleName => {
        // Ensure array exists for this role
        if (!Array.isArray(roleBasedData[roleName])) {
          roleBasedData[roleName] = [];
        }

        // Update ALL menu items from menuTableData sortOrder values (including Home/Logout)
        roleBasedData[roleName].forEach(menuItem => {
          const matchedItem = menuTableData.find(row => row.menuItem === menuItem.name);
          if (matchedItem && matchedItem.sortOrder !== undefined && matchedItem.sortOrder !== '') {
            // Accept any positive number (1-100+), convert to number if valid
            const sortOrderNum = parseInt(matchedItem.sortOrder);
            if (!isNaN(sortOrderNum) && sortOrderNum >= 1) {
              menuItem.sortOrder = sortOrderNum;
            }
          }
        });

        // Ensure Home/Logout exist (but let user define sortOrder via table)
        ['Home', 'Logout'].forEach(menuName => {
          const exists = roleBasedData[roleName].some(item => item.name === menuName);
          if (!exists) {
            roleBasedData[roleName].push({
              name: menuName,
              showMenu: true,
              icon: menuName === 'Home' ? 'faHome' : 'faSignOutAlt',
              sortOrder: menuName === 'Home' ? 1 : 999
              // ✅ No sortOrder here - user will set it via table input
            });
          } else {
            // Ensure showMenu is true but don't override user sortOrder
            const homeLogoutItem = roleBasedData[roleName].find(item => item.name === menuName);
            homeLogoutItem.showMenu = true;
            homeLogoutItem.icon = menuName === 'Home' ? 'faHome' : 'faSignOutAlt';
            homeLogoutItem.sortOrder = menuName === 'Home' ? 1 : 999
          }
        });
      });
      return roleBasedData;
    };
    // Get the latest userTemplate from ref
    const latestUserTemplate = JSON.parse(JSON.stringify(userTemplateRef.current));

    // ✅ Apply sortOrder updates to latestUserTemplate (user-defined for ALL menus)
    latestUserTemplate.roleBasedArray = [updateSortOrderInRoleBasedArray(latestUserTemplate, menuTableData)];

    // Clean up languages (KEEP EXISTING)
    latestUserTemplate.programstages.map(dataset => {
      dataset.languages = [];
      dataset.dataelements.map(element => {
        if (!Array.isArray(element.languages)) element.languages = [];
        else {
          element.languages = element.languages.filter(el => {
            if (el.value != '') return el;
          });
        }
      });
    });

    // ✅ Simplified: No separate Home/Logout block needed (handled in helper)
    // All existing functionality preserved

    if (storeState.user.isEdit) {
      latestUserTemplate['userid'] = userDetails.id;
      latestUserTemplate['username'] = userDetails.username;
      latestUserTemplate['orgid'] = storeState.user.userDetails.organisationUnits[0].id;
      latestUserTemplate['programuid'] = storeState.programDetails.userTemplate.programuid;
      latestUserTemplate['attributedependentquestions'] = storeState.programDetails.userTemplate.attributedependentquestions;

      console.log("🚀 Sending update with userTemplate:");
      console.log("   Program stages:", latestUserTemplate.programstages?.length);
      latestUserTemplate.programstages?.forEach(stage => {
        console.log(`   ${stage.keyname}: ${stage.userGroupAccesses?.length || 0} accesses`, stage.userGroupAccesses);
      });
      console.log("useTemplate > edit", latestUserTemplate);
      dispatch(setLoader(true));
      API.post('tracker/smartsetup/edit', latestUserTemplate).then(res => {
        dispatch(setLoader(false));
        console.log("✅ Update response:", res.data);

        if (res.data.status == 'OK') {
          swal({
            title: "Success",
            text: "Program details updated sucessfully",
            icon: "success",
            button: "Close",
          }).then(function () {
            console.log("🔄 User acknowledged - refreshing data...");
            refreshDataAfterUpdate(null);
          });
        } else {
          toast.success('Program details updated sucessfully', {
            style: {
              border: '1px solid #44546A',
              padding: '16px',
            },
          });
          setTimeout(() => {
            refreshDataAfterUpdate(null);
          }, 2000);
        }
      }).catch(error => {
        dispatch(setLoader(false));
        console.error("❌ Update error:", error);
        toast.error('Failed to update program details');
      });
    } else {
      // Publish logic
      latestUserTemplate['userid'] = userDetails.id;
      latestUserTemplate['username'] = userDetails.username;
      latestUserTemplate['attributedependentquestions'] = storeState.programDetails.userTemplate.attributedependentquestions;

      console.log("🚀 Sending publish with userTemplate:");
      console.log("   Program stages:", latestUserTemplate.programstages?.length);
      latestUserTemplate.programstages?.forEach(stage => {
        console.log(`   ${stage.keyname}: ${stage.userGroupAccesses?.length || 0} accesses`, stage.userGroupAccesses);
      });
      console.log("useTemplate > save", userTemplate);

      dispatch(setLoader(true));
      API.post('tracker/smartsetup/save', latestUserTemplate).then(res => {
        dispatch(setLoader(false));
        if (res.status == 200) {
          setUserArray(res.data.data);
          swal({
            title: "Program details published sucessfully",
            content: "",
            icon: "success",
            button: "Ok",
          }).then(function () {
            if (res.data.orguid)
              refreshDataAfterUpdate(res.data.orguid);
            else
              refreshDataAfterUpdate(null);
            setShowModal(true);
          });
        }
      }).catch(error => {
        console.log(error);
        dispatch(setLoader(false));
        toast.error('Failed to publish program details');
      });
    }
  }





  const getProgramTemplate = (data) => {
    dispatch(setLoader(true))
    API.get(`dataStore/template/programtemplate`).then((res) => {
      dispatch(setLoader(false))
      if (res.status === 200) {
        if (data) {
          res.data.programstages = data.data.programstages
          res.data.trackedentityattributes = data.data.trackedentityattributes
          res.data["userAccesses"] = data.data.userGroupAccesses
          res.data["organisationUnits"] = data.data.organisationUnits
          res.data.appname = data.programdetails.appname
          res.data.countries = data.programdetails.countries
          res.data.description = data.programdetails.description
          res.data.disclaimer = data.programdetails.disclaimer
          res.data.logo = data.programdetails.logo
          res.data.name = data.programdetails.name
          res.data.resetPassFlag = data.programdetails.resetPassFlag || true;
          res.data.programuid = data.programdetails.programuid
          res.data.selectedlanguage = data.programdetails.selectedlanguage
          res.data['users'] = data.programdetails.users
          res.data['deletedObjects'] = data.programdetails.deletedObjects ? data.programdetails.deletedObjects : { "deletedAttribute": [], "deletedDataElement": [] }
          res.data["programSections"] = data.data.programSections;
          res.data.roleBasedArray = data.programdetails.roleBasedArray;
          res.data.showInQrCard = data.programdetails?.showInQrCard || [];
          let tempTrackHolder = []

          data.data.trackedentityattributes.map(element => {
            if (element.type == 'boolean') {
              data.data.programSections.map(section => {
                if (section.name.includes(element.name)) {
                  element.attributeRefType = 'checkbox'
                  element.type = 'checkbox'
                  element.checkboxoption = _.map(section.trackedEntityAttributes, function (elemgrp) { return elemgrp.name })
                  let checkboxvalues = []
                  section.trackedEntityAttributes.map(el => {
                    data.data.trackedentityattributes.map(ell => {
                      if (ell.trackedEntityAttributeId == el.id)
                        checkboxvalues.push(ell)
                    })
                  })
                  element.options = checkboxvalues
                  tempTrackHolder.push(element)
                }
              })
            } else {
              tempTrackHolder.push(element)
            }
          })
          res.data.trackedentityattributes = tempTrackHolder
        }
        dispatch(setUserTemplate(res.data))
        if (data && data.data && data.programdetails)
          getDependency(data, res.data)
        else
          dispatch(setActiveTab('step1'))
      }
    }).catch(error => {
      dispatch(setLoader(false))
      console.log(error)
    })
  }

  const getDependency = async (data, userTemplate) => {
    console.log("getDependency called", userTemplate);
    let programuid = data.programdetails.programuid;
    var programRules,
      programRuleVariables,
      stageDependentArray = [];
    var attributedependentquestions = [];

    try {
      // Fetch program rule variables
      const variablesResponse = await API.get(
        `programRuleVariables?fields=id,displayName,programRuleVariableSourceType,program[id],programStage[id],dataElement[id,name,description],trackedEntityAttribute[id],useCodeForOptionSet&paging=false`
      );
      console.log("Fetched program rule variables");
      programRuleVariables = variablesResponse.data.programRuleVariables;

      // Fetch program rules
      const rulesResponse = await API.get(
        `programRules?filter=program.id:eq:` +
        programuid +
        `&filter=name:ne:default&fields=id,displayName,condition,description,program[id],programStage[id],priority,programRuleActions[id,content,location,data,programRuleActionType,programStageSection[id],dataElement[id],trackedEntityAttribute[id],option[id],optionGroup[id],programIndicator[id],programStage[id]]&paging=false`
      );
      console.log("Fetched program rules");
      programRules = rulesResponse.data.programRules;

      // STEP 1: Process dependencies for STAGES
      programRuleVariables.forEach((variable) => {
        if (variable.program.id == programuid) {
          if (
            variable.programRuleVariableSourceType ==
            "DATAELEMENT_NEWEST_EVENT_PROGRAM_STAGE"
          ) {
            let temp = {};
            temp["dependentdataelementnames"] = [];
            let hasValidRule = false;

            programRules.forEach((rule) => {
              if (rule.condition && rule.condition.includes("!=")) {
                const match = rule.condition.match(/\{(.*?)\}/);
                if (match && match[1] == variable.displayName) {
                  hasValidRule = true;
                  temp["variableName"] = variable.displayName;
                  temp["dataElementId"] = variable.dataElement.id;
                  temp["variableId"] = variable.id;
                  temp["dataelementname"] = variable?.dataElement?.name.includes("_") ? variable?.dataElement?.name.split("_")[1] : variable?.dataElement?.name; //variable.displayName.split("_")[1];
                  temp["ruleId"] = rule.id;
                  temp["matchingvalue"] = rule.condition
                    .split("!= ")[1]
                    .replaceAll("'", "");

                  const stageFromTemplate = _.find(userTemplate.programstages, {
                    id: variable?.programStage?.id,
                  });
                  temp["stagename"] = stageFromTemplate?.name;

                  let stageIndex = _.findIndex(userTemplate.programstages, {
                    id: variable?.programStage?.id,
                  });

                  // ✅ FIX: Match by dataElementId, NOT name
                  let parentIndex = _.findIndex(
                    userTemplate.programstages[stageIndex]?.dataelements,
                    { dataElementId: variable.dataElement.id }
                  );

                  console.log("Parent lookup:", {
                    variableName: variable.displayName,
                    dataElementId: variable.dataElement.id,
                    stageIndex,
                    parentIndex,
                    stageName: temp.stagename
                  });

                  rule.programRuleActions.forEach((action) => {
                    if (
                      action?.dataElement?.id &&
                      _.find(
                        userTemplate.programstages[stageIndex]?.dataelements,
                        { dataElementId: action?.dataElement?.id }
                      )
                    ) {
                      let objHolder = {};
                      const childElement = _.find(
                        userTemplate.programstages[stageIndex]?.dataelements,
                        { dataElementId: action?.dataElement?.id }
                      );
                      objHolder["childdataelementname"] = childElement?.name;
                      objHolder["actionId"] = action.id;
                      objHolder["dataElementId"] = action?.dataElement?.id;
                      temp["dependentdataelementnames"].push(objHolder);

                      // ✅ FIX: Match by dataElementId, NOT name
                      let childIndex = _.findIndex(
                        userTemplate.programstages[stageIndex]?.dataelements,
                        { dataElementId: action?.dataElement?.id }
                      );

                      if (childIndex !== -1 && parentIndex !== -1) {
                        console.log("Setting parentQuestion for child:", {
                          childName: childElement?.name,
                          childIndex,
                          parentIndex,
                          dependentValue: temp.matchingvalue
                        });
                        userTemplate.programstages[stageIndex].dataelements[
                          childIndex
                        ]["parentQuestion"] = parentIndex;
                        userTemplate.programstages[stageIndex].dataelements[
                          childIndex
                        ]["dependentValue"] = temp.matchingvalue;
                      } else {
                        console.warn("Could not set parentQuestion:", {
                          childIndex,
                          parentIndex,
                          childName: childElement?.name
                        });
                      }
                    }
                  });
                }
              }
            });

            if (hasValidRule && temp.dependentdataelementnames.length > 0) {
              stageDependentArray.push(temp);
            }
          } else if (
            variable.programRuleVariableSourceType == "TEI_ATTRIBUTE"
          ) {
            let temp = {};
            temp["dependentdataelementnames"] = [];
            let hasValidRule = false;

            programRules.forEach((rule) => {
              if (rule.condition && rule.condition.includes("!=")) {
                const match = rule.condition.match(/\{(.*?)\}/);
                if (match && match[1] == variable.displayName) {
                  hasValidRule = true;
                  temp["variableId"] = variable.id;
                  temp["dataelementname"] = variable.displayName.split("_")[1];
                  temp["ruleId"] = rule.id;
                  temp["matchingvalue"] = rule.condition
                    .split("!= ")[1]
                    .replaceAll("'", "");

                  // ✅ FIX: Match by trackedEntityAttributeId
                  let parentIndex = _.findIndex(
                    userTemplate.trackedentityattributes,
                    { trackedEntityAttributeId: variable.trackedEntityAttribute.id }
                  );

                  rule.programRuleActions.forEach((action) => {
                    if (
                      action?.trackedEntityAttribute?.id &&
                      _.find(userTemplate.trackedentityattributes, {
                        trackedEntityAttributeId: action.trackedEntityAttribute.id,
                      })
                    ) {
                      let objHolder = {};
                      const childAttr = _.find(
                        userTemplate.trackedentityattributes,
                        {
                          trackedEntityAttributeId: action.trackedEntityAttribute.id,
                        }
                      );
                      objHolder["childdataelementname"] = childAttr?.name;

                      let childIndex = _.findIndex(
                        userTemplate.trackedentityattributes,
                        { trackedEntityAttributeId: action.trackedEntityAttribute.id }
                      );

                      objHolder["actionId"] = action.id;
                      temp["dependentdataelementnames"].push(objHolder);

                      if (childIndex !== -1 && parentIndex !== -1) {
                        userTemplate.trackedentityattributes[childIndex][
                          "parentQuestion"
                        ] = parentIndex;
                        userTemplate.trackedentityattributes[childIndex][
                          "dependentValue"
                        ] = temp.matchingvalue;
                      }
                    }
                  });
                }
              }
            });

            if (hasValidRule && temp.dependentdataelementnames.length > 0) {
              attributedependentquestions.push(temp);
            }
          }
        }
      });

      // STEP 2: Process checkboxes
      const checkboxPromises = [];

      userTemplate.programstages.forEach((stage) => {
        stage.dataelements.forEach((element) => {
          if (element.type == "boolean") {
            const promise = API.get(
              "dataElementGroups?filter=identifiable:token:" +
              element.dhisname +
              "&paging=false&fields=id,name,dataElements[id,displayName~rename(code),formName~rename(name)]"
            ).then((res) => {
              if (res.data.dataElementGroups.length > 0) {
                let currentGroup = _.findWhere(res.data.dataElementGroups, { name: element.dhisname });

                if (currentGroup) {
                  element.attributeRefType = "checkbox";
                  element.type = "checkbox";
                  element.groupid = currentGroup.id;
                  element.checkboxoption = _.map(
                    currentGroup.dataElements,
                    function (elemgrp) {
                      return elemgrp.name;
                    }
                  );

                  let checkboxvalues = [];

                  // ✅ NEW: Mark all checkbox option dataElements as hidden
                  currentGroup.dataElements.forEach((el) => {
                    stage.dataelements.forEach((ell) => {
                      if (ell.dataElementId == el.id) {
                        // Mark this as a checkbox option (not a standalone question)
                        ell.isCheckboxOption = true;
                        ell.parentCheckboxId = element.dataElementId;
                        checkboxvalues.push(ell);
                      }
                    });
                  });

                  console.log("Processed checkbox:", element.dhisname);
                  element.options = checkboxvalues;
                }
              }
            }).catch(err => {
              console.error("Error fetching checkbox for " + element.dhisname, err);
            });

            checkboxPromises.push(promise);
          }
        });
      });

      // STEP 3: Wait for all checkboxes to load
      console.log("Waiting for " + checkboxPromises.length + " checkbox groups...");
      await Promise.all(checkboxPromises);
      console.log("All checkboxes loaded");

      // STEP 4: Assign to userTemplate and dispatch
      userTemplate["attributedependentquestions"] = attributedependentquestions;
      userTemplate["stageDependentArray"] = stageDependentArray;

      console.log("Final data:", {
        stages: userTemplate.programstages?.length,
        stageDependencies: stageDependentArray.length,
        attributeDependencies: attributedependentquestions.length
      });

      dispatch(setUserTemplate(userTemplate));
      dispatch(setActiveTab("step1"));

      console.log("getDependency completed");
    } catch (error) {
      console.error("Error in getDependency:", error);
      // Still dispatch even on error
      userTemplate["attributedependentquestions"] = attributedependentquestions;
      userTemplate["stageDependentArray"] = stageDependentArray;
      dispatch(setUserTemplate(userTemplate));
      dispatch(setActiveTab("step1"));
    }
  };

  const validateSortOrders = () => {
    const sortOrderMap = new Map();
    const duplicates = [];
    const duplicateIndices = new Set();
    const invalidEntries = [];

    menuTableData.forEach((item, index) => {
      const sortOrder = String(item.sortOrder || '').trim();

      // Check Home and Logout have correct fixed values
      if (item.menuItem === "Home") {
        return;
      }

      if (item.menuItem === "Logout") {
        return;
      }

      // Check for empty sort order
      if (sortOrder === '') {
        invalidEntries.push({
          menuItem: item.menuItem,
          issue: 'Sort order cannot be empty',
          currentValue: 'empty'
        });
        return;
      }

      const sortOrderNum = parseInt(sortOrder);

      // Check for invalid range (less than 2 or greater than 998)
      if (sortOrderNum < 2) {
        invalidEntries.push({
          menuItem: item.menuItem,
          issue: 'Sort order must be at least 2',
          currentValue: sortOrder
        });
        return;
      }

      if (sortOrderNum > 998) {
        invalidEntries.push({
          menuItem: item.menuItem,
          issue: 'Sort order must not exceed 998',
          currentValue: sortOrder
        });
        return;
      }

      // Check for duplicates
      if (sortOrderMap.has(sortOrder)) {
        const firstOccurrence = sortOrderMap.get(sortOrder);
        duplicates.push({
          sortOrder: sortOrder,
          items: [firstOccurrence.menuItem, item.menuItem]
        });
        duplicateIndices.add(firstOccurrence.index);
        duplicateIndices.add(index);
      } else {
        sortOrderMap.set(sortOrder, { menuItem: item.menuItem, index: index });
      }
    });

    return {
      duplicates,
      duplicateIndices: Array.from(duplicateIndices),
      invalidEntries
    };
  };

  return (
    <>
      <div className="row">
        <div className="col-12 bnBtn">
          <button
            tabIndex="-1"
            type="button"
            className="btn wizard-btnb ml-3"
            onClick={handleBackNavigation}
          >
            Back
          </button>
          <div>
            <button
              onClick={() => { publishCall() }}
              tabIndex="-1"
              //disabled={userDetails.username == "cdicadmin@imonitorplus.com" ? true : false}
              type="button"
              className="btn wizard-btnn mr-4"
            >
              {storeState.user.isEdit ? "Update" : "Publish"}
            </button>
          </div>
        </div>
      </div>

      <div className="form-wizard">
        <Card>
          <Card.Body className="odkDiv">
            <Tab.Container
              activeKey={internalActiveTab}
              onSelect={(k) => setInternalActiveTab(k)}
              id="role-management-tabs"
            >
              <div className="d-flex justify-content-between align-items-center mb-3">
                <Nav variant='tabs' className='nav nav-pills mb-0' style={{
                  borderBottom: '2px solid #e9ecef',
                  backgroundColor: '#f8f9fa',
                  borderRadius: '5px 5px 0 0'
                }}>
                  <Nav.Item className={`nav-item ${internalActiveTab === 'menus' ? 'active' : ''}`} style={{
                    border: internalActiveTab === 'menus' ? '2px solid #001965' : '2px solid transparent',
                    borderBottom: internalActiveTab === 'menus' ? '2px solid #fff' : '2px solid #001965',
                    backgroundColor: internalActiveTab === 'menus' ? '#fff' : 'transparent',
                    borderRadius: '5px 5px 0 0'
                  }}>
                    <Nav.Link
                      eventKey='menus'
                      style={{
                        color: internalActiveTab === 'menus' ? '#001965' : '#6c757d',
                        fontWeight: internalActiveTab === 'menus' ? 'bold' : 'normal',
                        border: 'none',
                        backgroundColor: 'transparent'
                      }}
                    >
                      Menu Items
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item className={`nav-item ${internalActiveTab === 'stages' ? 'active' : ''}`} style={{
                    border: internalActiveTab === 'stages' ? '2px solid #001965' : '2px solid transparent',
                    borderBottom: internalActiveTab === 'stages' ? '2px solid #fff' : '2px solid #001965',
                    backgroundColor: internalActiveTab === 'stages' ? '#fff' : 'transparent',
                    borderRadius: '5px 5px 0 0',
                    marginRight: '2px'
                  }}>
                    <Nav.Link
                      eventKey='stages'
                      style={{
                        color: internalActiveTab === 'stages' ? '#001965' : '#6c757d',
                        fontWeight: internalActiveTab === 'stages' ? 'bold' : 'normal',
                        border: 'none',
                        backgroundColor: 'transparent'
                      }}
                    >
                      Program Stages
                    </Nav.Link>
                  </Nav.Item>

                </Nav>
                <Button disabled={!storeState.user.isEdit} className="btn btn-primary" onClick={() => setAddNewModal(true)}>
                  Add Role
                </Button>
              </div>

              <Tab.Content>
                <Tab.Pane eventKey="stages">
                  <div className="mt-3">
                    {tableDataState.length > 0 && (
                      <div className="table-scroll-container">
                        <BootstrapTable key={tableKey} keyField="stage" data={tableDataState} columns={columns} />
                      </div>
                    )}
                  </div>
                </Tab.Pane>

                <Tab.Pane eventKey="menus">
                  <div className="mt-3">
                    {menuTableData.length > 0 && (
                      <div className="table-scroll-container">
                        <BootstrapTable keyField="menuItem" data={menuTableData} columns={menuColumns} />
                      </div>
                    )}
                    {menuTableData.length === 0 && (
                      <div className="text-center text-muted p-4">
                        <p>No menu items found. Please ensure roleBasedArray contains menu configuration.</p>
                      </div>
                    )}
                  </div>
                </Tab.Pane>
              </Tab.Content>
            </Tab.Container>
          </Card.Body>
        </Card>
      </div>

      <div className="row pt-1 mb-4">
        <div className="col-12 bnBtn">
          <button
            tabIndex="-1"
            type="button"
            className="btn wizard-btnb ml-3"
            onClick={handleBackNavigation}
          >
            Back
          </button>
          <button
            onClick={() => { publishCall() }}
            tabIndex="-1"
            //disabled={userDetails.username == "cdicadmin@imonitorplus.com" ? true : false}
            type="button"
            className="btn wizard-btnn mr-4"
          >
            {storeState.user.isEdit ? "Update" : "Publish"}
          </button>
        </div>
      </div>

      <Modal show={addNewModal} onHide={() => {
        setAddNewModal(false);
        setNewRole('');
        // setSelectedAccess([]);
        setRoleNameError('');
      }}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Role</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>
              Role Name <span style={{ color: 'red' }}>*</span>
            </Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter role name"
              value={newRole}
              onChange={(e) => {
                setNewRole(e.target.value);
                if (roleNameError) {
                  setRoleNameError('');
                }
              }}
              isInvalid={!!roleNameError}
              maxLength={100}
            />
            <Form.Control.Feedback type="invalid">
              {roleNameError}
            </Form.Control.Feedback>
          </Form.Group>
          {/* <Form.Group className="mt-3">
            <Form.Label>Select Menu Items (Optional)</Form.Label>
            <Form.Text className="text-muted d-block mb-2">
              Choose which menu items this role should have access to by default. You can modify these later.
            </Form.Text>
            <Select
              options={accessOptions}
              isMulti
              placeholder="Select menu items..."
              value={accessOptions.filter(option => selectedAccess.includes(option.value))}
              onChange={(selected) => {
                const values = selected ? selected.map(opt => opt.value) : [];
                setSelectedAccess(values);
              }}
              styles={{
                menu: (provided) => ({
                  ...provided,
                  zIndex: 9999,
                }),
              }}
            />
          </Form.Group> */}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => {
              setAddNewModal(false);
              setNewRole('');
              // setSelectedAccess([]);
              setRoleNameError('');
            }}
            disabled={isAddingRole}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleAddRole}
            disabled={isAddingRole}
          >
            {isAddingRole ? 'Adding...' : 'Add'}
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal data-backdrop="static" size="lg" data-keyboard="false" show={showModal} onHide={handleClose}>
        <Modal.Header className="p-2" closeButton>
          <Modal.Title>Registry & Admin Module URL</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label><strong>Registry/WebApp Link:</strong></Form.Label>
            <InputGroup>
              <Form.Control
                type="text"
                readOnly
                value={registryUrl}
                onClick={e => e.target.select()}
              />
              <Button variant="outline-secondary" onClick={handleOpen}>
                Open
              </Button>
            </InputGroup>
          </Form.Group>
          <hr />
          <Form.Group className="mb-3">
            <Form.Label><strong>Admin Module Link:</strong></Form.Label>
            <InputGroup>
              <Form.Control
                type="text"
                readOnly
                value={adminModuleUrl}
                onClick={e => e.target.select()}
              />
              <Button variant="outline-secondary" onClick={handleAdminModuleOpen}>
                Open
              </Button>
            </InputGroup>
          </Form.Group>
          <hr />
          {/* <div style={{ overflowX: 'auto', width: '100%' }}>
            <Form.Label><strong>Demo Users:</strong></Form.Label>
            <div style={{ overflowX: 'auto', width: '100%' }}>
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 px-4 py-2 text-left">Username</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Password</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Role</th>
                  </tr>
                </thead>
                <tbody>
                  {userArray.map((user, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="border border-gray-300 px-4 py-2 text-left">{user.username}</td>
                      <td className="border border-gray-300 px-4 py-2 text-left">{user.password}</td>
                      <td className="border border-gray-300 px-4 py-2 text-left">healthworker</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div> */}
        </Modal.Body>
        <Modal.Footer className="p-2">
          <Button className="btn wizard-btnn btn-sm mr-4" variant="primary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default RoleManagement;
