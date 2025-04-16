import { DataTypes, Model, Optional } from 'sequelize'
import sequelize from '../util/database'

interface UserAttributes {
  id: number
  name: string
  email: string
  password?: string
  githubId?: string
  isPremium: boolean
}

interface UserCreationAttributes
  extends Optional<
    UserAttributes,
    'id' | 'password' | 'githubId' | 'isPremium'
  > {}

class User
  extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes
{
  public id!: number
  public name!: string
  public email!: string
  public password?: string
  public githubId?: string
  public isPremium!: boolean
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, unique: true, allowNull: false },
    password: { type: DataTypes.STRING },
    githubId: { type: DataTypes.STRING },
    isPremium: { type: DataTypes.BOOLEAN, defaultValue: false },
  },
  {
    sequelize,
    modelName: 'User',
  }
)

export default User
