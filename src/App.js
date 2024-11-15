import React, { useState } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

const BASE_URL = 'https://gatewayapi.telegram.org/';
const TOKEN = 'AAHkCAAAQYk2l3sh4ky7v-sTrqZ3MRw5RpCoz9BKM_aLsg';
const HEADERS = {
  Authorization: `Bearer ${TOKEN}`,
  'Content-Type': 'application/json',
};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Auth />} />
        <Route path="/success" element={<Success />} />
      </Routes>
    </Router>
  );
};

const Auth = () => {
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [requestId, setRequestId] = useState(null);
  const [status, setStatus] = useState('');

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
        setStatus('Код отправлен, проверьте Telegram.');
      } else {
        setStatus(`Ошибка: ${response.data.error}`);
      }
    } catch (error) {
      setStatus(`Ошибка: ${error.message}`);
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
        setStatus('Код подтверждён!');
        window.location.href = '/success';
      } else {
        setStatus('Неверный код.');
      }
    } catch (error) {
      setStatus(`Ошибка: ${error.message}`);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Авторизация через Telegram</h1>
      <div>
        <label>
          Телефон (в формате E.164): 
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+79991234567"
          />
        </label>
        <button onClick={sendCode}>Отправить код</button>
      </div>
      <div>
        <label>
          Введите код: 
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
        </label>
        <button onClick={verifyCode}>Подтвердить</button>
      </div>
      <p>{status}</p>
    </div>
  );
};

const Success = () => (
  <div style={{ padding: '20px' }}>
    <h1>Авторизация прошла успешно!</h1>
  </div>
);

export default App;
