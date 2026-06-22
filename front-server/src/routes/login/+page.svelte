<script lang="ts">
	import { InputFrame } from '$lib/components';
	let email = $state('');
	let password = $state('');

	$effect(() => {
		if (email) {
			console.log('email::', email);
		}
	});
</script>

<svelte:head>
	<title>Log In</title>
</svelte:head>

<main>
	<h1>Log In</h1>
	<p>로그인 페이지입니다.</p>
	<InputFrame type="email" bind:value={email} placeholder="이메일" />
	<InputFrame
		type="password"
		bind:value={password}
		status="error"
		message="비밀번호를 입력해주세요."
	/>

	<nav>
		<a href="/">홈</a>
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
