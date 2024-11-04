module.exports = {
    // Другие настройки ESLint...
    rules: {
      'no-restricted-globals': ['error', 'event', 'fdescribe'], // Удалите 'self' из списка запрещённых глобальных переменных
    },
  };
  