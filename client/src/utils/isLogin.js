export const isLogin = async () => {
  const cookies = document.cookie.split(";").reduce((acc, cookie) => {
    const [key, value] = cookie.trim().split("=");
    acc[key] = value;
    return acc;
  }, {});

  console.log("Cookies:", cookies);

  if (!cookies.session_key || !cookies.username) {
    console.log("No session key or username found in cookies.");
    return false;
  }

  try {
    const response = await fetch("/api/isLoggedIn.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: cookies.username,
        session_key: cookies.session_key,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("isLogin response:", data);

    if (data.code === 0) {
      document.cookie = `session_key=${cookies.session_key}; path=/; max-age=604800; secure`;
      document.cookie = `username=${cookies.username}; path=/; max-age=604800; secure`;
      return true;
    } else {
      document.cookie = "session_key=; path=/; max-age=0;";
      document.cookie = "username=; path=/; max-age=0;";
      console.log("Session is invalid. Cookies cleared.");
      return false;
    }
  } catch (error) {
    console.error("Error validating session:", error);
    return false;
  }
};
