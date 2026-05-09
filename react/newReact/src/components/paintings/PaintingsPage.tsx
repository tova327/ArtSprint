"use client";

import type React from "react";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Row, Col, Flex, Tabs } from "antd";
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
    useEffect(() => {
        console.log("in useeffect paintings page" + latestCategories);

    }, [latestCategories]);
    const popular = useMemo(() => {
        return [...paintings]
            .sort((a, b) => b.likes - a.likes)
            .slice(0, 8);
    }, [paintings]);
    // const popularCategories = useMemo(() => {
    //     return popular.map((p) =>
    //         getCategoryNameById(categories, p.category)
    //     );
    // }, [popular, categories]);
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
            handleOpenAlert("error", "❌ Failed to upload painting " + (error instanceof Error ? error.message : "Unknown error"));

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

    const query = new URLSearchParams(location.search);
    const subjectFilter = query.get("catid");
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
   

    return (
  <Flex vertical gap={spacing.md} style={{ width: "100%" }}>

    <AppAlert {...alert} />
    {loading && <AppSpinner />}

    {/* HEADER */}
    <Tabs
      size="small"
      tabBarStyle={{ marginBottom: 8 }}
      items={[
        {
          key: "latest",
          label: "✨ Fresh",
          children: (
            <SelectedPaintings
              paintings={latest}
             
              title=""
              tagContent="NEW"
            />
          ),
        },
        {
          key: "popular",
          label: "🔥 Popular",
          children: (
            <SelectedPaintings
              paintings={popular}
            
              title=""
              tagContent="POPULAR"
            />
          ),
        },
      ]}
    />

    {/* SEARCH */}
    <Flex align="center" gap={8}>
      <AppInput
        suffix={<SearchOutlined />}
        placeholder="Search..."
        value={searchQuery}
        onChange={handleSearch}
        allowClear
        style={{ flex: 1 }}
      />
      <AppButton onClick={handleMagicSearch}>
        ✨ Magic
      </AppButton>
    </Flex>

    {/* UPLOAD */}
    <Flex justify="center">
      <AppButton onClick={showModal}>
        <CloudUploadOutlined />
        Upload
      </AppButton>
    </Flex>

    <PaintingUploadModal {...{
      visible: isModalVisible,
      onCancel: handleCancel,
      onUpload: handleUpload,
      loading: paintingUploadLoading,
      userId,
    }} />

    {/* GRID */}
    {filteredPaintings.length > 0 ? (
      <Row gutter={[12, 12]}>
        {filteredPaintings.map((painting: PaintingType) => (
          <Col
            key={painting.id}
            xs={24}
            sm={12}
            md={12}
            lg={6}
          >
            <ShowPainting
              painting={painting}
              category={getCategoryNameById(categories, painting.category)}
              userId={userId}
            />
          </Col>
        ))}
      </Row>
    ) : (
      <AppEmpty description="No results" />
    )}
  </Flex>
)
};

export default PaintingsPage;
