<script lang="ts">
	import type { PageProps } from './$types';
	import { chatSocket, joinRoom } from '$lib/chat/chatSocket.svelte';

	let { params }: PageProps = $props();

	joinRoom(params.room_name, 'willy');
</script>

<svelte:head>
	<title>{params.room_name} Room</title>
</svelte:head>

<main>
	<h1>{params.room_name}</h1>
	<h2>{chatSocket.currentRoom}</h2>
	<p>채팅방에 입장했습니다.</p>

	<nav>
		<a href="/">홈</a>
		<a href="/profile">프로필</a>
	</nav>
</main>

<style>
	main {
		max-width: 40rem;
		margin: 0 auto;
		padding: 2rem 1rem;
	}

	nav {
		display: flex;
		gap: 1rem;
		margin-top: 1.5rem;
	}
</style>
