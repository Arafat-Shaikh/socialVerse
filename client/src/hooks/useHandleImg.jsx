import React, { useState } from "react";

const useHandleImg = () => {
  const [imgPreview, setImgPreview] = useState("");

  function handleImgChange(e) {
    const file = e.target.files[0];

    const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      alert("Not an image");
    } else {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImgPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  }
  return { handleImgChange, imgPreview, setImgPreview };
};

export default useHandleImg;
