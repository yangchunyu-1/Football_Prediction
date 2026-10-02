/* =========================================================
 * teams.js — 2026/27 赛季欧冠联赛阶段 36 支球队数据
 *
 * 名单基于 2026 年夏季转会窗后的公开资料整理：
 * 每队 23 人（3 门将 / 8 后卫 / 6 中场 / 6 前锋），
 * 前 11 人为假定首发，含阵型（formation）字段。
 * 已剔除 2026 年夏窗离队球员。
 * strength 为综合实力估算值（40~100），仅用于模拟。
 * ========================================================= */

(function (global) {
  'use strict';

  const TEAMS = [
    /* ================= 第一档 ================= */
    {
      id: 'psg', name: 'Paris Saint-Germain', nameZh: '巴黎圣日耳曼',
      country: '法国', flag: '🇫🇷', pot: 1, strength: 94,
formation: '4-3-3',
      players: [
        { name: 'Matvey Safonov', pos: 'GK' },
        { name: 'Achraf Hakimi', pos: 'DF' },
        { name: 'Marquinhos', pos: 'DF' },
        { name: 'Willian Pacho', pos: 'DF' },
        { name: 'Nuno Mendes', pos: 'DF' },
        { name: 'Warren Zaire-Emery', pos: 'MF' },
        { name: 'Vitinha', pos: 'MF' },
        { name: 'João Neves', pos: 'MF' },
        { name: 'Ousmane Dembélé', pos: 'FW' },
        { name: 'Khvicha Kvaratskhelia', pos: 'FW' },
        { name: 'Désiré Doué', pos: 'FW' },
        { name: 'Lucas Chevalier', pos: 'GK' },
        { name: 'Lucas Digne', pos: 'DF' },
        { name: 'Fabián Ruiz', pos: 'MF' },
        { name: 'Maghnes Akliouche', pos: 'FW' },
          { name: 'Arnau Tenas', pos: 'GK' },
          { name: 'Presnel Kimpembe', pos: 'DF' },
          { name: 'Nordi Mukiele', pos: 'DF' },
          { name: 'Milan Skriniar', pos: 'DF' },
          { name: 'Lee Kang-in', pos: 'MF' },
          { name: 'Senny Mayulu', pos: 'MF' },
          { name: 'Randal Kolo Muani', pos: 'FW' },
          { name: 'Goncalo Ramos', pos: 'FW' }
      ]
    },
    {
      id: 'bayern', name: 'Bayern Munich', nameZh: '拜仁慕尼黑',
      country: '德国', flag: '🇩🇪', pot: 1, strength: 91,
      players: [
        { name: 'Manuel Neuer', pos: 'GK' },
        { name: 'Konrad Laimer', pos: 'DF' },
        { name: 'Dayot Upamecano', pos: 'DF' },
        { name: 'Jonathan Tah', pos: 'DF' },
        { name: 'Alphonso Davies', pos: 'DF' },
        { name: 'Joshua Kimmich', pos: 'MF' },
        { name: 'Aleksandar Pavlovic', pos: 'MF' },
        { name: 'Ismael Saibari', pos: 'MF' },
        { name: 'Michael Olise', pos: 'FW' },
        { name: 'Harry Kane', pos: 'FW' },
        { name: 'Luis Díaz', pos: 'FW' },
        { name: 'Jonas Urbig', pos: 'GK' },
        { name: 'Nathaniel Brown', pos: 'DF' },
        { name: 'Jamal Musiala', pos: 'MF' },
        { name: 'Serge Gnabry', pos: 'FW' }
      ]
    },
    {
      id: 'real-madrid', name: 'Real Madrid', nameZh: '皇家马德里',
      country: '西班牙', flag: '🇪🇸', pot: 1, strength: 94,
      players: [
        { name: 'Thibaut Courtois', pos: 'GK' },
        { name: 'Denzel Dumfries', pos: 'DF' },
        { name: 'Ibrahima Konaté', pos: 'DF' },
        { name: 'Dean Huijsen', pos: 'DF' },
        { name: 'Álvaro Carreras', pos: 'DF' },
        { name: 'Federico Valverde', pos: 'MF' },
        { name: 'Bernardo Silva', pos: 'MF' },
        { name: 'Jude Bellingham', pos: 'MF' },
        { name: 'Vinícius Júnior', pos: 'FW' },
        { name: 'Kylian Mbappé', pos: 'FW' },
        { name: 'Arda Güler', pos: 'FW' },
        { name: 'Andriy Lunin', pos: 'GK' },
        { name: 'Trent Alexander-Arnold', pos: 'DF' },
        { name: 'Eduardo Camavinga', pos: 'MF' },
        { name: 'Rodrygo', pos: 'FW' }
      ]
    },
    {
      id: 'liverpool', name: 'Liverpool', nameZh: '利物浦',
      country: '英格兰', flag: '🇬🇧', pot: 1, strength: 91,
      players: [
        { name: 'Alisson', pos: 'GK' },
        { name: 'Jeremie Frimpong', pos: 'DF' },
        { name: 'Jeremy Jacquet', pos: 'DF' },
        { name: 'Virgil van Dijk', pos: 'DF' },
        { name: 'Milos Kerkez', pos: 'DF' },
        { name: 'Ryan Gravenberch', pos: 'MF' },
        { name: 'Dominik Szoboszlai', pos: 'MF' },
        { name: 'Florian Wirtz', pos: 'MF' },
        { name: 'Rio Ngumoha', pos: 'FW' },
        { name: 'Alexander Isak', pos: 'FW' },
        { name: 'Cody Gakpo', pos: 'FW' },
        { name: 'Giorgi Mamardashvili', pos: 'GK' },
        { name: 'Ronald Araújo', pos: 'DF' },
        { name: 'Alexis Mac Allister', pos: 'MF' },
        { name: 'Víctor Muñoz', pos: 'FW' }
      ]
    },
    {
      id: 'inter', name: 'Inter Milan', nameZh: '国际米兰',
      country: '意大利', flag: '🇮🇹', pot: 1, strength: 92,
      players: [
        { name: 'Josep Martínez', pos: 'GK' },
        { name: 'Yann Bisseck', pos: 'DF' },
        { name: 'Manuel Akanji', pos: 'DF' },
        { name: 'Alessandro Bastoni', pos: 'DF' },
        { name: 'Federico Dimarco', pos: 'DF' },
        { name: 'Andy Diouf', pos: 'DF' },
        { name: 'Nicolò Barella', pos: 'MF' },
        { name: 'Hakan Çalhanoğlu', pos: 'MF' },
        { name: 'Piotr Zieliński', pos: 'MF' },
        { name: 'Lautaro Martínez', pos: 'FW' },
        { name: 'Francesco Pio Esposito', pos: 'FW' },
        { name: 'Ivan Provedel', pos: 'GK' },
        { name: 'Curtis Jones', pos: 'MF' },
        { name: 'Marcus Thuram', pos: 'FW' },
        { name: 'Ange-Yoan Bonny', pos: 'FW' }
      ]
    },
    {
      id: 'man-city', name: 'Manchester City', nameZh: '曼城',
      country: '英格兰', flag: '🇬🇧', pot: 1, strength: 93,
      players: [
        { name: 'Gianluigi Donnarumma', pos: 'GK' },
        { name: 'Abdukodir Khusanov', pos: 'DF' },
        { name: 'Rúben Dias', pos: 'DF' },
        { name: 'Marc Guéhi', pos: 'DF' },
        { name: 'Joško Gvardiol', pos: 'DF' },
        { name: 'Rico Lewis', pos: 'MF' },
        { name: 'Elliot Anderson', pos: 'MF' },
        { name: 'Nico O\'Reilly', pos: 'MF' },
        { name: 'Antoine Semenyo', pos: 'FW' },
        { name: 'Erling Haaland', pos: 'FW' },
        { name: 'Phil Foden', pos: 'FW' },
        { name: 'Gerónimo Rulli', pos: 'GK' },
        { name: 'Matheus Nunes', pos: 'DF' },
        { name: 'Mateo Kovačić', pos: 'MF' },
        { name: 'Jérémy Doku', pos: 'FW' }
      ]
    },
    {
      id: 'arsenal', name: 'Arsenal', nameZh: '阿森纳',
      country: '英格兰', flag: '🇬🇧', pot: 1, strength: 90,
      players: [
        { name: 'David Raya', pos: 'GK' },
        { name: 'Ben White', pos: 'DF' },
        { name: 'William Saliba', pos: 'DF' },
        { name: 'Gabriel Magalhães', pos: 'DF' },
        { name: 'Riccardo Calafiori', pos: 'DF' },
        { name: 'Martin Ødegaard', pos: 'MF' },
        { name: 'Declan Rice', pos: 'MF' },
        { name: 'Bruno Guimarães', pos: 'MF' },
        { name: 'Bukayo Saka', pos: 'FW' },
        { name: 'Kai Havertz', pos: 'FW' },
        { name: 'Christos Tzolis', pos: 'FW' },
        { name: 'Illan Meslier', pos: 'GK' },
        { name: 'Jurriën Timber', pos: 'DF' },
        { name: 'Myles Lewis-Skelly', pos: 'MF' },
        { name: 'Viktor Gyökeres', pos: 'FW' }
      ]
    },
    {
      id: 'barcelona', name: 'Barcelona', nameZh: '巴塞罗那',
      country: '西班牙', flag: '🇪🇸', pot: 1, strength: 92,
      players: [
        { name: 'Joan García', pos: 'GK' },
        { name: 'Jules Koundé', pos: 'DF' },
        { name: 'Pau Cubarsí', pos: 'DF' },
        { name: 'Eric García', pos: 'DF' },
        { name: 'Alejandro Balde', pos: 'DF' },
        { name: 'Rodri', pos: 'MF' },
        { name: 'Pedri', pos: 'MF' },
        { name: 'Dani Olmo', pos: 'MF' },
        { name: 'Lamine Yamal', pos: 'FW' },
        { name: 'Raphinha', pos: 'FW' },
        { name: 'Anthony Gordon', pos: 'FW' },
        { name: 'Wojciech Szczęsny', pos: 'GK' },
        { name: 'João Cancelo', pos: 'DF' },
        { name: 'Frenkie de Jong', pos: 'MF' },
        { name: 'Karim Adeyemi', pos: 'FW' }
      ]
    },
    {
      id: 'atletico', name: 'Atlético Madrid', nameZh: '马德里竞技',
      country: '西班牙', flag: '🇪🇸', pot: 1, strength: 88,
      players: [
        { name: 'Jan Oblak', pos: 'GK' },
        { name: 'Marcos Llorente', pos: 'DF' },
        { name: 'Dávid Hancko', pos: 'DF' },
        { name: 'Robin Le Normand', pos: 'DF' },
        { name: 'Álex Grimaldo', pos: 'DF' },
        { name: 'Pablo Barrios', pos: 'MF' },
        { name: 'Koke', pos: 'MF' },
        { name: 'Morten Hjulmand', pos: 'MF' },
        { name: 'Ademola Lookman', pos: 'FW' },
        { name: 'Julián Álvarez', pos: 'FW' },
        { name: 'Alexander Sørloth', pos: 'FW' },
        { name: 'Juan Musso', pos: 'GK' },
        { name: 'Cristian Romero', pos: 'DF' },
        { name: 'Lee Kang-in', pos: 'MF' },
        { name: 'Álex Baena', pos: 'FW' }
      ]
    },

    /* ================= 第二档 ================= */
    {
      id: 'dortmund', name: 'Borussia Dortmund', nameZh: '多特蒙德',
      country: '德国', flag: '🇩🇪', pot: 2, strength: 87,
      players: [
        { name: 'Gregor Kobel', pos: 'GK' },
        { name: 'Ramy Bensebaini', pos: 'DF' },
        { name: 'Waldemar Anton', pos: 'DF' },
        { name: 'Nico Schlotterbeck', pos: 'DF' },
        { name: 'Julian Ryerson', pos: 'DF' },
        { name: 'Felix Nmecha', pos: 'MF' },
        { name: 'Jobe Bellingham', pos: 'MF' },
        { name: 'Joey Veerman', pos: 'MF' },
        { name: 'Konstantinos Karetsas', pos: 'FW' },
        { name: 'Serhou Guirassy', pos: 'FW' },
        { name: 'Giannis Konstantelias', pos: 'FW' },
        { name: 'Alexander Meyer', pos: 'GK' },
        { name: 'Joane Gadou', pos: 'DF' },
        { name: 'Emre Can', pos: 'MF' },
        { name: 'Maximilian Beier', pos: 'FW' }
      ]
    },
    {
      id: 'roma', name: 'Roma', nameZh: '罗马',
      country: '意大利', flag: '🇮🇹', pot: 2, strength: 85,
      players: [
        { name: 'Mile Svilar', pos: 'GK' },
        { name: 'Mario Hermoso', pos: 'DF' },
        { name: 'Gianluca Mancini', pos: 'DF' },
        { name: 'Evan Ndicka', pos: 'DF' },
        { name: 'Nahuel Molina', pos: 'DF' },
        { name: 'Wesley', pos: 'DF' },
        { name: 'Bryan Cristante', pos: 'MF' },
        { name: 'Manu Koné', pos: 'MF' },
        { name: 'Rodrigo Mora', pos: 'FW' },
        { name: 'Paulo Dybala', pos: 'FW' },
        { name: 'Donyell Malen', pos: 'FW' },
        { name: 'Pierluigi Gollini', pos: 'GK' },
        { name: 'Lorenzo Pellegrini', pos: 'MF' },
        { name: 'Niccolò Pisilli', pos: 'MF' },
        { name: 'Santiago Castro', pos: 'FW' }
      ]
    },
    {
      id: 'sporting', name: 'Sporting CP', nameZh: '葡萄牙体育',
      country: '葡萄牙', flag: '🇵🇹', pot: 2, strength: 85,
      players: [
        { name: 'Rui Silva', pos: 'GK' },
        { name: 'Iván Fresneda', pos: 'DF' },
        { name: 'Zeno Debast', pos: 'DF' },
        { name: 'Gonçalo Inácio', pos: 'DF' },
        { name: 'Maxi Araújo', pos: 'DF' },
        { name: 'Sergi Altimira', pos: 'MF' },
        { name: 'Issa Doumbia', pos: 'MF' },
        { name: 'Rodrigo Zalazar', pos: 'MF' },
        { name: 'Geny Catamo', pos: 'FW' },
        { name: 'Luis Suárez', pos: 'FW' },
        { name: 'Flávio Gonçalves', pos: 'FW' },
        { name: 'Kaique Pereira', pos: 'GK' },
        { name: 'Ibrahima Ba', pos: 'DF' },
        { name: 'Silas Andersen', pos: 'MF' },
        { name: 'Fotis Ioannidis', pos: 'FW' }
      ]
    },
    {
      id: 'aston-villa', name: 'Aston Villa', nameZh: '阿斯顿维拉',
      country: '英格兰', flag: '🇬🇧', pot: 2, strength: 86,
      players: [
        { name: 'Marco Bizot', pos: 'GK' },
        { name: 'Matty Cash', pos: 'DF' },
        { name: 'Victor Lindelöf', pos: 'DF' },
        { name: 'Pau Torres', pos: 'DF' },
        { name: 'Ian Maatsen', pos: 'DF' },
        { name: 'Boubacar Kamara', pos: 'MF' },
        { name: 'João Gomes', pos: 'MF' },
        { name: 'John McGinn', pos: 'MF' },
        { name: 'Nicolas Jackson', pos: 'FW' },
        { name: 'Alejandro Garnacho', pos: 'FW' },
        { name: 'Emiliano Buendía', pos: 'FW' },
        { name: 'Zion Suzuki', pos: 'GK' },
        { name: 'Matteo Ruggeri', pos: 'DF' },
        { name: 'Leon Goretzka', pos: 'MF' },
        { name: 'Tammy Abraham', pos: 'FW' }
      ]
    },
    {
      id: 'porto', name: 'Porto', nameZh: '波尔图',
      country: '葡萄牙', flag: '🇵🇹', pot: 2, strength: 85,
      players: [
        { name: 'Diogo Costa', pos: 'GK' },
        { name: 'Alberto Costa', pos: 'DF' },
        { name: 'Jan Bednarek', pos: 'DF' },
        { name: 'Jakub Kiwior', pos: 'DF' },
        { name: 'Zaidu', pos: 'DF' },
        { name: 'Pablo Rosario', pos: 'MF' },
        { name: 'Victor Froholdt', pos: 'MF' },
        { name: 'Gabri Veiga', pos: 'MF' },
        { name: 'William Gomes', pos: 'FW' },
        { name: 'Pepê', pos: 'FW' },
        { name: 'Santiago Giménez', pos: 'FW' },
        { name: 'Cláudio Ramos', pos: 'GK' },
        { name: 'Martim Fernandes', pos: 'DF' },
        { name: 'Alan Varela', pos: 'MF' },
        { name: 'André Silva', pos: 'FW' }
      ]
    },
    {
      id: 'man-united', name: 'Manchester United', nameZh: '曼联',
      country: '英格兰', flag: '🇬🇧', pot: 2, strength: 88,
      players: [
        { name: 'Senne Lammens', pos: 'GK' },
        { name: 'Noussair Mazraoui', pos: 'DF' },
        { name: 'Harry Maguire', pos: 'DF' },
        { name: 'Ayden Heaven', pos: 'DF' },
        { name: 'Luke Shaw', pos: 'DF' },
        { name: 'Youri Tielemans', pos: 'MF' },
        { name: 'Andrey Santos', pos: 'MF' },
        { name: 'Bruno Fernandes', pos: 'MF' },
        { name: 'Matheus Cunha', pos: 'FW' },
        { name: 'Bryan Mbeumo', pos: 'FW' },
        { name: 'Patrick Dorgu', pos: 'FW' },
        { name: 'Karl Darlow', pos: 'GK' },
        { name: 'Lisandro Martínez', pos: 'DF' },
        { name: 'Kobbie Mainoo', pos: 'MF' },
        { name: 'Benjamin Sesko', pos: 'FW' }
      ]
    },
    {
      id: 'club-brugge', name: 'Club Brugge', nameZh: '布鲁日',
      country: '比利时', flag: '🇧🇪', pot: 2, strength: 82,
      players: [
        { name: 'Yann Sommer', pos: 'GK' },
        { name: 'Kyriani Sabbe', pos: 'DF' },
        { name: 'Han-beom Lee', pos: 'DF' },
        { name: 'Brandon Mechele', pos: 'DF' },
        { name: 'Joaquin Seys', pos: 'DF' },
        { name: 'Freddie Potts', pos: 'MF' },
        { name: 'Hans Vanaken', pos: 'MF' },
        { name: 'Hugo Vetlesen', pos: 'MF' },
        { name: 'Carlos Forbs', pos: 'FW' },
        { name: 'Nicolò Tresoldi', pos: 'FW' },
        { name: 'Mamady Diakhon', pos: 'FW' },
        { name: 'Nordin Jackers', pos: 'GK' },
        { name: 'Joel Ordóñez', pos: 'DF' },
        { name: 'Cheveyo Tsawa', pos: 'MF' },
        { name: 'Jan Virgili', pos: 'FW' }
      ]
    },
    {
      id: 'real-betis', name: 'Real Betis', nameZh: '皇家贝蒂斯',
      country: '西班牙', flag: '🇪🇸', pot: 2, strength: 84,
      players: [
        { name: 'Álvaro Valles', pos: 'GK' },
        { name: 'Héctor Bellerín', pos: 'DF' },
        { name: 'Marc Bartra', pos: 'DF' },
        { name: 'Natan', pos: 'DF' },
        { name: 'Fran García', pos: 'DF' },
        { name: 'Facundo Bernal', pos: 'MF' },
        { name: 'Marc Roca', pos: 'MF' },
        { name: 'Isco', pos: 'MF' },
        { name: 'Antony', pos: 'FW' },
        { name: 'Rodrigo Riquelme', pos: 'FW' },
        { name: 'Troy Parrott', pos: 'FW' },
        { name: 'Diego Conde', pos: 'GK' },
        { name: 'Ángel Ortiz', pos: 'DF' },
        { name: 'Pablo Fornals', pos: 'MF' },
        { name: 'Cucho Hernández', pos: 'FW' }
      ]
    },
    {
      id: 'psv', name: 'PSV Eindhoven', nameZh: '埃因霍温',
      country: '荷兰', flag: '🇳🇱', pot: 2, strength: 85,
      players: [
        { name: 'Matej Kovář', pos: 'GK' },
        { name: 'Sergiño Dest', pos: 'DF' },
        { name: 'Armando Obispo', pos: 'DF' },
        { name: 'Ryan Flamingo', pos: 'DF' },
        { name: 'Mauro Júnior', pos: 'DF' },
        { name: 'Guus Til', pos: 'MF' },
        { name: 'Kodai Sano', pos: 'MF' },
        { name: 'Noah Fernandez', pos: 'MF' },
        { name: 'Ruben van Bommel', pos: 'FW' },
        { name: 'Ricardo Pepi', pos: 'FW' },
        { name: 'Ivan Perišić', pos: 'FW' },
        { name: 'Nick Olij', pos: 'GK' },
        { name: 'Lutsharel Geertruida', pos: 'DF' },
        { name: 'Sven Mijnans', pos: 'MF' },
        { name: 'Filip Kostić', pos: 'FW' }
      ]
    },

    /* ================= 第三档 ================= */
    {
      id: 'feyenoord', name: 'Feyenoord', nameZh: '费耶诺德',
      country: '荷兰', flag: '🇳🇱', pot: 3, strength: 83,
      players: [
        { name: 'Tjark Ernst', pos: 'GK' },
        { name: 'Givairo Read', pos: 'DF' },
        { name: 'Jeremiah St. Juste', pos: 'DF' },
        { name: 'Tsuyoshi Watanabe', pos: 'DF' },
        { name: 'Mika Mármol', pos: 'DF' },
        { name: 'Charles Vanhoutte', pos: 'MF' },
        { name: 'Gjivai Zechiël', pos: 'MF' },
        { name: 'Luciano Valente', pos: 'MF' },
        { name: 'Anis Hadj Moussa', pos: 'FW' },
        { name: 'Nacho Ferri', pos: 'FW' },
        { name: 'Gaoussou Diarra', pos: 'FW' },
        { name: 'Oussama Targhalline', pos: 'MF' },
        { name: 'Thijs Kraaijeveld', pos: 'DF' },
        { name: 'Liam Bossin', pos: 'GK' },
        { name: 'Raheem Sterling', pos: 'FW' }
      ]
    },
    {
      id: 'lille', name: 'Lille', nameZh: '里尔',
      country: '法国', flag: '🇫🇷', pot: 3, strength: 83,
      players: [
        { name: 'Berke Özer', pos: 'GK' },
        { name: 'Tiago Santos', pos: 'DF' },
        { name: 'Nathan Ngoy', pos: 'DF' },
        { name: 'Alexsandro', pos: 'DF' },
        { name: 'Romain Perraud', pos: 'DF' },
        { name: 'Benjamin André', pos: 'MF' },
        { name: 'Nabil Bentaleb', pos: 'MF' },
        { name: 'Hákon Haraldsson', pos: 'MF' },
        { name: 'Ethan Mbappé', pos: 'FW' },
        { name: 'Olivier Giroud', pos: 'FW' },
        { name: 'Başar Önal', pos: 'FW' },
        { name: 'Ngal\'ayel Mukau', pos: 'MF' },
        { name: 'Loun Srdanovic', pos: 'DF' },
        { name: 'Orlando Gill', pos: 'GK' },
        { name: 'Ayase Ueda', pos: 'FW' }
      ]
    },
    {
      id: 'napoli', name: 'Napoli', nameZh: '那不勒斯',
      country: '意大利', flag: '🇮🇹', pot: 3, strength: 87,
      players: [
        { name: 'Alex Meret', pos: 'GK' },
        { name: 'Giovanni Di Lorenzo', pos: 'DF' },
        { name: 'Amir Rrahmani', pos: 'DF' },
        { name: 'Sam Beukema', pos: 'DF' },
        { name: 'Leonardo Spinazzola', pos: 'DF' },
        { name: 'Kevin De Bruyne', pos: 'MF' },
        { name: 'Stanislav Lobotka', pos: 'MF' },
        { name: 'Scott McTominay', pos: 'MF' },
        { name: 'Matteo Politano', pos: 'FW' },
        { name: 'Rasmus Højlund', pos: 'FW' },
        { name: 'Alisson Santos', pos: 'FW' },
        { name: 'Benoît Badiashile', pos: 'DF' },
        { name: 'Frank Anguissa', pos: 'MF' },
        { name: 'Vanja Milinković-Savić', pos: 'GK' },
        { name: 'Noa Lang', pos: 'FW' }
      ]
    },
    {
      id: 'leipzig', name: 'RB Leipzig', nameZh: '莱比锡红牛',
      country: '德国', flag: '🇩🇪', pot: 3, strength: 86,
      players: [
        { name: 'Maarten Vandevoordt', pos: 'GK' },
        { name: 'Ridle Baku', pos: 'DF' },
        { name: 'Willi Orbán', pos: 'DF' },
        { name: 'Castello Lukeba', pos: 'DF' },
        { name: 'David Raum', pos: 'DF' },
        { name: 'Rocco Reitz', pos: 'MF' },
        { name: 'Nicolas Seiwald', pos: 'MF' },
        { name: 'Ezechiel Banzuzi', pos: 'MF' },
        { name: 'Brajan Gruda', pos: 'FW' },
        { name: 'Tidiam Gomis', pos: 'FW' },
        { name: 'Antonio Nusa', pos: 'FW' },
        { name: 'Maxime Estève', pos: 'DF' },
        { name: 'Arthur Vermeeren', pos: 'MF' },
        { name: 'Ørjan Nyland', pos: 'GK' },
        { name: 'Christopher Nkunku', pos: 'FW' }
      ]
    },
    {
      id: 'villarreal', name: 'Villarreal', nameZh: '比利亚雷亚尔',
      country: '西班牙', flag: '🇪🇸', pot: 3, strength: 85,
      players: [
        { name: 'Luiz Júnior', pos: 'GK' },
        { name: 'Santiago Mouriño', pos: 'DF' },
        { name: 'Juan Foyth', pos: 'DF' },
        { name: 'Renato Veiga', pos: 'DF' },
        { name: 'Carlos Romero', pos: 'DF' },
        { name: 'Pape Gueye', pos: 'MF' },
        { name: 'Santi Comesaña', pos: 'MF' },
        { name: 'Alberto Moleiro', pos: 'MF' },
        { name: 'Nicolas Pépé', pos: 'FW' },
        { name: 'Ayoze Pérez', pos: 'FW' },
        { name: 'Georges Mikautadze', pos: 'FW' },
        { name: 'Logan Costa', pos: 'DF' },
        { name: 'Nathan Saliba', pos: 'MF' },
        { name: 'Péter Gulácsi', pos: 'GK' },
        { name: 'Gerard Moreno', pos: 'FW' }
      ]
    },
    {
      id: 'shakhtar', name: 'Shakhtar Donetsk', nameZh: '顿涅茨克矿工',
      country: '乌克兰', flag: '🇺🇦', pot: 3, strength: 81,
      players: [
        { name: 'Dmytro Riznyk', pos: 'GK' },
        { name: 'Vinícius Tobias', pos: 'DF' },
        { name: 'Alaa Ghram', pos: 'DF' },
        { name: 'Valeriy Bondar', pos: 'DF' },
        { name: 'Mykola Matviyenko', pos: 'DF' },
        { name: 'Marlon Gomes', pos: 'MF' },
        { name: 'Oleh Ocheretko', pos: 'MF' },
        { name: 'Isaque', pos: 'MF' },
        { name: 'Newertton', pos: 'FW' },
        { name: 'Kaua Elias', pos: 'FW' },
        { name: 'Gleiker Mendoza', pos: 'FW' },
        { name: 'Dmytro Kryskiv', pos: 'MF' },
        { name: 'Irakli Azarovi', pos: 'DF' },
        { name: 'Kiril Fesiun', pos: 'GK' },
        { name: 'Eguinaldo', pos: 'FW' }
      ]
    },
    {
      id: 'galatasaray', name: 'Galatasaray', nameZh: '加拉塔萨雷',
      country: '土耳其', flag: '🇹🇷', pot: 3, strength: 84,
      players: [
        { name: 'Uğurcan Çakır', pos: 'GK' },
        { name: 'Wilfried Singo', pos: 'DF' },
        { name: 'Davinson Sánchez', pos: 'DF' },
        { name: 'Abdülkerim Bardakcı', pos: 'DF' },
        { name: 'Ismail Jakobs', pos: 'DF' },
        { name: 'Lucas Torreira', pos: 'MF' },
        { name: 'Mario Lemina', pos: 'MF' },
        { name: 'Gabriel Sara', pos: 'MF' },
        { name: 'Barış Alper Yılmaz', pos: 'FW' },
        { name: 'Victor Osimhen', pos: 'FW' },
        { name: 'Rafael Leão', pos: 'FW' },
        { name: 'Jankat Yılmaz', pos: 'GK' },
        { name: 'Eren Elmalı', pos: 'DF' },
        { name: 'Lesley Ugochukwu', pos: 'MF' },
        { name: 'Yunus Akgün', pos: 'FW' }
      ]
    },
    {
      id: 'bodo-glimt', name: 'Bodø/Glimt', nameZh: '博德闪耀',
      country: '挪威', flag: '🇳🇴', pot: 3, strength: 79,
      players: [
        { name: 'Nikita Haikin', pos: 'GK' },
        { name: 'Fredrik Sjøvold', pos: 'DF' },
        { name: 'Villads Nielsen', pos: 'DF' },
        { name: 'Odin Bjørtuft', pos: 'DF' },
        { name: 'Fredrik Bjørkan', pos: 'DF' },
        { name: 'Sondre Auklend', pos: 'MF' },
        { name: 'Patrick Berg', pos: 'MF' },
        { name: 'Sondre Brunstad Fet', pos: 'MF' },
        { name: 'Ole Didrik Blomberg', pos: 'FW' },
        { name: 'Andreas Helmersen', pos: 'FW' },
        { name: 'Jens Petter Hauge', pos: 'FW' },
        { name: 'Julian Faye Lund', pos: 'GK' },
        { name: 'Jostein Gundersen', pos: 'DF' },
        { name: 'Håkon Evjen', pos: 'MF' },
        { name: 'Ola Brynhildsen', pos: 'FW' }
      ]
    },
    {
      id: 'fenerbahce', name: 'Fenerbahçe', nameZh: '费内巴切',
      country: '土耳其', flag: '🇹🇷', pot: 3, strength: 84,
      players: [
        { name: 'Ederson', pos: 'GK' },
        { name: 'Nelson Semedo', pos: 'DF' },
        { name: 'Milan Skriniar', pos: 'DF' },
        { name: 'Nathan Aké', pos: 'DF' },
        { name: 'Archie Brown', pos: 'DF' },
        { name: 'N\'Golo Kante', pos: 'MF' },
        { name: 'Matteo Guendouzi', pos: 'MF' },
        { name: 'Anderson Talisca', pos: 'MF' },
        { name: 'Mason Greenwood', pos: 'FW' },
        { name: 'Vedat Muriqi', pos: 'FW' },
        { name: 'Kerem Aktürkoğlu', pos: 'FW' },
        { name: 'Mert Günok', pos: 'GK' },
        { name: 'Jayden Oosterwolde', pos: 'DF' },
        { name: 'Fred', pos: 'MF' },
        { name: 'Marco Asensio', pos: 'FW' }
      ]
    },

    /* ================= 第四档 ================= */
    {
      id: 'slavia', name: 'Slavia Prague', nameZh: '布拉格斯拉维亚',
      country: '捷克', flag: '🇨🇿', pot: 4, strength: 78,
      players: [
        { name: 'Jakub Markovič', pos: 'GK' },
        { name: 'Tomáš Vlček', pos: 'DF' },
        { name: 'David Zima', pos: 'DF' },
        { name: 'Štěpán Chaloupek', pos: 'DF' },
        { name: 'Ange N\'Guessan', pos: 'DF' },
        { name: 'Lukáš Provod', pos: 'MF' },
        { name: 'Michal Sadílek', pos: 'MF' },
        { name: 'Wiktor Nowak', pos: 'MF' },
        { name: 'Emmanuel Ayaosi', pos: 'FW' },
        { name: 'Danijel Šturm', pos: 'FW' },
        { name: 'Adonija Ouanda', pos: 'FW' },
        { name: 'Jindřich Staněk', pos: 'GK' },
        { name: 'Igoh Ogbu', pos: 'DF' },
        { name: 'Toumani Diakité', pos: 'MF' },
        { name: 'Mojmír Chytil', pos: 'FW' }
      ]
    },
    {
      id: 'stuttgart', name: 'VfB Stuttgart', nameZh: '斯图加特',
      country: '德国', flag: '🇩🇪', pot: 4, strength: 83,
      players: [
        { name: 'Fabian Bredlow', pos: 'GK' },
        { name: 'Josha Vagnoman', pos: 'DF' },
        { name: 'Finn Jeltsch', pos: 'DF' },
        { name: 'Jeff Chabot', pos: 'DF' },
        { name: 'Maximilian Mittelstädt', pos: 'DF' },
        { name: 'Grischa Prömel', pos: 'MF' },
        { name: 'Angelo Stiller', pos: 'MF' },
        { name: 'Atakan Karazor', pos: 'MF' },
        { name: 'Tiago Tomás', pos: 'FW' },
        { name: 'Deniz Undav', pos: 'FW' },
        { name: 'Dženan Pejčinović', pos: 'FW' },
        { name: 'Dennis Seimen', pos: 'GK' },
        { name: 'Ramon Hendriks', pos: 'DF' },
        { name: 'Bilal El Khannouss', pos: 'MF' },
        { name: 'Chris Führich', pos: 'FW' }
      ]
    },
    {
      id: 'lask', name: 'LASK', nameZh: '林茨',
      country: '奥地利', flag: '🇦🇹', pot: 4, strength: 77,
      players: [
        { name: 'Lukas Jungwirth', pos: 'GK' },
        { name: 'Kasper Jörgensen', pos: 'DF' },
        { name: 'Xavier Mbuyamba', pos: 'DF' },
        { name: 'Joao Tornich', pos: 'DF' },
        { name: 'George Bello', pos: 'DF' },
        { name: 'Melayro Bogarde', pos: 'MF' },
        { name: 'Sascha Horvath', pos: 'MF' },
        { name: 'Robert Ljubičić', pos: 'MF' },
        { name: 'Samuel Adeniran', pos: 'FW' },
        { name: 'Moses Usor', pos: 'FW' },
        { name: 'Christoph Lang', pos: 'FW' },
        { name: 'Tobias Schützenauer', pos: 'GK' },
        { name: 'Andrés Andrade', pos: 'DF' },
        { name: 'Alessandro Schöpf', pos: 'MF' },
        { name: 'Florian Flecker', pos: 'FW' }
      ]
    },
    {
      id: 'como', name: 'Como', nameZh: '科莫',
      country: '意大利', flag: '🇮🇹', pot: 4, strength: 80,
      players: [
        { name: 'Jean Butez', pos: 'GK' },
        { name: 'Yan Couto', pos: 'DF' },
        { name: 'Jacobo Ramón', pos: 'DF' },
        { name: 'Trevoh Chalobah', pos: 'DF' },
        { name: 'Álex Valle', pos: 'DF' },
        { name: 'Luis Milla', pos: 'MF' },
        { name: 'Lucas Da Cunha', pos: 'MF' },
        { name: 'Martin Baturina', pos: 'MF' },
        { name: 'Assane Diao', pos: 'FW' },
        { name: 'Nico Paz', pos: 'FW' },
        { name: 'Anastasios Douvikas', pos: 'FW' },
        { name: 'Emil Audero', pos: 'GK' },
        { name: 'Marc-Oliver Kempf', pos: 'DF' },
        { name: 'Maxence Caqueret', pos: 'MF' },
        { name: 'Jesús Rodríguez', pos: 'FW' }
      ]
    },
    {
      id: 'lens', name: 'Lens', nameZh: '朗斯',
      country: '法国', flag: '🇫🇷', pot: 4, strength: 81,
      players: [
        { name: 'Robin Risser', pos: 'GK' },
        { name: 'Saud Abdulhamid', pos: 'DF' },
        { name: 'Ismaëlo Ganiou', pos: 'DF' },
        { name: 'Maik Nawrocki', pos: 'DF' },
        { name: 'Matthieu Udol', pos: 'DF' },
        { name: 'Michaël Cuisance', pos: 'MF' },
        { name: 'Yacine Titraoui', pos: 'MF' },
        { name: 'Amadou Haidara', pos: 'MF' },
        { name: 'Florian Thauvin', pos: 'FW' },
        { name: 'Abdallah Sima', pos: 'FW' },
        { name: 'Franjo Ivanović', pos: 'FW' },
        { name: 'Hervé Koffi', pos: 'GK' },
        { name: 'Malang Sarr', pos: 'DF' },
        { name: 'Andrija Bulatović', pos: 'MF' },
        { name: 'Odsonne Édouard', pos: 'FW' }
      ]
    },
    {
      id: 'sabah', name: 'Sabah', nameZh: '萨巴赫',
      country: '阿塞拜疆', flag: '🇦🇿', pot: 4, strength: 70,
      players: [
        { name: 'Stas Pokatilov', pos: 'GK' },
        { name: 'Steve Solvet', pos: 'DF' },
        { name: 'Akim Zedadka', pos: 'DF' },
        { name: 'Rahman Dashdamirov', pos: 'DF' },
        { name: 'Tymoteusz Puchacz', pos: 'DF' },
        { name: 'Umarali Rakhmonaliev', pos: 'MF' },
        { name: 'Ivan Lepinjica', pos: 'MF' },
        { name: 'Veljko Simić', pos: 'MF' },
        { name: 'Kaheem Parris', pos: 'FW' },
        { name: 'Christian Nwachukwu', pos: 'FW' },
        { name: 'Joy-Lance Mickels', pos: 'FW' },
        { name: 'Amin Ramazanov', pos: 'GK' },
        { name: 'Aden McCarthy', pos: 'DF' },
        { name: 'Aleksey Isayev', pos: 'MF' },
        { name: 'Orphé Mbina', pos: 'FW' }
      ]
    },
    {
      id: 'viking', name: 'Viking Stavanger', nameZh: '维京',
      country: '挪威', flag: '🇳🇴', pot: 4, strength: 73,
      players: [
        { name: 'Ľubomír Belko', pos: 'GK' },
        { name: 'Henrik Heggheim', pos: 'DF' },
        { name: 'Gianni Stensness', pos: 'DF' },
        { name: 'Henrik Falchener', pos: 'DF' },
        { name: 'Kristoffer Haugen', pos: 'DF' },
        { name: 'Kristoffer Askildsen', pos: 'MF' },
        { name: 'Zlatko Tripić', pos: 'MF' },
        { name: 'Tobias Moi', pos: 'MF' },
        { name: 'Peter Christiansen', pos: 'FW' },
        { name: 'Niklas Fuglestad', pos: 'FW' },
        { name: 'Simen Kvia-Egeskog', pos: 'FW' },
        { name: 'Arild Østbø', pos: 'GK' },
        { name: 'Anders Bærtelsen', pos: 'DF' },
        { name: 'Joe Bell', pos: 'MF' },
        { name: 'Romano Postema', pos: 'FW' }
      ]
    },
    {
      id: 'slovan', name: 'Slovan Bratislava', nameZh: '布拉迪斯拉发斯洛万',
      country: '斯洛伐克', flag: '🇸🇰', pot: 4, strength: 75,
      players: [
        { name: 'Dominik Takáč', pos: 'GK' },
        { name: 'César Blackman', pos: 'DF' },
        { name: 'Kenan Bajrič', pos: 'DF' },
        { name: 'Svetozar Marković', pos: 'DF' },
        { name: 'Sandro Cruz', pos: 'DF' },
        { name: 'Peter Pokorný', pos: 'MF' },
        { name: 'Alen Mustafić', pos: 'MF' },
        { name: 'Cristian Martínez', pos: 'MF' },
        { name: 'Tigran Barseghyan', pos: 'FW' },
        { name: 'Roman Čerepkai', pos: 'FW' },
        { name: 'Suleiman Camara', pos: 'FW' },
        { name: 'Aleksandar Popović', pos: 'GK' },
        { name: 'Kevin Wimmer', pos: 'DF' },
        { name: 'Rahim Ibrahim', pos: 'MF' },
        { name: 'Andraž Šporar', pos: 'FW' }
      ]
    },
    {
      id: 'aek', name: 'AEK Athens', nameZh: 'AEK雅典',
      country: '希腊', flag: '🇬🇷', pot: 4, strength: 79,
      players: [
        { name: 'Thomas Strakosha', pos: 'GK' },
        { name: 'Lazaros Rota', pos: 'DF' },
        { name: 'Harold Moukoudi', pos: 'DF' },
        { name: 'Filipe Relvas', pos: 'DF' },
        { name: 'Stavros Pilios', pos: 'DF' },
        { name: 'Răzvan Marin', pos: 'MF' },
        { name: 'Lovro Majer', pos: 'MF' },
        { name: 'Milán Vitális', pos: 'MF' },
        { name: 'Boubacar Koita', pos: 'FW' },
        { name: 'Luka Jović', pos: 'FW' },
        { name: 'Barnabás Varga', pos: 'FW' },
        { name: 'Alberto Brignoli', pos: 'GK' },
        { name: 'Babis Lykogiannis', pos: 'DF' },
        { name: 'Kaan Kairinen', pos: 'MF' },
        { name: 'Oleksandr Zubkov', pos: 'FW' }
      ]
    }
  ];

  /* 各队主场球场（2026-27 赛季）。
     特殊说明：顿涅茨克矿工因战争自 2014 年起无法使用顿巴斯竞技场，
     2026-27 赛季欧冠主场比赛租用切尔西的斯坦福桥球场举行。 */
  const STADIUMS = {
    'psg': '王子公园球场',
    'bayern': '安联竞技场',
    'real-madrid': '伯纳乌球场',
    'liverpool': '安菲尔德球场',
    'inter': '梅阿查球场',
    'man-city': '伊蒂哈德球场',
    'arsenal': '酋长球场',
    'barcelona': '诺坎普球场',
    'atletico': '万达大都会球场',
    'dortmund': '威斯特法伦球场',
    'roma': '罗马奥林匹克球场',
    'sporting': '阿尔瓦拉德球场',
    'aston-villa': '维拉公园球场',
    'porto': '巨龙球场',
    'man-united': '老特拉福德球场',
    'club-brugge': '扬·布雷德尔球场',
    'real-betis': '贝尼托·比利亚马林球场',
    'psv': '飞利浦球场',
    'feyenoord': '德奎普球场',
    'lille': '皮埃尔·莫鲁瓦球场',
    'napoli': '马拉多纳球场',
    'leipzig': '红牛竞技场',
    'villarreal': '陶瓷球场',
    'shakhtar': '斯坦福桥球场（伦敦·租用）',
    'galatasaray': 'RAMS公园球场',
    'bodo-glimt': '阿斯普米拉球场',
    'fenerbahce': '萨拉科卢球场',
    'slavia': '伊甸球场',
    'stuttgart': 'MHP竞技场',
    'lask': '雷夫艾森竞技场',
    'como': '西尼加利亚球场',
    'lens': '博拉尔特-德勒利球场',
    'sabah': '银行共和国竞技场',
    'viking': '维京体育场',
    'slovan': '特赫尔内波莱球场',
    'aek': 'OPAP竞技场'
  };
  TEAMS.forEach((t) => {
    if (STADIUMS[t.id]) t.stadium = STADIUMS[t.id];
  });

  global.TEAMS = TEAMS;
})(typeof window !== 'undefined' ? window : globalThis);
