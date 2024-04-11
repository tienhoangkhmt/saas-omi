
// kiểm tra nếu userId trong từng item chat trùng với userId trong account thì trả về background màu xanh
type PGetBgMess = {
  userId?: number | string,
  currentUserId?: number | string | undefined,
  isNote?: boolean
}

export const getBgMess = ({ userId = undefined, currentUserId = undefined, isNote = false }: PGetBgMess): string => {

  if(isNote) return 'yellow';

  if(currentUserId === userId && (currentUserId && currentUserId)) return 'blue.500';

  return 'red.500'
}
