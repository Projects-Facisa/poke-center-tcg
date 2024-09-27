import React, { useState, useEffect, useRef } from "react";
import Container from "../components/Container/Container.jsx";
import "./UsersView.css";
import axios from "axios";
import { IoIosAdd, IoIosMore, IoMdArrowDown, IoMdArrowUp} from "react-icons/io";
import DefaultImage from "../assets/user-profile.png";
import RegisterUserPopUp from "../components/PopUps/RegisterUserPopUp/RegisterUserPopUp.jsx"
import EditUserPopUp from "../components/PopUps/EditUserPopUp/EditUserPopUp.jsx"
import DeletePopUp from "../components/PopUps/DeletePopUp/DeletePopUp.jsx";
import SearchBar from "../components/SearchBar/SearchBar.jsx";
import ProfileImageUploader from "../components/ProfileImageUploader/ProfileImageUploader.jsx";

function ViewUsers(refreshTrigger) {
  const [users, setUsers] = useState([]);
  const [isPopUpOpen, setPopUpOpen] = useState(false);
  const [sortBy, setSortBy] = useState("code");
  const [isAscending, setIsAscending] = useState(true);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const fileInputRef = useRef(null);

  const [imageProfile, SetimageProfile] = useState("");
  const [username, setUsername] = useState("");

  const [popView, setPopView] = useState("");
  const [userID, setUserID] = useState("");

  const [openMenuId, setOpenMenuId] = useState(false);

  let actionMenuRef = useRef();

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  useEffect(() => {
    const storedImage = localStorage.getItem("profileImage");
    if (storedImage) {
      SetimageProfile(storedImage);
    }
  }, []);

  useEffect(() => {
    let handler = (e) => {
      if (!menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handler);
    return () => {
      document.removeEventListener("mousedown", handler);
    };
  });

  useEffect(() => {
    fetchUsers();

    let handler = (e) =>{
      if (!actionMenuRef.current.contains(e.target)){
        setOpenMenuId(false);
      }
    };

    document.addEventListener("mousedown", handler);
  }, [refreshTrigger]);
  
  useEffect(() => {
  }, [users]);

  const handlePopUp = (userID, pop) => {
    setPopView(pop);
    setUserID(userID);
    openPopUp();
  };

  const handleOpenModal = () => {
    setModalIsOpen(true);
  };

  const handleCloseModal = () => {
    setModalIsOpen(false);
  };

  const openPopUp = () => setPopUpOpen(true);
  const closePopUp = () => setPopUpOpen(false);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/users/listall');
      if (Array.isArray(response.data.content)) {
        setUsers(response.data.content);
      } else {
        setUsers([]);
      }
    } catch (error) {
      console.error("Erro ao buscar os clientes:", error);
      setUsers([]);
    }
  };

    useEffect(() => {
      fetchUsers();
  }, []);


  const refreshTable = () => {
      fetchUsers();
  };

  const sortedUsers = users.sort((a, b) => {
    const aValue = a[sortBy] || "";
    const bValue = b[sortBy] || "";

    if (isAscending) {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });
  
  const toggleMenu = (email) => {
    setOpenMenuId(openMenuId === email ? null : email);
  };


  const updateUser = async (id, updatedData) => {
    try {
      const response = await fetch(`http://localhost:5000/api/users/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });
      if (!response.ok) {
        throw new Error("Failed to update Client");
      }
      fetchUsers();
    } catch (error) {
      console.error("Error updating Client:", error);
    }
  };

  const deleteUser = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/users/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete client");
      }
      fetchUsers();
    } catch (error) {
      console.error("Error deleting client:", error);
    }
  };

  return (
    <Container>
      <div className="userview-header">
        <h1>Visualização de Funcionarios</h1>
      </div>
      <div className="container-grid">
        <div className="user-list-grid">
          <div className="user-list-grid-header">
            <div className="new-user">
              <button className="header-btn"
                onClick={openPopUp}>
                  Add Funcionario
                <span>
                  <IoIosAdd />
                </span>
              </button>
            </div>
            <SearchBar input={"pesquisar um funcionario..."}/>
          </div>
          <div className="user-list-grid-body">
            <table>
              <thead>
                <tr>
                  <th>
                    
                  </th>
                  <th>
                    <span >
                      code 
                    </span>
                  </th>
                  <th>
                    <span >
                      Nome 
                    </span>
                  </th>
                  <th>
                    <span>
                      Email
                    </span>
                  </th>
                  <th>
                    <span>
                      Funcao
                    </span>
                  </th>
                  <th>
                    <span>ação</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedUsers.map((user) => (
                  <tr>
                    <td><img className="icon-list-user" src={user.image ? user.image : DefaultImage} alt="" /></td>
                    <td>{user.code ? user.code : ""}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.role ? user.role : "Funcionario" }</td>
                    <td>
                    <div className="action-menu" ref={actionMenuRef} >
                      <button className="action-btn"  onClick={() => toggleMenu(user._id)}>
                        <IoIosMore />
                      </button>
                      {openMenuId === user._id && (
                        <div className="action-dropdown" ref={actionMenuRef}>
                          <button onClick={() => handlePopUp(user._id, 1)}> Edit </button>
                          <button onClick={() => handlePopUp(user._id, 2)}> Delete </button>
                        </div>
                      )}
                    </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="user-perfil-grid">
          <div className="user-photo-perfil">
            <h3>PERFIL DE USUARIO</h3>
            <div className="profile-avatar">
              <ProfileImageUploader
                imageProfile={imageProfile}
                SetimageProfile={SetimageProfile}
                fileInputRef={fileInputRef}
                modalIsOpen={modalIsOpen}
                handleOpenModal={handleOpenModal}
                handleCloseModal={handleCloseModal}
                />
            </div>
          </div>
          <div className="user-info-perfil">
                <ul>
                  <li><div>nome</div></li>
                  <li><div>email</div></li>
                  <li><div>password</div></li>
                </ul>
          </div>
        </div>
        <RegisterUserPopUp isOpen={isPopUpOpen && popView === ""} onClose={closePopUp} onClientAdded={refreshTable} />
      </div>
      {popView === 1 ? (
        <EditUserPopUp
          isOpen={isPopUpOpen}
          onClose={closePopUp}
          updateClient={updateUser}
          user={users}
          userID={userID}
        />
      ) : null}
      {popView === 2 ? (
        <DeletePopUp
          isOpen={isPopUpOpen}
          onClose={closePopUp}
          deleteObject={deleteUser}
          itemID={clientID}
        />
      ) : null}
    </Container>
  );
}

export default ViewUsers;