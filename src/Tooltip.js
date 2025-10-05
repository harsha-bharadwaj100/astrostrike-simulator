// src/Tooltip.js
import React from "react";
import "./Tooltip.css";

/**
 * A reusable tooltip component.
 * @param {object} props - The component props.
 * @param {string} props.text - The text to display in the tooltip.
 * @param {React.ReactNode} props.children - The content the tooltip is attached to.
 */
const Tooltip = ({ text, children }) => {
  return (
    <div className="tooltip-container">
      {children}
      <span className="tooltip-icon">ⓘ</span>
      <div className="tooltip-text">{text}</div>
    </div>
  );
};

export default Tooltip;
