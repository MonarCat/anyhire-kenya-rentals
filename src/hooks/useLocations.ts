import { useState, useEffect } from 'react';

interface Location {
  id: string;
  name: string;
  type: 'county' | 'sub_county' | 'ward';
  parent_id?: string;
  code?: string;
}

// Comprehensive Kenya location data
const hardcodedCounties: Location[] = [
  { id: '1', name: 'Mombasa', type: 'county', code: '001' },
  { id: '2', name: 'Kwale', type: 'county', code: '002' },
  { id: '3', name: 'Kilifi', type: 'county', code: '003' },
  { id: '4', name: 'Tana River', type: 'county', code: '004' },
  { id: '5', name: 'Lamu', type: 'county', code: '005' },
  { id: '6', name: 'Taita Taveta', type: 'county', code: '006' },
  { id: '7', name: 'Garissa', type: 'county', code: '007' },
  { id: '8', name: 'Wajir', type: 'county', code: '008' },
  { id: '9', name: 'Mandera', type: 'county', code: '009' },
  { id: '10', name: 'Marsabit', type: 'county', code: '010' },
  { id: '11', name: 'Isiolo', type: 'county', code: '011' },
  { id: '12', name: 'Meru', type: 'county', code: '012' },
  { id: '13', name: 'Tharaka-Nithi', type: 'county', code: '013' },
  { id: '14', name: 'Embu', type: 'county', code: '014' },
  { id: '15', name: 'Kitui', type: 'county', code: '015' },
  { id: '16', name: 'Machakos', type: 'county', code: '016' },
  { id: '17', name: 'Makueni', type: 'county', code: '017' },
  { id: '18', name: 'Nyandarua', type: 'county', code: '018' },
  { id: '19', name: 'Nyeri', type: 'county', code: '019' },
  { id: '20', name: 'Kirinyaga', type: 'county', code: '020' },
  { id: '21', name: 'Murang\'a', type: 'county', code: '021' },
  { id: '22', name: 'Kiambu', type: 'county', code: '022' },
  { id: '23', name: 'Turkana', type: 'county', code: '023' },
  { id: '24', name: 'West Pokot', type: 'county', code: '024' },
  { id: '25', name: 'Samburu', type: 'county', code: '025' },
  { id: '26', name: 'Trans Nzoia', type: 'county', code: '026' },
  { id: '27', name: 'Uasin Gishu', type: 'county', code: '027' },
  { id: '28', name: 'Elgeyo Marakwet', type: 'county', code: '028' },
  { id: '29', name: 'Nandi', type: 'county', code: '029' },
  { id: '30', name: 'Baringo', type: 'county', code: '030' },
  { id: '31', name: 'Laikipia', type: 'county', code: '031' },
  { id: '32', name: 'Nakuru', type: 'county', code: '032' },
  { id: '33', name: 'Narok', type: 'county', code: '033' },
  { id: '34', name: 'Kajiado', type: 'county', code: '034' },
  { id: '35', name: 'Kericho', type: 'county', code: '035' },
  { id: '36', name: 'Bomet', type: 'county', code: '036' },
  { id: '37', name: 'Kakamega', type: 'county', code: '037' },
  { id: '38', name: 'Vihiga', type: 'county', code: '038' },
  { id: '39', name: 'Bungoma', type: 'county', code: '039' },
  { id: '40', name: 'Busia', type: 'county', code: '040' },
  { id: '41', name: 'Siaya', type: 'county', code: '041' },
  { id: '42', name: 'Kisumu', type: 'county', code: '042' },
  { id: '43', name: 'Homa Bay', type: 'county', code: '043' },
  { id: '44', name: 'Migori', type: 'county', code: '044' },
  { id: '45', name: 'Kisii', type: 'county', code: '045' },
  { id: '46', name: 'Nyamira', type: 'county', code: '046' },
  { id: '47', name: 'Nairobi', type: 'county', code: '047' }
];

