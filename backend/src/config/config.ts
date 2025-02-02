interface Config {
  port: number;
  cors: {
    origin: string[];
    methods: string[];
  };
  database: {
    path: string;
  };
}

const development: Config = {
  port: 3001,
  cors: {
    origin: ['http://localhost:5173'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  },
  database: {
    path: './data/products.json',
  },
};

const production: Config = {
  port: Number(process.env.PORT) || 3001,
  cors: {
    origin: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : ['https://bic-quotation.example.com'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  },
  database: {
    path: process.env.DB_PATH || './data/products.json',
  },
};

const config: { [key: string]: Config } = {
  development,
  production,
};

export default config[process.env.NODE_ENV || 'development'];
