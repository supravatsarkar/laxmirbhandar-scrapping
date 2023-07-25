const puppeteer = require("puppeteer");

const config = {
  mobileNo: process.env.MOBILE_NO,
  otp: process.env.OTP,
};
console.log("config ==>", config);

(async () => {
  // Launch the browser and open a new blank page
  const browser = await puppeteer.launch({
    // executablePath: chromiumExecutablePath,
    // headless: false,
  });
  const page = await browser.newPage();

  // Navigate the page to a URL
  await page.goto("https://socialsecurity.wb.gov.in/");

  // Set screen size
  await page.setViewport({ width: 1080, height: 1024 });

  // Type into search box

  await page.type("#mobile_no", config.mobileNo);
  await page.type("#login_otp", config.otp);

  // Wait and click on first result
  const submitButtonSelector = ".btnlogin";
  await page.waitForSelector(submitButtonSelector);
  await page.click(submitButtonSelector);

  const PDSAadhaarList = "#pdsnamemismatchlist";
  await page.waitForSelector(PDSAadhaarList);
  await page.click(PDSAadhaarList);

  page.on("dialog", async (dialog) => {
    // Check if the dialog is a confirmation
    if (dialog.type() === "confirm") {
      // Accept the confirmation by clicking "OK"
      await dialog.accept();
    }
  });
  let count = 0;

  while (true) {
    const startTime = performance.now();
    await page.waitForSelector(".btn-primary");
    const elements = await page.$$(".btn-primary");

    // Click a specific element from the list
    if (elements.length > 0) {
      await elements[0].click();
    }

    // Wait for page to load
    await page.waitForSelector("#submit");
    // await page.waitForNavigation({ waitUntil: "load" });

    await page.$$eval(
      "input",
      (inputs, value) => {
        for (const input of inputs) {
          if (input.value === value) {
            input.click();

            break;
          }
        }
      },
      "1"
    );

    const finalSubmit = "#submit";
    await page.waitForSelector(finalSubmit);

    await page.click(finalSubmit);
    count++;
    const endTime = performance.now();
    const executionTimeInMilliseconds = endTime - startTime;
    // Step 5: Convert execution time to seconds
    const executionTimeInSeconds = executionTimeInMilliseconds / 1000;
    console.log(
      `~DONE~ count-${count} ==>Execution Time-${Math.ceil(
        executionTimeInSeconds
      )}`
    );
  }

  //   await browser.close();
})();
