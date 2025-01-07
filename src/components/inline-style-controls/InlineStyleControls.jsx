import React from "react";
import clsx from "clsx";
import styles from "./styles.module.css";

// Supported inline styles
const INLINE_STYLES = [
    { label: "Bold", style: "BOLD" },
    { label: "Italic", style: "ITALIC" },
    { label: "Underline", style: "UNDERLINE" },
    { label: "Monospace", style: "CODE" },
];

export const InlineStyleControls = ({ editorState, onToggle }) => {
    const currentStyle = editorState.getCurrentInlineStyle();

    return (
        <div className={styles.controls}>
            {INLINE_STYLES.map((type) => (
                <button
                    type="button"
                    key={type.label}
                    className={clsx(
                        styles.button,
                        currentStyle.has(type.style) && styles.active
                    )}
                    onMouseDown={(e) => {
                        e.preventDefault();
                        onToggle(type.style);
                    }}
                >
                    {type.label}
                </button>
            ))}
        </div>
    );
};
