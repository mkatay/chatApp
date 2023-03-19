import Resizer from "react-image-file-resizer";

export const getBase64FromUrl = async (url) => {
    const data = await fetch(url);
    const blob = await data.blob();
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(blob); 
      reader.onloadend = () => {
        const base64data = reader.result;   
        resolve(base64data);
      }
    });
  }
  


export const resizeFile = (file) =>
  new Promise((resolve) => {
    Resizer.imageFileResizer(
      file,
      100,//max width
      100,//max height
      "JPEG",//format
      100,//quality
      0,
      (uri) => {
        resolve(uri);
      },
      "file"//output format
    );
  });