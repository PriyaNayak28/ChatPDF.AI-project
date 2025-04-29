import { DataTypes, Model } from 'sequelize'
import sequelize from '../util/database'

interface PDFAttributes {
  id: string
  userId: string
  filename: string
  originalName: string
  filePath: string
  uploadDate: Date
}

class PDF extends Model<PDFAttributes> implements PDFAttributes {
  public id!: string
  public userId!: string
  public filename!: string
  public originalName!: string
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
      type: DataTypes.UUID,
      allowNull: false,
    },
    filename: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    originalName: {
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