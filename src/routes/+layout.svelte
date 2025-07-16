<script>
	import '../app.css';
	import { page } from '$app/stores';

	let { children } = $props();
</script>

<div class="min-h-screen bg-slate-50">
	<!-- Navigation Header -->
	<nav class="bg-white border-b border-slate-200">
		<div class="max-w-7xl mx-auto px-6 lg:px-8">
			<div class="flex justify-between items-center h-16">
				<div class="flex items-center">
					<a href="/" class="text-xl font-light text-slate-900 hover:text-slate-700 transition-colors duration-200">
						Portal Lowongan
					</a>
				</div>
				
				<div class="flex items-center space-x-8">
					<a 
						href="/" 
						class="text-slate-600 hover:text-slate-900 text-sm font-medium transition-colors duration-200 {$page.url.pathname === '/' ? 'text-slate-900' : ''}"
					>
						Beranda
					</a>
					<a 
						href="/lowongan" 
						class="text-slate-600 hover:text-slate-900 text-sm font-medium transition-colors duration-200 {$page.url.pathname === '/lowongan' ? 'text-slate-900' : ''}"
					>
						Form Lamaran
					</a>
				</div>
			</div>
		</div>
	</nav>

	<!-- Main Content -->
	<main>
		{@render children()}
	</main>
</div>
