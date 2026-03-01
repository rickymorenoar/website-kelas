import React, { useState, useEffect, useRef } from 'react';

// ── CSS Animasi (inject sekali) ──────────────────────────────
const globalStyles = `
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(30px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  @keyframes scaleIn {
    from { opacity: 0; transform: scale(0.85); }
    to   { opacity: 1; transform: scale(1); }
  }
  @keyframes slideDown {
    from { opacity: 0; transform: translateY(-20px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes float {
    0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.4; }
    50%       { transform: translateY(-20px) rotate(180deg); opacity: 0.8; }
  }
  @keyframes spin-slow {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
  }
  @keyframes pulse-ring {
    0%   { transform: scale(0.8); opacity: 1; }
    100% { transform: scale(2); opacity: 0; }
  }
  @keyframes shimmer {
    0%   { background-position: -200% center; }
    100% { background-position:  200% center; }
  }
  @keyframes waveBar {
    0%, 100% { transform: scaleY(0.4); }
    50%       { transform: scaleY(1.2); }
  }
  @keyframes glowPulse {
    0%, 100% { box-shadow: 0 0 20px rgba(37,99,235,0.3); }
    50%       { box-shadow: 0 0 60px rgba(37,99,235,0.8), 0 0 100px rgba(37,99,235,0.3); }
  }

  .animate-fadeUp   { animation: fadeUp   0.7s ease forwards; }
  .animate-fadeIn   { animation: fadeIn   0.5s ease forwards; }
  .animate-scaleIn  { animation: scaleIn  0.6s cubic-bezier(.34,1.56,.64,1) forwards; }
  .animate-slideDown{ animation: slideDown 0.5s ease forwards; }
  .animate-float    { animation: float    3s ease-in-out infinite; }
  .animate-spin-slow{ animation: spin-slow 8s linear infinite; }
  .animate-glowPulse{ animation: glowPulse 2s ease-in-out infinite; }
  .opacity-0-init   { opacity: 0; }

  /* Shimmer teks */
  .text-shimmer {
    background: linear-gradient(90deg, #fff 0%, #93c5fd 40%, #fff 60%, #93c5fd 100%);
    background-size: 200% auto;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: shimmer 3s linear infinite;
  }

  /* Wave bars (music visualizer) */
  .wave-bar { animation: waveBar 0.8s ease-in-out infinite; }
  .wave-bar:nth-child(2) { animation-delay: 0.1s; }
  .wave-bar:nth-child(3) { animation-delay: 0.2s; }
  .wave-bar:nth-child(4) { animation-delay: 0.3s; }
  .wave-bar:nth-child(5) { animation-delay: 0.15s; }

  /* Particle */
  .particle {
    position: absolute;
    border-radius: 50%;
    pointer-events: none;
  }

  /* Gallery card hover */
  .gallery-card { transition: all 0.4s cubic-bezier(.34,1.56,.64,1); }
  .gallery-card:hover { transform: scale(1.05) rotate(-1deg); }

  /* Scroll reveal */
  .reveal { opacity: 0; transform: translateY(40px); transition: opacity 0.7s ease, transform 0.7s ease; }
  .reveal.visible { opacity: 1; transform: translateY(0); }
`;

// ── Partikel background ──────────────────────────────────────
const Particles = () => {
  const particles = Array.from({ length: 18 }, (_, i) => ({
    id: i,
    size: Math.random() * 6 + 2,
    x: Math.random() * 100,
    y: Math.random() * 100,
    delay: Math.random() * 4,
    duration: 3 + Math.random() * 4,
    color: i % 3 === 0 ? '#3b82f6' : i % 3 === 1 ? '#8b5cf6' : '#06b6d4',
  }));
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map(p => (
        <div key={p.id} className="particle" style={{
          width: p.size, height: p.size,
          left: `${p.x}%`, top: `${p.y}%`,
          background: p.color,
          opacity: 0.3,
          animationName: 'float',
          animationDuration: `${p.duration}s`,
          animationDelay: `${p.delay}s`,
          animationTimingFunction: 'ease-in-out',
          animationIterationCount: 'infinite',
        }} />
      ))}
    </div>
  );
};

