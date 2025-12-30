-- reels_exports 테이블에 데이터 INSERT (있으면 UPDATE, 없으면 INSERT)
-- 실행 방법: Supabase 대시보드 → SQL Editor → New Query → 아래 SQL 복사 후 실행
--
-- ⚠️ 주의: 이 쿼리를 실행하기 전에 먼저 supabase_add_unique_constraint.sql을 실행하여
--          shortcode에 UNIQUE 제약을 추가해야 합니다.

-- UPSERT 쿼리: shortcode를 기준으로 중복 체크
INSERT INTO public.reels_exports (account, category, shortcode, url, views, updated_at)
VALUES
-- dueotoddlftkd (trend)
('dueotoddlftkd', 'trend', 'DR9HUM_gSQM', 'https://www.instagram.com/dueotoddlftkd/reel/DR9HUM_gSQM/', 635000, NOW()),
('dueotoddlftkd', 'trend', 'DSPHiLqgfVp', 'https://www.instagram.com/dueotoddlftkd/reel/DSPHiLqgfVp/', 376000, NOW()),
('dueotoddlftkd', 'trend', 'DSWus8XAbmR', 'https://www.instagram.com/dueotoddlftkd/reel/DSWus8XAbmR/', 350000, NOW()),
('dueotoddlftkd', 'trend', 'DSC8fTkAQ_N', 'https://www.instagram.com/dueotoddlftkd/reel/DSC8fTkAQ_N/', 347000, NOW()),
('dueotoddlftkd', 'trend', 'DSmcu2GgblL', 'https://www.instagram.com/dueotoddlftkd/reel/DSmcu2GgblL/', 265000, NOW()),
('dueotoddlftkd', 'trend', 'DSznKvkgaRR', 'https://www.instagram.com/dueotoddlftkd/reel/DSznKvkgaRR/', 161000, NOW()),
('dueotoddlftkd', 'trend', 'DR6mUYZAc5S', 'https://www.instagram.com/dueotoddlftkd/reel/DR6mUYZAc5S/', 155000, NOW()),
('dueotoddlftkd', 'trend', 'DRt4PQojyQJ', 'https://www.instagram.com/dueotoddlftkd/reel/DRt4PQojyQJ/', 125000, NOW()),
('dueotoddlftkd', 'trend', 'DSMQbGpgeLE', 'https://www.instagram.com/dueotoddlftkd/reel/DSMQbGpgeLE/', 107000, NOW()),
('dueotoddlftkd', 'trend', 'DSFrcBygddB', 'https://www.instagram.com/dueotoddlftkd/reel/DSFrcBygddB/', 98600, NOW()),

-- welcometossong (trend)
('welcometossong', 'trend', 'DOYglFQEzQI', 'https://www.instagram.com/welcometossong/reel/DOYglFQEzQI/', 3300000, NOW()),
('welcometossong', 'trend', 'DObcG14E8RS', 'https://www.instagram.com/welcometossong/reel/DObcG14E8RS/', 1600000, NOW()),
('welcometossong', 'trend', 'DOdogmxk0HM', 'https://www.instagram.com/welcometossong/reel/DOdogmxk0HM/', 1400000, NOW()),
('welcometossong', 'trend', 'DPbjgzJkxwM', 'https://www.instagram.com/welcometossong/reel/DPbjgzJkxwM/', 1200000, NOW()),
('welcometossong', 'trend', 'DOV7T9MEw-M', 'https://www.instagram.com/welcometossong/reel/DOV7T9MEw-M/', 1200000, NOW()),
('welcometossong', 'trend', 'DPRUT9hEyC1', 'https://www.instagram.com/welcometossong/reel/DPRUT9hEyC1/', 1100000, NOW()),
('welcometossong', 'trend', 'DPBuWtyk3Bw', 'https://www.instagram.com/welcometossong/reel/DPBuWtyk3Bw/', 1000000, NOW()),
('welcometossong', 'trend', 'DOv6T_Lkz_p', 'https://www.instagram.com/welcometossong/reel/DOv6T_Lkz_p/', 868000, NOW()),
('welcometossong', 'trend', 'DOgTciAE49w', 'https://www.instagram.com/welcometossong/reel/DOgTciAE49w/', 854000, NOW()),
('welcometossong', 'trend', 'DRw90x7D5Ya', 'https://www.instagram.com/welcometossong/reel/DRw90x7D5Ya/', 734000, NOW()),

