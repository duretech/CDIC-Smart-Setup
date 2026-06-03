
import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  HashRouter
} from "react-router-dom";
import { useSelector } from 'react-redux';
import ProtectedRoute from './component/ProtectedRoute';
import Home from './pages/Home';
import Register from './pages/Register';
import Activate from './pages/Activate';
import Dashboard2 from './pages/Dashboard2';
import Odk from './pages/Odk'
import UserManagement from './pages/UserManagement'
import XlUpload from './pages/xluploadcontainer/xlupload'
import LabelTranslation from './pages/LabelTranslation'
import FormIO from './pages/FormIO'
import QrCode from './pages/QrCode';
import IndexCaseUpload from './pages/IndexCaseUpload';
import FacilityMgmnt from './pages/FacilityMgmnt';
import AdminModule from './pages/adminmodule/AdminModule';

import MyProfile from './pages/MyProfile';

import LoadingOverlay from 'react-loading-overlay';
import styled, { css } from "styled-components";
import RingLoader from 'react-spinners/RingLoader'
import DataLog from './pages/datalog/DataLog'

import LandingPage from './pages/LandingPage';
import RoleManagement from './pages/smartsetuptracker/RoleManagement';
import toast, { Toaster } from 'react-hot-toast';

function App() {

  const storeState = useSelector((state) => state)
  const DarkBackground = styled.div`
  display: none; /* Hidden by default */
  position: fixed; /* Stay in place */
  z-index: 999; /* Sit on top */
  left: 0;
  top: 0;
  width: 100%; /* Full width */
  height: 100%; /* Full height */
  overflow: auto; /* Enable scroll if needed */
  background-color: rgb(0, 0, 0); /* Fallback color */
  background-color: rgba(0, 0, 0, 0.4); /* Black w/ opacity */

  ${props =>
      storeState.user.loader &&
      css`
      display: block; /* show */
      `}
  `;
  return (
    <Router basename="/smartsetupv2">
      <Toaster
          containerStyle={{ zIndex: 99999 }}
          position="bottom-right"
          reverseOrder={false}
        />
      <div className="App">
        <DarkBackground disappear={true}>
          <LoadingOverlay
            active={storeState.user.loader}
            spinner={<RingLoader color={'#44546a'} />}
          >
          </LoadingOverlay>
        </DarkBackground>
        <HashRouter>
          <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/register" component={Register} />
            <Route path="/activate" component={Activate} />
            {/* <ProtectedRoute exact path="/dashboard" component={Dashboard} /> */}
            <ProtectedRoute exact path="/dashboard" component={Dashboard2} />
            <ProtectedRoute exact path="/odk" component={Odk} />
            <ProtectedRoute exact path="/FormIO" component={FormIO} />
            <ProtectedRoute exact path="/usermanagement" component={UserManagement} />
            <ProtectedRoute exact path="/templateupload" component={XlUpload} />
            <ProtectedRoute exact path="/datalogs" component={DataLog} />
            <ProtectedRoute exact path="/labeltranslation" component={LabelTranslation} />
            <ProtectedRoute exact path="/QrCode" component={QrCode} />
            <ProtectedRoute exact path="/IndexCaseUpload" component={IndexCaseUpload} />
            <ProtectedRoute exact path="/FacilityMgmnt" component={FacilityMgmnt} />
            <ProtectedRoute exact path="/AdminModule" component={AdminModule} />
            <ProtectedRoute exact path="/MyProfile" component={MyProfile} />
            <ProtectedRoute exact path="/role-management" component={RoleManagement} />

            <Route path="/landingpage" component={LandingPage} />
            {/* <ProtectedRoute exact path="/layout" component={Layout} /> */}
          </Switch>
        </HashRouter>
      </div>
    </Router>

  );
}

export default App;
