/**
 * Shared icon utility: normalizes legacy emoji icon values and
 * Font Awesome class strings into a single FA class / markup.
 */

const EMOJI_TO_FA = {
    '🍝': 'fa-solid fa-plate-wheat',
    '🍛': 'fa-solid fa-bowl-rice',
    '🍳': 'fa-solid fa-egg',
    '🍲': 'fa-solid fa-bowl-food',
    '🍅': 'fa-solid fa-tomato',
    '🧀': 'fa-solid fa-cheese',
    '🥘': 'fa-solid fa-bowl-food',
    '🥩': 'fa-solid fa-drumstick-bite',
    '🥬': 'fa-solid fa-carrot',
    '🥗': 'fa-solid fa-leaf',
    '🫘': 'fa-solid fa-seedling',
    '🥪': 'fa-solid fa-sandwich',
    '🧃': 'fa-solid fa-bottle-water',
    '💧': 'fa-solid fa-droplet',
    '🥤': 'fa-solid fa-glass-water',
    '🥑': 'fa-solid fa-avocado',
    '🌅': 'fa-solid fa-sun',
    '🍿': 'fa-solid fa-cookie-bite',
    '🍔': 'fa-solid fa-burger',
    '🍽️': 'fa-solid fa-utensils',
    '🌶️': 'fa-solid fa-pepper-hot',
    '🥚': 'fa-solid fa-egg',
    '🍖': 'fa-solid fa-drumstick',
    '🎉': 'fa-solid fa-champagne-glasses',
    '📋': 'fa-solid fa-clipboard-list',
    '✔️': 'fa-solid fa-check',
    '✖️': 'fa-solid fa-xmark',
    '⚠️': 'fa-solid fa-triangle-exclamation',
};

export const DEFAULT_ICON_CLASS = 'fa-solid fa-utensils';

/**
 * Normalize an icon value to a Font Awesome class string.
 * Accepts legacy emoji values or existing FA classes.
 */
export function faClass(icon) {
    if (!icon) return DEFAULT_ICON_CLASS;
    const value = String(icon).trim();
    if (EMOJI_TO_FA[value]) return EMOJI_TO_FA[value];
    if (value.startsWith('fa-') || value.startsWith('fas ') || value.startsWith('fab ') || value.includes(' fa-')) {
        return value;
    }
    return DEFAULT_ICON_CLASS;
}

/**
 * Render an icon value as an <i> element.
 */
export function iconHtml(icon, extraClass = '') {
    const cls = faClass(icon) + (extraClass ? ' ' + extraClass : '');
    return '<i class="' + cls + '"></i>';
}