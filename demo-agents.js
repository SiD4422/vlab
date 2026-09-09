import puppeteer from 'puppeteer';

const delay = (ms) => new Promise(res => setTimeout(res, ms));

async function runDemo() {
  console.log("Launching visible browser for demo...");
  const browser = await puppeteer.launch({ 
    headless: false, 
    defaultViewport: null,
    args: ['--start-maximized', '--window-position=0,0']
  });

  async function simulateStudent(studentNum, experimentsToRun) {
    const page = await browser.newPage();
    // Bring page to front
    await page.bringToFront();
    
    console.log(`Agent ${studentNum} logging in...`);
    await page.goto(`http://localhost:5173/?testLogin=${studentNum}`);
    await delay(3000); 

    for (let i = 0; i < experimentsToRun; i++) {
      console.log(`Agent ${studentNum} starting experiment ${i+1}...`);
      await page.goto('http://localhost:5173/student');
      
      // Wait for at least one card to load
      try {
        await page.waitForFunction(() => {
          return Array.from(document.querySelectorAll('button')).some(b => 
            b.textContent.includes('Launch lab module') || b.textContent.includes('Continue lab')
          );
        }, { timeout: 15000 });
      } catch (e) {
        console.log("Experiments did not load in time!");
        break;
      }
      
      await delay(1000);

      // Find experiment cards
      const cards = await page.$$('button');
      let expCards = [];
      for(let btn of cards) {
          const txt = await page.evaluate(el => el.textContent, btn);
          if (txt && (txt.includes('Launch lab module') || txt.includes('Continue lab'))) {
              expCards.push(btn);
          }
      }

      if (expCards.length > i) {
        await expCards[i].click();
        await delay(3000);
      } else {
        console.log("Not enough cards found for index", i);
        break;
      }

      // Do Pre-test
      console.log(`Agent ${studentNum} doing Pre-test...`);
      try {
        const tabs = await page.$$('button');
        for (let btn of tabs) {
          if ((await page.evaluate(el => el.textContent, btn)).includes('Pre-test')) {
             await btn.click(); break;
          }
        }
        await delay(1000);
        
        const options = await page.$$('input[type="radio"]');
        for (let j = 0; j < Math.min(3, options.length); j++) {
            await page.evaluate(el => el.click(), options[j]);
            await delay(500);
        }
        
        const submitPre = await page.$$('button');
        for (let btn of submitPre) {
          if ((await page.evaluate(el => el.textContent, btn)).includes('Submit Quiz')) {
             await btn.click(); break;
          }
        }
        await delay(1500);
      } catch (e) { }

      // Lab Report
      console.log(`Agent ${studentNum} submitting Lab Report...`);
      try {
        const tabs = await page.$$('button');
        for (let btn of tabs) {
          if ((await page.evaluate(el => el.textContent, btn)).includes('Lab Report')) {
             await btn.click(); break;
          }
        }
        await delay(1000);
        
        const submits = await page.$$('button');
        for (let btn of submits) {
          if ((await page.evaluate(el => el.textContent, btn)).includes('Submit Final Report')) {
             await btn.click(); break;
          }
        }
        await delay(2000);
      } catch (e) { }
    }
    
    await page.close();
  }

  await simulateStudent("1", 3);
  await simulateStudent("2", 4);
  await simulateStudent("3", 1);

  console.log("Teacher logging in to review...");
  const teacherPage = await browser.newPage();
  await teacherPage.bringToFront();
  await teacherPage.goto('http://localhost:5173/?testLogin=teacher');
  
  try {
    await teacherPage.waitForFunction(() => {
      return Array.from(document.querySelectorAll('button')).some(b => 
        b.textContent.includes('Submissions')
      );
    }, { timeout: 10000 });
    
    await delay(1000);
    const navButtons = await teacherPage.$$('button');
    for (const btn of navButtons) {
      if ((await teacherPage.evaluate(el => el.textContent, btn)).includes('Submissions')) {
        await btn.click();
        break;
      }
    }
  } catch (e) { }
  
  console.log("Demo finished! Leaving browser open.");
}

runDemo().catch(console.error);