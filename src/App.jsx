import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter, useNavigate, useLocation } from 'react-router-dom';

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
  @keyframes ripple {
    0%   { transform: scale(1); opacity: 0.6; }
    100% { transform: scale(2.5); opacity: 0; }
  }
  @keyframes textBlink {
    0%, 100% { opacity: 1; }
    50%       { opacity: 0.3; }
  }
  @keyframes eggBounce {
    0%, 100% { transform: scale(1) rotate(-3deg); }
    50%       { transform: scale(1.1) rotate(3deg); }
  }
  @keyframes confettiFall {
    0%   { transform: translateY(-10px) rotate(0deg); opacity: 1; }
    100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
  }
  @keyframes eggSlideUp {
    from { opacity: 0; transform: translateY(50px) scale(0.85); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }
  @keyframes progressShrink {
    from { width: 100%; }
    to   { width: 0%; }
  }

  .animate-fadeUp     { animation: fadeUp    0.7s ease forwards; }
  .animate-fadeIn     { animation: fadeIn    0.5s ease forwards; }
  .animate-scaleIn    { animation: scaleIn   0.6s cubic-bezier(.34,1.56,.64,1) forwards; }
  .animate-slideDown  { animation: slideDown 0.5s ease forwards; }
  .animate-float      { animation: float     3s ease-in-out infinite; }
  .animate-spin-slow  { animation: spin-slow 8s linear infinite; }
  .animate-glowPulse  { animation: glowPulse 2s ease-in-out infinite; }
  .animate-textBlink  { animation: textBlink 1.5s ease-in-out infinite; }
  .animate-eggBounce  { animation: eggBounce 1.4s ease-in-out infinite; }
  .animate-eggSlideUp { animation: eggSlideUp 0.5s cubic-bezier(.34,1.56,.64,1) forwards; }

  .text-shimmer {
    background: linear-gradient(90deg, #fff 0%, #93c5fd 40%, #fff 60%, #93c5fd 100%);
    background-size: 200% auto;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: shimmer 3s linear infinite;
  }

  .wave-bar { animation: waveBar 0.8s ease-in-out infinite; }
  .wave-bar:nth-child(2) { animation-delay: 0.1s; }
  .wave-bar:nth-child(3) { animation-delay: 0.2s; }
  .wave-bar:nth-child(4) { animation-delay: 0.3s; }
  .wave-bar:nth-child(5) { animation-delay: 0.15s; }

  .particle { position: absolute; border-radius: 50%; pointer-events: none; }

  .gallery-card { transition: all 0.4s cubic-bezier(.34,1.56,.64,1); }
  .gallery-card:hover { transform: scale(1.05) rotate(-1deg); }

  .reveal { opacity: 0; transform: translateY(24px); transition: opacity 0.6s ease, transform 0.6s ease; }
  .reveal.visible { opacity: 1; transform: translateY(0); }

  .ripple-btn { position: relative; overflow: hidden; }
  .ripple-btn::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 9999px;
    background: rgba(59,130,246,0.4);
    animation: ripple 1.8s ease-out infinite;
  }

  .confetti-piece {
    position: fixed;
    pointer-events: none;
    z-index: 9999;
    border-radius: 3px;
    animation: confettiFall linear forwards;
  }

  .search-input:focus {
    box-shadow: 0 0 0 2px rgba(59,130,246,0.4), 0 0 25px rgba(59,130,246,0.1);
  }

  .egg-progress { animation: progressShrink 8s linear forwards; }

  html { scroll-behavior: smooth; }
`;

/**
 * Easter Egg Config
 * Tambah atau edit entri di bawah sesukamu.
 *
 * triggers : array kata pemicu (case-insensitive)
 * photo    : path file foto di /public
 * audio    : path file audio di /public
 * message  : pesan yang ditampilkan
 * emoji    : emoji dekorasi
 * color    : gradient Tailwind, format: from-xxx/30 to-xxx/30
 * border   : border Tailwind, format: border-xxx/50
 * longMessage : true = tidak ada auto-close, ada tombol tutup
 * fullMessage : teks panjang yang bisa di-scroll (opsional)
 */
const easterEggs = [

  // Wali Kelas
  {
    triggers: ['widyanti', 'bu widya', 'widya', 'wali kelas 7', 'walas 7'],
    name: 'A. Widyanti',
    photo: '/eggfoto3.webp',
    audio: '/eggsound3.mp3',
    message: 'Terima kasih telah menjadi jangkar kami. Saat dunia terasa sulit, tahu bahwa ada Ibu yang selalu berada di balik setiap langkah kami yang masih belajar ini dan Ibu yang selalu percaya pada kami adalah kekuatan terbesar yang kami miliki.',
    emoji: '🛡',
    color: 'from-sky-400/30 to-blue-300/30',
    border: 'border-sky-400/50',
    longMessage: true,
  },
  {
    triggers: ['ana', 'bu ana', 'ana eka', 'wali kelas 8', 'walas 8'],
    name: 'Ana Eka Rizky',
    photo: '/eggfoto4.webp',
    audio: '/eggsound4.mp3',
    message: 'Terima kasih telah menjadi lebih dari sekadar guru, tapi juga teman yang paling pengertian. Terima kasih sudah selalu mendukung mimpi-mimpi kami tanpa pernah membuat kami merasa terbebani.',
    emoji: '🕶',
    color: 'from-yellow-400/30 to-amber-300/30',
    border: 'border-yellow-400/50',
    longMessage: true,
  },
  {
    triggers: ['endang', 'bu endang', 'sustyaningsih', 'wali kelas 9', 'walas 9'],
    name: 'Endang Sustyaningsih S.P.',
    photo: '/eggfoto5.webp',
    audio: '/eggsound5.mp3',
    message: 'Kami tahu nasehat Ibu mungkin terasa setiap hari, tapi kami mengerti itu adalah cara Ibu menunjukkan kasih sayang agar kami tetap berada di jalan yang benar. Terima kasih telah menjaga kami.',
    emoji: '📖',
    color: 'from-rose-900/30 to-red-800/30',
    border: 'border-rose-800/50',
    longMessage: true,
  },

  {
    triggers: ['safira iwan', 'iwan safira', 'fira iwan', 'iwan fira'],
    name: 'Iwan & Safira 🌙',
    photo: '/eggfoto1.webp',
    audio: '/eggsound1.mp3',
    message: 'Halooo 🌙....',
    fullMessage: `Halooo 🌙....

Engga nyangka ya (sementara) itu sudah habis. Kisah kita udah berakhir dengan bahagia. Aku engga nyangka pada akhir masa SMP akan ada kenangan kayak gini. Jujur aku bahagia dan bersyukur tuhan ngasih 1 hadiah kelulusan yang indah banget. Dulu aku berpikir (knp tuhan ngasih perasaan ini ke aku? knp tuhan datengin kamu di hidup aku?) tapi seiring waktu aku nemuin jawaban dan dengan jawaban itu aku mulai memperbaiki diri sambil nyoba perlahan move on dari kamu.

kamu tau jalan nya berat banget aku naik turun terus tapi akhirnya aku engga berhasil engga tau kenapa engga bisa tapi perlahan sudut pandang ku mulai berubah yang awal nya aku kek kesel kamu dateng di hidup ku sekarang beda aku bersyukur kamu dateng di hidup aku, walau perasaan ini belum hilang tapi kalo ngeliat kamu sekarang kayak udh bahagia banget padahal cuma liat kamu dari jauh. Tapi di situ letak nyaman nya, entah kenapa suka sama seseorang cuma dengan liat dia dari jauh dengan segala rahasia itu bahagia banget kek ada perasaan yang lega/puas gitu.

Kita yang sekarang aku lebih suka engga tau kenapa gitu rasa nya lebih nyaman, damai dan indah. Naruh perasaan ke kamu buat hidup aku lebih baik, makasihhhh yaa. Naruh perasaan ke kamu beneran di luar kendali aku, awal nya aku cuma ngira kita bakal jadi teman aja. dan aku tau klo semua perasaan ini ada karenanya, mungkin ngelupain kamu adalah salah satu hal yg tertulis buat aku, ada sesuatu berharga buat aku yaitu nemuin seseorang yg ngebuat aku ngerasa beruntung banget, ga bisa di katakan secara singkat, karena terlalu beruntung nya aku di hadirkan dan juga di izinin ngenal sosok yg begitu sempurna, yg penyayang, yg tulus, yg baik.

Sungguh keberuntungan yg berharga banget buat aku, kamu adalah sosok yg sempurna yg aku cerita in, iyaa aku beruntung bisa ketemu kmu. di kenalkan dgn seseorang yg aku anggap sempurna, apa bisa dibilang beruntung? iyaa bener, kmu suatu keberuntungan buat aku. ga ada yg bisa gantiin kamu, karna kmu ya cma kmu, ga ada yg bisa nyamain. makasihhh ya udh hadir di hidup aku, tapi setelah kita pisah.

Aku berharap hidup kamu selalu di kelilingi kebahagiaan, kesuksesan, kesehatan, kedamaian. Aku engga tau sebanyak apa masalah atau perasaan yang kamu pendam tapi aku yakin kamu kuat dan bisa bertahan. Temuin rumah yaa nanti 🏠. Ohh iyaa aku punya 1 lagu yang selalu ingetin aku sama kisah kita yaitu lagu (Bahagia lagi) apalagi pas bagian "ku pastikan kita bahagia lagi" itu bener terjadi dan yaa "asing pada kata bahagia" itu juga terjadi.

Be happy iwan 🌙.`,
    emoji: '🌙',
    color: 'from-indigo-600/30 to-violet-600/30',
    border: 'border-indigo-500/50',
    longMessage: true,
  },

  // Tiga Pilar
  {
    triggers: ['3 pilar', 'tiga pilar', '3pilar', 'wali kelas'],
    name: 'Tiga Pilar Kelas 9A 🌟',
    photo: '/bu-widya.webp',
    audio: '/eggsound2.mp3',
    message: 'Terima kasih kepada tiga pilar yang selalu menjaga, membimbing, dan menyayangi kita semua. Kalian adalah bagian terbaik dari perjalanan kelas 9A. 🙏💙',
    fullMessage: `Terima kasih telah menjadi 'orang tua' kami di sekolah.

Dimulai dari Bu Widya di kelas 7 yang dengan sabar menjadi pelindung dan selalu percaya pada kami di masa awal pencarian jati diri. 🛡️✨

Berlanjut ke Bu Ana di kelas 8 yang selalu suportif, dermawan, dan menjadi sahabat paling gaul yang membuat masa remaja kami jauh lebih berwarna. 🕶️💸

Hingga Bu Endang di kelas 9 yang dengan tegas dan penuh nasehat menjaga kami agar tidak salah melangkah sebelum kami benar-benar dilepas ke masa depan. 🧭❤️

Ibu bertiga adalah pilar yang membuat kami kuat. Terima kasih telah selalu berada di belakang kami, mendukung setiap langkah, dan tidak pernah menyerah pada kenakalan kami. Kami bangga menjadi murid didikan Ibu semua! 🙏💙`,
    multiPhoto: [
      { photo: '/bu-widya.webp',  label: 'Bu Widyanti' },
      { photo: '/bu-endang.webp', label: 'Bu Endang' },
      { photo: '/bu-ana.webp',    label: 'Bu Ana' },
    ],
    emoji: '🌟',
    color: 'from-blue-600/30 to-violet-600/30',
    border: 'border-blue-500/50',
    longMessage: true,
  },

  // Kata Rahasia Kelas
  {
    triggers: ['attractive', '9a', 'class attractive', '9 a'],
    name: 'Class Attractive 9A',
    photo: '/logo-9a.webp',
    audio: '/lagu-intro.mp3',
    message: '🎓 Kelas paling legendary! Class Attractive forever & ever 💙🔥',
    emoji: '🎓',
    color: 'from-blue-600/30 to-cyan-600/30',
    border: 'border-blue-500/50',
    longMessage: true,
  },
];

// Data
const waliKelas = [
  { grade: "Wali Kelas 7", name: "A. Widyanti",               img: "/bu-widya.webp",  quote: "Guru Bahasa Inggris" },
  { grade: "Wali Kelas 8", name: "Ana Eka Rizky",              img: "/bu-ana.webp",    quote: "Guru Prakarya." },
  { grade: "Wali Kelas 9", name: "Endang Sustyaningsih S. P.", img: "/bu-endang.webp", quote: "Guru Bahasa Inggris." },
];
const pengurus = [
  { role: "Ketua Kelas",       name: "Nabila Amalia H.",     img: "/absen21.webp" },
  { role: "Wakil Ketua Kelas", name: "Taskya Ayu K.",         img: "/absen31.webp" },
  { role: "Sekretaris 1",      name: "Olivia Agustina T.",    img: "/absen26.webp" },
  { role: "Sekretaris 2",      name: "Margareta Anggani P.D", img: "/absen16.webp" },
  { role: "Bendahara 1",       name: "Talitha Rana I.",       img: "/absen30.webp" },
  { role: "Bendahara 2",       name: "Devano Fernando B.",    img: "/absen9.webp"  },
];
const semuaMember = [
  { name: "Agung Abiy R.",          img: "/absen1.webp"  },
  { name: "Airina Zamira Z.",        img: "/absen2.webp"  },
  { name: "Al-Vina Darajatul I.",   img: "/absen3.webp"  },
  { name: "Anisa Qonita N.",        img: "/absen4.webp"  },
  { name: "Aqila Yasmin R.",        img: "/absen5.webp"  },
  { name: "Bintang Mestika W.",     img: "/absen6.webp"  },
  { name: "Charisma Maharani",      img: "/absen7.webp"  },
  { name: "Christian Putra K.P.",   img: "/absen8.webp"  },
  { name: "Fadhil Rizky F.",        img: "/absen10.webp" },
  { name: "Faizah Eka M.",          img: "/absen11.webp" },
  { name: "Faizah Febiana M.",      img: "/absen12.webp" },
  { name: "Ghaisani Batrisya A.",   img: "/absen13.webp" },
  { name: "Inneke Alya K.",         img: "/absen14.webp" },
  { name: "Levina Fitria S.",       img: "/absen15.webp" },
  { name: "M. Affan Putra H.",      img: "/absen17.webp" },
  { name: "M. Asyam Hadyan P.",     img: "/absen18.webp" },
  { name: "M. Helmy Radithya",      img: "/absen19.webp" },
  { name: "M. Ichwan Rahmatulloh",  img: "/absen20.webp" },
  { name: "M. Reval Fairus A.",     img: "/absen22.webp" },
  { name: "Nabila Azkadina",        img: "/absen23.webp" },
  { name: "Nafa Wahyu P. H.",       img: "/rickysukadia.webp" },
  { name: "Nafis Aulia Nadjwa P.",  img: "/absen25.webp" },
  { name: "Ricky Moreno A.R.",      img: "/absen27.webp" },
  { name: "Rohadatul Aisy",         img: "/absen28.webp" },
  { name: "Safira Cahya M.",        img: "/absen29.webp" },
  { name: "Yohanes Adrina B.S.",    img: "/absen32.webp" },
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
  { src: "/kenangan7.webp",  caption: "Odl Ke Jogja Kelas 7 🚌📸" },
  { src: "/kenangan2.webp",  caption: "Buka Bersama Di Rumah Bendahara Kelas 7 🌙🍴" },
  { src: "/kenangan4.webp",  caption: "Maulid Nabi Kelas 7 🕌✨" },
  { src: "/kenangan8.webp",  caption: "Hari Pahlawan Kelas 7 🔥🦅" },
  { src: "/kenangan15.webp", caption: "Upacara Bendera Kelas 7 🫡🇮🇩" },
  { src: "/kenangan3.webp",  caption: "Buka Bersama Di Sekolah Kelas 8 🏫🍴" },
  { src: "/kenangan1.webp",  caption: "Odl Ke Jogja Kelas 8 🚌📸" },
  { src: "/kenangan6.webp",  caption: "Maulid Nabi Kelas 8 🕌🙏" },
  { src: "/kenangan9.webp",  caption: "Hari Pahlawan Kelas 8 🔥🦅" },
  { src: "/kenangan10.webp", caption: "Mancing Bersama Kelas 8 🎣🐟" },
  { src: "/kenangan11.webp", caption: "Upacara Bendera Kelas 8 🫡🇮🇩" },
  { src: "/kenangan5.webp",  caption: "Ulang Tahun Bu Ana 🎂" },
  { src: "/kenangan12.webp", caption: "Upacara Bendera Kelas 9 🫡🇮🇩" },
  { src: "/kenangan13.webp", caption: "Maulid Nabi Kelas 9 🕌🤲" },
  { src: "/kenangan14.webp", caption: "Foto Ijazah Sebelum Kelulusan 📸👨‍🎓👩‍🎓" },
];

const sections = [
  { id: 'home',      path: '/'          },
  { id: 'walikelas', path: '/walikelas' },
  { id: 'member',    path: '/member'    },
  { id: 'jadwal',    path: '/jadwal'    },
  { id: 'galeri',    path: '/galeri'    },
];
const navItems = [
  { label: 'Home',       id: 'home'      },
  { label: 'Wali Kelas', id: 'walikelas' },
  { label: 'Member',     id: 'member'    },
  { label: 'Jadwal',     id: 'jadwal'    },
  { label: 'Galeri',     id: 'galeri'    },
];

// Confetti
const spawnConfetti = () => {
  const colors = ['#3b82f6','#8b5cf6','#06b6d4','#f59e0b','#10b981','#ef4444','#ec4899','#fff'];
  for (let i = 0; i < 70; i++) {
    const el = document.createElement('div');
    el.className = 'confetti-piece';
    el.style.left     = Math.random() * 100 + 'vw';
    el.style.top      = '-20px';
    el.style.width    = (Math.random() * 10 + 5) + 'px';
    el.style.height   = (Math.random() * 10 + 5) + 'px';
    el.style.background       = colors[Math.floor(Math.random() * colors.length)];
    el.style.animationDuration = (Math.random() * 2 + 1.5) + 's';
    el.style.animationDelay   = (Math.random() * 0.8) + 's';
    el.style.borderRadius     = Math.random() > 0.5 ? '50%' : '2px';
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 3800);
  }
};

// Easter Egg Modal
const EasterEggModal = ({ egg, onClose, introAudioRef }) => {
  const audioRef = useRef(null);
  const DURATION = egg.longMessage ? 0 : 8000;

  useEffect(() => {
    spawnConfetti();
    // Pause background music
    if (introAudioRef && introAudioRef.current) introAudioRef.current.pause();
    if (egg.audio) {
      audioRef.current = new Audio(egg.audio);
      audioRef.current.volume = 0.6;
      audioRef.current.play().catch(() => {});
    }
    if (!egg.longMessage) {
      const t = setTimeout(onClose, DURATION);
      return () => {
        clearTimeout(t);
        if (audioRef.current) { audioRef.current.pause(); audioRef.current = null; }
      };
    }
    return () => {
      if (audioRef.current) { audioRef.current.pause(); audioRef.current = null; }
    };
  }, []);

  const displayMessage = egg.fullMessage || egg.message;

  return (
    <div className="fixed inset-0 z-[500] flex items-end md:items-center justify-center p-4 md:p-6 animate-fadeIn"
      onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      <div
        className="relative w-full animate-eggSlideUp flex flex-col"
        onClick={e => e.stopPropagation()}
        style={{
          background: 'rgba(8,15,30,0.97)',
          borderRadius: '28px',
          border: '1px solid rgba(255,255,255,0.06)',
          boxShadow: '0 30px 60px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.04)',
          maxWidth: '480px',
          maxHeight: '88vh',
        }}>



        {/* close */}
        <button onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/8 hover:bg-white/15 flex items-center justify-center text-slate-500 hover:text-white transition-all z-10 text-sm">✕</button>

        {/* Header tetap di atas */}
        <div className="flex-shrink-0 px-7 pt-7 pb-4">
          <div className="flex items-center gap-2 mb-5">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-400 bg-blue-500/10 border border-blue-500/20 px-3 py-1 rounded-full">
              🥚 Easter Egg
            </span>
          </div>

          {egg.multiPhoto ? (
            // Layout khusus multi foto
            <div>
              <div className="flex justify-center gap-3 mb-4">
                {egg.multiPhoto.map((p, i) => (
                  <div key={i} className="flex flex-col items-center gap-1.5">
                    <div className={`w-20 h-20 rounded-2xl overflow-hidden border-2 ${egg.border} flex-shrink-0`}
                      style={{ boxShadow: '0 8px 24px rgba(0,0,0,0.6), 0 0 20px rgba(99,102,241,0.15)' }}>
                      <img src={p.photo} alt={p.label} className="w-full h-full object-cover"
                        onError={e => { e.target.parentNode.innerHTML = `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:#1e293b;font-size:1.5rem">${egg.emoji}</div>`; }} />
                    </div>
                    <p className="text-[10px] text-slate-400 font-bold text-center leading-tight">{p.label}</p>
                  </div>
                ))}
              </div>
              <div className="text-center">
                <div className="text-2xl animate-eggBounce mb-1">{egg.emoji}</div>
                <p className="text-white font-black text-base leading-tight">{egg.name}</p>
              </div>
            </div>
          ) : (
            // Layout normal satu foto
            <div className="flex items-center gap-5">
              <div className={`relative w-20 h-20 rounded-2xl overflow-hidden border-2 ${egg.border} flex-shrink-0`}
                style={{ boxShadow: '0 8px 24px rgba(0,0,0,0.6), 0 0 20px rgba(99,102,241,0.15)' }}>
                <img src={egg.photo} alt={egg.name} className="w-full h-full object-cover"
                  onError={e => { e.target.parentNode.innerHTML = `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:#1e293b;font-size:2rem">${egg.emoji}</div>`; }} />
              </div>
              <div>
                <div className="text-3xl animate-eggBounce mb-1">{egg.emoji}</div>
                <p className="text-white font-black text-base leading-tight">{egg.name}</p>
                </div>
            </div>
          )}
        </div>

        {/* Pesan — scrollable */}
        <div className="flex-1 overflow-y-auto px-7 pb-2" style={{scrollbarWidth:'thin', scrollbarColor:'rgba(99,102,241,0.3) transparent'}}>
          <div className={`rounded-2xl p-4 bg-gradient-to-br ${egg.color} border ${egg.border}`}>
            <p className="text-slate-100 text-sm leading-relaxed font-medium" style={{whiteSpace:'pre-line'}}>{displayMessage}</p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex-shrink-0 px-7 pb-6 pt-4">
          <button onClick={onClose}
            className={`w-full py-3 rounded-2xl text-sm font-black text-white transition-all duration-300 active:scale-95 bg-gradient-to-r ${egg.color.replace('/30','')}`}
            style={{opacity:0.9}}>
            {'Tutup 💌'}
          </button>
        </div>
      </div>
    </div>
  );
};


