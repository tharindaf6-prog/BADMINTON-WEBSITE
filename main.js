// Initial Configuration
const COURTS_COUNT = 5;
const START_HOUR = 8; // 8:00 AM
const END_HOUR = 22; // 10:00 PM
const PRICE_PER_HOUR = 1500; // LKR per hour

// Utility to generate time slots array
function generateTimeSlots() {
    const slots = [];
    for (let i = START_HOUR; i < END_HOUR; i++) {
        let ampm1 = i >= 12 ? 'PM' : 'AM';
        let ampm2 = (i + 1) >= 12 ? 'PM' : 'AM';
        let hour1 = i > 12 ? i - 12 : i;
        let hour2 = (i + 1) > 12 ? (i + 1) - 12 : (i + 1);
        
        slots.push(`${hour1}:00 ${ampm1} - ${hour2}:00 ${ampm2}`);
    }
    return slots;
}

const timeSlots = generateTimeSlots();

// Simulated Database (LocalStorage)
// Structure: bookings = { "YYYY-MM-DD": { courtId: ["slot1", "slot2"] } }
function getBookings() {
    const bookings = localStorage.getItem('smashArenaBookings');
    return bookings ? JSON.parse(bookings) : {};
}

function saveBookings(bookings) {
    localStorage.setItem('smashArenaBookings', JSON.stringify(bookings));
}

// Generate random dummy bookings for aesthetics if empty
function initializeDummyData() {
    let bookings = getBookings();
    const today = new Date().toISOString().split('T')[0];
    
    if (!bookings[today]) {
        bookings[today] = {};
        for(let c=1; c<=COURTS_COUNT; c++) {
            bookings[today][`Court ${c}`] = [];
            // Randomly book a few slots
            timeSlots.forEach(slot => {
                if(Math.random() > 0.7) { // 30% chance to be booked
                    bookings[today][`Court ${c}`].push(slot);
                }
            });
        }
        saveBookings(bookings);
    }
}

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    initializeDummyData();
});
