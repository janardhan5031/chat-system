
exports.ERROR_MESSAGES={
    INVALID_FILE_TYPE:"Invalid file type",

}

exports.getMimeType = (fileExtension) => {
    const acceptedMimeTypes= {
      jpeg: "image/jpeg",
      jpg: "image/jpeg",
      png: "image/png",
    };
  
    return acceptedMimeTypes[fileExtension.toLowerCase()] || null;
  };
