"use client";

import { useState } from "react";
import Link from "next/link";
import ModalLegal from "@/components/modal/modalLegal/modalLegal";
import { privacyPolicy } from "@/data/privacyPolicy";
import { termsConditions } from "@/data/termsConditions";
import {
  FacebookIcon,
  InstagramIcon,
  TikTokIcon,
  WhatsAppIcon,
  LocationIcon,
  EmailIcon,
} from "@/icons/icons";

export default function Footer() {
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);

  return (
    <footer className="bg-primary text-white p-10 w-full  mt-20 xl:mt-30">
      <div className="flex flex-col md:flex-row md:items-stretch justify-start md:justify-around gap-8 w-full">
        <div className="flex flex-col justify-between">
          <div>
            <img src="/images/logoWhite.svg" alt="logo" className="w-40 h-20" />
          </div>
          <div className="hidden md:block">
            <p>© 2026 Grupo Fadiar. Todos los derechos reservados.</p>
          </div>
        </div>

        <div className="flex flex-col justify-between mt-4 md:mt-0">
          <div className="space-y-6">
            <h4 className="text-2xl ">Enlaces</h4>

            <button
              onClick={() => setIsTermsModalOpen(true)}
              className="text-gray-300 hover:text-accent transition-colors block text-left cursor-pointer"
            >
              Términos y Condiciones
            </button>

            <button
              onClick={() => setIsPrivacyModalOpen(true)}
              className="text-gray-300 hover:text-accent transition-colors cursor-pointer text-left"
            >
              Política de Privacidad
            </button>
          </div>

          <div className="flex gap-4 mt-8 md:mt-12">
            <Link
              href="https://www.facebook.com/share/1DmQHQBWvG/?mibextid=wwXIfr"
              target="_blank"
              className="hover:scale-110 transition-transform"
            >
              <FacebookIcon width={32} height={32} />
            </Link>
            <Link
              href="https://www.instagram.com/grupo_fadiar?igsh=eTE5YTduNjN4NW1v&utm_source=qr"
              target="_blank"
              className="hover:scale-110 transition-transform"
            >
              <InstagramIcon width={32} height={32} />
            </Link>
        
        
          </div>
        </div>

        <div className="flex flex-col justify-between mt-12 md:mt-0">
          <div className="space-y-6">
            <h4 className="text-2xl">Contáctenos</h4>

            <div className="flex items-start gap-3">
              <LocationIcon
                width={24}
                height={24}
                className="text-accent shrink-0 mt-1"
              />
              <div>
                <p className="text-gray-300">
                  Calle 29F entre 114 y 114A, Edificio 11413,
                </p>
                <p className="text-gray-300">
                  Ciudad Libertad, Marianao, La Habana, Cuba
                </p>
                <p className="text-accent mt-1">Almacén 9A (ENAME)</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
               <a
                 href="https://wa.me/5363513228"
                 target="_blank"
                 className="flex items-center gap-3 text-gray-300 hover:text-accent transition-colors"
               >
                 <WhatsAppIcon width={24} height={24} className="text-accent" />
                 +53 63513228
               </a>
             </div>
           </div>
 
           <div className="flex items-center gap-3 mt-6">
             <a
               href="mailto:atencionalcliente@fadiar.com"
               className="flex items-center gap-3 text-gray-300 hover:text-accent transition-colors"
             >
               <EmailIcon width={24} height={24} className="text-accent" />
               atencionalcliente@grupofadiar.com
             </a>
           </div>

        </div>
         <div className=" mt-14 md:mt-25 text-sm md:hidden">
            <p>© 2026 Grupo Fadiar. Todos los derechos reservados.</p>
          </div>
      </div>
        
      <ModalLegal 
        isOpen={isPrivacyModalOpen} 
        onClose={() => setIsPrivacyModalOpen(false)} 
        title="Política de Privacidad"
        content={privacyPolicy}
      />

      <ModalLegal 
        isOpen={isTermsModalOpen} 
        onClose={() => setIsTermsModalOpen(false)} 
        title="Términos y Condiciones"
        content={termsConditions}
      />
    </footer>
  );
}
