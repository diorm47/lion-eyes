import axios from "axios";
import React, { useEffect, useState } from "react";
import Sidebar from "../../components/sidebar/sidebar";
import Snackbar from "../../components/snack-bar/snack-bar";
import { useNavigate } from "react-router-dom";
import "./camera-page.css";
import SelectMap from "../../components/select-map/select-map";

function CameraPage({ mainURl }) {
  const [isFormVisible, setFormVisible] = useState(false);
  const [activeCamera, setActiveCamera] = useState(false);
  const [updatingCamera, setUpdatingCamera] = useState(false);
  const [updatingCameraData, setUpdatingCameraData] = useState();
  const [cameraID, setCameraID] = useState();
  const [cameraIP, setCameraIP] = useState();
  const [cameras, setCameras] = useState([]);

  const [isSideBarVisible, setSidebarVisible] = useState(false);
  const [activeActions, setActiveActions] = useState();
  const [hidedSnack, setHidedSnack] = useState(true);
  const [snackBarText, setSnackBarText] = useState("");
  const token = sessionStorage.getItem("token");

  const navigate = useNavigate();
  // useEffect(() => {
  //   if (!token) {
  //     navigate("/login");
  //   }
  // }, [navigate, token]);

  const headersList = {
    Accept: "*/*",
    "Content-Type": "application/json",
    Authorization: `Token ${token}`,
  };

  useEffect(() => {
    const reqOptions = {
      url: `${localStorage.getItem("apiAdress")}/camera/`,
      method: "GET",
      headers: headersList,
    };

    axios
      .request(reqOptions)
      .then((response) => {
        setCameras(response.data);
        setActiveCamera(response.data[0]);
      })
      .catch((error) => {
        console.error("Ошибка", error);
      });
  }, []);
  const refreshCameraPage = () => {
    let reqOptions = {
      url: `${mainURl}ip/list/`,
      method: "GET",
      headers: headersList,
    };

    axios
      .request(reqOptions)
      .then((response) => {
        setCameras(response.data);
        setActiveCamera(response.data[0] || null);
      })
      .catch((error) => {
        console.error("Ошибка", error);
      });
  };

  const handleModalOverlay = () => {
    setFormVisible(false);
    setSidebarVisible(false);
    setUpdatingCamera(false);
  };
  const saveCamera = () => {
    let bodyContent = JSON.stringify({
      name: cameraID,
      address: cameraIP,
    });

    let reqOptions = {
      url: `${mainURl}ip/create/`,
      method: "POST",
      headers: headersList,
      data: bodyContent,
    };
    if (cameraID && cameraIP) {
      axios
        .request(reqOptions)
        .then((response) => {
          setHidedSnack(false);
          setSnackBarText("Camera qo'shildi");
          refreshCameraPage();
          setTimeout(() => {
            setHidedSnack(true);
          }, 3000);
          setFormVisible(false);
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
      if (!cameraID && !cameraIP) {
        setSnackBarText("Iltimos ma'lumotlarni kiriting");
      } else if (!cameraID) {
        setSnackBarText("Iltimos ID raqamni kiriting");
      } else if (!cameraIP) {
        setSnackBarText("Iltimos IP manzilni kiriting");
      }

      setTimeout(() => {
        setHidedSnack(true);
      }, 3000);
    }
  };
  const deleteCamera = (name) => {
    let reqOptions = {
      url: `${mainURl}ip/${name}/delete`,
      method: "DELETE",
      headers: headersList,
    };

    axios
      .request(reqOptions)
      .then((response) => {
        setHidedSnack(false);
        setSnackBarText("Camera o'chirildi");
        refreshCameraPage();
        setTimeout(() => {
          setHidedSnack(true);
        }, 3000);
      })
      .catch((error) => {
        console.error("Ошибка", error);
      });
  };
  const updateCamera = () => {
    let bodyContent = JSON.stringify({
      name: cameraID,
      address: cameraIP,
    });
    let reqOptions = {
      url: `${mainURl}ip/${updatingCameraData}/update/`,
      method: "PUT",
      headers: headersList,
      data: bodyContent,
    };

    axios
      .request(reqOptions)
      .then((response) => {
        setHidedSnack(false);
        setSnackBarText("Camera tahrirlandi");
        refreshCameraPage();
        setTimeout(() => {
          setHidedSnack(true);
        }, 3000);
      })
      .catch((error) => {
        console.error("Ошибка", error);
      });
    setUpdatingCamera(false);
  };
  const updateCameraClick = (camera) => {
    setUpdatingCamera(true);
    setCameraID(camera.name);
    setUpdatingCameraData(camera.name);
    setCameraIP(camera.address);
  };

  return (
    <>
      <Snackbar hidedSnack={hidedSnack} snackBarText={snackBarText} />
      {isFormVisible || isSideBarVisible || updatingCamera ? (
        <div className="dark_bg_overlay" onClick={handleModalOverlay}></div>
      ) : (
        ""
      )}
      <Sidebar
        setSidebarVisible={setSidebarVisible}
        isSideBarVisible={isSideBarVisible}
      />
      <div className="camera_page">
        <div className="camera_wrapper">
          <div className="camera_list_wrapper">
            <div className="camera_list">
              {cameras
                ? cameras.map((camera) => (
                    <div
                      key={camera.camera_name}
                      className="camera_list_item"
                      onClick={() => setActiveCamera(camera)}
                    >
                      <div
                        className="big_wrapper"
                        onMouseEnter={() =>
                          setActiveActions(camera.camera_name)
                        }
                        onMouseLeave={() => setActiveActions(0)}
                      >
                        <div className="wrapper">
                          <div className="label-container__top">
                            <label htmlFor="" className="label-inner">
                              {camera.camera_name}
                            </label>
                          </div>
                          <div className="cyber_block">
                            <div className="cyber_block_inner">
                              {camera.location}
                            </div>
                          </div>

                          <div className="label-container__bottom">
                            <label htmlFor="" className="label-inner">
                              {" "}
                              - - -{" "}
                            </label>
                          </div>
                          <div
                            className={
                              activeActions === camera.camera_name
                                ? "camera_item_actions"
                                : "camera_item_actions camera_item_actions_hided"
                            }
                          >
                            <button onClick={() => updateCameraClick(camera)}>
                              tahrirlash
                            </button>
                            <button
                              onClick={() => deleteCamera(camera.camera_name)}
                            >
                              o'chirish
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                : ""}
            </div>
            <div className="add_camera_btn">
              <div className="add_ser_btn df_aie_jce">
                <div
                  className="btn btn--primary login_btn"
                  onClick={() => setFormVisible(true)}
                >
                  <div className="btn__container">Qo'shish</div>
                  <div className="btn__bottom"></div>
                  <div className="btn__noise"></div>
                </div>
              </div>
            </div>
          </div>

          <div className="camera_item_view">
            <div className="big_wrapper">
              <div className="wrapper">
                <div className="label-container__top">
                  <label htmlFor="" className="label-inner">
                    ID: {activeCamera.camera_name}
                  </label>
                </div>
                <div className="cyber_block">
                  <div className="cyber_block_inner">
                    {/* <img
                        src={
                          mainURl + "/ip/stream/?camera=" + activeCamera.address
                        }
                        alt={activeCamera.address}
                      /> */}
                    <SelectMap />
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
        </div>
      </div>

      {!isFormVisible || (
        <div className="add_user_from">
          <div className="form_users">
            <div className="big_wrapper ">
              <div className="wrapper">
                <div className="label-container__top">
                  <label htmlFor="" className="label-inner">
                    Camera nomi
                  </label>
                </div>
                <div className="cyber_block">
                  <div className="cyber_block_inner">
                    <input
                      type="text"
                      value={cameraID}
                      onChange={(e) => setCameraID(e.target.value)}
                      className="editor-field__input"
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
            <div className="big_wrapper ">
              <div className="wrapper">
                <div className="label-container__top">
                  <label htmlFor="" className="label-inner">
                    IP manzil
                  </label>
                </div>
                <div className="cyber_block">
                  <div className="cyber_block_inner">
                    <input
                      type="text"
                      className="editor-field__input"
                      value={cameraIP}
                      onChange={(e) => setCameraIP(e.target.value)}
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
            <div className="big_wrapper ">
              <div className="wrapper">
                <div className="label-container__top">
                  <label htmlFor="" className="label-inner">
                    Joylashuvi
                  </label>
                </div>
                <div className="cyber_block">
                  <div className="cyber_block_inner"></div>
                </div>

                <div className="label-container__bottom">
                  <label htmlFor="" className="label-inner">
                    {" "}
                    - - -{" "}
                  </label>
                </div>
              </div>
            </div>
            <div className="add_camera_btn">
              <div className="add_ser_btn df_aie_jce">
                <div
                  className="btn btn--primary login_btn"
                  onClick={saveCamera}
                >
                  <div className="btn__container">Saqlash</div>
                  <div className="btn__bottom"></div>
                  <div className="btn__noise"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {!updatingCamera || (
        <div className="add_user_from">
          <div className="form_users">
            <div className="big_wrapper ">
              <div className="wrapper">
                <div className="label-container__top">
                  <label htmlFor="" className="label-inner">
                    Camera Id
                  </label>
                </div>
                <div className="cyber_block">
                  <div className="cyber_block_inner">
                    <input
                      type="text"
                      value={cameraID}
                      onChange={(e) => setCameraID(e.target.value)}
                      className="editor-field__input"
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
            <div className="big_wrapper ">
              <div className="wrapper">
                <div className="label-container__top">
                  <label htmlFor="" className="label-inner">
                    IP manzil
                  </label>
                </div>
                <div className="cyber_block">
                  <div className="cyber_block_inner">
                    <input
                      type="text"
                      className="editor-field__input"
                      value={cameraIP}
                      onChange={(e) => setCameraIP(e.target.value)}
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
            <div className="add_camera_btn">
              <div className="add_ser_btn">
                <div
                  className="btn btn--primary login_btn"
                  onClick={updateCamera}
                >
                  <div className="btn__container">Saqlash</div>
                  <div className="btn__bottom"></div>
                  <div className="btn__noise"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default CameraPage;