-- go3_log (trend)
('go3_log', 'trend', 'DRB7XcqEbaQ', 'https://www.instagram.com/go3_log/reel/DRB7XcqEbaQ/', 2200000, NOW()),
('go3_log', 'trend', 'DQjL0iSEUCp', 'https://www.instagram.com/go3_log/reel/DQjL0iSEUCp/', 1600000, NOW()),
('go3_log', 'trend', 'DQtPKnWEV0f', 'https://www.instagram.com/go3_log/reel/DQtPKnWEV0f/', 1200000, NOW()),
('go3_log', 'trend', 'DSHgX9gER4D', 'https://www.instagram.com/go3_log/reel/DSHgX9gER4D/', 831000, NOW()),
('go3_log', 'trend', 'DRwVR_LkcCz', 'https://www.instagram.com/go3_log/reel/DRwVR_LkcCz/', 773000, NOW()),
('go3_log', 'trend', 'DR2Cgd2Ee6B', 'https://www.instagram.com/go3_log/reel/DR2Cgd2Ee6B/', 683000, NOW()),
('go3_log', 'trend', 'DSRzfHQEZWr', 'https://www.instagram.com/go3_log/reel/DSRzfHQEZWr/', 667000, NOW()),
('go3_log', 'trend', 'DSZopsiEQ9W', 'https://www.instagram.com/go3_log/reel/DSZopsiEQ9W/', 591000, NOW()),
('go3_log', 'trend', 'DSwue5yEWDH', 'https://www.instagram.com/go3_log/reel/DSwue5yEWDH/', 390000, NOW()),
('go3_log', 'trend', 'DSj1ZjukYry', 'https://www.instagram.com/go3_log/reel/DSj1ZjukYry/', 271000, NOW()),

-- malanghanmalang (trend)
('malanghanmalang', 'trend', 'DSkRw29gcjO', 'https://www.instagram.com/malanghanmalang/reel/DSkRw29gcjO/', 1100000, NOW()),
('malanghanmalang', 'trend', 'DSSkkRwgf9p', 'https://www.instagram.com/malanghanmalang/reel/DSSkkRwgf9p/', 697000, NOW()),
('malanghanmalang', 'trend', 'DRThtc6AY96', 'https://www.instagram.com/malanghanmalang/reel/DRThtc6AY96/', 276000, NOW()),
('malanghanmalang', 'trend', 'DSHTWDOgbAX', 'https://www.instagram.com/malanghanmalang/reel/DSHTWDOgbAX/', 229000, NOW()),
('malanghanmalang', 'trend', 'DSUYscNATcV', 'https://www.instagram.com/malanghanmalang/reel/DSUYscNATcV/', 157000, NOW()),
('malanghanmalang', 'trend', 'DSPobJJATSN', 'https://www.instagram.com/malanghanmalang/reel/DSPobJJATSN/', 145000, NOW()),
('malanghanmalang', 'trend', 'DQ16HMGATvD', 'https://www.instagram.com/malanghanmalang/reel/DQ16HMGATvD/', 130000, NOW()),
('malanghanmalang', 'trend', 'DR2E_V_AU19', 'https://www.instagram.com/malanghanmalang/reel/DR2E_V_AU19/', 128000, NOW()),
('malanghanmalang', 'trend', 'DRhKqntkyJ6', 'https://www.instagram.com/malanghanmalang/reel/DRhKqntkyJ6/', 125000, NOW()),
('malanghanmalang', 'trend', 'DSSE8aCgY-b', 'https://www.instagram.com/malanghanmalang/reel/DSSE8aCgY-b/', 116000, NOW()),

-- uuuuuuu_haru (trend)
('uuuuuuu_haru', 'trend', 'DQuFXBhE2_M', 'https://www.instagram.com/uuuuuuu_haru/reel/DQuFXBhE2_M/', 7800000, NOW()),
('uuuuuuu_haru', 'trend', 'DQrI32hE6RL', 'https://www.instagram.com/uuuuuuu_haru/reel/DQrI32hE6RL/', 7400000, NOW()),
('uuuuuuu_haru', 'trend', 'DOWDFqYk1i0', 'https://www.instagram.com/uuuuuuu_haru/reel/DOWDFqYk1i0/', 7100000, NOW()),
('uuuuuuu_haru', 'trend', 'DRHT0MMk0jx', 'https://www.instagram.com/uuuuuuu_haru/reel/DRHT0MMk0jx/', 6900000, NOW()),
('uuuuuuu_haru', 'trend', 'DOtST95E9hY', 'https://www.instagram.com/uuuuuuu_haru/reel/DOtST95E9hY/', 6700000, NOW()),
('uuuuuuu_haru', 'trend', 'DRhS9mIk6Iy', 'https://www.instagram.com/uuuuuuu_haru/reel/DRhS9mIk6Iy/', 6500000, NOW()),
('uuuuuuu_haru', 'trend', 'DRO6elIEz0-', 'https://www.instagram.com/uuuuuuu_haru/reel/DRO6elIEz0-/', 6000000, NOW()),
('uuuuuuu_haru', 'trend', 'DOyViNyE0Li', 'https://www.instagram.com/uuuuuuu_haru/reel/DOyViNyE0Li/', 5000000, NOW()),
('uuuuuuu_haru', 'trend', 'DReo08OEzgf', 'https://www.instagram.com/uuuuuuu_haru/reel/DReo08OEzgf/', 4900000, NOW()),
('uuuuuuu_haru', 'trend', 'DPTnahzEymW', 'https://www.instagram.com/uuuuuuu_haru/reel/DPTnahzEymW/', 4900000, NOW()),

