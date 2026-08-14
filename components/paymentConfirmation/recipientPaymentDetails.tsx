"use client";

import { useEffect, useState, useRef } from "react";
import MatterCart1Store, {
  FormData as MatterFormData,
} from "@/store/matterCart1Store";
import useAuthStore from "@/store/authStore";
import useProductsByLocationStore from "@/store/productsByLocationStore";
import useLocation from "@/hooks/locationRequests/useLocation";
import { cart1Schema } from "@/validations/cart1Schema";
import cartStore from "@/store/cartStore";
import { useStore } from "zustand";
import ModalRecipientPaymentDetails from "../modal/modalRecipientPaymentDetails/modalRecipientPaymentDetails";
import ModalPaymentDetails from "../modal/modalPaymentDetails/modalPaymentDetails";

export default function RecipientPaymentDetails() {
  const { formData } = MatterCart1Store();
  const { auth } = useAuthStore();
  const person = auth?.person;
  const beneficiaryFirstName = formData.delivery
    ? formData.firstName
    : person?.name || "";
  const beneficiaryLastNames = formData.delivery
    ? `${formData.lastName1} ${formData.lastName2}`.trim()
    : `${person?.lastname1 ?? ""} ${person?.lastname2 ?? ""}`.trim();
  const beneficiaryPhone =
    formData.delivery && formData.phone
      ? formData.phone
      : person?.cellphone1 || "------";

  const [showModal, setShowModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isClient, setIsClient] = useState(false);

  const {
    province: storeProvince,
    municipality: storeMunicipality,
    municipalityId: storeMunicipalityId,
  } = useProductsByLocationStore();

  const {
    municipalities: baseMunicipalities,
    handleMunicipalityChange,
    openMunicipalities,
    setOpenMunicipalities,
    municipalitiesRef,
  } = useLocation();

  const rawCart = useStore(cartStore, (state) => (state as any).rawCart);

  const [editData, setEditData] = useState<MatterFormData>({ ...formData });
  const [initialDelivery, setInitialDelivery] = useState(formData.delivery);
  const [lastNameInput, setLastNameInput] = useState(
    `${formData.lastName1 || ""} ${formData.lastName2 || ""}`.trim(),
  );

  const [errors, setErrors] = useState<
    Partial<Record<keyof typeof editData, string>>
  >({});

  const FIELD_ORDER: (keyof typeof editData)[] = [
    "firstName",
    "lastName1",
    "lastName2",
    "province",
    "municipality",
    "phone",
    "address",
  ];

  const [deliveryPrice, setDeliveryPrice] = useState(0);
  const modalRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!showModal) {
      setEditData({ ...formData });
      setLastNameInput(
        `${formData.lastName1 || ""} ${formData.lastName2 || ""}`.trim(),
      );
    }
  }, [formData, showModal]);

  useEffect(() => {
    if (
      editData.delivery &&
      storeMunicipalityId &&
      rawCart &&
      Array.isArray(rawCart)
    ) {
      let totalDelivery = 0;
      rawCart.forEach((tienda: any) => {
        const domicilio = tienda.domicilios?.find(
          (d: any) => String(d.id_municipio) === String(storeMunicipalityId),
        );
        if (domicilio) {
          totalDelivery += Number(domicilio.price) || 0;
        }
      });
      setDeliveryPrice(totalDelivery);
    } else {
      setDeliveryPrice(0);
    }
  }, [editData.delivery, storeMunicipalityId, rawCart]);

  const activeStoreIds = Array.from(
    new Set(
      (rawCart || [])
        .flatMap((tienda: any) =>
          Array.isArray(tienda.products)
            ? tienda.products.map((p: any) => p.tiendaId)
            : [],
        )
        .filter((id: string | number | null | undefined) => id != null),
    ),
  );

  const deliveryStores =
    Array.isArray(rawCart) && activeStoreIds.length > 0
      ? rawCart.filter(
          (tienda: any) =>
            activeStoreIds.includes(tienda.id) &&
            Array.isArray(tienda.domicilios) &&
            tienda.domicilios.length > 0,
        )
      : [];

  const municipalitiesWithCommonDelivery =
    deliveryStores.length > 0
      ? baseMunicipalities.filter((mun) =>
          deliveryStores.every((tienda: any) =>
            tienda.domicilios.some((d: any) => String(d.id_municipio) === String(mun.id)),
          ),
        )
      : baseMunicipalities;

  useEffect(() => {
    if (isClient && municipalitiesWithCommonDelivery.length > 0) {
      const isCurrentValid = municipalitiesWithCommonDelivery.some(
        (m) => m.municipio === editData.municipality,
      );

      if (!editData.municipality || !isCurrentValid) {
        const defaultMun = municipalitiesWithCommonDelivery[0];
        setEditData((prev) => ({
          ...prev,
          municipality: defaultMun.municipio,
        }));
        handleMunicipalityChange(defaultMun);
      }
    }
  }, [
    isClient,
    municipalitiesWithCommonDelivery,
    editData.municipality,
    handleMunicipalityChange,
  ]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        setOpenMunicipalities(false);
      }
    }

    if (showModal) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showModal, setOpenMunicipalities]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;

    if (name === "lastName") {
      setLastNameInput(value);

      const names = value.trim().split(/\s+/).filter(Boolean);
      const lastName1 = names[0] || "";
      const lastName2 = names.slice(1).join(" ") || "";

      setEditData((prev) => ({
        ...prev,
        lastName1,
        lastName2,
      }));

      if (errors.lastName1) {
        setErrors((prev) => ({ ...prev, lastName1: undefined }));
      }
      if (errors.lastName2) {
        setErrors((prev) => ({ ...prev, lastName2: undefined }));
      }
      return;
    }

    setEditData((prev) => ({ ...prev, [name]: value }));
    const fieldName = name as keyof typeof editData;
    if (errors[fieldName]) {
      setErrors((prev) => ({ ...prev, [fieldName]: undefined }));
    }
  };

  const handlePhoneChange = (value: string) => {
    setEditData((prev) => ({ ...prev, phone: value }));
    if (errors.phone) {
      setErrors((prev) => ({ ...prev, phone: undefined }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const result = cart1Schema.safeParse(editData);

    if (!result.success) {
      const fieldErrors: Partial<Record<keyof typeof editData, string>> = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof typeof editData;
        fieldErrors[field] = issue.message;
      });
      setErrors(fieldErrors);

      const firstErrorField = FIELD_ORDER.find((field) => fieldErrors[field]);
      if (firstErrorField) {
        const elementId =
          firstErrorField === "lastName1" || firstErrorField === "lastName2"
            ? "modal-field-lastName"
            : `modal-field-${firstErrorField}`;

        const element = document.getElementById(elementId);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }
      return;
    }

    const deliveryChanged = initialDelivery !== editData.delivery;

    MatterCart1Store.getState().setFormData({
      ...MatterCart1Store.getState().formData,
      ...editData,
      deliveryPrice,
    });

    setShowModal(false);

    if (deliveryChanged) {
      setShowPaymentModal(true);
    }
  };

  return (
    <div className="w-full    wrap-break-word">
      <div>
        <h5 className="text-primary font-bold text-xl ml-4 pb-1">
          DATOS DE ENTREGA
        </h5>
        <div className="w-full  border-b-2 border-gray"></div>
      </div>

      <div className="space-y-3 mt-4 ">
        <div className="ml-4">
          <p className="text-[gray] ">
            Método de entrega:{" "}
            <span className="text-primary wrap-break-word">
              {formData.delivery ? "Domicilio" : "Recogida en tienda"}
            </span>
          </p>
        </div>

        <div className="w-full bg-[#F5F7FA] ">
          <p className="ml-4 text-primary">Datos de beneficiario</p>
        </div>

        <div className="ml-4">
          <p className="text-[gray] ">
            Nombre:{" "}
            <span className="text-primary wrap-break-word">
              {beneficiaryFirstName}
            </span>
          </p>
        </div>

        <div className="ml-4">
          <p className="text-[gray] ">
            Apellidos:{" "}
            <span className="text-primary wrap-break-word">
              {beneficiaryLastNames}
            </span>
          </p>
        </div>

        {!beneficiaryPhone.startsWith("-") && (
          <div className="ml-4">
            <p className="text-[gray] ">
              Teléfono:{" "}
              <span className="text-primary wrap-break-word">
                {beneficiaryPhone}
              </span>
            </p>
          </div>
        )}

        <div className="w-full bg-[#F5F7FA] ">
          <p className="ml-4 text-primary">Dirección de entrega</p>
        </div>

        {formData.delivery ? (
          <>
            <div className="ml-4">
              <p className="text-[gray] ">
                Provincia:{" "}
                <span className="text-primary wrap-break-word">
                  {formData.province}
                </span>
              </p>
            </div>

            <div className="ml-4">
              <p className="text-[gray] ">
                Municipio:{" "}
                <span className="text-primary wrap-break-word">
                  {formData.municipality}
                </span>
              </p>
            </div>

            <div className="ml-4">
              <p className="text-[gray] ">
                Dirección:
                <span className="text-primary wrap-break-word">
                  {formData.address}
                </span>
              </p>
            </div>
          </>
        ) : (
          formData.stores?.map((store, index) => (
            <div key={index} className="ml-4 space-y-1">
              <p className="text-[gray]">
                Tienda:{" "}
                <span className="text-primary wrap-break-word">
                  {store.name}
                </span>
              </p>
              <p className="text-[gray]">
                Dirección:{" "}
                <span className="text-primary wrap-break-word">
                  {store.direccion}
                </span>
              </p>
            </div>
          ))
        )}

        {formData.note && (
          <div className="ml-4">
            <p className="text-[gray] ">
              Nota:{" "}
              <span className="text-primary wrap-break-word">
                {formData.note}
              </span>
            </p>
          </div>
        )}

        <div className="w-full  border-b-2 border-gray"></div>

        <div className="ml-4">
          <p
            className="text-accent cursor-pointer"
            onClick={() => {
              setInitialDelivery(editData.delivery);
              setShowModal(true);
            }}
          >
            Editar datos de entrega
          </p>
        </div>
      </div>

      <div>
        <ModalRecipientPaymentDetails
          show={showModal}
          onClose={() => setShowModal(false)}
          editData={editData}
          setEditData={setEditData}
          errors={errors}
          setErrors={setErrors}
          isClient={isClient}
          storeProvince={storeProvince}
          municipalitiesWithCommonDelivery={municipalitiesWithCommonDelivery}
          municipalitiesRef={municipalitiesRef}
          openMunicipalities={openMunicipalities}
          setOpenMunicipalities={setOpenMunicipalities}
          handleMunicipalityChange={handleMunicipalityChange}
          handlePhoneChange={handlePhoneChange}
          handleInputChange={handleInputChange}
          lastNameInput={lastNameInput}
          setLastNameInput={setLastNameInput}
          handleSubmit={handleSubmit}
        />
      </div>

      <div >
        <ModalPaymentDetails
          show={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
        />
      </div>

    </div>
  );
}
