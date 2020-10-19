import React, { Props, ReactNode, useState } from "react";
import { Layout, Space, Button, Row, Col } from "base-component";
import { BarsOutlined } from "@ant-design/icons";
import styled from "styled-components";
const { Header, Content, Footer } = Layout;
import { useWindowSize } from "react-use";
import { RouterLink } from "router";
import { Helmet } from "react-helmet";

const BottomText = styled.div`
  text-align: center;
  word-break: break-all;
`;

const TitleText = styled.h2`
  color: white;
  text-align: center;
`;

interface IScaffold extends Props<null> {
  links?: {
    text: string;
    link: string;
  }[];
  sider?: ReactNode;
  children?: any;
}
const MAX_WIDTH_TO_SHOW_FULL_OPERATION = 750;

export default function Scaffold({ links, sider, children }: IScaffold) {
  const { width } = useWindowSize();
  const [showMenu, setShowMenu] = useState(false);
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Helmet>
        <meta name="description" content="作业提交平台" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0,user-scalable=no"
        />
      </Helmet>
      <Header
        className="app-box-shadow-default"
        style={{
          height: width > MAX_WIDTH_TO_SHOW_FULL_OPERATION ? "64px" : "auto",
        }}
      >
        <div style={{ display: showMenu ? "block" : "none" }}>
          {links?.map?.((item, index) => (
            <Row key={index} align="middle">
              <Col push={3} style={{ maxHeight: "64px" }}>
                <RouterLink to={item.link}>
                  <Button type="link">{item.text}</Button>
                </RouterLink>
              </Col>
            </Row>
          ))}
        </div>
        {width > MAX_WIDTH_TO_SHOW_FULL_OPERATION ? (
          <Row>
            <Col span={2} />
            <Col span={20}>
              <TitleText>作业提交平台</TitleText>
            </Col>
            <Col span={2}>
              <Space>
                {links?.map?.((item) => (
                  <RouterLink key={item.text} to={item.link}>
                    <Button type="link">{item.text}</Button>
                  </RouterLink>
                ))}
              </Space>
            </Col>
          </Row>
        ) : (
          <Row
            style={{
              height: "64px",
            }}
            justify="center"
            align="bottom"
          >
            <Col span={21}>
              <TitleText>作业提交平台</TitleText>
            </Col>
            <Col span={3} style={{ outline: 0 }}>
              <BarsOutlined
                style={{
                  color: "#ffffff",
                  fontSize: "26px",
                }}
                onClick={() => {
                  setShowMenu(!showMenu);
                }}
              />
            </Col>
          </Row>
        )}
      </Header>
      <Content>{children ?? null}</Content>
      <Footer>
        <BottomText>
          {process.env.VERSION
            ? `version: ${process.env.VERSION}`
            : "Developing Mode No Version"}
        </BottomText>
      </Footer>
    </Layout>
  );
}
