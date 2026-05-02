import React, { useEffect, useMemo, useState } from "react";
import { Menu } from "antd";
import type { MenuProps } from "antd";
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    PieChartOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";

import type { StoreType, AppDispatch } from "../../store/store";
import { CategoryType, fetchCategoriesAsync, getCategoryHierarchy } from "../../store/categorySlice";

import AppButton from "../common/AppButton";
import useAlert from "../../Hooks/useAlert";
import { AppAlert } from "../common/AppAlert";
import { AppSpinner } from "../common/AppSpinner";


const NavBarDraft: React.FC = () => {
    const [collapsed, setCollapsed] = useState(false);

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

    const currentSubject = searchParams.get("subject");

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
        navigate(`/?subject=${encodeURIComponent(category.name)}`);
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

    const toggleCollapsed = () => {
        setCollapsed((prev) => !prev);
    };

    return (
        <div style={{ width: collapsed ? 80 : 256, minHeight: "100vh", background: "transparent" }}>

            <AppButton
                type="primary"
                onClick={toggleCollapsed}
                style={{ marginBottom: 16 }}
            >
                {collapsed
                    ? <MenuUnfoldOutlined />
                    : <MenuFoldOutlined />}
            </AppButton>

            <AppAlert
                isVisible={alert.isVisible}
                type={alert.type}
                message={alert.message}
            />

            {loading && <AppSpinner />}

            <Menu
                mode="inline"
                theme="dark"
                inlineCollapsed={collapsed}
                selectedKeys={
                    currentSubject
                        ? [categories.find(
                            c => c.name === currentSubject
                        )?.id?.toString() || ""]
                        : []
                }
                items={buildMenuItems(hierarchy)}
            />
        </div>
    );
};

export default NavBarDraft;