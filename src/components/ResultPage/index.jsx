import axios from "axios";
import React, { useEffect, useState } from "react";
import { Button, Result, Typography  } from 'antd';
import { useParams, Link } from 'react-router-dom';
const { Paragraph } = Typography;

const ResultPage = () => {
  const [submission, setSubmission] = useState(null);
  const { submissionId } = useParams();
  const getSubmission = async () => {
    try{
      const submission = await axios.get(`http://localhost:5000/submissions/{submissionId}`);
      setSubmission(submission);
      // console.log(submission.data.data);
    }
    catch(err)  {
      console.log(err);
    }
  };
  useEffect(() => {
    getSubmission();
  }, [submissionId]);
  return  (
    <>
      <Result
        status="success"
        title="Your Response is Submitted Successfully!"
        extra={[
          <Paragraph key="score">Your Score: {submission !== null && submission.data.data[0].score}</Paragraph>,
          <Paragraph key="correctAnswers">Number of Correct Answers: {submission !== null && submission.data.data[0].correctlyAnsweredCount}</Paragraph>,
          <Link to={"/"}>
            <Button type="primary" key="back">Back to Home</Button>
          </Link>,
        ]}
      />
    </>
  )
};

export default ResultPage;