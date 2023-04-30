-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Waktu pembuatan: 30 Apr 2023 pada 22.24
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
  `status` enum('AKTIF','NONAKTIF') NOT NULL DEFAULT 'AKTIF',
  `nama` varchar(50) NOT NULL,
  `telepon` varchar(20) DEFAULT NULL,
  `password` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data untuk tabel `dosen`
--

INSERT INTO `dosen` (`nip`, `status`, `nama`, `telepon`, `password`) VALUES
('1023809', 'AKTIF', 'karina', '102938', '$2b$10$mXiRfhkAnwFVOUyTVpXjkuAANaZICGeeNLmfkKkMhlcka4SxTc56i'),
('1029830', 'AKTIF', 'joni', '918230', '$2b$10$i5oyI75l4PxNHFxv56BRx.cukqriSPlL01kjsfkdkeg9MrQujY5U2'),
('12038', 'AKTIF', 'oki', NULL, '$2b$10$.crXngdAhQnM5CT7G2ZVQ.loX.HQSMKxw6BvnlgrIXjBta/qQ/VTi'),
('123021938', 'AKTIF', 'indri', 'o12739', '$2b$10$Y9PCVqHNQPRhcmfdYqtbHe/5BeJkvzaK4ygHuRZYyopgdkSK6p7.6'),
('123123123', 'AKTIF', 'refi', '81231723', '$2b$10$MH9JuG0w/ohtdtQz7wlwbezjai5ivX2SKCrFn1CUE5s.n2.uVXD.S'),
('123456', 'AKTIF', 'Rusman Hadi', NULL, '$2b$10$UlxJ/Nlw75G8xapcsjKDXu9R1eRApHX6aJa8dIBz.J1RwcoqiJNq6'),
('321', 'AKTIF', 'Ibot Dota', NULL, '$2b$10$nE7WFC1qFORAXSglr/fsvuKmMnwrNxyvUz8akEghWGX1DCzK4mBFy'),
('3323231', 'AKTIF', 'fuji', NULL, '$2b$10$WR/T5WAoYPU8t0k1foFYi.h9GPYcogFF3ppcvw0bAR5Wq.hSIuPre'),
('33323', 'AKTIF', 'balmond', '8213763123', '$2b$10$0FL1vifT.GxV.cQ4kycVZu7bDKhFS0zTh4D7/1yvrJjtDhw2ggG6K'),
('42341231', 'AKTIF', 'M Kusnandar', '08312312', '$2b$10$nO1U4JPrRs2qHkwzDfAsVut9j5XMEWbXr190MfV9PksnpU9/7G7Se'),
('5555', 'AKTIF', 'Dreamocel', '0128391312', '$2b$10$KwHI2rW.EBmkyh7735Deru0wNpoeLZ30ZYC11isi.YdEZ1rAQVMAq'),
('64234432', 'AKTIF', 'Abdul Muhakim', '098381631', '$2b$10$wkt7Wcas0Q3DEho8HUH0P.F8zUjydPsLJbZBJJZGAnERxY7IgmwS2'),
('743634534', 'AKTIF', 'Hikam Nurhidayat', '', '$2b$10$AIarYsy8ZXgT9yeiqpFGiOmZY1FSTRgL7szFnfuTU88La63DFc/1q'),
('81290380', 'AKTIF', 'jeremi', NULL, '$2b$10$Cce5dztBZzyCpkPx2FJAduhuor1PjO3O4EtzOVhJWa2gFg7QGA/b6'),
('83274234', 'AKTIF', 'Abdul Hakim', '', '$2b$10$hKTL68PaB7nA8GClr6as9O/ttzyvRoUjdT91vBrodLGfkTDvwjPT6'),
('87525325243', 'AKTIF', 'M Budi Santoso', '0985348753', '$2b$10$tA/jgy/mgivMVIzvCXfjlutvPF2SkDrhvU3nwYOrclaUhcT6FFys2'),
('91273890123', 'AKTIF', 'andra', '01982309182', '$2b$10$pTHbZNjtM7HwVvk5JwhJHe9okenBpxAlp0oB2REPAKD1VIjfglhTG');

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
  `id_survei_alumni` varchar(20) NOT NULL,
  `id_mahasiswa` varchar(20) NOT NULL,
  `id_pertanyaan_survei` varchar(20) NOT NULL,
  `id_opsi` varchar(20) NOT NULL,
  `essay` text DEFAULT NULL,
  `submission_date` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data untuk tabel `hasil_survei_alumni`
--

INSERT INTO `hasil_survei_alumni` (`id_hasil_survei_alumni`, `id_survei_alumni`, `id_mahasiswa`, `id_pertanyaan_survei`, `id_opsi`, `essay`, `submission_date`) VALUES
('hOn5AcZDhFi4JP9ciGsm', 'IGAUBPK7XN7LKarNbsU7', '1020902006', '3t0qehBlnvXMvKwPyiN8', '6ULGZb5Vxwy9wdNNhYdc', NULL, 1682690114),
('J83jdtnqMIQ4CypwmJru', 'IGAUBPK7XN7LKarNbsU7', '1020902006', '1d7oypf2LxKmTre3YKk6', 'rnDvcWSJ3ASo3NLe1mg7', 'nope', 1682690114);

-- --------------------------------------------------------

--
-- Struktur dari tabel `hasil_survei_dosen`
--

