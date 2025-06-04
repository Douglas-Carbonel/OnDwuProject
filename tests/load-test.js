
import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
  stages: [
    { duration: '2m', target: 10 }, // Ramp up
    { duration: '5m', target: 50 }, // Stay at 50 users
    { duration: '2m', target: 0 },  // Ramp down
  ],
};

const BASE_URL = 'http://localhost:5000';

export default function () {
  // Test login endpoint
  let loginPayload = JSON.stringify({
    user_mail: 'qa@test.com',
    password: 'testpass123'
  });

  let loginRes = http.post(`${BASE_URL}/api/login`, loginPayload, {
    headers: { 'Content-Type': 'application/json' },
  });

  check(loginRes, {
    'login status is 200': (r) => r.status === 200,
    'login response time < 500ms': (r) => r.timings.duration < 500,
  });

  if (loginRes.status === 200) {
    let cookies = loginRes.cookies;
    
    // Test progress endpoint
    let progressRes = http.get(`${BASE_URL}/api/progress/2`, {
      cookies: cookies,
    });

    check(progressRes, {
      'progress status is 200': (r) => r.status === 200,
      'progress response time < 300ms': (r) => r.timings.duration < 300,
    });

    // Test evaluation attempt check
    let attemptRes = http.get(`${BASE_URL}/api/evaluations/attempts?userId=2&moduleId=1`, {
      cookies: cookies,
    });

    check(attemptRes, {
      'attempt check status is 200': (r) => r.status === 200,
      'attempt check response time < 200ms': (r) => r.timings.duration < 200,
    });
  }

  sleep(1);
}
