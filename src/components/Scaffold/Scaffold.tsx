import React, { Props, ReactNode } from "react";
import { Layout, Row, Col, Space, Button } from "antd";
import styled from "styled-components";
const { Header, Content, Footer } = Layout;
import { useWindowSize } from "react-use";
import { Link } from "@reach/router";

const BottomText = styled.div`
  text-align: center;
`;

const TitleText = styled.h2`
  color: white;
  text-align: center;
`;

const ColorLink = styled(Link)``;

interface IScaffold extends Props<null> {
  optionRight: {
    span: number;
    element: ReactNode | ReactNode[];
  };
  sider?: ReactNode;
  children: any;
}
const MAX_WIDTH_TO_SHOW_FULL_OPERATION = 750;

export default function Scaffold({
  optionRight: { element, span },
  sider,
  children,
}: IScaffold) {
  const { width } = useWindowSize();
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header className="app-box-shadow-default">
        {width > MAX_WIDTH_TO_SHOW_FULL_OPERATION ? (
          <Row>
            <Col span={span} />
            <Col span={24 - 2 * span}>
              <TitleText>作业提交平台</TitleText>
            </Col>
            <Col span={span}>
              <Space>{element}</Space>
            </Col>
          </Row>
        ) : null}
      </Header>
      <Content>{children}</Content>
      <Footer>
        <BottomText>homework.chenks.codes</BottomText>
      </Footer>
    </Layout>
  );
}

export const OptionButtonHelp = () => (
  <Button type="link">
    <ColorLink to="/help">帮助</ColorLink>
  </Button>
);

export const OptionButtonAuth = () => (
  <Button type="link">
    <ColorLink to="/auth">管理员</ColorLink>
  </Button>
);

export const OptionButtonList = () => (
  <Button type="link">
    <ColorLink to="/">主页</ColorLink>
  </Button>
);
