<script lang="ts">
	import type { Conversation } from '$lib/chat';

	let {
		conversation,
		profileId = '',
	}: {
		conversation: Conversation;
		profileId?: string;
	} = $props();

	const isMine = $derived(conversation.caller === profileId);

	const formattedTime = $derived.by(() => {
		const date = new Date(conversation.created_at);
		const hours = String(date.getHours()).padStart(2, '0');
		const minutes = String(date.getMinutes()).padStart(2, '0');
		const seconds = String(date.getSeconds()).padStart(2, '0');

		return `${hours}:${minutes}:${seconds}`;
	});
</script>

<div class="conversation_frame" class:conversation_frame--mine={isMine}>
	<p class="conversation_content">{conversation.content}</p>
	<time class="conversation_time" datetime={String(conversation.created_at)}>{formattedTime}</time>
</div>

<style>
	.conversation_frame {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
		max-width: 75%;
		padding: 0.625rem 0.875rem;
		border-radius: 0.75rem;
		background: #f3f4f6;
		color: #111827;
		align-self: flex-start;
	}

	.conversation_frame--mine {
		align-self: flex-end;
		background: #3b82f6;
		color: #fff;
	}

	.conversation_content {
		margin: 0;
		font-size: 1rem;
		line-height: 1.5;
		white-space: pre-wrap;
		word-break: break-word;
	}

	.conversation_time {
		font-size: 0.75rem;
		line-height: 1;
		opacity: 0.8;
		align-self: flex-end;
	}
</style>
