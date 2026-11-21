import 'dotenv/config'
import pg from 'pg'

// pg returns DECIMAL as strings by default; turn them into numbers.
pg.types.setTypeParser(1700, v => parseFloat(v))

export const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL })
export const q = (text, params) => pool.query(text, params)
