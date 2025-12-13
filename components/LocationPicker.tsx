import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { openDb } from "../lib/database/db";

type LocationResult = {
  id: number;
  province: string;
  district: string;
};

type Props = {
  onSelect: (location: LocationResult) => void;
};

export default function LocationPicker({ onSelect }: Props) {
  const [provinces, setProvinces] = useState<any[]>([]);
  const [districts, setDistricts] = useState<any[]>([]);

  const [provinceOpen, setProvinceOpen] = useState(false);
  const [districtOpen, setDistrictOpen] = useState(false);

  const [province, setProvince] = useState<number | null>(null);
  const [district, setDistrict] = useState<number | null>(null);

  // 🔹 İLLER
  useEffect(() => {
    (async () => {
      const db = await openDb();
      const res = await db.getAllAsync(
        `SELECT id, name FROM province ORDER BY name`
      );
      setProvinces(res);
    })();
  }, []);

  // 🔥 İL DEĞİŞİNCE → İLÇELERİ YÜKLE
  useEffect(() => {
    if (!province) {
      setDistricts([]);
      setDistrict(null);
      return;
    }

    (async () => {
      const db = await openDb();
      const res = await db.getAllAsync(
        `SELECT id, name FROM district WHERE province_id = ? ORDER BY name`,
        [province]
      );
      setDistricts(res);
    })();
  }, [province]);

  // 🔥 İL + İLÇE SEÇİLİNCE → PARENT’A GÖNDER
  useEffect(() => {
    if (!province || !district) return;

    (async () => {
      const db = await openDb();

      const insertResult: any = await db.runAsync(
        `INSERT INTO location (province_id, district_id) VALUES (?, ?)`,
        [province, district]
      );

      const locationId =
        insertResult.insertId ?? insertResult.lastInsertRowId;

      const provinceName = provinces.find(p => p.id === province)?.name;
      const districtName = districts.find(d => d.id === district)?.name;

      if (!provinceName || !districtName) return;

      onSelect({
        id: locationId,
        province: provinceName,
        district: districtName,
      });
    })();
  }, [province, district]);

  return (
    <View>
      <Text>İl</Text>
      <DropDownPicker
        open={provinceOpen}
        value={province}
        items={provinces.map(p => ({ label: p.name, value: p.id }))}
        setOpen={setProvinceOpen}
        setValue={setProvince}
        placeholder="İl seç"
        zIndex={3000}
      />

      <Text style={{ marginTop: 10 }}>İlçe</Text>
      <DropDownPicker
        open={districtOpen}
        value={district}
        items={districts.map(d => ({ label: d.name, value: d.id }))}
        setOpen={setDistrictOpen}
        setValue={setDistrict}
        placeholder="İlçe seç"
        disabled={!province}
        zIndex={2000}
      />
    </View>
  );
}
