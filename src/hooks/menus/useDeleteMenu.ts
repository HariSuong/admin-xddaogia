// useDeletePost.ts
import { useMutation } from "@tanstack/react-query"
import { deleteMenu } from "../../services/api-menu"

// Custom hook to delete a post
export const useDeleteMenu = () => {
  return useMutation({
    mutationFn: (id: number) => deleteMenu(id),
  })
}
