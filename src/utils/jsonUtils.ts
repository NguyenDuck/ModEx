export function json2buf(obj: any): Buffer {
  return Buffer.from(JSON.stringify(obj, null, 2));
}
