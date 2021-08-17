const { Order } = require("../models");

function create(data) {
    let transaction;
    try {
        transaction = await sequelize.transaction()
        await Order.bulkCreate(data, { transaction })
        await transaction.commit()
    } catch (err) {
        if (transaction) await transaction.rollback();
        throw new Error(`Can't add order ${err}`)
    }
}

async function filter(start, end) {
    return Order.findAll({ where: { date: { [Op.between]: [start, end] } } })
}

module.exports = {
    create,
    filter,
}