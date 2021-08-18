module.exports = (sequelize,Sequelize)=>{
    const orders = sequelize.define('orders',{
        id:{
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV1,
            primaryKey: true,
            allowNull: false
        },
        product: {
			type:Sequelize.STRING,
			allowNull: false,
        },
        brand: {
			type:Sequelize.STRING,
			allowNull: false,
        },
        location: {
			type:Sequelize.STRING,
			allowNull: false,
        },
        rate:{
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        quantity:{
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        order_number:{
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        date:{
            type: Sequelize.DATE,
            allowNull: false,
        },
    },{
         underscored: true,
         timestamp: true ,
        })
    return orders
}
