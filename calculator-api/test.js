const http = require('http');
const mongoose = require('mongoose');
const { app, server } = require('./server');

const PORT = process.env.PORT || 3000;
const BASE_URL = `http://localhost:${PORT}`;

// Helper function to make HTTP requests
function request(path, options = {}) {
  return new Promise((resolve, reject) => {
    const url = `${BASE_URL}${path}`;
    const req = http.request(url, options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          resolve({ status: res.statusCode, data: parsed, raw: body });
        } catch (e) {
          resolve({ status: res.statusCode, data: body, raw: body });
        }
      });
    });
    req.on('error', reject);
    req.end();
  });
}

async function runTests() {
  console.log('\n======================================================');
  console.log('       BEGINNER CALCULATOR REST API TEST SUITE        ');
  console.log('======================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition, message, detail = '') {
    if (condition) {
      console.log(`  ✅ PASS: ${message}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${message}`);
      if (detail) console.error(`     Detail: ${detail}`);
      failed++;
    }
  }

  try {
    // 1. Test Root Documentation
    console.log('1. Testing Documentation Endpoint (GET /)...');
    const docRes = await request('/');
    assert(docRes.status === 200, 'GET / returns HTTP 200');
    assert(docRes.data.endpoints && docRes.data.endpoints['GET /api/add?num1=10&num2=5'], 'Endpoints catalog is provided');

    // 2. Test ADD (GET /api/add)
    console.log('\n2. Testing ADD Endpoints...');
    // Query params
    const addRes1 = await request('/api/add?num1=15&num2=35');
    assert(addRes1.status === 200 && addRes1.data.result === 50, '15 + 35 = 50 via query params (?num1=15&num2=35)');
    assert(addRes1.data.expression === '15 + 35 = 50', 'Expression string is accurate ("15 + 35 = 50")');

    // Path params + Negative numbers
    const addRes2 = await request('/api/add/-10/25');
    assert(addRes2.status === 200 && addRes2.data.result === 15, '-10 + 25 = 15 via path params (/-10/25)');

    // Decimals
    const addRes3 = await request('/api/add?a=0.1&b=0.2');
    assert(addRes3.status === 200 && addRes3.data.result === 0.3, '0.1 + 0.2 = 0.3 floating point precision handled');

    // 3. Test SUBTRACT (GET /api/subtract)
    console.log('\n3. Testing SUBTRACT Endpoints...');
    const subRes1 = await request('/api/subtract?num1=50&num2=20');
    assert(subRes1.status === 200 && subRes1.data.result === 30, '50 - 20 = 30 via query params');

    const subRes2 = await request('/api/subtract/10/25');
    assert(subRes2.status === 200 && subRes2.data.result === -15, '10 - 25 = -15 via path params');

    // 4. Test MULTIPLY (GET /api/multiply)
    console.log('\n4. Testing MULTIPLY Endpoints...');
    const mulRes1 = await request('/api/multiply?num1=7&num2=8');
    assert(mulRes1.status === 200 && mulRes1.data.result === 56, '7 × 8 = 56 via query params');

    const mulRes2 = await request('/api/multiply/-4/5');
    assert(mulRes2.status === 200 && mulRes2.data.result === -20, '-4 × 5 = -20 via path params');

    // 5. Test DIVIDE (GET /api/divide)
    console.log('\n5. Testing DIVIDE Endpoints...');
    const divRes1 = await request('/api/divide?num1=100&num2=4');
    assert(divRes1.status === 200 && divRes1.data.result === 25, '100 ÷ 4 = 25 via query params');

    const divRes2 = await request('/api/divide/15/2');
    assert(divRes2.status === 200 && divRes2.data.result === 7.5, '15 ÷ 2 = 7.5 decimal division');

    // Division by Zero check
    const divZero = await request('/api/divide?num1=50&num2=0');
    assert(divZero.status === 400, 'Division by zero returns HTTP 400 Bad Request');
    assert(divZero.data.error && divZero.data.error.includes('Division by zero'), 'Error message warns about division by zero');

    // 6. Test Universal Calculate Endpoint
    console.log('\n6. Testing UNIVERSAL CALCULATE (/api/calculate)...');
    const calcRes = await request('/api/calculate?operation=multiply&num1=9&num2=9');
    assert(calcRes.status === 200 && calcRes.data.result === 81, 'calculate?operation=multiply&num1=9&num2=9 = 81');

    // 7. Test Input Validation
    console.log('\n7. Testing Input Validation...');
    const missingParam = await request('/api/add?num1=10');
    assert(missingParam.status === 400, 'Missing num2 returns HTTP 400');

    const invalidNumber = await request('/api/add?num1=abc&num2=10');
    assert(invalidNumber.status === 400, 'Non-numeric input returns HTTP 400');

    // 8. Test History Endpoint
    console.log('\n8. Testing Calculation History (/api/history)...');
    const histRes = await request('/api/history');
    assert(histRes.status === 200 && Array.isArray(histRes.data.data), 'GET /api/history returns array of records');
    assert(histRes.data.count > 0, `Recorded calculations found in history (count: ${histRes.data.count})`);

    // 9. Test Clear History
    // console.log('\n9. Testing Clear History (DELETE /api/history)...');
    // const clearRes = await request('/api/history', { method: 'DELETE' });
    // assert(clearRes.status === 200, 'DELETE /api/history returns HTTP 200');

    console.log('\n======================================================');
    console.log(`TEST SUMMARY: ${passed} Passed, ${failed} Failed`);
    console.log('======================================================\n');

    if (failed === 0) {
      console.log('🎉 ALL TESTS PASSED SUCCESSFULLY! Calculator API is ready.');
    } else {
      console.error('⚠️ Some tests failed. Please review the output above.');
    }
  } catch (error) {
    console.error('Fatal test error:', error);
  } finally {
    // Graceful cleanup
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
    server.close(() => {
      process.exit(failed > 0 ? 1 : 0);
    });
  }
}

// Allow server to listen before starting tests
setTimeout(runTests, 800);
