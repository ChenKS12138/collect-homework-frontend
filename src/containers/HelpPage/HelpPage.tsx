import React from "react";
import { Scaffold } from "@/components/index";
import { Collapse } from "antd";
import { Helmet } from "react-helmet";

const tips = [
  {
    q: `为啥交个作业需要作业名？`,
    a: `因为有<span style="font-size: 30px">多项作业</span>在等待提交，需要作业来用以<span style="font-size: 30px">区分</span>`,
  },
  {
    q: `🔥为啥交个作业还要口令？`,
    a: `口令这个东西是<span style="font-size: 30px">提交者自己设定</span>的，它被用来<span style="font-size: 30px">确认</span>两次提交同一文件名的人是<span style="font-size: 30px">同一个人</span>，防止文件被人恶意篡改。（麻烦各位了🙏🙏🙏🙏🙏`,
  },
  {
    q: `口令会不会被管理员或者其他人看到啊？`,
    a: `这个肯定<span style="font-size: 30px">不会</span>。每个口令都不会被直接明文存储，都会经过<span style="font-size: 30px">bcrypt函数</span>加密后再存储`,
  },
  {
    q: `🔥那我怎么确认我的作业已经提交了？`,
    a: `可以去注意提交<span style="font-size: 30px">人数的变化</span>，或者<span style="font-size: 30px">向管理员确认</span>(管理员可以查看已提交的文件的名单)`,
  },
  {
    q: `🔥我该怎么成为管理员？`,
    a: `在登录页<span style="font-size: 30px">注册</span>即可，申请<span style="font-size: 30px">邀请码</span>后，会向超级管理员发一封包含邀请码的邮件，请向超级管理员<span style="font-size: 30px">索取</span>。（主要是为了防止恶意注册）`,
  },
  {
    q: `为啥我把文件拖拽进去后，显示的是浏览器的下载页面呢？`,
    a: `可能是没有把文件拖拽至那个<span style="font-size: 20px">最里面的虚框框里</span>,下载出现是<span style="font-size: 20px">浏览器的feature</span>`,
  },
  {
    q: `还有其他疑惑怎么办？`,
    a: `请联系管理员(QQ:749923710)<span style="font-size: 30px">出来挨打</span>👀`,
  },
];

export default function HelpPage() {
  return (
    <Scaffold
      links={[
        {
          link: "/",
          text: "主页",
        },
        {
          link: "/auth",
          text: "管理员",
        },
      ]}
    >
      <Helmet>
        <title>帮助 ｜ 作业提交平台</title>
        <meta name="title" content="帮助 ｜ 作业提交平台" />
      </Helmet>
      <div
        className="app-mt-4n app-text-align-center app-mlr-auto app-mt-3n`"
        style={{ maxWidth: "80%", width: "960px" }}
      >
        <Collapse accordion>
          {tips.map((tip, index) => (
            <Collapse.Panel header={tip.q} key={index}>
              <p dangerouslySetInnerHTML={{ __html: tip.a }} />
            </Collapse.Panel>
          ))}
        </Collapse>
      </div>
    </Scaffold>
  );
}
