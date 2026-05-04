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
import useAlert from "../../Hooks/useAlert";
import { AppAlert } from "../common/AppAlert";
import SelectedPaintings from "./SelectedPaintings";
import { Content, Footer, Header } from "antd/es/layout/layout";
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
    
    <AppAlert
      isVisible={alert.isVisible}
      type={alert.type}
      message={alert.message}
    />

    {loading && <AppSpinner />}

    

    <Layout style={{ background: "transparent", gap: spacing.md ,minHeight: "100vh", width: "100%" }}>

      {/* HEADER - רק עיצוב */}
     { latest.length > 0 &&  <Header style={{ padding: 0, width: "100%" }}>
      
          <SelectedPaintings
            paintings={latest}
            categories={latestCategories}
            title="✨ Fresh Creations ✨"
            tagContent="NEW"
          />
        
      </Header>}

      {/* CONTENT */}
      <Content
        style={{
          padding: spacing.md,
          backgroundColor: themeToken.token?.colorBgContainer,
          borderRadius: themeToken.token?.borderRadius,
          borderColor: themeToken.token?.colorBorder,
          flex: "1 1 auto",
          width: "100%",
        }}
      >
        <Flex justify="center" gap={spacing.sm} wrap vertical align="center">
        {/* SEARCH */}
        <Flex justify="center" gap={spacing.sm} wrap vertical={false} align="center">
          <SearchOutlined />

          <AppInput
            placeholder="Search for masterpieces by name..."
            value={searchQuery}
            onChange={handleSearch}
            allowClear
            style={{ maxWidth: 400 }}
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
          <Row gutter={[24, 24]} justify="space-around">
            {filteredPaintings.map((painting: PaintingType) => (
              <Col
                key={painting.id}
                xs={24}
                sm={12}
                md={8}
                lg={6}
                xl={6}
                span={3}
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

      {/* FOOTER - רק עיצוב */}
      {popular.length > 0 && (
        <Footer style={{ padding: 0, width: "100%" }}>
         
            <SelectedPaintings
              paintings={popular}
              categories={popularCategories}
              title="✨ Popular Masterpieces ✨"
            tagContent="POPULAR"
          />
       
      </Footer>)}

    </Layout>
  </Flex>
);
};

export default PaintingsPage;
