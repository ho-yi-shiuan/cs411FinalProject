import {} from "./api";

// Get pet list 目前根本沒用到
export const getAllPet = () => {
    return api.get(
      "/pet",
    );
  };