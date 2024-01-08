const SeatStatus = {
    None: 0,
    Reserved: 1,
    Buying: 2
}

const OrderStatus = {
    Payed: 0,
    Waiting: 1,
    Canceled: 2
}

const OrderStatusLabel = {
    0: 'Payed',
    1: 'Waiting',
    2: 'Canceled'
}

module.exports = {SeatStatus, OrderStatus, OrderStatusLabel}