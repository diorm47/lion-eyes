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

  const [cameraID, setCameraID] = useState();
  const [cameraIP, setCameraIP] = useState();
  const [cameras, setCameras] = useState([]);
  const [thisLocation, setThisLocation] = useState([]);

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
  const getJsonLocation = (location) => {
    const coordinates = location
      .slice(1, -1)
      .split(",")
      .map((num) => parseFloat(num.trim()));
    return coordinates;
  };

  const headersList = {
    Accept: "*/*",
    "Content-Type": "application/json",
    Authorization: `Token ${token}`,
  };

  const refreshCameraPage = () => {
    const reqOptions = {
      url: `${localStorage.getItem("apiAdress")}/camera/`,
      method: "GET",
      headers: headersList,
    };

    axios
      .request(reqOptions)
      .then((response) => {
        setCameras(response.data);
        setActiveCamera(getJsonLocation(response.data[0].location));
      })
      .catch((error) => {
        console.error("Ошибка", error);
      });
  };

  useEffect(() => {
    refreshCameraPage();
  }, []);

  const handleModalOverlay = () => {
    setFormVisible(false);
    setSidebarVisible(false);
    setUpdatingCamera(false);
  };
  const saveCamera = () => {
    const headersList = {
      Accept: "*/*",
      Authorization: `Token ${token}`,
    };
    const formdata = new FormData();
    formdata.append("camera_name", cameraID);
    formdata.append("camera_url", cameraIP);
    formdata.append(
      "location",
      `[${thisLocation.lat.toFixed(4)},${thisLocation.lng.toFixed(4)}]`
    );

    const reqOptions = {
      url: `${localStorage.getItem("apiAdress")}/camera/`,
      method: "POST",
      headers: headersList,
      data: formdata,
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
      if (!cameraID && !cameraIP && !thisLocation) {
        setSnackBarText("Iltimos ma'lumotlarni kiriting");
      } else if (!cameraID) {
        setSnackBarText("Iltimos ID raqamni kiriting");
      } else if (!cameraIP) {
        setSnackBarText("Iltimos IP manzilni kiriting");
      } else if (!thisLocation) {
        setSnackBarText("Iltimos Joylashuvni kiriting");
      }
      setTimeout(() => {
        setHidedSnack(true);
      }, 3000);
    }
  };
  const deleteCamera = (name) => {
    const reqOptions = {
      url: `${localStorage.getItem("apiAdress")}/camera/${name}`,
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
                            Joylashuv
                          </label>
                        </div>
                        <div className="cyber_block">
                          <div className="cyber_block_inner">
                            {camera.camera_name}
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
                          <button >tahrirlash</button>
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
          </div>

          <div className="camera_item_view">
            <div className="big_wrapper">
              <div className="wrapper">
                <div className="label-container__top">
                  <label htmlFor="" className="label-inner">
                    Xarita
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
                    <SelectMap
                      setFormVisible={setFormVisible}
                      setThisLocation={setThisLocation}
                      cameras={cameras}
                      activeCamera={activeCamera}
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
          </div>
        </div>
      </div>

      {isFormVisible || updatingCamera ? (
        <div className="add_user_from add_camera_from">
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
                  <div className="cyber_block_inner coordinates_block">
                    <p>
                      {" "}
                      {thisLocation.lat.toFixed(4)},{" "}
                      {thisLocation.lng.toFixed(4)}
                    </p>
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
      ) : ""}
    </>
  );
}

export default CameraPage;
