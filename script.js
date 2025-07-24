// Основные валюты для отображения
const mainCurrencies = ['USD', 'EUR', 'GBP', 'JPY', 'CNY', 'CHF', 'CAD', 'AUD'];
const cryptoCurrencies = ['BTC', 'ETH', 'XRP', 'LTC', 'BCH'];
const allCurrencies = [...mainCurrencies, ...cryptoCurrencies, 'SGD', 'NZD', 'SEK', 'NOK', 'DKK', 'HKD'];

// Элементы DOM
const elements = {
    amountInput: document.getElementById('amount'),
    fromCurrencySelect: document.getElementById('from-currency'),
    toCurrencySelect: document.getElementById('to-currency'),
    resultInput: document.getElementById('result'),
    ratesBody: document.getElementById('rates-body'),
    currentDate: document.getElementById('current-date'),
    updateTime: document.getElementById('update-time'),
    refreshBtn: document.getElementById('refresh-btn'),
    swapBtn: document.getElementById('swap-currencies'),
    conversionText: document.getElementById('conversion-text'),
    tabs: document.querySelectorAll('.tab'),
    chartModal: document.getElementById('chart-modal'),
    closeModal: document.querySelector('.close-modal'),
    modalTitle: document.getElementById('modal-title'),
    currencyChart: document.getElementById('currency-chart')
};

// Текущие курсы валют и исторические данные
let exchangeRates = {};
let historicalData = {};
let activeTab = 'main';
let chartInstance = null;

// Инициализация
document.addEventListener('DOMContentLoaded', async () => {
    // Инициализация частиц
    particlesJS('particles-js', {
        particles: {
            number: { value: 80, density: { enable: true, value_area: 800 } },
            color: { value: "#a29bfe" },
            shape: { type: "circle" },
            opacity: { value: 0.5, random: true },
            size: { value: 3, random: true },
            line_linked: { enable: true, distance: 150, color: "#6c5ce7", opacity: 0.4, width: 1 },
            move: { enable: true, speed: 2, direction: "none", random: true, straight: false, out_mode: "out" }
        },
        interactivity: {
            detect_on: "canvas",
            events: {
                onhover: { enable: true, mode: "repulse" },
                onclick: { enable: true, mode: "push" }
            }
        }
    });

    // Установка текущей даты
    setCurrentDate();
    
    // Настройка выпадающих списков
    setupCurrencySelects();
    
    // Загрузка курсов валют
    await fetchExchangeRates();
    
    // Настройка обработчиков событий
    setupEventListeners();
    
    // Первоначальный расчет
    convertCurrency();
});

// Установка текущей даты
function setCurrentDate() {
    const now = new Date();
    elements.currentDate.textContent = now.toLocaleDateString('ru-RU', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
}

// Настройка выпадающих списков валют
function setupCurrencySelects() {
    // Очищаем списки
    elements.fromCurrencySelect.innerHTML = '';
    elements.toCurrencySelect.innerHTML = '';
    
    // Добавляем основные валюты в from-currency
    mainCurrencies.forEach(currency => {
        const option = createCurrencyOption(currency);
        elements.fromCurrencySelect.appendChild(option);
    });
    
    // Добавляем все валюты в to-currency
    allCurrencies.forEach(currency => {
        const option = createCurrencyOption(currency);
        elements.toCurrencySelect.appendChild(option);
    });
    
    // Устанавливаем значения по умолчанию
    elements.fromCurrencySelect.value = 'USD';
    elements.toCurrencySelect.value = 'RUB';
}

// Создание элемента option для select
function createCurrencyOption(currency) {
    const option = document.createElement('option');
    option.value = currency;
    option.textContent = `${currency} (${getCurrencyName(currency)})`;
    return option;
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
        RUB: 'Российский рубль',
        BTC: 'Bitcoin',
        ETH: 'Ethereum',
        XRP: 'Ripple',
        LTC: 'Litecoin',
        BCH: 'Bitcoin Cash',
        SGD: 'Сингапурский доллар',
        NZD: 'Новозеландский доллар',
        SEK: 'Шведская крона',
        NOK: 'Норвежская крона',
        DKK: 'Датская крона',
        HKD: 'Гонконгский доллар'
    };
    return names[code] || code;
}

