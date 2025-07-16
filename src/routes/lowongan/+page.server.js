import { fail } from '@sveltejs/kit';
import { VITE_DIRECTUS_URL, VITE_DIRECTUS_TOKEN } from '$env/static/private';

// Load function untuk mengambil data job_posting yang tersedia
export async function load() {
  try {
    const directusUrl = VITE_DIRECTUS_URL || 'https://directus.eltamaprimaindo.com';
    const directusToken = VITE_DIRECTUS_TOKEN || 'JaXaSE93k24zq7T2-vZyu3lgNOUgP8fz';
    
    console.log('=== LOADING JOB POSTINGS ===');
    console.log('Directus URL:', directusUrl);
    console.log('Directus Token:', directusToken ? 'SET' : 'NOT SET');
    
    // Ambil daftar job_postings (tanpa filter status dulu untuk testing)
    const response = await fetch(`${directusUrl}/items/job_postings?fields=id,title&limit=-1`, {
      headers: {
        'Authorization': `Bearer ${directusToken}`
      }
    });
    
    console.log('Response status:', response.status);
    console.log('Response statusText:', response.statusText);
    
    if (response.ok) {
      const result = await response.json();
      console.log('Job postings loaded:', result.data?.length || 0);
      console.log('Raw response data:', JSON.stringify(result, null, 2));
      
      // Log job IDs and their types for debugging
      if (result.data && result.data.length > 0) {
        console.log('=== JOB POSTINGS DEBUG ===');
        result.data.forEach((job, index) => {
          console.log(`Job ${index + 1}: ID=${job.id} (type: ${typeof job.id}), Title="${job.title}"`);
        });
      }
      
      return {
        jobPostings: result.data || []
      };
    } else {
      const errorText = await response.text();
      console.error('Failed to load job postings:', response.status, response.statusText);
      console.error('Error response:', errorText);
      return {
        jobPostings: []
      };
    }
  } catch (error) {
    console.error('Error loading job postings:', error);
    return {
      jobPostings: []
    };
  }
}

