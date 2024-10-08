import { useState, useEffect, useRef, useContext } from "react";
import { ProfileContext } from "../components/ProfileImageUploader/ProfileContext.jsx";
import Container from "../components/Container/Container.jsx";
import "./UsersView.css";
import axios from "axios";
import { IoIosAdd, IoIosMore } from "react-icons/io";
import { ImCross } from "react-icons/im";
import DefaultImage from "../assets/user-profile.png";
import RegisterUserPopUp from "../components/PopUps/RegisterUserPopUp/RegisterUserPopUp.jsx";
import EditUserPopUp from "../components/PopUps/EditUserPopUp/EditUserPopUp.jsx";
import DeletePopUp from "../components/PopUps/DeletePopUp/DeletePopUp.jsx";
import SearchBar from "../components/SearchBar/SearchBar.jsx";
import ProfileImageUploader from "../components/ProfileImageUploader/ProfileImageUploader.jsx";
import { MdOutlineEdit } from "react-icons/md";
import { TailSpin } from "react-loader-spinner";
import { LoadingContext } from "../Controller/LoadingContext.jsx";
import LazyImage from "../components/LazyImage/LazyImage.jsx";

function ViewUsers({ refreshTrigger }) {
  const { imageProfile, updateProfileImage } = useContext(ProfileContext);
  const [users, setUsers] = useState([]);
  const [isPopUpOpen, setPopUpOpen] = useState(false);
  const [sortBy, setSortBy] = useState("code");
  const [isAscending, setIsAscending] = useState(true);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [userLoggedIn, setUserLoggedIn] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isEditing, setIsEditing] = useState([
    { field: "name", editing: false },
    { field: "email", editing: false },
    { field: "password", editing: false },
  ]);
  const fileInputRef = useRef(null);
  const { loading, loadingIsFalse, loadingIsTrue } = useContext(LoadingContext);
  const [username, setUsername] = useState("");

  const [popView, setPopView] = useState("");
  const [userID, setUserID] = useState("");

  const sortedUsers = users
    .filter((user) => userLoggedIn && user._id !== userLoggedIn._id)
    .sort((a, b) => {
      const aValue = a[sortBy] || "";
      const bValue = b[sortBy] || "";

      if (isAscending) {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  const handleSearch = (value) => {
    setSearchTerm(value);
  };

  const filteredUsers = sortedUsers.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const [openMenuId, setOpenMenuId] = useState(null);

  const actionMenuRef = useRef(null);
  const nameRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  const handleEditClick = (field) => {
    setIsEditing((prev) =>
      prev.map((item) =>
        item.field === field ? { ...item, editing: true } : item
      )
    );
  };

  const handleCloseClick = (field) => {
    setIsEditing((prev) =>
      prev.map((item) =>
        item.field === field ? { ...item, editing: false } : item
      )
    );
  };

  const handleUpdate = async () => {
    const updatedData = {
      name: nameRef.current ? nameRef.current.value : null,
      newEmail: emailRef.current ? emailRef.current.value : null,
      password: passwordRef.current
        ? passwordRef.current.value
        : null,
    };

    await updateUser(userLoggedIn._id, updatedData);
    console.log("Atualizando dados do usuário:", updatedData);

    // Definindo todos os campos de isEditing para false
    setIsEditing((prev) => prev.map((item) => ({ ...item, editing: false })));
    
    localStorage.setItem("username", nameRef.current.value);
    await fetchUserLoggedIn();
  };

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
    loadingIsTrue();
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
    } finally {
      loadingIsFalse();
    }
  };

  const refreshTable = () => {
    fetchUsers();
  };


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
      const response = await axios.delete(
        `http://localhost:5000/api/users/deletar/${id}`,
        {
          withCredentials: true,
        }
      );
      if (!response) {
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

  if (loading) {
    return (
      <TailSpin
        visible={true}
        height="80"
        width="80"
        color="black"
        ariaLabel="tail-spin-loading"
        radius="1"
        wrapperStyle={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
        wrapperClass=""
      />
    );
  }

  return (
    <Container>
        <div className="container-grid">
        {userLoggedIn && userLoggedIn.role === "Admin" && (
          <div className="admin-content">
          <div className="table-header">
          <h1>Funcionarios</h1>
          <div className="header-end">
            <div className="table-header-btns">
              <button className="header-btn" onClick={() => handlePopUp("", 0)}>
                <p>Cadastrar Funcionário</p>
                <span>
                  <IoIosAdd />
                </span>
              </button>
            </div>
            <div className="table-search-bar">
            <SearchBar onSearch={handleSearch} input={"Pesquisar um Funcionário..."} />
            </div>
          </div>
        </div>
          <div className="user-list-grid">
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
                  {filteredUsers.map((user) => (
                    <tr key={user._id}>
                      <td>{user.code || ""}</td>
                      <td>
                        <LazyImage 
                          className="icon-list-user"
                          src={user.image || DefaultImage} 
                          alt={user.name} 
                          placeholder={DefaultImage}
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
                            <div
                              className="action-dropdown"
                              ref={actionMenuRef}
                            >
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
          </div>
        )}

        <div className="user-perfil-grid">
          <h3>Perfil de Usuário</h3>
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
              <div
                className="overlay-profile"
                onClick={() => fileInputRef.current.click()}
              >
                <span className="texto">Alterar foto de perfil</span>
              </div>
            </div>
          </div>
          <div className="user-info-perfil">
            {userLoggedIn ? (
              <ul>
                {isEditing.map((item) => (
                  <label key={item.field}>
                    {item.field.charAt(0).toUpperCase() + item.field.slice(1)}
                    <li>
                      {item.editing ? (
                        <input
                          type={item.field === "password" ? "password" : "text"}
                          defaultValue={
                            item.field === "password"
                              ? ""
                              : userLoggedIn[item.field]
                          }
                          ref={
                            item.field === "name"
                              ? nameRef
                              : item.field === "email"
                              ? emailRef
                              : passwordRef
                          }
                        />
                      ) : (
                        <div>
                          {item.field === "password"
                            ? "********"
                            : userLoggedIn[item.field]}
                        </div>
                      )}
                      {!item.editing ? (
                        <div
                          className="icon"
                          onClick={() => handleEditClick(item.field)}
                        >
                          <MdOutlineEdit />
                        </div>
                      ) : (
                        <div
                          className="icon-cross"
                          onClick={() => handleCloseClick(item.field)}
                        >
                          <ImCross />
                        </div>
                      )}
                    </li>
                  </label>
                ))}
                {isEditing.some((item) => item.editing) ? (
                  <button type="submit" onClick={handleUpdate}>
                    ATUALIZAR
                  </button>
                ) : (
                  <button>ATUALIZAR</button>
                )}
              </ul>
            ) : (
              <div>Nenhum dado de usuário disponível</div>
            )}
          </div>
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
        
    </Container>
    
  );
}

export default ViewUsers;
