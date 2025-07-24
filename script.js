// Основные валюты для отображения
const mainCurrencies = ['USD', 'EUR', 'GBP', 'JPY', 'CNY', 'CHF', 'CAD', 'AUD'];

// Элементы DOM
const amountInput = document.getElementById('amount');
const fromCurrencySelect = document.getElementById('from-currency');
const toCurrencySelect = document.getElementById('to-currency');
const resultInput = document.getElementById('result');
const ratesBody = document.getElementById('rates-body');
const currentDateElement = document.getElementById('current-date');
const updateTimeElement = document.getElementById('update-time');

// Текущие курсы валют
let exchangeRates = {};
let lastUpdateTime = null;

// Инициализация
async function init() {
    // Установка текущей даты
    const now = new Date();
    currentDateElement.textContent = now.toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });

    // Загрузка курсов валют
    await fetchExchangeRates();

    // Настройка выпадающих списков
    setupCurrencySelects();

    // Настройка обработчиков событий
    setupEventListeners();

    // Первоначальный расчет
    convertCurrency();
}

// Загрузка курсов валют
async function fetchExchangeRates() {
    try {
        // В реальном проекте используйте API типа ExchangeRate-API или данные ЦБ РФ
        // Здесь используется фиктивные данные для демонстрации
        
        // Фиктивные курсы (обычно вы получите их из API)
        exchangeRates = {
            USD: 90.5,
            EUR: 98.2,
            GBP: 115.7,
            JPY: 0.62,
            CNY: 12.5,
            CHF: 102.3,
            CAD: 67.8,
            AUD: 60.2,
            RUB: 1
        };
        
        // Фиктивные изменения (в реальном проекте нужно сравнивать с предыдущими значениями)
        const changes = {
            USD: 0.5,
            EUR: -0.3,
            GBP: 1.2,
            JPY: -0.05,
            CNY: 0.2,
            CHF: -0.7,
            CAD: 0.3,
            AUD: -0.4
        };
        
        // Добавляем изменения к курсам
        for (const currency in changes) {
            exchangeRates[currency + '_change'] = changes[currency];
        }
        
        lastUpdateTime = new Date();
        updateTimeElement.textContent = `Последнее обновление: ${lastUpdateTime.toLocaleTimeString('ru-RU')}`;
        
        // Обновляем таблицу курсов
        updateRatesTable();
        
    } catch (error) {
        console.error('Ошибка при загрузке курсов валют:', error);
        alert('Не удалось загрузить курсы валют. Пожалуйста, попробуйте позже.');
    }
}

// Настройка выпадающих списков валют
function setupCurrencySelects() {
    // Очищаем списки
    fromCurrencySelect.innerHTML = '';
    
    // Добавляем основные валюты
    mainCurrencies.forEach(currency => {
        const option = document.createElement('option');
        option.value = currency;
        option.textContent = `${currency} (${getCurrencyName(currency)})`;
        fromCurrencySelect.appendChild(option);
    });
    
    // Устанавливаем USD по умолчанию
    fromCurrencySelect.value = 'USD';
}

// Получение названия валюты
function getCurrencyName(code) {
    const names = {
        USD: 'Доллар США',
        EUR: 'Евро',
        GBP: 'Фунт стерлингов',
        JPY: 'Японская иена',
        CNY: 'Китайский юань',
        CHF: 'Швейцарский франк',
        CAD: 'Канадский доллар',
        AUD: 'Австралийский доллар',
        RUB: 'Российский рубль'
    };
    return names[code] || code;
}

// Настройка обработчиков событий
function setupEventListeners() {
    amountInput.addEventListener('input', convertCurrency);
    fromCurrencySelect.addEventListener('change', convertCurrency);
    toCurrencySelect.addEventListener('change', convertCurrency);
}

// Конвертация валюты
function convertCurrency() {
    const amount = parseFloat(amountInput.value) || 0;
    const fromCurrency = fromCurrencySelect.value;
    const toCurrency = toCurrencySelect.value;
    
    // Получаем курсы
    const fromRate = exchangeRates[fromCurrency] || 1;
    const toRate = exchangeRates[toCurrency] || 1;
    
    // Вычисляем результат
    const result = (amount * fromRate) / toRate;
    
    // Отображаем результат с округлением до 4 знаков
    resultInput.value = result.toFixed(4);
}

// Обновление таблицы курсов
function updateRatesTable() {
    ratesBody.innerHTML = '';
    
    mainCurrencies.forEach(currency => {
        const rate = exchangeRates[currency];
        const change = exchangeRates[currency + '_change'] || 0;
        
        const row = document.createElement('tr');
        
        const nameCell = document.createElement('td');
        nameCell.textContent = `${getCurrencyName(currency)} (${currency})`;
        
        const rateCell = document.createElement('td');
        rateCell.textContent = rate.toFixed(4);
        
        const changeCell = document.createElement('td');
        changeCell.textContent = change >= 0 ? `+${change.toFixed(4)}` : change.toFixed(4);
        changeCell.className = change >= 0 ? 'up' : 'down';
        
        row.appendChild(nameCell);
        row.appendChild(rateCell);
        row.appendChild(changeCell);
        
        ratesBody.appendChild(row);
    });
}

// Запуск приложения
document.addEventListener('DOMContentLoaded', init);
