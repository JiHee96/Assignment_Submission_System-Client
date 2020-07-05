import React, { useEffect, useState, useRef, memo } from "react";
import { observer, inject } from "mobx-react";

import Input from "@components/Input";
import Button from "@components/Button";
import Textarea from "@components/Textarea";
import Example from "@components/Example";
import Language from "@components/Language";

import CodeHighlighter from "@components/CodeHighlighter";

import * as Util from "@util";
import "./style.scss";

const CodeEditorLayout = (props) => {
    const { storeMain, storeTask, storeLecture } = props;

    const [info, setInfo] = useState({
        title: "",
        content: "",
        language: "c",
        example: [],
        expire: "",
        extendType: false,
        extend: "",
    });

    useEffect(() => {
        if (props.id) {
            Util.requestServer("task/detail", "GET", {
                taskIdx: props.id,
            }).then(function (resp) {
                let body = resp.body;

                if (resp.code === 200) {
                    setInfo({
                        ...info,
                        title: body.info.title,
                        content: body.info.content,
                        language: body.info.language,
                        example: body.info.example,
                    });
                }
            });
        }
    }, []);

    const handleTitleChange = (e) => {
        setInfo({
            ...info,
            title: e.target.value,
        });
    };

    const handleLanguageChange = (e) => {
        setInfo({
            ...info,
            language: e.target.value,
        });
    };

    const handleContentChange = (e) => {
        setInfo({
            ...info,
            content: e.target.value,
        });
    };

    const handleExpireChange = (e) => {
        console.log(e.target.value);
        setInfo({
            ...info,
            expire: e.target.value,
        });
    };

    const handleExtendTypeChange = (e) => {
        setInfo({
            ...info,
            extendType: !info.extendType,
        });
    };

    const handleExtendChange = (e) => {
        setInfo({
            ...info,
            extend: e.target.value,
        });
    };

    const resize = (event) => {
        let target = event.target;
        target.style.height = "1px";
        target.style.height = target.scrollHeight + "px";
    };

    const btnClick = (event) => {
        console.log("추가");

        setInfo({
            ...info,
            example: info.example.concat({
                input: "",
                output: "",
            }),
        });
    };

    const inputChange = (idx, value) => {
        setInfo({
            ...info,
            example: info.example.map((item, i) => {
                return i == idx
                    ? {
                          ...item,
                          input: value,
                      }
                    : item;
            }),
        });
        /*
        setExampleList(
            exampleList.map((item, i) => {
                return i == idx
                    ? {
                          ...item,
                          input: value,
                      }
                    : item;
            })
        );*/
    };

    const outputChange = (idx, value) => {
        setInfo({
            ...info,
            example: info.example.map((item, i) => {
                return i == idx
                    ? {
                          ...item,
                          output: value,
                      }
                    : item;
            }),
        });
    };

    const createBtn = (e) => {
        if (info.language === "none") {
            alert("언어를 선택해주세요.");
            return;
        }

        if (props.id) {
            Util.requestServer("task/edit", "POST", {
                courseIdx: storeLecture.selectLecture.courseIdx,
                title: info.title,
                content: info.content,
                language: info.language,
                exampleList: info.example,
                expireDate: info.expire,
                extendType: info.extendType,
                extendDate: info.extend,
            }).then(function (result) {
                console.log(result);
                if (result.code == 200) {
                    alert(result.body.msg);
                } else {
                    alert(result.body.msg);
                }
            });
        } else {
            Util.requestServer("task/create", "POST", {
                courseIdx: storeLecture.selectLecture.courseIdx,
                title: info.title,
                content: info.content,
                language: info.language,
                exampleList: info.example,
                expireDate: info.expire,
                extendType: info.extendType,
                extendDate: info.extend,
            }).then(function (result) {
                console.log(result);
                if (result.code == 200) {
                    alert(result.body.msg);
                    props.history.replace("/" + props.match.params.courseIdx);
                    storeMain.setMenu('assignmentList');
                } else {
                    alert(result.body.msg);
                }
            });
        }
    };

    let exampleListElem = info.example.map((item, i) => {
        return (
            <Example
                key={i}
                idx={i}
                inputChange={inputChange}
                outputChange={outputChange}
                input={item.input}
                output={item.output}
            ></Example>
        );
    });

    return (
        <div className="CodeEditorLayout">
            <div className="explain">
                <div className="title">
                    <select
                        name="language"
                        value={info.language}
                        onChange={handleLanguageChange}
                        className="language"
                    >
                        <option value="c">C</option>
                        <option value="java">JAVA</option>
                        <option value="python">Python</option>
                        <option value="html">HTML</option>
                    </select>

                    <Textarea
                        padding="5px 0px 0px 5px"
                        value={info.title}
                        height="35px"
                        onChange={handleTitleChange}
                        onKeyUp={resize}
                        onKeyDown={resize}
                        placeholder="과제 명을 입력하세요."
                        margin="0px 0px 5px 0px"
                    ></Textarea>
                </div>
                <div className="middle">
                    <Textarea
                        padding="5px 0px 0px 5px"
                        value={info.content}
                        height="35px"
                        onChange={handleContentChange}
                        onKeyUp={resize}
                        onKeyDown={resize}
                        placeholder="과제 설명을 입력하세요."
                        margin="0px"
                    ></Textarea>
                    <hr />
                    <div id="bottom" className="bottom">
                        <Button
                            onClick={btnClick}
                            width="75px"
                            height="35px"
                            margin="0px 0px 10px 0px"
                            value="예시 추가"
                        ></Button>
                        {exampleListElem}
                    </div>
                    <hr />
                    <div className="date">
                        <div className="wrap">
                            <p className="item_title">제출 기한 설정</p>
                            <Input
                                type="date"
                                value={info.expire}
                                onChange={handleExpireChange}
                                className="expire"
                                placeholder="마감 날짜"
                                height="small"
                            ></Input>
                        </div>
                        <div className="wrap">
                            <p className="item_title">연장 기한 설정</p>
                            <div className="extend">
                                <label
                                    htmlFor="extendType"
                                    className="typeLabel"
                                >
                                    <input
                                        type="checkbox"
                                        checked={info.extendType}
                                        onChange={handleExtendTypeChange}
                                        id="extendType"
                                        className="extendType"
                                    />
                                    연장 여부
                                </label>
                                <Input
                                    type="date"
                                    value={info.extend}
                                    onChange={handleExtendChange}
                                    className="extendDate"
                                    placeholder="연장 날짜"
                                    height="small"
                                    width="70%"
                                ></Input>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="code">
                <p className="testTitle">코드 테스트</p>
                <div className="editor">
                    <CodeHighlighter></CodeHighlighter>
                </div>
                <div className="result">
                    <div className="buttons">
                        <Button
                            width="75px"
                            height="35px"
                            value="실행"
                            color="green"
                            margin="0px 10px 0px 0px"
                        ></Button>
                        <Button
                            width="75px"
                            height="35px"
                            value="생성"
                            onClick={createBtn}
                        ></Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default inject("storeMain", "storeTask", "storeLecture")(observer(CodeEditorLayout));
