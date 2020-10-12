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
import { AuthPageDuck } from ".";
import { ILoginForm } from "./AuthPageDuck";
import { IRegistryForm } from "./ducks/AuthPageRegistryFormDuck";
import { Helmet } from "react-helmet";

const { useForm } = Form;

const AuthWrapper = styled.div`
  max-width: 400px;
`;

export default function AuthPage() {
  const { dispatch, duck, store } = useSagaDuckState<AuthPageDuck>(
    AuthPageDuck
  );
  const { ducks } = duck;
  const showRegistry = useRouteMatch("/auth/registry") !== false;
  const { height, width } = useWindowSize();
  const [loginFormInstance] = useForm();
  const [registerFormInstance] = useForm();

  const {
    formLoading: loginLoading,
    formError: loginError,
  } = ducks.loginForm.selector(store);
  const {
    formLoading: registryLoading,
    formError: registryError,
    formData: registryData,
  } = ducks.registryForm.selector(store);

  const { active, seconds } = ducks.cutdown.selector(store);

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
      <Helmet>
        <title>登录｜作业提交平台</title>
        <meta name="title" content="登录｜作业提交平台" />
      </Helmet>
      <AuthWrapper className="app-mlr-auto app-mt-10n">
        <Form
          style={{
            maxWidth: "90vw",
          }}
          className="app-mlr-auto"
          form={loginFormInstance}
          onValuesChange={(changeValue: any, value: ILoginForm) => {
            dispatch(ducks.loginForm.creators.setFormData(value));
          }}
        >
          <Form.Item label="邮箱" name="email">
            <Input />
          </Form.Item>
          <Form.Item label="密码" name="password">
            <Input.Password
              type="password"
              onPressEnter={() => {
                dispatch({ type: duck.types.INVOKE_LOGIN });
              }}
            />
          </Form.Item>
          <Button
            type="primary"
            htmlType="button"
            block
            loading={loginLoading}
            onClick={() => {
              dispatch({ type: duck.types.INVOKE_LOGIN });
            }}
          >
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
          <Form
            form={registerFormInstance}
            onValuesChange={(changeValue: any, value: IRegistryForm) => {
              dispatch(ducks.registryForm.creators.setFormData(value));
            }}
          >
            <Form.Item label="邮箱" name="email" required>
              <Space size="large">
                <Input />
                <Button
                  type="default"
                  htmlType="button"
                  onClick={() => {
                    dispatch(
                      duck.creators.fetchSecretCode(registryData?.email)
                    );
                  }}
                  disabled={active}
                  block
                >
                  {active ? `${seconds}s秒后重试` : "申请邀请码"}
                </Button>
              </Space>
            </Form.Item>
            <Form.Item label="邀请码" name="invitationCode" required>
              <Input.Password />
            </Form.Item>
            <Form.Item label="用户名" name="username" required>
              <Input />
            </Form.Item>
            <Form.Item label="密码" name="userPassword" required>
              <Input.Password />
            </Form.Item>
            <Button
              type="primary"
              htmlType="button"
              block
              loading={registryLoading}
              onClick={() => {
                dispatch({ type: duck.types.INVOKE_REGISTER });
              }}
            >
              提交申请
            </Button>
          </Form>
        </AuthWrapper>
      </Drawer>
    </Scaffold>
  );
}
