exports.DATABASE_URL = process.env.DATABASE_URL ||
                       global.DATABASE_URL ||
                      'mongodb://yulia:userpass@ds151951.mlab.com:51951/blog-api-yulia';
exports.PORT = process.env.PORT || 8080;