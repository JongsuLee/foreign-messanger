<script lang="ts">
	const DEFAULT_BASE_URL = import.meta.env.BASE_URL ?? "";
</script>

<svelte:head>
	<title>Home</title>
</svelte:head>

<main>
	<h1>Home</h1>
	<p>메인 홈 페이지입니다.</p>

	<nav>
		<a href="${DEFAULT_BASE_URL}/profile">프로필</a>
		<a href="${DEFAULT_BASE_URL}/room/general">general 방 입장</a>
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
