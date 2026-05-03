"use client";

import { FC, useRef } from "react";
import { Button, Flex } from "antd";
import { LeftOutlined,  RightOutlined } from "@ant-design/icons";
import { spacing } from "../../theme/constant";
import AppCard from "../common/AppCard";
import { AppEmpty } from "../common/AppEmpty";
import { AppImagePreview } from "../common/AppImage";
import AppTag from "../common/AppTag";
import AppTitle from "../common/AppTitle";
import { themeToken } from "../../theme/token";
import { PaintingType } from "../../store/paintingSlice";

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
    <AppCard style={{ background: "rgba(255,255,255,0.84)", border: "1px solid rgba(98,120,197,0.2)" }}>
      <Flex vertical gap={spacing.lg}>

        <Flex justify="center">
          <AppTitle level={3}>
            {title}
          </AppTitle>
        </Flex>

        <Flex align="center" gap={spacing.xs}>

          <Button type="text" onClick={() => scroll("left")} aria-label="Scroll left">
            <LeftOutlined twoToneColor={themeToken.token?.colorTextSecondary} />
          </Button>

          <div
            ref={scrollRef}
            style={{
              overflowX: "auto",
              width: "100%",
            }}
          >
            <Flex gap={spacing.md} wrap={false}>
              {paintings.map((painting,index) => {
                const categoryName =
                  categories[index] || "Unknown";

                return (
                    <AppCard
                    key={painting.id}
                    style={{ minWidth: "clamp(180px, 22vw, 240px)", maxWidth: 240, borderRadius: 18 }}
                  >
                    <Flex vertical gap={spacing.sm}>

                    
                      <AppTag>
                       {tagContent}
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

          <Button type="text" onClick={() => scroll("right")} aria-label="Scroll right">
            <RightOutlined twoToneColor={themeToken.token?.colorTextSecondary}/>
          </Button>

        </Flex>

      </Flex>
    </AppCard>
  );
};

export default SelectedPaintings;
