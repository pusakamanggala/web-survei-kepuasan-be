-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Waktu pembuatan: 18 Apr 2023 pada 20.06
-- Versi server: 10.6.12-MariaDB
-- Versi PHP: 8.1.16

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

-- --------------------------------------------------------

--
-- Struktur dari tabel `admin`
--

CREATE TABLE `admin` (
  `id_admin` varchar(20) NOT NULL,
  `nama` varchar(50) NOT NULL,
  `password` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `alumni_session`
--

CREATE TABLE `alumni_session` (
  `id_alumni_session` varchar(30) NOT NULL,
  `id_mahasiswa` varchar(20) NOT NULL,
  `created_at` bigint(20) NOT NULL,
  `expired_at` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `dosen`
--

CREATE TABLE `dosen` (
  `nip` varchar(50) NOT NULL,
  `nama` varchar(50) NOT NULL,
  `telepon` varchar(20) DEFAULT NULL,
  `password` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data untuk tabel `dosen`
--

INSERT INTO `dosen` (`nip`, `nama`, `telepon`, `password`) VALUES
('1023809', 'karina', '102938', '$2b$10$mXiRfhkAnwFVOUyTVpXjkuAANaZICGeeNLmfkKkMhlcka4SxTc56i'),
('1029830', 'joni', '918230', '$2b$10$i5oyI75l4PxNHFxv56BRx.cukqriSPlL01kjsfkdkeg9MrQujY5U2'),
('12038', 'oki', NULL, '$2b$10$.crXngdAhQnM5CT7G2ZVQ.loX.HQSMKxw6BvnlgrIXjBta/qQ/VTi'),
('123021938', 'indri', 'o12739', '$2b$10$Y9PCVqHNQPRhcmfdYqtbHe/5BeJkvzaK4ygHuRZYyopgdkSK6p7.6'),
('81290380', 'jeremi', NULL, '$2b$10$Cce5dztBZzyCpkPx2FJAduhuor1PjO3O4EtzOVhJWa2gFg7QGA/b6'),
('91273890123', 'andra', '01982309182', '$2b$10$pTHbZNjtM7HwVvk5JwhJHe9okenBpxAlp0oB2REPAKD1VIjfglhTG');

-- --------------------------------------------------------

--
-- Struktur dari tabel `dosen_session`
--

CREATE TABLE `dosen_session` (
  `id_dosen_session` varchar(30) NOT NULL,
  `id_dosen` varchar(20) NOT NULL,
  `created_at` bigint(20) NOT NULL,
  `expired_at` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `hasil_survei_alumni`
--

CREATE TABLE `hasil_survei_alumni` (
  `id_hasil_survei_alumni` varchar(20) NOT NULL,
  `id_pertanyaan_survei` varchar(20) NOT NULL,
  `id_mahasiswa` varchar(20) NOT NULL,
  `id_opsi` varchar(20) NOT NULL,
  `essay` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `hasil_survei_dosen`
--

CREATE TABLE `hasil_survei_dosen` (
  `id_hasil_survei` varchar(20) NOT NULL,
  `id_pertanyaan_survei` varchar(20) NOT NULL,
  `id_dosen` varchar(20) NOT NULL,
  `id_opsi` varchar(20) NOT NULL,
  `essay` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `hasil_survei_mahasiswa`
--

CREATE TABLE `hasil_survei_mahasiswa` (
  `id_hasil_survei_mahasiswa` varchar(20) NOT NULL,
  `id_pertanyaan_survei` varchar(20) NOT NULL,
  `id_mahasiswa` varchar(20) NOT NULL,
  `id_opsi` varchar(20) NOT NULL,
  `essay` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `kelas`
--

CREATE TABLE `kelas` (
  `id_kelas` varchar(20) NOT NULL,
  `id_dosen` varchar(20) NOT NULL,
  `id_matkul` varchar(20) NOT NULL,
  `nama_kelas` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `kontrak_matkul`
--

CREATE TABLE `kontrak_matkul` (
  `id_kontrak` varchar(20) NOT NULL,
  `id_matkul` varchar(20) NOT NULL,
  `id_kelas` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `mahasiswa`
--

CREATE TABLE `mahasiswa` (
  `nim` varchar(50) NOT NULL,
  `nama` varchar(100) NOT NULL,
  `angkatan` varchar(5) NOT NULL,
  `status` enum('AKTIF','NONAKTIF','ALUMNI') NOT NULL DEFAULT 'AKTIF',
  `tahun_kelulusan` varchar(5) DEFAULT NULL,
  `telepon` varchar(20) DEFAULT NULL,
  `password` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data untuk tabel `mahasiswa`
--

INSERT INTO `mahasiswa` (`nim`, `nama`, `angkatan`, `status`, `tahun_kelulusan`, `telepon`, `password`) VALUES
('10293809', 'pusaka', '2019', 'AKTIF', NULL, '0128310238', '$2b$10$NCF7n4Lx0vrVcSm7toQbpuQf68GK7OpTY1tPMzmRUyt0c8EN2YnHe'),
('123908', 'andre', '2019', 'ALUMNI', '2023', NULL, '$2b$10$o8cRNCoT.JPFG.jS2yq0cOKhvHtJI.ZIz./1cLvFI3qVX1OCvH/OG'),
('1823791823', 'rendi', '2011', 'ALUMNI', '2022', '192837912', '$2b$10$018aeUyVp8WXQ3JBdq8.DOkZC/fXRXzwG1Z1Y3z0Qz4khMM94k/2u'),
('192837', 'roni', '2020', 'AKTIF', NULL, '21313123', '$2b$10$gXZhzzUnz3W7bpbOAh1aF.JwXoLUoS8yEZHbZy2FUXDv1c5wc9vri'),
('76218736817', 'bily', '2019', 'AKTIF', NULL, '09812309', '$2b$10$5AbNwRzrqYvL63uUXvEWKOQu5DmTZfRdVQP6kXQDx2yQwRN6q3plW'),
('8791283', 'rofi', '2017', 'ALUMNI', '2024', '091283098123', '$2b$10$fQEi.nmkcwbORSOv0acEGubmvXeqCjzt7N/MDVVW9qIh1edBIznS2');

-- --------------------------------------------------------

--
-- Struktur dari tabel `mahasiswa_session`
--

CREATE TABLE `mahasiswa_session` (
  `id_mahasiswa_session` varchar(30) NOT NULL,
  `id_mahasiswa` varchar(20) NOT NULL,
  `created_at` bigint(20) NOT NULL,
  `expired_at` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `mata_kuliah`
--

CREATE TABLE `mata_kuliah` (
  `id_matkul` varchar(20) NOT NULL,
  `id_dosen` varchar(20) NOT NULL,
  `nama_matkul` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `opsi_pertanyaan`
--

CREATE TABLE `opsi_pertanyaan` (
  `id_opsi` varchar(20) NOT NULL,
  `id_pertanyaan` varchar(20) NOT NULL,
  `opsi` enum('KURANG','CUKUP','BAIK','SANGAT BAIK') NOT NULL,
  `bobot` int(2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `pertanyaan_survei`
--

CREATE TABLE `pertanyaan_survei` (
  `id_pertanyaan_survei` varchar(20) NOT NULL,
  `tipe` enum('OPSI','ESSAY') NOT NULL,
  `pertanyaan` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `survei`
--

CREATE TABLE `survei` (
  `id_survei` varchar(20) NOT NULL,
  `id_template` varchar(20) NOT NULL,
  `judul_survei` text NOT NULL,
  `detail_survei` text NOT NULL,
  `periode` int(1) NOT NULL,
  `start_date` bigint(20) NOT NULL,
  `end_date` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `survei_alumni`
--

CREATE TABLE `survei_alumni` (
  `id_survei_alumni` varchar(20) NOT NULL,
  `id_mahasiswa` varchar(20) NOT NULL,
  `periode` enum('1','2') NOT NULL DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `survei_dosen`
--

CREATE TABLE `survei_dosen` (
  `id_survei_dosen` varchar(20) NOT NULL,
  `id_dosen` varchar(20) NOT NULL,
  `id_kelas` varchar(20) NOT NULL,
  `periode` enum('1','2') NOT NULL DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `survei_mahasiswa`
--

CREATE TABLE `survei_mahasiswa` (
  `id_survei_mahasiswa` varchar(20) NOT NULL,
  `id_mahasiswa` varchar(20) NOT NULL,
  `periode` enum('1','2') NOT NULL DEFAULT '1',
  `id_kelas` varchar(20) NOT NULL,
  `id_dosen` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `template_pertanyaan`
--

CREATE TABLE `template_pertanyaan` (
  `id_template_pertanyaan` varchar(20) NOT NULL,
  `id_template` varchar(20) NOT NULL,
  `id_pertanyaan_survey` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `template_survei`
--

CREATE TABLE `template_survei` (
  `id_template` varchar(20) NOT NULL,
  `nama_template` text NOT NULL,
  `role` enum('MAHASISWA','DOSEN','ALUMNI') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Indexes for dumped tables
--

--
-- Indeks untuk tabel `admin`
--
ALTER TABLE `admin`
  ADD PRIMARY KEY (`id_admin`);

--
-- Indeks untuk tabel `alumni_session`
--
ALTER TABLE `alumni_session`
  ADD PRIMARY KEY (`id_alumni_session`),
  ADD KEY `id_mahasiswa` (`id_mahasiswa`);

--
-- Indeks untuk tabel `dosen`
--
ALTER TABLE `dosen`
  ADD PRIMARY KEY (`nip`);

--
-- Indeks untuk tabel `dosen_session`
--
ALTER TABLE `dosen_session`
  ADD PRIMARY KEY (`id_dosen_session`),
  ADD KEY `id_dosen` (`id_dosen`);

--
-- Indeks untuk tabel `hasil_survei_alumni`
--
ALTER TABLE `hasil_survei_alumni`
  ADD PRIMARY KEY (`id_hasil_survei_alumni`),
  ADD KEY `id_mahasiswa` (`id_mahasiswa`),
  ADD KEY `id_opsi` (`id_opsi`),
  ADD KEY `id_pertanyaan_survei` (`id_pertanyaan_survei`);

--
-- Indeks untuk tabel `hasil_survei_dosen`
--
ALTER TABLE `hasil_survei_dosen`
  ADD PRIMARY KEY (`id_hasil_survei`),
  ADD KEY `id_dosen` (`id_dosen`),
  ADD KEY `id_opsi` (`id_opsi`),
  ADD KEY `id_pertanyaan_survei` (`id_pertanyaan_survei`);

--
-- Indeks untuk tabel `hasil_survei_mahasiswa`
--
ALTER TABLE `hasil_survei_mahasiswa`
  ADD PRIMARY KEY (`id_hasil_survei_mahasiswa`),
  ADD KEY `id_mahasiswa` (`id_mahasiswa`),
  ADD KEY `id_opsi` (`id_opsi`),
  ADD KEY `id_pertanyaan_survei` (`id_pertanyaan_survei`);

--
-- Indeks untuk tabel `kelas`
--
ALTER TABLE `kelas`
  ADD PRIMARY KEY (`id_kelas`),
  ADD KEY `id_dosen` (`id_dosen`),
  ADD KEY `id_matkul` (`id_matkul`);

--
-- Indeks untuk tabel `kontrak_matkul`
--
ALTER TABLE `kontrak_matkul`
  ADD PRIMARY KEY (`id_kontrak`),
  ADD KEY `id_kelas` (`id_kelas`),
  ADD KEY `id_matkul` (`id_matkul`);

--
-- Indeks untuk tabel `mahasiswa`
--
ALTER TABLE `mahasiswa`
  ADD PRIMARY KEY (`nim`);

--
-- Indeks untuk tabel `mahasiswa_session`
--
ALTER TABLE `mahasiswa_session`
  ADD PRIMARY KEY (`id_mahasiswa_session`),
  ADD KEY `id_mahasiswa` (`id_mahasiswa`);

--
-- Indeks untuk tabel `mata_kuliah`
--
ALTER TABLE `mata_kuliah`
  ADD PRIMARY KEY (`id_matkul`),
  ADD KEY `id_dosen` (`id_dosen`);

--
-- Indeks untuk tabel `opsi_pertanyaan`
--
ALTER TABLE `opsi_pertanyaan`
  ADD PRIMARY KEY (`id_opsi`),
  ADD KEY `id_pertanyaan` (`id_pertanyaan`);

--
-- Indeks untuk tabel `pertanyaan_survei`
--
ALTER TABLE `pertanyaan_survei`
  ADD PRIMARY KEY (`id_pertanyaan_survei`);

--
-- Indeks untuk tabel `survei`
--
ALTER TABLE `survei`
  ADD PRIMARY KEY (`id_survei`),
  ADD KEY `id_template` (`id_template`);

--
-- Indeks untuk tabel `survei_alumni`
--
ALTER TABLE `survei_alumni`
  ADD PRIMARY KEY (`id_survei_alumni`),
  ADD KEY `id_mahasiswa` (`id_mahasiswa`);

--
-- Indeks untuk tabel `survei_dosen`
--
ALTER TABLE `survei_dosen`
  ADD PRIMARY KEY (`id_survei_dosen`),
  ADD KEY `id_dosen` (`id_dosen`),
  ADD KEY `id_kelas` (`id_kelas`);

--
-- Indeks untuk tabel `survei_mahasiswa`
--
ALTER TABLE `survei_mahasiswa`
  ADD PRIMARY KEY (`id_survei_mahasiswa`),
  ADD KEY `id_mahasiswa` (`id_mahasiswa`),
  ADD KEY `id_dosen` (`id_dosen`),
  ADD KEY `id_kelas` (`id_kelas`);

--
-- Indeks untuk tabel `template_pertanyaan`
--
ALTER TABLE `template_pertanyaan`
  ADD PRIMARY KEY (`id_template_pertanyaan`),
  ADD KEY `id_template` (`id_template`),
  ADD KEY `id_pertanyaan_survey` (`id_pertanyaan_survey`);

--
-- Indeks untuk tabel `template_survei`
--
ALTER TABLE `template_survei`
  ADD PRIMARY KEY (`id_template`);

--
-- Ketidakleluasaan untuk tabel pelimpahan (Dumped Tables)
--

--
-- Ketidakleluasaan untuk tabel `alumni_session`
--
ALTER TABLE `alumni_session`
  ADD CONSTRAINT `alumni_session_ibfk_1` FOREIGN KEY (`id_mahasiswa`) REFERENCES `mahasiswa` (`nim`);

--
-- Ketidakleluasaan untuk tabel `dosen_session`
--
ALTER TABLE `dosen_session`
  ADD CONSTRAINT `dosen_session_ibfk_1` FOREIGN KEY (`id_dosen`) REFERENCES `dosen` (`nip`);

--
-- Ketidakleluasaan untuk tabel `hasil_survei_alumni`
--
ALTER TABLE `hasil_survei_alumni`
  ADD CONSTRAINT `hasil_survei_alumni_ibfk_1` FOREIGN KEY (`id_mahasiswa`) REFERENCES `mahasiswa` (`nim`),
  ADD CONSTRAINT `hasil_survei_alumni_ibfk_2` FOREIGN KEY (`id_opsi`) REFERENCES `opsi_pertanyaan` (`id_opsi`),
  ADD CONSTRAINT `hasil_survei_alumni_ibfk_3` FOREIGN KEY (`id_pertanyaan_survei`) REFERENCES `pertanyaan_survei` (`id_pertanyaan_survei`);

--
-- Ketidakleluasaan untuk tabel `hasil_survei_dosen`
--
ALTER TABLE `hasil_survei_dosen`
  ADD CONSTRAINT `hasil_survei_dosen_ibfk_1` FOREIGN KEY (`id_dosen`) REFERENCES `dosen` (`nip`),
  ADD CONSTRAINT `hasil_survei_dosen_ibfk_2` FOREIGN KEY (`id_opsi`) REFERENCES `opsi_pertanyaan` (`id_opsi`),
  ADD CONSTRAINT `hasil_survei_dosen_ibfk_3` FOREIGN KEY (`id_pertanyaan_survei`) REFERENCES `pertanyaan_survei` (`id_pertanyaan_survei`);

--
-- Ketidakleluasaan untuk tabel `hasil_survei_mahasiswa`
--
ALTER TABLE `hasil_survei_mahasiswa`
  ADD CONSTRAINT `hasil_survei_mahasiswa_ibfk_1` FOREIGN KEY (`id_mahasiswa`) REFERENCES `mahasiswa` (`nim`),
  ADD CONSTRAINT `hasil_survei_mahasiswa_ibfk_2` FOREIGN KEY (`id_opsi`) REFERENCES `opsi_pertanyaan` (`id_opsi`),
  ADD CONSTRAINT `hasil_survei_mahasiswa_ibfk_3` FOREIGN KEY (`id_pertanyaan_survei`) REFERENCES `pertanyaan_survei` (`id_pertanyaan_survei`);

--
-- Ketidakleluasaan untuk tabel `kelas`
--
ALTER TABLE `kelas`
  ADD CONSTRAINT `kelas_ibfk_1` FOREIGN KEY (`id_dosen`) REFERENCES `dosen` (`nip`),
  ADD CONSTRAINT `kelas_ibfk_2` FOREIGN KEY (`id_matkul`) REFERENCES `mata_kuliah` (`id_matkul`);

--
-- Ketidakleluasaan untuk tabel `kontrak_matkul`
--
ALTER TABLE `kontrak_matkul`
  ADD CONSTRAINT `kontrak_matkul_ibfk_1` FOREIGN KEY (`id_kelas`) REFERENCES `kelas` (`id_kelas`),
  ADD CONSTRAINT `kontrak_matkul_ibfk_2` FOREIGN KEY (`id_matkul`) REFERENCES `mata_kuliah` (`id_matkul`);

--
-- Ketidakleluasaan untuk tabel `mahasiswa_session`
--
ALTER TABLE `mahasiswa_session`
  ADD CONSTRAINT `mahasiswa_session_ibfk_1` FOREIGN KEY (`id_mahasiswa`) REFERENCES `mahasiswa` (`nim`);

--
-- Ketidakleluasaan untuk tabel `mata_kuliah`
--
ALTER TABLE `mata_kuliah`
  ADD CONSTRAINT `mata_kuliah_ibfk_1` FOREIGN KEY (`id_dosen`) REFERENCES `dosen` (`nip`);

--
-- Ketidakleluasaan untuk tabel `opsi_pertanyaan`
--
ALTER TABLE `opsi_pertanyaan`
  ADD CONSTRAINT `opsi_pertanyaan_ibfk_1` FOREIGN KEY (`id_pertanyaan`) REFERENCES `pertanyaan_survei` (`id_pertanyaan_survei`);

--
-- Ketidakleluasaan untuk tabel `survei`
--
ALTER TABLE `survei`
  ADD CONSTRAINT `survei_ibfk_1` FOREIGN KEY (`id_template`) REFERENCES `survei` (`id_survei`);

--
-- Ketidakleluasaan untuk tabel `survei_alumni`
--
ALTER TABLE `survei_alumni`
  ADD CONSTRAINT `survei_alumni_ibfk_1` FOREIGN KEY (`id_mahasiswa`) REFERENCES `mahasiswa` (`nim`);

--
-- Ketidakleluasaan untuk tabel `survei_dosen`
--
ALTER TABLE `survei_dosen`
  ADD CONSTRAINT `survei_dosen_ibfk_1` FOREIGN KEY (`id_dosen`) REFERENCES `dosen` (`nip`),
  ADD CONSTRAINT `survei_dosen_ibfk_2` FOREIGN KEY (`id_kelas`) REFERENCES `kelas` (`id_kelas`);

--
-- Ketidakleluasaan untuk tabel `survei_mahasiswa`
--
ALTER TABLE `survei_mahasiswa`
  ADD CONSTRAINT `survei_mahasiswa_ibfk_1` FOREIGN KEY (`id_mahasiswa`) REFERENCES `mahasiswa` (`nim`),
  ADD CONSTRAINT `survei_mahasiswa_ibfk_2` FOREIGN KEY (`id_dosen`) REFERENCES `dosen` (`nip`),
  ADD CONSTRAINT `survei_mahasiswa_ibfk_3` FOREIGN KEY (`id_kelas`) REFERENCES `kelas` (`id_kelas`);

--
-- Ketidakleluasaan untuk tabel `template_pertanyaan`
--
ALTER TABLE `template_pertanyaan`
  ADD CONSTRAINT `template_pertanyaan_ibfk_1` FOREIGN KEY (`id_template`) REFERENCES `template_survei` (`id_template`),
  ADD CONSTRAINT `template_pertanyaan_ibfk_2` FOREIGN KEY (`id_pertanyaan_survey`) REFERENCES `pertanyaan_survei` (`id_pertanyaan_survei`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
