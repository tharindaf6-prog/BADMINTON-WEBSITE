let currentDate = new Date().toISOString().split('T')[0];
let cart = []; // Array of {court, slot, price}

document.addEventListener('DOMContentLoaded', () => {
    const dateInput = document.getElementById('booking-date');
    dateInput.min = currentDate;
    dateInput.value = currentDate;

    dateInput.addEventListener('change', (e) => {
        currentDate = e.target.value;
        cart = []; // clear cart on date change
        updateCartUI();
        renderCourts();
    });

    document.getElementById('checkout-btn').addEventListener('click', () => {
        if (cart.length > 0) {
            sessionStorage.setItem('pendingBooking', JSON.stringify({
                date: currentDate,
                items: cart,
                total: cart.length * PRICE_PER_HOUR
            }));
            window.location.href = 'payment.html';
        }
    });

    renderCourts();
});

function renderCourts() {
    const container = document.getElementById('courts-container');
    container.innerHTML = '';

    const allBookings = getBookings();
    const dateBookings = allBookings[currentDate] || {};

    for (let c = 1; c <= COURTS_COUNT; c++) {
        const courtName = `Court ${c}`;
        const courtBookings = dateBookings[courtName] || [];

        const courtDiv = document.createElement('div');
        courtDiv.className = 'court-section';

        const header = document.createElement('div');
        header.className = 'court-header';
        header.innerHTML = `<h2><i class="fa-solid fa-map-location-dot"></i> <span>Court</span> 0${c}</h2>`;
        courtDiv.appendChild(header);

        const slotsGrid = document.createElement('div');
        slotsGrid.className = 'time-slots';

        timeSlots.forEach(slot => {
            const slotDiv = document.createElement('div');
            const isBooked = courtBookings.includes(slot);
            const isInCart = cart.some(item => item.court === courtName && item.slot === slot);

            slotDiv.className = `time-slot ${isBooked ? 'booked' : 'available'}`;
            if (isInCart) {
                slotDiv.style.background = 'var(--primary-color)';
                slotDiv.style.color = 'var(--bg-color)';
            }

            slotDiv.textContent = slot;

            if (!isBooked) {
                slotDiv.addEventListener('click', () => toggleCart(courtName, slot, slotDiv));
            }
            slotsGrid.appendChild(slotDiv);
        });

        courtDiv.appendChild(slotsGrid);
        container.appendChild(courtDiv);
    }
}

function toggleCart(court, slot, element) {
    const index = cart.findIndex(item => item.court === court && item.slot === slot);

    if (index > -1) {
        // Remove from cart
        cart.splice(index, 1);
        element.style.background = 'var(--available-bg)';
        element.style.color = 'var(--available-text)';
    } else {
        // Add to cart
        cart.push({ court, slot, price: PRICE_PER_HOUR });
        element.style.background = 'var(--primary-color)';
        element.style.color = 'var(--bg-color)';
    }

    updateCartUI();
}

function updateCartUI() {
    const cartSummary = document.getElementById('cart-summary');
    const list = document.getElementById('selected-slots-list');
    const totalEl = document.getElementById('cart-total-price');

    if (cart.length > 0) {
        cartSummary.classList.add('active');
        list.innerHTML = '';

        let total = 0;
        cart.forEach(item => {
            const li = document.createElement('li');
            li.innerHTML = `<span>${item.court} - ${item.slot}</span> <span>Rs. ${item.price}</span>`;
            list.appendChild(li);
            total += item.price;
        });

        totalEl.textContent = `Rs. ${total}`;
    } else {
        cartSummary.classList.remove('active');
    }
}
