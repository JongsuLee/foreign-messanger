<script lang="ts">
	type InputType = 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search';
	type MessageStatus = 'correct' | 'error';

	let {
		type = 'text',
		message = '',
		status,
		value = $bindable(''),
		placeholder = '',
		name = '',
		id = '',
		disabled = false,
	}: {
		type?: InputType;
		message?: string;
		status?: MessageStatus;
		value?: string;
		placeholder?: string;
		name?: string;
		id?: string;
		disabled?: boolean;
	} = $props();
</script>

<div class="input_frame">
	<input
		class="input_text"
		class:input_text--error={status === 'error'}
		class:input_text--correct={status === 'correct'}
		{type}
		{name}
		{id}
		{placeholder}
		{disabled}
		bind:value
	/>
	{#if message}
		<div class="input_message" class:correct={status === 'correct'} class:error={status === 'error'}>
			{message}
		</div>
	{/if}
</div>

<style>
	.input_frame {
		display: flex;
		flex-direction: column;
		gap: 0.375rem;
	}

	.input_text {
		width: 100%;
		padding: 0.625rem 0.75rem;
		border: 1px solid #d1d5db;
		border-radius: 0.375rem;
		font-size: 1rem;
		line-height: 1.5;
		background: #fff;
		transition: border-color 0.15s ease;
	}

	.input_text:focus {
		outline: none;
		border-color: #3b82f6;
	}

	.input_text--error {
		border-color: #ef4444;
	}

	.input_text--correct {
		border-color: #22c55e;
	}

	.input_message {
		font-size: 0.875rem;
		line-height: 1.25rem;
	}

	.input_message.correct {
		color: #16a34a;
	}

	.input_message.error {
		color: #dc2626;
	}
</style>
