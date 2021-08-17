require('dotenv').config();
const { Order, sequelize } = require('./models');
const { Op } = require('sequelize')

async function main() {
    let transaction;
    try {
        const dbObject = [];
        const data = XLSLToJson();
        console.log("data", data)
        data.forEach(e => {
            dbObject.push({
                product: e['Product'],
                order_number: e['Order Number'],
                rate: e['Rate '],
                quantity: e['Quantity'],
                brand: e['Brand'],
                location: e['Location'],
                date: e['Date'],
            })
        })
        transaction = await sequelize.transaction()
        await Order.bulkCreate(dbObject, { transaction })
        await transaction.commit()
    }
    catch (err) {
        if (transaction) await transaction.rollback();
        throw new Error(`Can't add order ${err}`)
    }

}

async function filterDocs(start, end) {
    const data = await Order.findAll({ where: { date: { [Op.between]: [start, end] } } })
    console.log("data", data)
}

filterDocs("2021-03-20", "2021-03-25")

// main();