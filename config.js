exports.DATABASE_URL = process.env.DATABASE_URL ||
                       global.DATABASE_URL ||
                      'mlab.com/databases/blog-api-yulia';
exports.PORT = process.env.PORT || 8080;