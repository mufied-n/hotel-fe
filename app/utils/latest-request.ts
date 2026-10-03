export function createLatestRequestOwner() {
  let generation = 0
  return {
    begin() { return ++generation },
    isLatest(value: number) { return value === generation },
    invalidate() { generation++ },
  }
}
