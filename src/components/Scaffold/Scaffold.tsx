import React, { Props, ReactNode, useState } from "react";
import { Layout, Row, Col, Space, Button } from "antd";
import { BarsOutlined } from "@ant-design/icons";
import styled from "styled-components";
const { Header, Content, Footer } = Layout;
import { useWindowSize } from "react-use";
import { RouterLink } from "@/utils";
import { Helmet } from "react-helmet";

const BottomText = styled.div`
  text-align: center;
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
                <Button type="link">
                  <RouterLink to={item.link}>{item.text}</RouterLink>
                </Button>
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
                  <Button type="link" key={item.text}>
                    <RouterLink to={item.link}>{item.text}</RouterLink>
                  </Button>
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
            align="middle"
          >
            <Col>
              <TitleText>作业提交平台</TitleText>
            </Col>
            <Col push={9}>
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
        <BottomText>homework.chenks.codes</BottomText>
      </Footer>
    </Layout>
  );
}
