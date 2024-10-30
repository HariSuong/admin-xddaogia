// useMenus.ts
import type { UseMutationResult } from "@tanstack/react-query"
import { useMutation } from "@tanstack/react-query"
import { insertMenu } from "../../services/api-menu"

// Custom hook sử dụng mutation để gọi API chèn bài viết
export const useInsertMenu = (): UseMutationResult<void, Error, FormData> => {
  return useMutation({
    mutationFn: (menuData: FormData) => insertMenu(menuData),
  })
}
