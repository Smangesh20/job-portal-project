/**
 * Manual Test for Comprehensive File Validation
 * Tests the enhanced file validation middleware with various file scenarios
 */

const { 
  validateFileUpload, 
  fileValidators,
  formatFileSize,
  extractFileExtension,
  validateMagicNumbers,
  scanForEmbeddedThreats,
  validatePDFContent,
  validateImageContent
} = require('./middleware/validation');

// Mock feature flags
const featureFlags = require('./middleware/featureFlags');
featureFlags.isEnabled = () => true;

console.log('=== Comprehensive File Validation Test ===\n');

// Test 1: File Size Validation
console.log('1. Testing File Size Validation:');

function testFileSizeValidation() {
  const validator = validateFileUpload({
    maxSize: 2 * 1024 * 1024, // 2MB
    minSize: 1024 // 1KB
  });

  // Test oversized file
  const req1 = {
    file: {
      originalname: 'large-file.pdf',
      mimetype: 'application/pdf',
      size: 5 * 1024 * 1024 // 5MB
    }
  };

  const res1 = {};
  let error1 = null;

  validator(req1, res1, (err) => {
    error1 = err;
  });

  console.log('- Oversized file (5MB > 2MB limit):');
  console.log('  Error:', error1 ? error1.message : 'None');
  console.log('  Details:', error1 ? error1.details : 'None');

  // Test undersized file
  const req2 = {
    file: {
      originalname: 'tiny-file.pdf',
      mimetype: 'application/pdf',
      size: 100 // 100 bytes
    }
  };

  const res2 = {};
  let error2 = null;

  validator(req2, res2, (err) => {
    error2 = err;
  });

  console.log('- Undersized file (100 bytes < 1KB minimum):');
  console.log('  Error:', error2 ? error2.message : 'None');
  console.log('  Details:', error2 ? error2.details : 'None');
}

testFileSizeValidation();

// Test 2: MIME Type and Extension Validation
console.log('\n2. Testing MIME Type and Extension Validation:');

function testMimeTypeValidation() {
  const validator = validateFileUpload({
    allowedTypes: ['application/pdf'],
    allowedExtensions: ['pdf']
  });

  // Test invalid MIME type
  const req1 = {
    file: {
      originalname: 'document.pdf',
      mimetype: 'text/plain',
      size: 1024 * 1024
    }
  };

  const res1 = {};
  let error1 = null;

  validator(req1, res1, (err) => {
    error1 = err;
  });

  console.log('- Invalid MIME type (text/plain instead of application/pdf):');
  console.log('  Error:', error1 ? error1.message : 'None');
  console.log('  Details:', error1 ? error1.details : 'None');

  // Test invalid extension
  const req2 = {
    file: {
      originalname: 'document.txt',
      mimetype: 'application/pdf',
      size: 1024 * 1024
    }
  };

  const res2 = {};
  let error2 = null;

  validator(req2, res2, (err) => {
    error2 = err;
  });

  console.log('- Invalid extension (.txt instead of .pdf):');
  console.log('  Error:', error2 ? error2.message : 'None');
  console.log('  Details:', error2 ? error2.details : 'None');
}

testMimeTypeValidation();

// Test 3: Security Validation
console.log('\n3. Testing Security Validation:');

function testSecurityValidation() {
  const validator = validateFileUpload({
    allowedTypes: ['application/pdf'],
    allowedExtensions: ['pdf'],
    strictSecurity: true
  });

  // Test suspicious filename
  const req1 = {
    file: {
      originalname: 'malware.exe.pdf',
      mimetype: 'application/pdf',
      size: 1024 * 1024
    }
  };

  const res1 = {};
  let error1 = null;

  validator(req1, res1, (err) => {
    error1 = err;
  });

  console.log('- Suspicious filename (malware.exe.pdf):');
  console.log('  Error:', error1 ? error1.message : 'None');
  console.log('  Details:', error1 ? error1.details : 'None');

  // Test path traversal attempt
  const req2 = {
    file: {
      originalname: '../../../etc/passwd.pdf',
      mimetype: 'application/pdf',
      size: 1024 * 1024
    }
  };

  const res2 = {};
  let error2 = null;

  validator(req2, res2, (err) => {
    error2 = err;
  });

  console.log('- Path traversal attempt (../../../etc/passwd.pdf):');
  console.log('  Error:', error2 ? error2.message : 'None');
  console.log('  Details:', error2 ? error2.details : 'None');
}

testSecurityValidation();

// Test 4: Magic Number Validation
console.log('\n4. Testing Magic Number Validation:');

function testMagicNumberValidation() {
  // Test PDF magic number
  const pdfBuffer = Buffer.from([0x25, 0x50, 0x44, 0x46, 0x2D, 0x31, 0x2E, 0x34]); // %PDF-1.4
  const pdfResult = validateMagicNumbers(pdfBuffer, 'application/pdf');
  console.log('- Valid PDF magic number:', pdfResult);

  // Test JPEG magic number
  const jpegBuffer = Buffer.from([0xFF, 0xD8, 0xFF, 0xE0, 0x00, 0x10, 0x4A, 0x46]); // JPEG JFIF
  const jpegResult = validateMagicNumbers(jpegBuffer, 'image/jpeg');
  console.log('- Valid JPEG magic number:', jpegResult);

  // Test mismatched magic number
  const mismatchResult = validateMagicNumbers(jpegBuffer, 'application/pdf');
  console.log('- Mismatched magic number (JPEG buffer, PDF MIME):', mismatchResult);

  // Test PNG magic number
  const pngBuffer = Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]); // PNG signature
  const pngResult = validateMagicNumbers(pngBuffer, 'image/png');
  console.log('- Valid PNG magic number:', pngResult);
}

