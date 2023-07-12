import axios from "axios";

const baseUrl = "http://localhost:3001/api/images";

const uploadImage = async (file: File, userId: number | undefined) => {
  const formData = new FormData();
  formData.append("image", file);
  // formData.append("userId", userId !== undefined ? String(userId) : "");
  formData.append("userId", String(userId));

  console.log("file, userID", file, userId);
  const entries = Array.from(formData.entries());
  for (const entry of entries) {
    console.log("FormData Entry:", entry);
  }

  const config = {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  };

  try {
    const response = await axios.post(baseUrl, formData, config);
    return response.data;
  } catch (error: unknown) {
    console.log("img upload error", error);
  }
};

const userPhotos = (userId: number | undefined) => {
  console.log("getPhotos", userId);
  const config = {
    params: {
      userId: String(userId),
    },
  };
  const req = axios.get(baseUrl, config);
  return req.then((response) => response.data);
};

const imageService = { uploadImage, userPhotos };

export default imageService;
