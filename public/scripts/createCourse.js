generateUniqueFilename = function (originalFilename) {
  const parts = originalFilename.split(".");
  const extension = parts.length > 1 ? parts.pop() : "";
  if (!extension) {
    throw new Error("Invalid filename");
  }
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000);
  return `${timestamp}-${random}.${extension}`;
};

document
  .getElementById("createCourseForm")
  .addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const imageFile = document.querySelector("#imgUrl").files[0];
    if (!imageFile) {
      console.log("No image file provided");
      return;
    }
    const uniqueFilename = generateUniqueFilename(imageFile.name);

    formData.set("imgUrl", imageFile, uniqueFilename);

    const response = await fetch("/mentors/create-course", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      console.error("Failed to create course", response);
    } else {
      console.log("Course created successfully");
      window.location.href = "/mentors";
    }
  });
