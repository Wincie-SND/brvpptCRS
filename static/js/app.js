document.addEventListener("DOMContentLoaded", () => {
    console.log("DriveLink loaded");

    loadCurrentUser();
    loadAdminData();
    loadTenantData();
    loadMessages();
});

async function loadCurrentUser() {
    try {
        const response = await fetch("/me");
        if (!response.ok) return;

        const user = await response.json();
        console.log("Logged in user:", user);
    } catch (error) {
        console.log("No active session detected.");
    }
}

async function loadAdminData() {
    const usersBox = document.getElementById("admin-users");
    const tenantsBox = document.getElementById("admin-tenants");

    if (tenantsBox) {
        const response = await fetch("/admin/tenants");
        const tenants = await response.json();

        tenantsBox.innerHTML = tenants.map(tenant => `
            <p><strong>${tenant.business_name}</strong> — ${tenant.tenant_key}</p>
        `).join("");
    }

    if (usersBox) {
        const response = await fetch("/admin/users");
        const users = await response.json();

        usersBox.innerHTML = users.map(user => `
            <p><strong>${user.fullname}</strong> — ${user.email} — ${user.role}</p>
        `).join("");
    }
}

async function loadTenantData() {
    const vehiclesBox = document.getElementById("vehicles-list");
    const bookingsBox = document.getElementById("bookings-list");

    if (vehiclesBox) {
        const response = await fetch("/vehicles");
        const vehicles = await response.json();

        vehiclesBox.innerHTML = vehicles.map(vehicle => `
            <p><strong>${vehicle.vehicle_name}</strong> — ₱${vehicle.price}</p>
        `).join("");
    }

    if (bookingsBox) {
        const response = await fetch("/bookings");
        const bookings = await response.json();

        bookingsBox.innerHTML = bookings.map(booking => `
            <p><strong>${booking.renter_name}</strong> booked ${booking.vehicle_name} — ${booking.status}</p>
        `).join("");
    }
}

async function loadMessages() {
    const messagesBox = document.getElementById("messages-list");
    if (!messagesBox) return;

    const response = await fetch("/messages");
    const messages = await response.json();

    messagesBox.innerHTML = messages.map(chat => `
        <p><strong>${chat.sender_name}</strong> to <strong>${chat.receiver_name}</strong>: ${chat.message}</p>
    `).join("");
}
