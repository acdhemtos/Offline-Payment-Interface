// Simulating biometric authentication

async function biometric() {
  try {
    await navigator.credentials.create({
      publicKey: {
        challenge: crypto.getRandomValues(new Uint8Array(32)),
        rp: {
          name: "My App",
          // id: "localhost" // Optional, remove if not needed
        },
        user: {
          id: crypto.getRandomValues(new Uint8Array(16)),
          name: "user@example.com",
          displayName: "User",
        },
        pubKeyCredParams: [
          { type: "public-key", alg: -7 },
          { type: "public-key", alg: -257 },
        ],
        authenticatorSelection: {
          authenticatorAttachment: "platform",
          userVerification: "required",
        },
        timeout: 60000,
        attestation: "none",
      },
    });
    alert("Biometric authentication successful!");
  } catch (err) {
    console.error("Biometric authentication failed:", err);
    return false;
  }
  return true;
}


export default biometric;
