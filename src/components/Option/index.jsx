import { useEffect, useState } from "react";
import { Button, Checkbox, Tooltip } from "antd";
import Input from "antd/es/input/Input";
import { MinusOutlined } from "@ant-design/icons";
import ErrorMessage from "../ErrorMessage";
import { GetQuizHandlerContext } from "../../contexts/CreateQuizContexts";
import "./index.css";

const checkboxToolTipText = <span>Is it a answer?</span>;
const removeToolTipText = <span>Remove option</span>;

const Option = (props) => {
    const { data, questionKey } = props;

    const [errorMessage, setErrorMessage] = useState("");
    const [optionStatus, setOptionStatus] = useState("");
    const { handleDeleteOption, handleUpdateOption } = GetQuizHandlerContext();

    const optionOnChangeHandler = (event) => {
        const {
            target: { value },
        } = event;
        if (value.length < 1) {
            setOptionStatus("error");
            setErrorMessage("Empty option not allowed");
        } else {
            setOptionStatus("");
            setErrorMessage("");
        }
        handleUpdateOption(questionKey, { _id: data._id, text: value });
    };
    const checkboxOnChange = (event) => {
        const {
            target: { checked },
        } = event;
        handleUpdateOption(questionKey, { _id: data._id, isCorrect: checked });
    };
    return (
        <div>
            <Input
                placeholder="option"
                allowClear={true}
                value={data.text}
                addonBefore={
                    <Tooltip placement="top" title={checkboxToolTipText}>
                        <Checkbox
                            onChange={checkboxOnChange}
                            checked={data.isCorrect}
                        />
                    </Tooltip>
                }
                status={optionStatus}
                onChange={optionOnChangeHandler}
                onBlur={optionOnChangeHandler}
                addonAfter={
                    <Tooltip placement="top" title={removeToolTipText}>
                        <Button
                            type="primary"
                            size="small"
                            icon={<MinusOutlined />}
                            onClick={(event) => {
                                handleDeleteOption(questionKey, data._id);
                            }}
                        />
                    </Tooltip>
                }
            />
            <div>
                <ErrorMessage
                    className="errorMessage"
                    errorMessage={errorMessage}
                />
            </div>
        </div>
    );
};

export default Option;
