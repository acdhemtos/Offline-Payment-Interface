export const messages = [];

export async function loadMessages() {
  try {
    const response = await fetch('/api/messages');
    const text = await response.text();
    const lines = text.split('\n').map(line => line.trim());
    messages.push(...lines);
    console.log("loaded msg", messages);
  } catch (error) {
    console.error('Error loading messages:', error);
  }
}