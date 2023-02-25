import { Button, Col, Progress, Row } from "antd";
import { useState } from "react";
import "./index.css";
const NavigationPane = (props) => {
    const [progress, setProgress] = useState(5);
    const getPercentage = (current, total) => {
        return (current / total) * 100;
    };
    const count = 50;
    const getNavButtons = (count) => {
        const buttonsArray = [];
        for (let i = 1; i <= count; i++) {
            buttonsArray.push(
                <Col>
                    <Button>{i}</Button>
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
                        percent={getPercentage(progress, 10)}
                        showInfo={false}
                        status="active"
                        strokeColor={{ from: "#108ee9", to: "#87d068" }}
                    />
                </div>
                <div className="progress-stats-container">
                    <div className="title">Progress</div>
                    <div className="green">7 attempted</div>
                    <div className="gray">2 unattempted</div>
                    <div className="yellow">1 skipped</div>
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
