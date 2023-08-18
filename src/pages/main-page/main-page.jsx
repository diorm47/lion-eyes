import L from "leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";
import React, { useEffect, useState } from "react";
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
import card from "../../assets/qLj2yc.jpg";
import "./main-page.css";

function SetViewOnClick({ coords }) {
  const map = useMap();
  map.flyTo(coords, 17);
  return null;
}

function MainPage() {
  const [positionsList, setPositionList] = useState([]);
  const [centerPositions, setCenterPositions] = useState([
    40.99681833333333, 71.64040666666666,
  ]);
  const [zoomCustom, setZoom] = useState(13);
  const [locationInfo, setLocationInfo] = useState();
  const [camera, setCamera] = useState([]);

  const [cameras, setCameras] = useState([]);
  const token = sessionStorage.getItem("token");

  const headersList = {
    Accept: "*/*",
    Authorization: `Token ${token}`,
  };
  const getJsonLocation = (location) => {
    const coordinates = location.slice(1, -1).split(", ").map(Number);
    // console.log(location);
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
    console.log(centerPositions);
    console.log(getJsonLocation(item.location));
    if (centerPositions === getJsonLocation(item.location)) {
      setLocationInfo(item);
    } else {
      setTimeout(() => {
        setLocationInfo(item);
      }, 2000);
    }
  };

  const showInfoModal = (position) => {
    setLocationInfo(position);
    setCenterPositions(position.position);
    setZoom(15);
  };

  return (
    <div className="page_wrapper main_page">
      <div className="locations_list">
        {positionsList &&
          positionsList.map((item) => (
            <div
              className="big_wrapper locations_list_item"
              key={item.camera_name}
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
                      {item.camera_name}
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
                {locationInfo && locationInfo.camera_name ? (
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
                  center={
                    centerPositions && centerPositions.location
                      ? getJsonLocation(centerPositions.location)
                      : [40.99681833333333, 71.64040666666666]
                  }
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
                        key={position.camera_name}
                        position={getJsonLocation(position.location)}
                        icon={
                          new L.Icon({
                            iconUrl:
                              centerPositions ===
                              getJsonLocation(position.location)
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
                        <Tooltip>{position.camera_name}</Tooltip>
                      </Marker>
                    ))}

                  <SetViewOnClick
                    coords={
                      centerPositions && centerPositions.location
                        ? getJsonLocation(centerPositions.location)
                        : [40.99681833333333, 71.64040666666666]
                    }
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
      <div className="detected_data_list">
        <div className="big_wrapper profile_right_user_card">
          <div className="wrapper">
            <div className="label-container__top">
              <label htmlFor="" className="label-inner">
                detected
              </label>
            </div>
            <div className="cyber_block">
              <div className="cyber_block_inner">
                <div className="person-detected">
                  <img src={card} alt="detected_image" />
                  <div className="person-datas">
                    <h2>Benedict Camberbutch</h2>
                    <p>
                      <b>ID:</b> 308921890123158
                    </p>
                    <p>
                      <b>Yil:</b> 05.07.1970
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
        </div>
      </div>
    </div>
  );
}

export default MainPage;
