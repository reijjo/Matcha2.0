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

const deleteImage = (id: number) => {
  const req = axios.delete(baseUrl, {
    params: {
      id: id,
    },
  });
  return req.then((response) => response.data);
};

const updateProfilePic = (id: number) => {
  console.log("AXIOS", id);
  const req = axios.put(baseUrl, { imgId: id });
  return req.then((response) => response.data);
};

const getAll = () => {
  const req = axios.get(`${baseUrl}/all`);
  return req.then((response) => response.data);
};

const getImage = (id: string) => {
  const req = axios.get(`${baseUrl}/photos/${id}`);
  return req.then((response) => response.data);
};

const getAvatar = (id: string) => {
  const req = axios.get(`${baseUrl}/avatar/${id}`);
  return req.then((response) => response.data);
};

const imageService = {
  uploadImage,
  userPhotos,
  deleteImage,
  updateProfilePic,
  getAll,
  getImage,
  getAvatar,
};

export default imageService;