// ── Music Visualizer bars ────────────────────────────────────
const MusicBars = () => (
  <div className="flex items-end gap-0.5 h-4">
    {[1,2,3,4,5].map(i => (
      <div key={i} className="wave-bar w-1 bg-blue-400 rounded-full origin-bottom" style={{ height: '100%' }} />
    ))}
  </div>
);

// ── Loading / Intro Screen ───────────────────────────────────
const IntroScreen = ({ onDone }) => {
  const [phase, setPhase] = useState(0);
  // phase 0: logo muncul, 1: teks muncul, 2: fade out

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 800);
    const t2 = setTimeout(() => setPhase(2), 2800);
    const t3 = setTimeout(() => onDone(), 3600);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  return (
    <div className={`fixed inset-0 z-[999] bg-[#020617] flex flex-col items-center justify-center transition-opacity duration-700 ${phase === 2 ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
      {/* Glow ring */}
      <div className="relative flex items-center justify-center mb-8">
        <div className="absolute w-32 h-32 rounded-full border border-blue-500/30 animate-spin-slow" />
        <div className="absolute w-44 h-44 rounded-full border border-blue-500/10 animate-spin-slow" style={{ animationDirection: 'reverse', animationDuration: '12s' }} />
        {/* Pulse ring */}
        <div className="absolute w-24 h-24 rounded-full bg-blue-500/20" style={{ animation: 'pulse-ring 1.5s ease-out infinite' }} />
        {/* Logo */}
        <div className={`w-20 h-20 rounded-full overflow-hidden border-2 border-blue-500/50 animate-glowPulse transition-all duration-700 ${phase >= 0 ? 'animate-scaleIn' : 'opacity-0'}`}>
          <img src="/logo-9a.png" alt="Logo" className="w-full h-full object-cover" />
        </div>
      </div>

      {/* Teks */}
      <div className={`text-center transition-all duration-700 ${phase >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        <p className="text-[11px] text-blue-400 font-bold tracking-[0.4em] uppercase mb-3">Welcome to</p>
        <h1 className="text-4xl md:text-5xl font-black text-shimmer tracking-tighter mb-2">Class Attractive</h1>
        <p className="text-slate-500 text-sm italic">Memories Stay Forever.</p>
      </div>

      {/* Loading bar */}
      <div className="mt-10 w-48 h-0.5 bg-white/5 rounded-full overflow-hidden">
        <div className="h-full bg-gradient-to-r from-blue-600 to-cyan-400 rounded-full"
          style={{ width: phase >= 1 ? '100%' : '0%', transition: 'width 1.8s ease' }} />
      </div>
    </div>
  );
};

// ── Main App ─────────────────────────────────────────────────
const App = () => {
  const [showIntro, setShowIntro]       = useState(true);
  const [activeTab, setActiveTab]       = useState('pengurus');
  const [isMenuOpen, setIsMenuOpen]     = useState(false);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [isMuted, setIsMuted]           = useState(false);

  // ── Audio: Lagu Intro (saat pertama masuk) ──────────────────
  // Ganti '/lagu-intro.mp3' dengan nama file lagu intro kamu di public/
  const introAudioRef = useRef(new Audio('/lagu-intro.mp3'));

  // ── Audio: Lagu Galeri ──────────────────────────────────────
  // Ganti '/lagu.mp3' dengan nama file lagu galeri kamu di public/
  const galeriAudioRef = useRef(new Audio('/lagu.mp3'));

  // Play intro music setelah loading screen selesai
  const handleIntroDone = () => {
    setShowIntro(false);
    const audio = introAudioRef.current;
    audio.volume = 0.4;
    audio.loop = false;
    audio.play().catch(() => {});
  };

  // Galeri music
  useEffect(() => {
    const audio = galeriAudioRef.current;
    audio.loop = true;
    audio.volume = isMuted ? 0 : 0.5;

    const mulaiDari  = 71;
    const berhentiDi = 216;

    if (isGalleryOpen) {
      // Fade out intro music
      introAudioRef.current.pause();
      audio.currentTime = mulaiDari;
      audio.play().catch(() => {});
      audio.ontimeupdate = () => {
        if (audio.currentTime >= berhentiDi) audio.currentTime = mulaiDari;
      };
    } else {
      audio.pause();
      audio.currentTime = mulaiDari;
      audio.ontimeupdate = null;
    }
    return () => { audio.pause(); audio.ontimeupdate = null; };
  }, [isGalleryOpen]);

  // Mute toggle galeri music
  useEffect(() => {
    galeriAudioRef.current.volume = isMuted ? 0 : 0.5;
  }, [isMuted]);

  // Scroll lock
  useEffect(() => {
    document.body.style.overflow = (showIntro || isGalleryOpen || lightboxIndex !== null) ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [showIntro, isGalleryOpen, lightboxIndex]);

  // Scroll reveal
  useEffect(() => {
    if (showIntro) return;
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
      { threshold: 0.1 }
    );
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, [showIntro]);

  // Keyboard lightbox
  const prevPhoto = () => setLightboxIndex(i => (i - 1 + galeri.length) % galeri.length);
  const nextPhoto = () => setLightboxIndex(i => (i + 1) % galeri.length);
  useEffect(() => {
    const handler = (e) => {
      if (lightboxIndex === null) return;
      if (e.key === 'ArrowLeft') prevPhoto();
      if (e.key === 'ArrowRight') nextPhoto();
      if (e.key === 'Escape') setLightboxIndex(null);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [lightboxIndex]);

  // ── DATA ────────────────────────────────────────────────────
  const waliKelas = [
    { grade: "Wali Kelas 7", name: "A. Widyanti",                  img: "/bu-widya.png",  quote: "Guru Bahasa Inggris" },
    { grade: "Wali Kelas 8", name: "Ana Eka Rizky",                 img: "/bu-ana.png",    quote: "Guru Prakarya." },
    { grade: "Wali Kelas 9", name: "Endang Sustyaningsih S. P.",    img: "/bu-endang.png", quote: "Guru Bahasa Inggris." },
  ];
  const pengurus = [
    { role: "Ketua Kelas",       name: "Nabila Amalia H.",     img: "/absen21.png" },
    { role: "Wakil Ketua Kelas", name: "Taskya Ayu K.",         img: "/absen31.png" },
    { role: "Sekretaris 1",      name: "Olivia Agustina T.",    img: "/absen26.png" },
    { role: "Sekretaris 2",      name: "Margareta Anggani P.D", img: "/absen16.png" },
    { role: "Bendahara 1",       name: "Talitha Rana I.",       img: "/absen30.png" },
    { role: "Bendahara 2",       name: "Devano Fernando B.",    img: "/absen9.png" },
  ];
  const semuaMember = [
    { name: "Agung Abiy R.",        img: "/absen1.png" },
    { name: "Airina Zamira Z.",      img: "/absen2.png" },
    { name: "Al-Vina Darajatul I.", img: "/absen3.png" },
    { name: "Anisa Qonita N.",      img: "/absen4.png" },
    { name: "Aqila Yasmin R.",      img: "/absen5.png" },
    { name: "Bintang Mestika W.",   img: "/absen6.png" },
    { name: "Charisma Maharani",    img: "/absen7.png" },
    { name: "Christian Putra K.P.", img: "/absen8.png" },
    { name: "Fadhil Rizky F.",      img: "/absen10.png" },
    { name: "Faizah Eka M.",        img: "/absen11.png" },
    { name: "Faizah Febiana M.",    img: "/absen12.png" },
    { name: "Ghaisani Batrisya A.", img: "/absen13.png" },
    { name: "Inneke Alya K.",       img: "/absen14.png" },
    { name: "Levina Fitria S.",     img: "/absen15.png" },
    { name: "M. Affan Putra H.",    img: "/absen17.png" },
    { name: "M. Asyam Hadyan P.",   img: "/absen18.png" },
    { name: "M. Helmy Radithya",    img: "/absen19.png" },
    { name: "M. Ichwan Rahmatulloh",img: "/absen20.png" },
    { name: "M. Reval Fairus A.",   img: "/absen22.png" },
    { name: "Nabila Azkadina",      img: "/absen23.png" },
    { name: "Nafa Wahyu P. H.",     img: "/absen24.png" },
    { name: "Nafis Aulia Nadjwa P.",img: "/absen25.png" },
    { name: "Ricky Moreno A.R.",    img: "/absen27.png" },
    { name: "Rohadatul Aisy",       img: "/absen28.png" },
    { name: "Safira Cahya M.",      img: "/absen29.png" },
    { name: "Yohanes Adrina B.S.",  img: "/absen32.png" },
  ];
  const jadwal = [
    { hari: "Senin",  mapel: ["PPKn", "B. Jawa", "MTK", "IPA"] },
    { hari: "Selasa", mapel: ["BK", "Prakarya", "MTK", "B. Indonesia", "B. Inggris"] },
    { hari: "Rabu",   mapel: ["B. Indonesia", "B. Inggris", "TIK", "IPA", "PJOK"] },
    { hari: "Kamis",  mapel: ["PJOK", "IPS", "Dhuha", "B. Indonesia", "MTK"] },
    { hari: "Jumat",  mapel: ["Jumat Berhati / Senam", "IPS", "PPKn", "BTQ"] },
    { hari: "Sabtu",  mapel: ["Literasi", "PAI", "IPA", "Prakarya", "TIK"] },
  ];
  const galeri = [
    { src: "/kenangan7.png",  caption: "Odl Ke Jogja Kelas 7 🚌📸" },
    { src: "/kenangan2.png",  caption: "Buka Bersama Di Rumah Bendahara Kelas 7 🌙🍴" },
    { src: "/kenangan4.png",  caption: "Maulid Nabi Kelas 7 🕌✨" },
    { src: "/kenangan8.png",  caption: "Hari Pahlawan Kelas 7 🔥🦅" },
    { src: "/kenangan15.png", caption: "Upacara Bendera Kelas 7 🫡🇮🇩" },
    { src: "/kenangan3.png",  caption: "Buka Bersama Di Sekolah Kelas 8 🏫🍴" },
    { src: "/kenangan1.png",  caption: "Odl Ke Jogja Kelas 8 🚌📸" },
    { src: "/kenangan6.png",  caption: "Maulid Nabi Kelas 8 🕌🙏" },
    { src: "/kenangan9.png",  caption: "Hari Pahlawan Kelas 8 🔥🦅" },
    { src: "/kenangan10.png", caption: "Mancing Bersama Kelas 8 🎣🐟" },
    { src: "/kenangan11.png", caption: "Upacara Bendera Kelas 8 🫡🇮🇩" },
    { src: "/kenangan5.png",  caption: "Ulang Tahun Bu Ana 🎂" },
    { src: "/kenangan12.png", caption: "Upacara Bendera Kelas 9 🫡🇮🇩" },
    { src: "/kenangan13.png", caption: "Maulid Nabi Kelas 9 🕌🤲" },
    { src: "/kenangan14.png", caption: "Foto Ijazah Sebelum Kelulusan 📸👨‍🎓👩‍🎓" },
  ];

  const navItems = [
    { label: 'Home',       id: 'home' },
    { label: 'Wali Kelas', id: 'walikelas' },
    { label: 'Member',     id: 'member' },
    { label: 'Jadwal',     id: 'jadwal' },
    { label: 'Album',      id: 'album' },
  ];

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
    else if (id === 'home') window.scrollTo({ top: 0, behavior: 'smooth' });
    setIsMenuOpen(false);
  };

  const Avatar = ({ img, name, size = "md" }) => {
    const dim = size === "lg" ? "w-24 h-24 text-4xl" : "w-14 h-14 text-2xl";
    if (img) return (
      <div className={`${dim} rounded-full overflow-hidden border-2 border-white/10 ring-4 ring-blue-500/10 mx-auto flex-shrink-0`}>
        <img src={img} alt={name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition duration-500"
          onError={(e) => { e.target.style.display='none'; e.target.parentNode.classList.add('flex','items-center','justify-center','bg-slate-800'); e.target.parentNode.innerHTML='👤'; }} />
      </div>
    );
    return <div className={`${dim} rounded-full bg-slate-800 border-2 border-white/10 ring-4 ring-blue-500/10 mx-auto flex-shrink-0 flex items-center justify-center`}>👤</div>;
  };

  const displayList = activeTab === 'pengurus' ? pengurus : semuaMember;

  return (
    <>
      {/* Inject global styles */}
      <style>{globalStyles}</style>

      {/* ── INTRO SCREEN ──────────────────────────────────────── */}
      {showIntro && <IntroScreen onDone={handleIntroDone} />}

      <div className="min-h-screen bg-[#020617] text-slate-200 pb-20 font-sans selection:bg-blue-500/30">

        {/* ── LIGHTBOX ──────────────────────────────────────────── */}
        {lightboxIndex !== null && (
          <div className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 animate-fadeIn"
            onClick={() => setLightboxIndex(null)}>
            <div className="relative max-w-4xl w-full animate-scaleIn" onClick={e => e.stopPropagation()}>
              <button onClick={() => setLightboxIndex(null)}
                className="absolute -top-12 right-0 text-slate-400 hover:text-white transition-colors text-3xl font-light z-10">✕</button>
              <p className="absolute -top-12 left-0 text-slate-400 text-sm">{lightboxIndex + 1} / {galeri.length}</p>
              <div className="rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-blue-500/10">
                <img src={galeri[lightboxIndex].src} alt={galeri[lightboxIndex].caption}
                  className="w-full max-h-[75vh] object-contain bg-slate-900" />
              </div>
              {galeri[lightboxIndex].caption && (
                <p className="text-center text-slate-300 mt-4 text-sm font-medium animate-fadeUp">{galeri[lightboxIndex].caption}</p>
              )}
              <button onClick={prevPhoto}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-14 w-10 h-10 rounded-full bg-white/10 hover:bg-blue-500/30 border border-white/10 flex items-center justify-center text-white transition-all hover:scale-110 text-xl">‹</button>
              <button onClick={nextPhoto}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-14 w-10 h-10 rounded-full bg-white/10 hover:bg-blue-500/30 border border-white/10 flex items-center justify-center text-white transition-all hover:scale-110 text-xl">›</button>
            </div>
          </div>
        )}

        {/* ── GALLERY MODAL ─────────────────────────────────────── */}
        {isGalleryOpen && (
          <div className="fixed inset-0 z-[150] bg-[#020617]/98 backdrop-blur-2xl flex flex-col overflow-y-auto animate-fadeIn">
            <div className="sticky top-0 z-10 bg-[#020617]/90 backdrop-blur-xl border-b border-white/10 px-6 py-4 flex items-center justify-between animate-slideDown">
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-black tracking-tight text-white">📸 Galeri Kenangan</h2>
                {/* Music visualizer */}
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 cursor-pointer"
                  onClick={() => setIsMuted(m => !m)}>
                  {isMuted
                    ? <span className="text-xs text-slate-400 font-bold">🔇 Muted</span>
                    : <><MusicBars /><span className="text-[10px] text-blue-400 font-bold tracking-wide ml-1">Now Playing</span></>
                  }
                </div>
              </div>
              <button onClick={() => setIsGalleryOpen(false)}
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-red-500/20 border border-white/10 hover:border-red-500/30 flex items-center justify-center text-white transition-all hover:scale-110 text-lg">✕</button>
            </div>

            {/* Grid foto dengan animasi stagger */}
            <div className="flex-1 p-6">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
                {galeri.map((foto, i) => (
                  <div key={i} onClick={() => setLightboxIndex(i)}
                    className="gallery-card group relative aspect-square rounded-2xl overflow-hidden border border-white/10 cursor-pointer hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-500/20"
                    style={{ animation: `scaleIn 0.5s ease forwards`, animationDelay: `${i * 0.05}s`, opacity: 0 }}>
                    <img src={foto.src} alt={foto.caption} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-start justify-end p-3">
                      {foto.caption && <p className="text-white text-xs font-semibold leading-tight">{foto.caption}</p>}
                    </div>
                    {/* Nomor foto */}
                    <div className="absolute top-2 left-2 w-6 h-6 rounded-full bg-black/50 flex items-center justify-center text-[10px] text-white font-bold opacity-0 group-hover:opacity-100 transition-opacity">{i + 1}</div>
                    {/* Zoom icon */}
                    <div className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-sm border border-white/10">🔍</div>
                    {/* Shimmer border on hover */}
                    <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-blue-400/30 transition-all duration-300 pointer-events-none" />
                  </div>
                ))}
                {/* Add photo placeholder */}
                <div className="aspect-square rounded-2xl border-2 border-dashed border-white/10 flex flex-col items-center justify-center text-slate-500 hover:border-blue-500/30 hover:text-slate-400 transition-all duration-300 cursor-default"
                  style={{ animation: `scaleIn 0.5s ease forwards`, animationDelay: `${galeri.length * 0.05}s`, opacity: 0 }}>
                  <span className="text-3xl mb-2">＋</span>
                  <span className="text-xs text-center px-4">Tambah Foto</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Mobile Menu */}
        <div className={`fixed inset-0 z-[90] bg-[#020617]/98 backdrop-blur-2xl transition-all duration-500 md:hidden flex flex-col items-center justify-center gap-8 text-3xl font-black ${isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
          {navItems.map((item, i) => (
            <button key={item.id} onClick={() => scrollToSection(item.id)}
              className="hover:text-blue-500 transition-colors"
              style={{ animationDelay: `${i * 0.07}s` }}>
              {item.label}
            </button>
          ))}
        </div>

        {/* Navbar */}
        <nav className="fixed top-0 left-0 right-0 z-[100] backdrop-blur-xl border-b border-white/5 py-4 px-6">
          <div className="container mx-auto flex justify-between items-center">
            <div className="flex items-center gap-2 font-bold text-xl tracking-tighter">
              <div className="w-9 h-9 rounded-full overflow-hidden border border-white/20 shadow-[0_0_15px_rgba(255,255,255,0.2)]">
                <img src="/logo-9a.png" alt="Logo" className="w-full h-full object-cover" />
              </div>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">Class Attractive</span>
            </div>
            <div className="hidden md:flex gap-8 items-center">
              {navItems.map(item => (
                <button key={item.id} onClick={() => scrollToSection(item.id)}
                  className="text-sm text-slate-400 hover:text-white transition-all hover:scale-105 relative group">
                  {item.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-px bg-blue-500 group-hover:w-full transition-all duration-300" />
                </button>
              ))}
            </div>
            <button className="md:hidden flex flex-col gap-1.5 z-[110]" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              <div className={`w-6 h-0.5 bg-white transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`} />
              <div className={`w-6 h-0.5 bg-white transition-all duration-300 ${isMenuOpen ? 'opacity-0' : ''}`} />
              <div className={`w-6 h-0.5 bg-white transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
            </button>
          </div>
        </nav>

        {/* Hero */}
        <header id="home" className="min-h-screen flex flex-col items-center justify-center container mx-auto px-6 text-center relative overflow-hidden">
          <Particles />
          <div className="relative z-10">
            <div className="inline-block px-4 py-1.5 mb-6 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase animate-pulse">
              Established 2023 • Class Attractive
            </div>
            <h1 className="text-5xl md:text-9xl font-black mb-8 bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-slate-600 tracking-tighter leading-none">
              MEMORIES <br /> STAY FOREVER.
            </h1>
            <p className="text-slate-400 max-w-xl mx-auto italic text-base md:text-lg border-l-2 border-blue-600 pl-4">
              "Dari seragam putih biru hingga menjadi keluarga di putih abu-abu."
            </p>
          </div>
          <div className="absolute bottom-10 animate-bounce">
            <div className="w-px h-12 bg-gradient-to-b from-blue-600 to-transparent mx-auto" />
          </div>
        </header>

        {/* Wali Kelas */}
        <section id="walikelas" className="container mx-auto px-6 mb-40 pt-20">
          <h2 className="reveal text-2xl md:text-3xl font-bold mb-16 text-center flex items-center justify-center gap-4">
            <span className="h-px w-8 md:w-16 bg-blue-500/50" />
            Wali Kelas Dari Kelas 7–9
            <span className="h-px w-8 md:w-16 bg-blue-500/50" />
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {waliKelas.map((wk, i) => (
              <div key={i} className="reveal group p-px rounded-3xl bg-gradient-to-b from-white/10 to-transparent hover:from-blue-500/40 transition-all duration-500"
                style={{ transitionDelay: `${i * 0.1}s` }}>
                <div className="bg-[#0f172a]/80 backdrop-blur-sm p-8 rounded-[23px] text-center h-full">
                  <div className="mb-6"><Avatar img={wk.img} name={wk.name} size="lg" /></div>
                  <h3 className="font-bold text-blue-400 text-sm uppercase tracking-widest mb-1">{wk.grade}</h3>
                  <p className="text-2xl font-bold text-white mb-3">{wk.name}</p>
                  <p className="text-sm text-slate-400 italic leading-relaxed">"{wk.quote}"</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Member & Pengurus */}
        <section className="container mx-auto px-6 mb-40 pt-20" id="member">
          <div className="reveal flex justify-center mb-12 gap-2 p-1.5 bg-white/5 w-fit mx-auto rounded-full border border-white/10 backdrop-blur-md">
            <button onClick={() => setActiveTab('pengurus')}
              className={`px-8 py-2.5 rounded-full text-sm font-bold transition-all duration-300 ${activeTab === 'pengurus' ? 'bg-blue-600 text-white shadow-xl shadow-blue-500/40' : 'text-slate-400 hover:text-white'}`}>
              Pengurus
            </button>
            <button onClick={() => setActiveTab('member')}
              className={`px-8 py-2.5 rounded-full text-sm font-bold transition-all duration-300 ${activeTab === 'member' ? 'bg-blue-600 text-white shadow-xl shadow-blue-500/40' : 'text-slate-400 hover:text-white'}`}>
              Semua Member
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {displayList.map((item, i) => (
              <div key={i} className="reveal bg-white/5 border border-white/10 p-4 rounded-3xl hover:bg-blue-600/5 hover:border-blue-500/30 transition-all duration-500 group relative overflow-hidden flex flex-col items-center text-center hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-500/10"
                style={{ transitionDelay: `${(i % 4) * 0.05}s` }}>
                <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500/5 blur-3xl group-hover:bg-blue-500/20 transition-all" />
                <div className="mb-3 group-hover:scale-110 transition-transform duration-300">
                  <Avatar img={item.img} name={item.name} size="md" />
                </div>
                <h4 className="font-bold text-white text-xs md:text-sm leading-tight w-full"
                  style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {item.name}
                </h4>
                {item.role && (
                  <p className="text-[10px] md:text-xs text-blue-500 font-black uppercase tracking-wide mt-1 w-full"
                    style={{ display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {item.role}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Jadwal & Album */}
        <section className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-6 pt-20" id="jadwal">
          <div className="reveal md:col-span-2 bg-white/[0.02] border border-white/10 rounded-[2.5rem] p-10 backdrop-blur-3xl relative overflow-hidden">
            <div className="absolute -top-24 -left-24 w-48 h-48 bg-blue-600/10 blur-[100px]" />
            <h3 className="text-3xl font-black mb-10 flex items-center gap-4 text-white">
              📅 <span className="tracking-tighter">Jadwal Mingguan</span>
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {jadwal.map((j, i) => (
                <div key={i}>
                  <p className="text-[10px] font-black text-blue-500 mb-3 uppercase tracking-[0.2em]">{j.hari}</p>
                  <div className="space-y-2">
                    {j.mapel.map((m, idx) => (
                      <p key={idx} className="text-[11px] text-slate-400 bg-white/5 px-3 py-2 rounded-xl border border-white/5 hover:border-blue-500/30 transition-colors">{m}</p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div id="album" onClick={() => setIsGalleryOpen(true)}
            className="reveal bg-white/[0.02] border border-white/10 rounded-[2.5rem] p-10 overflow-hidden relative group cursor-pointer hover:border-blue-500/40 transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl hover:shadow-blue-500/10">
            <h3 className="text-3xl font-black mb-6 text-white tracking-tighter text-center md:text-left">📸 Galeri</h3>
            <div className="grid grid-cols-2 gap-3 transition-all duration-700 group-hover:scale-105">
              {galeri.slice(0, 4).map((foto, i) => (
                <div key={i} className="h-24 rounded-2xl overflow-hidden border border-white/10">
                  <img src={foto.src} alt={foto.caption} className="w-full h-full object-cover opacity-40 group-hover:opacity-70 transition-all duration-500 group-hover:scale-110" />
                </div>
              ))}
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-[#020617]/40 to-transparent flex items-end justify-center p-10">
              <p className="text-blue-400 font-black uppercase tracking-[0.3em] text-[10px] bg-[#020617] px-4 py-2 rounded-full border border-blue-500/30 shadow-2xl group-hover:border-blue-400/60 group-hover:text-blue-300 group-hover:shadow-blue-500/30 transition-all duration-300">
                Open Archives →
              </p>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-40 py-10 text-center border-t border-white/5">
          <p className="text-[10px] text-slate-600 uppercase tracking-[0.5em]">
            &copy; 2026 Class Attractive • All Rights Reserved
          </p>
        </footer>
      </div>
    </>
  );
};

export default App;