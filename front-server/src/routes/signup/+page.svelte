<script lang="ts">
	const DEFAULT_BASE_URL = import.meta.env.BASE_URL ?? "";
</script>

<svelte:head>
	<title>Sign Up</title>
</svelte:head>

<main>
	<h1>Sign Up</h1>
	<p>회원가입 페이지입니다.</p>

	<nav>
		<a href="${DEFAULT_BASE_URL}/">홈</a>
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
