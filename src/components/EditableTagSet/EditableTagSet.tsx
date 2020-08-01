import React, { Props, useState } from "react";
import { Tag, Input } from "antd";

interface IEditTableSet extends Props<null> {
  // isEdit: boolean;
  tagSet: {
    text: string;
    key: string;
  }[];
  onInputConfirm: Function;
}

export default function EditTableSet({
  tagSet,
  onInputConfirm,
}: IEditTableSet) {
  const [inputValue, setInputValue] = useState("");
  const [currentTagSet, setCurrentTagSet] = useState(tagSet);

  const handleConfirm = () => {
    if (!inputValue?.length) return;
    setCurrentTagSet(
      currentTagSet.concat([{ text: inputValue, key: inputValue }])
    );
    setInputValue("");
    onInputConfirm(currentTagSet);
  };

  const handleTagClose = (tag: { key: string }) => {
    setCurrentTagSet(currentTagSet.filter((x) => x.key !== tag.key));
  };

  return (
    <div>
      {currentTagSet.map((tag) => (
        <Tag
          key={tag.key}
          onClose={() => {
            handleTagClose(tag);
          }}
          closable
        >
          {tag.text}
        </Tag>
      ))}
      <Input
        type="text"
        size="small"
        style={{ display: "inline-block", width: "60px" }}
        value={inputValue}
        onChange={(event) => {
          setInputValue(event.target.value);
        }}
        onBlur={handleConfirm}
        onPressEnter={handleConfirm}
      />
    </div>
  );
}
