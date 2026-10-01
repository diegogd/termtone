// @ts-check
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import {execute, log} from './utils.js';

// Imports dark terminal themes from https://github.com/mbadolato/iTerm2-Color-Schemes
// into src/config/color-schemes.drconf as DARK-only color schemes.
//
// Usage: node tasks/color-schemes.js [path-to-iTerm2-Color-Schemes]
// Without a path, the repository is cloned into a temporary directory.

const REPO_URL = 'https://github.com/mbadolato/iTerm2-Color-Schemes';
const CONFIG_FILE = './src/config/color-schemes.drconf';
const SEPARATOR = '='.repeat(32);
// WCAG contrast ratio below which the text is considered unreadable on the background.
const MIN_CONTRAST = 3;
// Relative luminance at which a background is as close to black as to white.
const DARK_LUMINANCE = 0.179;

/**
 * @param {string} hex
 * @returns {number}
 */
function luminance(hex) {
    const [r, g, b] = [1, 3, 5].map((i) => {
        const c = parseInt(hex.slice(i, i + 2), 16) / 255;
        return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/**
 * @param {string} a
 * @param {string} b
 * @returns {number}
 */
function contrast(a, b) {
    const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
    return (hi + 0.05) / (lo + 0.05);
}

/**
 * @param {unknown} color
 * @returns {string | null}
 */
function normalizeHex(color) {
    if (typeof color !== 'string' || !/^#([0-9a-f]{3}){1,2}$/i.test(color)) {
        return null;
    }
    const hex = color.toLowerCase();
    return hex.length === 4 ? `#${hex[1]}${hex[1]}${hex[2]}${hex[2]}${hex[3]}${hex[3]}` : hex;
}

/**
 * @param {string} source
 * @returns {Promise<string>}
 */
async function getSourceDir(source) {
    if (source) {
        return source;
    }
    const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'iterm2-color-schemes-'));
    log.ok(`Cloning ${REPO_URL}`);
    await execute(`git clone --depth 1 ${REPO_URL} ${dir}`);
    return dir;
}

async function generate() {
    const sourceDir = await getSourceDir(process.argv[2]);
    const themesDir = path.join(sourceDir, 'windowsterminal');
    const files = (await fs.readdir(themesDir)).filter((f) => f.endsWith('.json'));

    const existing = (await fs.readFile(CONFIG_FILE, 'utf8'))
        .split(`${SEPARATOR}\n\n`)
        .map((section) => section.trim());
    /** @type {Map<string, string>} */
    const sections = new Map(existing.map((section) => [section.split('\n')[0], section]));
    const takenNames = new Set([...sections.keys()].map((name) => name.toLowerCase()));

    let added = 0;
    let light = 0;
    let lowContrast = 0;
    let invalid = 0;
    let duplicate = 0;
    for (const file of files) {
        const theme = JSON.parse(await fs.readFile(path.join(themesDir, file), 'utf8'));
        const name = typeof theme.name === 'string' ? theme.name.trim() : '';
        const background = normalizeHex(theme.background);
        const text = normalizeHex(theme.foreground);
        if (!name || /[\r\n]/.test(name) || !background || !text) {
            invalid++;
            continue;
        }
        if (takenNames.has(name.toLowerCase())) {
            // Hand-written schemes take precedence
            duplicate++;
            continue;
        }
        if (luminance(background) >= DARK_LUMINANCE) {
            light++;
            continue;
        }
        if (contrast(background, text) < MIN_CONTRAST) {
            lowContrast++;
            continue;
        }
        takenNames.add(name.toLowerCase());
        sections.set(name, `${name}\n\nDARK\nbackground: ${background}\ntext: ${text}`);
        added++;
    }

    // "Default" must stay first, the rest is sorted the way the parser validates it
    const names = [...sections.keys()].sort((a, b) => a === 'Default' ? -1 : b === 'Default' ? 1 : a.localeCompare(b));
    const output = `${names.map((name) => sections.get(name)).join(`\n\n${SEPARATOR}\n\n`)}\n`;
    await fs.writeFile(CONFIG_FILE, output, 'utf8');

    log.ok(`Added ${added} color schemes`);
    log(`Skipped: ${light} light, ${lowContrast} low contrast, ${duplicate} already defined, ${invalid} invalid`);
}

generate();
