document.addEventListener('DOMContentLoaded', function() {
    const socialNetwork = document.getElementById('socialNetwork');
    const serviceType = document.getElementById('serviceType');
    const serviceName = document.getElementById('serviceName');
    const quantity = document.getElementById('quantity');
    const totalPrice = document.getElementById('totalPrice');
    const buyPrice = document.getElementById('buyPrice');
    const sellPrice = document.getElementById('sellPrice');
    const profitMargin = document.getElementById('profitMargin');
    const dropPercentage = document.getElementById('dropPercentage');
    const finalQuantity = document.getElementById('finalQuantity');
    const exchangeRate = 1100; // 1 dólar = 1100 pesos argentinos

    socialNetwork.addEventListener('change', updateServices);
    serviceType.addEventListener('change', updateServices);
    quantity.addEventListener('input', updatePrice);
    profitMargin.addEventListener('input', updatePrice);
    dropPercentage.addEventListener('input', updatePrice);

    function updateServices() {
        const selectedNetwork = socialNetwork.value;
        const selectedType = serviceType.value;

        fetch(selectedNetwork + '.json')
            .then(response => response.json())
            .then(data => {
                serviceName.innerHTML = '';
                const services = data.services[selectedType];
                services.forEach(service => {
                    const option = document.createElement('option');
                    option.value = service.id;
                    option.textContent = service.service_name;
                    option.dataset.price = service.price_per_unit;
                    serviceName.appendChild(option);
                });
                updatePrice();
            })
            .catch(error => console.error('Error:', error));
    }

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

        buyPrice.textContent = totalPriceInPesos.toFixed(2);
        sellPrice.textContent = sellPriceInPesos.toFixed(2);
        finalQuantity.textContent = adjustedQuantity.toFixed(0);
    }

    updateServices();
});