// Shared Components
const Particles = () => {
  const particles = Array.from({ length: 18 }, (_, i) => ({
    id: i, size: Math.random() * 6 + 2,
    x: Math.random() * 100, y: Math.random() * 100,
    delay: Math.random() * 4, duration: 3 + Math.random() * 4,
    color: i % 3 === 0 ? '#3b82f6' : i % 3 === 1 ? '#8b5cf6' : '#06b6d4',
  }));
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map(p => (
        <div key={p.id} className="particle" style={{
          width: p.size, height: p.size, left: `${p.x}%`, top: `${p.y}%`,
          background: p.color, opacity: 0.3, animationName: 'float',
          animationDuration: `${p.duration}s`, animationDelay: `${p.delay}s`,
          animationTimingFunction: 'ease-in-out', animationIterationCount: 'infinite',
        }} />
      ))}
    </div>
  );
};

const MusicBars = () => (
  <div className="flex items-end gap-0.5 h-4">
    {[1,2,3,4,5].map(i => <div key={i} className="wave-bar w-1 bg-blue-400 rounded-full origin-bottom" style={{ height: '100%' }} />)}
  </div>
);

const Avatar = ({ img, name, size = "md" }) => {
  const dim = size === "lg" ? "w-24 h-24" : "w-14 h-14";
  if (img) return (
    <div className={`${dim} rounded-full overflow-hidden border-2 border-white/10 ring-4 ring-blue-500/10 mx-auto flex-shrink-0`}>
      <img src={img} alt={name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition duration-500"
        onError={e => { e.target.style.display='none'; e.target.parentNode.innerHTML='👤'; }} />
    </div>
  );
  return <div className={`${dim} rounded-full bg-slate-800 border-2 border-white/10 ring-4 ring-blue-500/10 mx-auto flex-shrink-0 flex items-center justify-center`}>👤</div>;
};

// Splash Screen
const SplashScreen = ({ onEnter }) => (
  <div className="fixed inset-0 z-[999] bg-[#020617] flex flex-col items-center justify-center overflow-hidden animate-fadeIn">
    <Particles />
    <div className="relative z-10 flex flex-col items-center text-center px-6">
      <div className="relative mb-8">
        <div className="absolute inset-0 rounded-full border border-blue-500/20 animate-spin-slow scale-150" />
        <div className="absolute inset-0 rounded-full border border-cyan-500/10 animate-spin-slow scale-[1.8]" style={{ animationDirection:'reverse', animationDuration:'14s' }} />
        <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-blue-500/40 animate-glowPulse">
          <img src="/logo-9a.webp" alt="Logo" className="w-full h-full object-cover" />
        </div>
      </div>
      <p className="text-[11px] text-blue-400 font-bold tracking-[0.5em] uppercase mb-3 animate-fadeUp" style={{ animationDelay:'0.2s', opacity:0 }}>Welcome to</p>
      <h1 className="text-5xl md:text-6xl font-black text-shimmer tracking-tighter mb-2 animate-fadeUp" style={{ animationDelay:'0.35s', opacity:0 }}>Class Attractive</h1>
      <p className="text-slate-500 text-sm italic mb-12 animate-fadeUp" style={{ animationDelay:'0.5s', opacity:0 }}>Memories Stay Forever.</p>
      <button onClick={onEnter}
        className="ripple-btn animate-fadeUp group relative px-10 py-4 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-black tracking-widest text-sm uppercase transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/40"
        style={{ animationDelay:'0.7s', opacity:0 }}>
        <span className="relative z-10 flex items-center gap-2">✨ Masuk</span>
      </button>
      <p className="mt-6 text-[10px] text-slate-600 animate-textBlink animate-fadeUp" style={{ animationDelay:'1s', opacity:0 }}>Klik untuk mulai</p>
    </div>
  </div>
);

// Loading Screen
const LoadingScreen = ({ onDone }) => {
  const [phase, setPhase] = useState(0);
  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 400);
    const t2 = setTimeout(() => setPhase(2), 2400);
    const t3 = setTimeout(() => onDone(), 3100);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);
  return (
    <div className={`fixed inset-0 z-[998] bg-[#020617] flex flex-col items-center justify-center transition-opacity duration-700 ${phase === 2 ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
      <div className="relative flex items-center justify-center mb-8">
        <div className="absolute w-32 h-32 rounded-full border border-blue-500/30 animate-spin-slow" />
        <div className="absolute w-44 h-44 rounded-full border border-blue-500/10 animate-spin-slow" style={{ animationDirection:'reverse', animationDuration:'12s' }} />
        <div className="absolute w-24 h-24 rounded-full bg-blue-500/20" style={{ animation:'pulse-ring 1.5s ease-out infinite' }} />
        <div className={`w-20 h-20 rounded-full overflow-hidden border-2 border-blue-500/50 animate-glowPulse transition-all duration-700 ${phase >= 0 ? 'animate-scaleIn' : 'opacity-0'}`}>
          <img src="/logo-9a.webp" alt="Logo" className="w-full h-full object-cover" />
        </div>
      </div>
      <div className={`text-center transition-all duration-700 ${phase >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        <p className="text-[11px] text-blue-400 font-bold tracking-[0.4em] uppercase mb-3">Loading</p>
        <h1 className="text-4xl md:text-5xl font-black text-shimmer tracking-tighter mb-2">Class Attractive</h1>
        <p className="text-slate-500 text-sm italic">Memories Stay Forever.</p>
      </div>
      <div className="mt-10 w-48 h-0.5 bg-white/5 rounded-full overflow-hidden">
        <div className="h-full bg-gradient-to-r from-blue-600 to-cyan-400 rounded-full"
          style={{ width: phase >= 1 ? '100%' : '0%', transition: 'width 1.8s ease' }} />
      </div>
    </div>
  );
};

// Main App
const AppInner = () => {
  const [stage, setStage]                 = useState('splash');
  const [activeSection, setActiveSection] = useState('home');
  const [activeTab, setActiveTab]         = useState('pengurus');
  const [isMenuOpen, setIsMenuOpen]       = useState(false);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [isMuted, setIsMuted]             = useState(false);
  const [isIntroPaused, setIsIntroPaused] = useState(false);
  const [introVolume, setIntroVolume]     = useState(0.4);
  const [showPlayer, setShowPlayer]       = useState(false);
  const [searchQuery, setSearchQuery]     = useState('');
  const [activeEgg, setActiveEgg]         = useState(null);
  const [eggCooldown, setEggCooldown]     = useState(false);
  const [showForm, setShowForm]           = useState(false);
  const [formData, setFormData]           = useState({ nama: '', pesan: '', photo: null });
  const [formStatus, setFormStatus]       = useState('idle'); // idle | loading | success | error
  const [formCooldown, setFormCooldown]   = useState(false);
  const [cooldownSecs, setCooldownSecs]   = useState(0);

  const introAudioRef  = useRef(new Audio('/lagu-intro.mp3'));
  const galeriAudioRef = useRef(new Audio('/lagu.mp3'));
  const scrollingTo    = useRef(false);
  const navigate       = useNavigate();
  const location       = useLocation();

  // Easter egg checker
  const checkEasterEgg = (query) => {
    if (eggCooldown || !query.trim()) return;
    const q = query.toLowerCase().trim();
    const found = easterEggs.find(egg =>
      egg.triggers.some(t => q.includes(t.toLowerCase()))
    );
    if (found) {
      setActiveEgg(found);
      setEggCooldown(true);
      setTimeout(() => setEggCooldown(false), 10000);
    }
  };

  const handleSearch = (val) => {
    setSearchQuery(val);
    checkEasterEgg(val);
  };

  // Form submit handler
  const IMGBB_KEY = '3b5d47875a882db1a573d355c26c9d67';
  const GAS_URL   = 'https://script.google.com/macros/s/AKfycbypB_nYFo-Z1zRhORDXkrctzAhDBzsp0RifP3gwHljgtKNVAs4_xZzITsCVJ3J1PknLBQ/exec';

  const handleFormSubmit = async () => {
    if (formCooldown) return;
    if (!formData.nama.trim()  || !formData.pesan.trim()) return;

    setFormStatus('loading');
    try {
      let photoUrl  = '';
      let photoName = '';

      // Upload foto ke ImgBB kalau ada
      if (formData.photo) {
        const imgForm = new FormData();
        imgForm.append('image', formData.photo);
        const imgRes  = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_KEY}`, {
          method: 'POST', body: imgForm,
        });
        const imgData = await imgRes.json();
        if (imgData.success) {
          photoUrl  = imgData.data.url;
          photoName = formData.photo.name;
        }
      }

      // Kirim ke Google Apps Script
      await fetch(GAS_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nama:      formData.nama,
          pesan:     formData.pesan,
          photoUrl,
          photoName,
        }),
      });

      setFormStatus('success');
      setFormData({ nama: '', pesan: '', photo: null });

      // Cooldown 60 detik
      setFormCooldown(true);
      setCooldownSecs(60);
      const interval = setInterval(() => {
        setCooldownSecs(s => {
          if (s <= 1) { clearInterval(interval); setFormCooldown(false); return 0; }
          return s - 1;
        });
      }, 1000);

      setTimeout(() => setFormStatus('idle'), 4000);
    } catch {
      setFormStatus('error');
      setTimeout(() => setFormStatus('idle'), 3000);
    }
  };

  // Filter helpers
  const filterBy = (list) => {
    if (!searchQuery.trim()) return list;
    return list.filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()));
  };
  const filteredPengurus = filterBy(pengurus);
  const filteredMember   = filterBy(semuaMember);
  const displayList      = activeTab === 'pengurus' ? filteredPengurus : filteredMember;
  const totalFound       = filteredPengurus.length + filteredMember.length;

  // Enter & loading
  const handleEnter = () => {
    setStage('loading');
    const a = introAudioRef.current;
    a.volume = introVolume; a.loop = true; a.play().catch(() => {});
  };
  const handleLoadingDone = () => { setStage('main'); navigate('/'); };

  // Music
  const toggleIntroMusic = () => {
    const a = introAudioRef.current;
    if (a.paused) { a.play().catch(() => {}); setIsIntroPaused(false); }
    else          { a.pause();                setIsIntroPaused(true);  }
  };
  const handleIntroVolume = v => { setIntroVolume(v); introAudioRef.current.volume = v; };

  useEffect(() => {
    const a = galeriAudioRef.current;
    a.loop = true; a.volume = isMuted ? 0 : 0.5;
    const start = 71, stop = 216;
    if (isGalleryOpen) {
      introAudioRef.current.pause();
      a.currentTime = start; a.play().catch(() => {});
      a.ontimeupdate = () => { if (a.currentTime >= stop) a.currentTime = start; };
    } else {
      a.pause(); a.currentTime = start; a.ontimeupdate = null;
    }
    return () => { a.pause(); a.ontimeupdate = null; };
  }, [isGalleryOpen]);

  useEffect(() => { galeriAudioRef.current.volume = isMuted ? 0 : 0.5; }, [isMuted]);

  // Scroll spy
  useEffect(() => {
    if (stage !== 'main') return;
    const observer = new IntersectionObserver(entries => {
      if (scrollingTo.current) return;
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const found = sections.find(s => s.id === entry.target.id);
          if (found) { setActiveSection(found.id); window.history.replaceState(null, '', found.path); }
        }
      });
    }, { threshold: 0.4 });
    const timer = setTimeout(() => {
      sections.forEach(s => { const el = document.getElementById(s.id); if (el) observer.observe(el); });
    }, 100);
    return () => { clearTimeout(timer); observer.disconnect(); };
  }, [stage]);

  // Reveal on scroll
  useEffect(() => {
    if (stage !== 'main') return;
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
      { threshold: 0.05, rootMargin: '0px 0px -20px 0px' }
    );
    const timer = setTimeout(() => {
      document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    }, 100);
    return () => { clearTimeout(timer); observer.disconnect(); };
  }, [stage]);

  // Scroll to section
  const scrollToSection = (id) => {
    setIsMenuOpen(false);
    const found = sections.find(s => s.id === id);
    if (found) {
      scrollingTo.current = true;
      setActiveSection(id);
      window.history.replaceState(null, '', found.path);
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
      else window.scrollTo({ top: 0, behavior: 'smooth' });
      setTimeout(() => { scrollingTo.current = false; }, 1000);
    }
  };

  useEffect(() => {
    if (stage !== 'main') return;
    const found = sections.find(s => s.path === location.pathname);
    if (found && found.id !== 'home') {
      setTimeout(() => { const el = document.getElementById(found.id); if (el) el.scrollIntoView({ behavior: 'smooth' }); }, 200);
    }
  }, [stage]);

  // Scroll lock
  useEffect(() => {
    document.body.style.overflow =
      (stage !== 'main' || isGalleryOpen || lightboxIndex !== null || !!activeEgg) ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [stage, isGalleryOpen, lightboxIndex, activeEgg]);

  const prevPhoto = () => setLightboxIndex(i => (i - 1 + galeri.length) % galeri.length);
  const nextPhoto = () => setLightboxIndex(i => (i + 1) % galeri.length);
  useEffect(() => {
    const h = e => {
      if (lightboxIndex === null) return;
      if (e.key === 'ArrowLeft') prevPhoto();
      if (e.key === 'ArrowRight') nextPhoto();
      if (e.key === 'Escape') setLightboxIndex(null);
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [lightboxIndex]);

  useEffect(() => {
    if (!showPlayer) return;
    const h = e => { if (!e.target.closest('[data-player]')) setShowPlayer(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, [showPlayer]);

  return (
    <>
      <style>{globalStyles}</style>

      {stage === 'splash'  && <SplashScreen onEnter={handleEnter} />}
      {stage === 'loading' && <LoadingScreen onDone={handleLoadingDone} />}

      {/* Easter Egg Modal */}
      {activeEgg && <EasterEggModal egg={activeEgg} onClose={() => { setActiveEgg(null); if (!isIntroPaused) introAudioRef.current.play().catch(()=>{}); }} introAudioRef={introAudioRef} />}

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <div className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setLightboxIndex(null)}>
          <div className="relative max-w-4xl w-full animate-scaleIn" onClick={e => e.stopPropagation()}>
            <button onClick={() => setLightboxIndex(null)} className="absolute -top-12 right-0 text-slate-400 hover:text-white text-3xl font-light z-10">✕</button>
            <p className="absolute -top-12 left-0 text-slate-400 text-sm">{lightboxIndex + 1} / {galeri.length}</p>
            <div className="rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-blue-500/10">
              <img src={galeri[lightboxIndex].src} alt={galeri[lightboxIndex].caption} className="w-full max-h-[75vh] object-contain bg-slate-900" />
            </div>
            {galeri[lightboxIndex].caption && <p className="text-center text-slate-300 mt-4 text-sm font-medium">{galeri[lightboxIndex].caption}</p>}
            <button onClick={prevPhoto} className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-14 w-10 h-10 rounded-full bg-white/10 hover:bg-blue-500/30 border border-white/10 flex items-center justify-center text-white transition-all hover:scale-110 text-xl">‹</button>
            <button onClick={nextPhoto} className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-14 w-10 h-10 rounded-full bg-white/10 hover:bg-blue-500/30 border border-white/10 flex items-center justify-center text-white transition-all hover:scale-110 text-xl">›</button>
          </div>
        </div>
      )}

      {/* Gallery Modal */}
      {isGalleryOpen && (
        <div className="fixed inset-0 z-[150] bg-[#020617]/98 backdrop-blur-2xl flex flex-col overflow-y-auto animate-fadeIn">
          <div className="sticky top-0 z-10 bg-[#020617]/90 backdrop-blur-xl border-b border-white/10 px-6 py-4 flex items-center justify-between animate-slideDown">
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-black tracking-tight text-white">📸 Galeri Kenangan</h2>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 cursor-pointer" onClick={() => setIsMuted(m => !m)}>
                {isMuted ? <span className="text-xs text-slate-400 font-bold">🔇 Muted</span> : <><MusicBars /><span className="text-[10px] text-blue-400 font-bold tracking-wide ml-1">Now Playing</span></>}
              </div>
            </div>
            <button onClick={() => setIsGalleryOpen(false)} className="w-9 h-9 rounded-full bg-white/10 hover:bg-red-500/20 border border-white/10 flex items-center justify-center text-white transition-all hover:scale-110 text-lg">✕</button>
          </div>
          <div className="flex-1 p-6">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
              {galeri.map((foto, i) => (
                <div key={i} onClick={() => setLightboxIndex(i)}
                  className="gallery-card group relative aspect-square rounded-2xl overflow-hidden border border-white/10 cursor-pointer hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-500/20"
                  style={{ animation:`scaleIn 0.5s ease forwards`, animationDelay:`${i*0.05}s`, opacity:0 }}>
                  <img src={foto.src} alt={foto.caption} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-start justify-end p-3">
                    {foto.caption && <p className="text-white text-xs font-semibold leading-tight">{foto.caption}</p>}
                  </div>
                  <div className="absolute top-2 left-2 w-6 h-6 rounded-full bg-black/50 flex items-center justify-center text-[10px] text-white font-bold opacity-0 group-hover:opacity-100 transition-opacity">{i+1}</div>
                  <div className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-sm border border-white/10">🔍</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Mobile Menu */}
      <div className={`fixed inset-0 z-[90] bg-[#020617]/98 backdrop-blur-2xl transition-all duration-500 md:hidden flex flex-col items-center justify-center gap-8 text-3xl font-black ${isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        {navItems.map(item => (
          <button key={item.id} onClick={() => scrollToSection(item.id)}
            className={`hover:text-blue-500 transition-colors ${activeSection === item.id ? 'text-blue-400' : ''}`}>
            {item.label}
          </button>
        ))}
      </div>

      <div className={`min-h-screen bg-[#020617] text-slate-200 pb-20 font-sans selection:bg-blue-500/30 ${stage !== 'main' ? 'hidden' : ''}`}>

        {/* Navbar */}
        <nav className="fixed top-0 left-0 right-0 z-[100] backdrop-blur-xl border-b border-white/5 py-4 px-6">
          <div className="container mx-auto flex justify-between items-center">
            <div className="flex items-center gap-3 font-bold text-xl tracking-tighter">
              <button onClick={() => scrollToSection('home')} className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full overflow-hidden border border-white/20 shadow-[0_0_15px_rgba(255,255,255,0.2)]">
                  <img src="/logo-9a.webp" alt="Logo" className="w-full h-full object-cover" />
                </div>
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">Class Attractive</span>
              </button>
              <div className="relative ml-1" data-player>
                <button onClick={() => setShowPlayer(p => !p)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 hover:border-blue-500/40 transition-all duration-300">
                  {isIntroPaused
                    ? <span className="text-slate-500 text-xs">🔇</span>
                    : <div className="flex items-end gap-[2px] h-3">{[1,2,3].map(i=><div key={i} className="wave-bar w-[3px] bg-blue-400 rounded-full origin-bottom" style={{height:'100%'}}/>)}</div>}
                  <span className="text-[10px] text-slate-400 font-normal hidden sm:block">{isIntroPaused ? 'Paused' : 'Playing'}</span>
                </button>
                {showPlayer && (
                  <div className="absolute top-full left-0 mt-2 w-64 bg-[#0f172a]/98 backdrop-blur-xl border border-white/10 rounded-2xl p-5 shadow-2xl shadow-black/50 z-50 animate-scaleIn max-sm:fixed max-sm:left-3 max-sm:right-3 max-sm:w-auto max-sm:top-[72px]">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="flex items-end gap-[2px] h-3">{[1,2,3].map(i=><div key={i} className={`w-[3px] rounded-full origin-bottom ${isIntroPaused?'bg-slate-600':'wave-bar bg-blue-400'}`} style={{height:'100%'}}/>)}</div>
                      <p className="text-[11px] text-slate-400 uppercase tracking-widest font-bold">Background Music</p>
                    </div>
                    <button onClick={toggleIntroMusic}
                      className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-black text-sm transition-all duration-300 mb-4 active:scale-95 ${isIntroPaused?'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/30':'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10'}`}>
                      {isIntroPaused ? '▶  Play' : '⏸  Pause'}
                    </button>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[10px] text-slate-500 uppercase tracking-wider">Volume</span>
                      <span className="text-[11px] text-blue-400 font-bold">{Math.round(introVolume * 100)}%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm">🔈</span>
                      <input type="range" min="0" max="1" step="0.05" value={introVolume}
                        onChange={e => handleIntroVolume(parseFloat(e.target.value))}
                        className="flex-1 h-2 rounded-full appearance-none bg-white/10 cursor-pointer accent-blue-500" />
                      <span className="text-sm">🔊</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="hidden md:flex gap-8 items-center">
              {navItems.map(item => (
                <button key={item.id} onClick={() => scrollToSection(item.id)}
                  className={`text-sm transition-all hover:scale-105 relative group ${activeSection === item.id ? 'text-white' : 'text-slate-400 hover:text-white'}`}>
                  {item.label}
                  <span className={`absolute -bottom-1 left-0 h-px bg-blue-500 transition-all duration-300 ${activeSection === item.id ? 'w-full' : 'w-0 group-hover:w-full'}`} />
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

        {/* HOME */}
        <section id="home" className="min-h-screen flex flex-col items-center justify-center container mx-auto px-6 text-center relative overflow-hidden">
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
        </section>

        {/* WALI KELAS */}
        <section id="walikelas" className="container mx-auto px-6 mb-40 pt-20">
          <h2 className="reveal text-2xl md:text-3xl font-bold mb-16 text-center flex items-center justify-center gap-4">
            <span className="h-px w-8 md:w-16 bg-blue-500/50" />Wali Kelas Dari Kelas 7–9<span className="h-px w-8 md:w-16 bg-blue-500/50" />
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {waliKelas.map((wk, i) => (
              <div key={i} className="reveal group p-px rounded-3xl bg-gradient-to-b from-white/10 to-transparent hover:from-blue-500/40 transition-all duration-500">
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

        {/* MEMBER */}
        <section id="member" className="container mx-auto px-6 mb-40 pt-20">

          {/* ── SEARCH BAR ── */}
          <div className="reveal mb-10 max-w-lg mx-auto">
            <div className="relative group">
              {/* icon */}
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none select-none text-base">🔍</span>
              <input
                type="text"
                value={searchQuery}
                onChange={e => handleSearch(e.target.value)}
                placeholder="Cari nama... (psst, coba ketik sesuatu 👀)"
                className="search-input w-full bg-white/[0.04] border border-white/10 rounded-2xl pl-11 pr-11 py-4 text-sm text-white placeholder-slate-600 outline-none transition-all duration-300 hover:border-white/20 focus:border-blue-500/40"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-500 hover:text-white transition-all text-xs">
                  ✕
                </button>
              )}
            </div>

            {/* result info */}
            {searchQuery && (
              <div className="mt-2.5 flex items-center justify-between px-1 animate-fadeUp">
                <p className="text-[11px] text-slate-500">
                  {totalFound > 0
                    ? <><span className="text-blue-400 font-bold">{totalFound}</span> orang ditemukan</>
                    : <span className="text-slate-600 italic">Tidak ada yang cocok 🤔</span>}
                </p>
                <p className="text-[10px] text-slate-700 italic">🥚 ada easter egg tersembunyi...</p>
              </div>
            )}
          </div>

          {/* Tab */}
          <div className="reveal flex justify-center mb-12 gap-2 p-1.5 bg-white/5 mx-auto rounded-full border border-white/10 backdrop-blur-md" style={{width:'fit-content'}}>
            <button onClick={() => setActiveTab('pengurus')}
              className={`flex items-center justify-center gap-1.5 py-2.5 rounded-full text-sm font-bold transition-all duration-300 ${activeTab === 'pengurus' ? 'bg-blue-600 text-white shadow-xl shadow-blue-500/40' : 'text-slate-400 hover:text-white'}`}
              style={{width:'140px'}}>
              Pengurus
              <span className={`text-xs font-normal bg-white/10 px-1.5 py-0.5 rounded-full transition-all duration-200 ${searchQuery ? 'opacity-60' : 'opacity-0'}`} style={{minWidth:'20px',textAlign:'center'}}>
                {filteredPengurus.length}
              </span>
            </button>
            <button onClick={() => setActiveTab('member')}
              className={`flex items-center justify-center gap-1.5 py-2.5 rounded-full text-sm font-bold transition-all duration-300 ${activeTab === 'member' ? 'bg-blue-600 text-white shadow-xl shadow-blue-500/40' : 'text-slate-400 hover:text-white'}`}
              style={{width:'160px'}}>
              Semua Member
              <span className={`text-xs font-normal bg-white/10 px-1.5 py-0.5 rounded-full transition-all duration-200 ${searchQuery ? 'opacity-60' : 'opacity-0'}`} style={{minWidth:'20px',textAlign:'center'}}>
                {filteredMember.length}
              </span>
            </button>
          </div>

          {/* Grid */}
          {displayList.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {displayList.map((item, i) => (
                <div key={i}
                  className="bg-white/5 border border-white/10 p-4 rounded-3xl hover:bg-blue-600/5 hover:border-blue-500/30 transition-all duration-500 group relative overflow-hidden flex flex-col items-center text-center hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-500/10 animate-fadeUp"
                  style={{ animationDelay: `${(i % 8) * 0.04}s` }}>
                  <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500/5 blur-3xl group-hover:bg-blue-500/20 transition-all" />
                  <div className="mb-3 group-hover:scale-110 transition-transform duration-300">
                    <Avatar img={item.img} name={item.name} size="md" />
                  </div>
                  <h4 className="font-bold text-white text-xs md:text-sm leading-tight w-full"
                    style={{ display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden' }}>
                    {item.name}
                  </h4>
                  {item.role && (
                    <p className="text-[10px] md:text-xs text-blue-500 font-black uppercase tracking-wide mt-1 w-full"
                      style={{ display:'-webkit-box', WebkitLineClamp:1, WebkitBoxOrient:'vertical', overflow:'hidden' }}>
                      {item.role}
                    </p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 animate-fadeUp">
              <p className="text-5xl mb-4">🔎</p>
              <p className="text-slate-400 font-bold text-lg mb-1">"{searchQuery}" tidak ditemukan</p>
              <p className="text-slate-600 text-sm">Atau... mungkin ada kata rahasia yang belum kamu coba? 🥚</p>
              <button onClick={() => setSearchQuery('')}
                className="mt-6 px-6 py-2.5 rounded-full border border-white/10 text-slate-400 text-sm hover:border-blue-500/30 hover:text-white transition-all">
                Reset pencarian
              </button>
            </div>
          )}
        </section>

        {/* JADWAL & GALERI */}
        <section className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-6 pt-20">
          <div id="jadwal" className="reveal md:col-span-2 bg-white/[0.02] border border-white/10 rounded-[2.5rem] p-10 backdrop-blur-3xl relative overflow-hidden">
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

          <div id="galeri" onClick={() => setIsGalleryOpen(true)}
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
              <p className="text-blue-400 font-black uppercase tracking-[0.3em] text-[10px] bg-[#020617] px-4 py-2 rounded-full border border-blue-500/30 shadow-2xl group-hover:border-blue-400/60 group-hover:text-blue-300 transition-all duration-300">
                Open Archives →
              </p>
            </div>
          </div>
        </section>

        <footer className="mt-40 py-10 text-center border-t border-white/5">
          <p className="text-[10px] text-slate-600 uppercase tracking-[0.5em]">
            &copy; 2026 Class Attractive • All Rights Reserved
          </p>
        </footer>
      </div>

      {/* Floating Button Kirim Pesan */}
      {stage === 'main' && (
        <button
          onClick={() => setShowForm(f => !f)}
          className="fixed bottom-6 right-6 z-[300] w-14 h-14 rounded-full bg-blue-600 hover:bg-blue-500 text-white shadow-2xl shadow-blue-500/40 flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95"
          style={{ boxShadow: '0 8px 30px rgba(59,130,246,0.5)' }}
          title="Kirim Pesan">
          {showForm ? <span className="text-xl">✕</span> : <span className="text-xl">✉️</span>}
        </button>
      )}

      {/* Form Modal */}
      {showForm && stage === 'main' && (
        <div className="fixed bottom-24 right-6 z-[299] w-[calc(100vw-48px)] max-w-sm animate-eggSlideUp"
          style={{
            background: 'rgba(8,15,30,0.98)',
            borderRadius: '24px',
            border: '1px solid rgba(255,255,255,0.08)',
            boxShadow: '0 30px 60px rgba(0,0,0,0.8)',
          }}>

          {/* Header form */}
          <div className="px-6 pt-6 pb-4 border-b border-white/5">
            <p className="text-white font-black text-base">✉️ Kirim Pesan</p>
            <p className="text-slate-500 text-[11px] mt-0.5">Pesan kamu akan langsung diterima admin</p>
          </div>

          <div className="px-6 py-5 flex flex-col gap-3">
            {/* Nama */}
            <div>
              <label className="text-[10px] text-slate-500 uppercase tracking-wider font-bold mb-1 block">Nama</label>
              <input
                type="text"
                value={formData.nama}
                onChange={e => setFormData(f => ({ ...f, nama: e.target.value }))}
                placeholder="Nama kamu..."
                maxLength={50}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 outline-none focus:border-blue-500/50 transition-all"
              />
            </div>


            {/* Pesan */}
            <div>
              <label className="text-[10px] text-slate-500 uppercase tracking-wider font-bold mb-1 block">Pesan</label>
              <textarea
                value={formData.pesan}
                onChange={e => setFormData(f => ({ ...f, pesan: e.target.value }))}
                placeholder="Tulis pesanmu di sini..."
                maxLength={500}
                rows={3}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 outline-none focus:border-blue-500/50 transition-all resize-none"
              />
              <p className="text-[10px] text-slate-700 text-right mt-0.5">{formData.pesan.length}/500</p>
            </div>

            {/* Upload Foto */}
            <div>
              <label className="text-[10px] text-slate-500 uppercase tracking-wider font-bold mb-1 block">Foto (opsional)</label>
              <label className="flex items-center gap-3 w-full bg-white/5 border border-white/10 hover:border-blue-500/40 rounded-xl px-4 py-2.5 cursor-pointer transition-all group">
                <span className="text-lg">📎</span>
                <span className="text-sm text-slate-500 group-hover:text-slate-300 transition-colors truncate flex-1">
                  {formData.photo ? formData.photo.name : 'Pilih foto...'}
                </span>
                {formData.photo && (
                  <button onClick={e => { e.preventDefault(); setFormData(f => ({ ...f, photo: null })); }}
                    className="text-slate-600 hover:text-red-400 transition-colors text-xs">✕</button>
                )}
                <input type="file" accept="image/*" className="hidden"
                  onChange={e => { if (e.target.files[0]) setFormData(f => ({ ...f, photo: e.target.files[0] })); }} />
              </label>
              {formData.photo && (
                <p className="text-[10px] text-slate-600 mt-1">
                  {(formData.photo.size / 1024 / 1024).toFixed(2)} MB
                </p>
              )}
            </div>

            {/* Status messages */}
            {formStatus === 'success' && (
              <div className="bg-green-500/10 border border-green-500/30 rounded-xl px-4 py-3 text-center animate-fadeUp">
                <p className="text-green-400 text-sm font-bold">✅ Pesan terkirim!</p>
                <p className="text-green-600 text-[11px] mt-0.5">Terima kasih sudah mengirim pesan 💙</p>
              </div>
            )}
            {formStatus === 'error' && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-center animate-fadeUp">
                <p className="text-red-400 text-sm font-bold">❌ Gagal terkirim</p>
                <p className="text-red-600 text-[11px] mt-0.5">Coba lagi beberapa saat</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              onClick={handleFormSubmit}
              disabled={formStatus === 'loading' || formCooldown || !formData.nama.trim()  || !formData.pesan.trim()}
              className="w-full py-3 rounded-xl text-sm font-black text-white transition-all duration-300 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-cyan-500 shadow-lg shadow-blue-500/20">
              {formStatus === 'loading'
                ? '⏳ Mengirim...'
                : formCooldown
                  ? `⏱ Tunggu ${cooldownSecs}s`
                  : '🚀 Kirim Pesan'}
            </button>
          </div>
        </div>
      )}
    </>
  );
};

const App = () => (
  <BrowserRouter>
    <AppInner />
  </BrowserRouter>
);

export default App;