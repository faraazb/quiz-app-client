import { Button, Col, Progress, Row } from "antd";
import { useState } from "react";
import "./index.css";
import {
    TakeQuizContext,
    TakeQuizHandlerContext,
} from "../../contexts/TakeQuizContext";
const NavigationPane = () => {
    const { quiz } = TakeQuizContext();
    const { started, questionIds, currentQuestion, questionsStatus } = quiz;
    const { navigateQuestion, getQuestionStatusCount } =
        TakeQuizHandlerContext();
    const { attempted, unattempted, skipped } = getQuestionStatusCount();
    const getPercentage = (current, total) => {
        return (current / total) * 100;
    };
    const count = 50;
    const getNavButtons = (count) => {
        const buttonsArray = [];
        for (let i = 0; i < questionIds.length; i++) {
            let buttonColor = "gray-bg";
            if (i === currentQuestion) {
                buttonColor = "blue-bg";
            } else if (questionsStatus[questionIds[i]] === "skipped") {
                buttonColor = "yellow-bg";
            } else if (questionsStatus[questionIds[i]] === "attempted") {
                buttonColor = "green-bg";
            }
            buttonsArray.push(
                <Col key={questionIds[i]}>
                    <Button
                        className={buttonColor}
                        onClick={() => navigateQuestion(i)}
                    >
                        {i + 1}
                    </Button>
                </Col>
            );
        }
        return buttonsArray;
    };
    return (
        <div className="navigation-container">
            <div className="progress">
                <div className="progress-bar-container">
                    <Progress
                        strokeLinecap="butt"
                        percent={getPercentage(
                            attempted,
                            attempted + skipped + unattempted
                        )}
                        showInfo={false}
                        status="active"
                        strokeColor={{ from: "#108ee9", to: "#87d068" }}
                    />
                </div>
                <div className="progress-stats-container">
                    <div className="title">
                        Progress ( {attempted}/{questionIds.length})
                    </div>
                    <div className="sub-text green">{attempted} attempted</div>
                    <div className="sub-text gray">
                        {unattempted} unattempted
                    </div>
                    <div className="sub-text yellow">{skipped} skipped</div>
                </div>
            </div>
            <div className="navigation">
                <Row justify="space-evenly" gutter={[16, 16]}>
                    {getNavButtons(count)}
                </Row>
            </div>
            <div className="bottom-bar">
                <button>Submit</button>
            </div>
        </div>
    );
};

export default NavigationPane;