const hardcodedSubCounties: { [key: string]: Location[] } = {
  // Kakamega County Sub-Counties
  '37': [
    { id: '37001', name: 'Malava', type: 'sub_county', parent_id: '37' },
    { id: '37002', name: 'Lurambi', type: 'sub_county', parent_id: '37' },
    { id: '37003', name: 'Navakholo', type: 'sub_county', parent_id: '37' },
    { id: '37004', name: 'Mumias West', type: 'sub_county', parent_id: '37' },
    { id: '37005', name: 'Mumias East', type: 'sub_county', parent_id: '37' },
    { id: '37006', name: 'Matungu', type: 'sub_county', parent_id: '37' },
    { id: '37007', name: 'Butere', type: 'sub_county', parent_id: '37' },
    { id: '37008', name: 'Khwisero', type: 'sub_county', parent_id: '37' },
    { id: '37009', name: 'Shinyalu', type: 'sub_county', parent_id: '37' },
    { id: '37010', name: 'Ikolomani', type: 'sub_county', parent_id: '37' },
    { id: '37011', name: 'Lugari', type: 'sub_county', parent_id: '37' },
    { id: '37012', name: 'Likuyani', type: 'sub_county', parent_id: '37' }
  ],
  // Nairobi County Sub-Counties
  '47': [
    { id: '47001', name: 'Westlands', type: 'sub_county', parent_id: '47' },
    { id: '47002', name: 'Dagoretti North', type: 'sub_county', parent_id: '47' },
    { id: '47003', name: 'Dagoretti South', type: 'sub_county', parent_id: '47' },
    { id: '47004', name: 'Langata', type: 'sub_county', parent_id: '47' },
    { id: '47005', name: 'Kibra', type: 'sub_county', parent_id: '47' },
    { id: '47006', name: 'Roysambu', type: 'sub_county', parent_id: '47' },
    { id: '47007', name: 'Kasarani', type: 'sub_county', parent_id: '47' },
    { id: '47008', name: 'Ruaraka', type: 'sub_county', parent_id: '47' },
    { id: '47009', name: 'Embakasi South', type: 'sub_county', parent_id: '47' },
    { id: '47010', name: 'Embakasi North', type: 'sub_county', parent_id: '47' },
    { id: '47011', name: 'Embakasi Central', type: 'sub_county', parent_id: '47' },
    { id: '47012', name: 'Embakasi East', type: 'sub_county', parent_id: '47' },
    { id: '47013', name: 'Embakasi West', type: 'sub_county', parent_id: '47' },
    { id: '47014', name: 'Makadara', type: 'sub_county', parent_id: '47' },
    { id: '47015', name: 'Kamukunji', type: 'sub_county', parent_id: '47' },
    { id: '47016', name: 'Starehe', type: 'sub_county', parent_id: '47' },
    { id: '47017', name: 'Mathare', type: 'sub_county', parent_id: '47' }
  ],
  // Mombasa County Sub-Counties
  '1': [
    { id: '101', name: 'Changamwe', type: 'sub_county', parent_id: '1' },
    { id: '102', name: 'Jomvu', type: 'sub_county', parent_id: '1' },
    { id: '103', name: 'Kisauni', type: 'sub_county', parent_id: '1' },
    { id: '104', name: 'Likoni', type: 'sub_county', parent_id: '1' },
    { id: '105', name: 'Mvita', type: 'sub_county', parent_id: '1' },
    { id: '106', name: 'Nyali', type: 'sub_county', parent_id: '1' }
  ],
  // Kisumu County Sub-Counties
  '42': [
    { id: '4201', name: 'Kisumu Central', type: 'sub_county', parent_id: '42' },
    { id: '4202', name: 'Kisumu East', type: 'sub_county', parent_id: '42' },
    { id: '4203', name: 'Kisumu West', type: 'sub_county', parent_id: '42' },
    { id: '4204', name: 'Seme', type: 'sub_county', parent_id: '42' },
    { id: '4205', name: 'Muhoroni', type: 'sub_county', parent_id: '42' },
    { id: '4206', name: 'Nyando', type: 'sub_county', parent_id: '42' },
    { id: '4207', name: 'Nyakach', type: 'sub_county', parent_id: '42' }
  ],
  // Nakuru County Sub-Counties
  '32': [
    { id: '3201', name: 'Nakuru Town East', type: 'sub_county', parent_id: '32' },
    { id: '3202', name: 'Nakuru Town West', type: 'sub_county', parent_id: '32' },
    { id: '3203', name: 'Njoro', type: 'sub_county', parent_id: '32' },
    { id: '3204', name: 'Molo', type: 'sub_county', parent_id: '32' },
    { id: '3205', name: 'Gilgil', type: 'sub_county', parent_id: '32' },
    { id: '3206', name: 'Naivasha', type: 'sub_county', parent_id: '32' },
    { id: '3207', name: 'Kuresoi South', type: 'sub_county', parent_id: '32' },
    { id: '3208', name: 'Kuresoi North', type: 'sub_county', parent_id: '32' },
    { id: '3209', name: 'Subukia', type: 'sub_county', parent_id: '32' },
    { id: '3210', name: 'Rongai', type: 'sub_county', parent_id: '32' },
    { id: '3211', name: 'Bahati', type: 'sub_county', parent_id: '32' }
  ],
  // Uasin Gishu County Sub-Counties
  '27': [
    { id: '2701', name: 'Ainabkoi', type: 'sub_county', parent_id: '27' },
    { id: '2702', name: 'Kapseret', type: 'sub_county', parent_id: '27' },
    { id: '2703', name: 'Kesses', type: 'sub_county', parent_id: '27' },
    { id: '2704', name: 'Moiben', type: 'sub_county', parent_id: '27' },
    { id: '2705', name: 'Soy', type: 'sub_county', parent_id: '27' },
    { id: '2706', name: 'Turbo', type: 'sub_county', parent_id: '27' }
  ],
  // Kiambu County Sub-Countie
  '22': [
    { id: '2201', name: 'Gatundu North', type: 'sub_county', parent_id: '22' },
    { id: '2202', name: 'Gatundu South', type: 'sub_county', parent_id: '22' },
    { id: '2203', name: 'Githunguri', type: 'sub_county', parent_id: '22' },
    { id: '2204', name: 'Juja', type: 'sub_county', parent_id: '22' },
    { id: '2205', name: 'Kabete', type: 'sub_county', parent_id: '22' },
    { id: '2206', name: 'Kiambaa', type: 'sub_county', parent_id: '22' },
    { id: '2207', name: 'Kiambu', type: 'sub_county', parent_id: '22' },
    { id: '2208', name: 'Kikuyu', type: 'sub_county', parent_id: '22' },
    { id: '2209', name: 'Limuru', type: 'sub_county', parent_id: '22' },
    { id: '2210', name: 'Ruiru', type: 'sub_county', parent_id: '22' },
    { id: '2211', name: 'Thika Town', type: 'sub_county', parent_id: '22' },
    { id: '2212', name: 'Lari', type: 'sub_county', parent_id: '22' }
  ],
  // Machakos County Sub-Counties
  '16': [
    { id: '1601', name: 'Kathiani', type: 'sub_county', parent_id: '16' },
    { id: '1602', name: 'Machakos Town', type: 'sub_county', parent_id: '16' },
    { id: '1603', name: 'Masinga', type: 'sub_county', parent_id: '16' },
    { id: '1604', name: 'Matungulu', type: 'sub_county', parent_id: '16' },
    { id: '1605', name: 'Mavoko', type: 'sub_county', parent_id: '16' },
    { id: '1606', name: 'Mwala', type: 'sub_county', parent_id: '16' },
    { id: '1607', name: 'Yatta', type: 'sub_county', parent_id: '16' },
    { id: '1608', name: 'Kangundo', type: 'sub_county', parent_id: '16' }
  ],
  // Bungoma County Sub-Counties
  '39': [
    { id: '3901', name: 'Bumula', type: 'sub_county', parent_id: '39' },
    { id: '3902', name: 'Kabuchai', type: 'sub_county', parent_id: '39' },
    { id: '3903', name: 'Kanduyi', type: 'sub_county', parent_id: '39' },
    { id: '3904', name: 'Kimilili', type: 'sub_county', parent_id: '39' },
    { id: '3905', name: 'Mt. Elgon', type: 'sub_county', parent_id: '39' },
    { id: '3906', name: 'Sirisia', type: 'sub_county', parent_id: '39' },
    { id: '3907', name: 'Tongaren', type: 'sub_county', parent_id: '39' },
    { id: '3908', name: 'Webuye East', type: 'sub_county', parent_id: '39' },
    { id: '3909', name: 'Webuye West', type: 'sub_county', parent_id: '39' }
  ],
// Nyeri County Sub-Counties
  '19': [
    { id: '1901', name: 'Kieni East', type: 'sub_county', parent_id: '19' },
    { id: '1902', name: 'Kieni West', type: 'sub_county', parent_id: '19' },
    { id: '1903', name: 'Mathira East', type: 'sub_county', parent_id: '19' },
    { id: '1904', name: 'Mathira West', type: 'sub_county', parent_id: '19' },
    { id: '1905', name: 'Mukurweini', type: 'sub_county', parent_id: '19' },
    { id: '1906', name: 'Nyeri Town', type: 'sub_county', parent_id: '19' },
    { id: '1907', name: 'Othaya', type: 'sub_county', parent_id: '19' },
    { id: '1908', name: 'Tetu', type: 'sub_county', parent_id: '19' }
  ],
  // Kajiado County Sub-Counties
  '34': [
    { id: '3401', name: 'Isinya', type: 'sub_county', parent_id: '34' },
    { id: '3402', name: 'Kajiado Central', type: 'sub_county', parent_id: '34' },
    { id: '3403', name: 'Kajiado East', type: 'sub_county', parent_id: '34' },
    { id: '3404', name: 'Kajiado North', type: 'sub_county', parent_id: '34' },
    { id: '3405', name: 'Kajiado West', type: 'sub_county', parent_id: '34' },
    { id: '3406', name: 'Loitokitok', type: 'sub_county', parent_id: '34' },
    { id: '3407', name: 'Mashuuru', type: 'sub_county', parent_id: '34' }
  ],

  // Meru County Sub-Counties
  '12': [
    { id: '1201', name: 'Buuri', type: 'sub_county', parent_id: '12' },
    { id: '1202', name: 'Igembe Central', type: 'sub_county', parent_id: '12' },
    { id: '1203', name: 'Igembe North', type: 'sub_county', parent_id: '12' },
    { id: '1204', name: 'Igembe South', type: 'sub_county', parent_id: '12' },
    { id: '1205', name: 'Imenti Central', type: 'sub_county', parent_id: '12' },
    { id: '1206', name: 'Imenti North', type: 'sub_county', parent_id: '12' },
    { id: '1207', name: 'Imenti South', type: 'sub_county', parent_id: '12' },
    { id: '1208', name: 'Tigania East', type: 'sub_county', parent_id: '12' },
    { id: '1209', name: 'Tigania West', type: 'sub_county', parent_id: '12' }
  ],

  // Kisii County Sub-Counties
  '45': [
    { id: '4501', name: 'Bobasi', type: 'sub_county', parent_id: '45' },
    { id: '4502', name: 'Bomachoge Borabu', type: 'sub_county', parent_id: '45' },
    { id: '4503', name: 'Bomachoge Chache', type: 'sub_county', parent_id: '45' },
    { id: '4504', name: 'Bonchari', type: 'sub_county', parent_id: '45' },
    { id: '4505', name: 'Kitutu Chache North', type: 'sub_county', parent_id: '45' },
    { id: '4506', name: 'Kitutu Chache South', type: 'sub_county', parent_id: '45' },
    { id: '4507', name: 'Nyaribari Chache', type: 'sub_county', parent_id: '45' },
    { id: '4508', name: 'Nyaribari Masaba', type: 'sub_county', parent_id: '45' },
    { id: '4509', name: 'South Mugirango', type: 'sub_county', parent_id: '45' }
  ],
  // Kwale County Sub-Counties
  '2': [
    { id: '201', name: 'Kinango', type: 'sub_county', parent_id: '2' },
    { id: '202', name: 'Lunga Lunga', type: 'sub_county', parent_id: '2' },
    { id: '203', name: 'Matuga', type: 'sub_county', parent_id: '2' },
    { id: '204', name: 'Msambweni', type: 'sub_county', parent_id: '2' }
  ],

  // Kilifi County Sub-Counties
  '3': [
    { id: '301', name: 'Ganze', type: 'sub_county', parent_id: '3' },
    { id: '302', name: 'Kaloleni', type: 'sub_county', parent_id: '3' },
    { id: '303', name: 'Kilifi North', type: 'sub_county', parent_id: '3' },
    { id: '304', name: 'Kilifi South', type: 'sub_county', parent_id: '3' },
    { id: '305', name: 'Magarini', type: 'sub_county', parent_id: '3' },
    { id: '306', name: 'Malindi', type: 'sub_county', parent_id: '3' },
    { id: '307', name: 'Rabai', type: 'sub_county', parent_id: '3' }
  ],

  // Tana River County Sub-Counties
  '4': [
    { id: '401', name: 'Bura', type: 'sub_county', parent_id: '4' },
    { id: '402', name: 'Galole', type: 'sub_county', parent_id: '4' },
    { id: '403', name: 'Garsen', type: 'sub_county', parent_id: '4' }
  ],

  // Lamu County Sub-Counties
  '5': [
    { id: '501', name: 'Lamu East', type: 'sub_county', parent_id: '5' },
    { id: '502', name: 'Lamu West', type: 'sub_county', parent_id: '5' }
  ],

  // Taita Taveta County Sub-Counties
  '6': [
    { id: '601', name: 'Mwatate', type: 'sub_county', parent_id: '6' },
    { id: '602', name: 'Taveta', type: 'sub_county', parent_id: '6' },
    { id: '603', name: 'Voi', type: 'sub_county', parent_id: '6' },
    { id: '604', name: 'Wundanyi', type: 'sub_county', parent_id: '6' }
  ],

  // Garissa County Sub-Counties
  '7': [
    { id: '701', name: 'Daadab', type: 'sub_county', parent_id: '7' },
    { id: '702', name: 'Fafi', type: 'sub_county', parent_id: '7' },
    { id: '703', name: 'Garissa Township', type: 'sub_county', parent_id: '7' },
    { id: '704', name: 'Hulugho', type: 'sub_county', parent_id: '7' },
    { id: '705', name: 'Ijara', type: 'sub_county', parent_id: '7' },
    { id: '706', name: 'Lagdera', type: 'sub_county', parent_id: '7' }
  ],

  // Wajir County Sub-Counties
  '8': [
    { id: '801', name: 'Eldas', type: 'sub_county', parent_id: '8' },
    { id: '802', name: 'Tarbaj', type: 'sub_county', parent_id: '8' },
    { id: '803', name: 'Wajir East', type: 'sub_county', parent_id: '8' },
    { id: '804', name: 'Wajir North', type: 'sub_county', parent_id: '8' },
    { id: '805', name: 'Wajir South', type: 'sub_county', parent_id: '8' },
    { id: '806', name: 'Wajir West', type: 'sub_county', parent_id: '8' }
  ],

  // Mandera County Sub-Counties
  '9': [
    { id: '901', name: 'Banissa', type: 'sub_county', parent_id: '9' },
    { id: '902', name: 'Lafey', type: 'sub_county', parent_id: '9' },
    { id: '903', name: 'Mandera East', type: 'sub_county', parent_id: '9' },
    { id: '904', name: 'Mandera North', type: 'sub_county', parent_id: '9' },
    { id: '905', name: 'Mandera South', type: 'sub_county', parent_id: '9' },
    { id: '906', name: 'Mandera West', type: 'sub_county', parent_id: '9' }
  ],

  // Marsabit County Sub-Counties
  '10': [
    { id: '1001', name: 'Laisamis', type: 'sub_county', parent_id: '10' },
    { id: '1002', name: 'Moyale', type: 'sub_county', parent_id: '10' },
    { id: '1003', name: 'North Horr', type: 'sub_county', parent_id: '10' },
    { id: '1004', name: 'Saku', type: 'sub_county', parent_id: '10' }
  ],

  // Isiolo County Sub-Counties
  '11': [
    { id: '1101', name: 'Isiolo', type: 'sub_county', parent_id: '11' },
    { id: '1102', name: 'Merti', type: 'sub_county', parent_id: '11' },
    { id: '1103', name: 'Garbatulla', type: 'sub_county', parent_id: '11' }
  ],

  // Tharaka-Nithi County Sub-Counties
  '13': [
    { id: '1301', name: 'Chuka', type: 'sub_county', parent_id: '13' },
    { id: '1302', name: 'Igambangombe', type: 'sub_county', parent_id: '13' },
    { id: '1303', name: 'Maara', type: 'sub_county', parent_id: '13' },
    { id: '1304', name: 'Muthambi', type: 'sub_county', parent_id: '13' },
    { id: '1305', name: 'Tharaka', type: 'sub_county', parent_id: '13' }
  ],

  // Embu County Sub-Counties
  '14': [
    { id: '1401', name: 'Manyatta', type: 'sub_county', parent_id: '14' },
    { id: '1402', name: 'Mbeere North', type: 'sub_county', parent_id: '14' },
    { id: '1403', name: 'Mbeere South', type: 'sub_county', parent_id: '14' },
    { id: '1404', name: 'Runyenjes', type: 'sub_county', parent_id: '14' }
  ],

  // Kitui County Sub-Counties
  '15': [
    { id: '1501', name: 'Ikutha', type: 'sub_county', parent_id: '15' },
    { id: '1502', name: 'Katulani', type: 'sub_county', parent_id: '15' },
    { id: '1503', name: 'Kisasi', type: 'sub_county', parent_id: '15' },
    { id: '1504', name: 'Kitui Central', type: 'sub_county', parent_id: '15' },
    { id: '1505', name: 'Kitui Rural', type: 'sub_county', parent_id: '15' },
    { id: '1506', name: 'Kitui South', type: 'sub_county', parent_id: '15' },
    { id: '1507', name: 'Lower Yatta', type: 'sub_county', parent_id: '15' },
    { id: '1508', name: 'Matiyani', type: 'sub_county', parent_id: '15' },
    { id: '1509', name: 'Mwingi Central', type: 'sub_county', parent_id: '15' },
    { id: '1510', name: 'Mwingi West', type: 'sub_county', parent_id: '15' }
  ],

  // Makueni County Sub-Counties
  '17': [
    { id: '1701', name: 'Kaiti', type: 'sub_county', parent_id: '17' },
    { id: '1702', name: 'Kibwezi East', type: 'sub_county', parent_id: '17' },
    { id: '1703', name: 'Kibwezi West', type: 'sub_county', parent_id: '17' },
    { id: '1704', name: 'Kilome', type: 'sub_county', parent_id: '17' },
    { id: '1705', name: 'Makueni', type: 'sub_county', parent_id: '17' },
    { id: '1706', name: 'Mbooni', type: 'sub_county', parent_id: '17' }
  ],

  // Nyandarua County Sub-Counties
  '18': [
    { id: '1801', name: 'Kinangop', type: 'sub_county', parent_id: '18' },
    { id: '1802', name: 'Kipipiri', type: 'sub_county', parent_id: '18' },
    { id: '1803', name: 'Ndaragwa', type: 'sub_county', parent_id: '18' },
    { id: '1804', name: 'Ol Kalou', type: 'sub_county', parent_id: '18' },
    { id: '1805', name: 'Ol Jorok', type: 'sub_county', parent_id: '18' }
  ],

  // Kirinyaga County Sub-Counties
  '20': [
    { id: '2001', name: 'Gichugu', type: 'sub_county', parent_id: '20' },
    { id: '2002', name: 'Kirinyaga Central', type: 'sub_county', parent_id: '20' },
    { id: '2003', name: 'Mwea East', type: 'sub_county', parent_id: '20' },
    { id: '2004', name: 'Mwea West', type: 'sub_county', parent_id: '20' },
    { id: '2005', name: 'Ndia', type: 'sub_county', parent_id: '20' }
  ],

  // Murang'a County Sub-Counties
  '21': [
    { id: '2101', name: 'Gatanga', type: 'sub_county', parent_id: '21' },
    { id: '2102', name: 'Kahuro', type: 'sub_county', parent_id: '21' },
    { id: '2103', name: 'Kandara', type: 'sub_county', parent_id: '21' },
    { id: '2104', name: 'Kangema', type: 'sub_county', parent_id: '21' },
    { id: '2105', name: 'Kigumo', type: 'sub_county', parent_id: '21' },
    { id: '2106', name: 'Kiharu', type: 'sub_county', parent_id: '21' },
    { id: '2107', name: 'Mathioya', type: 'sub_county', parent_id: '21' },
    { id: '2108', name: 'Murang\'a East', type: 'sub_county', parent_id: '21' },
    { id: '2109', name: 'Murang\'a South', type: 'sub_county', parent_id: '21' }
  ],

  // Turkana County Sub-Counties
  '23': [
    { id: '2301', name: 'Kibish', type: 'sub_county', parent_id: '23' },
    { id: '2302', name: 'Loima', type: 'sub_county', parent_id: '23' },
    { id: '2303', name: 'Turkana Central', type: 'sub_county', parent_id: '23' },
    { id: '2304', name: 'Turkana East', type: 'sub_county', parent_id: '23' },
    { id: '2305', name: 'Turkana North', type: 'sub_county', parent_id: '23' },
    { id: '2306', name: 'Turkana South', type: 'sub_county', parent_id: '23' },
    { id: '2307', name: 'Turkana West', type: 'sub_county', parent_id: '23' }
  ],

  // West Pokot County Sub-Counties
  '24': [
    { id: '2401', name: 'Central Pokot', type: 'sub_county', parent_id: '24' },
    { id: '2402', name: 'North Pokot', type: 'sub_county', parent_id: '24' },
    { id: '2403', name: 'Pokot South', type: 'sub_county', parent_id: '24' },
    { id: '2404', name: 'West Pokot', type: 'sub_county', parent_id: '24' }
  ],

  // Samburu County Sub-Counties
  '25': [
    { id: '2501', name: 'Samburu East', type: 'sub_county', parent_id: '25' },
    { id: '2502', name: 'Samburu North', type: 'sub_county', parent_id: '25' },
    { id: '2503', name: 'Samburu West', type: 'sub_county', parent_id: '25' }
  ],

  // Trans Nzoia County Sub-Counties
  '26': [
    { id: '2601', name: 'Cherangany', type: 'sub_county', parent_id: '26' },
    { id: '2602', name: 'Endebess', type: 'sub_county', parent_id: '26' },
    { id: '2603', name: 'Kiminini', type: 'sub_county', parent_id: '26' },
    { id: '2604', name: 'Kwanza', type: 'sub_county', parent_id: '26' },
    { id: '2605', name: 'Saboti', type: 'sub_county', parent_id: '26' }
  ],

  // Elgeyo Marakwet County Sub-Counties
  '28': [
    { id: '2801', name: 'Keiyo North', type: 'sub_county', parent_id: '28' },
    { id: '2802', name: 'Keiyo South', type: 'sub_county', parent_id: '28' },
    { id: '2803', name: 'Marakwet East', type: 'sub_county', parent_id: '28' },
    { id: '2804', name: 'Marakwet West', type: 'sub_county', parent_id: '28' }
  ],

  // Nandi County Sub-Counties
  '29': [
    { id: '2901', name: 'Aldai', type: 'sub_county', parent_id: '29' },
    { id: '2902', name: 'Chesumei', type: 'sub_county', parent_id: '29' },
    { id: '2903', name: 'Emgwen', type: 'sub_county', parent_id: '29' },
    { id: '2904', name: 'Mosop', type: 'sub_county', parent_id: '29' },
    { id: '2905', name: 'Nandi Hills', type: 'sub_county', parent_id: '29' },
    { id: '2906', name: 'Tinderet', type: 'sub_county', parent_id: '29' }
  ],

  // Baringo County Sub-Counties
  '30': [
    { id: '3001', name: 'Baringo Central', type: 'sub_county', parent_id: '30' },
    { id: '3002', name: 'Baringo North', type: 'sub_county', parent_id: '30' },
    { id: '3003', name: 'Baringo South', type: 'sub_county', parent_id: '30' },
    { id: '3004', name: 'Eldama Ravine', type: 'sub_county', parent_id: '30' },
    { id: '3005', name: 'Mogotio', type: 'sub_county', parent_id: '30' },
    { id: '3006', name: 'Tiaty', type: 'sub_county', parent_id: '30' }
  ],

  // Laikipia County Sub-Counties
  '31': [
    { id: '3101', name: 'Laikipia Central', type: 'sub_county', parent_id: '31' },
    { id: '3102', name: 'Laikipia East', type: 'sub_county', parent_id: '31' },
    { id: '3103', name: 'Laikipia North', type: 'sub_county', parent_id: '31' },
    { id: '3104', name: 'Laikipia West', type: 'sub_county', parent_id: '31' },
    { id: '3105', name: 'Nyahururu', type: 'sub_county', parent_id: '31' }
  ],

  // Narok County Sub-Counties
  '33': [
    { id: '3301', name: 'Narok East', type: 'sub_county', parent_id: '33' },
    { id: '3302', name: 'Narok North', type: 'sub_county', parent_id: '33' },
    { id: '3303', name: 'Narok South', type: 'sub_county', parent_id: '33' },
    { id: '3304', name: 'Narok West', type: 'sub_county', parent_id: '33' },
    { id: '3305', name: 'Transmara East', type: 'sub_county', parent_id: '33' },
    { id: '3306', name: 'Transmara West', type: 'sub_county', parent_id: '33' }
  ],

  // Kericho County Sub-Counties
  '35': [
    { id: '3501', name: 'Ainamoi', type: 'sub_county', parent_id: '35' },
    { id: '3502', name: 'Belgut', type: 'sub_county', parent_id: '35' },
    { id: '3503', name: 'Bureti', type: 'sub_county', parent_id: '35' },
    { id: '3504', name: 'Kipkelion East', type: 'sub_county', parent_id: '35' },
    { id: '3505', name: 'Kipkelion West', type: 'sub_county', parent_id: '35' },
    { id: '3506', name: 'Soin/Sigowet', type: 'sub_county', parent_id: '35' }
  ],

  // Bomet County Sub-Counties
  '36': [
    { id: '3601', name: 'Bomet Central', type: 'sub_county', parent_id: '36' },
    { id: '3602', name: 'Bomet East', type: 'sub_county', parent_id: '36' },
    { id: '3603', name: 'Chepalungu', type: 'sub_county', parent_id: '36' },
    { id: '3604', name: 'Konoin', type: 'sub_county', parent_id: '36' },
    { id: '3605', name: 'Sotik', type: 'sub_county', parent_id: '36' }
  ],

  // Vihiga County Sub-Counties
  '38': [
    { id: '3801', name: 'Emuhaya', type: 'sub_county', parent_id: '38' },
    { id: '3802', name: 'Hamisi', type: 'sub_county', parent_id: '38' },
    { id: '3803', name: 'Luanda', type: 'sub_county', parent_id: '38' },
    { id: '3804', name: 'Sabatia', type: 'sub_county', parent_id: '38' },
    { id: '3805', name: 'Vihiga', type: 'sub_county', parent_id: '38' }
  ],

  // Busia County Sub-Counties
  '40': [
    { id: '4001', name: 'Bunyala', type: 'sub_county', parent_id: '40' },
    { id: '4002', name: 'Busia', type: 'sub_county', parent_id: '40' },
    { id: '4003', name: 'Butula', type: 'sub_county', parent_id: '40' },
    { id: '4004', name: 'Nambale', type: 'sub_county', parent_id: '40' },
    { id: '4005', name: 'Samia', type: 'sub_county', parent_id: '40' },
    { id: '4006', name: 'Teso North', type: 'sub_county', parent_id: '40' },
    { id: '4007', name: 'Teso South', type: 'sub_county', parent_id: '40' }
  ],

  // Siaya County Sub-Counties
  '41': [
    { id: '4101', name: 'Alego Usonga', type: 'sub_county', parent_id: '41' },
    { id: '4102', name: 'Bondo', type: 'sub_county', parent_id: '41' },
    { id: '4103', name: 'Gem', type: 'sub_county', parent_id: '41' },
    { id: '4104', name: 'Rarieda', type: 'sub_county', parent_id: '41' },
    { id: '4105', name: 'Ugenya', type: 'sub_county', parent_id: '41' },
    { id: '4106', name: 'Unguja', type: 'sub_county', parent_id: '41' }
  ],

  // Homa Bay County Sub-Counties
  '43': [
    { id: '4301', name: 'Homa Bay Town', type: 'sub_county', parent_id: '43' },
    { id: '4302', name: 'Kabondo Kasipul', type: 'sub_county', parent_id: '43' },
    { id: '4303', name: 'Karachuonyo', type: 'sub_county', parent_id: '43' },
    { id: '4304', name: 'Kasipul', type: 'sub_county', parent_id: '43' },
    { id: '4305', name: 'Mbita', type: 'sub_county', parent_id: '43' },
    { id: '4306', name: 'Ndhiwa', type: 'sub_county', parent_id: '43' },
    { id: '4307', name: 'Rangwe', type: 'sub_county', parent_id: '43' },
    { id: '4308', name: 'Suba', type: 'sub_county', parent_id: '43' }
  ],

  // Migori County Sub-Counties
  '44': [
    { id: '4401', name: 'Awendo', type: 'sub_county', parent_id: '44' },
    { id: '4402', name: 'Kuria East', type: 'sub_county', parent_id: '44' },
    { id: '4403', name: 'Kuria West', type: 'sub_county', parent_id: '44' },
    { id: '4404', name: 'Nyatike', type: 'sub_county', parent_id: '44' },
    { id: '4405', name: 'Rongo', type: 'sub_county', parent_id: '44' },
    { id: '4406', name: 'Suna East', type: 'sub_county', parent_id: '44' },
    { id: '4407', name: 'Suna West', type: 'sub_county', parent_id: '44' },
    { id: '4408', name: 'Uriri', type: 'sub_county', parent_id: '44' }
  ],

  // Nyamira County Sub-Counties
  '46': [
    { id: '4601', name: 'Borabu', type: 'sub_county', parent_id: '46' },
    { id: '4602', name: 'Manga', type: 'sub_county', parent_id: '46' },
    { id: '4603', name: 'Masaba North', type: 'sub_county', parent_id: '46' },
    { id: '4604', name: 'Nyamira North', type: 'sub_county', parent_id: '46' },
    { id: '4605', name: 'Nyamira South', type: 'sub_county', parent_id: '46' }
  ]

};

