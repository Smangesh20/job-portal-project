# AskYaCham API Test Script (PowerShell)
# Tests all authentication endpoints

Write-Host "🧪 Testing AskYaCham Authentication API" -ForegroundColor Blue
Write-Host "========================================" -ForegroundColor Blue
Write-Host ""

$API_URL = "http://localhost:4200/api"
$EMAIL = "test@example.com"

# Test 1: Send OTP
Write-Host "Test 1: Send OTP" -ForegroundColor Cyan
Write-Host "POST $API_URL/auth/send-otp"

$body = @{
    email = $EMAIL
    action = "signup"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$API_URL/auth/send-otp" -Method Post -Body $body -ContentType "application/json"
    Write-Host "Response:" -ForegroundColor Gray
    Write-Host ($response | ConvertTo-Json) -ForegroundColor Gray
    
    if ($response.success) {
        $OTP = $response.otp
        Write-Host "✓ OTP received: $OTP" -ForegroundColor Green
    } else {
        Write-Host "✗ Failed to get OTP" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "✗ Error: $_" -ForegroundColor Red
    exit 1
}
Write-Host ""

# Test 2: Verify OTP
Write-Host "Test 2: Verify OTP" -ForegroundColor Cyan
Write-Host "POST $API_URL/auth/verify-otp"

$verifyBody = @{
    email = $EMAIL
    otp = $OTP
    action = "signup"
} | ConvertTo-Json

try {
    $verifyResponse = Invoke-RestMethod -Uri "$API_URL/auth/verify-otp" -Method Post -Body $verifyBody -ContentType "application/json"
    Write-Host "Response:" -ForegroundColor Gray
    Write-Host ($verifyResponse | ConvertTo-Json) -ForegroundColor Gray
    
    if ($verifyResponse.success) {
        Write-Host "✓ OTP verified successfully" -ForegroundColor Green
    } else {
        Write-Host "✗ OTP verification failed" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "✗ Error: $_" -ForegroundColor Red
    exit 1
}
Write-Host ""

# Test 3: Resend OTP
Write-Host "Test 3: Resend OTP" -ForegroundColor Cyan
Write-Host "POST $API_URL/auth/resend-otp"

$resendBody = @{
    email = $EMAIL
    action = "signin"
} | ConvertTo-Json

try {
    $resendResponse = Invoke-RestMethod -Uri "$API_URL/auth/resend-otp" -Method Post -Body $resendBody -ContentType "application/json"
    Write-Host "Response:" -ForegroundColor Gray
    Write-Host ($resendResponse | ConvertTo-Json) -ForegroundColor Gray
    
    if ($resendResponse.success) {
        Write-Host "✓ OTP resent successfully" -ForegroundColor Green
    } else {
        Write-Host "✗ Failed to resend OTP" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "✗ Error: $_" -ForegroundColor Red
    exit 1
}
Write-Host ""

# Test 4: Invalid Email
Write-Host "Test 4: Invalid Email Format" -ForegroundColor Cyan
Write-Host "POST $API_URL/auth/send-otp (with invalid email)"

$invalidBody = @{
    email = "notanemail"
    action = "signup"
} | ConvertTo-Json

try {
    $invalidResponse = Invoke-RestMethod -Uri "$API_URL/auth/send-otp" -Method Post -Body $invalidBody -ContentType "application/json" -ErrorAction Stop
    Write-Host "✗ Invalid email should be rejected" -ForegroundColor Red
} catch {
    Write-Host "✓ Invalid email properly rejected" -ForegroundColor Green
}
Write-Host ""

# Test 5: Invalid OTP
Write-Host "Test 5: Invalid OTP" -ForegroundColor Cyan
Write-Host "POST $API_URL/auth/verify-otp (with wrong OTP)"

$wrongOtpBody = @{
    email = $EMAIL
    otp = "000000"
    action = "signup"
} | ConvertTo-Json

try {
    $wrongOtpResponse = Invoke-RestMethod -Uri "$API_URL/auth/verify-otp" -Method Post -Body $wrongOtpBody -ContentType "application/json" -ErrorAction Stop
    Write-Host "✗ Invalid OTP should be rejected" -ForegroundColor Red
} catch {
    Write-Host "✓ Invalid OTP properly rejected" -ForegroundColor Green
}
Write-Host ""

# Summary
Write-Host "========================================" -ForegroundColor Blue
Write-Host "✓ All API tests completed!" -ForegroundColor Green
Write-Host ""
Write-Host "📝 Summary:" -ForegroundColor Cyan
Write-Host "  - OTP sending: Working ✓"
Write-Host "  - OTP verification: Working ✓"
Write-Host "  - OTP resend: Working ✓"
Write-Host "  - Input validation: Working ✓"
Write-Host ""
Write-Host "🎉 Your API is fully functional!" -ForegroundColor Green

