import { Link, useHistory } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { setResetStore } from '../redux/actions/userAction'

const Sibebar = (props) => {
  const history = useHistory();
  const dispatch = useDispatch()
  const logoutClickHandler = () => {
    dispatch(setResetStore())
    sessionStorage.clear();
    localStorage.removeItem('persist:root')
    history.push("/");
  };
  return (
    <nav id="sidebar" className={props.open ? "active" : ""}>
      <ul className="list-unstyled components" style={{
        "display": "flex",
        "flex-direction": "column",
        "justify-content": "space-between"
      }}>
        <div>
          <li>
            <Link className="navLink" to="/dashboard">
              <i className="far fa-file-alt"></i>  My Application
            </Link>
          </li>
          <li>
            <Link className="navLink" to="/MyProfile">
              <i className="fas fa-user"></i>  My Profile
            </Link>
          </li>
          {/* <li>
            <Link className="navLink" to="/role-management">
              <i className="fas fa-users"></i>  Role Management
            </Link>
          </li> */}
          {/* <li>
          <Link className="navLink" to="/odk">
            <i className="fas fa-database"></i>
            ODK Import
            </Link>
        </li> */}
          {/* <li>
          <Link className="navLink" to="/IndexCaseUpload">
          <i className="fas fa-file-upload"></i>
            Index Case Upload
            </Link>
        </li> */}
          {/* <li>
          <Link className="navLink" to="/labeltranslation">
          <i className="fas fa-language"></i>
            Label Translation
            </Link>
        </li> */}
          {/* <li>
          <Link className="navLink" to="/QrCode">
            <i className="fas fa-qrcode"></i>
            Generate QR Code
            </Link>
        </li> */}
          {/* <li>
          <Link className="navLink" to="/usermanagement">
            <i className="fas fa-users-cog"></i>
            User Management
            </Link>
        </li>
        <li>
          <Link className="navLink" to="/FacilityMgmnt">
            <i className="fas fa-building"></i>
            Facility Management
            </Link>
        </li> */}
          {/* <li>
          <Link className="navLink" to="/AdminModule">
            <i className="fas fa-lock"></i>
            Admin Module
            </Link>
        </li> */}
          {/* <li>
          <Link className="navLink" to="/templateupload">
            <i className="fas fa-database"></i>
            Data Upload
            </Link>
        </li> */}
        </div>
        <div style={{ "margin": "20px 10px 20px 10px" }}>
          <li onClick={logoutClickHandler}>
            <i className="fas fa-sign-out-alt"></i> Logout
          </li>
        </div>
      </ul>
    </nav>
  );
};

export default Sibebar;
