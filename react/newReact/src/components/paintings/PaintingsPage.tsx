"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Row, Col, Flex, Layout } from "antd";
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


import { getCategoryNameById } from "../../store/categorySlice";
import { spacing } from "../../theme/constant";
import AppButton from "../common/AppButton";
import AppInput from "../common/AppInput";
import AppTitle from "../common/AppTitle";
import useAlert from "../../Hooks/useAlert";
import { AppAlert } from "../common/AppAlert";
import SelectedPaintings from "./SelectedPaintings";
import { Content, Footer, Header } from "antd/es/layout/layout";


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

    const latest = [...paintings]
        .sort(
            (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
        )
        .slice(0, 8);
    const latestCategories = latest.map((p) =>
        getCategoryNameById(categories, p.category)
    );
    const popular = [...paintings]
        .sort((a, b) => b.likes - a.likes)
        .slice(0, 8);
    const popularCategories = popular.map((p) =>
        getCategoryNameById(categories, p.category)
    );
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
        <Flex vertical gap={spacing.lg} style={{ minHeight: "100%", width: "100%" }}>
            <AppAlert isVisible={alert.isVisible} type={alert.type} message={alert.message} />
            {loading && <AppSpinner />}

            <Flex justify="center">
                <AppTitle>
                    🎨 Art Gallery
                </AppTitle>
            </Flex>
            <Layout style={{ background: "transparent", gap: spacing.lg }}>
                <Header style={{ background: "transparent", padding: 0, height: "auto", lineHeight: "normal", marginBottom: 0 }}>
                    <SelectedPaintings paintings={latest} categories={latestCategories} title="✨ Fresh Creations ✨" tagContent="NEW" />
                </Header>
                <Content style={{ padding: spacing.lg, background: "rgba(255,255,255,0.72)", borderRadius: 16, border: "1px solid rgba(98, 120, 197, 0.2)" }}>
                    <Flex
                        justify="center"
                        align="center"
                        gap={spacing.sm}
                        wrap
                    >
                        <SearchOutlined />

                        <AppInput
                            placeholder="Search for masterpieces by name..."
                            value={searchQuery}
                            onChange={handleSearch}
                            allowClear
                        />

                        <AppButton onClick={handleMagicSearch}>
                            ✨ Magic Search
                        </AppButton>
                    </Flex>

                    <Flex justify="center" style={{ marginTop: spacing.sm, marginBottom: spacing.lg }}>
                        <AppButton onClick={showModal}>
                            <CloudUploadOutlined />
                            Upload New Masterpiece
                        </AppButton>
                    </Flex>

                    <PaintingUploadModal
                        visible={isModalVisible}
                        onCancel={handleCancel}
                        onUpload={handleUpload}
                        loading={paintingUploadLoading}
                        userId={userId}
                    />

                    {filteredPaintings.length > 0 ? (
                        <Row gutter={[spacing.md, spacing.md]}>
                            {filteredPaintings.map(
                                (painting: PaintingType) => (
                                    <Col
                                        xs={24}
                                        sm={12}
                                        md={12}
                                        lg={12}
                                        xl={6}
                                        key={painting.id}
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
                                )
                            )}
                        </Row>
                    ) : (
                        <AppEmpty
                            description="No masterpieces found! Try adjusting your search or explore other subjects."
                        />
                    )}
                </Content>
                <Footer style={{ background: "transparent", padding: 0, marginTop: 0 }}>
                    <SelectedPaintings paintings={popular} categories={popularCategories} title="✨ Popular Masterpieces ✨" tagContent="POPULAR" />
                </Footer>
            </Layout>
        </Flex>
    );
};

export default PaintingsPage;
