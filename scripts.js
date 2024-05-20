document.addEventListener('DOMContentLoaded', function() {
    const socialNetwork = document.getElementById('socialNetwork');
    const serviceType = document.getElementById('serviceType');
    const serviceName = document.getElementById('serviceName');
    const quantity = document.getElementById('quantity');
    const buyPrice = document.getElementById('buyPrice');
    const sellPrice = document.getElementById('sellPrice');
    const buyPriceUSD = document.getElementById('buyPriceUSD');
    const sellPriceUSD = document.getElementById('sellPriceUSD');
    const profitMargin = document.getElementById('profitMargin');
    const dropPercentage = document.getElementById('dropPercentage');
    const finalQuantity = document.getElementById('finalQuantity');
    const exchangeRate = 1100; // 1 dólar = 1100 pesos argentinos

    const comboServices = document.querySelectorAll('.comboService');
    const comboQuantities = document.querySelectorAll('.comboQuantity');
    const comboProfits = document.querySelectorAll('.comboProfit');
    const calculateCombo = document.getElementById('calculateCombo');
    const comboBuyPrice = document.getElementById('comboBuyPrice');
    const comboSellPrice = document.getElementById('comboSellPrice');

    let combinedData = { services: { seguidores: [], likes: [], vistas: [], minutos: [] } };

    // Eventos
    socialNetwork.addEventListener('change', updateIndividualServices);
    serviceType.addEventListener('change', updateIndividualServices);
    quantity.addEventListener('input', updatePrice);
    profitMargin.addEventListener('input', updatePrice);
    dropPercentage.addEventListener('input', updatePrice);
    calculateCombo.addEventListener('click', calculateComboPrice);

    // Cargar archivos JSON
    async function loadJSONFiles() {
        const urls = ['instagram.json', 'youtube.json', 'facebook.json', 'tiktok.json'];
        const requests = urls.map(url => fetch(url).then(response => response.json()));

        try {
            const results = await Promise.all(requests);
            results.forEach(data => {
                Object.keys(data.services).forEach(category => {
                    if (!combinedData.services[category]) {
                        combinedData.services[category] = [];
                    }
                    combinedData.services[category] = combinedData.services[category].concat(data.services[category]);
                });
            });
            updateIndividualServices();
            updateComboServices();
        } catch (error) {
            console.error('Error loading JSON files:', error);
        }
    }

    // Actualizar servicios individuales según la red social seleccionada
    function updateIndividualServices() {
        const selectedNetwork = socialNetwork.value;
        const selectedType = serviceType.value;

        serviceName.innerHTML = '';
        const services = combinedData.services[selectedType].filter(service => service.service_name.toLowerCase().includes(selectedNetwork));
        services.forEach(service => {
            const option = document.createElement('option');
            option.value = service.id;
            option.textContent = service.service_name;
            option.dataset.price = service.price_per_unit;
            serviceName.appendChild(option);
        });
        updatePrice();
    }

    // Actualizar servicios en la sección de combos
    function updateComboServices() {
        comboServices.forEach(select => {
            select.innerHTML = '';
            Object.keys(combinedData.services).forEach(category => {
                combinedData.services[category].forEach(service => {
                    const option = document.createElement('option');
                    option.value = service.id;
                    option.textContent = service.service_name;
                    option.dataset.price = service.price_per_unit;
                    select.appendChild(option);
                });
            });
        });
    }

    // Actualizar precio
    function updatePrice() {
        const selectedService = serviceName.selectedOptions[0];
        const pricePerUnitInDollars = selectedService ? parseFloat(selectedService.dataset.price) : 0;
        const pricePerUnitInPesos = pricePerUnitInDollars * exchangeRate;
        const totalPriceInPesos = pricePerUnitInPesos * quantity.value;
        
        const profitMarginValue = parseFloat(profitMargin.value) / 100;
        const dropPercentageValue = parseFloat(dropPercentage.value) / 100;
        
        const adjustedQuantity = quantity.value * (1 + dropPercentageValue);
        const adjustedPrice = totalPriceInPesos * (1 + dropPercentageValue);
        const sellPriceInPesos = adjustedPrice * (1 + profitMarginValue);
        const sellPriceInDollars = sellPriceInPesos / exchangeRate;

        buyPrice.textContent = totalPriceInPesos.toFixed(2);
        sellPrice.textContent = sellPriceInPesos.toFixed(2);
        buyPriceUSD.textContent = (totalPriceInPesos / exchangeRate).toFixed(2);
        sellPriceUSD.textContent = sellPriceInDollars.toFixed(2);
        finalQuantity.textContent = adjustedQuantity.toFixed(0);
    }

    // Calcular precio del combo
    function calculateComboPrice() {
        let totalBuyPrice = 0;
        let totalSellPrice = 0;
        comboServices.forEach((select, index) => {
            const selectedOption = select.selectedOptions[0];
            const pricePerUnitInDollars = selectedOption ? parseFloat(selectedOption.dataset.price) : 0;
            const pricePerUnitInPesos = pricePerUnitInDollars * exchangeRate;
            const quantity = comboQuantities[index].value;
            const profitMarginValue = parseFloat(comboProfits[index].value) / 100;

            const serviceBuyPrice = pricePerUnitInPesos * quantity;
            const serviceSellPrice = serviceBuyPrice * (1 + profitMarginValue);

            totalBuyPrice += serviceBuyPrice;
            totalSellPrice += serviceSellPrice;
        });

        comboBuyPrice.textContent = totalBuyPrice.toFixed(2);
        comboSellPrice.textContent = totalSellPrice.toFixed(2);
    }

    loadJSONFiles();
});
