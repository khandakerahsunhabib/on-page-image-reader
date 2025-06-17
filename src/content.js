(function () {
  let tooltipEnabled = true;
  let tooltipElement = null;
  let hideTooltipTimeout = null;

  const images = document.querySelectorAll("img");
  images.forEach((img) => {
    img.addEventListener("mouseover", async function (event) {
      if (!tooltipEnabled) return;
      if (tooltipElement) {
        tooltipElement.remove();
        clearTimeout(hideTooltipTimeout);
      }
      const existingDetails = document.getElementById("imageDetailsTooltip");
      if (existingDetails) {
        existingDetails.remove();
      }

      tooltipElement = document.createElement("div");
      tooltipElement.id = "imageDetailsTooltip";

      let imageName = img.src.split("/").pop();
      imageName = imageName.replace(/\.[^/.]+$/, "");

      let imageSizeKB = 0;
      try {
        const response = await fetch(img.src);
        const blob = await response.blob();
        imageSizeKB = (blob.size / 1024).toFixed(2);
      } catch (e) {
        console.error("Error fetching image size:", e);
      }

      const imageWidth = img.naturalWidth;
      const imageHeight = img.naturalHeight;
      let sizeColor = "green";

      if (imageWidth <= 690 && imageHeight <= 450) {
        sizeColor = imageSizeKB > 100 ? "red" : "green";
      } else if (imageWidth <= 690 && imageHeight > 450) {
        sizeColor = imageSizeKB > 100 ? "red" : "green";
      } else {
        imageWidth > 690 && imageHeight > 450;
        sizeColor = imageSizeKB > 300 ? "red" : "green";
      }

      tooltipElement.innerHTML = `
  <div class="image-details-dialog-box">
    <div class="image-details-header">Image Details
      <button id="closeTooltip" class="close-button">X</button>
    </div>
    <div class="image-details-body">
      <div class="detail-row">
        <img src="${chrome.runtime.getURL(
          "assets/url.png"
        )}" alt="Url icon" class="detail-icon">
        <span class="detail-text"><strong>URL:</strong> ${img.src}</span>
      </div>
      <div class="detail-row">
        <img src="${chrome.runtime.getURL(
          "assets/resolution.png"
        )}" alt="Resolution icon" class="detail-icon">
        <span class="detail-text"><strong>Resolution:</strong> ${
          img.naturalWidth
        }</span>
        <span>x${img.naturalHeight}</span>
      </div>
      <div class="detail-row">
        <img src="${chrome.runtime.getURL(
          "assets/byte.png"
        )}" alt="Size icon" class="detail-icon">
        <span class="detail-text"><strong>Size:</strong> <span style="color: ${sizeColor};">${imageSizeKB} KB</span></span>
      </div>
      <div class="detail-row">
        <img src="${chrome.runtime.getURL(
          "assets/title.png"
        )}" alt="Title icon" class="detail-icon">
        <span class="detail-text"><strong>Title:</strong> ${img.title}</span>
      </div>
      <div class="detail-row">
        <img src="${chrome.runtime.getURL(
          "assets/image-name.png"
        )}" alt="Name icon" class="detail-icon">
        <span class="detail-text"><strong>Name:</strong> ${imageName}</span>
      </div>
      <div class="detail-row">
        <img src="${chrome.runtime.getURL(
          "assets/alt.png"
        )}" alt="Alt text icon" class="detail-icon">
        <span class="detail-text"><strong>Alt Text:</strong> ${img.alt}</span>
      </div>
      <div class="button-wrapper">
        <div id="btn-primary">COPY IMAGE NAME</div>
        <div id="btn-secondary">DOWNLOAD IMAGE</div>
        <div id="copyStatus"></div>
      </div>
    </div>
  </div>
`;

      document.body.appendChild(tooltipElement);
      const rect = img.getBoundingClientRect();
      tooltipElement.style.top = `${rect.top + window.scrollY + img.height}px`;
      tooltipElement.style.left = `${rect.left + window.scrollX}px`;

      const copyButton = tooltipElement.querySelector("#btn-primary");
      const copyStatus = tooltipElement.querySelector("#copyStatus");
      copyButton.addEventListener("click", function () {
        navigator.clipboard
          .writeText(imageName)
          .then(() => {
            copyStatus.innerHTML =
              '<svg xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" width="30" height="30" x="0" y="0" viewBox="0 0 128 128" style="enable-background:new 0 0 20 20" xml:space="preserve" class=""><g><path fill="#0db577" d="M124 64c0 5.12-6.29 9.34-7.55 14.06-1.3 4.88 1.99 11.68-.48 15.95-2.51 4.34-10.06 4.86-13.58 8.38s-4.04 11.07-8.38 13.58c-4.27 2.47-11.07-.82-15.95.48C73.34 117.71 69.12 124 64 124s-9.34-6.29-14.06-7.55c-4.88-1.3-11.68 1.99-15.95-.48-4.34-2.51-4.86-10.06-8.38-13.58s-11.07-4.04-13.58-8.38c-2.47-4.27.82-11.07-.48-15.95C10.29 73.34 4 69.12 4 64s6.29-9.34 7.55-14.06c1.3-4.88-1.99-11.68.48-15.95 2.51-4.34 10.06-4.86 13.58-8.38s4.04-11.07 8.38-13.58c4.27-2.47 11.07.82 15.95-.48C54.66 10.29 58.88 4 64 4s9.34 6.29 14.06 7.55c4.88 1.3 11.68-1.99 15.95.48 4.34 2.51 4.86 10.06 8.38 13.58s11.07 4.04 13.58 8.38c2.47 4.27-.82-11.07.48-15.95C117.71 54.66 124 58.88 124 64z" opacity="1" data-original="#2568ef" class=""></path><path fill="#fffcee" d="M81.34 46.12 58.5 68.96 46.66 57.13a6.585 6.585 0 0 0-9.31 0 6.585 6.585 0 0 0 0 9.31l16.61 16.61a6.41 6.41 0 0 0 9.06 0l27.62-27.62a6.585 6.585 0 0 0 0-9.31 6.573 6.573 0 0 0-9.3 0z" opacity="1" data-original="#fffcee" class=""></path></g></svg>';
            setTimeout(() => {
              copyStatus.innerHTML = "";
            }, 2000);
          })
          .catch((err) => {
            copyStatus.textContent = "Failed to copy";
            setTimeout(() => {
              copyStatus.textContent = "";
            }, 2000);
          });
      });

      const downloadButton = tooltipElement.querySelector("#btn-secondary");
      downloadButton.addEventListener("click", function () {
        const link = document.createElement("a");
        link.href = img.src;
        link.download = imageName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      });
      const closeButton = tooltipElement.querySelector("#closeTooltip");
      closeButton.addEventListener("click", function () {
        tooltipElement.remove();
        tooltipElement = null;
        tooltipEnabled = false;
      });
      tooltipElement.addEventListener("mouseenter", function () {
        clearTimeout(hideTooltipTimeout);
      });
      tooltipElement.addEventListener("mouseleave", function () {
        hideTootipWithDelay();
      });
      img.addEventListener("mouseleave", hideTootipWithDelay);
    });
    function hideTootipWithDelay() {
      hideTooltipTimeout = setTimeout(() => {
        if (tooltipElement) {
          tooltipElement.remove();
          tooltipElement = null;
        }
      }, 300);
    }
  });
})();