-- ohmyo___ (trend)
('ohmyo___', 'trend', 'DRy7twIEdJm', 'https://www.instagram.com/ohddokazi_/reel/DRy7twIEdJm/', 4200000, NOW()),
('ohmyo___', 'trend', 'DQ1H3MOEftH', 'https://www.instagram.com/ohddokazi_/reel/DQ1H3MOEftH/', 3100000, NOW()),
('ohmyo___', 'trend', 'DPOIT68kZqH', 'https://www.instagram.com/ohddokazi_/reel/DPOIT68kZqH/', 2300000, NOW()),
('ohmyo___', 'trend', 'DSmg-vnEd5J', 'https://www.instagram.com/ohddokazi_/reel/DSmg-vnEd5J/', 1400000, NOW()),
('ohmyo___', 'trend', 'DR1fSv5kfA-', 'https://www.instagram.com/ohddokazi_/reel/DR1fSv5kfA-/', 1300000, NOW()),
('ohmyo___', 'trend', 'DRt4yvNET4S', 'https://www.instagram.com/ohddokazi_/reel/DRt4yvNET4S/', 1200000, NOW()),
('ohmyo___', 'trend', 'DSZmRuKEczj', 'https://www.instagram.com/ohddokazi_/reel/DSZmRuKEczj/', 1100000, NOW()),
('ohmyo___', 'trend', 'DSR52HBkfKT', 'https://www.instagram.com/ohddokazi_/reel/DSR52HBkfKT/', 1100000, NOW()),
('ohmyo___', 'trend', 'DQETUBFkTRK', 'https://www.instagram.com/ohddokazi_/reel/DQETUBFkTRK/', 1100000, NOW()),
('ohmyo___', 'trend', 'DQMDqqkEpRJ', 'https://www.instagram.com/ohddokazi_/reel/DQMDqqkEpRJ/', 998000, NOW()),

-- yourhyeda (trend)
('yourhyeda', 'trend', 'DMuIT3yJ0Fa', 'https://www.instagram.com/hyesister_/reel/DMuIT3yJ0Fa/', 11600000, NOW()),
('yourhyeda', 'trend', 'DScW8lMiVX4', 'https://www.instagram.com/hyesister_/reel/DScW8lMiVX4/', 8200000, NOW()),
('yourhyeda', 'trend', 'DRwzF_Hib2r', 'https://www.instagram.com/hyesister_/reel/DRwzF_Hib2r/', 2200000, NOW()),
('yourhyeda', 'trend', 'DSKcrrqicLT', 'https://www.instagram.com/hyesister_/reel/DSKcrrqicLT/', 1900000, NOW()),
('yourhyeda', 'trend', 'DRraDSOCbb4', 'https://www.instagram.com/hyesister_/reel/DRraDSOCbb4/', 1700000, NOW()),
('yourhyeda', 'trend', 'DSkHQ9hiRXZ', 'https://www.instagram.com/hyesister_/reel/DSkHQ9hiRXZ/', 1500000, NOW()),
('yourhyeda', 'trend', 'DSmQ0JSCSiL', 'https://www.instagram.com/hyesister_/reel/DSmQ0JSCSiL/', 915000, NOW()),
('yourhyeda', 'trend', 'DR19oNrCQ6c', 'https://www.instagram.com/hyesister_/reel/DR19oNrCQ6c/', 873000, NOW()),
('yourhyeda', 'trend', 'DSE8YSOiU7A', 'https://www.instagram.com/hyesister_/reel/DSE8YSOiU7A/', 869000, NOW()),
('yourhyeda', 'trend', 'DR4RK6xESjA', 'https://www.instagram.com/hyesister_/reel/DR4RK6xESjA/', 748000, NOW()),

