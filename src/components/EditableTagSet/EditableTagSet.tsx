import React, { Props, useCallback, useState } from "react";
import { Tag, Input } from "antd";

interface IEditTableSet extends Props<null> {
  // isEdit: boolean;
  tagSet: {
    text: string;
    key: string;
  }[];
  onTagSetChange: Function;
}

export default function EditTableSet({
  tagSet,
  onTagSetChange,
}: IEditTableSet) {
  const [inputValue, setInputValue] = useState("");
  const [currentTagSet, setCurrentTagSet] = useState(tagSet);

  const handleConfirm = useCallback(() => {
    if (!inputValue?.length) return;
    const newTagSet = currentTagSet.concat([
      { text: inputValue, key: inputValue + Date.now() },
    ]);
    setCurrentTagSet(newTagSet);
    setInputValue("");
    onTagSetChange(newTagSet);
  }, [inputValue, currentTagSet, setInputValue, setCurrentTagSet]);

  const handleTagClose = useCallback(
    (tag: { key: string }) => {
      const newTagSet = currentTagSet.filter((x) => x.key !== tag.key);
      setCurrentTagSet(newTagSet);
      onTagSetChange(newTagSet);
    },
    [setCurrentTagSet, currentTagSet]
  );

  return (
    <div>
      {currentTagSet?.map?.((tag) => (
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
