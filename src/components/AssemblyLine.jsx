import React, { useState } from "react";

const AssemblyLine = ({ stages }) => {
  const [itemsList, setItemsList] = useState([]);
  const [item, setItem] = useState("");

  const onChange = (event) => {
    setItem(event.target.value);
  };

  const addItems = (event) => {
    if (event.key === "Enter" && event.target.value) {
      setItemsList([
        ...itemsList,
        { label: event.target.value, stageIndex: 0, id: itemsList.length },
      ]);
      setItem("");
    }
  };

  const handleMoveLeftItem = ({ label, stageIndex, id }) => {
    window.addEventListener("contextmenu", (e) => e.preventDefault());
    if (stageIndex > 0) {
      setItemsList([
        { label, stageIndex: stageIndex - 1, id },
        ...itemsList.filter((m) => m.id !== id),
      ]);
    } else if (stageIndex === 0) {
      setItemsList([...itemsList.filter((m) => m.id !== id)]);
    }
  };

  const handleMoveRightItem = ({ label, stageIndex, id }) => {
    if (stageIndex < stages.length) {
      setItemsList([
        ...itemsList.filter((m) => m.id !== id),
        { label, stageIndex: stageIndex + 1, id },
      ]);
    } else if (stageIndex > stages.length + 1) {
      setItemsList([...itemsList.filter((m) => m.id !== id)]);
    }
  };

  const RenderStages = () =>
    stages.map((stage, index) => (
      <div className="assembly-stage" key={stage}>
        {stage}
        {itemsList
          .filter((m) => m.stageIndex === index)
          .reverse((m) => m.label)
          .map(({ label, stageIndex, id }) => (
            <button
              key={id}
              className="assembly-item"
              onContextMenu={() =>
                handleMoveLeftItem({ label, stageIndex, id })
              }
              onClick={() => handleMoveRightItem({ label, stageIndex, id })}
            >
              {label}
            </button>
          ))}
      </div>
    ));

  return (
    <>
      <label>Add an item:</label>
      <input
        className="assembly-add-item"
        onKeyDown={addItems}
        onChange={onChange}
        value={item}
      />
      <div className="stage">
        <RenderStages />
      </div>
    </>
  );
};

export default AssemblyLine;