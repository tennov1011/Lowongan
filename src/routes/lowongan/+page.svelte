<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import type { ActionData, PageData } from './$types';
	import { writable } from 'svelte/store';

	export let form: ActionData;
	export let data: PageData;

	// Notification store
	const notification = writable({ show: false, type: '', message: '' });

	const showNotification = (type: string, message: string) => {
		notification.set({ show: true, type, message });
		setTimeout(() => {
			notification.set({ show: false, type: '', message: '' });
		}, 3000);
	};

	// Form fields - Informasi Pribadi
	let fullName = '';
	let gender = '';
	let placeOfBirth = '';
	let dateOfBirth = '';
	let email = '';
	let phoneNumber = '';
	let currentAddress = '';

	// Form fields - Riwayat Pendidikan
	let highestEducation = '';
	let institutionName = '';
	let finalScore = '';
	let studyProgram = '';

	// Form fields - Pengalaman Kerja
	let workExperienceYears = '';
	let previousCompany = '';
	let lastPosition = '';
	let jobDescription = '';

	// Form fields - Berkas Lamaran
	let resumeFileUrl = '';
	let coverLetter = '';
	let degreeCertificateUrl = '';
	let transcriptUrl = '';
	let profilePhoto: File | null = null;

	// Handle file upload
	function handleFileSelect(event: Event) {
		const input = event.target as HTMLInputElement;
		if (input.files && input.files[0]) {
			const file = input.files[0];
			// Validasi ukuran file (2MB = 2 * 1024 * 1024 bytes)
			if (file.size > 2 * 1024 * 1024) {
				alert('Ukuran file terlalu besar. Maksimal 2MB.');
				input.value = '';
				return;
			}
			// Validasi tipe file
			if (!file.type.startsWith('image/')) {
				alert('File harus berupa gambar (JPG, JPEG, atau PNG).');
				input.value = '';
				return;
			}
			profilePhoto = file;
		}
	}

	// Form fields - Lowongan yang Dilamar
	let appliedJobId = '';
	let howDidYouHear = '';
	let expectedSalary = '';
	let applicationStatus = 'pending';

	// State untuk loading
	let isLoading = false;

	// Pilihan gender
	const genderOptions = [
		{ value: 'laki-laki', label: 'Laki-laki' },
		{ value: 'perempuan', label: 'Perempuan' }
	];

	// Pilihan pendidikan terakhir
	const educationOptions = [
		{ value: 'sma', label: 'SMA/SMK/Sederajat' },
		{ value: 'd3', label: 'Diploma 3' },
		{ value: 's1', label: 'Sarjana (S1)' },
		{ value: 's2', label: 'Magister (S2)' },
		{ value: 's3', label: 'Doktor (S3)' }
	];

	// Pilihan bagaimana mengetahui lowongan
	const howDidYouHearOptions = [
		{ value: 'jobstreet', label: 'JobStreet' },
		{ value: 'linkedin', label: 'LinkedIn' },
		{ value: 'glints', label: 'Glints' },
		{ value: 'topkarir', label: 'Top Karir' },
		{ value: 'loker.id', label: 'Loker.id' },
		{ value: 'kalibrr', label: 'Kalibrr' },
		{ value: 'karir.com', label: 'Karir.com' },
		{ value: 'jobs.id', label: 'Jobs.id' },
		{ value: 'instagram', label: 'Instagram' },
		{ value: 'website', label: 'Website Perusahaan' },
		{ value: 'media_sosial', label: 'Media Sosial' },
		{ value: 'email', label: 'Email' },
		{value: 'lainnya', label: 'Lainnya'}
	];

	// Pilihan status aplikasi
	const statusOptions = [
		{ value: 'pending', label: 'Pending' },
		{ value: 'review', label: 'Under Review' },
		{ value: 'interview', label: 'Interview' },
		{ value: 'accepted', label: 'Diterima' },
		{ value: 'rejected', label: 'Ditolak' }
	];

	// Reset form values dari server jika ada
	$: if (form?.values) {
		fullName = form.values.fullName || '';
		gender = form.values.gender || '';
		placeOfBirth = form.values.placeOfBirth || '';
		dateOfBirth = form.values.dateOfBirth || '';
		email = form.values.email || '';
		phoneNumber = form.values.phoneNumber || '';
		currentAddress = form.values.currentAddress || '';
		highestEducation = form.values.highestEducation || '';
		institutionName = form.values.institutionName || '';
		finalScore = form.values.finalScore || '';
		studyProgram = form.values.studyProgram || '';
		workExperienceYears = form.values.workExperienceYears || '';
		previousCompany = form.values.previousCompany || '';
		lastPosition = form.values.lastPosition || '';
		jobDescription = form.values.jobDescription || '';
		resumeFileUrl = form.values.resumeFileUrl || '';
		coverLetter = form.values.coverLetter || '';
		degreeCertificateUrl = form.values.degreeCertificateUrl || '';
		transcriptUrl = form.values.transcriptUrl || '';
		// profilePhoto tidak perlu direset dari values karena adalah File object
		appliedJobId = form.values.appliedJobId || '';
		howDidYouHear = form.values.howDidYouHear || '';
		expectedSalary = form.values.expectedSalary || '';
		applicationStatus = form.values.applicationStatus || 'pending';
	}

	// Show notifications dari server response
	$: if (form?.success) {
		showNotification('success', form.message || 'Lamaran berhasil dikirim!');
		// Reset form setelah sukses
		fullName = '';
		gender = '';
		placeOfBirth = '';
		dateOfBirth = '';
		email = '';
		phoneNumber = '';
		currentAddress = '';
		highestEducation = '';
		institutionName = '';
		finalScore = '';
		studyProgram = '';
		workExperienceYears = '';
		previousCompany = '';
		lastPosition = '';
		jobDescription = '';
		resumeFileUrl = '';
		coverLetter = '';
		degreeCertificateUrl = '';
		transcriptUrl = '';
		profilePhoto = null;
		// Reset file input element
		const fileInput = document.getElementById('profilePhoto');
		if (fileInput) fileInput.value = '';
		appliedJobId = '';
		howDidYouHear = '';
		expectedSalary = '';
		applicationStatus = 'pending';
	}

	$: if (form?.error) {
		showNotification('error', form.error);
	}
