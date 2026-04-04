import React, { useState, useEffect, useRef, useCallback, memo } from 'react';
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
  @keyframes vinylSpin {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
  }
  @keyframes bgPulse {
    0%, 100% { transform: scale(1.05); opacity: 0.6; }
    50%       { transform: scale(1.15); opacity: 0.8; }
  }
  @keyframes lyricFade {
    from { opacity: 0; transform: translateY(8px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes slideUp {
    from { opacity: 0; transform: translateY(60px) scale(0.95); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }
  @keyframes orb1 {
    0%,100% { transform: translate(0,0) scale(1); }
    33%     { transform: translate(40px,-30px) scale(1.2); }
    66%     { transform: translate(-20px,20px) scale(0.9); }
  }
  @keyframes orb2 {
    0%,100% { transform: translate(0,0) scale(1); }
    33%     { transform: translate(-50px,25px) scale(0.8); }
    66%     { transform: translate(30px,-15px) scale(1.1); }
  }
  @keyframes orb3 {
    0%,100% { transform: translate(0,0) scale(1); }
    50%     { transform: translate(20px,40px) scale(1.3); }
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
  .animate-slideUp    { animation: slideUp 0.5s cubic-bezier(.34,1.56,.64,1) forwards; }

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

  .vinyl-spin { animation: vinylSpin 3s linear infinite; }
  .vinyl-spin.paused { animation-play-state: paused; }

  .song-bg-anim { animation: bgPulse 6s ease-in-out infinite; }

  .lyric-line { animation: lyricFade 0.4s ease forwards; }

  .orb-1 { animation: orb1 8s ease-in-out infinite; }
  .orb-2 { animation: orb2 10s ease-in-out infinite; }
  .orb-3 { animation: orb3 7s ease-in-out infinite; }

  .song-card {
    transition: transform 0.3s cubic-bezier(.34,1.56,.64,1), box-shadow 0.3s ease, border-color 0.3s ease;
    will-change: transform;
  }
  .song-card:hover {
    transform: translateY(-2px) scale(1.02);
    box-shadow: 0 12px 40px rgba(59,130,246,0.2);
  }
  .song-card:active { transform: scale(0.98); }

  .progress-bar-track { cursor: pointer; }
  .progress-bar-fill { transition: width 0.1s linear; }

  .lyric-seekable { cursor: pointer; }
  .lyric-seekable:hover { opacity: 0.85 !important; }

  .sp-progress-track {
    height: 4px;
    background: rgba(255,255,255,0.15);
    border-radius: 4px;
    cursor: pointer;
    position: relative;
    transition: height 0.15s ease;
    margin-bottom: 6px;
  }
  .sp-progress-track:hover { height: 6px; }
  .sp-progress-track:hover .sp-progress-thumb { opacity: 1 !important; }

  .sp-vol-track {
    height: 4px;
    background: rgba(255,255,255,0.15);
    border-radius: 4px;
    cursor: pointer;
    position: relative;
    transition: height 0.15s ease;
    flex: 1;
  }
  .sp-vol-track:hover { height: 6px; }
  .sp-vol-track:hover .sp-vol-thumb { opacity: 1 !important; }

  html { scroll-behavior: smooth; }
`;

// ─── ImageKit Base URL ────────────────────────────────────────────────────────
const IK = 'https://ik.imagekit.io/hnxqf8xcm/website%20kelas/tr:f-webp';

// ─── Playlist Data ───────────────────────────────────────────────────────────
const playlist = [
  {
    id: 1,
    title: 'Nanti Kita Seperti Ini',
    artist: 'Batas Senja',
    cover: `${IK}/nantikitasepertiini.webp`,
    video: 'https://res.cloudinary.com/drnbef65p/video/upload/v1775212526/batas-senja-nanti-kita-seperti-ini-official-music-video-1080-ytshorts.savetube.me_xpmxxr.mp4',
    audio: 'https://res.cloudinary.com/drnbef65p/video/upload/v1775202566/lirik_lagu_Nanti_kita_seperti_ini_batas_senja_motiongraphic_tugas_mp3cut.net_aspw5s.mp3',
    color1: '#324B3A',
    color2: '#1A241E',
    accent: '#A3B18A',
    lyrics: '',
  },
  {
    id: 2,
    title: 'Jatuh Suka',
    artist: 'Tulus',
    cover: `${IK}/tulus.webp`,
    video: 'https://res.cloudinary.com/drnbef65p/video/upload/v1775285917/TULUS_-_Jatuh_Suka_Official_Music_Video_-_Tulus_1080p_h264_jaxbg5.mp4',
    audio: 'https://res.cloudinary.com/drnbef65p/video/upload/v1775257017/Jatuh_Suka_xqr94e.mp4',
    color1: '#1B262C',
    color2: '#0F172A',
    accent: '#3282B8',
    lyrics: '',
  },
  {
    id: 3,
    title: 'Risk It All',
    artist: 'Bruno Mars',
    cover: `${IK}/riskitall.webp`,
    video: 'https://res.cloudinary.com/drnbef65p/video/upload/v1775290497/Bruno_Mars_-_Risk_It_All_Official_Music_Video_-_Bruno_Mars_1080p_h264_vg9cae.mp4',
    audio: 'https://res.cloudinary.com/drnbef65p/video/upload/v1775288743/Bruno_Mars_-_Risk_It_All_twmsv9.mp4',
    color1: '#1a0d0a',
    color2: '#000000',
    accent: '#f59e0b',
    lyrics: '',
  },
  {
    id: 4,
    title: 'Save Your Tears (with Ariana Grande) (Remix)',
    artist: 'The Weeknd feat. Ariana Grande',
    cover: `${IK}/saveyourtears.webp`,
    video: 'https://res.cloudinary.com/drnbef65p/video/upload/v1775292597/The_Weeknd_Ariana_Grande_-_Save_Your_Tears_Remix_Official_Video_-_TheWeekndVEVO_1080p_h264_1_ge4k4j.mp4',
    audio: 'https://res.cloudinary.com/drnbef65p/video/upload/v1775291009/The_Weeknd_Ariana_Grande_-_Save_Your_Tears_Remix_Lyrics_xn0wik.mp4',
    color1: '#0b0014',
    color2: '#020617',
    accent: '#a855f7',
    lyrics: '',
  },
  {
    id: 5,
    title: "Firasat",
    artist: 'Marcell',
    cover: `${IK}/firasat.webp`,
    video: 'https://res.cloudinary.com/drnbef65p/video/upload/v1775294711/Marcell-Firasat_Live_at_Music_Everywhere_-_MusicEverywhereNet_720p_h264_fvj99k.mp4',
    audio: 'https://res.cloudinary.com/drnbef65p/video/upload/v1775293667/Firasat_wqar4e.mp4',
    color1: '#0f172a',
    color2: '#020617',
    accent: '#94a3b8',
    lyrics: '',
  },
  {
    id: 6,
    title: 'The Man Who Can t Be Moved',
    artist: 'The Script',
    cover: `${IK}/theman.webp`,
    video: 'https://res.cloudinary.com/drnbef65p/video/upload/v1775295560/The_Script_-_The_Man_Who_Can_t_Be_Moved_Official_Video_-_TheScriptVEVO_1080p_h264_uu9d4w.mp4',
    audio: 'https://res.cloudinary.com/drnbef65p/video/upload/v1775295091/The_Script_-_The_Man_Who_Can_t_Be_Moved_Official_Video_dxkvpx.mp4',
    color1: '#0f172a',
    color2: '#020617',
    accent: '#64748b',
    lyrics: '',
  },
  {
    id: 7,
    title: 'DREAM TEAM',
    artist: 'NCT DREAM',
    cover: `${IK}/dreamteam.webp`,
    video: 'https://res.cloudinary.com/drnbef65p/video/upload/v1775296719/NCT_DREAM_DREAM_TEAM_Official_Audio_-_NCT_DREAM_1080p_h264_bxxqav.mp4',
    audio: 'https://res.cloudinary.com/drnbef65p/video/upload/v1775296713/NCT_DREAM_DREAM_TEAM_Official_Audio_euy2fc.mp4',
    color1: '#051205',
    color2: '#000000',
    accent: '#c6ff00',
    lyrics: '',
  },
  // {
  //   id: 8,
  //   title: '',
  //   artist: '',
  //   cover: `${IK}/`,
  //   video: '',
  //   audio: '',
  //   color1: '',
  //   color2: '',
  //   accent: '',
  //   lyrics: '',
  // },
];

const easterEggs = [
  {
    triggers: ['widyanti', 'bu widya', 'widya', 'wali kelas 7', 'walas 7'],
    name: 'A. Widyanti',
    photo: `${IK}/eggfoto3.webp`,
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
    photo: `${IK}/eggfoto4.webp`,
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
    photo: `${IK}/eggfoto5.webp`,
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
    photo: `${IK}/eggfoto1.webp`,
    audio: '/eggsound1.mp3',
    message: 'Halooo 🌙....',
    fullMessage: `Halooo 🌙....

Engga nyangka ya (sementara) itu sudah habis. Kisah kita udah berakhir dengan bahagia. Aku engga nyangka pada akhir masa SMP akan ada kenangan kayak gini. Jujur aku bahagia dan bersyukur tuhan ngasih 1 hadiah kelulusan yang indah banget. Dulu aku berpikir (knp tuhan ngasih perasaan ini ke aku? knp tuhan datengin kamu di hidup aku?) tapi seiring waktu aku nemuin jawaban dan dengan jawaban itu aku mulai memperbaiki diri sambil nyoba perlahan move on dari kamu.

kamu tau jalan nya berat banget aku naik turun terus tapi akhirnya aku engga berhasil engga tau kenapa engga bisa tapi perlahan sudut pandang ku mulai berubah yang awal nya aku kek kesel kamu dateng di hidup ku sekarang beda aku bersyukur kamu dateng di hidup aku, walau perasaan ini belum hilang tapi kalo ngeliat kamu sekarang kayak udh bahagia banget padahal cuma liat kamu dari jauh.

Be happy iwan 🌙.`,
    emoji: '🌙',
    color: 'from-indigo-600/30 to-violet-600/30',
    border: 'border-indigo-500/50',
    longMessage: true,
  },
  {
    triggers: ['3 pilar', 'tiga pilar', '3pilar', 'wali kelas'],
    name: 'Tiga Pilar Kelas 9A 🌟',
    photo: `${IK}/bu-widya.webp`,
    audio: '/eggsound2.mp3',
    message: 'Terima kasih kepada tiga pilar yang selalu menjaga, membimbing, dan menyayangi kita semua. Kalian adalah bagian terbaik dari perjalanan kelas 9A. 🙏💙',
    multiPhoto: [
      { photo: `${IK}/bu-widya.webp`,  label: 'Bu Widyanti' },
      { photo: `${IK}/bu-endang.webp`, label: 'Bu Endang' },
      { photo: `${IK}/bu-ana.webp`,    label: 'Bu Ana' },
    ],
    emoji: '🌟',
    color: 'from-blue-600/30 to-violet-600/30',
    border: 'border-blue-500/50',
    longMessage: true,
  },
  {
    triggers: ['attractive', '9a', 'class attractive', '9 a'],
    name: 'Class Attractive 9A',
    photo: `${IK}/logo-9a.webp`,
    audio: '/lagu-intro.mp3',
    message: '🎓 Kelas paling legendary! Class Attractive forever & ever 💙🔥',
    emoji: '🎓',
    color: 'from-blue-600/30 to-cyan-600/30',
    border: 'border-blue-500/50',
    longMessage: true,
  },
];

const waliKelas = [
  { grade: "Wali Kelas 7", name: "A. Widyanti",               img: `${IK}/bu-widya.webp`,  quote: "Guru Bahasa Inggris" },
  { grade: "Wali Kelas 8", name: "Ana Eka Rizky",              img: `${IK}/bu-ana.webp`,    quote: "Guru Prakarya." },
  { grade: "Wali Kelas 9", name: "Endang Sustyaningsih S. P.", img: `${IK}/bu-endang.webp`, quote: "Guru Bahasa Inggris." },
];

const pengurus = [
  { role: "Ketua Kelas",       name: "Nabila Amalia H.",     img: `${IK}/absen21.webp` },
  { role: "Wakil Ketua Kelas", name: "Taskya Ayu K.",         img: `${IK}/absen31.webp` },
  { role: "Sekretaris 1",      name: "Olivia Agustina T.",    img: `${IK}/absen26.webp` },
  { role: "Sekretaris 2",      name: "Margareta Anggani P.D", img: `${IK}/absen16.webp` },
  { role: "Bendahara 1",       name: "Talitha Rana I.",       img: `${IK}/absen30.webp` },
  { role: "Bendahara 2",       name: "Devano Fernando B.",    img: `${IK}/absen9.webp`  },
];

const semuaMember = [
  { name: "Agung Abiy R.",          img: `${IK}/absen1.webp`  },
  { name: "Airina Zamira Z.",        img: `${IK}/absen2.webp`  },
  { name: "Al-Vina Darajatul I.",   img: `${IK}/absen3.webp`  },
  { name: "Anisa Qonita N.",        img: `${IK}/absen4.webp`  },
  { name: "Aqila Yasmin R.",        img: `${IK}/absen5.webp`  },
  { name: "Bintang Mestika W.",     img: `${IK}/absen6.webp`  },
  { name: "Charisma Maharani",      img: `${IK}/absen7.webp`  },
  { name: "Christian Putra K.P.",   img: `${IK}/absen8.webp`  },
  { name: "Fadhil Rizky F.",        img: `${IK}/absen10.webp` },
  { name: "Faizah Eka M.",          img: `${IK}/absen11.webp` },
  { name: "Faizah Febiana M.",      img: `${IK}/absen12.webp` },
  { name: "Ghaisani Batrisya A.",   img: `${IK}/absen13.webp` },
  { name: "Inneke Alya K.",         img: `${IK}/absen14.webp` },
  { name: "Levina Fitria S.",       img: `${IK}/absen15.webp` },
  { name: "M. Affan Putra H.",      img: `${IK}/absen17.webp` },
  { name: "M. Asyam Hadyan P.",     img: `${IK}/absen18.webp` },
  { name: "M. Helmy Radithya",      img: `${IK}/absen19.webp` },
  { name: "M. Ichwan Rahmatulloh",  img: `${IK}/absen20.webp` },
  { name: "M. Reval Fairus A.",     img: `${IK}/absen22.webp` },
  { name: "Nabila Azkadina",        img: `${IK}/absen23.webp` },
  { name: "Nafa Wahyu P. H.",       img: `${IK}/rickysukadia.webp` },
  { name: "Nafis Aulia Nadjwa P.",  img: `${IK}/absen25.webp` },
  { name: "Ricky Moreno A.R.",      img: `${IK}/absen27.webp` },
  { name: "Rohadatul Aisy",         img: `${IK}/absen28.webp` },
  { name: "Safira Cahya M.",        img: `${IK}/absen29.webp` },
  { name: "Yohanes Adrina B.S.",    img: `${IK}/absen32.webp` },
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
  { src: `${IK}/kenangan7.webp`,  caption: "Odl Ke Jogja Kelas 7 🚌📸" },
  { src: `${IK}/kenangan2.webp`,  caption: "Buka Bersama Di Rumah Bendahara Kelas 7 🌙🍴" },
  { src: `${IK}/kenangan4.webp`,  caption: "Maulid Nabi Kelas 7 🕌✨" },
  { src: `${IK}/kenangan8.webp`,  caption: "Hari Pahlawan Kelas 7 🔥🦅" },
  { src: `${IK}/kenangan15.webp`, caption: "Upacara Bendera Kelas 7 🫡🇮🇩" },
  { src: `${IK}/kenangan3.webp`,  caption: "Buka Bersama Di Sekolah Kelas 8 🏫🍴" },
  { src: `${IK}/kenangan1.webp`,  caption: "Odl Ke Jogja Kelas 8 🚌📸" },
  { src: `${IK}/kenangan6.webp`,  caption: "Maulid Nabi Kelas 8 🕌🙏" },
  { src: `${IK}/kenangan9.webp`,  caption: "Hari Pahlawan Kelas 8 🔥🦅" },
  { src: `${IK}/kenangan10.webp`, caption: "Mancing Bersama Kelas 8 🎣🐟" },
  { src: `${IK}/kenangan11.webp`, caption: "Upacara Bendera Kelas 8 🫡🇮🇩" },
  { src: `${IK}/kenangan5.webp`,  caption: "Ulang Tahun Bu Ana 🎂" },
  { src: `${IK}/kenangan12.webp`, caption: "Upacara Bendera Kelas 9 🫡🇮🇩" },
  { src: `${IK}/kenangan13.webp`, caption: "Maulid Nabi Kelas 9 🕌🤲" },
  { src: `${IK}/kenangan14.webp`, caption: "Foto Ijazah Sebelum Kelulusan 📸👨‍🎓👩‍🎓" },
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
  { label: 'Playlist',   id: 'playlist'  },
];

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

// ─── Parse LRC ───────────────────────────────────────────────────────────────
const parseLRC = (lrcString) => {
  if (!lrcString) return [];
  const lines = lrcString.split('\n');
  const result = [];
  const timeReg = /\[(\d{2}):(\d{2})\.(\d{2,3})\]/g;
  for (const line of lines) {
    const text = line.replace(/\[.*?\]/g, '').trim();
    if (!text) continue;
    let match;
    timeReg.lastIndex = 0;
    while ((match = timeReg.exec(line)) !== null) {
      const mins = parseInt(match[1]);
      const secs = parseInt(match[2]);
      const ms   = parseInt(match[3].padEnd(3, '0'));
      result.push({ time: mins * 60 + secs + ms / 1000, text });
    }
  }
  return result.sort((a, b) => a.time - b.time);
};

// ─── SongPlayer ──────────────────────────────────────────────────────────────
const SongPlayer = memo(({ song, onBack, onClose, openSong }) => {
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration]       = useState(0);
  const [isPlaying, setIsPlaying]     = useState(false);
  const [activeLyric, setActiveLyric] = useState(0);
  const [vidReady, setVidReady]       = useState(false);
  const [lyrics, setLyrics]           = useState([]);
  const [lyricStatus, setLyricStatus] = useState('loading');
  const [volume, setVolume]           = useState(0.45);
  const [isMuted, setIsMuted]         = useState(false);
  const [prevVolume, setPrevVolume]   = useState(0.45);
  const [isShuffle, setIsShuffle]     = useState(false);
  const [isRepeat, setIsRepeat]       = useState(false);

  const audioRef    = useRef(null);
  const lyricRef    = useRef(null);
  const intervalRef = useRef(null);
  const shuffleRef  = useRef(false);
  const repeatRef   = useRef(false);
  const videoRef    = useRef(null);
  const iframeRef   = useRef(null);

  useEffect(() => { shuffleRef.current = isShuffle; }, [isShuffle]);
  useEffect(() => { repeatRef.current  = isRepeat;  }, [isRepeat]);

  // ── Interval timer ───────────────────────────────────────────────────────
  const startTimer = useCallback(() => {
    if (intervalRef.current) return;
    intervalRef.current = setInterval(() => {
      const audio = audioRef.current;
      if (!audio) return;
      setCurrentTime(audio.currentTime);
      if (audio.duration && isFinite(audio.duration)) {
        setDuration(audio.duration);
      }
    }, 100);
  }, []);

  const stopTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  // ── Audio lifecycle ──────────────────────────────────────────────────────
  useEffect(() => {
    stopTimer();

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
      audioRef.current.load();
      audioRef.current = null;
    }

    setCurrentTime(0);
    setDuration(0);
    setIsPlaying(false);
    setActiveLyric(0);
    setVidReady(false);
    setLyrics([]);
    setLyricStatus('loading');

    if (!song.audio) return;

    const audio = new Audio(song.audio);
    audio.preload = 'auto';
    audio.volume  = isMuted ? 0 : volume;
    audioRef.current = audio;

    const onMeta = () => {
      if (isFinite(audio.duration) && audio.duration > 0) {
        setDuration(audio.duration);
      }
    };

    const onPlay = () => {
      setIsPlaying(true);
      startTimer();
    };

    const onPause = () => {
      setIsPlaying(false);
    };

    const onEnded = () => {
      stopTimer();
      setIsPlaying(false);
      setCurrentTime(0);
      if (repeatRef.current) {
        audio.currentTime = 0;
        audio.play().catch(() => {});
      } else if (shuffleRef.current) {
        const others = playlist.filter(s => s.id !== song.id);
        openSong(others[Math.floor(Math.random() * others.length)]);
      } else {
        const idx = playlist.findIndex(s => s.id === song.id);
        openSong(playlist[(idx + 1) % playlist.length]);
      }
    };

    audio.addEventListener('loadedmetadata', onMeta);
    audio.addEventListener('durationchange',  onMeta);
    audio.addEventListener('play',            onPlay);
    audio.addEventListener('pause',           onPause);
    audio.addEventListener('ended',           onEnded);

    audio.play().catch(() => {});

    return () => {
      stopTimer();
      audio.removeEventListener('loadedmetadata', onMeta);
      audio.removeEventListener('durationchange',  onMeta);
      audio.removeEventListener('play',            onPlay);
      audio.removeEventListener('pause',           onPause);
      audio.removeEventListener('ended',           onEnded);
      audio.pause();
      audio.src = '';
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [song.id]);

  // ── Volume / mute ────────────────────────────────────────────────────────
  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = isMuted ? 0 : volume;
  }, [volume, isMuted]);

  // ── Sync background video with isPlaying state ───────────────────────────
  useEffect(() => {
    if (videoRef.current) {
      if (isPlaying) videoRef.current.play().catch(() => {});
      else           videoRef.current.pause();
    }
    if (iframeRef.current) {
      const cmd = isPlaying ? 'playVideo' : 'pauseVideo';
      try {
        iframeRef.current.contentWindow.postMessage(
          JSON.stringify({ event: 'command', func: cmd, args: [] }),
          '*'
        );
      } catch (_) {}
    }
  }, [isPlaying]);

  // ── Play/Pause handler ───────────────────────────────────────────────────
  const handlePlayPause = useCallback(() => {
    if (!audioRef.current) return;
    if (audioRef.current.paused) audioRef.current.play().catch(() => {});
    else audioRef.current.pause();
  }, []);

  // ── Spacebar play/pause (like Spotify) ───────────────────────────────────
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Jangan trigger jika user sedang fokus di input / textarea
      const tag = document.activeElement?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || document.activeElement?.isContentEditable) return;
      if (e.code === 'Space') {
        e.preventDefault(); // Cegah scroll halaman
        handlePlayPause();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlePlayPause]);

  const handleMuteToggle = useCallback(() => {
    if (isMuted) {
      setIsMuted(false);
      setVolume(prevVolume > 0 ? prevVolume : 0.5);
    } else {
      setPrevVolume(volume);
      setIsMuted(true);
    }
  }, [isMuted, volume, prevVolume]);

  const handleVolumeChange = useCallback((val) => {
    const v = parseFloat(val);
    setVolume(v);
    if (v > 0 && isMuted) setIsMuted(false);
    if (v === 0) setIsMuted(true);
  }, [isMuted]);

  // ── Lyric fetch ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (song.lyrics && song.lyrics.trim()) {
      const parsed = parseLRC(song.lyrics);
      if (parsed.length > 0) { setLyrics(parsed); setLyricStatus('ok'); }
      else {
        const lines = song.lyrics.split('\n').filter(l => l.trim()).map((text, i) => ({ time: i * 4, text }));
        setLyrics(lines); setLyricStatus('plain');
      }
      return;
    }
    const url = `https://lrclib.net/api/get?artist_name=${encodeURIComponent(song.artist)}&track_name=${encodeURIComponent(song.title)}&album_name=`;
    fetch(url)
      .then(r => { if (!r.ok) throw new Error(); return r.json(); })
      .then(data => {
        if (data.syncedLyrics) {
          setLyrics(parseLRC(data.syncedLyrics));
          setLyricStatus('ok');
          if (data.duration && !song.audio) setDuration(Math.ceil(data.duration));
        } else if (data.plainLyrics) {
          const lines = data.plainLyrics.split('\n').filter(l => l.trim()).map((text, i) => ({ time: i * 4, text }));
          setLyrics(lines); setLyricStatus('plain');
        } else setLyricStatus('notfound');
      })
      .catch(() => setLyricStatus('notfound'));
  }, [song.id]);

  // ── Active lyric ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (!lyrics.length) return;
    let idx = 0;
    for (let i = 0; i < lyrics.length; i++) {
      if (lyrics[i].time <= currentTime) idx = i;
      else break;
    }
    setActiveLyric(idx);
  }, [currentTime, lyrics]);

  useEffect(() => {
    if (!lyricRef.current) return;
    const el = lyricRef.current.querySelector('.lyric-active');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, [activeLyric]);

  // ── Helpers ──────────────────────────────────────────────────────────────
  const formatTime = (s) => {
    const ss = Math.floor(Math.max(0, s));
    return `${Math.floor(ss / 60)}:${String(ss % 60).padStart(2, '0')}`;
  };

  const handleSeek = useCallback((e) => {
    const r   = e.currentTarget.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (e.clientX - r.left) / r.width));
    const t   = pct * (audioRef.current?.duration || duration);
    if (audioRef.current) audioRef.current.currentTime = t;
    setCurrentTime(t);
  }, [duration]);

  const handleLyricSeek = useCallback((time) => {
    if (!audioRef.current || lyricStatus !== 'ok') return;
    const t = Math.max(0, time - 0.3);
    audioRef.current.currentTime = t;
    setCurrentTime(t);
  }, [lyricStatus]);

  const prevSong = () => {
    if (audioRef.current && audioRef.current.currentTime > 3) {
      audioRef.current.currentTime = 0;
      setCurrentTime(0);
      return;
    }
    const idx = playlist.findIndex(s => s.id === song.id);
    openSong(shuffleRef.current
      ? playlist.filter(s => s.id !== song.id)[Math.floor(Math.random() * (playlist.length - 1))]
      : playlist[(idx - 1 + playlist.length) % playlist.length]
    );
  };

  const nextSong = () => {
    const idx = playlist.findIndex(s => s.id === song.id);
    openSong(shuffleRef.current
      ? playlist.filter(s => s.id !== song.id)[Math.floor(Math.random() * (playlist.length - 1))]
      : playlist[(idx + 1) % playlist.length]
    );
  };

  // ── Volume Icon ───────────────────────────────────────────────────────────
  const VolumeIcon = () => {
    const s = { width: 18, height: 18, fill: 'rgba(255,255,255,0.6)', display: 'block' };
    if (isMuted || volume === 0) return (
      <svg viewBox="0 0 24 24" style={s}>
        <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
      </svg>
    );
    if (volume < 0.5) return (
      <svg viewBox="0 0 24 24" style={s}>
        <path d="M18.5 12c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM5 9v6h4l5 5V4L9 9H5z"/>
      </svg>
    );
    return (
      <svg viewBox="0 0 24 24" style={s}>
        <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
      </svg>
    );
  };

  const isMP4 = song.video && (song.video.includes('/') || song.video.startsWith('http'));
  const isYT  = song.video && !isMP4;
  const dur   = duration > 0 ? duration : 1;
  const progressPct = Math.min((currentTime / dur) * 100, 100);

  const renderVideoBg = () => {
    if (isYT) return (
      <iframe
        key={song.video}
        ref={iframeRef}
        src={`https://www.youtube.com/embed/${song.video}?autoplay=1&mute=1&loop=1&playlist=${song.video}&controls=0&showinfo=0&rel=0&modestbranding=1&iv_load_policy=3&disablekb=1&fs=0&enablejsapi=1`}
        allow="autoplay; encrypted-media"
        onLoad={() => setVidReady(true)}
        className="absolute"
        style={{
          width: '200%', height: '200%', top: '-50%', left: '-50%',
          border: 'none', pointerEvents: 'none',
          opacity: vidReady ? 0.38 : 0, transition: 'opacity 1.4s ease',
        }}
        title="bg"
      />
    );
    if (isMP4) return (
      <video
        key={song.video}
        ref={videoRef}
        src={song.video}
        autoPlay
        muted
        loop
        playsInline
        onCanPlay={() => setVidReady(true)}
        className="absolute"
        style={{
          width: '100%', height: '100%', top: 0, left: 0,
          objectFit: 'cover', pointerEvents: 'none',
          opacity: vidReady ? 0.38 : 0, transition: 'opacity 1.4s ease',
        }}
      />
    );
    return (
      <>
        <div className="absolute w-72 h-72 rounded-full blur-[90px] pointer-events-none orb-1" style={{ background: song.color1 + '80', top: '15%', left: '20%' }} />
        <div className="absolute w-80 h-80 rounded-full blur-[110px] pointer-events-none orb-2" style={{ background: song.accent + '40', bottom: '20%', right: '15%' }} />
        <div className="absolute w-56 h-56 rounded-full blur-[70px] pointer-events-none orb-3" style={{ background: song.color2 + '60', top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }} />
      </>
    );
  };

  return (
    <div className="fixed inset-0 z-[160] flex flex-col animate-fadeIn overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0" style={{
          background: `radial-gradient(ellipse at 40% 30%, ${song.color1}dd 0%, transparent 55%),
                       radial-gradient(ellipse at 70% 70%, ${song.color2}bb 0%, transparent 55%),
                       #020617`,
        }} />
        {renderVideoBg()}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(2,6,23,0.6) 0%, rgba(2,6,23,0.3) 35%, rgba(2,6,23,0.65) 75%, rgba(2,6,23,0.97) 100%)' }} />
        <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse at 50% 50%, ${song.accent}12 0%, transparent 70%)` }} />
      </div>

      {/* Top bar */}
      <div className="relative z-10 flex items-center justify-between px-5 pt-5 pb-2 flex-shrink-0">
        <button onClick={onBack} className="flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors backdrop-blur-sm bg-black/20 px-4 py-2 rounded-full border border-white/10">
          ← Kembali
        </button>
        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/35">🎵 Now Playing</span>
        <button onClick={onClose} className="w-9 h-9 rounded-full bg-white/10 hover:bg-red-500/20 border border-white/10 flex items-center justify-center text-white/70 hover:text-white transition-all text-base">✕</button>
      </div>

      {/* Cover + Title */}
      <div className="relative z-10 flex flex-col items-center pt-3 pb-1 flex-shrink-0 px-6">
        <div className="relative mb-3">
          <div
            className={`w-28 h-28 md:w-36 md:h-36 rounded-full overflow-hidden border-4 shadow-2xl vinyl-spin${isPlaying ? '' : ' paused'}`}
            style={{ borderColor: song.accent + '70', boxShadow: `0 0 50px ${song.accent}50, 0 20px 60px rgba(0,0,0,0.9)` }}
          >
            <img src={song.cover} alt={song.title} className="w-full h-full object-cover" onError={e => { e.target.style.background = song.color1; }} />
          </div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-[#020617] border-2 border-white/10 z-10" />
        </div>
        <h2 className="text-lg md:text-2xl font-black text-white tracking-tight drop-shadow-2xl text-center leading-tight">{song.title}</h2>
        <p className="text-sm font-semibold mt-0.5 drop-shadow-lg" style={{ color: song.accent }}>{song.artist}</p>
        <div className="mt-1.5 flex items-center gap-2 flex-wrap justify-center">
          {lyricStatus === 'loading'  && <span className="text-[10px] text-white/30 flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-white/30 animate-pulse inline-block" />Mengambil lirik...</span>}
          {lyricStatus === 'ok'       && <span className="text-[10px] text-green-400/60">{song.lyrics?.trim() ? '✓ Synced · Manual' : '✓ Synced · LRCLIB'}</span>}
          {lyricStatus === 'plain'    && <span className="text-[10px] text-yellow-400/50">~ Plain · LRCLIB</span>}
          {lyricStatus === 'notfound' && <span className="text-[10px] text-white/25">Lirik tidak tersedia</span>}
          {!song.audio                && <span className="text-[10px] text-orange-400/50">⚠ Audio belum diisi</span>}
          {lyricStatus === 'ok'       && <span className="text-[9px] text-white/15 italic">· klik lirik untuk seek</span>}
        </div>
      </div>

      {/* Lyrics */}
      <div ref={lyricRef} className="relative z-10 flex-1 overflow-y-auto px-6 py-2" style={{ scrollbarWidth: 'none' }}>
        <div className="flex flex-col items-center gap-3 py-4 max-w-sm mx-auto">
          {lyricStatus === 'loading' && (
            <div className="flex flex-col items-center gap-3 pt-8">
              {[80,55,70,45,65].map((w, i) => (
                <div key={i} className="h-3 rounded-full bg-white/10 animate-pulse" style={{ width: w + '%', animationDelay: (i * 0.1) + 's' }} />
              ))}
            </div>
          )}
          {lyricStatus === 'notfound' && (
            <div className="text-center pt-8">
              <p className="text-4xl mb-3">🎵</p>
              <p className="text-white/30 text-sm">Lirik tidak ditemukan</p>
              <p className="text-white/20 text-xs mt-1">Nikmati musiknya saja ya 🎧</p>
            </div>
          )}
          {(lyricStatus === 'ok' || lyricStatus === 'plain') && lyrics.map((line, i) => (
            <p
              key={i}
              onClick={() => handleLyricSeek(line.time)}
              className={`text-center leading-relaxed transition-all duration-300 select-none ${lyricStatus === 'ok' ? 'lyric-seekable' : ''} ${
                i === activeLyric ? 'lyric-active text-sm md:text-base font-black lyric-line'
                : i < activeLyric ? 'text-xs text-white/20'
                : 'text-xs text-white/40'
              }`}
              style={i === activeLyric ? { color: 'white', textShadow: `0 0 25px ${song.accent}bb, 0 2px 8px rgba(0,0,0,0.8)`, transform: 'scale(1.05)' } : {}}
            >{line.text}</p>
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className="relative z-10 px-6 pb-8 pt-2 flex-shrink-0" style={{ background: 'linear-gradient(to top, rgba(2,6,23,0.98) 0%, transparent 100%)' }}>

        {/* Progress bar */}
        <div className="mb-4 group/prog">
          <div className="sp-progress-track" onClick={handleSeek}>
            <div
              className="h-full rounded-full relative"
              style={{ width: progressPct + '%', background: `linear-gradient(90deg, ${song.accent}, white)`, transition: 'width 0.08s linear' }}
            >
              <div className="sp-progress-thumb absolute right-0 top-1/2 w-3 h-3 rounded-full bg-white"
                style={{ transform: 'translate(50%, -50%)', opacity: 0, transition: 'opacity 0.15s', boxShadow: '0 1px 6px rgba(0,0,0,0.5)', pointerEvents: 'none' }} />
            </div>
          </div>
          <div className="flex justify-between text-[10px] text-white/30 mt-1.5" style={{ fontVariantNumeric: 'tabular-nums' }}>
            <span>{formatTime(currentTime)}</span>
            <span>{duration > 0 ? formatTime(duration) : '--:--'}</span>
          </div>
        </div>

        {/* Volume */}
        <div className="flex items-center gap-3 mb-5">
          <button onClick={handleMuteToggle} title={isMuted ? 'Unmute' : 'Mute'}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'opacity 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.opacity = '0.65'}
            onMouseLeave={e => e.currentTarget.style.opacity = '1'}>
            <VolumeIcon />
          </button>
          <div className="sp-vol-track group/vol" style={{ position: 'relative' }}>
            <div className="h-full rounded-full pointer-events-none" style={{ width: (isMuted ? 0 : volume * 100) + '%', background: `linear-gradient(90deg, ${song.accent}99, ${song.accent})`, transition: 'width 0.1s ease' }} />
            <div className="sp-vol-thumb absolute top-1/2 w-3 h-3 rounded-full bg-white pointer-events-none"
              style={{ left: (isMuted ? 0 : volume * 100) + '%', transform: 'translate(-50%, -50%)', opacity: 0, transition: 'opacity 0.15s', boxShadow: '0 1px 6px rgba(0,0,0,0.5)' }} />
            <input type="range" min="0" max="1" step="0.01" value={isMuted ? 0 : volume}
              onChange={e => handleVolumeChange(parseFloat(e.target.value))}
              style={{ position: 'absolute', inset: '-4px 0', width: '100%', opacity: 0, cursor: 'pointer', margin: 0 }} />
          </div>
          <span className="text-[10px] w-8 text-right flex-shrink-0" style={{ color: song.accent + 'aa', fontVariantNumeric: 'tabular-nums' }}>
            {isMuted ? '0%' : Math.round(volume * 100) + '%'}
          </span>
        </div>

        {/* Playback controls */}
        <div className="flex items-center justify-center gap-5 mb-2">

          {/* Shuffle */}
          <button onClick={() => { setIsShuffle(v => !v); setIsRepeat(false); }} title="Shuffle"
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 8, borderRadius: '50%', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'transform 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.12)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}>
            <svg viewBox="0 0 24 24" style={{ width: 20, height: 20, fill: isShuffle ? song.accent : 'rgba(255,255,255,0.4)' }}>
              <path d="M10.59 9.17L5.41 4 4 5.41l5.17 5.17 1.42-1.41zM14.5 4l2.04 2.04L4 18.59 5.41 20 17.96 7.46 20 9.5V4h-5.5zm.33 9.41l-1.41 1.41 3.13 3.13L14.5 20H20v-5.5l-2.04 2.04-3.13-3.13z"/>
            </svg>
            {isShuffle && <span style={{ position: 'absolute', bottom: 2, left: '50%', transform: 'translateX(-50%)', width: 4, height: 4, borderRadius: '50%', background: song.accent }} />}
          </button>

          {/* Prev */}
          <button onClick={prevSong} title="Previous"
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 8, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'transform 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.12)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}>
            <svg viewBox="0 0 24 24" style={{ width: 26, height: 26, fill: 'rgba(255,255,255,0.7)' }}>
              <path d="M6 6h2v12H6zm3.5 6 8.5 6V6z"/>
            </svg>
          </button>

          {/* Play/Pause */}
          <button onClick={handlePlayPause}
            style={{ width: 64, height: 64, borderRadius: '50%', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', background: `linear-gradient(135deg, ${song.accent}ee, ${song.color1})`, boxShadow: `0 8px 35px ${song.accent}55`, transition: 'transform 0.25s cubic-bezier(.34,1.56,.64,1), box-shadow 0.25s' }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.07)'; e.currentTarget.style.boxShadow = `0 12px 45px ${song.accent}70`; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)';    e.currentTarget.style.boxShadow = `0 8px 35px ${song.accent}55`; }}
            onMouseDown={e => e.currentTarget.style.transform = 'scale(0.95)'}
            onMouseUp={e =>   e.currentTarget.style.transform = 'scale(1.07)'}>
            {isPlaying
              ? <svg viewBox="0 0 24 24" style={{ width: 26, height: 26, fill: 'white' }}><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
              : <svg viewBox="0 0 24 24" style={{ width: 26, height: 26, fill: 'white', marginLeft: 3 }}><path d="M8 5v14l11-7z"/></svg>
            }
          </button>

          {/* Next */}
          <button onClick={nextSong} title="Next"
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 8, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'transform 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.12)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}>
            <svg viewBox="0 0 24 24" style={{ width: 26, height: 26, fill: 'rgba(255,255,255,0.7)' }}>
              <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/>
            </svg>
          </button>

          {/* Repeat */}
          <button onClick={() => { setIsRepeat(v => !v); setIsShuffle(false); }} title="Repeat"
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 8, borderRadius: '50%', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'transform 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.12)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}>
            <svg viewBox="0 0 24 24" style={{ width: 20, height: 20, fill: isRepeat ? song.accent : 'rgba(255,255,255,0.4)' }}>
              <path d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4z"/>
            </svg>
            {isRepeat && <span style={{ position: 'absolute', bottom: 2, left: '50%', transform: 'translateX(-50%)', width: 4, height: 4, borderRadius: '50%', background: song.accent }} />}
          </button>
        </div>

        {(isShuffle || isRepeat) && (
          <p className="text-center text-[10px] mt-2 animate-fadeUp" style={{ color: song.accent + 'aa' }}>
            {isShuffle ? '🔀 Shuffle aktif — lagu berikutnya acak' : '🔂 Repeat aktif — lagu ini akan diulang'}
          </p>
        )}
      </div>
    </div>
  );
});

// ─── Playlist Modal ──────────────────────────────────────────────────────────
const PlaylistModal = memo(({ onClose, introAudioRef }) => {
  const [activeSong, setActiveSong] = useState(null);

  useEffect(() => {
    if (introAudioRef?.current) introAudioRef.current.pause();
  }, []);

  const openSong  = useCallback((song) => setActiveSong(song), []);
  const closeSong = useCallback(() => setActiveSong(null), []);

  useEffect(() => {
    const h = (e) => {
      if (e.key === 'Escape') { if (activeSong) closeSong(); else onClose(); }
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [activeSong, closeSong, onClose]);

  if (activeSong) {
    return <SongPlayer song={activeSong} onBack={closeSong} onClose={onClose} openSong={openSong} />;
  }

  return (
    <div className="fixed inset-0 z-[155] bg-[#020617]/98 backdrop-blur-2xl flex flex-col overflow-y-auto animate-fadeIn">
      <div className="sticky top-0 z-10 bg-[#020617]/90 backdrop-blur-xl border-b border-white/10 px-6 py-4 flex items-center justify-between animate-slideDown flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-purple-500/30 to-blue-600/30 border border-purple-500/30 flex items-center justify-center text-lg flex-shrink-0">🎵</div>
          <div>
            <h2 className="text-lg font-black tracking-tight text-white leading-tight">Daftar Lagu</h2>
            <p className="text-[10px] text-slate-500">{playlist.length} lagu • Class Attractive</p>
          </div>
          <div className="flex items-end gap-[3px] h-4 ml-2">
            {[1,2,3,4,5].map(i => (
              <div key={i} className="wave-bar w-1 bg-purple-400 rounded-full origin-bottom" style={{ height: '100%' }} />
            ))}
          </div>
        </div>
        <button onClick={onClose}
          className="w-9 h-9 rounded-full bg-white/10 hover:bg-red-500/20 border border-white/10 flex items-center justify-center text-white transition-all hover:scale-110 text-lg">✕</button>
      </div>

      <div className="flex-1 p-6">
        <div className="max-w-2xl mx-auto space-y-2">
          {playlist.map((song, i) => (
            <div key={song.id} onClick={() => openSong(song)}
              className="song-card group flex items-center gap-4 p-4 rounded-2xl border border-white/8 bg-white/[0.03] hover:bg-white/[0.07] cursor-pointer"
              style={{ animation: 'scaleIn 0.4s ease forwards', animationDelay: (i * 0.07) + 's', opacity: 0 }}>
              <div className="w-6 text-center flex-shrink-0">
                <span className="text-slate-600 text-xs font-bold group-hover:hidden block">{i + 1}</span>
                <span className="text-white text-base hidden group-hover:block">▶</span>
              </div>
              <div className="w-14 h-14 rounded-2xl overflow-hidden flex-shrink-0 border border-white/10 shadow-lg"
                style={{ boxShadow: `0 4px 20px ${song.accent}30` }}>
                <img src={song.cover} alt={song.title} loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  onError={e => { e.target.style.background = song.color1; e.target.src = ''; }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-bold text-sm truncate">{song.title}</p>
                <p className="text-slate-500 text-xs truncate mt-0.5">{song.artist}</p>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <div className="hidden group-hover:flex items-end gap-[2px] h-4">
                  {[1,2,3,4].map(j => (
                    <div key={j} className="wave-bar w-[3px] rounded-full origin-bottom" style={{ height: '100%', background: song.accent }} />
                  ))}
                </div>
                <div className="w-1 h-10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ background: `linear-gradient(to bottom, ${song.accent}, transparent)` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});

// ─── Easter Egg Modal ────────────────────────────────────────────────────────
const EasterEggModal = ({ egg, onClose, introAudioRef }) => {
  const audioRef = useRef(null);

  useEffect(() => {
    spawnConfetti();
    if (introAudioRef && introAudioRef.current) introAudioRef.current.pause();
    if (egg.audio) {
      audioRef.current = new Audio(egg.audio);
      audioRef.current.volume = 0.6;
      audioRef.current.play().catch(() => {});
    }
    const stopEggAudio = () => { if (audioRef.current) { audioRef.current.pause(); } };
    const onVisibility = () => { if (document.hidden) stopEggAudio(); };
    document.addEventListener('visibilitychange', onVisibility);
    window.addEventListener('pagehide', stopEggAudio);
    if (!egg.longMessage) {
      const t = setTimeout(onClose, 8000);
      return () => {
        clearTimeout(t);
        if (audioRef.current) { audioRef.current.pause(); audioRef.current = null; }
        document.removeEventListener('visibilitychange', onVisibility);
        window.removeEventListener('pagehide', stopEggAudio);
      };
    }
    return () => {
      if (audioRef.current) { audioRef.current.pause(); audioRef.current = null; }
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('pagehide', stopEggAudio);
    };
  }, []);

  const displayMessage = egg.fullMessage || egg.message;
  const fallbackHTML = '<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:#1e293b;font-size:1.5rem">' + egg.emoji + '</div>';
  const closeGradientClass = "w-full py-3 rounded-2xl text-sm font-black text-white transition-all duration-300 active:scale-95 bg-gradient-to-r " + egg.color.replace('/30','');
  const msgBgClass = "rounded-2xl p-4 bg-gradient-to-br " + egg.color + " border " + egg.border;

  return (
    <div className="fixed inset-0 z-[500] flex items-center justify-center p-4 md:p-6 animate-fadeIn" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        className="relative w-full animate-eggSlideUp flex flex-col"
        onClick={e => e.stopPropagation()}
        style={{
          background: 'rgba(8,15,30,0.97)', borderRadius: '28px',
          border: '1px solid rgba(255,255,255,0.06)',
          boxShadow: '0 30px 60px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.04)',
          maxWidth: '480px', maxHeight: '88vh',
        }}
      >
        <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/8 hover:bg-white/15 flex items-center justify-center text-slate-500 hover:text-white transition-all z-10 text-sm">✕</button>
        <div className="flex-shrink-0 px-7 pt-7 pb-4">
          <div className="flex items-center gap-2 mb-5">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-400 bg-blue-500/10 border border-blue-500/20 px-3 py-1 rounded-full">🥚 Easter Egg</span>
          </div>
          {egg.multiPhoto ? (
            <div>
              <div className="flex justify-center gap-3 mb-4">
                {egg.multiPhoto.map((p, i) => (
                  <div key={i} className="flex flex-col items-center gap-1.5">
                    <div className={`w-20 h-20 rounded-2xl overflow-hidden border-2 ${egg.border} flex-shrink-0`} style={{ boxShadow: '0 8px 24px rgba(0,0,0,0.6)' }}>
                      <img src={p.photo} alt={p.label} className="w-full h-full object-cover" onError={e => { e.target.parentNode.innerHTML = fallbackHTML; }} />
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
            <div className="flex items-center gap-5">
              <div className={`relative w-20 h-20 rounded-2xl overflow-hidden border-2 ${egg.border} flex-shrink-0`} style={{ boxShadow: '0 8px 24px rgba(0,0,0,0.6)' }}>
                <img src={egg.photo} alt={egg.name} className="w-full h-full object-cover" onError={e => { e.target.parentNode.innerHTML = fallbackHTML; }} />
              </div>
              <div>
                <div className="text-3xl animate-eggBounce mb-1">{egg.emoji}</div>
                <p className="text-white font-black text-base leading-tight">{egg.name}</p>
              </div>
            </div>
          )}
        </div>
        <div className="flex-1 overflow-y-auto px-7 pb-2" style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(99,102,241,0.3) transparent' }}>
          <div className={msgBgClass}>
            <p className="text-slate-100 text-sm leading-relaxed font-medium" style={{ whiteSpace: 'pre-line' }}>{displayMessage}</p>
          </div>
        </div>
        <div className="flex-shrink-0 px-7 pb-6 pt-4">
          <button onClick={onClose} className={closeGradientClass} style={{ opacity: 0.9 }}>Tutup 💌</button>
        </div>
      </div>
    </div>
  );
};

// ─── Shared Components ───────────────────────────────────────────────────────
const Particles = memo(() => {
  const particles = useRef(
    Array.from({ length: 18 }, (_, i) => ({
      id: i, size: Math.random() * 6 + 2,
      x: Math.random() * 100, y: Math.random() * 100,
      delay: Math.random() * 4, duration: 3 + Math.random() * 4,
      color: i % 3 === 0 ? '#3b82f6' : i % 3 === 1 ? '#8b5cf6' : '#06b6d4',
    }))
  ).current;
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map(p => (
        <div key={p.id} className="particle" style={{
          width: p.size, height: p.size, left: p.x + '%', top: p.y + '%',
          background: p.color, opacity: 0.3, animationName: 'float',
          animationDuration: p.duration + 's', animationDelay: p.delay + 's',
          animationTimingFunction: 'ease-in-out', animationIterationCount: 'infinite',
        }} />
      ))}
    </div>
  );
});

const MusicBars = () => (
  <div className="flex items-end gap-0.5 h-4">
    {[1,2,3,4,5].map(i => (
      <div key={i} className="wave-bar w-1 bg-blue-400 rounded-full origin-bottom" style={{ height: '100%' }} />
    ))}
  </div>
);

const Avatar = memo(({ img, name, size = "md" }) => {
  const dim = size === "lg" ? "w-24 h-24" : "w-14 h-14";
  if (img) return (
    <div className={dim + " rounded-full overflow-hidden border-2 border-white/10 ring-4 ring-blue-500/10 mx-auto flex-shrink-0"}>
      <img src={img} alt={name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition duration-500"
        loading="lazy"
        onError={e => { e.target.style.display = 'none'; e.target.parentNode.innerHTML = '👤'; }} />
    </div>
  );
  return (
    <div className={dim + " rounded-full bg-slate-800 border-2 border-white/10 ring-4 ring-blue-500/10 mx-auto flex-shrink-0 flex items-center justify-center"}>👤</div>
  );
});

// ─── Splash Screen ───────────────────────────────────────────────────────────
const SplashScreen = ({ onEnter }) => (
  <div className="fixed inset-0 z-[999] bg-[#020617] flex flex-col items-center justify-center overflow-hidden animate-fadeIn">
    <Particles />
    <div className="relative z-10 flex flex-col items-center text-center px-6">
      <div className="relative mb-8">
        <div className="absolute inset-0 rounded-full border border-blue-500/20 animate-spin-slow scale-150" />
        <div className="absolute inset-0 rounded-full border border-cyan-500/10 animate-spin-slow scale-[1.8]" style={{ animationDirection: 'reverse', animationDuration: '14s' }} />
        <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-blue-500/40 animate-glowPulse">
          <img src={`${IK}/logo-9a.webp`} alt="Logo" className="w-full h-full object-cover" />
        </div>
      </div>
      <p className="text-[11px] text-blue-400 font-bold tracking-[0.5em] uppercase mb-3 animate-fadeUp" style={{ animationDelay: '0.2s', opacity: 0 }}>Welcome to</p>
      <h1 className="text-5xl md:text-6xl font-black text-shimmer tracking-tighter mb-2 animate-fadeUp" style={{ animationDelay: '0.35s', opacity: 0 }}>Class Attractive</h1>
      <p className="text-slate-500 text-sm italic mb-12 animate-fadeUp" style={{ animationDelay: '0.5s', opacity: 0 }}>Memories Stay Forever.</p>
      <button
        onClick={onEnter}
        className="ripple-btn animate-fadeUp group relative px-10 py-4 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-black tracking-widest text-sm uppercase transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/40"
        style={{ animationDelay: '0.7s', opacity: 0 }}
      >
        <span className="relative z-10 flex items-center gap-2">✨ Masuk</span>
      </button>
      <p className="mt-6 text-[10px] text-slate-600 animate-textBlink animate-fadeUp" style={{ animationDelay: '1s', opacity: 0 }}>Klik untuk mulai</p>
    </div>
  </div>
);

// ─── Loading Screen ──────────────────────────────────────────────────────────
const LoadingScreen = ({ onDone }) => {
  const [phase, setPhase] = useState(0);
  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 400);
    const t2 = setTimeout(() => setPhase(2), 2400);
    const t3 = setTimeout(() => onDone(), 3100);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);
  return (
    <div className={"fixed inset-0 z-[998] bg-[#020617] flex flex-col items-center justify-center transition-opacity duration-700 " + (phase === 2 ? 'opacity-0 pointer-events-none' : 'opacity-100')}>
      <div className="relative flex items-center justify-center mb-8">
        <div className="absolute w-32 h-32 rounded-full border border-blue-500/30 animate-spin-slow" />
        <div className="absolute w-44 h-44 rounded-full border border-blue-500/10 animate-spin-slow" style={{ animationDirection: 'reverse', animationDuration: '12s' }} />
        <div className="absolute w-24 h-24 rounded-full bg-blue-500/20" style={{ animation: 'pulse-ring 1.5s ease-out infinite' }} />
        <div className={"w-20 h-20 rounded-full overflow-hidden border-2 border-blue-500/50 animate-glowPulse transition-all duration-700 " + (phase >= 0 ? 'animate-scaleIn' : 'opacity-0')}>
          <img src={`${IK}/logo-9a.webp`} alt="Logo" className="w-full h-full object-cover" />
        </div>
      </div>
      <div className={"text-center transition-all duration-700 " + (phase >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4')}>
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

// ─── Main App ────────────────────────────────────────────────────────────────
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
  const [formStatus, setFormStatus]       = useState('idle');
  const [formCooldown, setFormCooldown]   = useState(false);
  const [cooldownSecs, setCooldownSecs]   = useState(0);
  const [isPlaylistOpen, setIsPlaylistOpen] = useState(false);

  const introAudioRef  = useRef(new Audio('/lagu-intro.mp3'));
  const galeriAudioRef = useRef(new Audio('/lagu.mp3'));
  const scrollingTo    = useRef(false);
  const navigate       = useNavigate();
  const location       = useLocation();

  const checkEasterEgg = useCallback((query) => {
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
  }, [eggCooldown]);

  const handleSearch = useCallback((val) => {
    setSearchQuery(val);
    checkEasterEgg(val);
  }, [checkEasterEgg]);

  const IMGBB_KEY = '3b5d47875a882db1a573d355c26c9d67';
  const GAS_URL   = 'https://script.google.com/macros/s/AKfycbypB_nYFo-Z1zRhORDXkrctzAhDBzsp0RifP3gwHljgtKNVAs4_xZzITsCVJ3J1PknLBQ/exec';

  const handleFormSubmit = async () => {
    if (formCooldown) return;
    if (!formData.nama.trim() || !formData.pesan.trim()) return;
    setFormStatus('loading');
    try {
      let photoUrl = '', photoName = '';
      if (formData.photo) {
        const imgForm = new FormData();
        imgForm.append('image', formData.photo);
        const imgRes  = await fetch('https://api.imgbb.com/1/upload?key=' + IMGBB_KEY, { method: 'POST', body: imgForm });
        const imgData = await imgRes.json();
        if (imgData.success) { photoUrl = imgData.data.url; photoName = formData.photo.name; }
      }
      await fetch(GAS_URL, { method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nama: formData.nama, pesan: formData.pesan, photoUrl, photoName }) });
      setFormStatus('success');
      setFormData({ nama: '', pesan: '', photo: null });
      setFormCooldown(true); setCooldownSecs(60);
      const interval = setInterval(() => {
        setCooldownSecs(s => { if (s <= 1) { clearInterval(interval); setFormCooldown(false); return 0; } return s - 1; });
      }, 1000);
      setTimeout(() => setFormStatus('idle'), 4000);
    } catch {
      setFormStatus('error');
      setTimeout(() => setFormStatus('idle'), 3000);
    }
  };

  const filterBy = useCallback((list) => {
    if (!searchQuery.trim()) return list;
    return list.filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [searchQuery]);

  const filteredPengurus = filterBy(pengurus);
  const filteredMember   = filterBy(semuaMember);
  const displayList      = activeTab === 'pengurus' ? filteredPengurus : filteredMember;
  const totalFound       = filteredPengurus.length + filteredMember.length;

  const handleEnter = () => {
    setStage('loading');
    const a = introAudioRef.current;
    a.volume = introVolume; a.loop = true; a.play().catch(() => {});
  };
  const handleLoadingDone = () => { setStage('main'); navigate('/'); };

  const toggleIntroMusic = () => {
    const a = introAudioRef.current;
    if (a.paused) { a.play().catch(() => {}); setIsIntroPaused(false); }
    else          { a.pause(); setIsIntroPaused(true); }
  };
  const handleIntroVolume = v => { setIntroVolume(v); introAudioRef.current.volume = v; };

  const handlePlaylistOpen = useCallback(() => {
    setIsPlaylistOpen(true);
    introAudioRef.current.pause();
  }, []);

  const handlePlaylistClose = useCallback(() => {
    setIsPlaylistOpen(false);
    if (!isIntroPaused) introAudioRef.current.play().catch(() => {});
  }, [isIntroPaused]);

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

  useEffect(() => {
    const onVisibility = () => {
      if (document.hidden) {
        introAudioRef.current.pause();
        galeriAudioRef.current.pause();
      } else {
        if (!isIntroPaused && stage === 'main' && !isGalleryOpen && !isPlaylistOpen)
          introAudioRef.current.play().catch(() => {});
        if (isGalleryOpen && !isMuted)
          galeriAudioRef.current.play().catch(() => {});
      }
    };
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, [isIntroPaused, stage, isGalleryOpen, isMuted, isPlaylistOpen]);

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
    }, { threshold: 0.3 });
    const timer = setTimeout(() => {
      sections.forEach(s => { const el = document.getElementById(s.id); if (el) observer.observe(el); });
    }, 100);
    return () => { clearTimeout(timer); observer.disconnect(); };
  }, [stage]);

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

  const scrollToSection = useCallback((id) => {
    setIsMenuOpen(false);
    if (id === 'playlist') {
      handlePlaylistOpen();
      return;
    }
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
  }, [handlePlaylistOpen]);

  useEffect(() => {
    if (stage !== 'main') return;
    const path = location.pathname;
    if (path === '/playlist') {
      navigate('/', { replace: true });
      setIsPlaylistOpen(true);
      introAudioRef.current.pause();
      return;
    }
    const found = sections.find(s => s.path === path);
    if (found && found.id !== 'home') {
      setTimeout(() => { const el = document.getElementById(found.id); if (el) el.scrollIntoView({ behavior: 'smooth' }); }, 200);
    }
  }, [stage]);

  useEffect(() => {
    document.body.style.overflow =
      (stage !== 'main' || isGalleryOpen || lightboxIndex !== null || !!activeEgg || isPlaylistOpen) ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [stage, isGalleryOpen, lightboxIndex, activeEgg, isPlaylistOpen]);

  const prevPhoto = useCallback(() => setLightboxIndex(i => (i - 1 + galeri.length) % galeri.length), []);
  const nextPhoto = useCallback(() => setLightboxIndex(i => (i + 1) % galeri.length), []);

  useEffect(() => {
    const h = e => {
      if (lightboxIndex === null) return;
      if (e.key === 'ArrowLeft') prevPhoto();
      if (e.key === 'ArrowRight') nextPhoto();
      if (e.key === 'Escape') setLightboxIndex(null);
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [lightboxIndex, prevPhoto, nextPhoto]);

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

      {activeEgg && (
        <EasterEggModal
          egg={activeEgg}
          onClose={() => {
            setActiveEgg(null);
            if (!isIntroPaused) introAudioRef.current.play().catch(() => {});
          }}
          introAudioRef={introAudioRef}
        />
      )}

      {isPlaylistOpen && (
        <PlaylistModal onClose={handlePlaylistClose} introAudioRef={introAudioRef} />
      )}

      {lightboxIndex !== null && (
        <div className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 animate-fadeIn" onClick={() => setLightboxIndex(null)}>
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

      {isGalleryOpen && (
        <div className="fixed inset-0 z-[150] bg-[#020617]/98 backdrop-blur-2xl flex flex-col overflow-y-auto animate-fadeIn">
          <div className="sticky top-0 z-10 bg-[#020617]/90 backdrop-blur-xl border-b border-white/10 px-6 py-4 flex items-center justify-between animate-slideDown">
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-black tracking-tight text-white">📸 Galeri Kenangan</h2>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 cursor-pointer" onClick={() => setIsMuted(m => !m)}>
                {isMuted
                  ? <span className="text-xs text-slate-400 font-bold">🔇 Muted</span>
                  : <><MusicBars /><span className="text-[10px] text-blue-400 font-bold tracking-wide ml-1">Now Playing</span></>}
              </div>
            </div>
            <button onClick={() => setIsGalleryOpen(false)} className="w-9 h-9 rounded-full bg-white/10 hover:bg-red-500/20 border border-white/10 flex items-center justify-center text-white transition-all hover:scale-110 text-lg">✕</button>
          </div>
          <div className="flex-1 p-6">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
              {galeri.map((foto, i) => (
                <div key={i} onClick={() => setLightboxIndex(i)}
                  className="gallery-card group relative aspect-square rounded-2xl overflow-hidden border border-white/10 cursor-pointer hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-500/20"
                  style={{ animation: 'scaleIn 0.5s ease forwards', animationDelay: (i * 0.05) + 's', opacity: 0 }}>
                  <img src={foto.src} alt={foto.caption} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-start justify-end p-3">
                    {foto.caption && <p className="text-white text-xs font-semibold leading-tight">{foto.caption}</p>}
                  </div>
                  <div className="absolute top-2 left-2 w-6 h-6 rounded-full bg-black/50 flex items-center justify-center text-[10px] text-white font-bold opacity-0 group-hover:opacity-100 transition-opacity">{i + 1}</div>
                  <div className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-sm border border-white/10">🔍</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className={"fixed inset-0 z-[90] bg-[#020617]/98 backdrop-blur-2xl transition-all duration-500 md:hidden flex flex-col items-center justify-center gap-6 text-2xl font-black " + (isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none')}>
        {navItems.map(item => (
          <button key={item.id} onClick={() => scrollToSection(item.id)}
            className={"hover:text-blue-500 transition-colors " + (activeSection === item.id ? 'text-blue-400' : '')}>
            {item.label}
          </button>
        ))}
      </div>

      <div className={"min-h-screen bg-[#020617] text-slate-200 pb-20 font-sans selection:bg-blue-500/30 " + (stage !== 'main' ? 'hidden' : '')}>

        <nav className="fixed top-0 left-0 right-0 z-[100] backdrop-blur-xl border-b border-white/5 py-4 px-6">
          <div className="container mx-auto flex justify-between items-center">
            <div className="flex items-center gap-3 font-bold text-xl tracking-tighter">
              <button onClick={() => scrollToSection('home')} className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full overflow-hidden border border-white/20 shadow-[0_0_15px_rgba(255,255,255,0.2)]">
                  <img src={`${IK}/logo-9a.webp`} alt="Logo" className="w-full h-full object-cover" />
                </div>
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">Class Attractive</span>
              </button>
              <div className="relative ml-1" data-player>
                <button onClick={() => setShowPlayer(p => !p)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 hover:border-blue-500/40 transition-all duration-300">
                  {isIntroPaused
                    ? <span className="text-slate-500 text-xs">🔇</span>
                    : <div className="flex items-end gap-[2px] h-3">{[1,2,3].map(i => <div key={i} className="wave-bar w-[3px] bg-blue-400 rounded-full origin-bottom" style={{ height: '100%' }} />)}</div>}
                  <span className="text-[10px] text-slate-400 font-normal hidden sm:block">{isIntroPaused ? 'Paused' : 'Playing'}</span>
                </button>
                {showPlayer && (
                  <div className="absolute top-full left-0 mt-2 w-64 bg-[#0f172a]/98 backdrop-blur-xl border border-white/10 rounded-2xl p-5 shadow-2xl shadow-black/50 z-50 animate-scaleIn max-sm:fixed max-sm:left-3 max-sm:right-3 max-sm:w-auto max-sm:top-[72px]">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="flex items-end gap-[2px] h-3">
                        {[1,2,3].map(i => (
                          <div key={i} className={"w-[3px] rounded-full origin-bottom " + (isIntroPaused ? 'bg-slate-600' : 'wave-bar bg-blue-400')} style={{ height: '100%' }} />
                        ))}
                      </div>
                      <p className="text-[11px] text-slate-400 uppercase tracking-widest font-bold">Background Music</p>
                    </div>
                    <button onClick={toggleIntroMusic}
                      className={"w-full flex items-center justify-center gap-2 py-3 rounded-xl font-black text-sm transition-all duration-300 mb-4 active:scale-95 " + (isIntroPaused ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/30' : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10')}>
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
            <div className="hidden md:flex gap-6 items-center">
              {navItems.map(item => (
                <button key={item.id} onClick={() => scrollToSection(item.id)}
                  className={"text-sm transition-all hover:scale-105 relative group " + (activeSection === item.id ? 'text-white' : 'text-slate-400 hover:text-white')}>
                  {item.label}
                  <span className={"absolute -bottom-1 left-0 h-px bg-blue-500 transition-all duration-300 " + (activeSection === item.id ? 'w-full' : 'w-0 group-hover:w-full')} />
                </button>
              ))}
            </div>
            <button className="md:hidden flex flex-col gap-1.5 z-[110]" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              <div className={"w-6 h-0.5 bg-white transition-all duration-300 " + (isMenuOpen ? 'rotate-45 translate-y-2' : '')} />
              <div className={"w-6 h-0.5 bg-white transition-all duration-300 " + (isMenuOpen ? 'opacity-0' : '')} />
              <div className={"w-6 h-0.5 bg-white transition-all duration-300 " + (isMenuOpen ? '-rotate-45 -translate-y-2' : '')} />
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
          <div className="reveal mb-10 max-w-lg mx-auto">
            <div className="relative group">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none select-none text-base">🔍</span>
              <input type="text" value={searchQuery} onChange={e => handleSearch(e.target.value)}
                placeholder="Cari nama... (psst, coba ketik sesuatu 👀)"
                className="search-input w-full bg-white/[0.04] border border-white/10 rounded-2xl pl-11 pr-11 py-4 text-sm text-white placeholder-slate-600 outline-none transition-all duration-300 hover:border-white/20 focus:border-blue-500/40" />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-500 hover:text-white transition-all text-xs">✕</button>
              )}
            </div>
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
          <div className="reveal flex justify-center mb-12 gap-2 p-1.5 bg-white/5 mx-auto rounded-full border border-white/10 backdrop-blur-md" style={{ width: 'fit-content' }}>
            <button onClick={() => setActiveTab('pengurus')}
              className={"flex items-center justify-center gap-1.5 py-2.5 rounded-full text-sm font-bold transition-all duration-300 " + (activeTab === 'pengurus' ? 'bg-blue-600 text-white shadow-xl shadow-blue-500/40' : 'text-slate-400 hover:text-white')}
              style={{ width: '140px' }}>
              Pengurus
              <span className={"text-xs font-normal bg-white/10 px-1.5 py-0.5 rounded-full transition-all duration-200 " + (searchQuery ? 'opacity-60' : 'opacity-0')} style={{ minWidth: '20px', textAlign: 'center' }}>
                {filteredPengurus.length}
              </span>
            </button>
            <button onClick={() => setActiveTab('member')}
              className={"flex items-center justify-center gap-1.5 py-2.5 rounded-full text-sm font-bold transition-all duration-300 " + (activeTab === 'member' ? 'bg-blue-600 text-white shadow-xl shadow-blue-500/40' : 'text-slate-400 hover:text-white')}
              style={{ width: '160px' }}>
              Semua Member
              <span className={"text-xs font-normal bg-white/10 px-1.5 py-0.5 rounded-full transition-all duration-200 " + (searchQuery ? 'opacity-60' : 'opacity-0')} style={{ minWidth: '20px', textAlign: 'center' }}>
                {filteredMember.length}
              </span>
            </button>
          </div>
          {displayList.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {displayList.map((item, i) => (
                <div key={i}
                  className="bg-white/5 border border-white/10 p-4 rounded-3xl hover:bg-blue-600/5 hover:border-blue-500/30 transition-all duration-500 group relative overflow-hidden flex flex-col items-center text-center hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-500/10 animate-fadeUp"
                  style={{ animationDelay: ((i % 8) * 0.04) + 's' }}>
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

        {/* JADWAL & GALERI & PLAYLIST */}
        <section className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-6 pt-20">
          <div id="jadwal" className="reveal md:col-span-2 bg-white/[0.02] border border-white/10 rounded-[2.5rem] p-10 backdrop-blur-3xl relative overflow-hidden">
            <div className="absolute -top-24 -left-24 w-48 h-48 bg-blue-600/10 blur-[100px]" />
            <h3 className="text-3xl font-black mb-10 flex items-center gap-4 text-white">📅 <span className="tracking-tighter">Jadwal Mingguan</span></h3>
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

          <div className="flex flex-col gap-6">
            <div id="galeri" onClick={() => setIsGalleryOpen(true)}
              className="reveal bg-white/[0.02] border border-white/10 rounded-[2.5rem] p-8 overflow-hidden relative group cursor-pointer hover:border-blue-500/40 transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl hover:shadow-blue-500/10 flex-1">
              <h3 className="text-2xl font-black mb-5 text-white tracking-tighter">📸 Galeri</h3>
              <div className="grid grid-cols-2 gap-2 transition-all duration-700 group-hover:scale-105">
                {galeri.slice(0, 4).map((foto, i) => (
                  <div key={i} className="h-20 rounded-xl overflow-hidden border border-white/10">
                    <img src={foto.src} alt={foto.caption} loading="lazy" className="w-full h-full object-cover opacity-40 group-hover:opacity-70 transition-all duration-500 group-hover:scale-110" />
                  </div>
                ))}
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-[#020617]/40 to-transparent flex items-end justify-center p-8">
                <p className="text-blue-400 font-black uppercase tracking-[0.3em] text-[10px] bg-[#020617] px-4 py-2 rounded-full border border-blue-500/30 shadow-2xl group-hover:border-blue-400/60 group-hover:text-blue-300 transition-all duration-300">
                  Open Archives →
                </p>
              </div>
            </div>

            <div
              id="playlist"
              onClick={handlePlaylistOpen}
              className="reveal bg-white/[0.02] border border-white/10 rounded-[2.5rem] p-8 overflow-hidden relative group cursor-pointer hover:border-purple-500/40 transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl hover:shadow-purple-500/10"
              style={{ minHeight: '180px' }}
            >
              <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full blur-[60px] pointer-events-none transition-all duration-700 group-hover:w-48 group-hover:h-48"
                style={{ background: 'rgba(139,92,246,0.25)' }} />
              <div className="absolute -bottom-6 -left-6 w-24 h-24 rounded-full blur-[50px] pointer-events-none"
                style={{ background: 'rgba(59,130,246,0.2)' }} />
              <div className="relative z-10">
                <h3 className="text-2xl font-black mb-3 text-white tracking-tighter">🎵 Playlist</h3>
                <div className="space-y-2 mb-4">
                  {playlist.slice(0, 3).map((song, i) => (
                    <div key={song.id} className="flex items-center gap-2.5"
                      style={{ animation: 'fadeUp 0.5s ease forwards', animationDelay: (i * 0.1) + 's', opacity: 0 }}>
                      <div className="w-7 h-7 rounded-lg overflow-hidden flex-shrink-0 border border-white/10">
                        <img src={song.cover} alt={song.title} loading="lazy" className="w-full h-full object-cover opacity-60 group-hover:opacity-90 transition-opacity" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs text-white/70 truncate font-medium">{song.title}</p>
                        <p className="text-[10px] text-white/30 truncate">{song.artist}</p>
                      </div>
                      <div className="w-1 h-5 rounded-full flex-shrink-0 opacity-0 group-hover:opacity-60 transition-opacity"
                        style={{ background: song.accent }} />
                    </div>
                  ))}
                  <p className="text-[10px] text-white/25 pl-9">+{playlist.length - 3} lagu lainnya...</p>
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-[#020617]/80 via-transparent to-transparent flex items-end justify-center pb-5">
                <p className="text-purple-400 font-black uppercase tracking-[0.3em] text-[10px] bg-[#020617] px-4 py-2 rounded-full border border-purple-500/30 shadow-2xl group-hover:border-purple-400/60 group-hover:text-purple-300 transition-all duration-300">
                  Open Playlist →
                </p>
              </div>
            </div>
          </div>
        </section>

        <footer className="mt-20 py-10 text-center border-t border-white/5">
          <p className="text-[10px] text-slate-600 uppercase tracking-[0.5em]">
            &copy; 2026 Class Attractive • All Rights Reserved
          </p>
        </footer>
      </div>

      {stage === 'main' && (
        <button
          onClick={() => setShowForm(f => !f)}
          className="fixed bottom-6 right-6 z-[300] w-14 h-14 rounded-full bg-blue-600 hover:bg-blue-500 text-white shadow-2xl shadow-blue-500/40 flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95"
          style={{ boxShadow: '0 8px 30px rgba(59,130,246,0.5)' }}
          title="Kirim Pesan"
        >
          {showForm ? <span className="text-xl">✕</span> : <span className="text-xl">✉️</span>}
        </button>
      )}

      {showForm && stage === 'main' && (
        <div className="fixed bottom-20 right-3 left-3 md:left-auto md:right-6 md:w-80 z-[299] animate-eggSlideUp flex flex-col"
          style={{
            background: 'rgba(8,15,30,0.98)', borderRadius: '24px',
            border: '1px solid rgba(255,255,255,0.08)',
            boxShadow: '0 30px 60px rgba(0,0,0,0.8)', maxHeight: '70vh',
          }}>
          <div className="px-6 pt-6 pb-4 border-b border-white/5 flex-shrink-0">
            <p className="text-white font-black text-base">✉️ Kirim Pesan</p>
            <p className="text-slate-500 text-[11px] mt-0.5">Pesan kamu akan langsung diterima admin</p>
          </div>
          <div className="px-6 py-5 flex flex-col gap-3 overflow-y-auto" style={{ scrollbarWidth: 'none' }}>
            <div>
              <label className="text-[10px] text-slate-500 uppercase tracking-wider font-bold mb-1 block">Nama</label>
              <input type="text" value={formData.nama} onChange={e => setFormData(f => ({ ...f, nama: e.target.value }))}
                placeholder="Nama kamu..." maxLength={50}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 outline-none focus:border-blue-500/50 transition-all" />
            </div>
            <div>
              <label className="text-[10px] text-slate-500 uppercase tracking-wider font-bold mb-1 block">Pesan</label>
              <textarea value={formData.pesan} onChange={e => setFormData(f => ({ ...f, pesan: e.target.value }))}
                placeholder="Tulis pesanmu di sini..." maxLength={500} rows={3}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 outline-none focus:border-blue-500/50 transition-all resize-none" />
              <p className="text-[10px] text-slate-700 text-right mt-0.5">{formData.pesan.length}/500</p>
            </div>
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
            </div>
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
            <button onClick={handleFormSubmit}
              disabled={formStatus === 'loading' || formCooldown || !formData.nama.trim() || !formData.pesan.trim()}
              className="w-full py-3 rounded-xl text-sm font-black text-white transition-all duration-300 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-cyan-500 shadow-lg shadow-blue-500/20">
              {formStatus === 'loading' ? '⏳ Mengirim...' : formCooldown ? '⏱ Tunggu ' + cooldownSecs + 's' : '🚀 Kirim Pesan'}
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