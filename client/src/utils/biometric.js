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
        // id: "192.138.167.1" // Use 'localhost' for local testing or your domain for production
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

    // Log the publicKey object for debugging
    console.log("PublicKey Object:", JSON.stringify(publicKey, null, 2));

    // Attempt to create credentials
    const credential = await navigator.credentials.create({ publicKey });

    // Log the result for debugging
    console.log("Credential Created:", credential);

    alert("Biometric authentication successful!");
  } catch (err) {
    // Log detailed error information
    console.error("Biometric authentication failed:", err.name, err.message, err);
    alert(`Biometric authentication failed: ${err.name} - ${err.message}`);
    return false;
  }
  return true;
}

export default biometric;