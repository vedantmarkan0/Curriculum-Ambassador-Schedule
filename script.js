document.addEventListener('DOMContentLoaded', function() {
    // Initialize Bootstrap components
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    // Time slots from 8:30 AM to 3:20 PM
    const timeSlots = generateTimeSlots();
    const classes = [
        'Mathematics', 'Science', 'English', 'History', 
        'Art', 'Music', 'Physical Education', 'Computer Science'
    ];

    // Initialize schedule data
    let scheduleData = {};
    
    // Generate the schedule table
    generateScheduleTable();

    function generateTimeSlots() {
        const slots = [];
        let currentTime = new Date();
        currentTime.setHours(8, 30, 0); // Start at 8:30 AM
        
        while (currentTime.getHours() < 15 || (currentTime.getHours() === 15 && currentTime.getMinutes() <= 20)) {
            slots.push(formatTime(currentTime));
            currentTime.setMinutes(currentTime.getMinutes() + 50); // 50-minute classes
        }
        return slots;
    }

    function formatTime(date) {
        return date.toLocaleTimeString('en-US', { 
            hour: 'numeric', 
            minute: '2-digit', 
            hour12: true 
        });
    }

    function generateScheduleTable() {
        const scheduleBody = document.getElementById('scheduleBody');
        scheduleBody.innerHTML = '';

        timeSlots.forEach((timeSlot, index) => {
            const row = document.createElement('tr');
            
            // Time column
            const timeCell = document.createElement('td');
            timeCell.textContent = timeSlot;
            row.appendChild(timeCell);

            // Day columns
            ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].forEach(day => {
                const cell = document.createElement('td');
                const classSlot = document.createElement('div');
                
                // Randomly assign classes and availability
                if (Math.random() > 0.3) { // 70% chance of having a class
                    const randomClass = classes[Math.floor(Math.random() * classes.length)];
                    const isAvailable = Math.random() > 0.5;
                    
                    classSlot.className = `class-slot ${isAvailable ? 'available' : 'booked'}`;
                    classSlot.innerHTML = `
                        <strong>${randomClass}</strong><br>
                        <small>${isAvailable ? 'Available' : 'Booked'}</small>
                    `;

                    if (isAvailable) {
                        classSlot.addEventListener('click', () => openRegistrationModal(day, timeSlot, randomClass));
                    }

                    // Store the class data
                    const slotKey = `${day}-${timeSlot}`;
                    scheduleData[slotKey] = {
                        class: randomClass,
                        isAvailable: isAvailable
                    };
                }
                
                cell.appendChild(classSlot);
                row.appendChild(cell);
            });

            scheduleBody.appendChild(row);
        });
    }

    function openRegistrationModal(day, time, className) {
        const modal = new bootstrap.Modal(document.getElementById('registrationModal'));
        document.getElementById('selectedClassInfo').textContent = 
            `${className} on ${day} at ${time}`;
        
        // Store selected class info for registration
        window.selectedClass = { day, time, className };
        
        modal.show();
    }

    // Handle registration form submission
    document.getElementById('confirmRegistration').addEventListener('click', function() {
        const name = document.getElementById('studentName').value;
        const email = document.getElementById('studentEmail').value;
        
        if (!name || !email) {
            alert('Please fill in all fields');
            return;
        }

        // Here you would typically send this data to a server
        const registration = {
            name: name,
            email: email,
            class: window.selectedClass
        };

        // Show success message
        const successToast = new bootstrap.Toast(document.getElementById('successToast'));
        successToast.show();

        // Update the UI to show the class is now booked
        const slotKey = `${registration.class.day}-${registration.class.time}`;
        scheduleData[slotKey].isAvailable = false;
        
        // Close the modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('registrationModal'));
        modal.hide();

        // Clear the form
        document.getElementById('registrationForm').reset();

        // Refresh the schedule display
        generateScheduleTable();
    });
});
