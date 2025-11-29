export const addEmlakColumnSQL = `
ALTER TABLE emlak_ilanlari ADD COLUMN metreKareBrut REAL;
ALTER TABLE emlak_ilanlari ADD COLUMN metreKareNet REAL;
ALTER TABLE emlak_ilanlari ADD COLUMN odaSayisi TEXT;
ALTER TABLE emlak_ilanlari ADD COLUMN binaYasi REAL;
ALTER TABLE emlak_ilanlari ADD COLUMN bulunduguKat REAL;
ALTER TABLE emlak_ilanlari ADD COLUMN katSayisi REAL;
ALTER TABLE emlak_ilanlari ADD COLUMN isitma TEXT;
ALTER TABLE emlak_ilanlari ADD COLUMN asansor TEXT;
ALTER TABLE emlak_ilanlari ADD COLUMN kimden TEXT;
ALTER TABLE emlak_ilanlari ADD COLUMN takas TEXT;
`;