-- dragonizi (trend)
('dragonizi', 'trend', 'DDmhJFphIbH', 'https://www.instagram.com/dragonizi/reel/DDmhJFphIbH/', 9500000, NOW()),
('dragonizi', 'trend', 'C-QC7RLPlgm', 'https://www.instagram.com/dragonizi/reel/C-QC7RLPlgm/', 8400000, NOW()),
('dragonizi', 'trend', 'DI2rnbuBkvh', 'https://www.instagram.com/dragonizi/reel/DI2rnbuBkvh/', 4600000, NOW()),
('dragonizi', 'trend', 'DHdlKj3h9Fq', 'https://www.instagram.com/dragonizi/reel/DHdlKj3h9Fq/', 3000000, NOW()),
('dragonizi', 'trend', 'C-nEGhQhxqL', 'https://www.instagram.com/dragonizi/reel/C-nEGhQhxqL/', 2700000, NOW()),
('dragonizi', 'trend', 'DJbvMmdPU_I', 'https://www.instagram.com/dragonizi/reel/DJbvMmdPU_I/', 2700000, NOW()),
('dragonizi', 'trend', 'DDUcD5xhU14', 'https://www.instagram.com/dragonizi/reel/DDUcD5xhU14/', 2600000, NOW()),
('dragonizi', 'trend', 'DGLPZRjhhhe', 'https://www.instagram.com/dragonizi/reel/DGLPZRjhhhe/', 2000000, NOW()),
('dragonizi', 'trend', 'DEAAqhPvcrB', 'https://www.instagram.com/dragonizi/reel/DEAAqhPvcrB/', 1700000, NOW()),
('dragonizi', 'trend', 'DLBgzNBPr66', 'https://www.instagram.com/dragonizi/reel/DLBgzNBPr66/', 1600000, NOW()),

-- ahsagong0 (trend)
('ahsagong0', 'trend', 'DO3GDqzkixN', 'https://www.instagram.com/ahsagong0/reel/DO3GDqzkixN/', 12700000, NOW()),
('ahsagong0', 'trend', 'DPTNu9oCgtD', 'https://www.instagram.com/ahsagong0/reel/DPTNu9oCgtD/', 5300000, NOW()),
('ahsagong0', 'trend', 'DOx0B1ikn-K', 'https://www.instagram.com/ahsagong0/reel/DOx0B1ikn-K/', 3100000, NOW()),
('ahsagong0', 'trend', 'DQllwiZkini', 'https://www.instagram.com/ahsagong0/reel/DQllwiZkini/', 2000000, NOW()),
('ahsagong0', 'trend', 'DQoJgypEqA5', 'https://www.instagram.com/ahsagong0/reel/DQoJgypEqA5/', 1700000, NOW()),
('ahsagong0', 'trend', 'DQJXX3xkgld', 'https://www.instagram.com/ahsagong0/reel/DQJXX3xkgld/', 1000000, NOW()),
('ahsagong0', 'trend', 'DPOGBJSEhl3', 'https://www.instagram.com/ahsagong0/reel/DPOGBJSEhl3/', 812000, NOW()),
('ahsagong0', 'trend', 'DNruR5DZFBZ', 'https://www.instagram.com/ahsagong0/reel/DNruR5DZFBZ/', 793000, NOW()),
('ahsagong0', 'trend', 'DQi-Pt3kjhy', 'https://www.instagram.com/ahsagong0/reel/DQi-Pt3kjhy/', 788000, NOW()),
('ahsagong0', 'trend', 'DQBpMIQkgOG', 'https://www.instagram.com/ahsagong0/reel/DQBpMIQkgOG/', 735000, NOW()),

-- sarah_x_life (trend)
('sarah_x_life', 'trend', 'DM7kOkHJu_a', 'https://www.instagram.com/milk._.couple/reel/DM7kOkHJu_a/', 3000000, NOW()),
('sarah_x_life', 'trend', 'DSCk1hHEw9S', 'https://www.instagram.com/milk._.couple/reel/DSCk1hHEw9S/', 2600000, NOW()),
('sarah_x_life', 'trend', 'DRb_T1NktLn', 'https://www.instagram.com/milk._.couple/reel/DRb_T1NktLn/', 2100000, NOW()),
('sarah_x_life', 'trend', 'DNVWI4JJcaD', 'https://www.instagram.com/milk._.couple/reel/DNVWI4JJcaD/', 1800000, NOW()),
('sarah_x_life', 'trend', 'DM-IU5eppnj', 'https://www.instagram.com/milk._.couple/reel/DM-IU5eppnj/', 1500000, NOW()),
('sarah_x_life', 'trend', 'DQ_onaRkpYb', 'https://www.instagram.com/milk._.couple/reel/DQ_onaRkpYb/', 1300000, NOW()),
('sarah_x_life', 'trend', 'DRUP5DbElME', 'https://www.instagram.com/milk._.couple/reel/DRUP5DbElME/', 661000, NOW()),
('sarah_x_life', 'trend', 'DSmo7wIk8Hy', 'https://www.instagram.com/milk._.couple/reel/DSmo7wIk8Hy/', 579000, NOW()),
('sarah_x_life', 'trend', 'DSw7LpbE09N', 'https://www.instagram.com/milk._.couple/reel/DSw7LpbE09N/', 496000, NOW()),
('sarah_x_life', 'trend', 'DSr8GDjk2NV', 'https://www.instagram.com/milk._.couple/reel/DSr8GDjk2NV/', 415000, NOW()),

