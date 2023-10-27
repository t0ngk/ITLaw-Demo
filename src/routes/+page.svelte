<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;

  const signout = async () => {
    const res = await fetch('/api/auth/signout');
    if (res.ok) {
      window.location.href = '/signin';
    }
  };
</script>

<div class="w-full h-[100dvh] flex flex-col gap-2 justify-center items-center">
		<h1 class="text-center">Welcome</h1>
		<h1 class="text-center">{data.user?.email}</h1>
    <button
    class="px-2 py-1 transition rounded bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white disabled:bg-blue-200 disabled:text-blue-700"
    on:click={signout}
    >Sign out</button
  >
</div>
