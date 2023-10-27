<script lang="ts">
	import { goto } from '$app/navigation';
	import { slide } from 'svelte/transition';
	import type { PageData } from './$types';

	export let data: PageData;

	let errorMessages: string | null = null;

	let hintMessage: string | null = null;

	const signin = async (event: Event) => {
		const form = event.target as HTMLFormElement;
		const formData = new FormData(form);
		const data = Object.fromEntries(formData.entries());
		const res = await fetch('/api/auth/signin', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(data)
		});
		if (res.ok) {
			window.location.href = '/';
		} else {
			const { hint, message } = await res.json();
			errorMessages = message;
			hintMessage = hint;
		}
	};
</script>

<div class="w-full h-[100dvh] flex justify-center items-center">
	<form on:submit|preventDefault={signin} class="flex flex-col gap-2 w-96">
		<h1 class="text-4xl text-center">NIST - Demo</h1>
		<input type="text" class="p-2 border rounded" name="email" placeholder="Email" />
		<input type="password" class="p-2 border rounded" name="password" placeholder="Password" />
		{#if errorMessages}
			<p transition:slide class="text-red-500">{errorMessages}</p>
		{/if}
		{#if hintMessage}
			<div class="w-full" transition:slide>
				<p>{hintMessage}</p>
				<input type="text" class="p-2 border rounded w-full" name="answer" placeholder="answer" />
			</div>
		{/if}
		<button
		type="submit"
			class="w-full px-2 py-1 transition rounded bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white disabled:bg-blue-200 disabled:text-blue-700"
			>Sign in</button
		>
		<p class="text-center">
			Don't have an account? <span
				><button
				type="button"
					class="text-blue-500"
					on:click={() => {
						goto('/signup');
					}}>Sign up</button
				></span
			>
		</p>
	</form>
</div>
