import { useMutation } from "@tanstack/react-query"
import type { UseMutationResult } from "@tanstack/react-query"
import { updateUser } from "../../services/api"

export const useUpdateUser = (): UseMutationResult<
  void,
  Error,
  { id: number; formData: FormData }
> => {
  return useMutation({
    mutationFn: ({ id, formData }) => updateUser({ id, formData }),
  })
}
