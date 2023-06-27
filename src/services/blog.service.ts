import constants, { DB } from '../constants';
import mongoService from '../mongo/services/blog.service';
import sequelizeService from '../sequelize/services/blog.service';

const blogService = constants.DB_TYPE === DB.MONGODB ? mongoService : sequelizeService;

export default blogService;
