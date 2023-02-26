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
    const [option, setOption] = useState(data);
    const { handleDeleteOption, handleUpdateOption } = GetQuizHandlerContext();

    useEffect(() => {
        handleUpdateOption(questionKey, option);
    }, [option]);
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
        setOption((oldOption) => {
            const newOption = structuredClone(oldOption);
            newOption.text = value;
            return newOption;
        });
    };
    const checkboxOnChange = (event) => {
        const {
            target: { checked },
        } = event;
        setOption((oldOption) => {
            const newOption = structuredClone(oldOption);
            newOption.isCorrect = checked;
            return newOption;
        });
    };
    return (
        <div>
            <Input
                placeholder="option"
                allowClear={true}
                value={option.text}
                addonBefore={
                    <Tooltip placement="top" title={checkboxToolTipText}>
                        <Checkbox
                            onChange={checkboxOnChange}
                            checked={option.isCorrect}
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
                                handleDeleteOption(questionKey, option._id);
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
