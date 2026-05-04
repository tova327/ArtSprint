"use client";

import { FC, useRef } from "react";
import { Button, Flex } from "antd";
import { LeftOutlined,  RightOutlined } from "@ant-design/icons";
import AppCard from "../common/AppCard";
import { AppEmpty } from "../common/AppEmpty";
import { AppImagePreview } from "../common/AppImage";
import AppTag from "../common/AppTag";
import AppTitle from "../common/AppTitle";
import { PaintingType } from "../../store/paintingSlice";
import { themeToken } from "../../theme/token";

type SelectedPaintingsProps = {
    paintings: PaintingType[];
    categories: string[];
    title: string;
    tagContent: string;
};

const SelectedPaintings:FC<SelectedPaintingsProps> = ({paintings, categories, title,  tagContent}: SelectedPaintingsProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;

    const amount = direction === "left" ? -280 : 280;

    scrollRef.current.scrollBy({
      left: amount,
      behavior: "smooth",
    });
  };

  if (!paintings.length) {
    return (
      <AppEmpty description="No masterpieces yet! Be the first to create and share your art." />
    );
  }

  return (
  <AppCard
  size="small"
  style={{
    background: themeToken.token?.colorBgContainer,
    border: themeToken.token
      ? `1px solid ${themeToken.token.colorBorder}`
      : undefined,
    borderRadius: themeToken.components?.Card?.borderRadiusLG,
  }}
  bodyStyle={{ padding: 8 }}
>
  <Flex vertical gap={8}>

    <AppTitle level={5} style={{ textAlign: "center", margin: 0 }}>
      {title}
    </AppTitle>

    <Flex align="center" gap={4}>

      <Button type="text" onClick={() => scroll("left")}>
        <LeftOutlined />
      </Button>

      <div
        ref={scrollRef}
        style={{
          overflowX: "auto",
          flex: 1,
        }}
      >
        <Flex gap={8} wrap={false}>
          {paintings.map((painting, index) => (
            <AppCard
              key={painting.id}
              style={{
                minWidth: 220,
                maxWidth: 240,
                borderRadius: 10,
                height: 90, // 🔥 גובה קטן וקבוע
              }}
              bodyStyle={{ padding: 6 }}
            >
              {/* 🔥 Splitter layout */}
              <Flex style={{ height: "100%" }}>

                {/* שמאל - טקסט */}
                <Flex
                  vertical
                  justify="space-between"
                  style={{
                    flex: 1,
                    overflow: "hidden",
                  }}
                >
                  <AppTag color={themeToken.token?.colorPrimary}>
                    {tagContent}
                  </AppTag>

                  <AppTitle
                    level={5}
                    style={{
                      fontSize: 12,
                      margin: 0,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {painting.name}
                  </AppTitle>

                  <AppTag
                    color={themeToken.token?.colorTextSecondary}
                    style={{ fontSize: 10 }}
                  >
                    {categories[index % categories.length]}
                  </AppTag>
                </Flex>

                {/* ימין - תמונה */}
                <div
                  style={{
                    width: 70,
                    marginLeft: 6,
                    flexShrink: 0,
                  }}
                >
                  <AppImagePreview
                    src={painting.url}
                    style={{
                      height: "100%",
                      width: "100%",
                      objectFit: "cover",
                      borderRadius: 8,
                    }}
                  />
                </div>

              </Flex>
            </AppCard>
          ))}
        </Flex>
      </div>

      <Button type="text" onClick={() => scroll("right")}>
        <RightOutlined />
      </Button>

    </Flex>

  </Flex>
</AppCard>
  );
};

export default SelectedPaintings;
