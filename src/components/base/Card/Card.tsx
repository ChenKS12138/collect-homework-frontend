import React from "react";

interface ICard {
  title: React.ReactNode;
  extra?: React.ReactNode;
  actions?: React.ReactNode;
  children?: React.ReactNode;
}

export default function Card({ title, actions, children, extra }: ICard) {
  return <div></div>;
}
