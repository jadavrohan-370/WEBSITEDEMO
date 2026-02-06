import cloudinary from "./utils/cloudinary.js";

async function testCloudinary() {
  try {
    const result = await cloudinary.api.ping();
    console.log("Cloudinary Ping Result:", result);
  } catch (error) {
    console.error("Cloudinary Ping Error:", error);
  }
}

testCloudinary();
