<script lang="ts">
	import { InputFrame, ButtonFrame } from '$lib/components';
	import { profile } from '$lib/profile';
	import { goto } from '$app/navigation';
	
	let id = $state('');
	let idMessage = $state('');
	let password = $state('');
	let passwordMessage = $state('');

	function checkPasswordFormat(password: string): string {
		let hasCapital: boolean = false;
		let hasSmall: boolean = false;
		let hasNumber: boolean = false;
		let hasSymbol: boolean = false;
		let passwordMessage = '';
		const insufficiantList = [];

		hasCapital = /[A-Z]/.test(password);
		hasSmall = /[a-z]/.test(password);
		hasNumber = /[0-9]/.test(password);
		hasSymbol = /[\~!@#$%\^\&\*\(\)\-\_\+\=\[\]\|\\\`]/.test(password);

		if (!hasCapital) {
			insufficiantList.push('대문자')
		}

		if (!hasSmall) {
			insufficiantList.push('소문자')
		}

		if (!hasNumber) {
			insufficiantList.push('숫자')
		}

		if (!hasSymbol) {
			insufficiantList.push('특수문자')
		}

		if (insufficiantList.length) {
			passwordMessage = `${insufficiantList.join(', ')}를 1개 이상씩 입력하세요. `
		}

		if (password.length < 8) {
			passwordMessage += '8자 이상을 입력하세요.'
		}

		return passwordMessage
	}

	function verifyLogin(id: string, password: string) {
		const userMap:{[key: string]: {id: string, password: string, name: string, email: string, avatar: string, createdAt: string}} = {
			'jslee': {
				'id': 'jslee',
				'password': 'Hello123#',
				'name': '이종수',
				'email': 'jslee@naver.com',
				'avatar': '',
				'createdAt': '',
			},
			'willee': {
				'id': 'willee',
				'password': 'Hello123#',
				'name': '이정연',
				'email': 'willee@naver.com',
				'avatar': '',
				'createdAt': '',
			}
		}
		let idMessage = ''
		let passwordMessage = ''
		let profile = null
		console.log('id::', id, 'password::', password);

		if (!(id in userMap)) {
			idMessage = '아이디가 존재하지 않습니다.'
		} else {
			if (userMap[id]['password'] !== password) {
				passwordMessage = '비밀번호를 다시 한번 확인 바랍니다.'
			} else {
				profile = {
					'id': userMap[id]['id'],
					'name': userMap[id]['name'],
					'email': userMap[id]['email'],
					'avatar': userMap[id]['avatar'],
					'createdAt': userMap[id]['createdAt'],
				}
			}
		}
		console.log('idMessage::', idMessage, 'passwordMessage::', passwordMessage);

		return {
			'idMessage': idMessage,
			'passwordMessage': passwordMessage,
			'profile': profile
		}
	}

	$effect(() => {
		if (password) {
			passwordMessage = checkPasswordFormat(password)
		}
	});
</script>

<svelte:head>
	<title>Log In</title>
</svelte:head>

<main>
	<h1>Log In</h1>
	<p>로그인 페이지입니다.</p>
	<InputFrame 
		type="text" 
		bind:value={id} 
		placeholder="아이디" 
		status={idMessage ? 'error' : undefined}
		message={idMessage}
		/>
	<InputFrame
		type="password"
		bind:value={password}
		placeholder="비밀번호" 
		status={passwordMessage ? 'error' : undefined}
		message={passwordMessage}
	/>
	<ButtonFrame
		id="login-button"
		message="로그인"
		class={id && !passwordMessage ? ['activate'] : ['deactivate']}
		isDisabled={!(id && !passwordMessage)}
		clickHandler={() => {
			const messages = verifyLogin(id, password);
			idMessage = messages['idMessage'];
			passwordMessage = messages['passwordMessage'];
			profile.profile = messages['profile'];

			if (profile.profile) {
				goto('/')
			}
		}}
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
