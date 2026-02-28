import React, { useState, useEffect } from 'react';

const App = () => {
  const [activeTab, setActiveTab] = useState('pengurus');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(null);

  const waliKelas = [
    { grade: "Wali Kelas 7", name: "A. Widyanti", img: "/bu-widya.png", quote: "Guru Bahasa Inggris" },
    { grade: "Wali Kelas 8", name: "Ana Eka Rizky", img: "/bu-ana.png", quote: "Guru Prakarya." },
    { grade: "Wali Kelas 9", name: "Endang Sustyaningsih S. P.", img: "/bu-endang.png", quote: "Guru Bahasa Inggris." },
  ];

  const pengurus = [
    { role: "Ketua Kelas",       name: "Nabila Amalia H.",      img: "/absen21.png" },
    { role: "Wakil Ketua Kelas", name: "Taskya Ayu K.",          img: "/absen31.png" },
    { role: "Sekretaris 1",      name: "Olivia Agustina T.",     img: "/absen26.png" },
    { role: "Sekretaris 2",      name: "Margareta Anggani P.D",  img: "/absen16.png" },
    { role: "Bendahara 1",       name: "Talitha Rana I.",        img: "/absen30.png" },
    { role: "Bendahara 2",       name: "Devano Fernando B.",     img: "/absen9.png" },
  ];

  const semuaMember = [
    { name: "Agung Abiy R.",           img: "/absen1.png" },
    { name: "Airina Zamira Z.",         img: "/absen2.png" },
    { name: "Al-Vina Darajatul I.",     img: "/absen3.png" },
    { name: "Anisa Qonita N.",          img: "/absen4.png" },
    { name: "Aqila Yasmin R.",          img: "/absen5.png" },
    { name: "Bintang Mestika W.",       img: "/absen6.png" },
    { name: "Charisma Maharani",        img: "/absen7.png" },
    { name: "Christian Putra K.P.",     img: "/absen8.png" },
    { name: "Fadhil Rizky F.",          img: "/absen10.png" },
    { name: "Faizah Eka M.",            img: "/absen11.png" },
    { name: "Faizah Febiana M.",        img: "/absen12.png" },
    { name: "Ghaisani Batrisya A.",     img: "/absen13.png" },
    { name: "Inneke Alya K.",           img: "/absen14.png" },
    { name: "Levina Fitria S.",         img: "/absen15.png" },
    { name: "M. Affan Putra H.",        img: "/absen17.png" },
    { name: "M. Asyam Hadyan P.",       img: "/absen18.png" },
    { name: "M. Helmy Radithya",        img: "/absen19.png" },
    { name: "M. Ichwan Rahmatulloh",    img: "/absen20.png" },
    { name: "M. Reval Fairus A.",       img: "/absen22.png" },
    { name: "Nabila Azkadina",          img: "/absen23.png" },
    { name: "Nafa Wahyu P. H.",         img: "/absen24.png" },
    { name: "Nafis Aulia Nadjwa P.",    img: "/absen25.png" },
    { name: "Ricky Moreno A.R.",        img: "/absen27.png" },
    { name: "Rohadatul Aisy",           img: "/absen28.png" },
    { name: "Safira Cahya M.",          img: "/absen29.png" },
    { name: "Yohanes Adrina B.S.",      img: "/absen32.png" },
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
    { src: "/kenangan1.png", caption: "Odl Ke Jogja Kelas 8 🚌📸" },
    { src: "/kenangan2.png", caption: "Buka Bersama Di Rumah Bendahara Kelas 7 🌙🍴" },
    { src: "/kenangan3.png", caption: "Buka Bersama Di Sekolah Kelas 8 📸🍲" },
    { src: "https://via.placeholder.com/600x400/172840/ffffff?text=Foto+4", caption: "Lorem ipsum 🏆" },
    { src: "https://via.placeholder.com/600x400/1e3a5f/ffffff?text=Foto+5", caption: "Lorem ipsum 📸" },
    { src: "https://via.placeholder.com/600x400/1a2f4a/ffffff?text=Foto+6", caption: "Lorem ipsum 🎂" },
    { src: "https://via.placeholder.com/600x400/0f2035/ffffff?text=Foto+7", caption: "Lorem ipsum ⚽" },
    { src: "https://via.placeholder.com/600x400/172840/ffffff?text=Foto+8", caption: "Lorem ipsum 😄" },
  ];

  useEffect(() => {
    document.body.style.overflow = (isGalleryOpen || lightboxIndex !== null) ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isGalleryOpen, lightboxIndex]);

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

  const Avatar = ({ img, name, size = "md" }) => {
    const dim = size === "lg" ? "w-24 h-24 text-4xl" : "w-14 h-14 text-2xl";
    if (img) {
      return (
        <div className={`${dim} rounded-full overflow-hidden border-2 border-white/10 ring-4 ring-blue-500/10 mx-auto flex-shrink-0`}>
          <img src={img} alt={name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition duration-500"
            onError={(e) => { e.target.style.display='none'; e.target.parentNode.classList.add('flex','items-center','justify-center','bg-slate-800'); e.target.parentNode.innerHTML='👤'; }} />
        </div>
      );
    }
    return (
      <div className={`${dim} rounded-full bg-slate-800 border-2 border-white/10 ring-4 ring-blue-500/10 mx-auto flex-shrink-0 flex items-center justify-center`}>👤</div>
    );
  };

  // ── Menu items — label & id section tujuan ──────────────────
  const navItems = [
    { label: 'Home',      id: 'home' },
    { label: 'Wali Kelas', id: 'walikelas' },  // ← BARU
    { label: 'Member',    id: 'member' },
    { label: 'Jadwal',    id: 'jadwal' },
    { label: 'Album',     id: 'album' },
  ];

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
    else if (id === 'home') window.scrollTo({ top: 0, behavior: 'smooth' });
    setIsMenuOpen(false);
  };

  const displayList = activeTab === 'pengurus' ? pengurus : semuaMember;

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 pb-20 font-sans selection:bg-blue-500/30">

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <div className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4"
          onClick={() => setLightboxIndex(null)}>
          <div className="relative max-w-4xl w-full" onClick={e => e.stopPropagation()}>
            <button onClick={() => setLightboxIndex(null)}
              className="absolute -top-12 right-0 text-slate-400 hover:text-white transition-colors text-3xl font-light z-10">✕</button>
            <p className="absolute -top-12 left-0 text-slate-400 text-sm">{lightboxIndex + 1} / {galeri.length}</p>
            <div className="rounded-2xl overflow-hidden border border-white/10">
              <img src={galeri[lightboxIndex].src} alt={galeri[lightboxIndex].caption}
                className="w-full max-h-[75vh] object-contain bg-slate-900" />
            </div>
            {galeri[lightboxIndex].caption && (
              <p className="text-center text-slate-300 mt-4 text-sm font-medium">{galeri[lightboxIndex].caption}</p>
            )}
            <button onClick={prevPhoto}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-14 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 flex items-center justify-center text-white transition-all hover:scale-110">‹</button>
            <button onClick={nextPhoto}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-14 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 flex items-center justify-center text-white transition-all hover:scale-110">›</button>
          </div>
        </div>
      )}

      {/* Gallery Modal */}
      {isGalleryOpen && (
        <div className="fixed inset-0 z-[150] bg-[#020617]/98 backdrop-blur-2xl flex flex-col overflow-y-auto">
          <div className="sticky top-0 z-10 bg-[#020617]/90 backdrop-blur-xl border-b border-white/10 px-6 py-4 flex items-center justify-between">
            <h2 className="text-xl font-black tracking-tight text-white">📸 Galeri Kenangan</h2>
            <button onClick={() => setIsGalleryOpen(false)}
              className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 flex items-center justify-center text-white transition-all hover:scale-110 text-lg">✕</button>
          </div>
          <div className="flex-1 p-6">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
              {galeri.map((foto, i) => (
                <div key={i} onClick={() => setLightboxIndex(i)}
                  className="group relative aspect-square rounded-2xl overflow-hidden border border-white/10 cursor-pointer hover:border-blue-500/50 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-blue-500/10">
                  <img src={foto.src} alt={foto.caption} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
                    {foto.caption && <p className="text-white text-xs font-semibold leading-tight">{foto.caption}</p>}
                  </div>
                  <div className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-sm">🔍</div>
                </div>
              ))}
              <div className="aspect-square rounded-2xl border-2 border-dashed border-white/10 flex flex-col items-center justify-center text-slate-500 hover:border-blue-500/30 hover:text-slate-400 transition-all duration-300 cursor-default">
                <span className="text-3xl mb-2">＋</span>
                <span className="text-xs text-center px-4">Tambah Foto Di Admin</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Menu Overlay */}
      <div className={`fixed inset-0 z-[90] bg-[#020617]/98 backdrop-blur-2xl transition-all duration-500 md:hidden flex flex-col items-center justify-center gap-8 text-3xl font-black ${isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        {navItems.map((item) => (
          <button key={item.id} onClick={() => scrollToSection(item.id)} className="hover:text-blue-500 transition-colors">
            {item.label}
          </button>
        ))}
      </div>

      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-[100] backdrop-blur-xl border-b border-white/5 py-4 px-6">
        <div className="container mx-auto flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center gap-2 font-bold text-xl tracking-tighter">
            <div className="w-9 h-9 rounded-full overflow-hidden border border-white/20 shadow-[0_0_15px_rgba(255,255,255,0.2)]">
              <img src="/logo-9a.png" alt="Logo" className="w-full h-full object-cover" />
            </div>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">Class Attractive</span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex gap-8 items-center">
            {navItems.map((item) => (
              <button key={item.id} onClick={() => scrollToSection(item.id)}
                className="text-sm text-slate-400 hover:text-white transition-all hover:scale-105">
                {item.label}
              </button>
            ))}
          </div>

          {/* Hamburger */}
          <button className="md:hidden flex flex-col gap-1.5 z-[110]" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <div className={`w-6 h-0.5 bg-white transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`} />
            <div className={`w-6 h-0.5 bg-white transition-all duration-300 ${isMenuOpen ? 'opacity-0' : ''}`} />
            <div className={`w-6 h-0.5 bg-white transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
          </button>
        </div>
      </nav>

      {/* Hero */}
      <header id="home" className="min-h-screen flex flex-col items-center justify-center container mx-auto px-6 text-center relative">
        <div className="inline-block px-4 py-1.5 mb-6 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase animate-pulse">
          Established 2023 • Class Attractive
        </div>
        <h1 className="text-5xl md:text-9xl font-black mb-8 bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-slate-600 tracking-tighter leading-none">
          MEMORIES <br /> STAY FOREVER.
        </h1>
        <p className="text-slate-400 max-w-xl mx-auto italic text-base md:text-lg border-l-2 border-blue-600 pl-4">
          "Dari seragam putih biru hingga menjadi keluarga di putih abu-abu."
        </p>
        <div className="absolute bottom-10 animate-bounce">
          <div className="w-px h-12 bg-gradient-to-b from-blue-600 to-transparent mx-auto" />
        </div>
      </header>

      {/* Wali Kelas — id="walikelas" ditambahkan di sini */}
      <section id="walikelas" className="container mx-auto px-6 mb-40 pt-20">
        <h2 className="text-2xl md:text-3xl font-bold mb-16 text-center flex items-center justify-center gap-4">
          <span className="h-px w-8 md:w-16 bg-blue-500/50" />
          Wali Kelas Dari Kelas 7–9
          <span className="h-px w-8 md:w-16 bg-blue-500/50" />
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {waliKelas.map((wk, i) => (
            <div key={i} className="group p-px rounded-3xl bg-gradient-to-b from-white/10 to-transparent hover:from-blue-500/40 transition-all duration-500">
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
        <div className="flex justify-center mb-12 gap-2 p-1.5 bg-white/5 w-fit mx-auto rounded-full border border-white/10 backdrop-blur-md">
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
            <div key={i} className="bg-white/5 border border-white/10 p-4 rounded-3xl hover:bg-blue-600/5 hover:border-blue-500/30 transition-all duration-500 group relative overflow-hidden flex flex-col items-center text-center">
              <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500/5 blur-3xl group-hover:bg-blue-500/20 transition-all" />
              <div className="mb-3 group-hover:scale-105 transition-transform duration-300">
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
        <div className="md:col-span-2 bg-white/[0.02] border border-white/10 rounded-[2.5rem] p-10 backdrop-blur-3xl relative overflow-hidden">
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
          className="bg-white/[0.02] border border-white/10 rounded-[2.5rem] p-10 overflow-hidden relative group cursor-pointer hover:border-blue-500/40 transition-all duration-500">
          <h3 className="text-3xl font-black mb-6 text-white tracking-tighter text-center md:text-left">📸 Galeri</h3>
          <div className="grid grid-cols-2 gap-3 transition-all duration-700 group-hover:scale-105">
            {galeri.slice(0, 4).map((foto, i) => (
              <div key={i} className="h-24 rounded-2xl overflow-hidden border border-white/10">
                <img src={foto.src} alt={foto.caption} className="w-full h-full object-cover opacity-40 group-hover:opacity-70 transition-opacity duration-500" />
              </div>
            ))}
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-[#020617]/40 to-transparent flex items-end justify-center p-10">
            <p className="text-blue-400 font-black uppercase tracking-[0.3em] text-[10px] bg-[#020617] px-4 py-2 rounded-full border border-blue-500/30 shadow-2xl group-hover:border-blue-400/60 group-hover:text-blue-300 transition-all duration-300">
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
  );
};

export default App;