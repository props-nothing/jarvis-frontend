export const SITE_URL = "https://www.jarvisd.dev";
export const REPO_URL = "https://github.com/props-nothing/jarvis-core";
export const REPO_GIT_URL = `${REPO_URL}.git`;
export const DOCS_URL = `${REPO_URL}/tree/main/docs`;
export const QUICK_START_URL = `${REPO_URL}/blob/main/docs/user/quick-start.md`;
export const PLATFORMS_URL = `${REPO_URL}/blob/main/docs/user/platforms.md`;
export const ROADMAP_URL = `${REPO_URL}/blob/main/ROADMAP.md`;
export const ARCHITECTURE_URL = `${REPO_URL}/blob/main/docs/architecture/overview.md`;
export const ADR_URL = `${REPO_URL}/tree/main/docs/adr`;
export const SECURITY_URL = `${REPO_URL}/blob/main/SECURITY.md`;

/** The installer scripts are served by this site, so commands follow whichever host serves it. */
export function siteOrigin(): string {
  return typeof window === "undefined" ? SITE_URL : window.location.origin;
}
