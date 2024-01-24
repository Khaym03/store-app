export const fullDate = () => {
  const date = new Date()

  return [date.getDate(), date.getMonth(), date.getFullYear()]
    .map(n => {
      if (n === 0) n++
      if (n < 10) return '0' + n
      return n
    })
    .join('-')
}
