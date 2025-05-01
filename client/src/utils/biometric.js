// Simulating biometric authentication

async function biometric() {
  try {
    await navigator.credentials.create({
      publicKey: {
        challenge: new Uint8Array(16),
        rp: {
          name: "My App",
          id: "192.168.137.1" 
        },
        user: {
          id: new Uint8Array(8),
          name: "user@example.com",
          displayName: "User",
        },
        pubKeyCredParams: [
          { type: "public-key", alg: -7 },  // ES256: ECDSA with SHA-256
          { type: "public-key", alg: -257 } // RS256: RSA with SHA-256
        ],
        authenticatorSelection: {
          authenticatorAttachment: "platform",
          userVerification: "required",
        },
        timeout: 60000,
        attestation: "none",
      },
    });
    const credential = await navigator.credentials.create({ publicKey });
    alert("Biometric authentication successful!");
  } catch (err) {
    console.error("Biometric authentication failed:", err);
    return false;
  }
  return true;
}

export default biometric;