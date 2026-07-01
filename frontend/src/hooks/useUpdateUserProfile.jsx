import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const useUpdateUserProfile = () => {
  const queryClient = useQueryClient();

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
		
        queryClient.setQueryData(["authUser"], updatedUser);
		
        queryClient.setQueryData(
			["userProfile" , updatedUser.username],
			updatedUser,
        );
		toast.success("Profile updated successfully");
      },
    });

  return { updateProfile, isUpdatingProfile };
};

export default useUpdateUserProfile;
