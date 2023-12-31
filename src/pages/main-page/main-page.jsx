import L from "leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import {
  MapContainer,
  Marker,
  TileLayer,
  Tooltip,
  useMap,
} from "react-leaflet";
import markerImg from "../../assets/Back to future.jpg";
import exitIcon from "../../assets/close-icon.png";
import marker from "../../assets/marker.png";
import redMarker from "../../assets/red-marker.png";

import "./main-page.css";

function SetViewOnClick({ coords, zoomCustom }) {
  const map = useMap();
  map.flyTo(coords, zoomCustom);

  return null;
}

function MainPage() {
  const [positionsList, setPositionList] = useState([]);
  const [centerPositions, setCenterPositions] = useState([
    40.99681833333333, 71.64040666666666,
  ]);
  const [zoomCustom, setZoom] = useState(12);
  const [locationInfo, setLocationInfo] = useState();
  const [detectedUser, setDetecteduser] = useState([]);
  const [detectedAdress, setDetectedAdress] = useState("");

  const token = sessionStorage.getItem("token");

  const headersList = {
    Accept: "*/*",
    Authorization: `${token}`,
  };
  const getJsonLocation = (location) => {
    const coordinates = location
      .slice(1, -1)
      .split(",")
      .map((num) => parseFloat(num.trim()));
    return coordinates;
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
        setPositionList(response.data);
        setCenterPositions(getJsonLocation(response.data[0].location));
      })
      .catch((error) => {
        console.error("Ошибка", error);
      });
  }, []);

  const changeCenterLocation = (item) => {
    setLocationInfo();
    setCenterPositions();
    setCenterPositions(getJsonLocation(item.location));
    setZoom(15);

    if (centerPositions === getJsonLocation(item.location)) {
      setLocationInfo(item);
    } else {
      setTimeout(() => {
        setLocationInfo(item);
      }, 1400);
    }
  };

  const showInfoModal = (position) => {
    setLocationInfo(position);
    setCenterPositions(getJsonLocation(position.location));
    setZoom(15);
  };

  const logDivRef = useRef(null);
  const getDetectedUsers = () => {
    const evtSource = new EventSource(
      `${localStorage.getItem("apiAdress")}/events`
    );
    evtSource.onmessage = function (event) {
      const data = JSON.parse(event.data);

      setDetectedAdress(data.address);

      if (data.type === "detected" && data.image !== detectedUser?.image)
        setDetecteduser(data);
    };
    return () => {
      evtSource.close();
    };
  };

  useEffect(() => {
    const reqOptions = {
      url: `${localStorage.getItem("apiAdress")}/start`,
      method: "POST",
      headers: headersList,
    };
    axios
      .request(reqOptions)
      .then((response) => {
        getDetectedUsers();
      })
      .catch((error) => {
        console.error("Ошибка", error);
      });
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setDetectedAdress("");
    }, 500);
  }, [detectedAdress]);
  useEffect(() => {
    if (detectedUser) {
      setTimeout(() => {
        setDetecteduser();
      }, 10000);
    }

  }, [detectedUser]);


  return (
    <div className="page_wrapper main_page">
      <div className="locations_list">
        {positionsList &&
          positionsList.map((item) => (
            <div
              className="big_wrapper locations_list_item"
              key={item.cam_id}
              onClick={() => changeCenterLocation(item)}
            >
              <div className="wrapper">
                <div className="label-container__top">
                  <label htmlFor="" className="label-inner">
                    Joylashuv
                  </label>
                </div>
                <div className="cyber_block">
                  <div className="cyber_block_inner">
                    <p
                      className={
                        locationInfo && locationInfo.location === item.location
                          ? "active_list_item"
                          : ""
                      }
                    >
                      {item.name}
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
          ))}
      </div>
      <div className="map_wrapper">
        <div className="big_wrapper">
          <div className="wrapper">
            <div className="label-container__top">
              <label htmlFor="" className="label-inner">
                {locationInfo && locationInfo.camera_name
                  ? locationInfo.camera_name
                  : "Xarita"}
              </label>
            </div>
            <div className="cyber_block">
              <div className="cyber_block_inner">
                {locationInfo && locationInfo.name ? (
                  <div className="location_info_wrapper">
                    <img src={markerImg} alt="" />
                    <div className="exit_btn" onClick={() => setLocationInfo()}>
                      <img src={exitIcon} alt="exit icon" />
                    </div>
                  </div>
                ) : (
                  ""
                )}
                <MapContainer
                  center={centerPositions}
                  zoom={zoomCustom}
                  scrollWheelZoom={true}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />

                  {positionsList &&
                    positionsList.map((position) => (
                      <Marker
                        key={position.cam_id}
                        position={getJsonLocation(position.location)}
                        icon={
                          new L.Icon({
                            iconUrl:
                              detectedAdress === position.address
                                ? redMarker
                                : marker,

                            iconSize: [40, 40],
                            iconAnchor: [20, 40],
                            popupAnchor: [0, -40],
                          })
                        }
                        eventHandlers={{
                          click: () => {
                            showInfoModal(position);
                          },
                        }}
                      >
                        <Tooltip>{position.name}</Tooltip>
                      </Marker>
                    ))}

                  <SetViewOnClick
                    coords={centerPositions}
                    zoomCustom={zoomCustom}
                  />
                </MapContainer>
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
      <div className="detected_data_list" ref={logDivRef}>
        {detectedUser && detectedUser.last_name ? <div className="big_wrapper profile_right_user_card">
          <div className="wrapper">
            <div className="label-container__top">
              <label htmlFor="" className="label-inner">
                detected
              </label>
            </div>
            <div className="cyber_block">
              <div className="cyber_block_inner">
                <div className="person-detected">
                  <div className="person_detected_image">
                    <img
                      src={detectedUser ? detectedUser.image : ""}
                      alt="detected_image"
                    />
                  </div>

                  <div className="person-datas">
                    <h2>{detectedUser.last_name} {detectedUser.first_name} {detectedUser.middle_name} </h2>
                    <p>
                      <b>Camera:</b> {detectedUser.name}
                    </p>
                    <p>
                      <b>Ma'lumot:</b> {detectedUser.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="label-container__bottom">
              <label htmlFor="" className="label-inner">
                {" "}
                - - -{" "}
              </label>
            </div>
          </div>
        </div> : ''}

      </div>
    </div>
  );
}

export default MainPage;
