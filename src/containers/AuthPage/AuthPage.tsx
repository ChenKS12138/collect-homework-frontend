import React from "react";
import { Scaffold } from "@/components/index";
import { Input, Form, Space, Button, Drawer } from "base-component";
import styled from "styled-components";
import { useSagaDuckState } from "@/utils";
import { RouterLink, navigateTo, useRouteMatch } from "router";
import { useWindowSize } from "react-use";
import { AuthPageDuck } from ".";
import { Helmet } from "react-helmet";

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

  const {
    formLoading: loginLoading,
    formError: loginError,
    formData: loginData,
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
        >
          <Form.Item label="邮箱" name="email">
            <Input
              value={loginData?.email}
              onChange={(event) => {
                dispatch(
                  ducks.loginForm.creators.setFormDataPartly({
                    email: event.target.value,
                  })
                );
              }}
            />
          </Form.Item>
          <Form.Item label="密码" name="password">
            <Input.Password
              value={loginData?.password}
              onChange={(event) => {
                dispatch(
                  ducks.loginForm.creators.setFormDataPartly({
                    password: event.target.value,
                  })
                );
              }}
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
          <Form>
            <Form.Item label="邮箱" name="email" required>
              <Space size="large">
                <Input
                  value={registryData?.email}
                  onChange={(event) => {
                    dispatch(
                      ducks.registryForm.creators.setFormDataPartly({
                        email: event.target.value,
                      })
                    );
                  }}
                />
                <Button
                  type="default"
                  htmlType="button"
                  style={{
                    display: "block",
                    marginLeft: "8px",
                  }}
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
              <Input.Password
                value={registryData?.invitationCode}
                onChange={(event) => {
                  dispatch(
                    ducks.registryForm.creators.setFormDataPartly({
                      invitationCode: event.target.value,
                    })
                  );
                }}
              />
            </Form.Item>
            <Form.Item label="用户名" name="username" required>
              <Input
                value={registryData?.username}
                onChange={(event) => {
                  dispatch(
                    ducks.registryForm.creators.setFormDataPartly({
                      username: event.target.value,
                    })
                  );
                }}
              />
            </Form.Item>
            <Form.Item label="密码" name="userPassword" required>
              <Input.Password
                value={registryData?.userPassword}
                onChange={(event) => {
                  dispatch(
                    ducks.registryForm.creators.setFormDataPartly({
                      userPassword: event.target.value,
                    })
                  );
                }}
              />
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