-- pm_yoonchisang (knowledge)
('pm_yoonchisang', 'knowledge', 'DLsnxDfzcyZ', 'https://www.instagram.com/pm_yoonchisang/reel/DLsnxDfzcyZ/', 1400000, NOW()),
('pm_yoonchisang', 'knowledge', 'DM1mhOoS8hA', 'https://www.instagram.com/pm_yoonchisang/reel/DM1mhOoS8hA/', 888000, NOW()),
('pm_yoonchisang', 'knowledge', 'DRM05sIEikB', 'https://www.instagram.com/pm_yoonchisang/reel/DRM05sIEikB/', 800000, NOW()),
('pm_yoonchisang', 'knowledge', 'DNTQb8dSmiq', 'https://www.instagram.com/pm_yoonchisang/reel/DNTQb8dSmiq/', 622000, NOW()),
('pm_yoonchisang', 'knowledge', 'DMvFaiqSK99', 'https://www.instagram.com/pm_yoonchisang/reel/DMvFaiqSK99/', 495000, NOW()),
('pm_yoonchisang', 'knowledge', 'DNRcr9ISPJ6', 'https://www.instagram.com/pm_yoonchisang/reel/DNRcr9ISPJ6/', 446000, NOW()),
('pm_yoonchisang', 'knowledge', 'DMRyA2bSKVi', 'https://www.instagram.com/pm_yoonchisang/reel/DMRyA2bSKVi/', 422000, NOW()),
('pm_yoonchisang', 'knowledge', 'DMsVjyvSO3V', 'https://www.instagram.com/pm_yoonchisang/reel/DMsVjyvSO3V/', 340000, NOW()),
('pm_yoonchisang', 'knowledge', 'DREWNeckock', 'https://www.instagram.com/pm_yoonchisang/reel/DREWNeckock/', 200000, NOW()),
('pm_yoonchisang', 'knowledge', 'DRZyxOrEslp', 'https://www.instagram.com/pm_yoonchisang/reel/DRZyxOrEslp/', 188000, NOW()),

-- ai.trend.kr (knowledge)
('ai.trend.kr', 'knowledge', 'DNjrcpcySLv', 'https://www.instagram.com/ai.trend.kr/reel/DNjrcpcySLv/', 3900000, NOW()),
('ai.trend.kr', 'knowledge', 'DPDzlAZjy_O', 'https://www.instagram.com/ai.trend.kr/reel/DPDzlAZjy_O/', 2400000, NOW()),
('ai.trend.kr', 'knowledge', 'DQAtfZFEvmq', 'https://www.instagram.com/ai.trend.kr/reel/DQAtfZFEvmq/', 608000, NOW()),
('ai.trend.kr', 'knowledge', 'DSYu_GDjzbb', 'https://www.instagram.com/ai.trend.kr/reel/DSYu_GDjzbb/', 377000, NOW()),
('ai.trend.kr', 'knowledge', 'DSOQkFmEisZ', 'https://www.instagram.com/ai.trend.kr/reel/DSOQkFmEisZ/', 78600, NOW()),
('ai.trend.kr', 'knowledge', 'DSWG4pWkm1l', 'https://www.instagram.com/ai.trend.kr/reel/DSWG4pWkm1l/', 70200, NOW()),
('ai.trend.kr', 'knowledge', 'DSo4IM6ka2I', 'https://www.instagram.com/ai.trend.kr/reel/DSo4IM6ka2I/', 51100, NOW()),
('ai.trend.kr', 'knowledge', 'DSdt2_DkuTA', 'https://www.instagram.com/ai.trend.kr/reel/DSdt2_DkuTA/', 44300, NOW()),
('ai.trend.kr', 'knowledge', 'DSlc9VVE80C', 'https://www.instagram.com/ai.trend.kr/reel/DSlc9VVE80C/', 42200, NOW()),
('ai.trend.kr', 'knowledge', 'DSgapcsEl_p', 'https://www.instagram.com/ai.trend.kr/reel/DSgapcsEl_p/', 32800, NOW()),

