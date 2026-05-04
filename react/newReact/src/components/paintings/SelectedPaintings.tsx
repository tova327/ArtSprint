"use client";

import { FC, useRef } from "react";
import {  Button, Col, Flex, Row, Splitter } from "antd";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import AppCard from "../common/AppCard";
import { AppEmpty } from "../common/AppEmpty";
import { AppImagePreview } from "../common/AppImage";
import AppTag from "../common/AppTag";
import AppTitle from "../common/AppTitle";
import { PaintingType } from "../../store/paintingSlice";
import { themeToken } from "../../theme/token";
import { AppCaption } from "../common/AppText";

type SelectedPaintingsProps = {
  paintings: PaintingType[];
  categories: string[];
  title: string;
  tagContent: string;
};

const SelectedPaintings: FC<SelectedPaintingsProps> = ({ paintings, categories, title, tagContent }: SelectedPaintingsProps) => {
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
            <Flex gap={8} wrap={false} style={{ width: "max-content", paddingBottom: 4 }}>
              {paintings.map((painting, index) => (
                <Splitter style={{ padding: 15, boxShadow: themeToken.components?.Card?.boxShadow , flex: "0 0 auto", borderRadius: themeToken.components?.Card?.borderRadiusLG }} key={painting.id}>
                  <Splitter.Panel size="40%">
                    <Flex vertical gap={4} align="space-between" style={{ height: "100%", padding: 8 }}>
                      <AppTitle level={5} style={{display:"block"}}>
                        {painting.name}
                      </AppTitle>
                      <Row align="middle" justify="space-between" style={{ width: "100%" }}> 
                        <Col><AppCaption >{tagContent}</AppCaption></Col>
                        <Col><AppTag color={themeToken.token?.colorTextSecondary}>
                          {categories[index] || "Uncategorized"}
                        </AppTag></Col>

                      </Row>
                    </Flex>
                  </Splitter.Panel>
                  <Splitter.Panel>
                    <AppImagePreview src={painting.url} style={{maxHeight:80, maxWidth:120, objectFit:"cover"}} />
                  </Splitter.Panel>
                </Splitter>
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
