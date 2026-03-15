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
    <div className={className || "flex flex-wrap gap-1.5"}>
      {cats.map((cat, idx) => (
        <a
          href={`/category/${cat}`}
          className="text-xs font-medium px-2 py-0.5 rounded-full transition-colors duration-200"
          style={{
            background: 'var(--color-accent-light)',
            color: 'var(--color-accent)',
          }}
          key={cat + idx}
        >
          {cat}
        </a>
      ))}
      {max < category.length && (
        <span
          className="text-xs px-2"
          style={{ color: 'var(--color-text-muted)' }}
        >
          +{category.length - max}
        </span>
      )}
    </div>
  );
};

export default CategoryList;
