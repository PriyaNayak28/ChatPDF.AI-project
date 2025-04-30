import User from './user'
import PDF from './pdf'

export function setupAssociations() {
  User.hasMany(PDF, { foreignKey: 'userId' })
  PDF.belongsTo(User, { foreignKey: 'userId' })
}