// Загрузка курсов валют
async function fetchExchangeRates() {
    try {
        // Показать состояние загрузки
        elements.updateTime.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Загрузка данных...';
        
        // В реальном проекте здесь должен быть запрос к API
        // Для демонстрации используем фиктивные данные
        
        // Фиктивные курсы
        exchangeRates = {
            USD: 90.5,
            EUR: 98.2,
            GBP: 115.7,
            JPY: 0.62,
            CNY: 12.5,
            CHF: 102.3,
            CAD: 67.8,
            AUD: 60.2,
            BTC: 3500000,
            ETH: 250000,
            XRP: 45,
            LTC: 8000,
            BCH: 28000,
            SGD: 67.2,
            NZD: 55.8,
            SEK: 8.7,
            NOK: 8.9,
            DKK: 13.2,
            HKD: 11.6,
            RUB: 1
        };
        
        // Фиктивные изменения
        const changes = {
            USD: 0.5,
            EUR: -0.3,
            GBP: 1.2,
            JPY: -0.05,
            CNY: 0.2,
            CHF: -0.7,
            CAD: 0.3,
            AUD: -0.4,
            BTC: 150000,
            ETH: -5000,
            XRP: 2,
            LTC: -200,
            BCH: 800
        };
        
        // Добавляем изменения к курсам
        for (const currency in changes) {
            exchangeRates[`${currency}_change`] = changes[currency];
            exchangeRates[`${currency}_change_percent`] = (changes[currency] / exchangeRates[currency] * 100).toFixed(2);
        }
        
        // Генерация фиктивных исторических данных
        generateHistoricalData();
        
        // Обновляем время
        const now = new Date();
        elements.updateTime.innerHTML = `<i class="fas fa-clock"></i> Последнее обновление: ${now.toLocaleTimeString('ru-RU')}`;
        
        // Обновляем интерфейс
        updateRatesTable();
        convertCurrency();
        
        // Анимация успешной загрузки
        elements.updateTime.classList.add('animate__animated', 'animate__fadeIn');
        setTimeout(() => {
            elements.updateTime.classList.remove('animate__animated', 'animate__fadeIn');
        }, 1000);
        
    } catch (error) {
        console.error('Ошибка при загрузке курсов валют:', error);
        elements.updateTime.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Ошибка загрузки';
        
        // Анимация ошибки
        elements.updateTime.classList.add('animate__animated', 'animate__shakeX');
        setTimeout(() => {
            elements.updateTime.classList.remove('animate__animated', 'animate__shakeX');
        }, 1000);
    }
}

// Генерация фиктивных исторических данных
function generateHistoricalData() {
    const currencies = [...mainCurrencies, ...cryptoCurrencies];
    const days = 30;
    const now = new Date();
    
    currencies.forEach(currency => {
        const baseValue = exchangeRates[currency];
        const volatility = currency.length === 3 ? 0.02 : 0.08; // Большая волатильность для криптовалют
        
        historicalData[currency] = [];
        
        for (let i = days; i >= 0; i--) {
            const date = new Date(now);
            date.setDate(date.getDate() - i);
            
            // Генерация случайного значения на основе базового курса
            const randomFactor = 1 + (Math.random() * 2 - 1) * volatility;
            const value = baseValue * randomFactor;
            
            historicalData[currency].push({
                date: date.toISOString().split('T')[0],
                value: parseFloat(value.toFixed(4))
            });
        }
    });
}

// Настройка обработчиков событий
function setupEventListeners() {
    // Конвертер
    elements.amountInput.addEventListener('input', convertCurrency);
    elements.fromCurrencySelect.addEventListener('change', convertCurrency);
    elements.toCurrencySelect.addEventListener('change', convertCurrency);
    elements.swapBtn.addEventListener('click', swapCurrencies);
    elements.refreshBtn.addEventListener('click', fetchExchangeRates);
    
    // Табы
    elements.tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            elements.tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            activeTab = tab.dataset.tab;
            updateRatesTable();
        });
    });
    
    // Модальное окно
    elements.closeModal.addEventListener('click', () => {
        elements.chartModal.classList.remove('active');
    });
    
    // Закрытие модального окна при клике вне его
    window.addEventListener('click', (e) => {
        if (e.target === elements.chartModal) {
            elements.chartModal.classList.remove('active');
        }
    });
}

// Конвертация валюты
function convertCurrency() {
    const amount = parseFloat(elements.amountInput.value) || 0;
    const fromCurrency = elements.fromCurrencySelect.value;
    const toCurrency = elements.toCurrencySelect.value;
    
    // Получаем курсы
    const fromRate = exchangeRates[fromCurrency] || 1;
    const toRate = exchangeRates[toCurrency] || 1;
    
    // Вычисляем результат
    const result = (amount * fromRate) / toRate;
    
    // Отображаем результат с форматированием
    elements.resultInput.value = formatCurrency(result, toCurrency);
    
    // Обновляем текст конверсии
    updateConversionText(amount, fromCurrency, result, toCurrency);
}

