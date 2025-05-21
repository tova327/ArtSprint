import React, { useState } from "react";
import { Modal, Form, Input, DatePicker, Button, Select, Spin, Tooltip } from "antd";
import { EyeInvisibleOutlined, EyeTwoTone, InfoCircleOutlined } from "@ant-design/icons";
import { ESubject } from "../store/paintingSlice";
import { getTest, checkAnswers } from "../store/axioscalls";

const RegisterModal = ({
  open,
  onCancel,
  onRegister,
  loading,
}: {
  open: boolean,
  onCancel: () => void,
  onRegister: (userDetails: any) => Promise<void>,
  loading: boolean,
}) => {
  const [step, setStep] = useState(1);
  const [detailsForm] = Form.useForm();
  const [registerDetails, setRegisterDetails] = useState<any>(null);
  const [subject, setSubject] = useState<string >("");
  const [questions, setQuestions] = useState<string[]>([]);
  const [, setAnswers] = useState<string[]>([]);
  const [questionLoading, setQuestionLoading] = useState(false);
  const [checkingAnswers, setCheckingAnswers] = useState(false);

  const handleStep1 = (values: any) => {
    setRegisterDetails(values);
    setStep(2);
  };

  const handleStep2 = async (values: any) => {
    setSubject(values.subject);
    setQuestionLoading(true);
    try {
      const qs = await getTest(values.subject);
      setQuestions(qs);
      setStep(3);
    } finally {
      setQuestionLoading(false);
    }
  };

  const handleStep3 = async (values: any) => {
    const userAnswers = questions.map((_, i) => values[`answer_${i}`]);
    setAnswers(userAnswers);
    setCheckingAnswers(true);
    try {
      const result = await checkAnswers({ subject, questions, answers: userAnswers });
      if (result === "yes") {
        await onRegister({ ...registerDetails, subject, answers: userAnswers });
      } else {
        Modal.error({ title: "Not Accepted", content: "Sorry, your answers did not meet our requirements." });
        onCancel();
      }
    } finally {
      setCheckingAnswers(false);
    }
  };

  let content: React.ReactNode;
  if (step === 1) {
    content = (
      <Form
        form={detailsForm}
        layout="vertical"
        onFinish={handleStep1}
        initialValues={{}}
      >
        <Form.Item name="name" label="Full Name" rules={[{ required: true, message: 'Please input your name!' }]} hasFeedback>
          <Input placeholder="Your full name" />
        </Form.Item>
        <Form.Item name="email" label="Email" rules={[
          { required: true, message: 'Please input your email!' },
          { type: 'email', message: 'Please enter a valid email!' }
        ]} hasFeedback>
          <Input placeholder="Email" />
        </Form.Item>
        <Form.Item name="password" label="Password" rules={[{ required: true, message: 'Please input your password!' }]} hasFeedback>
          <Input.Password placeholder="Password" iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)} />
        </Form.Item>
        <Form.Item name="birthDate" label={<span>Birth Date&nbsp;<Tooltip title="You must be at least 13 years old to join."><InfoCircleOutlined /></Tooltip></span>} rules={[{ required: true, message: 'Please select your birth date!' }]} hasFeedback>
          <DatePicker placeholder="Birth Date" style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item name="subject" label="Area of Expertise" rules={[{ required: true, message: "Please choose your subject!" }]}>
          <Select placeholder="Choose your expert subject">
            {ESubject.map((subj, idx) => (
              <Select.Option key={idx} value={subj}>{subj}</Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Next
          </Button>
        </Form.Item>
      </Form>
    );
  } else if (step === 2) {
    content = (
      <Form layout="vertical" onFinish={handleStep2}>
        <Form.Item name="subject" label="Area of Expertise" rules={[{ required: true, message: "Please choose your subject!" }]} initialValue={registerDetails?.subject}>
          <Select placeholder="Choose your expert subject">
            {ESubject.map((subj, idx) => (
              <Select.Option key={idx} value={subj}>{subj}</Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" block loading={questionLoading}>
            {questionLoading ? "Getting Questions..." : "Next"}
          </Button>
        </Form.Item>
      </Form>
    );
  } else if (step === 3) {
    content = (
      <Form layout="vertical" onFinish={handleStep3}>
        {questions.map((q, i) => (
          <Form.Item
            key={i}
            name={`answer_${i}`}
            label={`Q${i + 1}: ${q}`}
            rules={[{ required: true, message: "Please provide an answer!" }]}
          >
            <Input.TextArea autoSize={{ minRows: 2, maxRows: 4 }} />
          </Form.Item>
        ))}
        <Form.Item>
          <Button type="primary" htmlType="submit" block loading={checkingAnswers || loading}>
            {(checkingAnswers || loading) ? "Checking..." : "Submit & Register"}
          </Button>
        </Form.Item>
      </Form>
    );
  }

  return (
    <Modal
      title="Sign Up"
      open={open}
      onCancel={onCancel}
      footer={null}
      destroyOnClose
      centered
    >
      <Spin spinning={loading}>{content}</Spin>
    </Modal>
  );
};

export default RegisterModal;