// Simulating biometric authentication with debugging

async function biometric() {
  try {
    const challenge = new Uint8Array(32);
    window.crypto.getRandomValues(challenge);

    const userId = new Uint8Array(16);
    window.crypto.getRandomValues(userId);

    const publicKey = {
      challenge: challenge,
      rp: {
        name: "My App",
        id: "acdhemtos.duckdns.org" 
      },
      user: {
        id: userId,
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
    };
    const credential = await navigator.credentials.create({ publicKey });
    alert("Biometric authentication successful!");
  } catch (err) {
    console.error("Biometric authentication failed:", err.name, err.message, err);
    alert(`Biometric authentication failed: ${err.name} - ${err.message}`);
    return false;
  }
  return true;
}

export default biometric;