// Google API Configuration
const CLIENT_ID = '523214865568-ns2n845hlrpbk3sq8rjpl8u9u7dc05nb.apps.googleusercontent.com';
const DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest';
const SCOPES = 'https://www.googleapis.com/auth/drive.file';

let tokenClient;
let gapiInited = false;
let gisInited = false;

// State Definitions
window.appState = {
    version: "1.0",
    lastSync: null,
    tasks: [],
    notes: [],
    projects: []
};

// Initialize the Google API client
function gapiLoaded() {
    gapi.load('client', initializegapiClient);
}

async function initializegapiClient() {
    await gapi.client.init({
        discoveryDocs: [DISCOVERY_DOC],
    });
    gapiInited = true;
    maybeEnableButtons();
}

// Initialize Google Identity Services
function gisLoaded() {
    tokenClient = google.accounts.oauth2.initTokenClient({
        client_id: CLIENT_ID,
        scope: SCOPES,
        callback: '', // defined later
    });
    gisInited = true;
    maybeEnableButtons();
}

function maybeEnableButtons() {
    if (gapiInited && gisInited) {
        document.getElementById('auth-btn').style.display = 'block';
    }
}

// Auth Handlers
function handleAuthClick() {
    tokenClient.callback = async (resp) => {
        if (resp.error !== undefined) {
            throw (resp);
        }
        document.getElementById('auth-btn').style.display = 'none';
        document.getElementById('signout-btn').style.display = 'block';
        await loadStateFromDrive();
    };

    if (gapi.client.getToken() === null) {
        // Prompt the user to select an account.
        tokenClient.requestAccessToken({ prompt: 'consent' });
    } else {
        // Skip display of account chooser and consent dialog for an existing session.
        tokenClient.requestAccessToken({ prompt: '' });
    }
}

function handleSignoutClick() {
    const token = gapi.client.getToken();
    if (token !== null) {
        google.accounts.oauth2.revoke(token.access_token);
        gapi.client.setToken('');
        document.getElementById('auth-btn').style.display = 'block';
        document.getElementById('signout-btn').style.display = 'none';
    }
}

// Drive Operations
const STATE_FILE_NAME = 'life_os_state.json';
let driveFileId = null;

async function loadStateFromDrive() {
    try {
        // 1. Search for existing state file created by this app
        const response = await gapi.client.drive.files.list({
            q: `name='${STATE_FILE_NAME}' and trashed=false`,
            fields: 'files(id, name)',
            spaces: 'drive'
        });

        const files = response.result.files;

        if (files && files.length > 0) {
            console.log('Found existing state file in Drive.');
            driveFileId = files[0].id;

            // 2. Fetch the file content
            const fileData = await gapi.client.drive.files.get({
                fileId: driveFileId,
                alt: 'media'
            });

            console.log('State fetched successfully');
            try {
                const parsedState = JSON.parse(fileData.body);
                window.appState = { ...window.appState, ...parsedState };
                console.log("Hydrated state:", window.appState);
                window.renderView(window.currentView); // Refresh UI with new data
            } catch (e) {
                console.error("Error parsing state from Drive", e);
            }
        } else {
            console.log('No state file found. Creating a new one.');
            await createInitialStateFile();
        }
    } catch (err) {
        console.error('Error contacting Google Drive:', err);
    }
}

// Save logic with simple debouncing
let saveTimeout = null;

window.saveStateToDrive = function () {
    if (!driveFileId || !gapi.client.getToken()) {
        console.log("Not saving to drive: Not authenticated or no file ID.");
        return;
    }

    if (saveTimeout) clearTimeout(saveTimeout);

    // Debounce save by 2 seconds to prevent spamming the Drive API
    saveTimeout = setTimeout(async () => {
        try {
            window.appState.lastSync = new Date().toISOString();
            const fileContent = JSON.stringify(window.appState);
            const file = new Blob([fileContent], { type: 'application/json' });

            const accessToken = gapi.client.getToken().access_token;

            // Drive API v3 requires a PATCH request to a different upload URI to update content
            const res = await fetch(`https://www.googleapis.com/upload/drive/v3/files/${driveFileId}?uploadType=media`, {
                method: 'PATCH',
                headers: new Headers({
                    'Authorization': 'Bearer ' + accessToken,
                    'Content-Type': 'application/json'
                }),
                body: file,
            });
            console.log('Successfully saved state to Drive.');
        } catch (err) {
            console.error('Error saving to Drive:', err);
        }
    }, 2000);
}

async function createInitialStateFile() {
    const initialState = {
        version: "1.0",
        lastSync: new Date().toISOString(),
        tasks: [],
        notes: [],
        projects: []
    };

    const fileContent = JSON.stringify(initialState);
    const file = new Blob([fileContent], { type: 'application/json' });

    const metadata = {
        'name': STATE_FILE_NAME,
        'mimeType': 'application/json'
    };

    const accessToken = gapi.client.getToken().access_token;
    const form = new FormData();
    form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
    form.append('file', file);

    try {
        const res = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
            method: 'POST',
            headers: new Headers({ 'Authorization': 'Bearer ' + accessToken }),
            body: form,
        });
        const val = await res.json();
        driveFileId = val.id;
        console.log("Created fresh state file in root: ", driveFileId);
    } catch (err) {
        console.error('Error creating file', err);
    }
}

// Hook it up globally
window.gapiLoaded = gapiLoaded;
window.gisLoaded = gisLoaded;
window.handleAuthClick = handleAuthClick;
window.handleSignoutClick = handleSignoutClick;
