import React, { useState } from "react";

import "./login-page.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Snackbar from "../../components/snack-bar/snack-bar";

function LoginPage() {
  const [idNumber, setIdNumber] = useState();
  const [password, setPassword] = useState();
  const [hidedSnack, setHidedSnack] = useState(true);
  const [snackBarText, setSnackBarText] = useState("");
  const [apiAdressValue, setApiAdressValue] = useState("");
  const navigate = useNavigate();
  const [isFormVisible, setFormVisible] = useState(false);
  const loginClick = async () => {
    const headersList = {
      Accept: "*/*",
      // "Content-Type": "application/json",
    };

    // const bodyContent = JSON.stringify({
    //   username: idNumber,
    //   password: password,
    // });
    const bodyContent = new FormData();
    bodyContent.append("username", idNumber);
    bodyContent.append("password", password);

    const reqOptions = {
      url: `${localStorage.getItem("apiAdress")}/login/`,
      method: "POST",
      headers: headersList,
      data: bodyContent,
    };
    if (idNumber && password) {
      await axios
        .request(reqOptions)
        .then((response) => {
          if (response.data.token && !response.data.status) {
            sessionStorage.setItem("token", response.data.token);
            navigate("/main");
          }
        })
        .catch((error) => {
          setHidedSnack(false);
          setSnackBarText("Xatolik. Qaytadan urunib ko'ring");
          setTimeout(() => {
            setHidedSnack(true);
          }, 3000);
        });
    } else {
      setHidedSnack(false);
      if (!idNumber && !password) {
        setSnackBarText("Iltimos ma'lumotlarni kiriting");
      } else if (!password) {
        setSnackBarText("Iltimos parolni kiriting");
      } else if (!idNumber) {
        setSnackBarText("Iltimos ID raqamni kiriting");
      }

      setTimeout(() => {
        setHidedSnack(true);
      }, 3000);
    }
  };

  const handleModalOverlay = () => {
    setFormVisible(false);
  };
  const apiAdressBtn = () => {
    if (apiAdressValue) {
      localStorage.setItem("apiAdress", apiAdressValue);
      setFormVisible(false);
      setHidedSnack(false);
      setSnackBarText("IP manzil muvafaqqiyatli kiritildi!");
    } else {
      setHidedSnack(false);
      setSnackBarText("Iltimos ma'lumotlarni kiriting");
    }
    setTimeout(() => {
      setHidedSnack(true);
    }, 3000);
  };
  return (
    <>
      <div
        className="btn btn--primary login_btn setting_icon"
        onClick={() => setFormVisible(true)}
      >
        <div className="btn__container">Sozlamalar</div>
        <div className="btn__bottom"></div>
        <div className="btn__noise"></div>
      </div>
      <Snackbar hidedSnack={hidedSnack} snackBarText={snackBarText} />
      {isFormVisible ? (
        <>
          <div className="dark_bg_overlay" onClick={handleModalOverlay}></div>
          <div className="add_api_form">
            <div className="form_users">
              <div className="big_wrapper ">
                <div className="wrapper">
                  <div className="label-container__top">
                    <label htmlFor="" className="label-inner">
                      Server IP manzili
                    </label>
                  </div>
                  <div className="cyber_block">
                    <div className="cyber_block_inner">
                      <input
                        type="text"
                        className="editor-field__input"
                        // value={cameraIP}
                        onChange={(e) => setApiAdressValue(e.target.value)}
                      />
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
              <div className="add_camera_btn" onClick={apiAdressBtn}>
                <div className="add_ser_btn df_aie_jce">
                  <div className="btn btn--primary login_btn">
                    <div className="btn__container">Saqlash</div>
                    <div className="btn__bottom"></div>
                    <div className="btn__noise"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        ""
      )}

      <div className="login">
        <div className="container">
          <div className="editor-field editor-field__textbox">
            <div className="editor-field__label-container">
              <label className="editor-field__label">ID number</label>
            </div>

            <div className="editor-field__container">
              <input
                type="text"
                onChange={(e) => setIdNumber(e.target.value)}
                className="editor-field__input"
              />
            </div>
            <span className="editor-field__bottom"></span>
            <div className="editor-field__noise"></div>
          </div>
          <div className="editor-field editor-field__textbox">
            <div className="editor-field__label-container">
              <label className="editor-field__label">password</label>
            </div>

            <div className="editor-field__container">
              <input
                type="password"
                onChange={(e) => setPassword(e.target.value)}
                className="editor-field__input"
              />
            </div>
            <span className="editor-field__bottom"></span>
            <div className="editor-field__noise"></div>
          </div>

          <div className="btn btn--primary login_btn" onClick={loginClick}>
            <div className="btn__container">Login</div>
            <div className="btn__bottom"></div>
            <div className="btn__noise"></div>
          </div>
        </div>
      </div>
    </>
  );
}

export default LoginPage;
