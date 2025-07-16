// Definisi untuk ActionData yang dikembalikan oleh form action

export interface JobPosting {
  id: number;
  title: string;
}

export interface PageData {
  jobPostings: JobPosting[];
}

export interface ActionData {
  success?: boolean;
  message?: string;
  error?: string;
  errors?: {
    // Informasi Pribadi
    fullName?: string;
    gender?: string;
    placeOfBirth?: string;
    dateOfBirth?: string;
    email?: string;
    phoneNumber?: string;
    currentAddress?: string;
    
    // Riwayat Pendidikan
    highestEducation?: string;
    institutionName?: string;
    finalScore?: string;
    studyProgram?: string;
    
    // Pengalaman Kerja
    workExperienceYears?: string;
    previousCompany?: string;
    lastPosition?: string;
    jobDescription?: string;
    
    // Berkas Lamaran
    resumeFileUrl?: string;
    coverLetter?: string;
    degreeCertificateUrl?: string;
    transcriptUrl?: string;
    profilePhoto?: string;
    
    // Lowongan yang Dilamar
    appliedJobId?: string;
    howDidYouHear?: string;
    expectedSalary?: string;
    applicationStatus?: string;
  };
  values?: {
    // Informasi Pribadi
    fullName?: string;
    gender?: string;
    placeOfBirth?: string;
    dateOfBirth?: string;
    email?: string;
    phoneNumber?: string;
    currentAddress?: string;
    
    // Riwayat Pendidikan
    highestEducation?: string;
    institutionName?: string;
    finalScore?: string;
    studyProgram?: string;
    
    // Pengalaman Kerja
    workExperienceYears?: string;
    previousCompany?: string;
    lastPosition?: string;
    jobDescription?: string;
    
    // Berkas Lamaran
    resumeFileUrl?: string;
    coverLetter?: string;
    degreeCertificateUrl?: string;
    transcriptUrl?: string;
    profilePhoto?: string;
    
    // Lowongan yang Dilamar
    appliedJobId?: string;
    howDidYouHear?: string;
    expectedSalary?: string;
    applicationStatus?: string;
  };
  data?: any;
}

// Interface untuk data yang dikembalikan oleh load function
export interface PageData {
  jobPostings: Array<{
    id: number;
    title: string;
  }>;
}
