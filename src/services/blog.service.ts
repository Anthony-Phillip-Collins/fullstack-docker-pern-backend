import constants from '../constants';
import mongoService from '../mongo/services/blog.service';
import sequelizeService from '../sequelize/services/blog.service';

const blogService = constants.IS_MONGODB ? mongoService : sequelizeService;

export default blogService;
