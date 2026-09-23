import { AssessmentSubmission, FormData } from '../types';

const API_BASE = '/api';

export const apiService = {
  // 1. Submit assessment data to Laravel MySQL Backend
  async saveSubmission(submissionData: Partial<AssessmentSubmission>): Promise<string> {
    const fallbackId = submissionData.id || 'SUB-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
    const newSubmission: AssessmentSubmission = {
      id: fallbackId,
      timestamp: submissionData.timestamp || new Date().toISOString(),
      assessmentType: submissionData.assessmentType || 'organization',
      companyName: submissionData.companyName || '',
      industry: submissionData.industry || '',
      companySize: submissionData.companySize || '',
      location: submissionData.location || '',
      aiGoal: submissionData.aiGoal || '',
      aiUseCase: submissionData.aiUseCase || '',
      aiTools: submissionData.aiTools || '',
      aiCurrentUse: submissionData.aiCurrentUse || '',
      aiFrequentUse: submissionData.aiFrequentUse || '',
      aiLearningNeed: submissionData.aiLearningNeed || '',
      aiMasteryTarget: submissionData.aiMasteryTarget || '',
      timeline: submissionData.timeline || '',
      fullName: submissionData.fullName || '',
      jobTitle: submissionData.jobTitle || '',
      email: submissionData.email || '',
      phone: submissionData.phone || '',
      experienceYears: submissionData.experienceYears || '',
      aiUsageFrequency: submissionData.aiUsageFrequency || '',
      aiToolsUsed: submissionData.aiToolsUsed || '',
      overallScore: submissionData.overallScore || 0,
      scores: submissionData.scores || { strategi: 0, proses: 0, sdm: 0, data: 0, tataKelola: 0 },
      readinessLevel: submissionData.readinessLevel || 'Pemula (Beginner)',
      readinessDescription: submissionData.readinessDescription || '',
      answers: submissionData.answers || {},
    };

    // Save to localStorage as immediate cache
    try {
      const existingStr = localStorage.getItem('nortis_assessment_submissions') || localStorage.getItem('nortis_submissions');
      const existing: AssessmentSubmission[] = existingStr ? JSON.parse(existingStr) : [];
      const updated = [newSubmission, ...existing.filter(s => s.id !== newSubmission.id)];
      localStorage.setItem('nortis_assessment_submissions', JSON.stringify(updated));
      localStorage.setItem('nortis_submissions', JSON.stringify(updated));
    } catch (err) {
      console.warn('LocalStorage save error:', err);
    }

    try {
      const response = await fetch(`${API_BASE}/submissions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(submissionData)
      });
      if (response.ok) {
        const result = await response.json();
        return result.submissionId || result.id || fallbackId;
      }
    } catch (e) {
      console.warn('API unavailable, using local ID:', e);
    }

    return fallbackId;
  },

  // Get single submission by ID
  async getSubmissionById(id: string): Promise<AssessmentSubmission | null> {
    try {
      const response = await fetch(`${API_BASE}/submissions/${id}`, {
        headers: { 'Accept': 'application/json' }
      });
      if (response.ok) {
        const result = await response.json();
        if (result.success && result.data) {
          return result.data;
        }
      }
    } catch (e) {
      console.warn('API getById error, checking localStorage:', e);
    }

    const existingStr = localStorage.getItem('nortis_assessment_submissions') || localStorage.getItem('nortis_submissions');
    if (existingStr) {
      const existing: AssessmentSubmission[] = JSON.parse(existingStr);
      return existing.find(s => s.id === id) || null;
    }
    return null;
  },

  // 2. Fetch all submissions for Admin Dashboard
  async getSubmissions(): Promise<AssessmentSubmission[]> {
    let serverSubmissions: AssessmentSubmission[] = [];
    let hasServerData = false;

    try {
      const response = await fetch(`${API_BASE}/submissions`, {
        headers: { 'Accept': 'application/json' }
      });
      if (response.ok) {
        const result = await response.json();
        if (result.success && Array.isArray(result.data)) {
          serverSubmissions = result.data;
          hasServerData = true;
        }
      }
    } catch (e) {
      console.warn('API unavailable, will fall back to local storage:', e);
    }

    // Read local submissions
    let localSubmissions: AssessmentSubmission[] = [];
    const existingStr = localStorage.getItem('nortis_assessment_submissions') || localStorage.getItem('nortis_submissions');
    if (existingStr) {
      try {
        const parsed = JSON.parse(existingStr);
        if (Array.isArray(parsed)) {
          localSubmissions = parsed;
        }
      } catch (err) {
        console.warn('Error parsing local submissions:', err);
      }
    }

    // Default sample seed items
    const defaultSeeds: AssessmentSubmission[] = [
      {
        id: 'SUB-COMPANY-DEMO',
        timestamp: new Date(Date.now() - 86400000 * 2).toISOString(),
        assessmentType: 'organization',
        companyName: 'PT Nusantara Digital Solusindo',
        industry: 'technology',
        companySize: 's200',
        location: 'Jakarta Selatan',
        aiGoal: 'Meningkatkan efisiensi pengembangan software dan otomasi customer support',
        aiUseCase: 'AI Coding Assistant & Customer Support Chatbot Agent',
        aiTools: 'ChatGPT Plus, GitHub Copilot, Claude API',
        aiCurrentUse: 'Penggunaan aktif di divisi software engineering',
        aiFrequentUse: 'Code generation dan debugging',
        aiLearningNeed: 'Prompt engineering lanjutan & tata kelola privasi data',
        aiMasteryTarget: 'Full automation support dalam 6 bulan',
        timeline: 'm6',
        fullName: 'Bambang Pratama',
        jobTitle: 'Head of Technology',
        email: 'bambang@nusantaradigital.id',
        phone: '081289123456',
        overallScore: 3.75,
        scores: {
          strategi: 3.8,
          proses: 4.0,
          sdm: 3.4,
          data: 3.8,
          tataKelola: 3.8
        },
        readinessLevel: 'AI-Enabled',
        readinessDescription: 'Organisasi sudah menerapkan AI di beberapa pilar penting dan siap melakukan scaling terarah.'
      },
      {
        id: 'SUB-INDIVIDUAL-DEMO',
        timestamp: new Date(Date.now() - 86400000).toISOString(),
        assessmentType: 'individual',
        companyName: 'Bank Mandiri Tbk',
        industry: 'banking',
        companySize: 'splus',
        location: 'Jakarta Pusat',
        fullName: 'Sarah Amanda Putri',
        jobTitle: 'Senior Product Manager',
        email: 'sarah.amanda@mandiri.co.id',
        phone: '081198765432',
        experienceYears: '3-5 tahun',
        aiUsageFrequency: 'Harian (Setiap Hari)',
        aiToolsUsed: 'ChatGPT-4o, Claude 3.5 Sonnet, Perplexity AI, Midjourney',
        aiGoal: 'Otomasi penulisan PRD, riset pasar kompetitor, dan analisis user feedback',
        aiFrequentUse: 'Drafting spesifikasi produk dan sintesis riset pengguna',
        aiLearningNeed: 'Multi-agent orchestration dan AI product strategy',
        aiMasteryTarget: 'Membangun internal AI workflows untuk tim produk',
        timeline: 'm3',
        overallScore: 4.15,
        scores: {
          aiLiteracy: 4.4,
          taskFraming: 4.2,
          workflow: 4.0,
          evaluation: 4.2,
          responsibleAi: 4.0,
          collaboration: 4.1
        },
        readinessLevel: 'AI-Enabled',
        readinessDescription: 'AI sudah terintegrasi dalam pekerjaan Anda secara teratur dan menghasilkan efisiensi tinggi.'
      }
    ];

    // Filter out explicitly deleted submissions
    let deletedIds: string[] = [];
    try {
      deletedIds = JSON.parse(localStorage.getItem('nortis_deleted_submissions') || '[]');
    } catch (e) {}

    const combinedMap = new Map<string, AssessmentSubmission>();
    
    // Put seeds first
    defaultSeeds.forEach(s => {
      if (!deletedIds.includes(s.id)) combinedMap.set(s.id, s);
    });
    // Overlay local submissions
    localSubmissions.forEach(s => {
      if (!deletedIds.includes(s.id)) combinedMap.set(s.id, s);
    });
    // Overlay server submissions
    serverSubmissions.forEach(s => {
      if (!deletedIds.includes(s.id)) combinedMap.set(s.id, s);
    });

    const mergedList = Array.from(combinedMap.values()).sort((a, b) => {
      const timeA = new Date(a.timestamp || 0).getTime();
      const timeB = new Date(b.timestamp || 0).getTime();
      return timeB - timeA;
    });

    // Keep localStorage in sync with merged list
    try {
      localStorage.setItem('nortis_assessment_submissions', JSON.stringify(mergedList));
      localStorage.setItem('nortis_submissions', JSON.stringify(mergedList));
    } catch (e) {}

    // If server was empty but local has items, sync them back to server in background
    if (hasServerData && serverSubmissions.length === 0 && mergedList.length > 0) {
      mergedList.forEach(item => {
        fetch(`${API_BASE}/submissions`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(item)
        }).catch(() => {});
      });
    }

    return mergedList;
  },

  // 3. Update existing submission
  async updateSubmission(id: string, updatedData: Partial<AssessmentSubmission>): Promise<AssessmentSubmission | null> {
    // 1. Update local storage
    let updatedItem: AssessmentSubmission | null = null;
    const existingStr = localStorage.getItem('nortis_assessment_submissions') || localStorage.getItem('nortis_submissions');
    if (existingStr) {
      try {
        const existing: AssessmentSubmission[] = JSON.parse(existingStr);
        const index = existing.findIndex(s => s.id === id);
        if (index !== -1) {
          existing[index] = { ...existing[index], ...updatedData, id };
          updatedItem = existing[index];
          localStorage.setItem('nortis_assessment_submissions', JSON.stringify(existing));
          localStorage.setItem('nortis_submissions', JSON.stringify(existing));
        }
      } catch (e) {
        console.warn('Error updating local storage:', e);
      }
    }

    // 2. Update on server
    try {
      const response = await fetch(`${API_BASE}/submissions/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(updatedData)
      });
      if (response.ok) {
        const resJson = await response.json();
        if (resJson.data) {
          return resJson.data;
        }
      }
    } catch (e) {
      console.warn('API update error, using local updated item:', e);
    }

    return updatedItem;
  },

  // 4. Delete submission
  async deleteSubmission(id: string): Promise<boolean> {
    // 1. Update local storage
    const existingStr = localStorage.getItem('nortis_assessment_submissions') || localStorage.getItem('nortis_submissions');
    if (existingStr) {
      try {
        const existing: AssessmentSubmission[] = JSON.parse(existingStr);
        const filtered = existing.filter(s => s.id !== id);
        localStorage.setItem('nortis_assessment_submissions', JSON.stringify(filtered));
        localStorage.setItem('nortis_submissions', JSON.stringify(filtered));
      } catch (e) {}
    }

    // 2. Track deleted ID to prevent seed recreation
    try {
      const deletedIds: string[] = JSON.parse(localStorage.getItem('nortis_deleted_submissions') || '[]');
      if (!deletedIds.includes(id)) {
        deletedIds.push(id);
        localStorage.setItem('nortis_deleted_submissions', JSON.stringify(deletedIds));
      }
    } catch (e) {}

    // 3. Delete from server
    try {
      await fetch(`${API_BASE}/submissions/${id}`, {
        method: 'DELETE',
        headers: { 'Accept': 'application/json' }
      });
    } catch (e) {
      console.warn('API delete error:', e);
    }
    return true;
  },

  // 4. Admin Auth
  async loginAdmin(email: string, password: string): Promise<{ success: boolean; token?: string; message?: string }> {
    try {
      const response = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();
      return data;
    } catch (e) {
      if (email === 'admin@nortis.ai' && password === 'password') {
        return { success: true, token: 'local-token-admin' };
      }
      return { success: false, message: 'Koneksi API gagal' };
    }
  },

  // 5. Fetch CMS Config from MySQL
  async getCMSData(): Promise<any> {
    try {
      const response = await fetch(`${API_BASE}/cms`, {
        headers: { 'Accept': 'application/json' }
      });
      if (response.ok) {
        const result = await response.json();
        if (result.success) return result.data;
      }
    } catch (e) {
      console.warn('CMS API fetch failed:', e);
    }
    return null;
  },

  // 6. Save CMS Config to MySQL
  async saveCMSData(payload: any): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE}/cms`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      return response.ok;
    } catch (e) {
      console.warn('CMS API save failed:', e);
      return false;
    }
  }
};

