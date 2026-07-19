<script lang="ts">
	import type { Conversation } from '$lib/chat';

	let {
		conversations,
		profileId = '',
	}: {
		conversations: (Conversation & { key: string })[];
		profileId?: string;
	} = $props();

	const isMine = $derived(conversations[0]?.caller === profileId);

	const formattedTime = $derived.by(() => {
		const createdAt = conversations[0]?.created_at;
		if (createdAt == null) return '';

		const date = new Date(createdAt);
		const hours = String(date.getHours()).padStart(2, '0');
		const minutes = String(date.getMinutes()).padStart(2, '0');
		const seconds = String(date.getSeconds()).padStart(2, '0');

		return `${hours}:${minutes}:${seconds}`;
	});
</script>

{#if conversations.length}
	<div class="conversation_row" class:conversation_row--mine={isMine}>
		<div class="conversation_frame" class:conversation_frame--mine={isMine}>
			<p class="conversation_content">
				{#each conversations as conversation, index (conversation.key)}{#if index > 0}{' '}{/if}<span
						class="conversation_segment">{conversation.content}</span
					>{/each}
			</p>
			<time class="conversation_time" datetime={String(conversations[0].created_at)}
				>{formattedTime}</time
			>
		</div>
	</div>
{/if}

<style>
	.conversation_row {
		display: flex;
		width: 100%;
		background: transparent;
		justify-content: flex-start;
	}

	.conversation_row--mine {
		justify-content: flex-end;
	}

	.conversation_frame {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
		max-width: 75%;
		padding: 0.625rem 0.875rem;
		border-radius: 0.75rem;
		background: #f3f4f6;
		color: #111827;
	}

	.conversation_frame--mine {
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

	.conversation_segment {
		border-radius: 0.25rem;
		transition: background-color 0.15s ease;
	}

	.conversation_segment:hover {
		background-color: rgba(0, 0, 0, 0.12);
		cursor: pointer;
	}

	.conversation_frame--mine .conversation_segment:hover {
		background-color: rgba(255, 255, 255, 0.25);
		cursor: pointer;
	}

	.conversation_time {
		font-size: 0.75rem;
		line-height: 1;
		opacity: 0.8;
		align-self: flex-end;
	}
</style>
