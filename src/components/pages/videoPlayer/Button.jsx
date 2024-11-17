import React from "react";

function Button({ item, handleCategoryClick, selectedCategory }) {
  return (
    <div>
      <button
        onClick={() => handleCategoryClick(item)}
        className={`${
          item === selectedCategory
            ? "text-white bg-black"
            : "text-black bg-stone-100"
        } text-xs font-semibold p-2 rounded-lg shadow-sm overflow-hidden whitespace-nowrap`}
      >
        {item}
      </button>
    </div>
  );
}

export default Button;
