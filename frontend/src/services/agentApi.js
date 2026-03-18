export async function callAgentMove(payload) {
  try {
    const response = await fetch('http://localhost:3001/api/agent/move', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error calling agent API:", error);
    return null;
  }
}
