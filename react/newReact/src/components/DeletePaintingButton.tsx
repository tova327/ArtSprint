import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { DeleteOutlined } from "@ant-design/icons";
import { deleteAsync } from "../store/paintingSlice";
import { AppDispatch, StoreType } from "../store/store";
import { PaintingType } from "../store/paintingSlice";

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
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "4px 10px",
        borderRadius: 6,
        border: "1px solid #ffd6d6",
        background: "#fff5f5",
        color: "#d7263d",
        fontWeight: 600,
        fontSize: 13,
        cursor: "pointer",
        transition: "background 0.2s, color 0.2s",
      }}
      title="Delete painting"
    >
      <DeleteOutlined style={{ fontSize: 15 }} />
      <span>Delete</span>
    </button>
  );
};

export default DeletePaintingButton;