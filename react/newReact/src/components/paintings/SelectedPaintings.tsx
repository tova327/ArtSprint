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
    background: "rgba(255,255,255,0.65)",
    border: "1px solid rgba(98,120,197,0.12)",
    borderRadius: 16,
  }}
  bodyStyle={{ padding: 12 }}
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
          {paintings.map((painting,index) => (
            <AppCard
              key={painting.id}
              style={{
                minWidth: 160,
                maxWidth: 180,
                borderRadius: 12,
              }}
              bodyStyle={{ padding: 8 }}
              
            >
              <Flex vertical gap={4}>

                <AppTag color={themeToken.token?.colorPrimary}>{tagContent}</AppTag>

                <AppTitle level={5} >
                  {painting.name}
                </AppTitle>

                <AppImagePreview
                  src={painting.url}
                  
                />

              </Flex>
              <AppTag color={themeToken.token?.colorTextSecondary}>
                {categories[index % categories.length]}
              </AppTag>
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
