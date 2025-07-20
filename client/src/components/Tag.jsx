import React from "react";
import "./Tag.css";


const Tag = ({tagName,selectTag, selected}) => {
    const tagStyle = {
        //cor do background do botao por cada tag
        HTML: {backgroundColor: "#fda821"},
        React: {backgroundColor: "#15d4c8"},
        Python: {backgroundColor: "#ffc12c"},
        default: {backgroundColor: "#f9f9f9"},
    };
    return (
        <button type="button" 
        className="tag"
        style={selected ? tagStyle[tagName] :  tagStyle.default} 
        onClick={() => {selectTag(tagName)}}>
        {tagName}
        </button>
    )
}

export default Tag;