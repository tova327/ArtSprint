import React, { useEffect, useMemo } from "react";
import { Menu } from "antd";
import type { MenuProps } from "antd";
import {
    PieChartOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";

import type { StoreType, AppDispatch } from "../../store/store";
import { CategoryType, fetchCategoriesAsync, getCategoryHierarchy } from "../../store/categorySlice";

import useAlert from "../../Hooks/useAlert";
import { AppAlert } from "../common/AppAlert";
import { AppSpinner } from "../common/AppSpinner";


const NavBarDraft: React.FC = () => {
    

    const categories = useSelector(
        (store: StoreType) => store.categories.categories
    );

    const loading = useSelector(
        (store: StoreType) => store.categories.loading
    );

    const error = useSelector(
        (store: StoreType) => store.categories.error
    );

    const dispatch = useDispatch<AppDispatch>();

    const navigate = useNavigate();

    const [searchParams] = useSearchParams();

    const currentSubject = searchParams.get("catid") || "";

    const {
        alert,
        handleOpenAlert,
    } = useAlert({
        type: "success",
        message: "",
        isVisible: false,
    });

    useEffect(() => {
        if (categories.length === 0) {
            dispatch(fetchCategoriesAsync());
        }
    }, [dispatch, categories.length]);

    useEffect(() => {
        if (error) {
            handleOpenAlert(
                "error",
                "Failed to load categories: " + error
            );
        }
    }, [error, handleOpenAlert]);

    const hierarchy = useMemo(() => {
        return getCategoryHierarchy(categories);
    }, [categories]);

    const handleCategoryClick = (category: CategoryType) => {
        if (+category.id === +currentSubject) {
            navigate(`/`)
        } else {
            navigate(`/?catid=${encodeURIComponent(category.id)}`);
        }
    };

    const buildMenuItems = (
        categoriesTree: CategoryType[]
    ): MenuProps["items"] => {
        return categoriesTree.map((category) => ({
            key: category.id.toString(),
            icon: <PieChartOutlined />,
            label: category.name,
            onClick: () => handleCategoryClick(category),

            children:
                category.subCategories.length > 0
                    ? buildMenuItems(category.subCategories)
                    : undefined,
        }));
    };

    

    return (
        <div >

            
            <AppAlert
                isVisible={alert.isVisible}
                type={alert.type}
                message={alert.message}
            />

            {loading && <AppSpinner />}

            <Menu
                mode="inline"
                selectedKeys={
                    currentSubject
                        ? [categories.find(
                            c => c.id === +currentSubject
                        )?.id?.toString() || ""]
                        : []
                }
                items={buildMenuItems(hierarchy)}
            />
        </div>
    );
};

export default NavBarDraft;
