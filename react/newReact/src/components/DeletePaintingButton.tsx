import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { DeleteOutlined } from "@ant-design/icons";
import { deleteAsync } from "../store/paintingSlice";
import { AppDispatch, StoreType } from "../store/store";
import { PaintingType } from "../store/paintingSlice";
import "./DeletePaintingButton.css";

const DeletePaintingButton: React.FC<{ painting: PaintingType }> = ({ painting }) => {
  const dispatch = useDispatch<AppDispatch>();
  const token = useSelector((store: StoreType) => store.user.token);
  const userId = useSelector((store: StoreType) => store.user.user.id);

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this painting?")) {
      dispatch(deleteAsync({ token:token||'', painting, userId }));
    }
  };

  return (
    <button
      onClick={handleDelete}
      className="delete-painting-button"
      title="Delete painting"
    >
      <DeleteOutlined style={{ fontSize: 15 }} />
      <span>Delete</span>
    </button>
  );
};

export default DeletePaintingButton;