import { writeFileSync } from "fs";

async function getAPOD() {
  const apiKey = process.env.API_KEY as string;
  const url = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}`;

  try {
    const res = await fetch(url);
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching APOD: ", error);
    throw error;
  }
}

// Get the current date suppose 2024-04-02 in the format 2nd April, 2024

const currentDate = new Date();
const day = currentDate.getDate();
let daySuffix;
if (day === 1 || day === 21 || day === 31) {
  daySuffix = "st";
} else if (day === 2 || day === 22) {
  daySuffix = "nd";
} else if (day === 3 || day === 23) {
  daySuffix = "rd";
} else {
  daySuffix = "th";
}

const formattedDate = `${day}${daySuffix} ${currentDate.toLocaleString('default', { month: 'long' })} ${currentDate.getFullYear()}`;


async function updateREADME(apodData: any) {
  const formatterDate = new Intl.DateTimeFormat("en-US", {
    dateStyle: "long",
  });
  const timestamp = new Date().toLocaleString();

  const content = `
  # NASA Astronomy Picture of the Day 🌌

  Discover the cosmos! Each day a different image or photograph of our fascinating universe is featured, along with a brief explanation written by a professional astronomer.

![NASA APOD](${apodData.hdurl})

## ${apodData.title}

${formattedDate}

### Explanation: 

${
  apodData && apodData.explanation
  ? apodData.explanation.split('NASA Coverage').join('\n### NASA Coverage')
  : "No explanation available."
}

> _Last Updated: ${timestamp} (in GMT)_
`;

  writeFileSync("README.md", content);
}

async function main() {
  try {
    const apodData = await getAPOD();
    await updateREADME(apodData);
  } catch (error) {
    console.error("Error: ", error);
  }
}

main();
