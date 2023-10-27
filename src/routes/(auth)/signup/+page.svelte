<script lang="ts">
	import { goto } from '$app/navigation';
	import { slide } from 'svelte/transition';
	import type { PageData } from './$types';

	export let data: PageData;
	let errorMessage: string | null = null;

	const signUp = async (event: Event) => {
		const form = event.target as HTMLFormElement;
		const formData = new FormData(form);
		const data = Object.fromEntries(formData.entries());
		const res = await fetch('/api/auth/signup', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(data)
		});
		if (res.ok) {
			goto('/signin');
		} else {
			const { message } = await res.json();
			errorMessage = message;
		}
	};
</script>

<div class="w-full h-[100dvh] flex justify-center items-center p-2">
	<form on:submit|preventDefault={signUp} class="flex flex-col gap-2 w-full md:w-96">
		<h1 class="text-4xl text-center">NIST - Demo</h1>
		<input type="text" class="p-2 border rounded" name="email" placeholder="Email" />
		<input type="password" class="p-2 border rounded" name="password" placeholder="Password" />
		<input
			type="password"
			class="p-2 border rounded"
			name="confirmPassword"
			placeholder="Confirm password"
		/>
		<select class="p-2 border rounded" name="hint">
			<option value={null}> Select hint question </option>
			<option value="What is your favorite color?"> What is your favorite color? </option>
			<option value="What is your favorite food?"> What is your favorite food? </option>
			<option value="What is your favorite animal?"> What is your favorite animal? </option>
		</select>
		<input type="text" class="p-2 border rounded" name="answer" placeholder="Answer" />
		{#if errorMessage}
			<p class="text-red-500" transition:slide>
				{errorMessage}
			</p>
		{/if}
		<button
		type="submit"
			class="w-full px-2 py-1 transition rounded bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white disabled:bg-blue-200 disabled:text-blue-700"
			>Sign up</button
		>
		<p class="text-center">
			Already have account? <span
				><button
				type="button"
					class="text-blue-500"
					on:click={() => {
						goto('/signin');
					}}>Sign in</button
				></span
			>
		</p>
	</form>
</div>
