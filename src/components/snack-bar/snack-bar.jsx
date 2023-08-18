import React from "react";
import "./snack-bar.css";

function Snackbar({ hidedSnack, snackBarText }) {
  return (
    <div
      className={
        hidedSnack ? "snackbar_wrapper hided_snack" : "snackbar_wrapper"
      }
    >
      <div className="big_wrapper">
        <div className="wrapper">
          <div className="cyber_block">
            <div className="cyber_block_inner">
              <p>{snackBarText} !</p>
            </div>
          </div>

          <div className="label-container__bottom">
            <label htmlFor="" className="label-inner">
              {" "}
              - - -{" "}
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Snackbar;
