import React, { useState } from "react";
import AppModal from "../common/AppModal";

import AppForm from "../common/AppForm";
import AppInput from "../common/AppInput";
import { AppCheckbox } from "../common/AppCheckBox";
import AppFormItem from "../common/AppFormItem";
import AppButton from "../common/AppButton";
import { checkAnswers, getTest } from "../../store/axioscalls";
import notification from "antd/es/notification";



type Question = {
    id: string;
    question: string;
};

interface RegisterModalProps {
    visible: boolean;
    onClose: () => void;
    loading: boolean;
    onRegister: (values: any) => void;
}

export const RegisterModal: React.FC<RegisterModalProps> = ({

    visible,
    onClose,
    loading,
    onRegister,
}) => {
    const [step, setStep] = useState(1);
    const [form] = AppForm.useForm();
    const [questions, setQuestions] = useState<Question[]>([]);

    const [api, _] = notification.useNotification();
    const handleMassage = (type: 'success' | 'error' | 'warning', message: string, description: string) => {
        api[type]({
            message: message,
            description: description,
        });
    }
    const validateAge = (_: any, value: string) => {
        if (!value) return Promise.reject("Required");

        const birth = new Date(value);
        const today = new Date();
        const age =
            today.getFullYear() - birth.getFullYear() -
            (today < new Date(today.getFullYear(), birth.getMonth(), birth.getDate())
                ? 1
                : 0);

        if (age < 18) {
            return Promise.reject("Must be 18+");
        }

        return Promise.resolve();
    };

    const nextStep = async () => {
        try {
            if (step === 1) {
                await form.validateFields(["name", "email", "password", "birthDate"]);
                try {
                    const q = await getTest();
                    if (!q || q.length === 0) {
                        handleMassage("error", "Error", "Sorry,something went wrong");
                        return;
                    }
                    setQuestions(q);
                } catch (e) {
                    console.log("Error fetching questions", e);
                    setQuestions([]);
                    handleMassage("error", "Error", "Sorry, failed to fetch questions");
                }

            }

            if (step === 2) {
                const values = form.getFieldsValue();
                try {
                    const isValid = await checkAnswers(values.answers || {});
                    if (!isValid) return;
                    handleMassage("success", "Great!", "You passed the test, let's move on!");
                } catch (e) {
                    console.log("Error checking answers", e);
                    handleMassage("error", "Error", "Sorry, failed to check answers");
                    return;
                }
                
            }

            setStep((prev) => prev + 1);
        } catch (e) { }
    };

    const onSubmit = async (values: any) => {
        console.log("FINAL SUBMIT", values);
        await onRegister(values);
        onClose();
    };

    return (<>
        <AppModal
            title="Register"
            description={<AppForm form={form} onFinish={(values) => onSubmit(values)}>
                {step === 1 && (
                    <>
                        <AppFormItem name="name" label="Name" rules={[{ required: true }]}>
                            <AppInput placeholder="Name" />
                        </AppFormItem>

                        <AppFormItem name="email" label="Email" rules={[{ required: true, type: "email" }]}>
                            <AppInput placeholder="Email" />
                        </AppFormItem>

                        <AppFormItem name="password" label="Password" rules={[{ required: true }]}>
                            <AppInput type="password" placeholder="Password" />
                        </AppFormItem>

                        <AppFormItem
                            name="birthDate" label="Birth Date"
                            rules={[{ validator: validateAge }]}
                        >
                            <AppInput type="date" />
                        </AppFormItem>
                    </>
                )}

                {step === 2 && (
                    <>
                        {questions.map((q) => (
                            <AppFormItem
                                key={q.id}
                                name={["answers", q.id]}
                                label={q.question}
                                rules={[{ required: true }]}
                            >
                                <AppInput />
                            </AppFormItem>
                        ))}
                    </>
                )}

                {step === 3 && (
                    <>
                        <AppFormItem
                            name="agree"
                            valuePropName="checked"
                            rules={[
                                {
                                    validator: (_, value: any) =>
                                        value
                                            ? Promise.resolve()
                                            : Promise.reject("Required"),
                                },
                            ]}
                        >
                            <AppCheckbox>Agree to terms</AppCheckbox>
                        </AppFormItem>
                    </>
                )}

                <div style={{ display: "flex", gap: 8 }}>
                    {step > 1 && (
                        <AppButton onClick={() => setStep((s) => s - 1)}>
                            Back
                        </AppButton>
                    )}

                    {step < 3 && (
                        <AppButton type="primary" onClick={nextStep} loading={loading}>
                            Next
                        </AppButton>
                    )}

                    {step === 3 && (
                        <AppButton type="primary" htmlType="submit">
                            Join Us
                        </AppButton>
                    )}
                </div>
            </AppForm>}
            visible={visible}
            onClose={onClose}
            actions={[]}
        />

    </>
    );
};