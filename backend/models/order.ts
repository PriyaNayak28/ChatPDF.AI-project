// models/Order.ts

import { DataTypes, Model, Optional } from 'sequelize'
import sequelize from '../util/database'

// Define the attributes for the Order model
interface OrderAttributes {
  id: number
  paymentid?: string
  orderid?: string
  status?: string
}

// For fields that are optional when creating a new record
interface OrderCreationAttributes extends Optional<OrderAttributes, 'id'> {}

// Define the Order model extending Sequelize's Model class
class Order
  extends Model<OrderAttributes, OrderCreationAttributes>
  implements OrderAttributes
{
  public id!: number
  public paymentid?: string
  public orderid?: string
  public status?: string

  // timestamps
  public readonly createdAt!: Date
  public readonly updatedAt!: Date
}

// Initialize the model
Order.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    paymentid: {
      type: DataTypes.STRING,
    },
    orderid: {
      type: DataTypes.STRING,
    },
    status: {
      type: DataTypes.STRING,
    },
  },
  {
    sequelize,
    modelName: 'order',
  }
)

export default Order
