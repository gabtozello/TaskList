import React from "react";
import "./Tag.css";


/**
 * Componente de botão de Tag para seleção e deseleção.
 * 
 * Props:
 * - tagName: string com o nome da tag.
 * - selectTag: função que alterna a seleção da tag.
 * - selected: booleano que define se a tag está selecionada.
 */

const Tag = ({tagName,selectTag, selected}) => {
    const tagStyle = {
        //cor do background do botao por cada tag
        Importante: {backgroundColor: "#ffd900ff"},
        Prioridade: {backgroundColor: "#fda708ff"},
        Urgente: {backgroundColor: "#f03131ff"},
        default: {backgroundColor: "#f9f9f9"},
    };

    const currentStyle = tagStyle[tagName] || tagStyle.default;

    return (
        <button type="button" 
            className="tag"
            style={selected ? currentStyle :  tagStyle.default} 
            onClick={() => {selectTag(tagName)}}>
            {tagName}
        </button>
    );
};

export default Tag;