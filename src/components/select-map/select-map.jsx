import L from "leaflet";
import "leaflet/dist/leaflet.css";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import marker from "../../assets/marker.png";
import redMarker from "../../assets/red-marker.png";
import "./select-map.css";

import {
  MapContainer,
  Marker,
  TileLayer,
  Tooltip
} from "react-leaflet";

const center = [41.004, 71.6832];

function DisplayPosition({ map, setSelected, }) {
  const [position, setPosition] = useState(() => map.getCenter());

  const onClick = useCallback(() => {
    map.setView(center, 13);
  }, [map]);

  const onMove = useCallback(() => {
    setPosition(map.getCenter());
  }, [map]);

  useEffect(() => {
    setSelected(position);
  }, [position, setSelected]);

  useEffect(() => {
    map.on("move", onMove);

    return () => {
      map.off("move", onMove);
    };
  }, [map, onMove]);

  return (
    <div className="this_location">
      <p>
        lat: {position.lat.toFixed(4)}, lon: {position.lng.toFixed(4)}
      </p>
    </div>
  );
}

function SelectMap({ setFormVisible, setThisLocation, cameras, activeCamera }) {
  const [map, setMap] = useState(null);
  const [selected, setSelected] = useState([]);
  const [positionsList, setPositionList] = useState([]);

  useEffect(() => {
    setPositionList(cameras);
  }, [cameras]);
  useEffect(() => {
    setThisLocation(selected);
  }, [selected, setThisLocation]);
  const getJsonLocation = (location) => {
    const coordinates = location
      .slice(1, -1)
      .split(",")
      .map((num) => parseFloat(num.trim()));
    return coordinates;
  };

  const displayMap = useMemo(
    () => (
      <MapContainer
        center={center}
        zoom={13}
        scrollWheelZoom={true}
        ref={setMap}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {
          positionsList.map((position) => (
            <Marker
              key={position.cam_id}
              position={getJsonLocation(position.location)}
              icon={
                new L.Icon({
                  iconUrl:
                    activeCamera === position.location
                      ? redMarker
                      : marker,

                  iconSize: [40, 40],
                  iconAnchor: [20, 40],
                  popupAnchor: [0, -40],
                })
              }
            // eventHandlers={{
            //   click: () => {
            //     showInfoModal(position);
            //   },
            // }}
            >
              <Tooltip>{position.name}</Tooltip>
            </Marker>
          ))}


        <div className="center_marker">
          <img src={redMarker} alt="" />
        </div>

        <div className="add_camera_btn add_camera_btn_location">
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
      </MapContainer>
    ),
    [positionsList, activeCamera, setFormVisible]
  );

  return (
    <div>
      {map ? <DisplayPosition map={map} setSelected={setSelected} /> : null}
      {displayMap}
    </div>
  );
}

export default SelectMap;
