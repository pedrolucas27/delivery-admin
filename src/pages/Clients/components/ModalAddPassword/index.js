import React from "react";
import {
    Button,
    Row,
    Col,
    Modal,
    Input,
    Form
} from 'antd';
import 'antd/dist/antd.css';
import '../../../../global.css';

function ModalAddPassword(props) {
    const [form] = Form.useForm();

    const addNewPassword = () => {
        let newPassword = form.getFieldValue("new_password");
        let newPasswordConfirm = form.getFieldValue("confirm_new_password");
        props.savePassword({ newPassword, newPasswordConfirm });
    }

    return (
        <Modal
            title="Cadastrar nova senha"
            visible={props.isVisibleNewPassword}
            onCancel={() => {
                form.resetFields();
                props.onCancelNewPassword();
            }}
            footer={[
                <Button
                    shape="round"
                    className="button-cancel"
                    onClick={() => {
                        form.resetFields();
                        props.onCancelNewPassword();
                    }}
                    key={0}
                >
                    Cancelar
                </Button>,
                <Button
                    shape="round"
                    className="button"
                    onClick={() => form.submit()}
                    key={1}
                >
                    Salvar
                </Button>
            ]}
        >
            <Form layout="vertical" form={form} onFinish={addNewPassword}>
                <Row>
                    <Col span={24}>
                        <Form.Item
                            name="new_password" label="Nova senha" rules={[
                                {
                                    required: true,
                                    message: "Informe a nova senha."
                                }
                            ]}>
                            <Input
                                className="input-radius"
                                type="password"
                            />
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item name="confirm_new_password" label="Confirmar nova senha" rules={[
                            {
                                required: true,
                                message: "Confirme a nova senha."
                            }
                        ]}>
                            <Input
                                className="input-radius"
                                type="password"
                            />
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Modal>
    );
}
export default ModalAddPassword;