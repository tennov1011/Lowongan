<svelte:head>
	<title>Portal Lowongan</title>
</svelte:head>

<div class="flex min-h-screen items-center justify-center bg-slate-50 px-6 py-12">
	<div class="w-full max-w-3xl">
		<div class="mb-16 text-center">
			<h1 class="mb-6 text-5xl font-extralight tracking-tight text-slate-900 md:text-6xl">
				Portal Lowongan Kerja
			</h1>
			<div class="mx-auto mb-8 h-0.5 w-24 bg-slate-900"></div>
			<p class="mx-auto max-w-2xl text-lg leading-relaxed font-light text-slate-600">
				Selamat datang di sistem manajemen lowongan kerja yang sederhana dan efisien. Mulai
				perjalanan karir Anda bersama kami dengan proses yang mudah dan transparan.
			</p>
		</div>

		<div class="space-y-8">
			<!-- Main CTA -->
			<div class="text-center">
				<a
					href="/lowongan"
					class="group inline-flex items-center rounded-lg bg-slate-900 px-8 py-4 font-medium text-white transition-all duration-200 hover:bg-slate-800 focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 focus:outline-none"
				>
					<span class="mr-3">📝</span>
					Daftar Sekarang
					<svg
						class="ml-2 h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"
						></path>
					</svg>
				</a>
			</div>

			<!-- Feature Card -->
			<div class="mt-16 flex justify-center">
				<div class="max-w-md">
					<div
						class="rounded-xl border border-slate-200 bg-white p-8 transition-colors duration-200 hover:border-slate-300"
					>
						<div class="mb-6 text-center text-4xl">👥</div>
						<h3 class="mb-4 text-center text-xl font-light text-slate-900">Untuk Anda</h3>
						<p class="text-center leading-relaxed font-light text-slate-600">
							Isi formulir lamaran kerja dengan mudah dan kirimkan aplikasi Anda langsung kepada tim
							rekrutmen
						</p>
					</div>
				</div>
			</div>

			<!-- Contact Info -->
			<div class="border-t border-slate-200 pt-12 text-center">
				<p class="text-sm font-light text-slate-500">
					Butuh bantuan? Hubungi tim HR kami di
					<a
						href="https://wa.me/62881010095648"
						target="_blank"
						rel="noopener"
						class="font-medium text-slate-700 transition-colors duration-200 hover:text-slate-900"
						>Chat HR: 0881-0100-95648</a
					>
				</p>
			</div>
		</div>
	</div>
</div>
