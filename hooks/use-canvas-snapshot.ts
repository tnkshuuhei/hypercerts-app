"use client";
import html2canvas from "html2canvas";

const useCanvasSnapshot = () => {
  const takeSnapshot = async (id: string) => {
    const element = document.getElementById(id);
    if (!element) {
      return;
    }
    const canvas = await html2canvas(element, {
      logging: true,
      backgroundColor: null,
      //useCORS: true,
      proxy: "https://cors-proxy.hypercerts.workers.dev/",
      imageTimeout: 1000,
    });

    const image = canvas.toDataURL("image/png", 1.0);
    return image;
  };

  return { takeSnapshot };
};

export { useCanvasSnapshot };
