import admin from "firebase-admin";

if (!admin.apps.length) {
    let serviceAccount;
    if (process.env.FIREBASE_SERVICE_ACCOUNT) {
        try {
            serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
        } catch (e) {
            console.error("FIREBASE_SERVICE_ACCOUNT JSON parsing failed:", e);
        }
    } else {
        console.warn("FIREBASE_SERVICE_ACCOUNT not defined. Falling back to individual vars.");
        serviceAccount = {
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
        };
    }

    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
    });
}

export { admin };