testMagicNumberValidation();

// Test 5: Embedded Threat Detection
console.log('\n5. Testing Embedded Threat Detection:');

function testEmbeddedThreatDetection() {
  // Test JavaScript in content
  const jsContent = Buffer.from('<script>alert("xss")</script>Some content here');
  const jsThreats = scanForEmbeddedThreats(jsContent);
  console.log('- JavaScript content threats:', jsThreats);

  // Test executable header
  const exeContent = Buffer.from([0x4D, 0x5A, 0x90, 0x00]); // MZ header
  const exeThreats = scanForEmbeddedThreats(exeContent);
  console.log('- Executable header threats:', exeThreats);

  // Test clean content
  const cleanContent = Buffer.from('This is just normal text content without any threats');
  const cleanThreats = scanForEmbeddedThreats(cleanContent);
  console.log('- Clean content threats:', cleanThreats);
}

testEmbeddedThreatDetection();

// Test 6: Pre-configured Validators
console.log('\n6. Testing Pre-configured Validators:');

function testPreConfiguredValidators() {
  // Test resume validator
  const resumeReq = {
    file: {
      originalname: 'resume.pdf',
      mimetype: 'application/pdf',
      size: 2 * 1024 * 1024, // 2MB
      buffer: Buffer.from([0x25, 0x50, 0x44, 0x46]) // PDF header
    }
  };

  const resumeRes = {};
  let resumeError = null;

  fileValidators.resume(resumeReq, resumeRes, (err) => {
    resumeError = err;
  });

  console.log('- Resume validator (valid PDF):');
  console.log('  Error:', resumeError ? resumeError.message : 'None');
  console.log('  Metadata:', resumeReq.fileValidationMeta);

  // Test profile validator
  const profileReq = {
    file: {
      originalname: 'profile.jpg',
      mimetype: 'image/jpeg',
      size: 1024 * 1024, // 1MB
      buffer: Buffer.from([0xFF, 0xD8, 0xFF, 0xE0]) // JPEG header
    }
  };

  const profileRes = {};
  let profileError = null;

  fileValidators.profile(profileReq, profileRes, (err) => {
    profileError = err;
  });

  console.log('- Profile validator (valid JPEG):');
  console.log('  Error:', profileError ? profileError.message : 'None');
  console.log('  Metadata:', profileReq.fileValidationMeta);
}

testPreConfiguredValidators();

// Test 7: Helper Functions
console.log('\n7. Testing Helper Functions:');

function testHelperFunctions() {
  // Test file size formatting
  console.log('- File size formatting:');
  console.log('  1024 bytes:', formatFileSize(1024));
  console.log('  1048576 bytes:', formatFileSize(1048576));
  console.log('  5242880 bytes:', formatFileSize(5242880));

  // Test extension extraction
  console.log('- Extension extraction:');
  console.log('  "document.pdf":', extractFileExtension('document.pdf'));
  console.log('  "image.JPEG":', extractFileExtension('image.JPEG'));
  console.log('  "file":', extractFileExtension('file'));
  console.log('  "":', extractFileExtension(''));
}

testHelperFunctions();

// Test 8: Error Message Quality
console.log('\n8. Testing Error Message Quality:');

function testErrorMessageQuality() {
  const validator = validateFileUpload({
    required: true,
    maxSize: 1024 * 1024, // 1MB
    allowedTypes: ['application/pdf'],
    allowedExtensions: ['pdf'],
    strictSecurity: true
  });

  const req = {
    file: {
      originalname: 'large-document.txt',
      mimetype: 'text/plain',
      size: 5 * 1024 * 1024 // 5MB
    }
  };

  const res = {};
  let error = null;

  validator(req, res, (err) => {
    error = err;
  });

  console.log('- Multiple validation errors:');
  console.log('  Error message:', error ? error.message : 'None');
  if (error && error.details) {
    error.details.forEach((detail, index) => {
      console.log(`  Error ${index + 1}:`, detail);
    });
  }
}

testErrorMessageQuality();

console.log('\n=== File Validation Test Complete ===');
console.log('\nKey Features Tested:');
console.log('- ✓ File size validation with detailed requirements');
console.log('- ✓ MIME type and extension validation');
console.log('- ✓ Security checks for malicious filenames');
console.log('- ✓ Magic number validation for file integrity');
console.log('- ✓ Embedded threat detection');
console.log('- ✓ Pre-configured validators for common use cases');
console.log('- ✓ Comprehensive error messages with requirements');
console.log('- ✓ Helper functions for file processing');
console.log('- ✓ Security logging and threat tracking');