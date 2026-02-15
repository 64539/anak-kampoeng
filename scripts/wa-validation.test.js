const assert = (cond, msg) => {
  if (!cond) {
    console.error("FAIL:", msg);
    process.exitCode = 1;
  } else {
    console.log("PASS:", msg);
  }
};

const registerRegex = /^\+62[0-9]{8,12}$/;
const profileRegex = /^\+62[0-9]{7,12}$/;

const validRegister = [
  "+62812345678",
  "+628123456789",
  "+6281234567890",
  "+62812345678901",
];

const invalidRegister = [
  "62812345678",
  "+621234567",
  "+6281234567890123",
  "+62-812345678",
  "+62 812345678",
];

const validProfile = [
  "+6281234567",
  "+62812345678",
  "+6281234567890",
  "+62812345678901",
];

const invalidProfile = [
  "6281234567",
  "+62123456",
  "+6281234567890123",
  "+62-81234567",
  "+62 81234567",
];

validRegister.forEach((n) => assert(registerRegex.test(n), `register valid: ${n}`));
invalidRegister.forEach((n) => assert(!registerRegex.test(n), `register invalid: ${n}`));

validProfile.forEach((n) => assert(profileRegex.test(n), `profile valid: ${n}`));
invalidProfile.forEach((n) => assert(!profileRegex.test(n), `profile invalid: ${n}`));

if (process.exitCode === 1) {
  console.error("Some WA validation tests failed");
  process.exit(1);
} else {
  console.log("All WA validation tests passed");
}
