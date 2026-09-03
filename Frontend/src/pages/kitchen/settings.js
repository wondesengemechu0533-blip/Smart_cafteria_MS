import api from '../../js/api.js';

const settingsContainer = document.getElementById('settingsContent');
const toastEl = document.getElementById('toast');

let settings = {
    stationName: 'Station 1',
    orderAlertSound: true,
    preparationTimerAlert: true,
    generalNotificationSound: true,
    autoRefreshEnabled: true,
    autoRefreshInterval: 10,
    showCompletedOrders: true,
};

function showToast(msg, type = 'success') {
    toastEl.textContent = msg;
    toastEl.className = 'toast ' + type + ' show';
    setTimeout(() => toastEl.classList.remove('show'), 3000);
}

function toggleSwitch(id, label, checked) {
    return `
        <div class="setting-row">
            <div>
                <div class="setting-label">${label}</div>
            </div>
            <label class="toggle-switch">
                <input type="checkbox" id="${id}" ${checked ? 'checked' : ''}>
                <span class="toggle-slider"></span>
            </label>
        </div>
    `;
}

function renderSettings() {
    settingsContainer.innerHTML = `
        <div class="settings-card">
            <h3><i class="fa-solid fa-location-dot"></i> Station Settings</h3>
            <div class="setting-row">
                <div>
                    <div class="setting-label">Station Name</div>
                    <div class="setting-desc">Display name for this kitchen station</div>
                </div>
                <input type="text" class="setting-input" id="stationName" value="${escapeHtml(settings.stationName)}" placeholder="e.g. Station 1">
            </div>
        </div>

        <div class="settings-card">
            <h3><i class="fa-solid fa-bell"></i> Notification Preferences</h3>
            ${toggleSwitch('orderAlertSound', 'Order Alert Sound', settings.orderAlertSound)}
            ${toggleSwitch('preparationTimerAlert', 'Preparation Timer Alert', settings.preparationTimerAlert)}
            ${toggleSwitch('generalNotificationSound', 'General Notification Sound', settings.generalNotificationSound)}
        </div>

        <div class="settings-card">
            <h3><i class="fa-solid fa-rotate"></i> Auto-Refresh</h3>
            ${toggleSwitch('autoRefreshEnabled', 'Auto-Refresh Enabled', settings.autoRefreshEnabled)}
            <div class="setting-row">
                <div>
                    <div class="setting-label">Refresh Interval</div>
                    <div class="setting-desc">How often to refresh order data</div>
                </div>
                <select class="setting-select" id="autoRefreshInterval">
                    <option value="5" ${settings.autoRefreshInterval === 5 ? 'selected' : ''}>5 seconds</option>
                    <option value="10" ${settings.autoRefreshInterval === 10 ? 'selected' : ''}>10 seconds</option>
                    <option value="15" ${settings.autoRefreshInterval === 15 ? 'selected' : ''}>15 seconds</option>
                    <option value="30" ${settings.autoRefreshInterval === 30 ? 'selected' : ''}>30 seconds</option>
                    <option value="60" ${settings.autoRefreshInterval === 60 ? 'selected' : ''}>60 seconds</option>
                    <option value="120" ${settings.autoRefreshInterval === 120 ? 'selected' : ''}>120 seconds</option>
                </select>
            </div>
        </div>

        <div class="settings-card">
            <h3><i class="fa-solid fa-desktop"></i> Display</h3>
            ${toggleSwitch('showCompletedOrders', 'Show Completed Orders', settings.showCompletedOrders)}
        </div>

        <div class="btn-save-wrap">
            <button class="btn btn-primary" id="saveBtn" onclick="window.saveSettings()">
                <i class="fa-solid fa-floppy-disk"></i> Save Settings
            </button>
        </div>
    `;
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text || '';
    return div.innerHTML;
}

async function loadSettings() {
    try {
        const { data } = await api.get('/kitchen/settings');
        if (data.success && data.settings) {
            settings = { ...settings, ...data.settings };
        }
    } catch (err) {
        console.warn('Could not load settings, using defaults:', err);
    }
    renderSettings();
}

function collectForm() {
    return {
        stationName: document.getElementById('stationName').value.trim() || 'Station 1',
        orderAlertSound: document.getElementById('orderAlertSound').checked,
        preparationTimerAlert: document.getElementById('preparationTimerAlert').checked,
        generalNotificationSound: document.getElementById('generalNotificationSound').checked,
        autoRefreshEnabled: document.getElementById('autoRefreshEnabled').checked,
        autoRefreshInterval: parseInt(document.getElementById('autoRefreshInterval').value, 10),
        showCompletedOrders: document.getElementById('showCompletedOrders').checked,
    };
}

window.saveSettings = async function () {
    const btn = document.getElementById('saveBtn');
    btn.disabled = true;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Saving...';
    try {
        const payload = collectForm();
        const { data } = await api.put('/kitchen/settings', payload);
        if (data.success) {
            settings = { ...settings, ...payload };
            const badge = document.getElementById('stationBadge');
            if (badge) badge.textContent = settings.stationName;
            showToast('Settings saved successfully');
        } else {
            showToast('Failed to save settings', 'error');
        }
    } catch (err) {
        console.error('Save settings error:', err);
        showToast('Failed to save settings', 'error');
    } finally {
        btn.disabled = false;
        btn.innerHTML = '<i class="fa-solid fa-floppy-disk"></i> Save Settings';
    }
};

loadSettings();
