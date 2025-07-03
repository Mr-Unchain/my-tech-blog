import React, { useState, useEffect } from "react";

interface CategoryListProps {
  category: string[];
  className?: string;
}

const CategoryList: React.FC<CategoryListProps> = ({ category, className }) => {
  const [max, setMax] = useState(category.length);

  useEffect(() => {
    const update = () => {
      setMax(window.innerWidth <= 640 ? 2 : category.length);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [category.length]);

  const cats = category.slice(0, max);

  return (
    <div className={className || "flex flex-wrap gap-2"}>
      {cats.map((cat, idx) => (
        <a
          href={`/category/${cat}`}
          className="bg-custom-button text-black text-xs font-bold px-2 py-1 rounded hover:opacity-80 transition-opacity"
          key={cat + idx}
        >
          {cat}
        </a>
      ))}
      {max < category.length && (
        <span className="text-xs text-gray-200 px-2">+{category.length - max}</span>
      )}
    </div>
  );
};

export default CategoryList;
