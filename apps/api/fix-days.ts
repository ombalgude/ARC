import { db } from "@arc/database";
import { sql } from "drizzle-orm";

async function run() {
  const daysRaw = await db.execute(sql`SELECT id, name, dayOfWeek FROM workout_days ORDER BY dayOfWeek ASC`);
  
  const daysArr = (daysRaw as any).rows || daysRaw;
  console.log("Found days:", daysArr.length);
  
  if (daysArr.length === 0) return;
  
  const totalDays = daysArr.length;
  const dayDistribution: Record<number, number[]> = {
    1: [3],
    2: [2, 4],
    3: [1, 3, 5],
    4: [1, 2, 4, 5],
    5: [1, 2, 3, 4, 5],
    6: [1, 2, 3, 4, 5, 6],
    7: [1, 2, 3, 4, 5, 6, 0]
  };
  
  const targetDays = dayDistribution[totalDays] || [1];
  
  for(let i=0; i<daysArr.length; i++) {
     console.log(`Updating ${daysArr[i].name} from day ${daysArr[i].dayOfWeek} to ${targetDays[i]}`);
     await db.execute(sql`UPDATE workout_days SET dayOfWeek = ${targetDays[i]} WHERE id = ${daysArr[i].id}`);
  }
  console.log("Successfully fixed day distribution in database without losing streak!");
}
run().catch(console.error);
