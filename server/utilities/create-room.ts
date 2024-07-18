import { randomUUID } from "crypto";

function Createroom() {
  const room = randomUUID();
  return String(room.slice(0, 10));
}

export default Createroom;
