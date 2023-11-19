import React, { useState } from "react";

const useHandleImg = () => {
  const [imgPreview, setImgPreview] = useState("");

  function handleImgChange(e) {
    const file = e.target.files[0];
    if (file.size >= 1048576) {
      alert("file size exceeds");
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
