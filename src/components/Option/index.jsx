import { useState } from "react";
import { Button, Checkbox, Tooltip } from "antd";
import Input from "antd/es/input/Input";
import { MinusOutlined } from "@ant-design/icons";
import ErrorMessage from "../ErrorMessage";
import { GetQuizHandlerContext } from "../../contexts/CreateQuizContexts";
import "./index.css";

const toolTipText = <span>Is it a answer?</span>;

const Option = (props) => {
    const { data, questionKey } = props;

    const [errorMessage, setErrorMessage] = useState("");
    const [optionStatus, setOptionStatus] = useState("");
    const [option, setOption] = useState(data);
    const { handleDeleteOption } = GetQuizHandlerContext();

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
    };
    return (
        <div>
            <Input
                placeholder="option"
                allowClear={true}
                value={option.text}
                addonBefore={
                    <Tooltip placement="top" title={toolTipText}>
                        <Checkbox />
                    </Tooltip>
                }
                status={optionStatus}
                onChange={optionOnChangeHandler}
                onBlur={optionOnChangeHandler}
                autoFocus
                addonAfter={
                    <Button
                        type="primary"
                        size="small"
                        icon={<MinusOutlined />}
                        autoFocus
                        onClick={(event) => {
                            handleDeleteOption(questionKey, option.id);
                        }}
                    />
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
