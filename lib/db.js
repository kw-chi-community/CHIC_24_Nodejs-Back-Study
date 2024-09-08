// lowdb 라이브러리를 이용하여 JSON 파일을 DB처럼 사용
import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";

const adapter = new JSONFile("db.json");
const defaultData = { users: [], topics: [] };
const db = new Low(adapter, defaultData);

await db.read();

db.data ||= defaultData;

await db.write();

export default db;
