-- HmmmNow schema migration: add code and tip columns
-- Run this BEFORE the seed insert if upgrading an existing database.

ALTER TABLE toilets ADD COLUMN IF NOT EXISTS code text;
ALTER TABLE toilets ADD COLUMN IF NOT EXISTS tip text;

ALTER TABLE pending_toilets ADD COLUMN IF NOT EXISTS code text;
ALTER TABLE pending_toilets ADD COLUMN IF NOT EXISTS tip text;

-- HmmmNow seed data: 42 London toilet records
-- Run this in the Supabase SQL Editor after creating the toilets table.

INSERT INTO toilets (id, name, area, address, lat, lng, access_type, code, tip, opening_hours, confidence, last_checked, is_active)
VALUES
  (gen_random_uuid(), 'Pret a Manger Victoria Street', 'Victoria / Buckingham Palace', 'Victoria Street, London SW1', 51.4967, -0.1394, '需要 code', '1212', '一楼靠后，靠近 Queen''s Gallery 方向时顺路。', '跟随门店营业时间', '中', '2026-04-27', true),
  (gen_random_uuid(), 'Pret a Manger Bridge Street', 'Westminster / Big Ben', 'Bridge Street, London SW1A', 51.5008, -0.1247, '需要 code', '4321', '靠近 Westminster 地铁站，适合大本钟附近救急。', '跟随门店营业时间', '中', '2026-04-27', true),
  (gen_random_uuid(), 'Pret a Manger Tottenham Court Road', 'Tottenham Court Road / British Museum', 'Tottenham Court Road, London WC1', 51.5177, -0.132, '需要 code', '2580', '走路离大英博物馆约 5 分钟。往 Goodge Street 方向第一个 Pret 可能 code 是 135。', '跟随门店营业时间', '中', '2026-04-27', true),
  (gen_random_uuid(), 'Pret a Manger Holborn Station', 'Holborn', 'Holborn Station, London WC2', 51.5172, -0.1199, '需要 code', '6254', NULL, '跟随门店营业时间', '中', '2026-04-27', true),
  (gen_random_uuid(), 'McDonald''s Oxford Street 8/10', 'Oxford Street', '8-10 Oxford Street, London', 51.5152, -0.1416, '需要消费', '8888', '可能需要小票。', '跟随门店营业时间', '中', '2026-04-27', true),
  (gen_random_uuid(), 'Five Guys Leicester Square', 'Leicester Square', 'W1D 7DH, London', 51.5112, -0.1286, '需要 code', '9491', '一楼厕所，环境很干净。', '跟随门店营业时间', '高', '2026-04-27', true),
  (gen_random_uuid(), 'Giraffe Southbank', 'South Bank', 'Southbank Centre area, London SE1', 51.5064, -0.1168, '需要 code', '2001', NULL, '跟随门店营业时间', '中', '2026-04-27', true),
  (gen_random_uuid(), 'Joe & The Juice Broadwick Street', 'Soho / Carnaby', 'Broadwick Street, London W1', 51.5135, -0.1393, '需要 code', '2468', '靠近 Liberty 和 Carnaby Street，厕所不大但干净。', '跟随门店营业时间', '中', '2026-04-27', true),
  (gen_random_uuid(), 'Joe & The Juice Covent Garden', 'Covent Garden', 'Covent Garden, London WC2', 51.5115, -0.1248, '需要 code', '2222', NULL, '跟随门店营业时间', '中', '2026-04-27', true),
  (gen_random_uuid(), 'Starbucks British Museum', 'British Museum / Bloomsbury', 'Opposite British Museum, London WC1', 51.5191, -0.1273, '需要 code', '4321', '在大英博物馆对面一带。', '跟随门店营业时间', '中', '2026-04-27', true),
  (gen_random_uuid(), 'Caffè Nero Piccadilly Circus', 'Piccadilly Circus', 'Piccadilly Circus, London W1', 51.5101, -0.134, '需要 code', '2580', NULL, '跟随门店营业时间', '中', '2026-04-27', true),
  (gen_random_uuid(), 'itsu Regent Street', 'Regent Street', 'Regent Street, London W1', 51.5109, -0.1397, '需要 code', '1982', NULL, '跟随门店营业时间', '中', '2026-04-27', true),
  (gen_random_uuid(), 'Jollibee Leicester Square', 'Leicester Square', 'Leicester Square, London WC2', 51.511, -0.13, '免费可进', NULL, '负一楼，24 小时营业。', '24h', '中', '2026-04-27', true),
  (gen_random_uuid(), 'Apple Covent Garden', 'Covent Garden', '1-7 The Piazza, London WC2E 8HB', 51.5118, -0.1237, '免费可进', NULL, NULL, '跟随门店营业时间', '高', '2026-04-27', true),
  (gen_random_uuid(), 'British Museum public toilets', 'British Museum / Bloomsbury', 'Great Russell Street, London WC1B 3DG', 51.5194, -0.127, '免费可进', NULL, '安检后直走右转。没带包可走快捷通道。', '跟随博物馆开放时间', '高', '2026-04-27', true),
  (gen_random_uuid(), 'National Gallery public toilets', 'Trafalgar Square', 'Trafalgar Square, London WC2N 5DN', 51.5089, -0.1283, '免费可进', NULL, '馆内厕所免费开放，适合特拉法加广场附近救急。', '跟随美术馆开放时间', '高', '2026-04-27', true),
  (gen_random_uuid(), 'Southbank Centre / Royal Festival Hall', 'South Bank / Waterloo', 'Belvedere Road, London SE1 8XX', 51.5068, -0.1168, '免费可进', NULL, '一楼公共厕所，免费、环境好。Waterloo 出来步行约 5 分钟。', '跟随场馆开放时间', '高', '2026-04-27', true),
  (gen_random_uuid(), 'St James''s Park public toilet', 'St James''s Park / Buckingham Palace', 'St James''s Park, London SW1A', 51.5025, -0.1343, '免费可进', NULL, '从 St James''s Park 站出来往公园方向约 200 米。', '8:00–18:00', '高', '2026-04-27', true),
  (gen_random_uuid(), 'Marks & Spencer Oxford Circus', 'Oxford Circus', 'Oxford Street, London W1', 51.5143, -0.142, '免费可进', NULL, '地下一层免费，M&S 多家门店可用。', '跟随商场/门店营业时间', '中', '2026-04-27', true),
  (gen_random_uuid(), 'Joe & The Juice Regent Street', 'Regent Street', 'Regent Street, London W1', 51.512, -0.14, '需要 code', '2580', NULL, '跟随门店营业时间', '中', '2026-04-27', true),
  (gen_random_uuid(), 'Ralph Lauren New Bond Street', 'Bond Street / Mayfair', 'New Bond Street, London W1S', 51.5117, -0.1436, '免费可进', NULL, '旗舰店 UG 层，可随意进出。', '跟随门店营业时间', '中', '2026-04-27', true),
  (gen_random_uuid(), 'Café TPT Chinatown', 'Chinatown', 'Chinatown, London W1D', 51.5115, -0.1305, '需要 code', '8888', '建议消费。', '跟随门店营业时间', '中', '2026-04-27', true),
  (gen_random_uuid(), 'Lisle Street coffee shop', 'Chinatown / Leicester Square', 'Lisle Street, London WC2H', 51.5113, -0.1305, '需要 code', '2020', '看运气。', '跟随门店营业时间', '低', '2026-04-27', true),
  (gen_random_uuid(), 'UCL Main Library', 'UCL / Bloomsbury', 'Gower Street, London WC1E 6BT', 51.5246, -0.1336, '需要 code', '7351', 'Ground Floor 主图书馆，安静整洁。', '跟随图书馆开放时间', '中', '2026-04-27', true),
  (gen_random_uuid(), 'Selfridges Oxford Street', 'Oxford Street / Marylebone', '400 Oxford Street, London W1A 1AB', 51.5146, -0.152, '免费可进', NULL, '负一层，环境干净，设施齐全。', '跟随百货营业时间', '高', '2026-04-27', true),
  (gen_random_uuid(), 'V&A / South Kensington museums', 'South Kensington', 'Cromwell Road, London SW7', 51.4966, -0.1722, '免费可进', NULL, 'V&A、自然历史博物馆、科学博物馆均有免费厕所，可能需要排队或安检。', '跟随博物馆开放时间', '高', '2026-04-27', true),
  (gen_random_uuid(), 'Charing Cross Station toilets', 'Charing Cross', 'Charing Cross Station, London WC2N', 51.508, -0.1248, '免费可进', NULL, '靠近中央通道。', '跟随车站开放时间', '中', '2026-04-27', true),
  (gen_random_uuid(), 'Kingly Court toilets', 'Soho / Carnaby', 'Kingly Court, London W1B 5PW', 51.5129, -0.1396, '免费可进', NULL, '餐厅区域，靠近 Liberty 商场，环境不错。', '跟随商场/餐厅区域开放时间', '高', '2026-04-27', true),
  (gen_random_uuid(), 'Borough Market Three Crown Square', 'London Bridge / Borough Market', 'Three Crown Square, Borough Market, London SE1', 51.5055, -0.091, '免费可进', NULL, '市场中心的大广场附近。', '跟随市场开放时间', '中', '2026-04-27', true),
  (gen_random_uuid(), 'St Pancras International toilets', 'King''s Cross / St Pancras', 'St Pancras International, London N1C', 51.5317, -0.1269, '免费可进', NULL, '负一楼，免费、干净。', '跟随车站开放时间', '高', '2026-04-27', true),
  (gen_random_uuid(), 'British Library toilets', 'King''s Cross / St Pancras', '96 Euston Road, London NW1 2DB', 51.5299, -0.1275, '免费可进', NULL, '入口大厅，干净。', '跟随图书馆开放时间', '高', '2026-04-27', true),
  (gen_random_uuid(), 'Camden Market toilets', 'Camden', 'Camden Market, London NW1', 51.5413, -0.146, '免费可进', NULL, '马厩市场附近。', '跟随市场开放时间', '中', '2026-04-27', true),
  (gen_random_uuid(), 'Lancaster Gate public toilet', 'Hyde Park / Lancaster Gate', 'Lancaster Gate entrance, Hyde Park, London W2', 51.5118, -0.1752, '免费可进', NULL, 'Lancaster Gate 入口，环境好，适合海德公园散步时用。', '公园开放时段', '高', '2026-04-27', true),
  (gen_random_uuid(), 'Chinatown restaurants / 文兴酒家一带', 'Chinatown', 'Chinatown, London W1D', 51.5115, -0.131, '免费可进', NULL, '文兴酒家等几家餐厅，环境一般，建议作为备用。', '跟随餐厅营业时间', '低', '2026-04-27', true),
  (gen_random_uuid(), 'Burger King Buckingham Palace Road', 'Victoria / Buckingham Palace', '115 Buckingham Palace Road, London SW1W 9SJ', 51.4962, -0.1436, '不太确定', NULL, '紧邻交通枢纽，逛完白金汉宫可直接冲。', '跟随门店营业时间', '低', '2026-04-27', true),
  (gen_random_uuid(), 'Shake Shack Covent Garden', 'Covent Garden / Soho', '24 Market Building, London WC2E 8RD', 51.5121, -0.1225, '免费可进', NULL, '地下 1 层，位置隐蔽、不排队，卫生条件在线。', '跟随门店营业时间', '高', '2026-04-27', true),
  (gen_random_uuid(), 'KFC Oxford Street', 'Oxford Street', '542 Oxford Street, London W1C 1LT', 51.5139, -0.1518, '不太确定', NULL, NULL, '跟随门店营业时间', '低', '2026-04-27', true),
  (gen_random_uuid(), 'KFC The Plaza Oxford Street', 'Oxford Street', 'The Plaza, 120 Oxford Street, London W1D 1LT', 51.5152, -0.1382, '不太确定', NULL, NULL, '跟随门店营业时间', '低', '2026-04-27', true),
  (gen_random_uuid(), 'One New Change toilets', 'St Paul''s / City', 'One New Change, London EC4M 9AF', 51.5136, -0.0953, '免费可进', NULL, 'St Paul''s Cathedral 步行约 2 分钟，商场负一楼。', '跟随商场营业时间', '高', '2026-04-27', true),
  (gen_random_uuid(), 'Spitalfields Market toilets', 'Liverpool Street / Spitalfields', 'Old Spitalfields Market, London E1', 51.5196, -0.0756, '免费可进', NULL, 'Liverpool Street 步行约 5 分钟。', '跟随市场开放时间', '中', '2026-04-27', true),
  (gen_random_uuid(), 'Bloomberg Arcade toilets', 'Bank / City', 'Bloomberg Arcade, London EC4N', 51.5127, -0.089, '免费可进', NULL, 'Bank station 附近，环境好。', '跟随 arcade/餐饮区域开放时间', '高', '2026-04-27', true),
  (gen_random_uuid(), 'Barbican Centre toilets', 'Moorgate / Barbican', 'Barbican Centre, London EC2Y 8DS', 51.5201, -0.0935, '免费可进', NULL, 'Moorgate station 步行约 5 分钟，内部有多个公用卫生间，环境好。', '跟随场馆开放时间', '高', '2026-04-27', true);