const startHour = 8;
const endHour = 20;

const slotSelect = document.getElementById("slotSelect");
const availabilityList = document.getElementById("availabilityList");
const status = document.getElementById("status");
const dateInput = document.getElementById("bookingDate");

// Set today as minimum date
dateInput.min = new Date().toISOString().split("T")[0];

let bookings = JSON.parse(localStorage.getItem("padelBookings")) || {};

// Convert to AM/PM format
function formatTime(hour) {
  const period = hour >= 12 ? "PM" : "AM";
  const formattedHour = hour % 12 || 12;
  return `${formattedHour}:00 ${period}`;
}

// Generate slots
function loadSlots() {
  slotSelect.innerHTML = "";
  availabilityList.innerHTML = "";

  const selectedDate = dateInput.value;
  if (!selectedDate) return;

  if (!bookings[selectedDate]) {
    bookings[selectedDate] = {};
  }

  for (let hour = startHour; hour < endHour; hour++) {
    const slot = `${formatTime(hour)} - ${formatTime(hour + 1)}`;
    const isBooked = bookings[selectedDate][slot];

    // Dropdown
    const option = document.createElement("option");
    option.value = slot;
    option.textContent = isBooked ? `${slot} (Booked)` : `${slot} (Available)`;
    option.disabled = isBooked;
    slotSelect.appendChild(option);

    // Availability list
    const li = document.createElement("li");
    li.textContent = isBooked
      ? `${slot} → Booked`
      : `${slot} → Available`;
    availabilityList.appendChild(li);
  }
}

// Reload slots when date changes
dateInput.addEventListener("change", loadSlots);

// Booking function
function bookSlot() {
  const name = document.getElementById("playerName").value;
  const date = dateInput.value;
  const slot = slotSelect.value;

  if (!name || !date || !slot) {
    status.textContent = "Please fill all fields.";
    return;
  }

  if (bookings[date][slot]) {
    status.textContent = "This slot is already booked.";
    return;
  }

  if (confirm("Confirm booking for PKR 3000?")) {
    bookings[date][slot] = name;
    localStorage.setItem("padelBookings", JSON.stringify(bookings));
    status.textContent = "Booking successful!";
    loadSlots();
  }
}
