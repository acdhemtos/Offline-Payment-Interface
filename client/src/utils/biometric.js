// Simulating biometric authentication

async function biometric() {
  try {
    await navigator.credentials.create({
      publicKey: {
        challenge: new Uint8Array(16),
        rp: { name: "My App" },
        user: {
          id: new Uint8Array(8),
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
  } catch (err) {
    console.error("Biometric authentication failed:", err);
    return false;
  }
  return true;
}

export default biometric;
