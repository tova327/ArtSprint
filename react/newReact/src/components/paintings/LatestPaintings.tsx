"use client";

import React, { useRef } from "react";
import { Flex } from "antd";
import { useSelector } from "react-redux";
import type { StoreType } from "../../store/store";
import { LeftOutlined,  RightOutlined } from "@ant-design/icons";
import { getCategoryNameById } from "../../store/categorySlice";
import { spacing } from "../../theme/constant";
import AppCard from "../common/AppCard";
import { AppEmpty } from "../common/AppEmpty";
import { AppImagePreview } from "../common/AppImage";
import AppTag from "../common/AppTag";
import AppTitle from "../common/AppTitle";
import { themeToken } from "../../theme/token";

const LatestPaintings: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const paintings = useSelector(
    (store: StoreType) => store.painting.paintings
  );

  const categories = useSelector(
    (state: StoreType) => state.categories.categories
  );

  const latest = [...paintings]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() -
        new Date(a.createdAt).getTime()
    )
    .slice(0, 8);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;

    const amount = direction === "left" ? -320 : 320;

    scrollRef.current.scrollBy({
      left: amount,
      behavior: "smooth",
    });
  };

  if (!latest.length) {
    return (
      <AppEmpty description="No masterpieces yet! Be the first to create and share your art." />
    );
  }

  return (
    <AppCard>
      <Flex vertical gap={spacing.lg}>

        <Flex justify="center">
          <AppTitle level={3}>
            ✨ Fresh Creations ✨
          </AppTitle>
        </Flex>

        <Flex align="center" gap={spacing.sm}>

          <button onClick={() => scroll("left")}>
            <LeftOutlined twoToneColor={themeToken.token?.colorTextSecondary} />
          </button>

          <div
            ref={scrollRef}
            style={{
              overflowX: "auto",
              width: "100%",
            }}
          >
            <Flex gap={spacing.lg} wrap={false}>
              {latest.map((painting) => {
                const categoryName =
                  getCategoryNameById(
                    categories,
                    painting.category
                  );

                return (
                  <AppCard
                    key={painting.id}
                    style={{ minWidth: 260 }}
                  >
                    <Flex vertical gap={spacing.sm}>

                      <AppTag>
                        NEW
                      </AppTag>

                      <AppTitle level={5}>
                        {painting.name}
                      </AppTitle>

                      <AppTag>
                        {categoryName}
                      </AppTag>

                      <AppImagePreview
                        src={painting.url}
                      />

                    </Flex>
                  </AppCard>
                );
              })}
            </Flex>
          </div>

          <button onClick={() => scroll("right")}>
            <RightOutlined twoToneColor={themeToken.token?.colorTextSecondary}/>
          </button>

        </Flex>

      </Flex>
    </AppCard>
  );
};

export default LatestPaintings;