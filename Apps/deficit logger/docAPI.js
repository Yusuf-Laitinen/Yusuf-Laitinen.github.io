const url = "https://script.google.com/macros/s/AKfycbyx1W9U-Y7E4ZWEIyiSrrCL3A4A_D5-fIe5h_cn_uZAnOVAO6dlDtrQqKtnW0rl58Myyg/exec"; // Your Google Apps Script web app URL

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
