import React from "react";
import { Scaffold } from "@/components/index";
import { Input, Form, Space, Button, Drawer } from "base-component";
import styled from "styled-components";
import { useDuckState } from "@/utils";
import { RouterLink, navigateTo, useRouteMatch } from "router";
import { useWindowSize } from "react-use";
import { AuthPageDuck } from ".";
import { Helmet } from "react-helmet";

const AuthWrapper = styled.div`
  max-width: 400px;
`;

export default function AuthPage() {
  const { dispatch, duck, store } = useDuckState<AuthPageDuck>(AuthPageDuck);
  const { ducks } = duck;
  const showRegistry = useRouteMatch("/auth/registry") !== false;
  const { height, width } = useWindowSize();

  const {
    formLoading: loginLoading,
    formError: loginError,
    formData: loginData,
  } = ducks.loginForm.selectors(store);
  const {
    formLoading: registryLoading,
    formError: registryError,
    formData: registryData,
  } = ducks.registryForm.selectors(store);

  const { active, seconds } = ducks.cutdown.selectors(store);
  const { imgUrl, token } = ducks.captcha.selectors(store);

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
              defaultValue={loginData?.email}
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
              defaultValue={loginData?.password}
              onChange={(event) => {
                dispatch(
                  ducks.loginForm.creators.setFormDataPartly({
                    password: event.target.value,
                  })
                );
              }}
            />
          </Form.Item>
          <Form.Item label="验证码" name="captcha">
            <div style={{ display: "flex", alignItems: "center" }}>
              <Input
                defaultValue={loginData?.captcha}
                onChange={(event) => {
                  dispatch(
                    ducks.loginForm.creators.setFormDataPartly({
                      captcha: event.target.value,
                    })
                  );
                }}
                onPressEnter={() => {
                  dispatch({ type: duck.types.INVOKE_LOGIN });
                }}
              />
              <img
                style={{ marginLeft: "2rem", cursor: "pointer" }}
                width="128"
                height="64"
                src={imgUrl}
                data-token={token}
                onClick={() => {
                  dispatch({
                    type: ducks.captcha.types.FETCH_CAPTCHA,
                  });
                }}
              />
            </div>
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
          <RouterLink to="/auth/registry" className="app-mt-1n">
            <Button type="link" htmlType="button" block>
              暂无账号？立即注册
            </Button>
          </RouterLink>
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
            <Form.Item label="验证码" name="captcha" required>
              <div style={{ display: "flex", alignItems: "center" }}>
                <Input
                  defaultValue={registryData?.captcha}
                  onChange={(event) => {
                    dispatch(
                      ducks.registryForm.creators.setFormDataPartly({
                        captcha: event.target.value,
                      })
                    );
                  }}
                />
                <img
                  style={{ marginLeft: "2rem", cursor: "pointer" }}
                  width="128"
                  height="64"
                  src={imgUrl}
                  data-token={token}
                  onClick={() => {
                    dispatch({
                      type: ducks.captcha.types.FETCH_CAPTCHA,
                    });
                  }}
                />
              </div>
            </Form.Item>
            <Form.Item label="邮箱" name="email" required>
              <Space size="large">
                <Input
                  defaultValue={registryData?.email}
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
                defaultValue={registryData?.invitationCode}
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
                defaultValue={registryData?.username}
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
                defaultValue={registryData?.userPassword}
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
