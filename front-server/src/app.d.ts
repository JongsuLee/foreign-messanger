// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

interface ImportMetaEnv {
	readonly VITE_SAVE_AUDIO_URL: string;
	readonly VITE_SOCKET_URL?: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}

export {};
