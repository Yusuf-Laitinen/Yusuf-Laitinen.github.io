const url = "https://script.google.com/macros/s/AKfycbwNgMrvfJwsj6lxa9VsPSgjEggR-EQSmloUeZ1JxS1U3aT4GepClK01pm9e6Va9OqpY/exec"; // Your Google Apps Script web app URL

async function readDocument(docId) {
    const fullUrl = `${url}?docId=${encodeURIComponent(docId)}`;
    try {
        const response = await fetch(fullUrl);
        if (!response.ok) throw new Error("Failed to read document");
        return await response.text();
    } catch (error) {
        console.error(error);
        return null;
    }
}

async function writeDocument(docId, content) {
    const formData = new URLSearchParams();
    formData.append("docId", docId);
    formData.append("content", content);
    try {
        const response = await fetch(url, {
            method: "POST",
            body: formData,
        });
        if (!response.ok) throw new Error("Failed to write document");
        return await response.text();
    } catch (error) {
        console.error(error);
        return null;
    }
}
