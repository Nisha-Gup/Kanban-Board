import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown, faSliders } from "@fortawesome/free-solid-svg-icons";
import "./Navbar.css";

function Navbar({ handleGrouping, handleOrdering, grouping, ordering }) {
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  const handleGroupingChange = (selectedOption) => {
    // Call the provided function from App.js with the selected option
    handleGrouping(selectedOption);
  };

  const handleOrderingChange = (selectedOption) => {
    // Call the provided function from App.js with the selected option
    handleOrdering(selectedOption);
  };

  return (
    <div className="navbar">
      <div className="navbar-card">
        <div className="dropdown">
          <button className="dropdown-button" onClick={toggleDropdown}>
            <FontAwesomeIcon icon={faSliders} style={{ color: "gray" }} />
            &nbsp;&nbsp;Display&nbsp;&nbsp;
            <FontAwesomeIcon icon={faAngleDown} style={{ color: "gray" }} />
          </button>
          {isDropdownOpen && (
            <div id="myDropdown" className="dropdown-content">
              <div className="wrapper">
                <div className="option">
                  <div className="left">Grouping</div>
                  <div className="right">
                    <select
                      style={{ padding: "3px", width: "100px", boxShadow: "0px 2px 5px 0px rgba(0, 0, 0, 0.1)" }}
                      onChange={(e) => handleGroupingChange(e.target.value)}
                      value={grouping}
                    >
                      <option>Status</option>
                      <option>Priority</option>
                      <option>User</option>
                    </select>
                  </div>
                </div>
                <br />
                <div className="option">
                  <div className="left">Ordering</div>
                  <div className="right">
                    <select
                      style={{ padding: "3px", width: "100px", boxShadow: "0px 2px 5px 0px rgba(0, 0, 0, 0.1)" }}
                      onChange={(e) => handleOrderingChange(e.target.value)}
                      value={ordering}
                    >
                      <option>Priority</option>
                      <option>Title</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Navbar;
