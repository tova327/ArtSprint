import React, { useState } from "react";
import AppModal from "../common/AppModal";

import AppForm from "../common/AppForm";
import AppInput from "../common/AppInput";

import AppFormItem from "../common/AppFormItem";
import AppButton from "../common/AppButton";
import { checkAnswers, getTest } from "../../store/axioscalls";
import { AppCheckbox } from "../common/AppCheckbox";
import { AppAlert } from "../common/AppAlert";



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
    const [alert, setAlert] = useState<{ type: 'success' | 'error' | 'warning'; message: string; isVisible?: boolean }>({ type: 'success', message: '', isVisible: false });
  const handleOpenAlert = (type: 'success' | 'error' | 'warning', message: string) => {
    setAlert(prev => ({ ...prev, type, message, isVisible: true }));
    setTimeout(() => {
      setAlert(prev => ({ ...prev, isVisible: false }));
    }, 2000);
  };
    
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
                    

                    setQuestions(q.map((question, index) => ({ id: index.toString(), question })));
                } catch (e) {
                    console.log("Error fetching questions", e);
                    setQuestions([]);
                    handleOpenAlert('error', "Sorry, failed to fetch questions");
                }

            }

            if (step === 2) {
                const values = form.getFieldsValue();
                try {
                    const isValid = await checkAnswers(values.answers || {});
                    if (!isValid) return;
                    handleOpenAlert('success', "You passed the test, let's move on!");
                } catch (e) {
                    console.log("Error checking answers", e);
                    handleOpenAlert('error', "Sorry, failed to check answers");
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

    return (<> <AppAlert type={alert.type} message={alert.message} isVisible={alert.isVisible} />
        <AppModal
            title="Let's get you started!"
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


