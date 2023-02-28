import React, { useEffect, useState } from "react";
import { Button, Result, Typography, message, Modal } from "antd";
import { useParams, Link } from "react-router-dom";
import { getSubmissionsByIdApi } from "../../api";
const { Paragraph } = Typography;

const ResultPage = () => {
    const [submission, setSubmission] = useState(null);
    const { submissionId } = useParams();
    const [messageApi, contextHolder] = message.useMessage();
    const getSubmission = async () => {
        try {
            const submission = await getSubmissionsByIdApi(submissionId);
            setSubmission(submission.data);
            // console.log(submission.data.data);
        } catch (err) {
            Modal.error({
                title: "Failed to get result!",
            });
        }
    };
    useEffect(() => {
        getSubmission();
    }, [submissionId]);
    return (
        <>
            {contextHolder}
            <Result
                status="success"
                title="Your Response is Submitted Successfully!"
                extra={[
                    <Paragraph key="score">
                        Your Score:{" "}
                        {submission !== null && submission.data.score}
                    </Paragraph>,
                    <Paragraph key="correctAnswers">
                        Number of Correct Answers:{" "}
                        {submission !== null &&
                            submission.data.correctlyAnsweredCount}
                    </Paragraph>,
                    <Link key="button" to={"/"}>
                        <Button type="primary" key="back">
                            Back to Home
                        </Button>
                    </Link>,
                ]}
            />
        </>
    );
};

export default ResultPage;
