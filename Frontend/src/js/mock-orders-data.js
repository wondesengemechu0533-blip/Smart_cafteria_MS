/**
 * Mock orders used as client-side data source.
 * In production, orders come from the backend API.
 */
export const MOCK_ORDERS = [
    {
        id: 'o1',
        userId: 'u3',
        items: [
            { itemId: 1, name: 'ፓስታ በዳቦ', quantity: 2, price: 75 },
            { itemId: 11, name: 'ቀይ ወጥ', quantity: 1, price: 180 },
        ],
        totalAmount: 330,
        status: 'ready',
        paymentStatus: 'simulated',
        orderTime: new Date(Date.now() - 3600000 * 2).toISOString(),
        readyTime: new Date(Date.now() - 3600000 * 1.5).toISOString(),
        completedTime: null,
    },
    {
        id: 'o2',
        userId: 'u4',
        items: [
            { itemId: 16, name: 'ምስር ኖርማል', quantity: 1, price: 80 },
            { itemId: 20, name: 'ጁስ', quantity: 2, price: 55 },
        ],
        totalAmount: 190,
        status: 'preparing',
        paymentStatus: 'simulated',
        orderTime: new Date(Date.now() - 3600000 * 0.5).toISOString(),
        readyTime: null,
        completedTime: null,
    },
    {
        id: 'o3',
        userId: 'u5',
        items: [
            { itemId: 12, name: 'የስጋ ጥብስ', quantity: 1, price: 250 },
            { itemId: 24, name: 'የስጋ ሳንዱች', quantity: 1, price: 100 },
        ],
        totalAmount: 350,
        status: 'pending',
        paymentStatus: 'pending',
        orderTime: new Date(Date.now() - 3600000 * 0.2).toISOString(),
        readyTime: null,
        completedTime: null,
    },
];
