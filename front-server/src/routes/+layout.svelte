<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import favicon from '$lib/assets/favicon.svg';
	import { connect, disconnect } from '$lib/chat/';
	import { profile, getProfileInSessionStorage, setProfile } from '$lib/profile/';

	const publicPaths = ['/login', '/signup'];

	let { children } = $props();

	function guardRoute(pathname: string) {
		const isPublicPath = publicPaths.includes(pathname);

		if (profile.profile) return;

		if (isPublicPath) return;

		const profile_in_session = getProfileInSessionStorage();

		if (profile_in_session) {
			setProfile(profile_in_session);
			return;
		}

		goto('/login');
	}

	$effect(() => {
		if (!browser) return;

		guardRoute(page.url.pathname);
	});

	onMount(() => {
		const isPublicPath = publicPaths.includes(page.url.pathname);
		const isAuthenticated = profile.profile || getProfileInSessionStorage();

		if (!isPublicPath && !isAuthenticated) return;

		connect();

		return () => {
			disconnect();
		};
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{@render children()}
