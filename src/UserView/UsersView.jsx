import React, { useState, useEffect, useRef, useContext } from "react";
import { ProfileContext } from "../components/ProfileImageUploader/ProfileContext.jsx";
import Container from "../components/Container/Container.jsx";
import "./UsersView.css";
import axios from "axios";
import { IoIosAdd, IoIosMore } from "react-icons/io";
import DefaultImage from "../assets/user-profile.png";
import RegisterUserPopUp from "../components/PopUps/RegisterUserPopUp/RegisterUserPopUp.jsx";
import EditUserPopUp from "../components/PopUps/EditUserPopUp/EditUserPopUp.jsx";
import DeletePopUp from "../components/PopUps/DeletePopUp/DeletePopUp.jsx";
import SearchBar from "../components/SearchBar/SearchBar.jsx";
import ProfileImageUploader from "../components/ProfileImageUploader/ProfileImageUploader.jsx";
import { MdOutlineEdit } from "react-icons/md";

function ViewUsers({ refreshTrigger }) {
  const { imageProfile, updateProfileImage } = useContext(ProfileContext);
  const [users, setUsers] = useState([]);
  const [isPopUpOpen, setPopUpOpen] = useState(false);
  const [sortBy, setSortBy] = useState("code");
  const [isAscending, setIsAscending] = useState(true);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [userLoggedIn, setUserLoggedIn] = useState(null);
  const fileInputRef = useRef(null);

  const [username, setUsername] = useState("");

  const [popView, setPopView] = useState("");
  const [userID, setUserID] = useState("");

  const [openMenuId, setOpenMenuId] = useState(null);

  const actionMenuRef = useRef(null);

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
    }

    const storedImage = localStorage.getItem("profileImage");
    if (storedImage) {
      updateProfileImage(storedImage);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
    fetchUserLoggedIn();
  }, [refreshTrigger]);

  useEffect(() => {
    const handler = (e) => {
      if (actionMenuRef.current && !actionMenuRef.current.contains(e.target)) {
        setOpenMenuId(null);
      }
    };

    document.addEventListener("mousedown", handler);
    return () => {
      document.removeEventListener("mousedown", handler);
    };
  }, []);

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

  const fetchUserLoggedIn = async () => {
    try {
      const code = localStorage.getItem("code");
      const response = await axios.get(
        `http://localhost:5000/api/users/listone/${code}`
      );

      if (response.data && response.data.content) {
        setUserLoggedIn(response.data.content);
      }
    } catch (error) {
      console.error("Erro ao buscar o usuário:", error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/users/listall"
      );
      if (Array.isArray(response.data.content)) {
        setUsers(response.data.content);
      } else {
        setUsers([]);
      }
    } catch (error) {
      console.error("Erro ao buscar os usuários:", error);
      setUsers([]);
    }
  };

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

  const toggleMenu = (id) => {
    setOpenMenuId(openMenuId === id ? null : id);
  };

  const updateUser = async (id, updatedData) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/users/atualizar/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedData),
        }
      );
      if (!response.ok) {
        throw new Error("Falha ao atualizar o usuário");
      }
      fetchUsers();
    } catch (error) {
      console.error("Erro ao atualizar o usuário:", error);
    }
  };

  const deleteUser = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/users/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Falha ao deletar o usuário");
      }
      fetchUsers();
    } catch (error) {
      console.error("Erro ao deletar o usuário:", error);
    }
  };

  const updateProfileImageInUsers = (newImage) => {
    setUsers((prevUsers) => {
      return prevUsers.map((user) => {
        if (user._id === userLoggedIn?._id) {
          return { ...user, image: newImage };
        }
        return user;
      });
    });
    updateProfileImage(newImage);
  };

  return (
    <Container>
      <div className="container-grid">
        {userLoggedIn && userLoggedIn.role === "Admin" && (
          <div className="user-list-grid">
            <div className="userview-header">
              <h1>Visualização de Funcionários</h1>
            </div>
            <div className="user-list-grid-header">
              <div className="new-user">
                <button
                  className="header-btn"
                  onClick={() => handlePopUp("", 0)}
                >
                  Cadastrar Funcionário
                  <span>
                    <IoIosAdd />
                  </span>
                </button>
              </div>
              <SearchBar input={"Pesquisar um funcionário..."} />
            </div>
            <div className="user-list-grid-body">
              <table>
                <thead>
                  <tr>
                    <th>Code</th>
                    <th></th>
                    <th className="text-left">Nome</th>
                    <th className="text-left">Email</th>
                    <th className="text-left">Função</th>
                    <th>Ação</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedUsers.map((user) => (
                    <tr key={user._id}>
                      <td>{user.code || ""}</td>
                      <td>
                        <img
                          className="icon-list-user"
                          src={user.image || DefaultImage}
                          alt=""
                        />
                      </td>
                      <td className="text-left">{user.name}</td>
                      <td className="text-left">{user.email}</td>
                      <td className="text-left">
                        {user.role || "Funcionário"}
                      </td>
                      <td>
                        <div className="action-menu" ref={actionMenuRef}>
                          <button
                            className="action-btn"
                            onClick={() => toggleMenu(user._id)}
                          >
                            <IoIosMore />
                          </button>
                          {openMenuId === user._id && (
                            <div className="action-dropdown">
                              <button onClick={() => handlePopUp(user._id, 1)}>
                                Editar
                              </button>
                              <button onClick={() => handlePopUp(user._id, 2)}>
                                Deletar
                              </button>
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
        )}

        <div className="user-perfil-grid">
          <h3>PERFIL DE USUÁRIO</h3>
          <div className="user-photo-perfil">
            <div className="profile-avatar">
              <ProfileImageUploader
                imageProfile={imageProfile}
                setImageProfile={updateProfileImageInUsers}
                fileInputRef={fileInputRef}
                modalIsOpen={modalIsOpen}
                handleOpenModal={handleOpenModal}
                handleCloseModal={handleCloseModal}
              />
              <div className="overlay-profile">
                <span
                  className="texto"
                  onClick={() => fileInputRef.current.click()}
                >
                  Alterar foto de perfil
                </span>
              </div>
            </div>
          </div>
          <div className="user-info-perfil">
            {userLoggedIn ? (
              <ul>
                <label>
                  Nome
                  <li>
                    <div>{userLoggedIn.name}</div>
                    <div className="icon">
                      <MdOutlineEdit />
                    </div>
                  </li>
                </label>
                <label>
                  E-mail
                  <li>
                    <div>{userLoggedIn.email}</div>
                    <div className="icon">
                      <MdOutlineEdit />
                    </div>
                  </li>
                </label>
                <label>
                  Senha
                  <li>
                    <div>**************</div>
                    <div className="icon">
                      <MdOutlineEdit />
                    </div>
                  </li>
                </label>
              </ul>
            ) : (
              <div>Nenhum dado de usuário disponível</div>
            )}
          </div>
        </div>

        {popView === 0 && (
          <RegisterUserPopUp
            isOpen={isPopUpOpen}
            onClose={closePopUp}
            onUserAdded={refreshTable}
          />
        )}

        {popView === 1 && (
          <EditUserPopUp
            isOpen={isPopUpOpen}
            onClose={closePopUp}
            updateUser={updateUser}
            users={users}
            userID={userID}
          />
        )}
        {popView === 2 && (
          <DeletePopUp
            isOpen={isPopUpOpen}
            onClose={closePopUp}
            deleteObject={deleteUser}
            itemID={userID}
          />
        )}
      </div>
    </Container>
  );
}

export default ViewUsers;
