import React, { useState, useEffect } from "react";
import { FileUploader } from "react-drag-drop-files";

const fileTypes = ["geojson"];

function AOIFileUpload({ onFileLoad, onError}) {
  const [file, setFile] = useState(null);
  const handleChange = (file) => {
    setFile(file);
  };

  useEffect(() => {
    if (file) {
      var reader = new FileReader();
      reader.readAsText(file, "UTF-8");
      reader.onload = function (evt) {
        onFileLoad({
          data: evt.target.result,
          name: file.name
        })
      }
      reader.onerror = function (evt) {
        onError();
      }
    }
  }, [file]);

  return (
    <FileUploader classes={"fileUploadDropArea"} handleChange={handleChange} name="file" types={fileTypes} />
  );
}

export default AOIFileUpload;
