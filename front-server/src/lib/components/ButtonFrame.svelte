<script lang="ts">
	let {
		id = '',
		class: classList = [],
		message = '',
		isDisabled = false,
		clickHandler = null,
	}: {
		id?: string;
		class?: string[];
		message?: string;
		isDisabled?: boolean;
		clickHandler?: ((event: MouseEvent) => void) | null;
	} = $props();

	const buttonClass = $derived(['button_frame', ...classList].filter(Boolean).join(' '));
</script>

<button
	{id}
	class={buttonClass}
	disabled={isDisabled}
	onclick={clickHandler ?? undefined}
>
	{message}
</button>

<style>
	.button_frame {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		padding: 0.625rem 1rem;
		border: 1px solid transparent;
		border-radius: 0.375rem;
		font-size: 1rem;
		line-height: 1.5;
		font-weight: 500;
		cursor: pointer;
		background: #3b82f6;
		color: #fff;
		transition:
			background-color 0.15s ease,
			opacity 0.15s ease;
	}

	.button_frame:hover:not(:disabled) {
		background: #2563eb;
	}

	.button_frame:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}
</style>