// Форматирование валюты
function formatCurrency(value, currency) {
    if (currency === 'JPY') {
        return value.toFixed(2);
    } else if (currency === 'BTC' || currency === 'ETH') {
        return value.toFixed(8);
    } else if (['XRP', 'LTC', 'BCH'].includes(currency)) {
        return value.toFixed(4);
    } else {
        return value.toFixed(2);
    }
}

// Обновление текста конверсии
function updateConversionText(amount, fromCurrency, result, toCurrency) {
    const fromName = getCurrencyName(fromCurrency);
    const toName = getCurrencyName(toCurrency);
    
    elements.conversionText.innerHTML = `
        <strong>${amount} ${fromCurrency}</strong> = <strong>${formatCurrency(result, toCurrency)} ${toCurrency}</strong><br>
        <small>1 ${fromCurrency} = ${formatCurrency(exchangeRates[fromCurrency] / exchangeRates[toCurrency], toCurrency)} ${toCurrency} | 1 ${toCurrency} = ${formatCurrency(exchangeRates[toCurrency] / exchangeRates[fromCurrency], fromCurrency)} ${fromCurrency}</small>
    `;
}

// Обмен валют местами
function swapCurrencies() {
    // Анимация кнопки
    elements.swapBtn.classList.add('animate__animated', 'animate__rotateIn');
    setTimeout(() => {
        elements.swapBtn.classList.remove('animate__animated', 'animate__rotateIn');
    }, 1000);
    
    const temp = elements.fromCurrencySelect.value;
    elements.fromCurrencySelect.value = elements.toCurrencySelect.value;
    elements.toCurrencySelect.value = temp;
    convertCurrency();
}

// Обновление таблицы курсов
function updateRatesTable() {
    let currenciesToShow = [];
    
    switch (activeTab) {
        case 'main':
            currenciesToShow = mainCurrencies;
            break;
        case 'crypto':
            currenciesToShow = cryptoCurrencies;
            break;
        case 'all':
            currenciesToShow = allCurrencies.filter(c => c !== 'RUB');
            break;
    }
    
    elements.ratesBody.innerHTML = '';
    
    currenciesToShow.forEach(currency => {
        const rate = exchangeRates[currency];
        const change = exchangeRates[`${currency}_change`] || 0;
        const changePercent = exchangeRates[`${currency}_change_percent`] || 0;
        
        const row = document.createElement('tr');
        row.classList.add('animate__animated', 'animate__fadeIn');
        
        // Название валюты с флагом
        const nameCell = document.createElement('td');
        nameCell.innerHTML = `
            <div class="currency-name">
                <span class="currency-flag currency-flag-${currency.toLowerCase()}"></span>
                ${getCurrencyName(currency)} (${currency})
            </div>
        `;
        
        // Курс
        const rateCell = document.createElement('td');
        rateCell.textContent = formatCurrency(rate, 'RUB');
        
        // Изменение
        const changeCell = document.createElement('td');
        changeCell.innerHTML = `
            <div class="change-container ${change >= 0 ? 'up' : 'down'}">
                ${change >= 0 ? '↑' : '↓'} ${Math.abs(change).toFixed(4)} (${Math.abs(changePercent)}%)
            </div>
        `;
        
        // Кнопка графика
        const chartCell = document.createElement('td');
        const chartBtn = document.createElement('button');
        chartBtn.className = 'chart-btn';
        chartBtn.innerHTML = '<i class="fas fa-chart-line"></i> График';
        chartBtn.addEventListener('click', () => showChart(currency));
        chartCell.appendChild(chartBtn);
        
        row.appendChild(nameCell);
        row.appendChild(rateCell);
        row.appendChild(changeCell);
        row.appendChild(chartCell);
        
        elements.ratesBody.appendChild(row);
    });
}

// Показать график курса
function showChart(currency) {
    if (!historicalData[currency]) return;
    
    // Установка заголовка
    elements.modalTitle.textContent = `График курса ${currency} к RUB`;
    
    // Подготовка данных для графика
    const labels = historicalData[currency].map(item => item.date);
    const data = historicalData[currency].map(item => item.value);
    
    // Уничтожение предыдущего графика, если он есть
    if (chartInstance) {
        chartInstance.destroy();
    }
    
    // Создание нового графика
    const ctx = elements.currencyChart.getContext('2d');
    chartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: `${currency}/RUB`,
                data: data,
                borderColor: '#6c5ce7',
                backgroundColor: 'rgba(108, 92, 231, 0.1)',
                borderWidth: 2,
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    mode: 'index',
                    intersect: false
                }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: '#f5f6fa'
                    }
                },
                x: {
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: '#f5f6fa'
                    }
                }
            }
        }
    });
    
    // Показать модальное окно
    elements.chartModal.classList.add('active');
}

// Автоматическое обновление каждые 5 минут
setInterval(fetchExchangeRates, 5 * 60 * 1000);
