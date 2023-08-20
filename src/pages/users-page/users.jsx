import React, { useEffect, useState } from "react";
import "./users.css";
import Snackbar from "../../components/snack-bar/snack-bar";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/sidebar/sidebar";

function Users({ mainURl }) {
  const [isFormVisible, setFormVisible] = useState(false);
  const [employeesList, setEmployeesList] = useState([]);
  const [serchingItem, setSerchingItem] = useState("");
  const [isSideBarVisible, setSidebarVisible] = useState(false);
  const [isUserUpdating, setUserUpdating] = useState(false);
  const [updatingUser, setUpdatingUser] = useState('');
  const [hidedSnack, setHidedSnack] = useState(true);
  const [snackBarText, setSnackBarText] = useState("");
  const [activeActions, setActiveActions] = useState();
  const [updatingUserID, setUpdatingUserID] = useState("");

  // Employer data

  const [employerName, setEmployerName] = useState("");
  const [employerAvatar, setEmployerAvatar] = useState(null);
  const [employerData, setEmployerData] = useState("");

  const [employerAvatarForSend, setEmployerAvatarForSend] = useState(null);

  const [employerLastName, setEmployerLastName] = useState("");
  const [employerMiddleName, setEmployerMiddleName] = useState("");
  const [activeItem, setActiveItem] = useState();

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
  const refreshUsersPage = () => {
    let reqOptions = {
      url: `${localStorage.getItem("apiAdress")}/users/`,
      method: "GET",
      headers: headersList,
    };

    axios
      .request(reqOptions)
      .then((response) => {
        setEmployeesList(response.data);
      })
      .catch((error) => {
        console.error("Ошибка", error);
      });
  };
  useEffect(() => {
    refreshUsersPage()
  }, []);

  const handleModalOverlay = () => {
    setFormVisible(false);
    setSidebarVisible(false);
    setUserUpdating(false);
  };
  const addEmployer = () => {
    const headersList = {
      Accept: "*/*",
      Authorization: `Token ${token}`,
    };
    const formData = new FormData();
    formData.append("first_name", employerName);
    formData.append("image", employerAvatarForSend || employerAvatar);
    formData.append("last_name", employerLastName);
    formData.append("middle_name", employerMiddleName);
    formData.append("description", employerData);


    const reqOptions = {
      url: `${localStorage.getItem("apiAdress")}/users/`,
      method: "POST",
      data: formData,
      headers: headersList,
    };

    const reqOptionsUpdate = {
      url: `${localStorage.getItem("apiAdress")}/users/${updatingUser}/`,
      method: "PUT",
      data: formData,
      headers: headersList,
    };
    if (
      employerName &&
      employerAvatarForSend &&
      employerLastName &&
      employerMiddleName
    ) {
      axios
        .request(isUserUpdating ? reqOptionsUpdate : reqOptions)
        .then((response) => {
          setHidedSnack(false);
          if (!updatingUserID) {
            setSnackBarText("Hodim qo'shildi");
          } else {
            setSnackBarText("Hodim ma'lumotlari yangilandi");
          }
          refreshUsersPage();
          setTimeout(() => {
            setHidedSnack(true);
          }, 3000);
          handleModalOverlay();
          setUpdatingUserID();
          setEmployerName();
          setEmployerAvatar();
          setEmployerAvatarForSend();
          setEmployerLastName();
          setEmployerMiddleName();
          setUserUpdating(false);
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
      if (!employerName) {
        setSnackBarText("Iltimos ismni kiriting");
      } else if (!employerLastName) {
        setSnackBarText("Iltimos familiyani kiriting");
      } else if (!employerMiddleName) {
        setSnackBarText("Iltimos ota ismini kiriting");
      } else if (!employerAvatarForSend) {
        setSnackBarText("Iltimos suratni kiriting");
      }
      setTimeout(() => {
        setHidedSnack(true);
      }, 3000);
    }
  };
  const saveImage = (e) => {
    const file = e.target.files[0];
    setEmployerAvatarForSend(e.target.files[0]);
    const reader = new FileReader();

    reader.onloadend = () => {
      setEmployerAvatar(reader.result);
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const deleteUser = (id) => {
    const reqOptions = {
      url: `${localStorage.getItem("apiAdress")}/users/${id}/`,
      method: "DELETE",
      headers: headersList,
    };

    axios
      .request(reqOptions)
      .then((response) => {
        if (!updatingUserID) {
          setHidedSnack(false);
          setSnackBarText("Hodim o'chirildi");
          refreshUsersPage();
          setTimeout(() => {
            setHidedSnack(true);
          }, 3000);
        }
      })
      .catch((error) => {
        setHidedSnack(false);
        setSnackBarText("Xatolik. Qaytadan urunib ko'ring");
        setTimeout(() => {
          setHidedSnack(true);
        }, 3000);
      });
  };

  const search = (employeesList) => {
    return employeesList
      .flat()
      .filter((employeesList) =>
        employeesList.last_name
          .toLowerCase()
          .startsWith(serchingItem.toLowerCase())
      );
  };
  const moveElementToEnd = () => {
    setActiveItem();
    const newArray = employeesList.filter(
      (item) => item.employee_id !== employeesList[0].employee_id
    );
    newArray.push(employeesList[0]);
    setEmployeesList(newArray);
  };

  const updateUsers = (employer) => {
    setUserUpdating(true)
    setUpdatingUser(employer.user_id)
    setEmployerData(employer.description)
    setEmployerName(employer.first_name);
    setEmployerAvatar(employer.image);
    setEmployerAvatarForSend(employer.image);
    setEmployerLastName(employer.last_name);
    setEmployerMiddleName(employer.middle_name);

  }

  return (
    <>
      <Snackbar hidedSnack={hidedSnack} snackBarText={snackBarText} />
      {isFormVisible || isSideBarVisible || isUserUpdating ? (
        <div className="dark_bg_overlay" onClick={handleModalOverlay}></div>
      ) : (
        ""
      )}
      <Sidebar
        setSidebarVisible={setSidebarVisible}
        isSideBarVisible={isSideBarVisible}
      />
      <div className="users_page">
        <div className="add_ser_btn mt_40px">
          <div className="search_input">
            <div className="big_wrapper">
              <div className="wrapper">
                <div className="label-container__top">
                  <label htmlFor="" className="label-inner">
                    Qidirish
                  </label>
                </div>
                <div className="cyber_block">
                  <div className="cyber_block_inner">
                    <input
                      type="text"
                      onChange={(e) => setSerchingItem(e.target.value)}
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
          <div
            className="btn btn--primary login_btn"
            onClick={() => setFormVisible(true)}
          >
            <div className="btn__container">Qo'shish</div>
            <div className="btn__bottom"></div>
            <div className="btn__noise"></div>
          </div>
        </div>
        <div className="users_list">
          <div className="users_col">
            {employeesList &&
              search(employeesList)
                .slice(0, 10)
                .map((employer, index, self) => (
                  <div
                    className={
                      activeItem === employer.user_id
                        ? "users_list_item z_index_1111"
                        : "users_list_item"
                    }
                    key={employer.user_id}
                    onMouseEnter={() => setActiveActions(employer.user_id)}
                    onMouseLeave={() => setActiveActions("")}
                    onWheel={() => moveElementToEnd()}
                  >
                    <div
                      className={
                        activeActions === employer.user_id
                          ? "camera_item_actions user_actions"
                          : "camera_item_actions user_actions camera_item_actions_hided"
                      }
                    >
                      <button onClick={() => updateUsers(employer)}>
                        tahrirlash
                      </button>
                      <button onClick={() => deleteUser(employer.user_id)}>
                        o'chirish
                      </button>
                    </div>
                    <div
                      className="big_wrapper"
                    // onMouseEnter={() => setMarginNone(index)}
                    // onMouseLeave={() => setMarginNone()}
                    >
                      <div
                        className="wrapper"
                        onClick={() => setActiveItem(employer.user_id)}
                      >
                        <div className="label-container__top">
                          <label htmlFor="" className="label-inner">
                            {employer.last_name} {employer.first_name[0]}.
                          </label>
                        </div>
                        <div className="cyber_block">
                          <div className="cyber_block_inner employer_card">
                            <div className="employer_left_img">
                              <img src={employer.image} alt="" />
                            </div>
                            <div className="right_employer_desc">

                              <div>
                                <p>Ism:</p>
                                <p>{employer.first_name}</p>
                              </div>
                              <div>
                                <p>Familiya:</p>
                                <p>{employer.last_name}</p>
                              </div>
                              <div>
                                <p>Otasini ismi:</p>
                                <p>{employer.middle_name}</p>
                              </div>
                              <div>
                                <p>Ma'lumot:</p>
                                <p>{employer.description}</p>
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
                ))}
          </div>
        </div>
      </div>
      {isFormVisible || isUserUpdating ? (
        <div className="add_user_from">
          <div className="form_users">

            <div className="big_wrapper">
              <div className="wrapper">
                <div className="label-container__top">
                  <label htmlFor="" className="label-inner">
                    Ism
                  </label>
                </div>
                <div className="cyber_block">
                  <div className="cyber_block_inner">
                    <input
                      type="text"
                      className="editor-field__input"
                      value={employerName}
                      onChange={(e) => setEmployerName(e.target.value)}
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
            <div className="big_wrapper">
              <div className="wrapper">
                <div className="label-container__top">
                  <label htmlFor="" className="label-inner">
                    Familiya
                  </label>
                </div>
                <div className="cyber_block">
                  <div className="cyber_block_inner">
                    <input
                      type="text"
                      className="editor-field__input"
                      value={employerLastName}
                      onChange={(e) => setEmployerLastName(e.target.value)}
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
            <div className="big_wrapper">
              <div className="wrapper">
                <div className="label-container__top">
                  <label htmlFor="" className="label-inner">
                    Ota ismi
                  </label>
                </div>
                <div className="cyber_block">
                  <div className="cyber_block_inner">
                    <input
                      type="text"
                      className="editor-field__input"
                      value={employerMiddleName}
                      onChange={(e) => setEmployerMiddleName(e.target.value)}
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
            <div className="big_wrapper employer_textarea">
              <div className="wrapper">
                <div className="label-container__top">
                  <label htmlFor="" className="label-inner">
                    Ma'lumot
                  </label>
                </div>
                <div className="cyber_block">
                  <div className="cyber_block_inner">
                    <textarea className="editor-field__input" value={employerData}
                      onChange={(e) => setEmployerData(e.target.value)}></textarea>

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
            <div className="file_ipload_input">
              <div className="big_wrapper">
                <div className="wrapper">
                  <div className="label-container__top">
                    <label htmlFor="" className="label-inner">
                      Surati
                    </label>
                  </div>
                  <div className="cyber_block image_upload_block">
                    <div className="cyber_block_inner employer_img">
                      {employerAvatar && (
                        <img src={employerAvatar} alt="user avatar" />
                      )}
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
              <div className="right_employer_input">
                <label htmlFor="employer_avatar">
                  <div className="add_ser_btn save_employer mb_20px">
                    <div className="btn btn--primary ">
                      <div className="btn__container">Yuklash</div>
                      <div className="btn__bottom"></div>
                      <div className="btn__noise"></div>
                    </div>
                  </div>
                </label>

                <input
                  type="file"
                  accept="image/*"
                  id="employer_avatar"
                  className="editor-field__input"
                  placeholder="Surat tanlang"
                  onChange={saveImage}
                />

                <div className="add_ser_btn save_employer">
                  <div className="btn btn--primary " onClick={addEmployer}>
                    <div className="btn__container">Saqlash</div>
                    <div className="btn__bottom"></div>
                    <div className="btn__noise"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : ""}

    </>
  );
}

export default Users;
