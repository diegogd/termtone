export const GITHUB_URL = 'https://github.com/diegogd/termtone';
export const HOMEPAGE_URL = GITHUB_URL;
export const DEVTOOLS_DOCS_URL = `${GITHUB_URL}/blob/main/CONTRIBUTING.md`;
export const HELP_URL = `${GITHUB_URL}#readme`;
export const PRIVACY_URL = `${GITHUB_URL}#privacy`;
export const CONFIG_URL_BASE = 'https://raw.githubusercontent.com/diegogd/termtone/main/src/config';

export function getHelpURL(): string {
    return HELP_URL;
}
