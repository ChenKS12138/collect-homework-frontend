import { IProjectItem } from "@/utils/interface";
import { mock, Random } from "mockjs";

Random.extend({
  fileName() {
    return `B180307${this.natural(10, 30)}-${this.cname()}-实验1.doc`;
  },
  project() {
    const projects = [
      "C语言程序设计",
      "Java程序设计",
      "Go程序设计",
      "数据结构实验",
      "数电实验",
    ];
    return this.pick(projects);
  },
  projectName() {
    return `第${this.natural(1, 10)}次${this.project()}`;
  },
});

export const projectListData = [
  ...Array.from({ length: 7 }).map(() => ({
    id: Random.guid(),
    name: Random.projectName(),
    adminId: Random.guid(),
    adminName: Random.cname(),
    fileNamePattern: String.raw`\d+`,
    fileNameExtensions: [".doc", ".docx"],
    fileNameExample: Random.fileName(),
    usable: true,
    createAt: Random.date(),
    updateAt: Random.datetime(),
  })),
];

export const fileData = [
  ...Array.from({ length: 7 }).map(() => ({
    id: Random.natural(),
    fileName: Random.csentence().slice(0, 5) + ".doc",
    creatAt: Random.datetime(),
    size: "100KB",
  })),
];
