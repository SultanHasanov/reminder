import React, { useState } from 'react';
import axios from 'axios';
import { Input, Button, Typography, message, Space, Card } from 'antd';
import 'antd/dist/reset.css';

const { Title, Text } = Typography;

const BASE_URL = 'https://gatewayapi.telegram.org/';
const TOKEN = 'AAHkCAAAQYk2l3sh4ky7v-sTrqZ3MRw5RpCoz9BKM_aLsg';
const HEADERS = {
  Authorization: `Bearer ${TOKEN}`,
  'Content-Type': 'application/json',
};

const App = () => {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f0f2f5' }}>
      <Auth />
    </div>
  );
};

const Auth = () => {
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [requestId, setRequestId] = useState(null);
  const [authSuccess, setAuthSuccess] = useState(false); // Флаг успешной авторизации

  const sendCode = async () => {
    try {
      const response = await axios.post(
        `${BASE_URL}sendVerificationMessage`,
        {
          phone_number: phone,
          code_length: 6,
          ttl: 60,
          payload: 'auth_request',
        },
        { headers: HEADERS }
      );
      if (response.data.ok) {
        setRequestId(response.data.result.request_id);
        message.success('Код отправлен, проверьте Telegram.');
      } else {
        message.error(`Ошибка: ${response.data.error}`);
      }
    } catch (error) {
      message.error(`Ошибка: ${error.message}`);
    }
  };

  const verifyCode = async () => {
    try {
      const response = await axios.post(
        `${BASE_URL}checkVerificationStatus`,
        {
          request_id: requestId,
          code: code,
        },
        { headers: HEADERS }
      );
      if (response.data.ok && response.data.result.verification_status.status === 'code_valid') {
        setAuthSuccess(true); // Успешная авторизация
        message.success('Код подтверждён!');
      } else {
        message.error('Неверный код.');
      }
    } catch (error) {
      message.error(`Ошибка: ${error.message}`);
    }
  };

  return (
    <Card style={{ width: 400 }}>
      {authSuccess ? (
        <div style={{ textAlign: 'center' }}>
          <Title level={3}>Авторизация прошла успешно!</Title>
          <Text>Вы успешно вошли в систему. Добро пожаловать!</Text>
        </div>
      ) : (
        <>
          <Title level={3}>Авторизация через Telegram</Title>
          <Space direction="vertical" style={{ width: '100%' }}>
            <Text>Телефон:</Text>
            <Input
              placeholder="+79991234567"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <Button type="primary" block onClick={sendCode}>
              Отправить код
            </Button>
            <Text>Введите код:</Text>
            <Input
              placeholder="6-значный код"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
            <Button type="primary" block onClick={verifyCode}>
              Подтвердить
            </Button>
          </Space>
        </>
      )}
    </Card>
  );
};

export default App;
