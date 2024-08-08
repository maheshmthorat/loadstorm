#!/usr/bin/env node
console.log("Welcome to LoadStorm! Starting load testing...");

import axios from "axios";
import chalk from "chalk";
import os from "os";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Parse command line arguments
const args = process.argv.slice(2);
const siteArg = args.find((arg) => arg.startsWith("--site="));
const requestsArg = args.find((arg) => arg.startsWith("--requests="));
const concurrencyArg = args.find((arg) => arg.startsWith("--concurrency="));
const headersArg = args.find((arg) => arg.startsWith("--headers="));
const methodArg = args.find((arg) => arg.startsWith("--method="));
const payloadArg = args.find((arg) => arg.startsWith("--payload="));
const detailedLogArg = args.find((arg) => arg.startsWith("--detailed-log="));
const detailedLog = detailedLogArg
  ? detailedLogArg.split("=")[1] === "true"
  : false;

if (!siteArg || !requestsArg || !concurrencyArg) {
  console.error(
    chalk.red(
      "Error: --site, --requests, and --concurrency options are required"
    )
  );
  process.exit(1);
}

const URL = siteArg.split("=")[1];
const NUM_REQUESTS = parseInt(requestsArg.split("=")[1], 10);
const CONCURRENCY = parseInt(concurrencyArg.split("=")[1], 10);
const HEADERS = headersArg ? JSON.parse(headersArg.split("=")[1]) : {};
const METHOD = methodArg ? methodArg.split("=")[1].toUpperCase() : "GET";
const PAYLOAD = payloadArg ? JSON.parse(payloadArg.split("=")[1]) : null;

if (isNaN(NUM_REQUESTS) || isNaN(CONCURRENCY)) {
  console.error(
    chalk.red("Error: --requests and --concurrency options must be numbers")
  );
  process.exit(1);
}

// Function to make a request and measure response time
async function makeRequest() {
  const startTime = Date.now();
  try {
    await axios({
      method: METHOD,
      url: URL,
      headers: HEADERS,
      data: PAYLOAD,
    });
    const endTime = Date.now();
    return { timeTaken: endTime - startTime, startTime, endTime };
  } catch (error) {
    const endTime = Date.now();
    const timeTaken = endTime - startTime;
    console.error(
      chalk.red(`Error: ${error.message}, Time Taken: ${timeTaken} ms`)
    );
    return { timeTaken, startTime, endTime };
  }
}

// Function to run the load test
async function runLoadTest() {
  const promises = [];
  const responseTimes = [];
  const startTime = Date.now();

  console.log(
    chalk.bold(
      `Running ${NUM_REQUESTS} requests with a concurrency level of ${CONCURRENCY} for ${URL}.`
    )
  );

  // Function to simulate a loading animation
  function loadingAnimation() {
    const frames = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];
    let i = 0;
    return setInterval(() => {
      process.stdout.write("\r" + frames[i]);
      i = (i + 1) % frames.length;
    }, 80);
  }

  const loadingInterval = loadingAnimation();

  let j = 0;
  for (let i = 0; i < NUM_REQUESTS; i++) {
    promises.push(
      makeRequest().then(({ timeTaken, startTime, endTime }) => {
        responseTimes.push(timeTaken);
        // Calculate progress
        const progress = ((responseTimes.length / NUM_REQUESTS) * 100).toFixed(
          2
        );
        process.stdout.write(`\rProgress: ${progress}%`);

        if (detailedLog) {
          j++;
          console.log(chalk.bold(` Request ${j}: ${timeTaken} ms`));
        }

        return { startTime, endTime };
      })
    );

    if (promises.length >= CONCURRENCY) {
      await Promise.all(promises);
      promises.length = 0;
    }
  }

  // Wait for the last batch of requests to complete
  if (promises.length > 0) {
    await Promise.all(promises);
  }

  clearInterval(loadingInterval); // Stop the loading animation

  const endTime = Date.now();
  const totalTime = endTime - startTime;

  console.log(chalk.bgGreen.bold(`\nLoad test completed successfully!`));
  console.log(chalk.cyan.bold(`\n\n📊 REPORT`));

  return { responseTimes, totalTime, startTime, endTime };
}

