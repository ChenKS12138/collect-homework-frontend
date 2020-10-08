import React, { Props, AllHTMLAttributes } from "react";
import styled from "styled-components";

const AvatarCardImage = styled.img`
  border-radius: 10px;
  width: 100px;
  height: 100px;
  display: block;
`;

interface IAvatarCard extends Props<null>, AllHTMLAttributes<null> {
  src: string;
}

export default function AvatarCard({ src, className, style }: IAvatarCard) {
  return (
    <AvatarCardImage
      src={src}
      className={className}
      style={style}
      alt="avatar"
    />
  );
}