CREATE TABLE `hasil_survei_dosen` (
  `id_hasil_survei_dosen` varchar(20) NOT NULL,
  `id_survei_dosen` varchar(20) NOT NULL,
  `id_dosen` varchar(20) NOT NULL,
  `id_pertanyaan_survei` varchar(20) NOT NULL,
  `id_opsi` varchar(20) DEFAULT NULL,
  `essay` text DEFAULT NULL,
  `submission_date` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data untuk tabel `hasil_survei_dosen`
--

INSERT INTO `hasil_survei_dosen` (`id_hasil_survei_dosen`, `id_survei_dosen`, `id_dosen`, `id_pertanyaan_survei`, `id_opsi`, `essay`, `submission_date`) VALUES
('CtxUc3U72Op01l1O82lo', 'IZHKkzFnIgw1j0Mgc8y1', '1023809', '3t0qehBlnvXMvKwPyiN8', '6ULGZb5Vxwy9wdNNhYdc', NULL, 1682690114),
('PBjl92ntxBNadVa3JtFY', 'IZHKkzFnIgw1j0Mgc8y1', '1023809', '1d7oypf2LxKmTre3YKk6', 'rnDvcWSJ3ASo3NLe1mg7', 'nope', 1682690114);

-- --------------------------------------------------------

--
-- Struktur dari tabel `hasil_survei_mahasiswa`
--

CREATE TABLE `hasil_survei_mahasiswa` (
  `id_hasil_survei_mahasiswa` varchar(20) NOT NULL,
  `id_survei_mahasiswa` varchar(20) NOT NULL,
  `id_mahasiswa` varchar(20) NOT NULL,
  `id_pertanyaan_survei` varchar(20) NOT NULL,
  `id_opsi` varchar(20) NOT NULL,
  `essay` text DEFAULT NULL,
  `submission_date` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data untuk tabel `hasil_survei_mahasiswa`
--

INSERT INTO `hasil_survei_mahasiswa` (`id_hasil_survei_mahasiswa`, `id_survei_mahasiswa`, `id_mahasiswa`, `id_pertanyaan_survei`, `id_opsi`, `essay`, `submission_date`) VALUES
('8BzWMRT4EqcDa495k1NA', 'IoFGwCoP2nyTpe0uNkU2', '1020902006', '1d7oypf2LxKmTre3YKk6', 'rnDvcWSJ3ASo3NLe1mg7', 'tidak ada kritik dan saran', 1682690114),
('b7kz4SWx4zAC4a1YLetS', 'IoFGwCoP2nyTpe0uNkU2', '1020902006', '3t0qehBlnvXMvKwPyiN8', '6ULGZb5Vxwy9wdNNhYdc', NULL, 1682690114),
('CYVdxF4jHabmGTm6VqgV', 'PCQp1hUZ23hHZi8nakOg', '10293809', 'Ui4SdaRmwyLR0QWH124J', 'rnDvcWSJ3ASo3NLe1mg7', 'tidak ada kritik dan saran', 1682690114),
('eZkg4QU1n1tzu2NzLCjw', 'PCQp1hUZ23hHZi8nakOg', '10293809', 'ihnepxYNeXWD92CiWXca', 'dm0KtbQPdK0Pfazv8opf', NULL, 1682690114),
('Ff9WVSzNsjEaA4SgrQOP', 'PCQp1hUZ23hHZi8nakOg', '1020902006', 'ihnepxYNeXWD92CiWXca', 'z5OHO3jjoYXq4GHXacIR', NULL, 1682690114),
('heB2aLhyPNkDFPmo84vZ', 'PCQp1hUZ23hHZi8nakOg', '1020902006', 'Ui4SdaRmwyLR0QWH124J', 'rnDvcWSJ3ASo3NLe1mg7', 'nothing', 1682690114),
('r43iGEFaaWYocowxrVXT', 'PCQp1hUZ23hHZi8nakOg', '1020902006', '3t0qehBlnvXMvKwPyiN8', '21craH0rvALjqlnwcOI6', NULL, 1682690114),
('VrgSjjmL3k4nhKtwXpBQ', 'PCQp1hUZ23hHZi8nakOg', '10293809', '3t0qehBlnvXMvKwPyiN8', '21craH0rvALjqlnwcOI6', NULL, 1682690114);

-- --------------------------------------------------------

--
-- Struktur dari tabel `kelas`
--

CREATE TABLE `kelas` (
  `id_kelas` varchar(20) NOT NULL,
  `id_dosen` varchar(20) NOT NULL,
  `id_matkul` varchar(20) NOT NULL,
  `nama_kelas` varchar(50) NOT NULL,
  `start_date` bigint(20) NOT NULL,
  `end_date` bigint(20) NOT NULL,
  `nama_dosen` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data untuk tabel `kelas`
--

INSERT INTO `kelas` (`id_kelas`, `id_dosen`, `id_matkul`, `nama_kelas`, `start_date`, `end_date`, `nama_dosen`) VALUES
('aJ99r6nBzJY190j1c5nO', '1023809', 'Qs9OPwh1jusKxMdIdw7K', 'Kalkulus - A', 1681895016, 1684980545, 'karina'),
('jxPW9D9Emsad1kVeTVP3', '1023809', 'DUFlc4ITQLZUVwFgPLXM', 'ProgWeb - A', 1681897977, 1689732350, 'karina');

-- --------------------------------------------------------

--
-- Struktur dari tabel `kontrak_matkul`
--

CREATE TABLE `kontrak_matkul` (
  `id_kontrak` varchar(20) NOT NULL,
  `id_kelas` varchar(20) NOT NULL,
  `id_mahasiswa` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data untuk tabel `kontrak_matkul`
--

INSERT INTO `kontrak_matkul` (`id_kontrak`, `id_kelas`, `id_mahasiswa`) VALUES
('gZu4OyTWfVXOgjsUSXd1', 'aJ99r6nBzJY190j1c5nO', '10293809'),
('MR1iWVt0gQu4WmB116ZR', 'jxPW9D9Emsad1kVeTVP3', '10293809'),
('uLEv8dJgKyiMb5SMzDNW', 'aJ99r6nBzJY190j1c5nO', '192837'),
('WhBdw7gzpmUJqC5uoLmv', 'jxPW9D9Emsad1kVeTVP3', '192837');

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
('1020902006', 'Tanner Donovan', '2018', 'ALUMNI', '2023', '81234567890', '$2b$10$wCc/eq2RQX4KEfk8vf0/w.oCU7AK.3Zky3PVgFxkqrOj4PTiI8v8m'),
('10293809', 'pusaka', '2019', 'ALUMNI', '2023', '0128310238', '$2b$10$NCF7n4Lx0vrVcSm7toQbpuQf68GK7OpTY1tPMzmRUyt0c8EN2YnHe'),
('1051772510', 'Kayley Alvarez', '2019', 'ALUMNI', '2020', '81234567890', '$2b$10$nf5XFOuQmsZTg64mHa3lquCjcPGNtmc7nRH7kFzNojT95bLqz6tvO'),
('1067482223', 'Madyson Flowers', '2019', 'ALUMNI', '2023', '81298765432', '$2b$10$7/Jq0kIXcA8bCoe7VCZ9V.M8ZE7xDsSR.mLwSOxJjkO5pLyiZdfJ6'),
('1072390786', 'Brielle Douglas', '2023', 'ALUMNI', '2020', '81267899999', '$2b$10$l/iDyf2iwsGTT9j065YxWulwYGFGgA21XLKuexGrOw3Ci5GrWSlpq'),
('1091384226', 'Jaxon Walton', '2021', 'ALUMNI', '2019', '81292345678', '$2b$10$C9OzpU.I5jxEnH4/oR6u2OSTyMxEKFWsrUh9NgyOAHOPmyhK34DrK'),
('1103193232', 'Putra Sinaga', '2019', 'ALUMNI', '2023', '', '$2b$10$9tr89m8dewiPu/Vf6h.YCOE2tAFwENgQxSklGWt/SppgOvCiE/RWS'),
('1103194021', 'John Doe', '2019', 'ALUMNI', '2023', '082126172854', '$2b$10$sYw2ebA8b/w9/XvVK/yFLehF6PQuifcZFYTrft06g.0nIz5nmZiSK'),
('1103194322', 'Jhon Cena', '2022', 'ALUMNI', '2030', '08736283234234', '$2b$10$DWMHFTNS9vwRpC9NBXrZFeLDDJ5fmBhCuU93NyPGGypwEEEDWC3X6'),
('1107771146', 'Darian Rosales', '2022', 'ALUMNI', '2023', '81299988877', '$2b$10$z9Dz71GSNNqZsi1X/Coule3AfFtO.wdgS9UrVIYymAFGVCsr5/0Ky'),
('1161980516', 'Haleigh Tucker', '2019', 'ALUMNI', '2023', '81292345678', '$2b$10$63ek0geOjccGbX09VSsQ9OJXF2l6UoK6rzuL3qt5mzqowUZi8FV.C'),
('1226007430', 'Araceli Mooney', '2017', 'ALUMNI', '2023', '81211122334', '$2b$10$GejdEhoBP3LtzF0q1RTvjuUF6wJc.iD.ClvJpqNz99KWL/yaoi3bW'),
('12312312', 'John Doe', '12312', 'ALUMNI', '2023', '123123123', '$2b$10$2BcBIqQUZ8DjV6cMv4yNUeBhclXHD7FSoUYQ.8w4J35QB5/dKgTbm'),
('123123123', 'sule', '2017', 'ALUMNI', '2023', '21313123', '$2b$10$dhML/vPzf6KBBbXzof3Rp.X0S/gVBUpVSUfo7Q8wa6txFFhGERixK'),
('123123213123', 'Fadil Abdulah', '2017', 'ALUMNI', '2023', '', '$2b$10$hnmIBkptfR5G.eOlUpvJH.vrKlumy1phRGSLLOtbUlKdnLmSp9wBW'),
('123908', 'andre', '2019', 'ALUMNI', '2023', NULL, '$2b$10$o8cRNCoT.JPFG.jS2yq0cOKhvHtJI.ZIz./1cLvFI3qVX1OCvH/OG'),
('1332754216', 'Zechariah Reynolds', '2019', 'ALUMNI', '2020', '81299988877', '$2b$10$Rl9mqyaNskJ2pPA99w1KyeYcp1LQzqrPboegJrdv8WQFenld5wmuC'),
('1412245678', 'Jasper Wallace', '2015', 'ALUMNI', '2023', '81234567890', '$2b$10$Yu2.I1X80XTm0EGYummaoeI1u/BucxC/QFtZqYnROnBQDsAMfqqcO'),
('1415248566', 'Lailah Mullins', '2022', 'ALUMNI', '2030', '82122345678', '$2b$10$89AFCDmuWM5FSTSVHNSO1OLa4tzPCHKWEj3P6wYzbOTgIgPBMVZlK'),
('1464509306', 'Dayana Oconnor', '2015', 'AKTIF', NULL, '82122334455', '$2b$10$eAfu.ZJX6u8xQNAeq8obkuftbPhMwWxSwNfUIR62Olhnc.c/pPY52'),
('1481732526', 'Tristen Haas', '2019', 'AKTIF', NULL, '82299988877', '$2b$10$PZjpIKsbe1wW7EC1qkGew.Jpp7xzwPwdD7GARenix3Vk.sEZUu3EC'),
('1566169192', 'Trinity Kerr', '2022', 'AKTIF', NULL, '81298765432', '$2b$10$7XA1jgNfUcLc555IIhcomOavxlP/Yc5chdnyiWrOA4oKArSDU51vq'),
('1671918406', 'Kaitlynn Bridges', '2019', 'AKTIF', NULL, '82122334455', '$2b$10$zatILJHUGvEEPTnqQTyL8.KynolIlqu342yQ71ghGGLGmw1lBTm4u'),
('1681381206', 'Brielle Ramsey', '2018', 'AKTIF', NULL, '81211122334', '$2b$10$QXiuDiqyUFVEjOuhVNLijOlo/CvsoZkaZZK7UI7BHWaK.tIpBbpjG'),
('1791285766', 'Jillian Tanner', '2019', 'AKTIF', NULL, '81211223344', '$2b$10$LgbfYB5HkAGUpbmrHgFSsex8woAP.9AJGQsOJmrqIcsOPRrQ96SO.'),
('1811531236', 'Rayan Faulkner', '2016', 'AKTIF', NULL, '81211122334', '$2b$10$7Asddm/UlVOxV/tzBvWn4O8cmeN/O0LTBPLYA3L.eFBuSPo94FZeG'),
('1823791823', 'rendi', '2011', 'ALUMNI', '2022', '192837912', '$2b$10$018aeUyVp8WXQ3JBdq8.DOkZC/fXRXzwG1Z1Y3z0Qz4khMM94k/2u'),
('1898333616', 'Maci Hayes', '2020', 'AKTIF', NULL, '81298765432', '$2b$10$ImL1oBYdWIWyh2dLp5iHyeo4Buklu7LS4MWGgulU1fKdziPRUlAqm'),
('1927390524', 'Jerimiah Raymond', '2015', 'AKTIF', NULL, '81211122334', '$2b$10$2Z2iRV.5q5CwMbtv8P7a2uxDGMBYk9svb6MTZ.4ASuZv2kKDy0ZIS'),
('192837', 'roni', '2020', 'AKTIF', NULL, '21313123', '$2b$10$gXZhzzUnz3W7bpbOAh1aF.JwXoLUoS8yEZHbZy2FUXDv1c5wc9vri'),
('1996666166', 'Tyshawn Bond', '2023', 'AKTIF', NULL, '81211223344', '$2b$10$fQOKABDXX2mFYPVET0TB8ugP.SuAoZFG978yYUla7xfTVdUXtJzNC'),
('2109984866', 'Aniyah Singh', '2020', 'AKTIF', NULL, '81298765432', '$2b$10$4wJTfT3JMENnOvHIakA6CefSgXoPkPo7VcOGfs3Xe1bbxYocQd5RC'),
('2150582016', 'Haiden Freeman', '2016', 'AKTIF', NULL, '81255533333', '$2b$10$J/o3PAcrSb3z9CR59aICQeDboVPZJjSaSkETRSslIWhuwzxanSRw.'),
('2215801736', 'Leyla Heath', '2021', 'AKTIF', NULL, '82122334455', '$2b$10$or8hu85JifF2zqiImXtPJuwH2njzL/egYCZpCSxFr3tORVEV2QMom'),
('2243211092', 'Kiera Carter', '2016', 'AKTIF', NULL, '81292345678', '$2b$10$EZ3wqFYTsBFtIDaaK/USUuDgI1Q4ehMvkvh0v9mKPV2CTaAUXsF9O'),
('2628724436', 'Kael Ortiz', '2017', 'AKTIF', NULL, '81211122334', '$2b$10$va.seT3a3ypRMMUuG0.oMObQxfxHjYJutbYh7bIy7vnLKYV2J9iCa'),
('2738865560', 'Jovanny Mcpherson', '2016', 'AKTIF', NULL, '81267899999', '$2b$10$r2nGeiW/QPILgmCtak.Ru.P25K5tjsST6f/tTCJKv1m4.TQcRnBgy'),
('2739963692', 'Raul Woodward', '2021', 'AKTIF', NULL, '82122345678', '$2b$10$q0RO3fifCTYdW2BdaTMo1OaaSBaY/W68/YJbkvANzdMy9UrYsTtMS'),
('2764275806', 'Reese Hodge', '2017', 'AKTIF', NULL, '82267899999', '$2b$10$Sw0M53ZYeTjn6ent3piRDOMS80BNfg7FSmqmPpRnKZ.lvaccCakPW'),
('2822988126', 'Lionel Schultz', '2018', 'AKTIF', NULL, '82122334455', '$2b$10$G2Fq3eewJ5qQPsEAZMc01ew2.bZV/iAXstNP8GMbenlKIbrHP/RDa'),
('2842699776', 'Kayla Dalton', '2021', 'AKTIF', NULL, '81267899999', '$2b$10$x6.kqzThXmDhBtyMuI3JneAWIY0M96bWiZWJwpbS7YJuS8s807JLm'),
('2953720306', 'Darian Maddox', '2018', 'AKTIF', NULL, '81292345678', '$2b$10$EI6fsiZHf1iWdY/JWD9hEeR0q9rJaBDVhvZE/BjUZdX6sqc1nTVsq'),
('2992387192', 'Melina Robinson', '2018', 'AKTIF', NULL, '81255533333', '$2b$10$yC0ssJA/dKqpmkJjaHr0g.RoTLRZTyvvcrOIIIsshGbk8NOWvZ3qS'),
('3100398736', 'Mckenna Key', '2015', 'AKTIF', NULL, '81267899999', '$2b$10$mybXrHoPFMwj6JuwuGE.5O6tDorrnMxKUf2fJWJaalZ3UfBJG9gfm'),
('3123123123123', 'Budi Santoso', '2017', 'AKTIF', NULL, '2331333000', '$2b$10$0wUdQlI7Nc5kWOJF0KsEe.Fm0nZWuzV8aeHND5FwLFUUmQ8wVFoAW'),
('3145119030', 'Esteban Mcknight', '2016', 'AKTIF', NULL, '81299988877', '$2b$10$I1xb2rxyy0/U.J26P0XbY.OYjIdwDVAHwC2m6VCYsPJNAds5oSMLq'),
('3167106766', 'Kadence Francis', '2023', 'AKTIF', NULL, '81299988877', '$2b$10$dxvsyBjJ.oSIg1xWrb69C.2QheNbmjhzEHAQxz.LppfTzv9bYiHiq'),
('3203622466', 'Ryann Christensen', '2015', 'AKTIF', NULL, '81211223344', '$2b$10$rhtpMhSozLCTBTxRWg0HCefG97SmOHOuSbcqq3nb/Ws9CLDCoIMgO'),
('33211123123', 'Asep Sutisna', '2018', 'AKTIF', NULL, '089077283423', '$2b$10$D0.8hziuhwAdOR35124Iw.bE9r4t/FCLWL7L1W7konjfQ3SMC1RFi'),
('3409355361', 'Jared Peterson', '2020', 'AKTIF', NULL, '82122334455', '$2b$10$Z/XNVaZ8nK/WNuTRQ4ZxZOv1Hwqz3GMDWJq/s6cJ9hTF3rpNohche'),
('343288234234', 'Maman Suraman', '2015', 'AKTIF', NULL, '0837213714124', '$2b$10$hehaseVMeMQCqZhorVexsOkjqq9odqwCj8qYPEkh0l/7Jjit/AEn2'),
('3761355060', 'Fletcher Rogers', '2017', 'AKTIF', NULL, '81267899999', '$2b$10$GeRSs1f0ucNYv5WricHWCONTlxfJWtd7cvBMHuV1gWc8cJFxGDaA2'),
('3921723213', 'M Dendi', '2017', 'AKTIF', NULL, '08942342342', '$2b$10$ifiB0PyKgf6x72iNHFUoD.rUD2zVb7ImTaQzLoJe8ypICs6Zpnwsu'),
('3940419006', 'Terrell Montgomery', '2022', 'AKTIF', NULL, '81267899999', '$2b$10$IN7v.69nhfL1GetPK2lwoOhaBgDNgzF4GP4yQdoPi10//zyop/LB.'),
('4125369998', 'Adyson Parrish', '2017', 'AKTIF', NULL, '81299988877', '$2b$10$uBaqF1fpunbafWOj2KsOHeM7Lw21BkljGvozTKeFzmBal8A.4FZii'),
('4142681882', 'Kaylen Miles', '2017', 'AKTIF', NULL, '82267899999', '$2b$10$XpzvzT5HHcVNCXtMyNQhY.XPrcXTROu7b7bvsyO2lCSW9lq0xmRle'),
('4207345730', 'Taniyah Carrillo', '2021', 'AKTIF', NULL, '81292345678', '$2b$10$3r9bqOCFVb6FWh3LX1lt6.W1LC66/4XB8jyGU6chEbsH2XPANTiFe'),
('4321890675', 'Camryn Ayers', '2020', 'AKTIF', NULL, NULL, '$2b$10$IEao7/nyj.VuSMRIKgo1C.npj/A6PW.BKHeLrRQMfV.kMpcG9IBd.'),
('4403166703', 'Finnley Wood', '2017', 'AKTIF', NULL, '82123456789', '$2b$10$0sHd4rFUNwCioFIH1RQ9jeWcz6mcCexW7Ps7tifMpPGeSiG4mdcdW'),
('4403360986', 'Payten Rodriguez', '2019', 'AKTIF', NULL, '82267899999', '$2b$10$AEupP782zmtShc0ETaepv.DfH/G6tEjLzX6EsrxKSzaJP9I33sH12'),
('4619291236', 'Jovanny Hale', '2016', 'AKTIF', NULL, '81234567890', '$2b$10$KQMQ6e6SQkKrZfImhze1uu4yeLJz5KgCiDspFGhJXD5BuP0K/JuWm'),
('4676342836', 'Kyson Fry', '2023', 'AKTIF', NULL, '81292345678', '$2b$10$OWp7IM9Wo8YTdLhY2j7Vku9zaup0JwTBYvMnYLAGiz77GfsbfhrSe'),
('4924246436', 'Holly Santana', '2018', 'AKTIF', NULL, '82122334455', '$2b$10$kEh8S6S4h2nj3w1HVmxqw.z.SdCPQP0hbmfumtYNS/WrRi.weOf0G'),
('4977439146', 'Halle Wells', '2021', 'AKTIF', NULL, '81234567890', '$2b$10$JlknuT3i6jxX4JtJ4KPUE.2Ia94hRn/Z4j5iILk6GcNSqDSGZLot2'),
('5011439152', 'Randy Reyes', '2022', 'AKTIF', NULL, '82267899999', '$2b$10$0Ojfp4OG46oOcPKSyYu0JeZBevpHimWoodEFVo4gh/GfVr4bQ57lO'),
('5112537776', 'Keely Ware', '2016', 'AKTIF', NULL, '81267899999', '$2b$10$6Pse1r6vkzCvqo6bgl6YzemWGLSc1YW8hSf.efo6Ye5/AUoyodUq2'),
('5207804060', 'Bria Mcpherson', '2020', 'AKTIF', NULL, '82122334455', '$2b$10$nxOTw1QLmzg8987Xe59Ur.JC0VhKV/wmevuFOTfSTgXr1GPQbgKRm'),
('5272076676', 'Adalyn Stephens', '2021', 'AKTIF', NULL, '82122345678', '$2b$10$VWnEGhOpzYOeaHpAiVHvsOUUtX1N2gRQLmcKC9tn9U1c/35LBJF5O'),
('5396323152', 'Darian Reeves', '2018', 'AKTIF', NULL, '81234567890', '$2b$10$tmnDVrJZtlrQr/i/G2POYOugiCcceEHfhOt27U7kop5jZldD698b6'),
('5435345345', 'andre', '2017', 'AKTIF', NULL, NULL, '$2b$10$Y2rSdccNwVadAh1iE6bJuur/cnttv0d.DpHHSNsymOKMgGxOYdZ5e'),
('5548900306', 'Allyson Mccarthy', '2016', 'AKTIF', NULL, '82299988877', '$2b$10$mQxkmt0K6MLcS.RwpEEBP.307AMRZ3AJ5irUTYeFamCb8zv0HUNYm'),
('5559791476', 'Bria Turner', '2021', 'AKTIF', NULL, '81211122334', '$2b$10$Wp58itvt1v8gDIFvTMycuuJDB0d4K2l9GPk9XBNAHZWSdgE3qsiDS'),
('5678904321', 'Daphne Knapp', '2018', 'AKTIF', NULL, NULL, '$2b$10$Kfa8GF9ipJk1pLtK4b1NeeWmUVCN2C3lBrBHLxB0Y3dLDOxBN41h2'),
('5690027128', 'Aria Rodgers', '2018', 'AKTIF', NULL, '82299988877', '$2b$10$6SwNMho3rX4ANzlP2DW0De5EjVjdQIGLGpazsjhHV6CeeYY0ysA5i'),
('5696732424', 'Kaitlyn Velazquez', '2015', 'AKTIF', NULL, '81255533333', '$2b$10$U4NIlfFh5rUmPldeBjR1MusvyUjyeJyZOZSX9xMR8BbyBAwKxQKmS'),
('5798349976', 'Samir Chambers', '2022', 'AKTIF', NULL, '81234567890', '$2b$10$mCxKy7dzlhykGCgGYKSz1eVvQfkonnhMjonex2WVN2P2XtZ2E3Qwi'),
('63413123', 'M Ridwan', '2018', 'AKTIF', NULL, '09983453423', '$2b$10$9eg7k5DzgCANM6CuW/oR/OYASKbbnXMWAFLdkwQ261/YxupszKH/y'),
('6453127890', 'Kylan Krause', '2023', 'AKTIF', NULL, NULL, '$2b$10$sKO2FnjMXjKWHaxMZJhOL.yqEx3ZvJ8PkUw4WzsBM5Q.ten2ycl/y'),
('6591833652', 'Kenia Barrett', '2022', 'AKTIF', NULL, '82122334455', '$2b$10$/63CcQBEUbSfPRr4CyxUvuyIzlnCGxKlAb0kZylCxDKPXjoHjbgxS'),
('6612383722', 'Sabrina Deleon', '2015', 'AKTIF', NULL, '82122345678', '$2b$10$6AXhZx5qmHuWZnbVHqw1xuTvqr7UtWV7zRU7.z1/1LL8qK7BYLNRy'),
('6617555706', 'Bella Oconnell', '2017', 'AKTIF', NULL, '82122345678', '$2b$10$JWV70Zk2FRBe9X0ZfP/qBuxbcIZ8mgX65itzdVAXrTGLn53ccb/Fu'),
('6635275424', 'Mollie Farrell', '2023', 'AKTIF', NULL, '81299988877', '$2b$10$DgTr0ZNv1OZFDc/BsELt5eVqBYXRPd3csWjLZ8dbdZ9VYkpqheSoy'),
('6666', 'sunda bule', '2017', 'AKTIF', NULL, '21313123', '$2b$10$EnEbXsuGGucL7ACQ7eJbJuL.GozHoRh6d.RuIdubUQ0elyhlyIpWC'),
('6784415430', 'Gracelynn Mccarty', '2019', 'AKTIF', NULL, '82267899999', '$2b$10$ze/jOAEZt7pNsKWX7sg0TOcgHazAOZYn8iVTCdbaWUD4/uClO1sZK'),
('6966016446', 'Finnegan Shah', '2020', 'AKTIF', NULL, '81255533333', '$2b$10$Iue9EfWf/3iavcs05szhMeRWglGEmOLAiV.YIQgD7TtOv7xsu7k7G'),
('6986928676', 'Elyse Warner', '2016', 'AKTIF', NULL, '81298765432', '$2b$10$cT.EK0/ZMrrk1rP.CtOcCOOf6CwThNl.faXIFKAaTekmTIsi4TRV.'),
('7146945298', 'Beau Weeks', '2017', 'AKTIF', NULL, '81211223344', '$2b$10$i7NYW8Al7W.SbYw6EZfYruZuLxX9GEKmft1o759pwUzCx6xSRpD8.'),
('7149336924', 'Carley Valencia', '2022', 'AKTIF', NULL, '81211122334', '$2b$10$B8tm35foIMtM4YM03WkZROlmsLoUmhjt1ShP8ZauPZueHlApuLtQe'),
('7183722466', 'Gabriella Beck', '2020', 'AKTIF', NULL, '81255533333', '$2b$10$OuQy2BXfOW4RjknQo6yJZ.YeLEYtJeme1XQANmEfRrc.LvxKPGEbu'),
('7238901234', 'Teagan Morse', '2022', 'AKTIF', NULL, NULL, '$2b$10$91hyEU/LjyN19HPX8PcqNu/iRk8G9oYwu8Z5vcgDyzZy7Pidm4.R6'),
('7347318466', 'Cory Stuart', '2020', 'AKTIF', NULL, '82299988877', '$2b$10$4VPoW5utgS6SA8oYWpTNFOIKptB4Dk8aKuvKiP9UgEZdUcNUfQFs6'),
('7507582306', 'Fletcher Dalton', '2017', 'AKTIF', NULL, '81255533333', '$2b$10$R8j/zLPIj15yUfF4fpdK6.haFbYUrY9ecAdwgFRx4W359TKMHKkyi'),
('7551195636', 'Kayley Walton', '2016', 'AKTIF', NULL, '81299988877', '$2b$10$NdnPAS4P2XqVaZ/zmJRju.PPQqgvdlypDk/GDycbFDl9RICgs5sxm'),
('7562341199', 'Caiden Griffin', '2021', 'AKTIF', NULL, '81211223344', '$2b$10$AGdWxP0DL6r1yo0T7YOdIenXM/2plBgKc7B3g5JldEWLmwqcJLunS'),
('7577935852', 'Branson Vargas', '2023', 'AKTIF', NULL, '81211223344', '$2b$10$bgGxnWaECT5ACmDS8oQbauwcQ1r1Jwoq3yMvkh62s5YkMMFhIxtw.'),
('76218736817', 'bily', '2019', 'AKTIF', NULL, '09812309', '$2b$10$5AbNwRzrqYvL63uUXvEWKOQu5DmTZfRdVQP6kXQDx2yQwRN6q3plW'),
('7683453124', 'Rylie Austin', '2020', 'AKTIF', NULL, '82299988877', '$2b$10$PQn3lOTsiOBWtrNIHyUK6uUGU9QIyU5VPfpzehsO4.u5K8jwxl7aW'),
('7737069656', 'Caiden Hart', '2019', 'AKTIF', NULL, '82122345678', '$2b$10$/QwYfgzSMvzAXtJFhWQr5Obzfv7peQBjysh2Y1l5tf5RToIhwRR1y'),
('7761338106', 'Saniyah Nguyen', '2023', 'AKTIF', NULL, '82122345678', '$2b$10$hvuQGm9bUE8EWAQKwB2OYetknipkVOTtDrCauOqyUYJHahpKsgCZ.'),
('7777', 'sule sutisna', '2017', 'AKTIF', NULL, NULL, '$2b$10$pFOFCgkfHP4Fn0IP4eJyeObljtG09SCf3I1kkRVqwlRLws78sFOm2'),
('7836487286', 'Asa Case', '2018', 'AKTIF', NULL, '81211223344', '$2b$10$fKWnBbtwiFMYEKw5MqVGZuRbqvwKTaOZmam7XleE5Hf2vZ8lbbetS'),
('7851739106', 'Jace Parks', '2020', 'AKTIF', NULL, '82267899999', '$2b$10$xw5iihmBk1QGGzZ5CIdZOuVLDo3lXjF216IPZWGguQgCDrCikQIPS'),
('7858356516', 'Miah Boone', '2019', 'AKTIF', NULL, '81267899999', '$2b$10$twF8Fu6wQiMbMYdz.46GleYJVz5oXUbbXmffpqQ.4GEbgE/mRndRe'),
('7873557476', 'Tanner Olson', '2017', 'AKTIF', NULL, '81298765432', '$2b$10$Bsn2gp2QpxOOnWVPQEkeIuR8CXpBlSTYPWttBvR/RS5.EX6hY4q9i'),
('7943474372', 'Meredith Lowe', '2015', 'AKTIF', NULL, '82267899999', '$2b$10$18TGpKDO4p47YbZv6q0hE.uJxrJ9gU5Ecdrg9kO1Y0CbQlQJZg1GO'),
('8351259106', 'Moshe Welch', '2020', 'AKTIF', NULL, '81234567890', '$2b$10$jxFRopVy1R7GMOKBUZVS2uSf4M1iOBuECKvOAC2XjOd1CjNiyXddq'),
('8471159552', 'Marley Mendoza', '2018', 'AKTIF', NULL, '81199988877', '$2b$10$whBarE4wHlzw/59C0tZ6n.W0zmraNDfamhNVdOYboNl4mJk3gN2oO'),
('8654482596', 'Kolby Schmidt', '2015', 'AKTIF', NULL, '81292345678', '$2b$10$OVTxjKp6NxpnKLRHt2oZEecGF/VIuF/hqRdESFSj2TwKrQxha2G6S'),
('8696798245', 'Nia Duran', '2022', 'AKTIF', NULL, '82299988877', '$2b$10$v3Bwt1YfeTuBE2gPsDWzBu7cnVI8eMlRcW0Wo7WAqZJ2eheBC9MmW'),
('8791283', 'rofi', '2017', 'ALUMNI', '2024', '091283098123', '$2b$10$fQEi.nmkcwbORSOv0acEGubmvXeqCjzt7N/MDVVW9qIh1edBIznS2'),
('8810105724', 'Amiyah Gibson', '2021', 'AKTIF', NULL, '82123456789', '$2b$10$QCWc1aTmJLWxYYlhX9KLfOuElScoFNZDctHt4gtpAoFweioog4Kl.'),
('8822689636', 'Kaitlynn Odom', '2016', 'AKTIF', NULL, '81255533333', '$2b$10$PzPkaESkTPut.NeXITn6auRIXLPgXqelGeO82jJ1D5BqCbFbzcUTS'),
('8852309310', 'Greta Callahan', '2015', 'AKTIF', NULL, '81299988877', '$2b$10$hH2z6yxNfRiBgXdPY97KAuLAO4364cq8GsQ9JCgLg/cQATYVVAi8.'),
('8876121150', 'Kaila Wright', '2021', 'AKTIF', NULL, '82299988877', '$2b$10$iTsvsl2GHo1o9ETFawwkvugT2YQKCCCTZ0CETDpRS9ht0klqwrK6.'),
('8912765432', 'Leon Keith', '2017', 'AKTIF', NULL, NULL, '$2b$10$GKn5XWmauP1GKRZ9oVBryOSM/qPT2bhHBAfiNx3amgM/1x33bXvDW'),
('8997909326', 'Jayden Whitehead', '2015', 'AKTIF', NULL, '81298765432', '$2b$10$7lkum1XoRLlJ9ef7nMzc9OdfJJ05qay6t4Im3VXF/ln/h6FAH.FlS'),
('9087654321', 'Mauricio Lang', '2016', 'AKTIF', NULL, NULL, '$2b$10$LoCKKbahVeipcMdsC5X6Ge4fayn7IdHDJ38HeLM3G2LftdlfgLBKu'),
('9247193166', 'Estrella Serrano', '2022', 'AKTIF', NULL, '81211223344', '$2b$10$.TnvfdjwyuUCzAuAN4pRiedVFCh05sSORUTJvK41lgieYIXFYBrd.'),
('9537853931', 'Misael Huerta', '2023', 'AKTIF', NULL, '81255533333', '$2b$10$UrwiHzHHeyVM2wUt/pVVNeej7cXtbG6tyYwCBz19rz/fxXc4TxjXK'),
('9553437182', 'Makhi Curry', '2018', 'AKTIF', NULL, '81299988877', '$2b$10$ocT11fWCbb2kokOM..dwNurIywYUOtZoxUMOgZGTeCWiKM0KdauZW');

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
  `nama_matkul` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data untuk tabel `mata_kuliah`
--

INSERT INTO `mata_kuliah` (`id_matkul`, `nama_matkul`) VALUES
('DUFlc4ITQLZUVwFgPLXM', 'Pemrograman Web'),
('Qs9OPwh1jusKxMdIdw7K', 'Kalkulus');

-- --------------------------------------------------------

--
-- Struktur dari tabel `opsi_pertanyaan`
--

CREATE TABLE `opsi_pertanyaan` (
  `id_opsi` varchar(20) NOT NULL,
  `opsi` enum('KURANG','CUKUP','BAIK','SANGAT BAIK','ESSAY') NOT NULL,
  `bobot` int(2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data untuk tabel `opsi_pertanyaan`
--

INSERT INTO `opsi_pertanyaan` (`id_opsi`, `opsi`, `bobot`) VALUES
('21craH0rvALjqlnwcOI6', 'CUKUP', 2),
('6ULGZb5Vxwy9wdNNhYdc', 'BAIK', 3),
('dm0KtbQPdK0Pfazv8opf', 'KURANG', 1),
('rnDvcWSJ3ASo3NLe1mg7', 'ESSAY', 0),
('z5OHO3jjoYXq4GHXacIR', 'SANGAT BAIK', 4);

-- --------------------------------------------------------

--
-- Struktur dari tabel `pertanyaan_survei`
--

CREATE TABLE `pertanyaan_survei` (
  `id_pertanyaan_survei` varchar(20) NOT NULL,
  `tipe` enum('OPSI','ESSAY') NOT NULL,
  `pertanyaan` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data untuk tabel `pertanyaan_survei`
--

INSERT INTO `pertanyaan_survei` (`id_pertanyaan_survei`, `tipe`, `pertanyaan`) VALUES
('1d7oypf2LxKmTre3YKk6', 'ESSAY', 'kritik dan saran'),
('3t0qehBlnvXMvKwPyiN8', 'OPSI', 'seberapa puas anda dengan fasilitas kampus?'),
('ihnepxYNeXWD92CiWXca', 'OPSI', 'seberapa mengerti anda dengan matkul ini?'),
('Ui4SdaRmwyLR0QWH124J', 'ESSAY', 'kritik anda?');

-- --------------------------------------------------------

--
-- Struktur dari tabel `survei_alumni`
--

CREATE TABLE `survei_alumni` (
  `id_survei_alumni` varchar(20) NOT NULL,
  `id_template` varchar(20) NOT NULL,
  `judul_survei` text NOT NULL,
  `detail_survei` text NOT NULL,
  `start_date` bigint(20) NOT NULL,
  `end_date` bigint(20) NOT NULL,
  `periode` enum('1','2') NOT NULL DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data untuk tabel `survei_alumni`
--

INSERT INTO `survei_alumni` (`id_survei_alumni`, `id_template`, `judul_survei`, `detail_survei`, `start_date`, `end_date`, `periode`) VALUES
('IGAUBPK7XN7LKarNbsU7', 'GeQ48egTcsAMDIQLpjPJ', 'postman', 'from postman', 1587621026, 1684980545, '1'),
('mItbQiifvM6bPNrLJSOh', 'GeQ48egTcsAMDIQLpjPJ', 'postman', 'from postman', 1587621026, 1684980545, '1');

-- --------------------------------------------------------

--
-- Struktur dari tabel `survei_dosen`
--

CREATE TABLE `survei_dosen` (
  `id_survei_dosen` varchar(20) NOT NULL,
  `id_template` varchar(20) NOT NULL,
  `judul_survei` text NOT NULL,
  `detail_survei` text NOT NULL,
  `start_date` bigint(20) NOT NULL,
  `end_date` bigint(20) NOT NULL,
  `periode` enum('1','2') NOT NULL DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data untuk tabel `survei_dosen`
--

INSERT INTO `survei_dosen` (`id_survei_dosen`, `id_template`, `judul_survei`, `detail_survei`, `start_date`, `end_date`, `periode`) VALUES
('0ve9qJEQR5mmMDUT2Z4g', 'gFwYSmjcpw3sc36wTyiD', 'postman1', 'from postman', 1587621026, 1684980545, '1'),
('IZHKkzFnIgw1j0Mgc8y1', 'GeQ48egTcsAMDIQLpjPJ', 'postman2', 'from postman', 1587621026, 1684980545, '1'),
('jg15YS9MvKSbXKOup5V9', 'GeQ48egTcsAMDIQLpjPJ', 'postman3', 'from postman', 1587621026, 1684980545, '1'),
('TkopwkXg7GAwPTfzk75m', 'GeQ48egTcsAMDIQLpjPJ', 'postman', 'from postman', 1587621026, 1684980545, '1');

-- --------------------------------------------------------

--
-- Struktur dari tabel `survei_mahasiswa`
--

CREATE TABLE `survei_mahasiswa` (
  `id_survei_mahasiswa` varchar(20) NOT NULL,
  `id_template` varchar(20) NOT NULL,
  `id_kelas` varchar(20) NOT NULL,
  `judul_survei` text NOT NULL,
  `detail_survei` text NOT NULL,
  `start_date` bigint(20) NOT NULL,
  `end_date` bigint(20) NOT NULL,
  `periode` enum('1','2') NOT NULL DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data untuk tabel `survei_mahasiswa`
--

INSERT INTO `survei_mahasiswa` (`id_survei_mahasiswa`, `id_template`, `id_kelas`, `judul_survei`, `detail_survei`, `start_date`, `end_date`, `periode`) VALUES
('IoFGwCoP2nyTpe0uNkU2', 'GeQ48egTcsAMDIQLpjPJ', 'aJ99r6nBzJY190j1c5nO', 'postman', 'from postman', 1587621026, 1684980545, '1'),
('PCQp1hUZ23hHZi8nakOg', 'gFwYSmjcpw3sc36wTyiD', 'aJ99r6nBzJY190j1c5nO', 'postman', 'from postman', 1587621026, 1684980545, '1'),
('psgugkPxgNLe5PX6CnYH', 'GeQ48egTcsAMDIQLpjPJ', 'aJ99r6nBzJY190j1c5nO', 'postman', 'from postman', 1587621026, 1684980545, '1');

-- --------------------------------------------------------

--
-- Struktur dari tabel `template_pertanyaan`
--

CREATE TABLE `template_pertanyaan` (
  `id_template_pertanyaan` varchar(20) NOT NULL,
  `id_template` varchar(20) NOT NULL,
  `id_pertanyaan_survey` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data untuk tabel `template_pertanyaan`
--

INSERT INTO `template_pertanyaan` (`id_template_pertanyaan`, `id_template`, `id_pertanyaan_survey`) VALUES
('5GFtt1Hh3omJbs0MjXQX', 'GeQ48egTcsAMDIQLpjPJ', '1d7oypf2LxKmTre3YKk6'),
('BpmHoT8hIwOlPHChMx7e', 'gFwYSmjcpw3sc36wTyiD', '3t0qehBlnvXMvKwPyiN8'),
('RzRqz0bunbXchxjUfJjH', 'GeQ48egTcsAMDIQLpjPJ', '3t0qehBlnvXMvKwPyiN8'),
('Wvzeihdqmm51WyKGms6g', 'gFwYSmjcpw3sc36wTyiD', 'ihnepxYNeXWD92CiWXca'),
('XbpGnEWh1Wjc7qlDXuFx', 'gFwYSmjcpw3sc36wTyiD', 'Ui4SdaRmwyLR0QWH124J');

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
-- Dumping data untuk tabel `template_survei`
--

INSERT INTO `template_survei` (`id_template`, `nama_template`, `role`) VALUES
('GeQ48egTcsAMDIQLpjPJ', 'template survei mahasiswa', 'MAHASISWA'),
('gFwYSmjcpw3sc36wTyiD', 'dosen temp', 'DOSEN');

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
  ADD KEY `id_pertanyaan_survei` (`id_pertanyaan_survei`),
  ADD KEY `id_survei_alumni` (`id_survei_alumni`);

--
-- Indeks untuk tabel `hasil_survei_dosen`
--
ALTER TABLE `hasil_survei_dosen`
  ADD PRIMARY KEY (`id_hasil_survei_dosen`),
  ADD KEY `id_dosen` (`id_dosen`),
  ADD KEY `id_opsi` (`id_opsi`),
  ADD KEY `id_pertanyaan_survei` (`id_pertanyaan_survei`),
  ADD KEY `id_survei_dosen` (`id_survei_dosen`);

--
-- Indeks untuk tabel `hasil_survei_mahasiswa`
--
ALTER TABLE `hasil_survei_mahasiswa`
  ADD PRIMARY KEY (`id_hasil_survei_mahasiswa`),
  ADD KEY `id_mahasiswa` (`id_mahasiswa`),
  ADD KEY `id_opsi` (`id_opsi`),
  ADD KEY `id_pertanyaan_survei` (`id_pertanyaan_survei`),
  ADD KEY `id_survei_mahasiswa` (`id_survei_mahasiswa`);

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
  ADD KEY `id_mahasiswa` (`id_mahasiswa`);

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
  ADD PRIMARY KEY (`id_matkul`);

--
-- Indeks untuk tabel `opsi_pertanyaan`
--
ALTER TABLE `opsi_pertanyaan`
  ADD PRIMARY KEY (`id_opsi`);

--
-- Indeks untuk tabel `pertanyaan_survei`
--
ALTER TABLE `pertanyaan_survei`
  ADD PRIMARY KEY (`id_pertanyaan_survei`);

--
-- Indeks untuk tabel `survei_alumni`
--
ALTER TABLE `survei_alumni`
  ADD PRIMARY KEY (`id_survei_alumni`);

--
-- Indeks untuk tabel `survei_dosen`
--
ALTER TABLE `survei_dosen`
  ADD PRIMARY KEY (`id_survei_dosen`),
  ADD KEY `id_template` (`id_template`);

--
-- Indeks untuk tabel `survei_mahasiswa`
--
ALTER TABLE `survei_mahasiswa`
  ADD PRIMARY KEY (`id_survei_mahasiswa`),
  ADD KEY `id_kelas` (`id_kelas`),
  ADD KEY `id_template` (`id_template`);

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
  ADD CONSTRAINT `hasil_survei_alumni_ibfk_3` FOREIGN KEY (`id_pertanyaan_survei`) REFERENCES `pertanyaan_survei` (`id_pertanyaan_survei`),
  ADD CONSTRAINT `hasil_survei_alumni_ibfk_4` FOREIGN KEY (`id_survei_alumni`) REFERENCES `survei_alumni` (`id_survei_alumni`);

--
-- Ketidakleluasaan untuk tabel `hasil_survei_dosen`
--
ALTER TABLE `hasil_survei_dosen`
  ADD CONSTRAINT `hasil_survei_dosen_ibfk_1` FOREIGN KEY (`id_dosen`) REFERENCES `dosen` (`nip`),
  ADD CONSTRAINT `hasil_survei_dosen_ibfk_2` FOREIGN KEY (`id_opsi`) REFERENCES `opsi_pertanyaan` (`id_opsi`),
  ADD CONSTRAINT `hasil_survei_dosen_ibfk_3` FOREIGN KEY (`id_pertanyaan_survei`) REFERENCES `pertanyaan_survei` (`id_pertanyaan_survei`),
  ADD CONSTRAINT `hasil_survei_dosen_ibfk_4` FOREIGN KEY (`id_survei_dosen`) REFERENCES `survei_dosen` (`id_survei_dosen`);

--
-- Ketidakleluasaan untuk tabel `hasil_survei_mahasiswa`
--
ALTER TABLE `hasil_survei_mahasiswa`
  ADD CONSTRAINT `hasil_survei_mahasiswa_ibfk_1` FOREIGN KEY (`id_mahasiswa`) REFERENCES `mahasiswa` (`nim`),
  ADD CONSTRAINT `hasil_survei_mahasiswa_ibfk_2` FOREIGN KEY (`id_opsi`) REFERENCES `opsi_pertanyaan` (`id_opsi`),
  ADD CONSTRAINT `hasil_survei_mahasiswa_ibfk_3` FOREIGN KEY (`id_pertanyaan_survei`) REFERENCES `pertanyaan_survei` (`id_pertanyaan_survei`),
  ADD CONSTRAINT `hasil_survei_mahasiswa_ibfk_4` FOREIGN KEY (`id_survei_mahasiswa`) REFERENCES `survei_mahasiswa` (`id_survei_mahasiswa`);

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
  ADD CONSTRAINT `kontrak_matkul_ibfk_3` FOREIGN KEY (`id_mahasiswa`) REFERENCES `mahasiswa` (`nim`);

--
-- Ketidakleluasaan untuk tabel `mahasiswa_session`
--
ALTER TABLE `mahasiswa_session`
  ADD CONSTRAINT `mahasiswa_session_ibfk_1` FOREIGN KEY (`id_mahasiswa`) REFERENCES `mahasiswa` (`nim`);

--
-- Ketidakleluasaan untuk tabel `survei_dosen`
--
ALTER TABLE `survei_dosen`
  ADD CONSTRAINT `survei_dosen_ibfk_1` FOREIGN KEY (`id_template`) REFERENCES `template_survei` (`id_template`);

--
-- Ketidakleluasaan untuk tabel `survei_mahasiswa`
--
ALTER TABLE `survei_mahasiswa`
  ADD CONSTRAINT `survei_mahasiswa_ibfk_3` FOREIGN KEY (`id_kelas`) REFERENCES `kelas` (`id_kelas`),
  ADD CONSTRAINT `survei_mahasiswa_ibfk_4` FOREIGN KEY (`id_template`) REFERENCES `template_survei` (`id_template`);

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
