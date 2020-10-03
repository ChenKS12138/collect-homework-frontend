import React from "react";
import { Scaffold } from "@/components/index";
import { Form, Input, Button, Drawer, Space } from "antd";
import styled from "styled-components";
import {
  RouterLink,
  navigateTo,
  useRouteMatch,
  useSagaDuckState,
} from "@/utils";
import { useWindowSize } from "react-use";
import { DuckCmpProps } from "saga-duck";
import { AuthPageDuck } from ".";
import { ILoginForm } from "./AuthPageDuck";

const { useForm } = Form;

const AuthWrapper = styled.div`
  max-width: 400px;
`;

export default function AuthPage() {
  const { dispatch, duck, store } = useSagaDuckState<AuthPageDuck>(
    AuthPageDuck
  );
  const { ducks } = duck;
  // const { path } = ducks.route.selector(store);
  const showRegistry = useRouteMatch("/auth/registry") !== false;
  const { height, width } = useWindowSize();
  const [formInstance] = useForm();

  console.log(ducks.loginForm.selector(store), store, duck);

  const {
    formLoading: loginLoading,
    formError: loginError,
  } = ducks.loginForm.selector(store);
  const {
    formLoading: registryLoading,
    formError: registryError,
  } = ducks.registryForm.selector(store);

  return (
    <Scaffold
      links={[
        {
          link: "/help",
          text: "帮助",
        },
        {
          link: "/",
          text: "主页",
        },
      ]}
    >
      <AuthWrapper className="app-mlr-auto app-mt-10n">
        <Form
          style={{
            maxWidth: "90vw",
          }}
          className="app-mlr-auto"
          form={formInstance}
          onFinish={(value: ILoginForm) => {
            const { email, password } = value;
            if (!email?.length || !password?.length) return;
            console.log(value);
            dispatch(ducks.loginForm.creators.setFormData(value));
          }}
        >
          <Form.Item label="邮箱" name="email">
            <Input />
          </Form.Item>
          <Form.Item label="密码" name="password">
            <Input.Password type="password" />
          </Form.Item>
          <Button type="primary" htmlType="submit" block loading={loginLoading}>
            登陆
          </Button>
          <Button type="link" htmlType="button" block className="app-mt-1n">
            <RouterLink to="/auth/registry">暂无账号？立即注册</RouterLink>
          </Button>
        </Form>
      </AuthWrapper>
      <Drawer
        title="注册管理员"
        closable={true}
        onClose={() => {
          navigateTo("/auth");
        }}
        visible={showRegistry}
        placement="right"
        height={height}
        width={Math.max(width * 0.7, 300)}
      >
        <AuthWrapper className="app-mlr-auto app-mt-4n">
          <Form>
            <Form.Item label="邮箱" required>
              <Space size="large">
                <Input />
                <Button type="default" htmlType="button">
                  申请邀请码
                </Button>
              </Space>
            </Form.Item>
            <Form.Item label="邀请码" required>
              <Input.Password />
            </Form.Item>
            <Form.Item label="用户名" required>
              <Input />
            </Form.Item>
            <Form.Item label="密码" required>
              <Input.Password />
            </Form.Item>
            <Button type="primary" htmlType="submit" block>
              提交申请
            </Button>
          </Form>
        </AuthWrapper>
      </Drawer>
    </Scaffold>
  );
}
