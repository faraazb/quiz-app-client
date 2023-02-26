import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Statistic, Table, Tabs, Typography, message } from "antd";
import {
    BarChartOutlined,
    CrownOutlined,
    UnorderedListOutlined,
} from "@ant-design/icons";
import "./index.css";
import { getSubmissions } from "../../api";


const { Title, Paragraph } = Typography;

const SubmissionsSummary = ({ data }) => {
    return (
        <div className="submissions-summary">
            {data && (
                <div className="submissions-statistics">
                    <Statistic
                        title={
                            <span>
                                <CrownOutlined /> Highest Score
                            </span>
                        }
                        value={data.statistics.highestScore}
                        precision={2}
                    />
                    <Statistic
                        title={<span>Average Score</span>}
                        value={data.statistics.averageScore}
                        precision={2}
                    />
                </div>
            )}
        </div>
    );
};

const SubmissionsTable = ({ data, columns, loading }) => {

    return (
        <div className="submissions-list">
            <Table
                dataSource={data}
                columns={columns}
                rowKey={(record) => record.user._id}
                loading={loading}
                pagination={false}
                scroll={{
                    y: 450,
                }}
            />
        </div>
    );
};

const SubmissionsPage = () => {
    const { quizId } = useParams();
    const [messageApi, contextHolder] = message.useMessage();
    const [loading, setLoading] = useState(true);
    const [quiz, setQuiz] = useState();
    const [submissions, setSubmissions] = useState([]);
    const [report, setReport] = useState();

    const columns = [
        {
            title: "User",
            dataIndex: ["user", "username"],
            key: "username",
        },
        {
            title: (quiz && `Score (Out of ${quiz.totalPoints})`) || "Score",
            dataIndex: "score",
            key: "score",
            sorter: (a, b) => a.score - b.score,
        },
        {
            title: "Correctly Answered",
            dataIndex: "correctlyAnsweredCount",
            key: "correctlyAnsweredCount",
            sorter: (a, b) => a.correctlyAnsweredCount - b.correctlyAnsweredCount,
        },
    ];

    useEffect(() => {
        (async function () {
            try {
                const data = await getSubmissions(quizId);
                setQuiz(data.quiz)
                setSubmissions(data.submissions);
                setReport(data.report);
            } catch (err) {
                messageApi.open({
                    type: "error",
                    content: "Failed to fetch submissions!",
                });
            } finally {
                setLoading(false);
            }
        })();
    }, [quizId]);

    return (
        <section id="quiz-submissions">
            {contextHolder}
            <div className="page">
                <div>
                    {quiz && (
                        <div>
                            <Title level={2}>{quiz.title}</Title>
                            <Paragraph>{quiz.description}</Paragraph>
                        </div>
                    )}
                    <Tabs
                        defaultActiveKey="1"
                        items={[
                            {
                                label: (
                                    <span>
                                        <UnorderedListOutlined /> Submissions (
                                        {submissions.length})
                                    </span>
                                ),
                                key: "1",
                                children: (
                                    <SubmissionsTable
                                        data={submissions}
                                        columns={columns}
                                        loading={loading}
                                    />
                                ),
                            },
                            {
                                label: (
                                    <span>
                                        <BarChartOutlined /> Summary
                                    </span>
                                ),
                                key: "2",
                                children: <SubmissionsSummary data={report} />,
                            },
                        ]}
                    />
                </div>
            </div>
        </section>
    );
};

export default SubmissionsPage;
