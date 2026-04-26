import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { DeleteOutlined } from "@ant-design/icons";
import { deleteAsync } from "../../store/paintingSlice";
import { AppDispatch, StoreType } from "../../store/store";
import { PaintingType } from "../../store/paintingSlice";
import { App } from "antd";
import AppButton from "../common/AppButton";
// import "./DeletePaintingButton.css";

const DeletePaintingButton: React.FC<{ painting: PaintingType }> = ({ painting }) => {
  const dispatch = useDispatch<AppDispatch>();
  
  const userId = useSelector((store: StoreType) => store.user.user.id);

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this painting?")) {
      dispatch(deleteAsync({ painting, userId }));
    }
  };

  return (
    <AppButton
      onClick={handleDelete}
      type="dashed"
      icon={<DeleteOutlined />}
    >
      
      Delete
    </AppButton>
  );
};

export default DeletePaintingButton;