const hardcodedWards: { [key: string]: Location[] } = {
  // Malava Sub-County Wards
  '37001': [
    { id: '37001001', name: 'Chemuche', type: 'ward', parent_id: '37001' },
    { id: '37001002', name: 'Butali/Chegulo', type: 'ward', parent_id: '37001' },
    { id: '37001003', name: 'Manda/Shivanga', type: 'ward', parent_id: '37001' },
    { id: '37001004', name: 'West Kabras', type: 'ward', parent_id: '37001' },
    { id: '37001005', name: 'East Kabras', type: 'ward', parent_id: '37001' },
    { id: '37001006', name: 'South Kabras', type: 'ward', parent_id: '37001' }
  ],
  // Westlands Sub-County Wards
  '47001': [
    { id: '47001001', name: 'Kitisuru', type: 'ward', parent_id: '47001' },
    { id: '47001002', name: 'Parklands/Highridge', type: 'ward', parent_id: '47001' },
    { id: '47001003', name: 'Karura', type: 'ward', parent_id: '47001' },
    { id: '47001004', name: 'Kangemi', type: 'ward', parent_id: '47001' },
    { id: '47001005', name: 'Mountain View', type: 'ward', parent_id: '47001' }
  ],
  // Mombasa - Changamwe Wards
  '101': [
    { id: '10101', name: 'Port Reitz', type: 'ward', parent_id: '101' },
    { id: '10102', name: 'Kipevu', type: 'ward', parent_id: '101' },
    { id: '10103', name: 'Airport', type: 'ward', parent_id: '101' },
    { id: '10104', name: 'Changamwe', type: 'ward', parent_id: '101' },
    { id: '10105', name: 'Chaani', type: 'ward', parent_id: '101' }
  ],
  
  // Mombasa - Jomvu Wards
  '102': [
    { id: '10201', name: 'Jomvu Kuu', type: 'ward', parent_id: '102' },
    { id: '10202', name: 'Miritini', type: 'ward', parent_id: '102' },
    { id: '10203', name: 'Mikindani', type: 'ward', parent_id: '102' }
  ],
  
  // Kisumu - Kisumu Central Wards
  '4201': [
    { id: '420101', name: 'Kajulu', type: 'ward', parent_id: '4201' },
    { id: '420102', name: 'Kolwa East', type: 'ward', parent_id: '4201' },
    { id: '420103', name: 'Manyatta B', type: 'ward', parent_id: '4201' },
    { id: '420104', name: 'Nyalenda A', type: 'ward', parent_id: '4201' },
    { id: '420105', name: 'Nyalenda B', type: 'ward', parent_id: '4201' }
  ],
  
  // Nakuru - Nakuru Town East Wards
  '3201': [
    { id: '320101', name: 'Biashara', type: 'ward', parent_id: '3201' },
    { id: '320102', name: 'Kivumbini', type: 'ward', parent_id: '3201' },
    { id: '320103', name: 'Flamingo', type: 'ward', parent_id: '3201' },
    { id: '320104', name: 'Menengai', type: 'ward', parent_id: '3201' },
    { id: '320105', name: 'Nakuru East', type: 'ward', parent_id: '3201' }
  ],
  
  // Uasin Gishu - Ainabkoi Wards
  '2701': [
    { id: '270101', name: 'Kapsoya', type: 'ward', parent_id: '2701' },
    { id: '270102', name: 'Kaptagat', type: 'ward', parent_id: '2701' },
    { id: '270103', name: 'Ainabkoi/Olare', type: 'ward', parent_id: '2701' }
  ],
  
  // Kiambu - Gatundu North Wards
  '2201': [
    { id: '220101', name: 'Gatundu North', type: 'ward', parent_id: '2201' },
    { id: '220102', name: 'Gatundu South', type: 'ward', parent_id: '2201' },
    { id: '220103', name: 'Gituamba', type: 'ward', parent_id: '2201' }
  ],
  
  // Machakos - Kathiani Wards
  '1601': [
    { id: '160101', name: 'Ikombe', type: 'ward', parent_id: '1601' },
    { id: '160102', name: 'Katangi', type: 'ward', parent_id: '1601' },
    { id: '160103', name: 'Kola', type: 'ward', parent_id: '1601' },
    { id: '160104', name: 'Masinga', type: 'ward', parent_id: '1601' }
  ],
  
  // Bungoma - Bumula Wards
  '3901': [
    { id: '390101', name: 'Bumula', type: 'ward', parent_id: '3901' },
    { id: '390102', name: 'Khasoko', type: 'ward', parent_id: '3901' },
    { id: '390103', name: 'Kabula', type: 'ward', parent_id: '3901' },
    { id: '390104', name: 'Kimaeti', type: 'ward', parent_id: '3901' }
  ],
  
  // Nyeri - Kieni East Wards
  '1901': [
    { id: '190101', name: 'Gatarakwa', type: 'ward', parent_id: '1901' },
    { id: '190102', name: 'Thegu River', type: 'ward', parent_id: '1901' },
    { id: '190103', name: 'Kabaru', type: 'ward', parent_id: '1901' },
    { id: '190104', name: 'Gakawa', type: 'ward', parent_id: '1901' }
  ],
  
  // Kajiado - Isinya Wards
  '3401': [
    { id: '340101', name: 'Isinya', type: 'ward', parent_id: '3401' },
    { id: '340102', name: 'Nkaimurunya', type: 'ward', parent_id: '3401' },
    { id: '340103', name: 'Oloolua', type: 'ward', parent_id: '3401' }
  ],
  
  // Meru - Buuri Wards
  '1201': [
    { id: '120101', name: 'Timau', type: 'ward', parent_id: '1201' },
    { id: '120102', name: 'Kibirichia', type: 'ward', parent_id: '1201' },
    { id: '120103', name: 'Kithirune', type: 'ward', parent_id: '1201' }
  ],
  
  // Kisii - Bobasi Wards
  '4501': [
    { id: '450101', name: 'Bobasi Central', type: 'ward', parent_id: '4501' },
    { id: '450102', name: 'Bobasi Boitangare', type: 'ward', parent_id: '4501' },
    { id: '450103', name: 'Bobasi Chache', type: 'ward', parent_id: '4501' },
    { id: '450104', name: 'Bobasi Nyaribari', type: 'ward', parent_id: '4501' }
  ]
  
};