-- bambaksu_ (knowledge)
('bambaksu_', 'knowledge', 'DQEtwhbEez8', 'https://www.instagram.com/bambaksu_/reel/DQEtwhbEez8/', 1300000, NOW()),
('bambaksu_', 'knowledge', 'DPqg9f7kYKf', 'https://www.instagram.com/bambaksu_/reel/DPqg9f7kYKf/', 717000, NOW()),
('bambaksu_', 'knowledge', 'DR6z6wQEcsr', 'https://www.instagram.com/bambaksu_/reel/DR6z6wQEcsr/', 649000, NOW()),
('bambaksu_', 'knowledge', 'DN-yPjYEdsk', 'https://www.instagram.com/bambaksu_/reel/DN-yPjYEdsk/', 172000, NOW()),
('bambaksu_', 'knowledge', 'DLpSu6uxCW8', 'https://www.instagram.com/bambaksu_/reel/DLpSu6uxCW8/', 102000, NOW()),
('bambaksu_', 'knowledge', 'DRimrPek06o', 'https://www.instagram.com/bambaksu_/reel/DRimrPek06o/', 34200, NOW()),
('bambaksu_', 'knowledge', 'DM5HFBvxhys', 'https://www.instagram.com/bambaksu_/reel/DM5HFBvxhys/', 29500, NOW()),
('bambaksu_', 'knowledge', 'DOky4QPEepZ', 'https://www.instagram.com/bambaksu_/reel/DOky4QPEepZ/', 29200, NOW()),
('bambaksu_', 'knowledge', 'DNk7huCRWIm', 'https://www.instagram.com/bambaksu_/reel/DNk7huCRWIm/', 28500, NOW()),
('bambaksu_', 'knowledge', 'DQ0oM-GkWUE', 'https://www.instagram.com/bambaksu_/reel/DQ0oM-GkWUE/', 25300, NOW()),

-- itshailey__quinn (knowledge)
('itshailey__quinn', 'knowledge', 'DPdmdH_Ex2K', 'https://www.instagram.com/itshailey__quinn/reel/DPdmdH_Ex2K/', 1800000, NOW()),
('itshailey__quinn', 'knowledge', 'DO3F4yTE2Do', 'https://www.instagram.com/itshailey__quinn/reel/DO3F4yTE2Do/', 657000, NOW()),
('itshailey__quinn', 'knowledge', 'DR4F8tgk492', 'https://www.instagram.com/itshailey__quinn/reel/DR4F8tgk492/', 652000, NOW()),
('itshailey__quinn', 'knowledge', 'DRg_eeLkxlT', 'https://www.instagram.com/itshailey__quinn/reel/DRg_eeLkxlT/', 487000, NOW()),
('itshailey__quinn', 'knowledge', 'DQY0Vkpk8am', 'https://www.instagram.com/itshailey__quinn/reel/DQY0Vkpk8am/', 368000, NOW()),
('itshailey__quinn', 'knowledge', 'DRMVADvk7dj', 'https://www.instagram.com/itshailey__quinn/reel/DRMVADvk7dj/', 287000, NOW()),
('itshailey__quinn', 'knowledge', 'DP0xauhE8R6', 'https://www.instagram.com/itshailey__quinn/reel/DP0xauhE8R6/', 226000, NOW()),
('itshailey__quinn', 'knowledge', 'DOvPRrak1qH', 'https://www.instagram.com/itshailey__quinn/reel/DOvPRrak1qH/', 198000, NOW()),
('itshailey__quinn', 'knowledge', 'DR1fm-Jk9mq', 'https://www.instagram.com/itshailey__quinn/reel/DR1fm-Jk9mq/', 187000, NOW()),
('itshailey__quinn', 'knowledge', 'DNpzz7eT8xf', 'https://www.instagram.com/itshailey__quinn/reel/DNpzz7eT8xf/', 186000, NOW()),

-- university_.on (knowledge)
('university_.on', 'knowledge', 'DM7eg4BynMz', 'https://www.instagram.com/university_.on/reel/DM7eg4BynMz/', 3600000, NOW()),
('university_.on', 'knowledge', 'DNxlQVfZFT1', 'https://www.instagram.com/university_.on/reel/DNxlQVfZFT1/', 2400000, NOW()),
('university_.on', 'knowledge', 'DRwdvWAEg1i', 'https://www.instagram.com/university_.on/reel/DRwdvWAEg1i/', 1800000, NOW()),
('university_.on', 'knowledge', 'DSwxhiNkvcx', 'https://www.instagram.com/university_.on/reel/DSwxhiNkvcx/', 1000000, NOW()),
('university_.on', 'knowledge', 'DNFzN5nyndL', 'https://www.instagram.com/university_.on/reel/DNFzN5nyndL/', 982000, NOW()),
('university_.on', 'knowledge', 'DSe0rrCEtue', 'https://www.instagram.com/university_.on/reel/DSe0rrCEtue/', 587000, NOW()),
('university_.on', 'knowledge', 'DSkCozSEs8B', 'https://www.instagram.com/university_.on/reel/DSkCozSEs8B/', 555000, NOW()),
('university_.on', 'knowledge', 'DOaywaHEpup', 'https://www.instagram.com/university_.on/reel/DOaywaHEpup/', 517000, NOW()),
('university_.on', 'knowledge', 'DQRNOP1krGS', 'https://www.instagram.com/university_.on/reel/DQRNOP1krGS/', 401000, NOW()),
('university_.on', 'knowledge', 'DSuNX01EsgA', 'https://www.instagram.com/university_.on/reel/DSuNX01EsgA/', 371000, NOW()),

