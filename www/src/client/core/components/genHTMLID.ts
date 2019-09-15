let id = 0;

export function genHTMLID() {
  id += 1;
  return `el-${id}`;
}