export const actions = {
  default: async ({ request }) => {
    // Validasi environment variables
    console.log('=== ENVIRONMENT VARIABLES CHECK ===');
    console.log('VITE_DIRECTUS_URL:', VITE_DIRECTUS_URL ? 'SET' : 'NOT SET');
    console.log('VITE_DIRECTUS_TOKEN:', VITE_DIRECTUS_TOKEN ? 'SET' : 'NOT SET');
    
    if (!VITE_DIRECTUS_URL || !VITE_DIRECTUS_TOKEN) {
      console.error('Missing required environment variables for Directus');
      return fail(500, {
        error: 'Konfigurasi server tidak lengkap. Hubungi administrator.',
        values: {}
      });
    }
    
    const data = await request.formData();
    
    // Ekstrak data dari form
    const applicationData = {
      // Informasi Pribadi
      fullName: String(data.get('fullName') || '').trim(),
      gender: String(data.get('gender') || ''),
      placeOfBirth: String(data.get('placeOfBirth') || '').trim(),
      dateOfBirth: String(data.get('dateOfBirth') || ''),
      email: String(data.get('email') || '').trim().toLowerCase(),
      phoneNumber: String(data.get('phoneNumber') || '').trim(),
      currentAddress: String(data.get('currentAddress') || '').trim(),
      
      // Riwayat Pendidikan
      highestEducation: String(data.get('highestEducation') || ''),
      institutionName: String(data.get('institutionName') || '').trim(),
      finalScore: String(data.get('finalScore') || '').trim(),
      studyProgram: String(data.get('studyProgram') || '').trim(),
      
      // Pengalaman Kerja
      workExperienceYears: String(data.get('workExperienceYears') || '0'),
      previousCompany: String(data.get('previousCompany') || '').trim(),
      lastPosition: String(data.get('lastPosition') || '').trim(),
      jobDescription: String(data.get('jobDescription') || '').trim(),
      
      // Berkas Lamaran
      resumeFileUrl: String(data.get('resumeFileUrl') || '').trim(),
      coverLetter: String(data.get('coverLetter') || '').trim(),
      degreeCertificateUrl: String(data.get('degreeCertificateUrl') || '').trim(),
      transcriptUrl: String(data.get('transcriptUrl') || '').trim(),
      profilePhoto: data.get('profilePhoto'),
      
      // Lowongan yang Dilamar
      appliedJobId: String(data.get('appliedJobId') || '').trim(),
      howDidYouHear: String(data.get('howDidYouHear') || ''),
      expectedSalary: String(data.get('expectedSalary') || '').trim(),
      applicationStatus: String(data.get('applicationStatus') || 'pending')
    };

    // Validasi data
    const errors = {};
    
    // Validasi Informasi Pribadi
    if (!applicationData.fullName || applicationData.fullName.length < 2) {
      errors.fullName = 'Nama lengkap harus diisi minimal 2 karakter';
    } else if (applicationData.fullName.length > 100) {
      errors.fullName = 'Nama lengkap maksimal 100 karakter';
    }
    
    const validGenders = ['laki-laki', 'perempuan'];
    if (!applicationData.gender || !validGenders.includes(applicationData.gender)) {
      errors.gender = 'Jenis kelamin harus dipilih';
    }
    
    if (!applicationData.placeOfBirth || applicationData.placeOfBirth.length < 2) {
      errors.placeOfBirth = 'Tempat lahir harus diisi minimal 2 karakter';
    }
    
    if (!applicationData.dateOfBirth) {
      errors.dateOfBirth = 'Tanggal lahir harus diisi';
    } else {
      const birthDate = new Date(applicationData.dateOfBirth);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      if (age < 17 || age > 65) {
        errors.dateOfBirth = 'Umur harus antara 17-65 tahun';
      }
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!applicationData.email || !emailRegex.test(applicationData.email)) {
      errors.email = 'Email tidak valid';
    } else if (applicationData.email.length > 100) {
      errors.email = 'Email maksimal 100 karakter';
    }
    
    const phoneRegex = /^(\+62|62|0)[0-9]{9,13}$/;
    if (!applicationData.phoneNumber || !phoneRegex.test(applicationData.phoneNumber.replace(/\s+/g, ''))) {
      errors.phoneNumber = 'Nomor telepon tidak valid (contoh: 08xxxxxxxxxx)';
    }
    
    if (!applicationData.currentAddress || applicationData.currentAddress.length < 10) {
      errors.currentAddress = 'Alamat harus diisi minimal 10 karakter';
    } else if (applicationData.currentAddress.length > 500) {
      errors.currentAddress = 'Alamat maksimal 500 karakter';
    }
    
    // Validasi Riwayat Pendidikan
    const validEducations = ['sma', 'd3', 's1', 's2', 's3'];
    if (!applicationData.highestEducation || !validEducations.includes(applicationData.highestEducation)) {
      errors.highestEducation = 'Pendidikan terakhir harus dipilih';
    }
    
    if (!applicationData.institutionName || applicationData.institutionName.length < 2) {
      errors.institutionName = 'Nama institusi harus diisi';
    } else if (applicationData.institutionName.length > 100) {
      errors.institutionName = 'Nama institusi maksimal 100 karakter';
    }
    
    // Validasi Pengalaman Kerja (optional)
    if (applicationData.workExperienceYears) {
      const years = parseInt(applicationData.workExperienceYears);
      if (isNaN(years) || years < 0 || years > 50) {
        errors.workExperienceYears = 'Pengalaman kerja harus berupa angka 0-50';
      }
    }
    
    // Validasi Berkas Lamaran
    const urlRegex = /^https?:\/\/.+/;
    if (!applicationData.resumeFileUrl || !urlRegex.test(applicationData.resumeFileUrl)) {
      errors.resumeFileUrl = 'CV/Resume harus berupa URL yang valid (dimulai dengan http/https)';
    }
    
    if (applicationData.degreeCertificateUrl && !urlRegex.test(applicationData.degreeCertificateUrl)) {
      errors.degreeCertificateUrl = 'URL ijazah tidak valid';
    }
    
    if (applicationData.transcriptUrl && !urlRegex.test(applicationData.transcriptUrl)) {
      errors.transcriptUrl = 'URL transkrip tidak valid';
    }
    
    // Validasi file foto profil
    if (!applicationData.profilePhoto || !(applicationData.profilePhoto instanceof File)) {
      errors.profilePhoto = 'Foto profil harus diupload';
    } else {
      const file = applicationData.profilePhoto;
      // Validasi ukuran file (2MB)
      if (file.size > 4 * 1024 * 1024) {
        errors.profilePhoto = 'Ukuran file foto profil maksimal 4MB';
      }
      // Validasi tipe file
      if (!file.type.startsWith('image/')) {
        errors.profilePhoto = 'File foto profil harus berupa gambar (JPG, JPEG, PNG)';
      }
    }
    
    // Validasi Lowongan yang Dilamar
    if (!applicationData.appliedJobId) {
      errors.appliedJobId = 'Lowongan harus diisi';
    } else {
      // Validasi apakah job ID valid dengan mengambil semua lowongan
      try {
        const directusUrl = VITE_DIRECTUS_URL || 'https://directus.eltamaprimaindo.com';
        const directusToken = VITE_DIRECTUS_TOKEN || 'JaXaSE93k24zq7T2-vZyu3lgNOUgP8fz';
        
        console.log('=== VALIDATING JOB ID ===');
        console.log('Applied Job ID from form:', applicationData.appliedJobId);
        console.log('Applied Job ID type:', typeof applicationData.appliedJobId);
        
        // Ambil semua lowongan untuk memvalidasi ID
        const jobResponse = await fetch(`${directusUrl}/items/job_postings?fields=id,title&limit=-1`, {
          headers: {
            'Authorization': `Bearer ${directusToken}`
          }
        });
        
        if (!jobResponse.ok) {
          errors.appliedJobId = 'Gagal memvalidasi lowongan';
        } else {
          const jobsResult = await jobResponse.json();
          console.log('Available jobs:', jobsResult.data);
          
          // Convert both to strings for comparison
          const jobIds = jobsResult.data.map(job => String(job.id));
          const appliedJobIdStr = String(applicationData.appliedJobId);
          
          console.log('Available job IDs (as strings):', jobIds);
          console.log('Applied job ID (as string):', appliedJobIdStr);
          console.log('Job ID found:', jobIds.includes(appliedJobIdStr));
          
          if (!jobIds.includes(appliedJobIdStr)) {
            errors.appliedJobId = 'Lowongan yang dipilih tidak valid';
          }
        }
      } catch (error) {
        console.error('Error validating job posting:', error);
        errors.appliedJobId = 'Gagal memvalidasi lowongan yang dipilih';
      }
    }
    
    // Menggunakan label terkapitalisasi untuk validasi
    const validHowDidYouHearLabels = ['JobStreet', 'LinkedIn', 'Glints', 'Top Karir', 'Loker.id', 'Kalibrr', 'Karir.com', 'Jobs.id', 'Instagram', 'Website Perusahaan', 'Media Sosial', 'Email', 'Lainnya'];
    if (applicationData.howDidYouHear && !validHowDidYouHearLabels.includes(applicationData.howDidYouHear)) {
      errors.howDidYouHear = 'Sumber informasi tidak valid';
    }
    
    if (!applicationData.expectedSalary) {
      errors.expectedSalary = 'Ekspektasi gaji harus diisi';
    } else {
      const salary = parseInt(applicationData.expectedSalary);
      if (isNaN(salary) || salary <= 0) {
        errors.expectedSalary = 'Ekspektasi gaji harus berupa angka positif';
      }
    }

    // Jika ada error, return dengan error
    if (Object.keys(errors).length > 0) {
      console.log('Validation errors:', errors);
      
      // Remove File object from values to avoid serialization error
      const serializableValues = { ...applicationData };
      delete serializableValues.profilePhoto;
      
      return fail(400, {
        errors,
        values: serializableValues
      });
    }

    // Upload file foto profil ke Directus
    let profilePhotoFileId = null;
    if (applicationData.profilePhoto && applicationData.profilePhoto instanceof File) {
      try {
        const directusUrl = VITE_DIRECTUS_URL || 'https://directus.eltamaprimaindo.com';
        const directusToken = VITE_DIRECTUS_TOKEN || 'JaXaSE93k24zq7T2-vZyu3lgNOUgP8fz';
        
        // Buat FormData untuk upload file
        const fileFormData = new FormData();
        fileFormData.append('file', applicationData.profilePhoto);
        
        console.log('=== UPLOADING PROFILE PHOTO ===');
        console.log('File name:', applicationData.profilePhoto.name);
        console.log('File size:', applicationData.profilePhoto.size);
        console.log('File type:', applicationData.profilePhoto.type);
        
        // Upload file ke Directus
        const uploadResponse = await fetch(`${directusUrl}/files`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${directusToken}`
          },
          body: fileFormData
        });
        
        if (uploadResponse.ok) {
          const uploadResult = await uploadResponse.json();
          profilePhotoFileId = uploadResult.data.id;
          console.log('File uploaded successfully. File ID:', profilePhotoFileId);
        } else {
          const uploadError = await uploadResponse.text();
          console.error('File upload failed:', uploadError);
          
          // Remove File object from values to avoid serialization error
          const serializableValues = { ...applicationData };
          delete serializableValues.profilePhoto;
          
          return fail(500, {
            error: 'Gagal mengupload foto profil. Silakan coba lagi.',
            values: serializableValues
          });
        }
      } catch (uploadErr) {
        console.error('Error uploading file:', uploadErr);
        
        // Remove File object from values to avoid serialization error
        const serializableValues = { ...applicationData };
        delete serializableValues.profilePhoto;
        
        return fail(500, {
          error: 'Terjadi kesalahan saat mengupload foto profil.',
          values: serializableValues
        });
      }
    }

    // Get job title from job ID for final data
    let selectedJobTitle = null;
    if (applicationData.appliedJobId) {
      try {
        const directusUrl = VITE_DIRECTUS_URL || 'https://directus.eltamaprimaindo.com';
        const directusToken = VITE_DIRECTUS_TOKEN || 'JaXaSE93k24zq7T2-vZyu3lgNOUgP8fz';
        
        const jobResponse = await fetch(`${directusUrl}/items/job_postings?fields=id,title&limit=-1`, {
          headers: {
            'Authorization': `Bearer ${directusToken}`
          }
        });
        
        if (jobResponse.ok) {
          const jobsResult = await jobResponse.json();
          console.log('=== GETTING JOB TITLE ===');
          console.log('Looking for job ID:', applicationData.appliedJobId);
          console.log('Available jobs:', jobsResult.data);
          
          // Convert appliedJobId to match the type from database
          const appliedJobIdStr = String(applicationData.appliedJobId);
          const selectedJob = jobsResult.data.find(job => String(job.id) === appliedJobIdStr);
          selectedJobTitle = selectedJob?.title || null;
          
          console.log('Selected job:', selectedJob);
          console.log('Selected job title:', selectedJobTitle);
        }
      } catch (error) {
        console.error('Error getting job title:', error);
      }
    }

    // Buat data final yang akan dikirim ke Directus (menggunakan camelCase sesuai struktur database)
    const finalData = {
      // Informasi Pribadi
      fullName: applicationData.fullName,
      gender: applicationData.gender,
      placeOfBirth: applicationData.placeOfBirth,
      dateOfBirth: applicationData.dateOfBirth,
      email: applicationData.email,
      phoneNumber: applicationData.phoneNumber,
      currentAddress: applicationData.currentAddress,
      
      // Riwayat Pendidikan
      highestEducation: applicationData.highestEducation,
      institutionName: applicationData.institutionName,
      finalScore: applicationData.finalScore || null,
      studyProgram: applicationData.studyProgram || null,
      
      // Pengalaman Kerja
      workExperienceYears: applicationData.workExperienceYears ? parseInt(applicationData.workExperienceYears) : 0,
      previousCompany: applicationData.previousCompany || null,
      lastPosition: applicationData.lastPosition || null,
      jobDescription: applicationData.jobDescription || null,
      
      // Berkas Lamaran
      resumeFileUrl: applicationData.resumeFileUrl,
      coverLetter: applicationData.coverLetter || null,
      degreeCertificateUrl: applicationData.degreeCertificateUrl || null,
      transcriptUrl: applicationData.transcriptUrl || null,
      profilePhoto: profilePhotoFileId, // Gunakan file ID dari Directus
      
      // Lowongan yang Dilamar
      appliedJobTitle: selectedJobTitle, // Menyimpan title lowongan berdasarkan ID yang dipilih
      appliedJobId: applicationData.appliedJobId, // Menyimpan ID lowongan
      howDidYouHear: applicationData.howDidYouHear || null,
      expectedSalary: applicationData.expectedSalary ? parseInt(applicationData.expectedSalary) : null,
      applicationStatus: applicationData.applicationStatus,
      
      // Timestamp saat pembuatan (waktu aplikasi dikirim)
      date_created: new Date().toISOString()
    };

    try {
      // Environment variables dari .env
      const directusUrl = VITE_DIRECTUS_URL || 'https://directus.eltamaprimaindo.com';
      const directusToken = VITE_DIRECTUS_TOKEN || 'JaXaSE93k24zq7T2-vZyu3lgNOUgP8fz';
      const requestUrl = `${directusUrl}/items/job_applications`;
      
      // Log data yang akan dikirim untuk debugging
      console.log('=== DEBUGGING DIRECTUS REQUEST ===');
      console.log('Environment Variables:');
      console.log('- DIRECTUS_URL:', directusUrl);
      console.log('- DIRECTUS_TOKEN:', directusToken ? 'SET' : 'NOT SET');
      console.log('Request URL:', requestUrl);
      console.log('Request Method:', 'POST');
      console.log('Request Headers:', {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${directusToken}`
      });
      console.log('Request Body:', JSON.stringify(finalData, null, 2));
      console.log('Date Created field:', finalData.date_created);
      
      // Post data ke Directus collection 'items/job_applications'
      const response = await fetch(requestUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${directusToken}`
        },
        body: JSON.stringify(finalData)
      });
      
      // Log response untuk debugging
      console.log('=== DIRECTUS RESPONSE ===');
      console.log('Response Status:', response.status);
      console.log('Response Status Text:', response.statusText);
      console.log('Response OK:', response.ok);
      
      // Clone response untuk bisa dibaca berkali-kali
      const responseClone = response.clone();
      const responseText = await responseClone.text();
      console.log('Response Text:', responseText);
      
      if (response.ok) {
        const result = await response.json();
        console.log('=== SUCCESS ===');
        console.log('Directus Response:', result);
        
        return {
          success: true,
          message: 'Lamaran Anda berhasil dikirim! Kami akan menghubungi Anda segera.',
          data: result.data
        };
      } else {
        console.error('=== DIRECTUS ERROR ===');
        console.error('Response Status:', response.status);
        console.error('Response Text:', responseText);
        
        // Parse error response jika memungkinkan
        let errorMessage = 'Terjadi kesalahan saat mengirim lamaran';
        try {
          const errorResult = JSON.parse(responseText);
          if (errorResult.errors && errorResult.errors.length > 0) {
            errorMessage = errorResult.errors[0].message || errorMessage;
          }
        } catch (parseError) {
          console.error('Error parsing response:', parseError);
        }
        
        // Remove File object from values to avoid serialization error
        const serializableValues = { ...applicationData };
        delete serializableValues.profilePhoto;
        
        return fail(response.status, {
          error: errorMessage,
          values: serializableValues
        });
      }
    } catch (err) {
      console.error('=== NETWORK/PARSING ERROR ===');
      console.error('Error:', err);
      
      // Remove File object from values to avoid serialization error
      const serializableValues = { ...applicationData };
      delete serializableValues.profilePhoto;
      
      return fail(500, {
        error: 'Terjadi kesalahan jaringan. Silakan coba lagi nanti.',
        values: serializableValues
      });
    }
  }
};