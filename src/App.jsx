import React, { useState, useEffect, useRef } from 'react';
import { 
  GraduationCap, 
  BookOpen, 
  Sparkles, 
  Settings, 
  Plus, 
  Trash2, 
  Copy, 
  Download, 
  Printer, 
  Eye, 
  Code, 
  FileText, 
  CheckCircle, 
  Moon, 
  Sun, 
  Info, 
  ListTodo, 
  Check, 
  X,
  FileDown,
  RefreshCw
} from 'lucide-react';
import { marked } from 'marked';
import databaseIPA from './data/database.json';
import { callChatCompletion, getGenerateTPPrompts, getGenerateRPPMPrompts } from './utils/api';
import { generateDocx } from './utils/docxExporter';

function App() {
  // Theme state
  const [isLightMode, setIsLightMode] = useState(false);

  // API Config state
  const [apiConfig, setApiConfig] = useState({
    baseUrl: 'https://ai.sumopod.com/v1',
    apiKey: 'sk-zjqHT1Fy80-EW954iVi1WQ',
    model: 'kimi-k3'
  });
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [isTestingApi, setIsTestingApi] = useState(false);
  const [apiTestResult, setApiTestResult] = useState(null); // { success: boolean, message: string }

  // Form parameters state
  const [sekolah, setSekolah] = useState('SMP Negeri 1 Pesisir');
  const [kelas, setKelas] = useState('8');
  const [jumlahPertemuan, setJumlahPertemuan] = useState('2');
  const [jpPerSesi, setJpPerSesi] = useState('3 JP (@40 Menit)');
  const [selectedTopikKey, setSelectedTopikKey] = useState('materi_1'); // Default to first materi of kelas 8
  const [selectedSubMateri, setSelectedSubMateri] = useState('');
  const [cpTarget, setCpTarget] = useState('');
  const [modelPembelajaran, setModelPembelajaran] = useState('Problem-Based Learning (PBL)');

  // Profil Lulusan (PPP) - Multiple selections
  const [profilLulusan, setProfilLulusan] = useState([]);
  
  // Asesmen Formatif & Sumatif - Multiple selections
  const [asesmenFormatif, setAsesmenFormatif] = useState([]);
  const [asesmenSumatif, setAsesmenSumatif] = useState([]);

  // Tujuan Pembelajaran (TP) state
  const [tpList, setTpList] = useState([]);
  const [selectedTps, setSelectedTps] = useState([]);
  const [newTpText, setNewTpText] = useState('');
  const [isGeneratingTp, setIsGeneratingTp] = useState(false);

  // Generated RP PM Output state
  const [generatedMarkdown, setGeneratedMarkdown] = useState('');
  const [isGeneratingRp, setIsGeneratingRp] = useState(false);
  const [rpLoadingStep, setRpLoadingStep] = useState(0); // 0 to 4 steps
  const [activeTab, setActiveTab] = useState('preview'); // 'preview' or 'markdown'
  const [toastMessage, setToastMessage] = useState('');

  // Refs for printing
  const outputRef = useRef(null);

  // All available options definitions
  const listProfilLulusan = [
    "Keimanan dan Ketakwaan Terhadap Tuhan YME",
    "Penalaran Kritis",
    "Kreativitas",
    "Kolaborasi",
    "Komunikasi",
    "Kemandirian",
    "Kewargaan",
    "Kesehatan"
  ];

  const listAsesmenFormatif = [
    "Jurnal Refleksi Mandiri",
    "Rubrik Observasi Kinerja Kelompok",
    "Rubrik Produk Kreatif (Poster/Video)",
    "Lembar Kerja Kerja Ilmiah (LKPD)"
  ];

  const listAsesmenSumatif = [
    "Pilihan Ganda Kontekstual (HOTS)",
    "Esai Studi Kasus Real-World (SOLO Taxonomy)"
  ];

  // Apply light-mode class to body when state changes
  useEffect(() => {
    if (isLightMode) {
      document.body.classList.add('light-mode');
    } else {
      document.body.classList.remove('light-mode');
    }
  }, [isLightMode]);

  // Handle Kelas change: reset selectedTopikKey to the first materi of the new kelas
  useEffect(() => {
    const currentKelasData = databaseIPA.fase_d_ipa[`kelas_${kelas}`] || {};
    const materiKeys = Object.keys(currentKelasData);
    if (materiKeys.length > 0) {
      if (!materiKeys.includes(selectedTopikKey)) {
        setSelectedTopikKey(materiKeys[0]);
      }
    } else {
      setSelectedTopikKey('');
    }
  }, [kelas]);

  // Handle Topic Selection change (Cascading dropdown + suggestions auto-check)
  useEffect(() => {
    const currentKelasData = databaseIPA.fase_d_ipa[`kelas_${kelas}`] || {};
    if (selectedTopikKey && currentKelasData[selectedTopikKey]) {
      const topicData = currentKelasData[selectedTopikKey];
      setCpTarget(topicData.cp_target);
      
      // Auto select first sub-materi
      if (topicData.sub_materi_esensial && topicData.sub_materi_esensial.length > 0) {
        setSelectedSubMateri(topicData.sub_materi_esensial[0]);
      } else {
        setSelectedSubMateri('');
      }

      // Auto check suggested profiles
      setProfilLulusan(topicData.suggested_profil_lulusan || []);

      // Auto check suggested assessments
      setAsesmenFormatif(topicData.suggested_asesmen_formatif || []);
      setAsesmenSumatif(topicData.suggested_asesmen_sumatif || []);
      
      // Reset generated TP until user clicks generate
      setTpList([]);
      setSelectedTps([]);
    }
  }, [selectedTopikKey, kelas]);

  // Suggesting logic when Model Pembelajaran changes
  const handleModelPembelajaranChange = (e) => {
    const selectedModel = e.target.value;
    setModelPembelajaran(selectedModel);

    // Make local copies of current selections to expand
    let newProfiles = [...profilLulusan];
    let newFormatif = [...asesmenFormatif];
    let newSumatif = [...asesmenSumatif];

    const addIfNotExist = (arr, item) => {
      if (!arr.includes(item)) arr.push(item);
    };

    if (selectedModel === 'Inquiry Learning') {
      addIfNotExist(newProfiles, 'Penalaran Kritis');
      addIfNotExist(newProfiles, 'Kolaborasi');
      addIfNotExist(newFormatif, 'Lembar Kerja Kerja Ilmiah (LKPD)');
    } else if (selectedModel === 'Problem-Based Learning (PBL)') {
      addIfNotExist(newProfiles, 'Penalaran Kritis');
      addIfNotExist(newProfiles, 'Komunikasi');
      addIfNotExist(newProfiles, 'Kewargaan');
      addIfNotExist(newFormatif, 'Jurnal Refleksi Mandiri');
      addIfNotExist(newSumatif, 'Esai Studi Kasus Real-World (SOLO Taxonomy)');
    } else if (selectedModel === 'Project-Based Learning (PjBL)') {
      addIfNotExist(newProfiles, 'Kreativitas');
      addIfNotExist(newProfiles, 'Kolaborasi');
      addIfNotExist(newProfiles, 'Kemandirian');
      addIfNotExist(newFormatif, 'Rubrik Produk Kreatif (Poster/Video)');
      addIfNotExist(newSumatif, 'Esai Studi Kasus Real-World (SOLO Taxonomy)');
    } else if (selectedModel === 'Cooperative Learning') {
      addIfNotExist(newProfiles, 'Kolaborasi');
      addIfNotExist(newProfiles, 'Komunikasi');
      addIfNotExist(newFormatif, 'Rubrik Observasi Kinerja Kelompok');
    } else if (selectedModel === 'Discovery Learning') {
      addIfNotExist(newProfiles, 'Penalaran Kritis');
      addIfNotExist(newProfiles, 'Kemandirian');
      addIfNotExist(newFormatif, 'Lembar Kerja Kerja Ilmiah (LKPD)');
    }

    setProfilLulusan(newProfiles);
    setAsesmenFormatif(newFormatif);
    setAsesmenSumatif(newSumatif);

    showToast(`Saran untuk ${selectedModel} diterapkan`);
  };

  // Toast utility helper
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  // Test API connection
  const handleTestConnection = async () => {
    setIsTestingApi(true);
    setApiTestResult(null);
    try {
      const result = await callChatCompletion({
        baseUrl: apiConfig.baseUrl,
        apiKey: apiConfig.apiKey,
        model: apiConfig.model,
        systemPrompt: "You are an API connection tester. Reply with exactly: 'Koneksi Berhasil!'",
        userPrompt: "Please reply with 'Koneksi Berhasil!' to confirm our connection is working.",
        timeoutMs: 60000
      });
      
      if (result && (result.toLowerCase().includes('berhasil') || result.toLowerCase().includes('koneksi'))) {
        setApiTestResult({ success: true, message: 'Koneksi Berhasil! API merespons dengan benar.' });
      } else {
        setApiTestResult({ success: true, message: `Koneksi berhasil, respon: "${result.substring(0, 50)}..."` });
      }
    } catch (err) {
      console.error(err);
      setApiTestResult({ success: false, message: `Koneksi gagal: ${err.message}` });
    } finally {
      setIsTestingApi(false);
    }
  };

  // Call API to generate Tujuan Pembelajaran (TP)
  const handleGenerateTP = async () => {
    if (!selectedTopikKey || !selectedSubMateri) {
      showToast('Harap pilih Topik dan Sub-Materi terlebih dahulu.');
      return;
    }

    setIsGeneratingTp(true);
    try {
      const currentKelasData = databaseIPA.fase_d_ipa[`kelas_${kelas}`] || {};
      const topicName = currentKelasData[selectedTopikKey]?.materi_pokok || '';
      const { systemPrompt, userPrompt } = getGenerateTPPrompts({
        topik: topicName,
        cpTarget: cpTarget,
        subMateri: selectedSubMateri
      });

      const result = await callChatCompletion({
        baseUrl: apiConfig.baseUrl,
        apiKey: apiConfig.apiKey,
        model: apiConfig.model,
        systemPrompt,
        userPrompt,
        timeoutMs: 120000
      });

      // Parse bullet points from response
      // Response usually is "1. Murid mampu... \n2. Murid mampu..."
      const lines = result
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0)
        .map(line => {
          // Remove numbering prefix (e.g., "1. ", "- ")
          return line.replace(/^(\d+\.|\*|-)\s*/, '').trim();
        });

      if (lines.length > 0) {
        setTpList(lines);
        setSelectedTps(lines); // Select all by default
        showToast('Tujuan Pembelajaran berhasil dirumuskan!');
      } else {
        throw new Error('Format output tidak valid');
      }
    } catch (err) {
      console.error(err);
      showToast(`Gagal generate TP: ${err.message}`);
    } finally {
      setIsGeneratingTp(false);
    }
  };

  // TP state management handlers
  const handleToggleTpCheckbox = (tp) => {
    if (selectedTps.includes(tp)) {
      setSelectedTps(selectedTps.filter(t => t !== tp));
    } else {
      setSelectedTps([...selectedTps, tp]);
    }
  };

  const handleEditTpText = (index, newText) => {
    const updated = [...tpList];
    updated[index] = newText;
    
    // Also update selectedTps state if the edited TP was selected
    const oldVal = tpList[index];
    if (selectedTps.includes(oldVal)) {
      setSelectedTps(selectedTps.map(t => t === oldVal ? newText : t));
    }
    
    setTpList(updated);
  };

  const handleDeleteTp = (index) => {
    const target = tpList[index];
    setTpList(tpList.filter((_, i) => i !== index));
    setSelectedTps(selectedTps.filter(t => t !== target));
    showToast('TP dihapus');
  };

  const handleAddCustomTp = () => {
    if (!newTpText.trim()) return;
    setTpList([...tpList, newTpText.trim()]);
    setSelectedTps([...selectedTps, newTpText.trim()]);
    setNewTpText('');
    showToast('TP Kustom ditambahkan');
  };

  // Toggle checks for multi-selects
  const handleToggleProfile = (item) => {
    if (profilLulusan.includes(item)) {
      setProfilLulusan(profilLulusan.filter(i => i !== item));
    } else {
      setProfilLulusan([...profilLulusan, item]);
    }
  };

  const handleToggleFormatif = (item) => {
    if (asesmenFormatif.includes(item)) {
      setAsesmenFormatif(asesmenFormatif.filter(i => i !== item));
    } else {
      setAsesmenFormatif([...asesmenFormatif, item]);
    }
  };

  const handleToggleSumatif = (item) => {
    if (asesmenSumatif.includes(item)) {
      setAsesmenSumatif(asesmenSumatif.filter(i => i !== item));
    } else {
      setAsesmenSumatif([...asesmenSumatif, item]);
    }
  };

  // Call API to generate Full RP PM
  const handleGenerateRPPM = async () => {
    if (selectedTps.length === 0) {
      showToast('Harap pilih minimal satu Tujuan Pembelajaran (TP).');
      return;
    }

    setIsGeneratingRp(true);
    setRpLoadingStep(0);

    // Simulate loading states step-by-step for a premium experience
    const interval = setInterval(() => {
      setRpLoadingStep(prev => {
        if (prev < 3) return prev + 1;
        return prev;
      });
    }, 2000);

    try {
      const currentKelasData = databaseIPA.fase_d_ipa[`kelas_${kelas}`] || {};
      const topicName = currentKelasData[selectedTopikKey]?.materi_pokok || '';
      const { systemPrompt, userPrompt } = getGenerateRPPMPrompts({
        sekolah,
        kelas,
        jumlahPertemuan,
        jpPerSesi,
        topik: topicName,
        subMateri: selectedSubMateri,
        cpTarget,
        tpList: selectedTps,
        modelPembelajaran,
        profilLulusanList: profilLulusan,
        asesmenFormatifList: asesmenFormatif,
        asesmenSumatifList: asesmenSumatif
      });

      const result = await callChatCompletion({
        baseUrl: apiConfig.baseUrl,
        apiKey: apiConfig.apiKey,
        model: apiConfig.model,
        systemPrompt,
        userPrompt,
        timeoutMs: 300000 // 5 minutes timeout for complete document generation
      });

      setGeneratedMarkdown(result);
      setRpLoadingStep(4);
      setActiveTab('preview');
      showToast('Rencana Pembelajaran Mendalam (RP PM) berhasil dibuat!');
    } catch (err) {
      console.error(err);
      showToast(`Gagal membuat RP PM: ${err.message}`);
    } finally {
      clearInterval(interval);
      setIsGeneratingRp(false);
    }
  };

  // Copy Markdown to Clipboard
  const handleCopyToClipboard = () => {
    if (!generatedMarkdown) return;
    navigator.clipboard.writeText(generatedMarkdown);
    showToast('Disalin ke Clipboard!');
  };

  // Download Markdown file (.md)
  const handleDownloadMarkdown = () => {
    if (!generatedMarkdown) return;
    const element = document.createElement("a");
    const file = new Blob([generatedMarkdown], { type: 'text/markdown' });
    element.href = URL.createObjectURL(file);
    element.download = `RP_PM_${sekolah.replace(/\s+/g, '_')}_Kelas_${kelas}_${selectedSubMateri.replace(/\s+/g, '_')}.md`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    showToast('Unduhan Markdown dimulai!');
  };

  // Print friendly print handler
  const handlePrint = () => {
    window.print();
  };

  // Export to Word Document (.docx)
  const handleExportDocx = async () => {
    if (!generatedMarkdown) return;
    try {
      showToast('Sedang membuat file Word (.docx)...');
      await generateDocx(generatedMarkdown, selectedSubMateri);
      showToast('Unduhan Word (.docx) dimulai!');
    } catch (err) {
      console.error(err);
      showToast(`Gagal mengunduh Word: ${err.message}`);
    }
  };

  // Format preview table cells (rowspans and colspans) for elegant rendering
  const formatPreviewTable = (html) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    
    const tables = doc.querySelectorAll('table');
    tables.forEach(table => {
      const rows = Array.from(table.querySelectorAll('tr'));
      if (rows.length === 0) return;
      
      // Merge cells vertically in Column 1 and Column 2 (0-indexed 0 and 1)
      const colIndices = [0, 1];
      colIndices.forEach(colIdx => {
        let lastCell = null;
        rows.forEach(row => {
          const cell = row.cells[colIdx];
          if (!cell) return;
          
          if (cell.style.display === 'none') return;
          
          const cellText = cell.textContent.trim();
          if (!cellText) return;
          
          if (lastCell && lastCell.textContent.trim() === cellText) {
            const currentSpan = lastCell.rowSpan || 1;
            lastCell.rowSpan = currentSpan + 1;
            cell.style.display = 'none';
          } else {
            lastCell = cell;
          }
        });
      });
      
      // Merge cells horizontally for Sintaks rows
      rows.forEach(row => {
        if (row.cells.length >= 3) {
          const cell1Text = row.cells[1].textContent.trim();
          const cell2Text = row.cells[2].textContent.trim();
          
          if (cell1Text.startsWith('Sintak') && (cell1Text === cell2Text || cell2Text === '')) {
            row.cells[1].colSpan = 2;
            if (row.cells[2]) {
              row.cells[2].style.display = 'none';
            }
            row.cells[1].style.textAlign = 'center';
            row.cells[1].style.fontWeight = 'bold';
            row.cells[1].style.background = 'rgba(255, 255, 255, 0.08)';
          }
        }
      });
    });
    
    return doc.body.innerHTML;
  };

  // Deep Learning Token highlighter in HTML output
  const highlightDeepLearningTokens = (html) => {
    const terms = {
      'MEMAHAMI': 'memahami',
      'MENGAPLIKASI': 'mengaplikasi',
      'MEREFLEKSI': 'merefleksi',
      'BERKESADARAN': 'berkesadaran',
      'BERMAKNA': 'bermakna',
      'MENGGEMBIRAKAN': 'menggembirakan'
    };
    
    let result = html;
    for (const [term, className] of Object.entries(terms)) {
      const regex = new RegExp(`\\b${term}\\b`, 'gi');
      result = result.replace(regex, (match) => `<span class="highlight-tag ${className}">${match}</span>`);
    }
    return result;
  };

  // Render markdown to HTML
  const getRenderedHTML = () => {
    if (!generatedMarkdown) return '';
    const rawHtml = marked.parse(generatedMarkdown);
    const formattedHtml = formatPreviewTable(rawHtml);
    return highlightDeepLearningTokens(formattedHtml);
  };

  return (
    <div className="app-container">
      {/* Header Panel */}
      <header className="app-header">
        <div className="brand-section">
          <GraduationCap size={36} className="brand-icon" />
          <div>
            <h1 className="brand-title">RP-PM Generator</h1>
            <span className="brand-subtitle">Modul Ajar Rencana Pembelajaran Mendalam (Deep Learning)</span>
          </div>
        </div>
        <div className="header-controls">
          <button 
            className="btn btn-secondary"
            onClick={() => setIsLightMode(!isLightMode)}
            title={isLightMode ? "Ubah ke Mode Gelap" : "Ubah ke Mode Terang"}
          >
            {isLightMode ? <Moon size={18} /> : <Sun size={18} />}
          </button>
          
          <button 
            className="btn btn-secondary"
            onClick={() => setShowSettingsModal(true)}
            title="Pengaturan API & Model"
          >
            <Settings size={18} />
            <span>API Settings</span>
          </button>
        </div>
      </header>

      {/* Main Form & Output Grid */}
      <div className="main-grid">
        {/* Sidebar Parameters Form */}
        <aside className="panel sidebar-panel">
          
          {/* Section 1: Identitas & Materi */}
          <div className="form-section">
            <h2 className="section-title">
              <BookOpen size={18} />
              <span>1. Identitas & Kurikulum</span>
            </h2>
            
            <div className="form-group">
              <label className="form-label">Nama Sekolah / Satuan Pendidikan</label>
              <input 
                type="text" 
                value={sekolah} 
                onChange={(e) => setSekolah(e.target.value)} 
                className="form-input"
                placeholder="SMP Negeri 1 Pesisir"
              />
            </div>

            <div className="checkbox-grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div className="form-group">
                <label className="form-label">Kelas</label>
                <select value={kelas} onChange={(e) => setKelas(e.target.value)} className="form-select">
                  <option value="7">Kelas 7 / Fase D</option>
                  <option value="8">Kelas 8 / Fase D</option>
                  <option value="9">Kelas 9 / Fase D</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Jumlah Sesi</label>
                <select value={jumlahPertemuan} onChange={(e) => setJumlahPertemuan(e.target.value)} className="form-select">
                  {[...Array(10)].map((_, i) => (
                    <option key={i+1} value={i+1}>{i+1} Sesi Pertemuan</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Alokasi JP per Sesi</label>
              <select value={jpPerSesi} onChange={(e) => setJpPerSesi(e.target.value)} className="form-select">
                <option value="2 JP (@40 Menit)">2 JP (@40 Menit) - 80 Menit</option>
                <option value="3 JP (@40 Menit)">3 JP (@40 Menit) - 120 Menit</option>
                <option value="4 JP (@40 Menit)">4 JP (@40 Menit) - 160 Menit</option>
                <option value="5 JP (@40 Menit)">5 JP (@40 Menit) - 200 Menit</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Topik Utama IPA</label>
              <select 
                value={selectedTopikKey} 
                onChange={(e) => setSelectedTopikKey(e.target.value)} 
                className="form-select"
              >
                {Object.keys(databaseIPA.fase_d_ipa[`kelas_${kelas}`] || {}).map((key) => {
                  const currentKelasData = databaseIPA.fase_d_ipa[`kelas_${kelas}`] || {};
                  return (
                    <option key={key} value={key}>{currentKelasData[key].materi_pokok}</option>
                  );
                })}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Fokus Sub-Materi Esensial</label>
              <select 
                value={selectedSubMateri} 
                onChange={(e) => setSelectedSubMateri(e.target.value)} 
                className="form-select"
                disabled={!selectedTopikKey}
              >
                {(databaseIPA.fase_d_ipa[`kelas_${kelas}`]?.[selectedTopikKey]?.sub_materi_esensial || []).map((sub, idx) => (
                  <option key={idx} value={sub}>{sub}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Capaian Pembelajaran (CP) Target</label>
              <textarea 
                readOnly 
                value={cpTarget} 
                className="form-textarea" 
                rows="3" 
                style={{ fontSize: '0.8rem', opacity: 0.8 }}
              />
            </div>

            <button 
              type="button" 
              onClick={handleGenerateTP} 
              disabled={isGeneratingTp}
              className="btn btn-primary btn-full"
            >
              {isGeneratingTp ? (
                <>
                  <RefreshCw size={16} className="spinner" style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.2)', borderLeftColor: '#fff', animation: 'spin 1s linear infinite' }} />
                  <span>Merumuskan TP...</span>
                </>
              ) : (
                <>
                  <Sparkles size={16} />
                  <span>Generate TP (Tujuan Pembelajaran)</span>
                </>
              )}
            </button>
          </div>

          {/* Section 2: Tujuan Pembelajaran (TP) List */}
          <div className="form-section">
            <h2 className="section-title">
              <ListTodo size={18} />
              <span>2. Tujuan Pembelajaran (TP)</span>
            </h2>

            {tpList.length === 0 ? (
              <div className="info-banner">
                <Info size={16} />
                <span>Klik tombol "Generate TP" di atas untuk merumuskan TP secara otomatis berdasarkan CP.</span>
              </div>
            ) : (
              <div className="tp-container">
                <p className="form-label">Daftar TP (Centang untuk digunakan):</p>
                {tpList.map((tp, idx) => (
                  <div key={idx} className="tp-item">
                    <input 
                      type="checkbox" 
                      checked={selectedTps.includes(tp)}
                      onChange={() => handleToggleTpCheckbox(tp)}
                      className="checkbox-input"
                      style={{ marginTop: '0.2rem' }}
                    />
                    <textarea 
                      value={tp} 
                      onChange={(e) => handleEditTpText(idx, e.target.value)} 
                      className="tp-content-input"
                      rows="2"
                    />
                    <button 
                      type="button" 
                      onClick={() => handleDeleteTp(idx)}
                      className="btn btn-danger btn-sm"
                      style={{ padding: '0.2rem 0.4rem' }}
                      title="Hapus TP"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="add-tp-box">
              <input 
                type="text" 
                value={newTpText}
                onChange={(e) => setNewTpText(e.target.value)}
                placeholder="Tambah TP Kustom baru..."
                className="form-input"
                style={{ flex: 1, fontSize: '0.85rem' }}
                onKeyDown={(e) => { if (e.key === 'Enter') handleAddCustomTp(); }}
              />
              <button 
                type="button" 
                onClick={handleAddCustomTp} 
                className="btn btn-secondary"
                style={{ padding: '0.5rem' }}
              >
                <Plus size={16} />
              </button>
            </div>
          </div>

          {/* Section 3: Model & Skenario */}
          <div className="form-section">
            <h2 className="section-title">
              <Sparkles size={18} />
              <span>3. Model & Skenario PM</span>
            </h2>

            <div className="form-group">
              <label className="form-label">Model Pembelajaran</label>
              <select 
                value={modelPembelajaran} 
                onChange={handleModelPembelajaranChange} 
                className="form-select"
              >
                <option value="Inquiry Learning">Inquiry Learning</option>
                <option value="Problem-Based Learning (PBL)">Problem-Based Learning (PBL)</option>
                <option value="Project-Based Learning (PjBL)">Project-Based Learning (PjBL)</option>
                <option value="Cooperative Learning">Cooperative Learning</option>
                <option value="Discovery Learning">Discovery Learning</option>
              </select>
            </div>

            {/* Profil Lulusan */}
            <div className="form-group">
              <label className="form-label">Profil Pelajar Pancasila (PPP)</label>
              <div className="checkbox-grid">
                {listProfilLulusan.map((ppp) => (
                  <label key={ppp} className="checkbox-label">
                    <input 
                      type="checkbox"
                      checked={profilLulusan.includes(ppp)}
                      onChange={() => handleToggleProfile(ppp)}
                      className="checkbox-input"
                    />
                    <span>{ppp}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Asesmen Formatif */}
            <div className="form-group">
              <label className="form-label">Asesmen Formatif</label>
              <div className="checkbox-grid">
                {listAsesmenFormatif.map((asm) => (
                  <label key={asm} className="checkbox-label">
                    <input 
                      type="checkbox"
                      checked={asesmenFormatif.includes(asm)}
                      onChange={() => handleToggleFormatif(asm)}
                      className="checkbox-input"
                    />
                    <span>{asm}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Asesmen Sumatif */}
            <div className="form-group">
              <label className="form-label">Asesmen Sumatif</label>
              <div className="checkbox-grid">
                {listAsesmenSumatif.map((asm) => (
                  <label key={asm} className="checkbox-label">
                    <input 
                      type="checkbox"
                      checked={asesmenSumatif.includes(asm)}
                      onChange={() => handleToggleSumatif(asm)}
                      className="checkbox-input"
                    />
                    <span>{asm}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Submit button */}
            <button 
              type="button" 
              onClick={handleGenerateRPPM} 
              disabled={isGeneratingRp || selectedTps.length === 0}
              className="btn btn-primary btn-full"
              style={{ marginTop: '0.5rem', background: 'linear-gradient(135deg, #a855f7 0%, #7c3aed 100%)' }}
            >
              {isGeneratingRp ? (
                <>
                  <RefreshCw size={16} className="spinner" style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.2)', borderLeftColor: '#fff', animation: 'spin 1s linear infinite' }} />
                  <span>Membuat Modul RP PM...</span>
                </>
              ) : (
                <>
                  <FileText size={16} />
                  <span>Buat RP PM Otomatis</span>
                </>
              )}
            </button>
          </div>
        </aside>

        {/* Right Preview Panel */}
        <main className="panel main-panel">
          {isGeneratingRp ? (
            /* Loading State */
            <div className="loading-container">
              <div className="spinner"></div>
              <h3 style={{ fontSize: '1.2rem', color: '#fff' }}>Merancang Modul Pembelajaran</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '-0.75rem' }}>
                Mohon tunggu, AI sedang menyusun berkas RPP sesuai format Herwin Hamid...
              </p>
              
              <div className="loading-steps">
                <div className={`loading-step ${rpLoadingStep >= 0 ? 'completed' : ''} ${rpLoadingStep === 0 ? 'active' : ''}`}>
                  {rpLoadingStep > 0 ? <CheckCircle size={14} /> : <div style={{ width: 14, height: 14, borderRadius: '50%', border: '2px solid' }}></div>}
                  <span>Menganalisis parameter & database CP...</span>
                </div>
                <div className={`loading-step ${rpLoadingStep >= 1 ? 'completed' : ''} ${rpLoadingStep === 1 ? 'active' : ''}`}>
                  {rpLoadingStep > 1 ? <CheckCircle size={14} /> : <div style={{ width: 14, height: 14, borderRadius: '50%', border: '2px solid' }}></div>}
                  <span>Mengintegrasikan pilar deep learning...</span>
                </div>
                <div className={`loading-step ${rpLoadingStep >= 2 ? 'completed' : ''} ${rpLoadingStep === 2 ? 'active' : ''}`}>
                  {rpLoadingStep > 2 ? <CheckCircle size={14} /> : <div style={{ width: 14, height: 14, borderRadius: '50%', border: '2px solid' }}></div>}
                  <span>Menyusun tabel skenario langkah pembelajaran...</span>
                </div>
                <div className={`loading-step ${rpLoadingStep >= 3 ? 'completed' : ''} ${rpLoadingStep === 3 ? 'active' : ''}`}>
                  {rpLoadingStep > 3 ? <CheckCircle size={14} /> : <div style={{ width: 14, height: 14, borderRadius: '50%', border: '2px solid' }}></div>}
                  <span>Merumuskan lampiran instrumen asesmen...</span>
                </div>
              </div>
            </div>
          ) : generatedMarkdown ? (
            /* Output Preview Mode */
            <>
              <div className="result-header">
                <div className="tab-selector">
                  <button 
                    onClick={() => setActiveTab('preview')} 
                    className={`tab-btn ${activeTab === 'preview' ? 'active' : ''}`}
                  >
                    <Eye size={16} />
                    <span>Pratinjau Cetak</span>
                  </button>
                  <button 
                    onClick={() => setActiveTab('markdown')} 
                    className={`tab-btn ${activeTab === 'markdown' ? 'active' : ''}`}
                  >
                    <Code size={16} />
                    <span>Raw Markdown</span>
                  </button>
                </div>
                
                 <div className="output-actions">
                   <button onClick={handleCopyToClipboard} className="btn btn-secondary btn-sm" title="Salin Markdown">
                     <Copy size={14} />
                     <span>Salin</span>
                   </button>
                   <button onClick={handleDownloadMarkdown} className="btn btn-secondary btn-sm" title="Unduh File .md">
                     <Download size={14} />
                     <span>Unduh MD</span>
                   </button>
                   <button onClick={handleExportDocx} className="btn btn-secondary btn-sm" title="Unduh File Word (.docx)">
                     <FileDown size={14} />
                     <span>Unduh Word</span>
                   </button>
                   <button onClick={handlePrint} className="btn btn-primary btn-sm" title="Cetak ke PDF / Printer">
                     <Printer size={14} />
                     <span>Cetak PDF</span>
                   </button>
                 </div>
              </div>

              <div className="output-container" ref={outputRef}>
                {activeTab === 'preview' ? (
                  <div 
                    className="rendered-markdown" 
                    dangerouslySetInnerHTML={{ __html: getRenderedHTML() }}
                  />
                ) : (
                  <textarea 
                    readOnly 
                    value={generatedMarkdown} 
                    className="raw-markdown-area"
                  />
                )}
              </div>
            </>
          ) : (
            /* Empty State */
            <div className="empty-state">
              <FileDown size={64} />
              <h2>Rencana Pelaksanaan Pembelajaran Mendalam (RP PM)</h2>
              <p style={{ maxWidth: '450px' }}>
                Silakan isi seluruh parameter di kolom kiri, rumuskan Tujuan Pembelajaran, 
                lalu klik tombol <strong>"Buat RP PM Otomatis"</strong> untuk menghasilkan modul ajar utuh berbasis AI.
              </p>
            </div>
          )}
        </main>
      </div>

      {/* Settings Modal */}
      {showSettingsModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#fff' }}>
                <Settings size={18} className="brand-icon" />
                <span>API Settings (Moonshot Config)</span>
              </h3>
              <button className="modal-close" onClick={() => { setShowSettingsModal(false); setApiTestResult(null); }}>
                <X size={18} />
              </button>
            </div>

            <div className="form-group">
              <label className="form-label">API Base URL</label>
              <input 
                type="text" 
                value={apiConfig.baseUrl} 
                onChange={(e) => setApiConfig({ ...apiConfig, baseUrl: e.target.value })} 
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">API Key</label>
              <input 
                type="password" 
                value={apiConfig.apiKey} 
                onChange={(e) => setApiConfig({ ...apiConfig, apiKey: e.target.value })} 
                className="form-input"
              />
            </div>

             <div className="form-group">
               <label className="form-label">Pilih Model</label>
               <select 
                 value={['kimi-k3', 'glm-5.2', 'mimo-v2.5-pro'].includes(apiConfig.model) ? apiConfig.model : 'custom'} 
                 onChange={(e) => {
                   const val = e.target.value;
                   if (val === 'custom') {
                     setApiConfig({ ...apiConfig, model: '' });
                   } else {
                     setApiConfig({ ...apiConfig, model: val });
                   }
                 }} 
                 className="form-select"
               >
                 <option value="kimi-k3">kimi-k3 (Moonshot)</option>
                 <option value="glm-5.2">glm-5.2 (z.ai)</option>
                 <option value="mimo-v2.5-pro">mimo-v2.5-pro (mimo)</option>
                 <option value="custom">Model Kustom...</option>
               </select>
             </div>

             {(!['kimi-k3', 'glm-5.2', 'mimo-v2.5-pro'].includes(apiConfig.model) || apiConfig.model === '') && (
               <div className="form-group">
                 <label className="form-label">Nama Model Kustom</label>
                 <input 
                   type="text" 
                   value={apiConfig.model} 
                   onChange={(e) => setApiConfig({ ...apiConfig, model: e.target.value })} 
                   className="form-input"
                   placeholder="Masukkan nama model..."
                 />
               </div>
             )}

             <div className="info-banner" style={{ background: 'rgba(6, 182, 212, 0.08)', borderColor: 'rgba(6, 182, 212, 0.15)' }}>
               <Info size={16} style={{ color: 'var(--accent-secondary)' }} />
               <span style={{ fontSize: '0.75rem' }}>
                 Pilihan model: <strong>kimi-k3</strong> (Moonshot), <strong>glm-5.2</strong> (z.ai), dan <strong>mimo-v2.5-pro</strong> (mimo).
               </span>
             </div>

            {apiTestResult && (
              <div 
                className="info-banner" 
                style={{ 
                  background: apiTestResult.success ? 'rgba(16, 185, 129, 0.08)' : 'rgba(239, 68, 68, 0.08)', 
                  borderColor: apiTestResult.success ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                  color: apiTestResult.success ? 'var(--badge-merefleksi-text)' : '#f87171',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                {apiTestResult.success ? <Check size={16} /> : <X size={16} />}
                <span style={{ fontSize: '0.8rem' }}>{apiTestResult.message}</span>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', marginTop: '0.5rem' }}>
              <button 
                type="button"
                className="btn btn-secondary" 
                onClick={handleTestConnection}
                disabled={isTestingApi}
                style={{ flex: 1 }}
              >
                {isTestingApi ? (
                  <>
                    <RefreshCw size={14} className="spinner" style={{ width: 14, height: 14, border: '2px solid rgba(255,255,255,0.2)', borderLeftColor: 'currentColor', animation: 'spin 1s linear infinite' }} />
                    <span>Menguji...</span>
                  </>
                ) : (
                  <span>Test Koneksi</span>
                )}
              </button>
              
              <button 
                className="btn btn-primary" 
                onClick={() => {
                  setShowSettingsModal(false);
                  setApiTestResult(null); // Reset test result on save/close
                  showToast('Pengaturan API disimpan!');
                }}
                style={{ flex: 1 }}
              >
                Simpan & Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="toast">
          <CheckCircle size={16} />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}

export default App;