-- chisatogourmet (review)
('chisatogourmet', 'review', 'DRUHsvpEQRj', 'https://www.instagram.com/chisatogourmet/reel/DRUHsvpEQRj/', 325000, NOW()),
('chisatogourmet', 'review', 'DRwcdd7EWw4', 'https://www.instagram.com/chisatogourmet/reel/DRwcdd7EWw4/', 320000, NOW()),
('chisatogourmet', 'review', 'DQoWNyJkT81', 'https://www.instagram.com/chisatogourmet/reel/DQoWNyJkT81/', 266000, NOW()),
('chisatogourmet', 'review', 'DN2rV1H4jm4', 'https://www.instagram.com/chisatogourmet/reel/DN2rV1H4jm4/', 209000, NOW()),
('chisatogourmet', 'review', 'DRrS3gKkfBN', 'https://www.instagram.com/chisatogourmet/reel/DRrS3gKkfBN/', 185000, NOW()),
('chisatogourmet', 'review', 'DR6vmLBkQ8X', 'https://www.instagram.com/chisatogourmet/reel/DR6vmLBkQ8X/', 158000, NOW()),
('chisatogourmet', 'review', 'DSUfoD0EXkk', 'https://www.instagram.com/chisatogourmet/reel/DSUfoD0EXkk/', 139000, NOW()),
('chisatogourmet', 'review', 'DSw0XyokUR-', 'https://www.instagram.com/chisatogourmet/reel/DSw0XyokUR-/', 134000, NOW()),
('chisatogourmet', 'review', 'DShXgQnEZBu', 'https://www.instagram.com/chisatogourmet/reel/DShXgQnEZBu/', 124000, NOW()),
('chisatogourmet', 'review', 'DRzBSLVkYeR', 'https://www.instagram.com/chisatogourmet/reel/DRzBSLVkYeR/', 122000, NOW()),

-- kimcoffee_c (review)
('kimcoffee_c', 'review', 'DNuBHPgZMgS', 'https://www.instagram.com/kimcoffee_c/reel/DNuBHPgZMgS/', 1500000, NOW()),
('kimcoffee_c', 'review', 'DRnzRJdEnef', 'https://www.instagram.com/kimcoffee_c/reel/DRnzRJdEnef/', 491000, NOW()),
('kimcoffee_c', 'review', 'DQ-otaAj2C8', 'https://www.instagram.com/kimcoffee_c/reel/DQ-otaAj2C8/', 222000, NOW()),
('kimcoffee_c', 'review', 'DQVdBOpj8aw', 'https://www.instagram.com/kimcoffee_c/reel/DQVdBOpj8aw/', 162000, NOW()),
('kimcoffee_c', 'review', 'DSJSKSuElUk', 'https://www.instagram.com/kimcoffee_c/reel/DSJSKSuElUk/', 124000, NOW()),
('kimcoffee_c', 'review', 'DRioZT3kovb', 'https://www.instagram.com/kimcoffee_c/reel/DRioZT3kovb/', 86200, NOW()),
('kimcoffee_c', 'review', 'DROCWFUkou9', 'https://www.instagram.com/kimcoffee_c/reel/DROCWFUkou9/', 72600, NOW()),
('kimcoffee_c', 'review', 'DQQPICVknfL', 'https://www.instagram.com/kimcoffee_c/reel/DQQPICVknfL/', 61800, NOW()),
('kimcoffee_c', 'review', 'DSOac6FEiDD', 'https://www.instagram.com/kimcoffee_c/reel/DSOac6FEiDD/', 30300, NOW()),
('kimcoffee_c', 'review', 'DQfsx35ksq9', 'https://www.instagram.com/kimcoffee_c/reel/DQfsx35ksq9/', 30100, NOW()),

