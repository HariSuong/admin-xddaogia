// src/hooks/users/useDeleteUser.ts
import { useMutation } from "@tanstack/react-query"
import type { UseMutationResult } from "@tanstack/react-query"

import { deleteUser } from "../../services/api"

export const useDeleteUser = (): UseMutationResult<any, Error, number> => {
  return useMutation({
    mutationFn: (id: number) => deleteUser(id),
  })
}
