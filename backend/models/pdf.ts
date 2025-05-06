import { DataTypes, Model } from 'sequelize'
import sequelize from '../util/database'

interface PDFAttributes {
  id: string
  userId: number
  storedFilename: string
  originalFilename: string
  filePath: string
  uploadDate: Date
}

class PDF extends Model<PDFAttributes> implements PDFAttributes {
  public id!: string
  public userId!: number
  public storedFilename!: string
  public originalFilename!: string
  public filePath!: string
  public uploadDate!: Date
}

PDF.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    storedFilename: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    originalFilename: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    filePath: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    uploadDate: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: 'PDF',
  }
)

export default PDF
