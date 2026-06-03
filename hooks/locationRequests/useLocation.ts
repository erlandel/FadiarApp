"use client";

import { useEffect, useState, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import useProductsByLocationStore from "@/store/productsByLocationStore";
import { get_provinces_municipalitiesUrl } from "@/urlApi/urlApi";
import { onClickOutside } from "@/utils/clickOutside";
import { ProvinceData, MunicipalityData } from "@/types/location";


const useLocation = (config?: { useGlobalStore?: boolean }) => {
  const useGlobalStore = config?.useGlobalStore ?? true;

  const {
    province,
    provinceId,
    municipality,
    municipalityId,
    setLocation,
    setProvincesVersion,
  } = useProductsByLocationStore();

  const [selectedProvince, setSelectedProvince] = useState(
    useGlobalStore ? (province || "") : ""
  );
  const [selectedProvinceId, setSelectedProvinceId] = useState<string | null>(
    useGlobalStore ? (provinceId || null) : null
  );
  const [selectedMunicipality, setSelectedMunicipality] = useState(
    useGlobalStore ? (municipality || "") : ""
  );
  const [selectedMunicipalityId, setSelectedMunicipalityId] = useState<
    string | null
  >(useGlobalStore ? (municipalityId || null) : null);
  const provincesQuery = useQuery<ProvinceData[], Error>({
    queryKey: ["provinces-municipalities"],
    queryFn: async () => {
      const res = await fetch(get_provinces_municipalitiesUrl,{
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const json = await res.json();
      console.log("respuesta municipios", json);

      //provincias

      const provinceData = Array.isArray(json) ? json : json.provincias;
      const version = json.version || null;

      if (!Array.isArray(provinceData)) {
        throw new Error("Error al cargar las provincias");
      }

      if (useGlobalStore && version) {
        setProvincesVersion(version);
      }

      return provinceData as ProvinceData[];
    },
    staleTime: Infinity,
    gcTime: Infinity,
    refetchOnWindowFocus: false,
  });
  const data = provincesQuery.data ?? [];
  const loading = provincesQuery.isLoading;
  const error = provincesQuery.error ? "Error al cargar las provincias" : null;

  const [openProvinces, setOpenProvinces] = useState(false);
  const [openMunicipalities, setOpenMunicipalities] = useState(false);

  const provincesRef = useRef<HTMLDivElement>(null);
  const municipalitiesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cleanupProvinces = onClickOutside(provincesRef, () => setOpenProvinces(false), {
      enabled: openProvinces,
    });
    const cleanupMunicipalities = onClickOutside(municipalitiesRef, () => setOpenMunicipalities(false), {
      enabled: openMunicipalities,
    });

    return () => {
      cleanupProvinces();
      cleanupMunicipalities();
    };
  }, [openProvinces, openMunicipalities]);

  useEffect(() => {
    if (!useGlobalStore) return;
    setSelectedProvince(province || "");
    setSelectedProvinceId(provinceId || null);
    setSelectedMunicipality(municipality || "");
    setSelectedMunicipalityId(municipalityId || null);
  }, [province, provinceId, municipality, municipalityId, useGlobalStore]);

  const handleProvinceChange = (
    prov: ProvinceData,
    onSelect?: (prov: ProvinceData) => void,
  ) => {
    setSelectedProvince(prov.provincia);
    setSelectedProvinceId(prov.id);
    setSelectedMunicipality("");
    setSelectedMunicipalityId(null);
    if (useGlobalStore) {
      setLocation(prov.provincia, prov.id, "", null);
    }
    if (onSelect) onSelect(prov);
  };

  const handleMunicipalityChange = (
    mun: MunicipalityData,
    onSelect?: (mun: MunicipalityData) => void,
  ) => {
    const finalProvince = selectedProvince;
    let finalProvinceId = selectedProvinceId;

    if (!finalProvinceId && finalProvince) {
      const found = data.find((p) => p.provincia === finalProvince);
      if (found) {
        finalProvinceId = found.id;
        setSelectedProvinceId(found.id);
      }
    }

    setSelectedMunicipality(mun.municipio);
    setSelectedMunicipalityId(mun.id);
    if (useGlobalStore) {
      setLocation(finalProvince, finalProvinceId ?? null, mun.municipio, mun.id);
    }
    if (onSelect) onSelect(mun);
  };

  const municipalities =
    data.find((p) => p.provincia === selectedProvince)?.municipios || [];

  return {
    data,
    loading,
    error,
    selectedProvince,
    selectedProvinceId,
    selectedMunicipality,
    selectedMunicipalityId,
    municipalities,
    handleProvinceChange,
    handleMunicipalityChange,
    setSelectedProvince,
    setSelectedProvinceId,
    setSelectedMunicipality,
    setSelectedMunicipalityId,
    openProvinces,
    setOpenProvinces,
    openMunicipalities,
    setOpenMunicipalities,
    provincesRef,
    municipalitiesRef,
  };
};

export default useLocation;

