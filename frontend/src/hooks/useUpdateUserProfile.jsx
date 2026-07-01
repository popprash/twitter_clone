import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "../components/common/ToastProvider";

const useUpdateUserProfile = () => {
  const queryClient = useQueryClient();
  const toast = useToast();

  const { mutateAsync: updateProfile, isPending: isUpdatingProfile } =
    useMutation({
      mutationFn: async (formData) => {
        try {
          const res = await fetch(`/api/users/update`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
          });
          const data = await res.json();
          if (!res.ok) {
            console.log(data.message);
            throw new Error(data.message || "Something went wrong");
          }
          return data;
        } catch (error) {
          throw new Error(error.message);
        }
      },
      onSuccess: (updatedUser) => {
        const previousAuthUser = queryClient.getQueryData(["authUser"]);

        queryClient.setQueryData(["authUser"], updatedUser);
        queryClient.setQueryData(["userProfile", updatedUser.username], updatedUser);

        if (
          previousAuthUser?.username &&
          previousAuthUser.username !== updatedUser.username
        ) {
          queryClient.setQueryData(
            ["userProfile", previousAuthUser.username],
            updatedUser,
          );
        }

        queryClient.invalidateQueries({ queryKey: ["userProfile"] });
        toast.success("Profile updated successfully");
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });

  return { updateProfile, isUpdatingProfile };
};

export default useUpdateUserProfile;
