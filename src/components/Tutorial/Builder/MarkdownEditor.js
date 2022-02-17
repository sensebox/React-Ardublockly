import React, { Component, useRef } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import {
    tutorialTitle,
    jsonString,
    changeContent,
    setError,
    deleteError,
} from "../../../actions/tutorialBuilderActions";

import FormControl from "@material-ui/core/FormControl";
import Button from "@material-ui/core/Button";
import MarkdownIt from "markdown-it";
import Editor from "react-markdown-editor-lite";
import "react-markdown-editor-lite/lib/index.css";

import axios from "axios";

const mdParser = new MarkdownIt(/* Markdown-it options */);

const MarkdownEditor = (props) => {
    const [value, setValue] = React.useState(props.value);

    const mdEditor = React.useRef(null);

    function handleChange({ html, text }) {
        setValue(text);
        var value = text;
        console.log(text);
        props.changeContent(value, props.index, props.property, props.property2);
        if (value.replace(/\s/g, "") === "") {
            props.setError(props.index, props.property);
        } else {
            props.deleteError(props.index, props.property);
        }
    }

    async function uploadImage(files) {
        return new Promise((resolve, reject) => {
            const formData = new FormData();
            formData.append("files", files);
            axios({
                method: "post",
                url: `${process.env.REACT_APP_BLOCKLY_API}/upload/uploadImage`,
                data: formData,
                headers: { "Content-Type": "multipart/form-data" },
            })
                .then((res) => {
                    console.log(res);
                    resolve(`${process.env.REACT_APP_BLOCKLY_API}/upload/`+res.data.filename);
                })
                .catch((err) => {
                    reject(new Error("error"));
                })
        })
    }

    return (
        <FormControl variant="outlined" fullWidth style={{ marginBottom: "10px" }}>
            <Editor
                ref={mdEditor}
                style={{ height: "500px" }}
                renderHTML={(text) => mdParser.render(text)}
                onChange={handleChange}
                value={value}
                id={props.property}
                label={props.label}
                property={props.property}
                onImageUpload={uploadImage}
                plugins={[]}
            />
        </FormControl>
    );
};

export default connect(null, {
    tutorialTitle,
    jsonString,
    changeContent,
    setError,
    deleteError,
})(MarkdownEditor);