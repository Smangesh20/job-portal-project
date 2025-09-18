export default function Home() {
  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{
        background: 'white',
        padding: '3rem',
        borderRadius: '1rem',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
        textAlign: 'center',
        maxWidth: '600px',
        margin: '0 1rem'
      }}>
        <h1 style={{ 
          fontSize: '3rem', 
          fontWeight: 'bold', 
          color: '#1f2937',
          marginBottom: '1rem'
        }}>
          Ask Ya Cham
        </h1>
        <p style={{ 
          fontSize: '1.25rem', 
          color: '#6b7280',
          marginBottom: '2rem'
        }}>
          AI-Powered Job Matching Platform
        </p>
        <div style={{
          background: '#f9fafb',
          padding: '1.5rem',
          borderRadius: '0.5rem',
          marginBottom: '2rem'
        }}>
          <h2 style={{ 
            fontSize: '1.5rem', 
            fontWeight: '600', 
            color: '#374151',
            marginBottom: '1rem'
          }}>
            Platform Status
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#6b7280' }}>Web App</span>
              <span style={{ 
                background: '#dcfce7', 
                color: '#166534', 
                padding: '0.25rem 0.75rem', 
                borderRadius: '9999px',
                fontSize: '0.875rem'
              }}>
                ✅ Running
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#6b7280' }}>API Service</span>
              <span style={{ 
                background: '#fef3c7', 
                color: '#92400e', 
                padding: '0.25rem 0.75rem', 
                borderRadius: '9999px',
                fontSize: '0.875rem'
              }}>
                ⚠️ Check API
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#6b7280' }}>AI Service</span>
              <span style={{ 
                background: '#fef3c7', 
                color: '#92400e', 
                padding: '0.25rem 0.75rem', 
                borderRadius: '9999px',
                fontSize: '0.875rem'
              }}>
                ⚠️ Check AI
              </span>
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <a 
            href="https://ask-ya-cham-api.onrender.com/health" 
            target="_blank" 
            rel="noopener noreferrer"
            style={{
              background: '#2563eb',
              color: 'white',
              padding: '0.75rem 1.5rem',
              borderRadius: '0.5rem',
              textDecoration: 'none',
              fontWeight: '500',
              transition: 'background-color 0.2s'
            }}
          >
            Check API Status
          </a>
          <a 
            href="https://ask-ya-cham-ai.onrender.com/health" 
            target="_blank" 
            rel="noopener noreferrer"
            style={{
              background: '#059669',
              color: 'white',
              padding: '0.75rem 1.5rem',
              borderRadius: '0.5rem',
              textDecoration: 'none',
              fontWeight: '500',
              transition: 'background-color 0.2s'
            }}
          >
            Check AI Status
          </a>
        </div>
      </div>
    </div>
  );
}