export const useLocations = () => {
  const [counties, setCounties] = useState<Location[]>([]);
  const [subCounties, setSubCounties] = useState<Location[]>([]);
  const [wards, setWards] = useState<Location[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCounties();
  }, []);

  const fetchCounties = async () => {
    setLoading(true);
    setCounties(hardcodedCounties);
    setLoading(false);
  };

  const fetchSubCounties = async (countyId: string) => {
    setLoading(true);
    const subCountiesForCounty = hardcodedSubCounties[countyId] || [];
    setSubCounties(subCountiesForCounty);
    setLoading(false);
  };

  const fetchWards = async (subCountyId: string) => {
    setLoading(true);
    const wardsForSubCounty = hardcodedWards[subCountyId] || [];
    setWards(wardsForSubCounty);
    setLoading(false);
  };

  const getLocationPath = async (locationId: string): Promise<string> => {
    const allLocations = [
      ...hardcodedCounties,
      ...Object.values(hardcodedSubCounties).flat(),
      ...Object.values(hardcodedWards).flat()
    ];

    const location = allLocations.find(loc => loc.id === locationId);
    if (!location) return '';

    let path = location.name;
    let currentLocation = location;

    while (currentLocation.parent_id) {
      const parent = allLocations.find(loc => loc.id === currentLocation.parent_id);
      if (parent) {
        path = `${parent.name}, ${path}`;
        currentLocation = parent;
      } else {
        break;
      }
    }

    return path;
  };

  return {
    counties,
    subCounties,
    wards,
    loading,
    fetchSubCounties,
    fetchWards,
    getLocationPath
  };
};