function getEnvironmentDetails() {
  const hostname = os.hostname();
  const osType = `${os.type()} ${os.release()}`;
  const cpuInfo = os.cpus()[0].model;
  const memory = `${(os.totalmem() / (1024 * 1024 * 1024)).toFixed(2)} GB`;
  return `Hostname: ${hostname}
                       | Operating System: ${osType}
                       | CPU Model: ${cpuInfo}
                       | Memory: ${memory}`;
}

const environmentDetails = getEnvironmentDetails();
async function measureDownloadSpeed(url) {
  const startTime = Date.now();
  const response = await axios({
    url: url,
    method: "GET",
    responseType: "stream",
  });

  // Pipe the response stream to a writable file stream
  const filePath = path.join(
    fileURLToPath(import.meta.url),
    "..",
    "download.tmp"
  );
  const writer = fs.createWriteStream(filePath);
  response.data.pipe(writer);

  return new Promise((resolve, reject) => {
    writer.on("finish", () => {
      const endTime = Date.now();
      const duration = endTime - startTime; // in milliseconds
      const fileSize = fs.statSync(filePath).size; // in bytes
      const speedMbps = (fileSize / (duration / 1000) / (1024 * 1024)).toFixed(
        2
      ); // convert to Mbps
      fs.unlinkSync(filePath); // delete the temporary file
      resolve(speedMbps);
    });
    writer.on("error", reject);
  });
}

async function runSpeedTest() {
  try {
    const url =
      "https://download.support.xerox.com/pub/docs/FlowPort2/userdocs/any-os/en/fp_dc_setup_guide.pdf";
    const downloadSpeedMbps = await measureDownloadSpeed(url);
    return `Download Speed: ${downloadSpeedMbps} Mbps`;
  } catch (error) {
    return "Error during speed test:", error.message;
  }
}

function calculatePercentiles(data, percentiles) {
  data.sort((a, b) => a - b);
  const results = {};
  for (const percentile of percentiles) {
    const index = Math.ceil((percentile / 100) * data.length) - 1;
    results[percentile] = data[index];
  }
  return results;
}

// Start the load test
runLoadTest()
  .then(async ({ responseTimes, totalTime, startTime, endTime }) => {
    const speedReport = await runSpeedTest();
    const totalTimeSeconds = (totalTime / 1000).toFixed(2);
    const totalTimeMs = responseTimes.reduce((sum, time) => sum + time, 0);
    const averageTime = totalTimeMs / responseTimes.length / 1000;
    const percentiles = calculatePercentiles(responseTimes, [90, 95, 99]);

    // Construct the report including OS details
    const report = `
───────────────────────┬──────────────────────────────────────────────────────
 Metric                │ Value
───────────────────────┼──────────────────────────────────────────────────────
 URL                   │ ${URL}
 Number of Requests    │ ${NUM_REQUESTS}
 Concurrency Level     │ ${CONCURRENCY}
 Start Time            │ ${new Date(startTime).toLocaleString()}
 End Time              │ ${new Date(endTime).toLocaleString()}
 Total Time            │ ${totalTimeSeconds} seconds
 Average Response Time │ ${averageTime.toFixed(2)} seconds
 90th Percentile       │ ${percentiles[90]} ms
 95th Percentile       │ ${percentiles[95]} ms
 99th Percentile       │ ${percentiles[99]} ms
───────────────────────┼──────────────────────────────────────────────────────
 Internet Speed        │ ${speedReport}
───────────────────────┼──────────────────────────────────────────────────────
 System Details        | ${environmentDetails}
───────────────────────┴──────────────────────────────────────────────────────
    `;

    // Print the report
    console.log(report.trim());

    console.log(`Thanks for using LoadStorm by ${chalk.bold("Mahesh Thorat")}`);
    console.log(
      "If you find LoadStorm useful, consider donating: https://pages.razorpay.com/maheshmthorat"
    );
  })
  .catch((error) => {
    console.error(chalk.red(`Load test failed: ${error.message}`));
  });
