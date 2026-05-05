"use client";

import type React from "react";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Row, Col, Flex, Layout, Tabs } from "antd";
import type { AppDispatch, StoreType } from "../../store/store";
import {
    fetchPaintingsAsync,
    type PaintingType,
    uploadPaintingAsync,
} from "../../store/paintingSlice";
import ShowPainting from "./ShowPainting";
import PaintingUploadModal from "./PaintingUploadModal";
import { useLocation } from "react-router-dom";
import {
    CloudUploadOutlined,
    SearchOutlined,
} from "@ant-design/icons";

import { AppSpinner } from "../common/AppSpinner";
import { AppEmpty } from "../common/AppEmpty";


import { fetchCategoriesAsync, getCategoryNameById } from "../../store/categorySlice";
import { spacing } from "../../theme/constant";
import AppButton from "../common/AppButton";
import AppInput from "../common/AppInput";
import useAlert from "../../Hooks/useAlert";
import { AppAlert } from "../common/AppAlert";
import SelectedPaintings from "./SelectedPaintings";
import { Content, Header } from "antd/es/layout/layout";
import { themeToken } from "../../theme/token";


const PaintingsPage: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();

    const paintings = useSelector(
        (store: StoreType) => store.painting.paintings
    );

    const userId = useSelector(
        (store: StoreType) => store.user.user.id
    );

    const loading = useSelector(
        (store: StoreType) => store.painting.loading
    );

    const error = useSelector(
        (store: StoreType) => store.painting.error
    );

    const categories = useSelector(
        (store: StoreType) => store.categories.categories
    );

    const [isModalVisible, setIsModalVisible] = useState(false);

    const [paintingUploadLoading, setPaintingUploadLoading] = useState(false);

    const [searchQuery, setSearchQuery] = useState("");

    const location = useLocation();

    const query = new URLSearchParams(location.search);

    const subjectFilter = query.get("subject");

    const { alert, handleOpenAlert } = useAlert({ type: 'success', message: '', isVisible: false })

    const latest = useMemo(() => {
        return [...paintings]
            .sort(
                (a, b) =>
                    new Date(b.createdAt).getTime() -
                    new Date(a.createdAt).getTime()
            )
            .slice(0, 8);
    }, [paintings]);
    const latestCategories = useMemo(() => {
        return latest.map((p) =>
            getCategoryNameById(categories, p.category)
        );
    }, [latest, categories]);
    const popular = useMemo(() => {
        return [...paintings]
            .sort((a, b) => b.likes - a.likes)
            .slice(0, 8);
    }, [paintings]);
    const popularCategories = useMemo(() => {
        return popular.map((p) =>
            getCategoryNameById(categories, p.category)
        );
    }, [popular, categories]);
    useEffect(() => {
        console.log("in paintingspage" + categories);
        if (categories.length === 0) {
            dispatch(fetchCategoriesAsync());
        }
    }, []);
    useEffect(() => {
        dispatch(fetchPaintingsAsync());
    }, [dispatch]);

    useEffect(() => {
        if (error) {
            handleOpenAlert("error", error)
        }
    }, [error]);

    const handleUpload = async (paintingData: any) => {
        setPaintingUploadLoading(true);

        try {
            const resultAction = await dispatch(
                uploadPaintingAsync({
                    painting: paintingData,
                })
            );

            if (uploadPaintingAsync.fulfilled.match(resultAction)) {
                handleOpenAlert("success", " Masterpiece uploaded successfully!");
                setIsModalVisible(false);
            } else {
                handleOpenAlert("error", "❌ Failed to upload painting");
            }
        } catch (error) {
            handleOpenAlert("error", "❌ Failed to upload painting");

        } finally {
            setPaintingUploadLoading(false);
        }
    };

    const showModal = () => setIsModalVisible(true);

    const handleCancel = () => setIsModalVisible(false);

    const handleSearch = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        setSearchQuery(e.target.value);
    };

    const handleMagicSearch = () => {
        if (paintings.length > 0) {
            const randomPainting =
                paintings[Math.floor(Math.random() * paintings.length)];

            const words = randomPainting.name.split(" ");

            const randomWord =
                words[Math.floor(Math.random() * words.length)];

            setSearchQuery(randomWord);

            handleOpenAlert("success", `✨ Magic search: "${randomWord}"`);
        }
    };

    const filteredPaintings = paintings?.filter(
        (p: PaintingType) => {
            const matchesSubject =
                !subjectFilter ||
                p.category ===
                categories.find((c) => c.name === subjectFilter)?.id;

            const matchesSearch =
                !searchQuery ||
                p.name
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase());

            return matchesSubject && matchesSearch;
        }
    );
    {/* <Layout style={layoutStyle}>
            <Header style={headerStyle}>Header</Header>
            <Content style={contentStyle}>Content</Content>
            <Footer style={footerStyle}>Footer</Footer>
            </Layout> */}

    return (
        <Flex vertical align="center" gap={spacing.lg} style={{ minHeight: "100vh", width: "100vw" }}>

            <AppAlert
                isVisible={alert.isVisible}
                type={alert.type}
                message={alert.message}
            />

            {loading && <AppSpinner />}



            <Layout style={{ background: "transparent", gap: spacing.md, minHeight: "100vh", width: "100%", flexDirection: "column" }}>

                {/* HEADER - רק עיצוב */}
                {latest.length > 0 && <Header style={{ padding: spacing.md, width: "100%", flex: "0 0 20%" }}>
                    <Tabs
                        defaultActiveKey="latest"

                        size="small"
                        items={[
                            {
                                key: "latest",
                                label: "✨ Fresh",
                                children: latest.length > 0 && (
                                    <SelectedPaintings
                                        paintings={latest}
                                        categories={latestCategories}
                                        title=""
                                        tagContent="NEW"
                                    />
                                ),
                            },
                            {
                                key: "popular",
                                label: "🔥 Popular",
                                children: popular.length > 0 ? (
                                    <SelectedPaintings
                                        paintings={popular}
                                        categories={popularCategories}
                                        title=""
                                        tagContent="POPULAR"
                                    />
                                ) : (
                                    <AppEmpty description="No popular masterpieces yet! Create and share your art to see it here." />
                                ),
                            },
                        ]}
                    />
                </Header>}

                {/* CONTENT */}
                <Content
                    style={{
                        padding: spacing.md,
                        backgroundColor: themeToken.token?.colorBgBase,
                        borderRadius: themeToken.token?.borderRadius,
                        borderColor: themeToken.token?.colorBorder,
                        flex: "1 1 auto",
                        overflowY: "auto",
                    }}
                >
                    <Flex justify="center" gap={spacing.sm} wrap vertical align="center" style={{ width: "100%", alignItems: "stretch" }}>
                        {/* SEARCH */}
                        <Flex vertical={false} style={{ width: "100%" }}>


                            <AppInput
                                suffix={<SearchOutlined />}
                                placeholder="Search for masterpieces by name..."
                                value={searchQuery}
                                onChange={handleSearch}
                                allowClear
                                style={{ maxWidth: "70%" }}
                            />

                            <AppButton onClick={handleMagicSearch}>
                                ✨ Magic Search
                            </AppButton>
                        </Flex>

                        {/* UPLOAD */}
                        <Flex
                            justify="center"
                            align="center"
                            style={{ marginTop: spacing.sm, marginBottom: spacing.lg }}
                        >
                            <AppButton onClick={showModal}>
                                <CloudUploadOutlined />
                                Upload New Masterpiece
                            </AppButton>
                        </Flex>

                        {/* MODAL - ללא שינוי */}
                        <PaintingUploadModal
                            visible={isModalVisible}
                            onCancel={handleCancel}
                            onUpload={handleUpload}
                            loading={paintingUploadLoading}
                            userId={userId}
                        />

                        {/* GRID */}
                        {filteredPaintings.length > 0 ? (
                            <Row gutter={[6, 6]} justify="start" align="stretch">
                                {filteredPaintings.map((painting: PaintingType) => (
                                    <Col
                                        key={painting.id}
                                        xs={24}
                                        md={12}
                                        lg={8}
                                    >
                                        <ShowPainting
                                            painting={painting}
                                            category={getCategoryNameById(
                                                categories,
                                                painting.category
                                            )}
                                            userId={userId}
                                        />
                                    </Col>
                                ))}
                            </Row>
                        ) : (
                            <AppEmpty
                                description="No masterpieces found! Try adjusting your search or explore other subjects."
                            />
                        )}
                    </Flex>
                </Content>




            </Layout>
        </Flex>
    );
};

export default PaintingsPage;
