const fs = require("fs");
const { exec } = require("child_process");

// Array of MP3 file links
const mp3Links = [
  "link1.mp3",
  "link2.mp3",
  // Add more links as needed
];

// Function to download each MP3 file
const downloadMP3 = (link, index) => {
  const fileName = `temp${index}.mp3`;
  exec(`curl -o ${fileName} ${link}`, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error downloading ${link}: ${error.message}`);
    } else {
      console.log(`Downloaded: ${fileName}`);
      if (index === mp3Links.length - 1) {
        // If it's the last file, start the joining process
        joinMP3Files();
      }
    }
  });
};

// Function to join all downloaded MP3 files
const joinMP3Files = () => {
  const joinedFileName = "joined.mp3";
  const fileList = mp3Links.map((link, index) => `temp${index}.mp3`).join("|");
  exec(`ffmpeg -i "concat:${fileList}" -acodec copy ${joinedFileName}`, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error joining MP3 files: ${error.message}`);
    } else {
      console.log(`Joined MP3 files: ${joinedFileName}`);
      // Clean up temporary files
      mp3Links.forEach((link, index) => {
        const fileName = `temp${index}.mp3`;
        fs.unlinkSync(fileName);
      });
    }
  });
};

// Start downloading MP3 files
mp3Links.forEach(downloadMP3);
