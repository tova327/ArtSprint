"use client";

import { FC, useRef } from "react";
import { Flex } from "antd";
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

    const amount = direction === "left" ? -320 : 320;

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
    <AppCard>
      <Flex vertical gap={spacing.lg}>

        <Flex justify="center">
          <AppTitle level={3}>
            {title}
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
              {paintings.map((painting,index) => {
                const categoryName =
                  categories[index] || "Unknown";

                return (
                  <AppCard
                    key={painting.id}
                    style={{ minWidth: 260 }}
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

          <button onClick={() => scroll("right")}>
            <RightOutlined twoToneColor={themeToken.token?.colorTextSecondary}/>
          </button>

        </Flex>

      </Flex>
    </AppCard>
  );
};

export default SelectedPaintings;