// src/hooks/users/useInsertUser.ts
import type { UseMutationResult } from "@tanstack/react-query"
import { useMutation } from "@tanstack/react-query"
import { insertUser } from "../../services/api"


export const useInsertUser = (): UseMutationResult<void, Error, FormData> => {
  return useMutation({
    mutationFn: (newUser: FormData) => insertUser(newUser),
  })
}
