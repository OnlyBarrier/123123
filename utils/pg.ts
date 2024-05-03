import { Pool } from 'pg';

const connectionString = 'postgresql://postgres:0579@localhost:5432/transalmaweb?schema=public';

const pool = new Pool({
  connectionString: connectionString,
});

export default pool;