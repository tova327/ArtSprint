import React from 'react';
import { Modal, Space } from 'antd';
import Title from './AppTitle';
import Button from './AppButton';
import { themeToken } from '../../theme/token';
import { spacing } from '../../theme/constant';
import { AppParagraph } from './AppText';

export interface Action {
    label: string;
    onClick: () => void;
}

interface ModalWrapperProps {
    title: string;
    description?: string | null;
    actions: Action[];
    visible: boolean;
    onClose: () => void;
}

const ModalWrapper: React.FC<ModalWrapperProps> = ({ title, description, actions, visible, onClose }) => {
    return (

        <Modal
            title={<Title level={4} style={{ margin: 0 }}>{title}</Title>}
            open={visible}
            onCancel={onClose}
            footer={null}
            bodyStyle={{
                padding: spacing.md,
                fontFamily: themeToken?.token?.fontFamily,
            }}
        >
            {description && (
                <AppParagraph>
                    {description}
                </AppParagraph>
            )}
            <Space style={{ display: 'flex', justifyContent: 'flex-end', marginTop: spacing.md }}>
                {actions.map((action, index) => (
                    <Button
                        key={index}
                        type={index === 0 ? 'primary' : 'default'}
                        onClick={action.onClick}
                        style={{
                            borderRadius: themeToken.components?.Button?.borderRadius,
                            height: themeToken.components?.Button?.controlHeight,
                            fontWeight: themeToken.components?.Button?.fontWeight,
                        }}
                    >
                        {action.label}
                    </Button>
                ))}
            </Space>
        </Modal>
    );
};

export default ModalWrapper;