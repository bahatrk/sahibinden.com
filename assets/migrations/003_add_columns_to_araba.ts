export const addCarColumnSQL = `
ALTER TABLE araba_ilanlari ADD COLUMN yil REAL;
ALTER TABLE araba_ilanlari ADD COLUMN yakitTipi TEXT;
ALTER TABLE araba_ilanlari ADD COLUMN vites TEXT;
ALTER TABLE araba_ilanlari ADD COLUMN aracDurumu TEXT;
ALTER TABLE araba_ilanlari ADD COLUMN km REAL;
ALTER TABLE araba_ilanlari ADD COLUMN motorGucu REAL;
ALTER TABLE araba_ilanlari ADD COLUMN renk TEXT;
ALTER TABLE araba_ilanlari ADD COLUMN kimden TEXT;
ALTER TABLE araba_ilanlari ADD COLUMN takas TEXT;
`;