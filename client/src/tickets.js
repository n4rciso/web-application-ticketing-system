import dayjs from 'dayjs';

const TICKETS = [
    {
        title: 'Inquiry about product',
        state: 'open',
        category: 'inquiry',
        ownerId: 1,
        timestamp: dayjs('2024-06-12 10:00:00'),
        description: 'I have a question about the product features.'
    },
    {
        title: 'Maintenance request',
        state: 'open',
        category: 'maintenance',
        ownerId: 2,
        timestamp: dayjs('2024-06-12 11:00:00'),
        description: 'The system needs maintenance due to a bug.'
    },
    {
        title: 'New feature suggestion',
        state: 'closed',
        category: 'new feature',
        ownerId: 1,
        timestamp: dayjs('2024-06-12 12:00:00'),
        description: 'I suggest adding a dark mode to the application.'
    },
    {
        title: 'Payment issue',
        state: 'open',
        category: 'payment',
        ownerId: 3,
        timestamp: dayjs('2024-06-12 13:00:00'),
        description: 'I encountered an issue while processing the payment.'
    },
    {
        title: 'Administrative help needed',
        state: 'closed',
        category: 'administrative',
        ownerId: 4,
        timestamp: dayjs('2024-06-12 14:00:00'),
        description: 'I need help with administrative tasks.'
    },
    {
        title: 'Inquiry about new feature',
        state: 'open',
        category: 'inquiry',
        ownerId: 5,
        timestamp: dayjs('2024-06-12 15:00:00'),
        description: 'Is there any plan to introduce new features soon?'
    },
    {
        title: 'Request for system upgrade',
        state: 'open',
        category: 'maintenance',
        ownerId: 6,
        timestamp: dayjs('2024-06-12 16:00:00'),
        description: 'We need an upgrade to the latest version.'
    },
    {
        title: 'New feature: user roles',
        state: 'closed',
        category: 'new feature',
        ownerId: 7,
        timestamp: dayjs('2024-06-12 17:00:00'),
        description: 'I suggest adding different user roles.'
    }
];

export default TICKETS;