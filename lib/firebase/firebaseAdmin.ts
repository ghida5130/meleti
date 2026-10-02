import admin from "firebase-admin";

function getCredentialField(value: unknown, field: string, envName: string): string {
    if (typeof value !== "string" || !value.trim()) {
        throw new Error(`Firebase Admin credential ${field} is missing. Set it in FIREBASE_SERVICE_ACCOUNT or ${envName}.`);
    }

    return value;
}

if (!admin.apps.length) {
    const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT;
    let serviceAccount: Record<string, unknown>;

    if (serviceAccountJson) {
        try {
            const parsed: unknown = JSON.parse(serviceAccountJson);
            if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
                throw new Error("expected a JSON object");
            }
            serviceAccount = parsed as Record<string, unknown>;
        } catch {
            throw new Error("FIREBASE_SERVICE_ACCOUNT must be a valid service account JSON object.");
        }
    } else {
        serviceAccount = {
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: process.env.FIREBASE_PRIVATE_KEY,
        };
    }

    const projectId = getCredentialField(serviceAccount.project_id ?? serviceAccount.projectId, "project_id", "FIREBASE_PROJECT_ID");
    const clientEmail = getCredentialField(serviceAccount.client_email ?? serviceAccount.clientEmail, "client_email", "FIREBASE_CLIENT_EMAIL");
    const privateKey = getCredentialField(serviceAccount.private_key ?? serviceAccount.privateKey, "private_key", "FIREBASE_PRIVATE_KEY").replace(/\\n/g, "\n");

    admin.initializeApp({
        credential: admin.credential.cert({ projectId, clientEmail, privateKey }),
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    });
}

export { admin };