</script>

<svelte:head>
	<title>Pendaftaran Calon Karyawan - Lowongan Kerja</title>
</svelte:head>

<div class="min-h-screen bg-slate-50">
	<!-- Header -->
	<div class="bg-white border-b border-slate-200">
		<div class="max-w-4xl mx-auto px-6 py-8">
			<div class="text-center">
				<h1 class="text-3xl font-light text-slate-900 mb-2">Pendaftaran Calon Karyawan</h1>
				<p class="text-slate-600 font-light">Lengkapi formulir berikut dengan teliti dan akurat</p>
			</div>
		</div>
	</div>

	<!-- Success/Error Messages -->
	{#if $notification.show}
		<div class="max-w-4xl mx-auto px-6 py-4">
			<div
				class="p-4 rounded-lg border {$notification.type === 'success'
					? 'border-emerald-200 bg-emerald-50 text-emerald-800'
					: 'border-rose-200 bg-rose-50 text-rose-800'} animate-slideDown"
			>
				<div class="flex items-center">
					{#if $notification.type === 'success'}
						<svg class="mr-3 h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
							<path
								fill-rule="evenodd"
								d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
								clip-rule="evenodd"
							/>
						</svg>
					{:else}
						<svg class="mr-3 h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
							<path
								fill-rule="evenodd"
								d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
								clip-rule="evenodd"
							/>
						</svg>
					{/if}
					<p class="font-medium">{$notification.message}</p>
				</div>
			</div>
		</div>
	{/if}

	<!-- Main Content -->
	<div class="max-w-4xl mx-auto px-6 py-8">
		<form
			id="application-form"
			method="POST"
			enctype="multipart/form-data"
			use:enhance={({ formData }) => {
				isLoading = true;
				console.log('Form submission started');
				
				// Append file ke FormData jika ada
				if (profilePhoto) {
					formData.set('profilePhoto', profilePhoto);
					console.log('Profile photo added to FormData');
				}
				
				return async ({ result, update }) => {
					console.log('Form submission result:', result);
					isLoading = false;
					
					// Handle different result types
					if (result.type === 'success') {
						console.log('Form submitted successfully');
						// Update akan memicu reactive statements di atas
						await update();
					} else if (result.type === 'failure') {
						console.log('Form submission failed:', result.data);
						await update();
					} else if (result.type === 'error') {
						console.error('Form submission error:', result.error);
						showNotification('error', 'Terjadi kesalahan pada server. Silakan coba lagi.');
						await update();
					} else {
						console.log('Unknown result type:', result.type);
						await update();
					}
				};
			}}
			class="space-y-12"
		>
			<!-- Informasi Pribadi -->
			<div class="bg-white rounded-xl border border-slate-200 p-8">
				<div class="mb-8">
					<h3 class="text-xl font-light text-slate-900 mb-2">Informasi Pribadi</h3>
					<div class="w-16 h-0.5 bg-slate-900"></div>
				</div>
				<div class="grid grid-cols-1 gap-8 lg:grid-cols-2">
					<!-- Left Column -->
					<div class="space-y-6">
						<!-- Nama Lengkap -->
						<div>
							<label for="fullName" class="block text-sm font-medium text-slate-700 mb-3">
								Nama Lengkap <span class="text-rose-500">*</span>
							</label>
							<input
								id="fullName"
								name="fullName"
								type="text"
								bind:value={fullName}
								required
								class="w-full px-4 py-3 border border-slate-200 rounded-lg bg-white text-slate-900 placeholder-slate-400 focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400 transition-colors"
								placeholder="Masukkan nama lengkap"
							/>
							{#if form?.errors?.fullName}
								<p class="mt-2 text-sm text-rose-600">{form.errors.fullName}</p>
							{/if}
						</div>

						<!-- Jenis Kelamin -->
						<div>
							<label for="gender" class="block text-sm font-medium text-slate-700 mb-3">
								Jenis Kelamin <span class="text-rose-500">*</span>
							</label>
							<select
								id="gender"
								name="gender"
								bind:value={gender}
								required
								class="w-full px-4 py-3 border border-slate-200 rounded-lg bg-white text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400 transition-colors"
							>
								<option value="">Pilih jenis kelamin</option>
								{#each genderOptions as option}
									<option value={option.value}>{option.label}</option>
								{/each}
							</select>
							{#if form?.errors?.gender}
								<p class="mt-2 text-sm text-rose-600">{form.errors.gender}</p>
							{/if}
						</div>

						<!-- Tempat Lahir -->
						<div>
							<label for="placeOfBirth" class="block text-sm font-medium text-slate-700 mb-3">
								Tempat Lahir <span class="text-rose-500">*</span>
							</label>
							<input
								id="placeOfBirth"
								name="placeOfBirth"
								type="text"
								bind:value={placeOfBirth}
								required
								class="w-full px-4 py-3 border border-slate-200 rounded-lg bg-white text-slate-900 placeholder-slate-400 focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400 transition-colors"
								placeholder="Masukkan tempat lahir"
							/>
							{#if form?.errors?.placeOfBirth}
								<p class="mt-2 text-sm text-rose-600">{form.errors.placeOfBirth}</p>
							{/if}
						</div>

						<!-- Tanggal Lahir -->
						<div>
							<label for="dateOfBirth" class="block text-sm font-medium text-slate-700 mb-3">
								Tanggal Lahir <span class="text-rose-500">*</span>
							</label>
							<input
								id="dateOfBirth"
								name="dateOfBirth"
								type="date"
								bind:value={dateOfBirth}
								required
								class="w-full px-4 py-3 border border-slate-200 rounded-lg bg-white text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400 transition-colors"
							/>
							{#if form?.errors?.dateOfBirth}
								<p class="mt-2 text-sm text-rose-600">{form.errors.dateOfBirth}</p>
							{/if}
						</div>
					</div>

					<!-- Right Column -->
					<div class="space-y-6">
						<!-- Email -->
						<div>
							<label for="email" class="block text-sm font-medium text-slate-700 mb-3">
								Email <span class="text-rose-500">*</span>
							</label>
							<input
								id="email"
								name="email"
								type="email"
								bind:value={email}
								required
								class="w-full px-4 py-3 border border-slate-200 rounded-lg bg-white text-slate-900 placeholder-slate-400 focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400 transition-colors"
								placeholder="contoh@email.com"
							/>
							{#if form?.errors?.email}
								<p class="mt-2 text-sm text-rose-600">{form.errors.email}</p>
							{/if}
						</div>

						<!-- Nomor Telepon -->
						<div>
							<label for="phoneNumber" class="block text-sm font-medium text-slate-700 mb-3">
								Nomor Telepon <span class="text-rose-500">*</span>
							</label>
							<input
								id="phoneNumber"
								name="phoneNumber"
								type="tel"
								bind:value={phoneNumber}
								required
								class="w-full px-4 py-3 border border-slate-200 rounded-lg bg-white text-slate-900 placeholder-slate-400 focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400 transition-colors"
								placeholder="08xxxxxxxxxx"
							/>
							{#if form?.errors?.phoneNumber}
								<p class="mt-2 text-sm text-rose-600">{form.errors.phoneNumber}</p>
							{/if}
						</div>

						<!-- Alamat Saat Ini -->
						<div>
							<label for="currentAddress" class="block text-sm font-medium text-slate-700 mb-3">
								Alamat Saat Ini <span class="text-rose-500">*</span>
							</label>
							<textarea
								id="currentAddress"
								name="currentAddress"
								bind:value={currentAddress}
								required
								rows="4"
								class="w-full px-4 py-3 border border-slate-200 rounded-lg bg-white text-slate-900 placeholder-slate-400 focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400 transition-colors resize-none"
								placeholder="Masukkan alamat lengkap saat ini"
							></textarea>
							{#if form?.errors?.currentAddress}
								<p class="mt-2 text-sm text-rose-600">{form.errors.currentAddress}</p>
							{/if}
						</div>
					</div>
				</div>
			</div>

			<!-- Riwayat Pendidikan -->
			<div class="bg-white rounded-xl border border-slate-200 p-8">
				<div class="mb-8">
					<h3 class="text-xl font-light text-slate-900 mb-2">Riwayat Pendidikan</h3>
					<div class="w-16 h-0.5 bg-slate-900"></div>
				</div>
				<div class="grid grid-cols-1 gap-8 lg:grid-cols-2">
					<!-- Left Column -->
					<div class="space-y-6">
						<!-- Pendidikan Terakhir -->
						<div>
							<label for="highestEducation" class="block text-sm font-medium text-slate-700 mb-3">
								Pendidikan Terakhir <span class="text-rose-500">*</span>
							</label>
							<select
								id="highestEducation"
								name="highestEducation"
								bind:value={highestEducation}
								required
								class="w-full px-4 py-3 border border-slate-200 rounded-lg bg-white text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400 transition-colors"
							>
								<option value="">Pilih pendidikan terakhir</option>
								{#each educationOptions as option}
									<option value={option.value}>{option.label}</option>
								{/each}
							</select>
							{#if form?.errors?.highestEducation}
								<p class="mt-2 text-sm text-rose-600">{form.errors.highestEducation}</p>
							{/if}
						</div>

						<!-- Nama Institusi -->
						<div>
							<label for="institutionName" class="block text-sm font-medium text-slate-700 mb-3">
								Nama Institusi / Sekolah <span class="text-rose-500">*</span>
							</label>
							<input
								id="institutionName"
								name="institutionName"
								type="text"
								bind:value={institutionName}
								required
								class="w-full px-4 py-3 border border-slate-200 rounded-lg bg-white text-slate-900 placeholder-slate-400 focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400 transition-colors"
								placeholder="Nama sekolah/universitas"
							/>
							{#if form?.errors?.institutionName}
								<p class="mt-2 text-sm text-rose-600">{form.errors.institutionName}</p>
							{/if}
						</div>
					</div>

					<!-- Right Column -->
					<div class="space-y-6">
						<!-- Nilai Akhir -->
						<div>
							<label for="finalScore" class="block text-sm font-medium text-slate-700 mb-3">
								Nilai Akhir (IPK/Rata-rata)
							</label>
							<input
								id="finalScore"
								name="finalScore"
								type="text"
								bind:value={finalScore}
								class="w-full px-4 py-3 border border-slate-200 rounded-lg bg-white text-slate-900 placeholder-slate-400 focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400 transition-colors"
								placeholder="3.50 atau 85"
							/>
							{#if form?.errors?.finalScore}
								<p class="mt-2 text-sm text-rose-600">{form.errors.finalScore}</p>
							{/if}
						</div>

						<!-- Program Studi -->
						<div>
							<label for="studyProgram" class="block text-sm font-medium text-slate-700 mb-3">
								Program Studi/Jurusan
							</label>
							<input
								id="studyProgram"
								name="studyProgram"
								type="text"
								bind:value={studyProgram}
								class="w-full px-4 py-3 border border-slate-200 rounded-lg bg-white text-slate-900 placeholder-slate-400 focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400 transition-colors"
								placeholder="Teknik Informatika, Akuntansi, dll"
							/>
							{#if form?.errors?.studyProgram}
								<p class="mt-2 text-sm text-rose-600">{form.errors.studyProgram}</p>
							{/if}
						</div>
					</div>
				</div>
			</div>

			<!-- Pengalaman Kerja -->
			<div class="bg-white rounded-xl border border-slate-200 p-8">
				<div class="mb-8">
					<h3 class="text-xl font-light text-slate-900 mb-2">Pengalaman Kerja</h3>
					<div class="w-16 h-0.5 bg-slate-900"></div>
				</div>
				<div class="grid grid-cols-1 gap-8 lg:grid-cols-2">
					<!-- Left Column -->
					<div class="space-y-6">
						<!-- Tahun Pengalaman Kerja -->
						<div>
							<label for="workExperienceYears" class="block text-sm font-medium text-slate-700 mb-3">
								Pengalaman Kerja (Tahun)
							</label>
							<input
								id="workExperienceYears"
								name="workExperienceYears"
								type="number"
								min="0"
								max="50"
								bind:value={workExperienceYears}
								class="w-full px-4 py-3 border border-slate-200 rounded-lg bg-white text-slate-900 placeholder-slate-400 focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400 transition-colors"
								placeholder="0 (jika fresh graduate)"
							/>
							{#if form?.errors?.workExperienceYears}
								<p class="mt-2 text-sm text-rose-600">{form.errors.workExperienceYears}</p>
							{/if}
						</div>

						<!-- Perusahaan Sebelumnya -->
						<div>
							<label for="previousCompany" class="block text-sm font-medium text-slate-700 mb-3">
								Perusahaan Terakhir
							</label>
							<input
								id="previousCompany"
								name="previousCompany"
								type="text"
								bind:value={previousCompany}
								class="w-full px-4 py-3 border border-slate-200 rounded-lg bg-white text-slate-900 placeholder-slate-400 focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400 transition-colors"
								placeholder="Nama perusahaan terakhir"
							/>
							{#if form?.errors?.previousCompany}
								<p class="mt-2 text-sm text-rose-600">{form.errors.previousCompany}</p>
							{/if}
						</div>
					</div>

					<!-- Right Column -->
					<div class="space-y-6">
						<!-- Posisi Terakhir -->
						<div>
							<label for="lastPosition" class="block text-sm font-medium text-slate-700 mb-3">
								Posisi Terakhir
							</label>
							<input
								id="lastPosition"
								name="lastPosition"
								type="text"
								bind:value={lastPosition}
								class="w-full px-4 py-3 border border-slate-200 rounded-lg bg-white text-slate-900 placeholder-slate-400 focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400 transition-colors"
								placeholder="Jabatan terakhir"
							/>
							{#if form?.errors?.lastPosition}
								<p class="mt-2 text-sm text-rose-600">{form.errors.lastPosition}</p>
							{/if}
						</div>

						<!-- Deskripsi Pekerjaan -->
						<div>
							<label for="jobDescription" class="block text-sm font-medium text-slate-700 mb-3">
								Deskripsi Pekerjaan
							</label>
							<textarea
								id="jobDescription"
								name="jobDescription"
								bind:value={jobDescription}
								rows="4"
								class="w-full px-4 py-3 border border-slate-200 rounded-lg bg-white text-slate-900 placeholder-slate-400 focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400 transition-colors resize-none"
								placeholder="Jelaskan tanggung jawab dan pencapaian di posisi terakhir"
							></textarea>
							{#if form?.errors?.jobDescription}
								<p class="mt-2 text-sm text-rose-600">{form.errors.jobDescription}</p>
							{/if}
						</div>
					</div>
				</div>
			</div>

			<!-- Berkas Lamaran -->
			<div class="bg-white rounded-xl border border-slate-200 p-8">
				<div class="mb-8">
					<h3 class="text-xl font-light text-slate-900 mb-2">Berkas Lamaran</h3>
					<div class="w-16 h-0.5 bg-slate-900"></div>
				</div>
				<div class="grid grid-cols-1 gap-8 lg:grid-cols-2">
					<!-- Left Column -->
					<div class="space-y-6">
						<!-- CV/Resume -->
						<div>
							<label for="resumeFileUrl" class="block text-sm font-medium text-slate-700 mb-3">
								CV/Resume (URL) <span class="text-rose-500">*</span>
							</label>
							<input
								id="resumeFileUrl"
								name="resumeFileUrl"
								type="url"
								bind:value={resumeFileUrl}
								required
								class="w-full px-4 py-3 border border-slate-200 rounded-lg bg-white text-slate-900 placeholder-slate-400 focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400 transition-colors"
								placeholder="https://drive.google.com/file/..."
							/>
							{#if form?.errors?.resumeFileUrl}
								<p class="mt-2 text-sm text-rose-600">{form.errors.resumeFileUrl}</p>
							{/if}
						</div>

						<!-- Ijazah -->
						<div>
							<label for="degreeCertificateUrl" class="block text-sm font-medium text-slate-700 mb-3">
								Ijazah (URL)
							</label>
							<input
								id="degreeCertificateUrl"
								name="degreeCertificateUrl"
								type="url"
								bind:value={degreeCertificateUrl}
								class="w-full px-4 py-3 border border-slate-200 rounded-lg bg-white text-slate-900 placeholder-slate-400 focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400 transition-colors"
								placeholder="https://drive.google.com/file/..."
							/>
							{#if form?.errors?.degreeCertificateUrl}
								<p class="mt-2 text-sm text-rose-600">{form.errors.degreeCertificateUrl}</p>
							{/if}
						</div>

						<!-- Transkrip -->
						<div>
							<label for="transcriptUrl" class="block text-sm font-medium text-slate-700 mb-3">
								Transkrip Nilai (URL)
							</label>
							<input
								id="transcriptUrl"
								name="transcriptUrl"
								type="url"
								bind:value={transcriptUrl}
								class="w-full px-4 py-3 border border-slate-200 rounded-lg bg-white text-slate-900 placeholder-slate-400 focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400 transition-colors"
								placeholder="https://drive.google.com/file/..."
							/>
							{#if form?.errors?.transcriptUrl}
								<p class="mt-2 text-sm text-rose-600">{form.errors.transcriptUrl}</p>
							{/if}
						</div>
					</div>

					<!-- Right Column -->
					<div class="space-y-6">
						<!-- Foto Profil -->
						<div>
							<label for="profilePhoto" class="block text-sm font-medium text-slate-700 mb-3">
								Foto Profil <span class="text-rose-500">*</span>
							</label>
							<input
								id="profilePhoto"
								name="profilePhoto"
								type="file"
								accept="image/*"
								on:change={handleFileSelect}
								class="w-full px-4 py-3 border border-slate-200 rounded-lg bg-white text-slate-900 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-slate-900 file:text-white hover:file:bg-slate-800 file:cursor-pointer cursor-pointer"
							/>
							<p class="mt-2 text-xs text-slate-500">Format yang didukung: JPG, JPEG, PNG. Maksimal 4MB</p>
							{#if form?.errors?.profilePhoto}
								<p class="mt-2 text-sm text-rose-600">{form.errors.profilePhoto}</p>
							{/if}
						</div>

						<!-- Cover Letter -->
						<div>
							<label for="coverLetter" class="block text-sm font-medium text-slate-700 mb-3">
								Cover Letter
							</label>
							<textarea
								id="coverLetter"
								name="coverLetter"
								bind:value={coverLetter}
								rows="8"
								class="w-full px-4 py-3 border border-slate-200 rounded-lg bg-white text-slate-900 placeholder-slate-400 focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400 transition-colors resize-none"
								placeholder="Jelaskan motivasi dan alasan Anda melamar di posisi ini..."
							></textarea>
							{#if form?.errors?.coverLetter}
								<p class="mt-2 text-sm text-rose-600">{form.errors.coverLetter}</p>
							{/if}
						</div>
					</div>
				</div>
			</div>

			<!-- Lowongan yang Dilamar -->
			<div class="bg-white rounded-xl border border-slate-200 p-8">
				<div class="mb-8">
					<h3 class="text-xl font-light text-slate-900 mb-2">Lowongan yang Dilamar</h3>
					<div class="w-16 h-0.5 bg-slate-900"></div>
				</div>
				<div class="grid grid-cols-1 gap-8 lg:grid-cols-2">
					<!-- Left Column -->
					<div class="space-y-6">
						<!-- Pilih Lowongan -->
						<div>
							<label for="appliedJobId" class="block text-sm font-medium text-slate-700 mb-3">
								Pilih Lowongan <span class="text-rose-500">*</span>
							</label>
							<select
								id="appliedJobId"
								name="appliedJobId"
								bind:value={appliedJobId}
								required
								class="w-full px-4 py-3 border border-slate-200 rounded-lg bg-white text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400 transition-colors"
							>
								<option value="">Pilih lowongan yang tersedia</option>
								{#each data.jobPostings as job}
									<option value={job.id}>{job.title}</option>
								{/each}
							</select>
							{#if form?.errors?.appliedJobId}
								<p class="mt-2 text-sm text-rose-600">{form.errors.appliedJobId}</p>
							{/if}
							{#if data.jobPostings.length === 0}
								<p class="mt-2 text-sm text-amber-600">Tidak ada lowongan yang tersedia saat ini</p>
							{/if}
						</div>

						<!-- Bagaimana Mengetahui Lowongan -->
						<div>
							<label for="howDidYouHear" class="block text-sm font-medium text-slate-700 mb-3">
								Bagaimana Anda Mengetahui Lowongan Ini?
							</label>
							<select
								id="howDidYouHear"
								name="howDidYouHear"
								bind:value={howDidYouHear}
								class="w-full px-4 py-3 border border-slate-200 rounded-lg bg-white text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400 transition-colors"
							>
								<option value="">Pilih platform lowongan</option>
								{#each howDidYouHearOptions as option}
									<option value={option.label}>{option.label}</option>
								{/each}
							</select>
							{#if form?.errors?.howDidYouHear}
								<p class="mt-2 text-sm text-rose-600">{form.errors.howDidYouHear}</p>
							{/if}
						</div>
					</div>

					<!-- Right Column -->
					<div class="space-y-6">
						<!-- Ekspektasi Gaji -->
						<div>
							<label for="expectedSalary" class="block text-sm font-medium text-slate-700 mb-3">
								Ekspektasi Gaji (Rp)
							</label>
							<input
								id="expectedSalary"
								name="expectedSalary"
								type="number"
								min="0"
								bind:value={expectedSalary}
								class="w-full px-4 py-3 border border-slate-200 rounded-lg bg-white text-slate-900 placeholder-slate-400 focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400 transition-colors"
								placeholder="5000000"
							/>
							{#if form?.errors?.expectedSalary}
								<p class="mt-2 text-sm text-rose-600">{form.errors.expectedSalary}</p>
							{/if}
						</div>

						<!-- Status Aplikasi (Hidden, default: pending) -->
						<input
							type="hidden"
							name="applicationStatus"
							bind:value={applicationStatus}
						/>
					</div>
				</div>
			</div>

			<!-- Submit Button -->
			<div class="flex justify-center pt-8">
				<button
					type="submit"
					disabled={isLoading}
					class="px-12 py-4 bg-slate-900 text-white font-medium rounded-lg hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
				>
					{#if isLoading}
						<div class="flex items-center">
							<svg
								class="mr-3 h-5 w-5 animate-spin"
								viewBox="0 0 24 24"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
							>
								<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
								<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
							</svg>
							Mengirim Lamaran...
						</div>
					{:else}
						Kirim Lamaran
					{/if}
				</button>
			</div>
		</form>
	</div>
</div>

<style>
	@keyframes slideDown {
		from {
			opacity: 0;
			transform: translateY(-10px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	:global(.animate-slideDown) {
		animation: slideDown 0.3s ease-out;
	}

	/* Custom scrollbar untuk textarea */
	textarea::-webkit-scrollbar {
		width: 6px;
	}

	textarea::-webkit-scrollbar-track {
		background: #f1f5f9;
		border-radius: 3px;
	}

	textarea::-webkit-scrollbar-thumb {
		background: #cbd5e1;
		border-radius: 3px;
	}

	textarea::-webkit-scrollbar-thumb:hover {
		background: #94a3b8;
	}

	/* Smooth focus transitions */
	input:focus, select:focus, textarea:focus {
		transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
	}

	/* Minimalist form styling */
	input::placeholder, textarea::placeholder {
		color: #94a3b8;
		font-weight: 300;
	}
</style>