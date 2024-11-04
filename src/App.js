import React, { useState, useEffect } from 'react';
import { Layout, TimePicker, Button, message, Input } from 'antd';
import dayjs from 'dayjs';

const { Content } = Layout;

function App() {
  const [reminderTime, setReminderTime] = useState(() => {
    const savedTime = localStorage.getItem('reminderTime');
    return savedTime ? dayjs(savedTime) : null;
  });
  const [isReminderActive, setIsReminderActive] = useState(false);
  const [reminderText, setReminderText] = useState(() => localStorage.getItem('reminderText') || 'Пора принять таблетки!');
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  useEffect(() => {
    const requestNotificationPermission = async () => {
      if (Notification.permission !== 'granted') {
        await Notification.requestPermission();
      }
    };

    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    requestNotificationPermission();
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  useEffect(() => {
    if (reminderTime) {
      localStorage.setItem('reminderTime', reminderTime.format());
    }
  }, [reminderTime]);

  useEffect(() => {
    localStorage.setItem('reminderText', reminderText);
  }, [reminderText]);

  const showNotification = (title, options) => {
    if (Notification.permission === 'granted') {
      new Notification(title, options);
    }
  };

  const handleTimeChange = (time) => setReminderTime(time);
  const handleTextChange = (e) => setReminderText(e.target.value);

  const startReminder = () => {
    if (!reminderTime) {
      message.warning('Пожалуйста, выберите время напоминания');
      return;
    }

    setIsReminderActive(true);
    message.success('Напоминание включено');

    const reminderHour = reminderTime.hour();
    const reminderMinute = reminderTime.minute();

    const checkTime = setInterval(() => {
      const currentTime = dayjs();
      const currentHour = currentTime.hour();
      const currentMinute = currentTime.minute();

      if (currentHour === reminderHour && currentMinute === reminderMinute) {
        const speech = new SpeechSynthesisUtterance(reminderText);
        window.speechSynthesis.speak(speech);

        showNotification("Напоминание", { body: reminderText });

        clearInterval(checkTime);
        setIsReminderActive(false);
      }
    }, 1000);
  };

  const stopReminder = () => {
    setIsReminderActive(false);
    message.info('Напоминание отключено');
    window.speechSynthesis.cancel();
  };

  const handleInstallClick = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('Пользователь принял установку приложения');
        } else {
          console.log('Пользователь отклонил установку приложения');
        }
        setDeferredPrompt(null);
      });
    }
  };

  return (
    <Layout style={{ height: '100vh' }}>
      <Content style={{ padding: '50px', maxWidth: '400px', margin: 'auto' }}>
        <h2>Голосовое напоминание</h2>
        <TimePicker
          style={{ width: '100%', marginBottom: '10px' }}
          onChange={handleTimeChange}
          value={reminderTime}
          format="HH:mm"
          placeholder="Выберите время"
        />
        <Input
          style={{ width: '100%', marginBottom: '10px' }}
          value={reminderText}
          onChange={handleTextChange}
          placeholder="Текст напоминания"
        />
        <Button
          type="primary"
          onClick={startReminder}
          disabled={isReminderActive}
          style={{ width: '100%', marginBottom: '10px' }}
        >
          Включить напоминание
        </Button>
        <Button
          type="default"
          onClick={stopReminder}
          disabled={!isReminderActive}
          style={{ width: '100%' }}
        >
          Отключить напоминание
        </Button>
        {deferredPrompt && (
          <Button
            type="primary"
            onClick={handleInstallClick}
            style={{ width: '100%', marginTop: '10px' }}
          >
            Установить приложение
          </Button>
        )}
      </Content>
    </Layout>
  );
}

export default App;
