const base = import.meta.env.BASE_URL.replace(/\/$/, '');

// Prefixes site paths with the base path, for hosting in a subfolder such as GitHub Pages.
export function withBase(path: string) {
	return path.startsWith('/') && !path.startsWith('//') ? `${base}${path}` : path;
}