-- j_yeon_food (review)
('j_yeon_food', 'review', 'DSToHKpkyjM', 'https://www.instagram.com/j_yeon_food/reel/DSToHKpkyjM/', 450000, NOW()),
('j_yeon_food', 'review', 'DOkskWBk83P', 'https://www.instagram.com/j_yeon_food/reel/DOkskWBk83P/', 294000, NOW()),
('j_yeon_food', 'review', 'DSmJm5Pkzsx', 'https://www.instagram.com/j_yeon_food/reel/DSmJm5Pkzsx/', 215000, NOW()),
('j_yeon_food', 'review', 'DSotOHgE10g', 'https://www.instagram.com/j_yeon_food/reel/DSotOHgE10g/', 206000, NOW()),
('j_yeon_food', 'review', 'DSJ6a0UE5z-', 'https://www.instagram.com/j_yeon_food/reel/DSJ6a0UE5z-/', 193000, NOW()),
('j_yeon_food', 'review', 'DSB1L0pk4PO', 'https://www.instagram.com/j_yeon_food/reel/DSB1L0pk4PO/', 156000, NOW()),
('j_yeon_food', 'review', 'DSW4hekE5ED', 'https://www.instagram.com/j_yeon_food/reel/DSW4hekE5ED/', 126000, NOW()),
('j_yeon_food', 'review', 'DR6ZXpVE8JO', 'https://www.instagram.com/j_yeon_food/reel/DR6ZXpVE8JO/', 124000, NOW()),
('j_yeon_food', 'review', 'DSMVc--kx86', 'https://www.instagram.com/j_yeon_food/reel/DSMVc--kx86/', 122000, NOW()),
('j_yeon_food', 'review', 'DSE067rk1YQ', 'https://www.instagram.com/j_yeon_food/reel/DSE067rk1YQ/', 116000, NOW()),

-- sugartokiee (review)
('sugartokiee', 'review', 'DShs0f-idEN', 'https://www.instagram.com/sugartokiee/reel/DShs0f-idEN/', 425000, NOW()),
('sugartokiee', 'review', 'DQ3nHfxifVi', 'https://www.instagram.com/sugartokiee/reel/DQ3nHfxifVi/', 246000, NOW()),
('sugartokiee', 'review', 'DSXOMedCeq0', 'https://www.instagram.com/sugartokiee/reel/DSXOMedCeq0/', 194000, NOW()),
('sugartokiee', 'review', 'DRl1vRUCZtw', 'https://www.instagram.com/sugartokiee/reel/DRl1vRUCZtw/', 183000, NOW()),
('sugartokiee', 'review', 'DSZdIHYif6c', 'https://www.instagram.com/sugartokiee/reel/DSZdIHYif6c/', 178000, NOW()),
('sugartokiee', 'review', 'DSl5MoqkjaY', 'https://www.instagram.com/sugartokiee/reel/DSl5MoqkjaY/', 165000, NOW()),
('sugartokiee', 'review', 'DSw92YRCcg-', 'https://www.instagram.com/sugartokiee/reel/DSw92YRCcg-/', 164000, NOW()),
('sugartokiee', 'review', 'DSrWP1YiYeX', 'https://www.instagram.com/sugartokiee/reel/DSrWP1YiYeX/', 160000, NOW()),
('sugartokiee', 'review', 'DSbywq_iWIz', 'https://www.instagram.com/sugartokiee/reel/DSbywq_iWIz/', 148000, NOW()),
('sugartokiee', 'review', 'DSpG-Sbibev', 'https://www.instagram.com/sugartokiee/reel/DSpG-Sbibev/', 146000, NOW()),

-- coffeegomi (review)
('coffeegomi', 'review', 'C4zyhjqu9Xj', 'https://www.instagram.com/coffeegomi/reel/C4zyhjqu9Xj/', 10600000, NOW()),
('coffeegomi', 'review', 'C8_nOqNufBC', 'https://www.instagram.com/coffeegomi/reel/C8_nOqNufBC/', 8900000, NOW()),
('coffeegomi', 'review', 'DR9JnhskpRt', 'https://www.instagram.com/coffeegomi/reel/DR9JnhskpRt/', 4100000, NOW()),
('coffeegomi', 'review', 'DSzl53hkrvI', 'https://www.instagram.com/coffeegomi/reel/DSzl53hkrvI/', 2400000, NOW()),
('coffeegomi', 'review', 'DSRx-L9EpDC', 'https://www.instagram.com/coffeegomi/reel/DSRx-L9EpDC/', 1200000, NOW()),
('coffeegomi', 'review', 'DR4J_rbEiWJ', 'https://www.instagram.com/coffeegomi/reel/DR4J_rbEiWJ/', 923000, NOW()),
('coffeegomi', 'review', 'DR6n5p8EhMo', 'https://www.instagram.com/coffeegomi/reel/DR6n5p8EhMo/', 754000, NOW()),
('coffeegomi', 'review', 'DSJ-jHvErpY', 'https://www.instagram.com/coffeegomi/reel/DSJ-jHvErpY/', 706000, NOW()),
('coffeegomi', 'review', 'DSFLKP_kqe8', 'https://www.instagram.com/coffeegomi/reel/DSFLKP_kqe8/', 509000, NOW()),
('coffeegomi', 'review', 'DSrwVsMks0U', 'https://www.instagram.com/coffeegomi/reel/DSrwVsMks0U/', 493000, NOW())

ON CONFLICT (shortcode) 
DO UPDATE SET
  account = EXCLUDED.account,
  category = EXCLUDED.category,
  url = EXCLUDED.url,
  views = EXCLUDED.views,
  updated_at = EXCLUDED.updated_at;

