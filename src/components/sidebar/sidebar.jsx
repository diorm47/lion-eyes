import React from "react";
import { NavLink } from "react-router-dom";
import "./sidebar.css";

function Sidebar({ isSideBarVisible, setSidebarVisible }) {
  return (
    <div
      className={
        isSideBarVisible ? "sidebar_content" : "sidebar_content hided_sidebar"
      }
    >
      <div className="editor-field editor-field__textbox sidebar_wrapper">
        <div className="editor-field__label-container">
          <label
            onClick={() => setSidebarVisible(!isSideBarVisible)}
            className="editor-field__label sidebar_opener"
          >
            menu
          </label>
        </div>

        <div className="editor-field__container">
          <div
            className="sidebar_content_items"
            onClick={() => setSidebarVisible(!isSideBarVisible)}
          >
            <NavLink to="/main">
              <div className="sidebar_content_link">
                <p>Bosh sahifa</p>
              </div>
            </NavLink>
            <NavLink to="/camera">
              <div className="sidebar_content_link">
                <p>Camera</p>
              </div>
            </NavLink>
            <NavLink to="/users">
              <div className="sidebar_content_link">
                <p>Hodimlar</p>
              </div>
            </NavLink>

            <NavLink to="/statistic">
              <div className="sidebar_content_link">
                <p>Statistika</p>
              </div>
            </NavLink>
          </div>
        </div>
        <span className="editor-field__bottom"></span>
        <div className="editor-field__noise"></div>
      </div>
    </div>
  );
}

export default Sidebar;
