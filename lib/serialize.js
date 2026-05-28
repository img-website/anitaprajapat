// Convert Mongoose docs / ObjectIds / Dates into plain JSON-safe objects
// so they can cross the Server -> Client component boundary safely.
export function serialize(value) {
  return JSON.parse(JSON.stringify(value));
}
