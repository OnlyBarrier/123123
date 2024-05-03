import pool from '../../../../utils/pg';
import { NextRequest, NextResponse } from 'next/server';

export const POST = async (req: Request, res: NextResponse) => {
  try {
    const { consult, pass } = await req.json();
    const modConsult = consult.slice(1, -1);
    if (pass === '456rty$%&') {
      console.log('step 2');
      const client = await pool.connect();
      const result = await client.query(modConsult);
      client.release();
      return NextResponse.json({ result: result.rows }, { status: 200 });
    } else {
      return NextResponse.json({ message: 'Incorrect Password' }, { status: 501 });
    }
  } catch (error) {
    console.error('Error al ejecutar la consulta:', error);
    return NextResponse.json({ message: 'Error', error }, { status: 500 });
  }
};