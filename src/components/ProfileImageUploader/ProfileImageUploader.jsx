import React, { useRef, useState } from "react";
import Modal from "react-modal";
import DefaultImage from "../../assets/user-profile.png";
import "react-image-crop/dist/ReactCrop.css";
import ReactCrop, {
  centerCrop,
  convertToPixelCrop,
  makeAspectCrop,
} from "react-image-crop";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../ProfileImageUploader/ProfileImageUploader.css";
import setCanvasPreview from "./SetCanvasPreview";
import axios from "axios";

Modal.setAppElement("#root");

const MIN_DIMENSION = 120;
const ASPECT_RATIO = 1;

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    maxWidth: "90vw",
    maxHeight: "90vh",
    overflowY: "auto",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
  },
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 1,
  },
};

const ProfileImageUploader = ({
  imageProfile,
  setImageProfile,
  fileInputRef,
  modalIsOpen,
  handleOpenModal,
  handleCloseModal,
  onProfileImageUpdate,
}) => {
  const imgRef = useRef(null);
  const previewCanvasRef = useRef(null);
  const [crop, setCrop] = useState(null);
  const [tempImage, setTempImage] = useState(null);
  const convertToBase64 = (e) => {
    const file = e.target.files[0];
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const img = new Image();
      img.src = reader.result;

      img.onload = () => {
        if (img.width < MIN_DIMENSION || img.height < MIN_DIMENSION) {
          toast.error(
            `A imagem tem uma resolução baixa (${img.width}x${img.height}). Tente carregar uma imagem maior.`
          );
          setTempImage("");
          e.target.value = "";
          return;
        }
        setTempImage(reader.result);
        handleOpenModal();
        fileInputRef.current.value = "";
      };
    };
    reader.onerror = (error) => {
      console.log("Error:", error);
    };
  };

  const onImageLoad = (e) => {
    const { naturalWidth, naturalHeight } = e.currentTarget;
    const crop = makeAspectCrop(
      {
        unit: "%",
        width: 50,
      },
      ASPECT_RATIO,
      naturalWidth,
      naturalHeight
    );
    const centeredCrop = centerCrop(crop, naturalWidth, naturalHeight);
    setCrop(centeredCrop);
  };

  const handleConfirmCrop = async () => {
    const base64Image = setCanvasPreview(
      imgRef.current,
      previewCanvasRef.current,
      convertToPixelCrop(crop, imgRef.current.width, imgRef.current.height)
    );

    setImageProfile(base64Image);

    try {
      await axios.post(
        "http://localhost:5000/api/users/updateProfileImage",
        { image: base64Image },
        { withCredentials: true }
      );
      localStorage.setItem("profileImage", base64Image);

      onProfileImageUpdate(base64Image);

      console.log("Imagem atualizada com sucesso");
    } catch (error) {
      console.error("Erro ao atualizar a imagem:", error);
    }

    handleCloseModal();
  };
  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={convertToBase64}
        style={{ display: "none" }}
      />
      <img src={imageProfile || DefaultImage} alt="Profile" />{" "}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={handleCloseModal}
        style={customStyles}
        onClick={(e) => e.stopPropagation()}
      >
        <ReactCrop
          crop={crop}
          circularCrop
          keepSelection
          onChange={(crop) => setCrop(crop)}
          aspect={ASPECT_RATIO}
        >
          <img
            ref={imgRef}
            src={tempImage || DefaultImage}
            alt="Profile"
            onLoad={onImageLoad}
          />
        </ReactCrop>

        <div className="modal-button-container">
          <button
            className="modal-button modal-button-confirm"
            onClick={handleConfirmCrop}
          >
            Confirmar
          </button>
          <button
            onClick={handleCloseModal}
            className="modal-button modal-button-close"
          >
            Fechar
          </button>
        </div>
        {crop && (
          <canvas
            ref={previewCanvasRef}
            className="mt-4"
            style={{ display: "none" }}
          />
        )}
      </Modal>
      <ToastContainer />
    </>
  );
};

export default ProfileImageUploader;
