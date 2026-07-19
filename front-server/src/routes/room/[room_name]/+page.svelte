<script lang="ts">
	import type { PageProps } from './$types';
	import { onMount } from 'svelte';
	import { chatSocket, joinRoom, setConversationCallback, type Conversation } from '$lib/chat';
	import { profile } from '$lib/profile';
	import ButtonFrame from '$lib/components/ButtonFrame.svelte';
	import ConversationFrame from '$lib/components/ConversationFrame.svelte';

	let { params }: PageProps = $props();
	let isMicAvailable = $state(true);
	let isRecording = $state(false);
	let myStream = $state<MediaStream | null>(null);
	let mediaRecorder = $state<MediaRecorder | null>(null);
	let audioChunks: BlobPart[] = [];
	let classList = $state(['record-audio-button']);
	let conversationsList = $state<(Conversation & { key: string })[][]>([]);

	const SAVE_AUDIO_URL = import.meta.env.VITE_SAVE_AUDIO_URL;

	async function sendAudioFile(
		audioBlob: Blob,
		filename: string,
		callId: string,
		caller: string
	) {
		const formData = new FormData();
		formData.append('file', audioBlob, filename);
		formData.append('call_id', callId);
		formData.append('caller', caller);

		const response = await fetch(`${SAVE_AUDIO_URL}/save`, {
			method: 'POST',
			body: formData
		});
		console.log("sendAudioFile response", response);

		if (!response.ok) {
			throw new Error(`오디오 전송 실패: ${response.status}`);
		}
	}

	async function getMyStream() {
		let stream: MediaStream | null = null;
		let isMicAvailable = true;

		try {
			stream = await navigator.mediaDevices.getUserMedia({ audio: true });
		} catch (error) {
			console.error('Error getting my stream', error);
			isMicAvailable = false;
			classList = [...classList, 'disabled'];
		}

		return {
			'stream': stream,
			'isMicAvailable': isMicAvailable
		}
	}

	async function recordAudio() {
		if (!myStream) {
			const result = await getMyStream();

			myStream = result.stream
			isMicAvailable = result.isMicAvailable
		}

		if (!myStream) {
			return;
		}

		isRecording = !isRecording;

		if (isRecording) {
			audioChunks = [];
			mediaRecorder = new MediaRecorder(myStream);
			mediaRecorder.ondataavailable = (event) => {
				if (event.data.size > 0) {
					audioChunks.push(event.data);
				}
			};
			mediaRecorder.start();
			classList = [...classList, 'recording'];
		} else {
			if (!mediaRecorder) {
				return;
			}

			classList = classList.filter(className => className !== 'recording');
			const recorder = mediaRecorder;
			recorder.onstop = async () => {
				const mimeType = recorder.mimeType || 'audio/webm';
				const extension = mimeType.includes('webm') ? 'webm' : 'ogg';
				const audioBlob = new Blob(audioChunks, { type: mimeType });
				const filename = `${Date.now()}.${extension}`;
				const callId = params.room_name;
				const caller = profile.profile?.id ?? 'unknown';

				try {
					await sendAudioFile(audioBlob, filename, callId, caller);
				} catch (error) {
					console.error('Error sending audio file', error);
				}

				mediaRecorder = null;
				audioChunks = [];
			};
			recorder.stop();
		}
	}

	function setConversationsList(conversation_list: Conversation[]) {
		conversation_list.sort((a: Conversation, b: Conversation) =>
			a.created_at - b.created_at || a.caller.localeCompare(b.caller)
		);

		let lastConversation: Conversation | null = null
		let conversations: (Conversation & { key: string })[][] = [];
		let lastConversations: (Conversation & { key: string })[] = [];
		for (const conversation of conversation_list) {
			if (!lastConversation) {
				lastConversation = conversation
			}

			if (lastConversation.caller !== conversation.caller || lastConversation.created_at !== conversation.created_at) {
				console.log("lastConversations", lastConversations);
				console.log("conversation", conversation);
				lastConversations.sort((a: Conversation & { key: string }, b: Conversation & { key: string }) => a.relative_start_time - b.relative_start_time);
				conversations.push(lastConversations)
				lastConversations = []
				lastConversation = conversation
			}
			
			lastConversations.push({
				...conversation,
				key: crypto.randomUUID()
			})
		}
		lastConversations.sort((a: Conversation & { key: string }, b: Conversation & { key: string }) => a.relative_start_time - b.relative_start_time);
		conversations.push(lastConversations)

		return conversations;
	}

	function handleConversationsCallback(conversations: Conversation[]) {
		const newConversationsList = setConversationsList(conversations);

		conversationsList = [...conversationsList, ...newConversationsList];
	}

	onMount(async() => {
		if (profile.profile) {
			joinRoom(params.room_name, profile.profile);
			const response = await fetch(`${SAVE_AUDIO_URL}/conversation_list`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					room: params.room_name,
					target_time: Date.now(),
					offset: 0
				})
			});

			if (!response.ok) {
				throw new Error(`Failed to get conversations: ${response.status}`);
			}

			const data = await response.json();
			const conversation_list = data.conversation_list as Conversation[];
			
			if (conversation_list.length) {
				const conversations = setConversationsList(conversation_list);
				conversationsList = conversations
				console.log("conversationsList", conversationsList);
			}

			setConversationCallback(handleConversationsCallback);
		}
	})
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
	<ButtonFrame 
	id="record-audio-button" 
	class={['record-audio-button']} 
	isDisabled={!isMicAvailable} clickHandler={async () => await recordAudio()} 
	message={isRecording ? 'Stop Recording' : 'Record Audio'}
	/>

	<div class="conversation-list">
		{#each conversationsList as conversations (conversations[0].key)}
			<ConversationFrame
				{conversations}
				profileId={profile.profile?.id ?? ''}
			/>
		{/each}
	</div>
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

	.conversation-list {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		margin-top: 1.5rem;
	}
</style>
